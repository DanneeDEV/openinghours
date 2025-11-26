console.log("Opening-hours script LOADED");

(function () {
    // 0 = Sunday, 6 = Saturday
    const schedule = {
        0: null,        // söndag stängt
        1: null,        // måndag stängt
        2: [11, 17],    // tisdag 11–17
        3: [11, 17],    // onsdag
        4: [11, 17],    // torsdag
        5: [11, 17],    // fredag
        6: [10, 14]     // lördag 10–14
    };

    const weekdayNames = [
        "söndag",
        "måndag",
        "tisdag",
        "onsdag",
        "torsdag",
        "fredag",
        "lördag"
    ];

    function findNextOpenDay(fromDay) {
        // look up to 7 days ahead
        for (let i = 1; i <= 7; i++) {
            const checkDay = (fromDay + i) % 7;
            const hours = schedule[checkDay];
            if (hours) {
                const [open, close] = hours;
                return { dayIndex: checkDay, open, close };
            }
        }
        return null;
    }

    function initOpeningHours() {
        console.log("Opening-hours init()");
        const bar = document.getElementById("openingHoursBar");
        if (!bar) {
            console.log("openingHoursBar not found");
            return;
        }

        const now = new Date();
        const day = now.getDay();
        const hour = now.getHours();

        const todays = schedule[day];

        let text = "";
        let statusClass = "";

        if (todays) {
            const [open, close] = todays;

            if (hour >= open && hour < close) {
                // ✅ ÖPPET JUST NU
                text = `Öppet just nu | ${open}:00–${close}:00`;
                statusClass = "open";

            } else if (hour < open) {
                // ✅ INNAN ÖPPNING IDAG
                text = `Vi har öppet idag mellan ${open}-${close}`;
                statusClass = "closed";

            } else {
                // ✅ DAGEN ÄR SLUT, KOLLA NÄSTA ÖPPETDAG
                const next = findNextOpenDay(day);

                if (!next) {
                    text = "Stängt | Öppettider ej tillgängliga";
                    statusClass = "closed";
                } else {
                    const { dayIndex, open: nextOpen, close: nextClose } = next;
                    const isTomorrow = dayIndex === (day + 1) % 7;

                    if (isTomorrow) {
                        // t.ex. tisdag kväll → onsdag
                        text = `Stängt för idag | Vi har öppet imorgon mellan ${nextOpen}-${nextClose}`;
                    } else {
                        // t.ex. lördag efter stängning → tisdag
                        text = `Stängt för idag | Vi öppnar igen på ${weekdayNames[dayIndex]} kl ${nextOpen}:00`;
                    }

                    statusClass = "closed";
                }
            }

        } else {
            // ✅ HELT STÄNGT IDAG (t.ex. söndag, måndag)
            const next = findNextOpenDay(day);

            if (!next) {
                text = "Stängt | Öppettider ej tillgängliga";
                statusClass = "closed";
            } else {
                const { dayIndex, open: nextOpen, close: nextClose } = next;
                const isTomorrow = dayIndex === (day + 1) % 7;

                if (isTomorrow) {
                    // måndag → tisdag
                    text = `Stängt idag | Vi har öppet imorgon mellan ${nextOpen}-${nextClose}`;
                } else {
                    // söndag → tisdag (eller annan “hoppa över flera dagar”)
                    text = `Stängt idag | Vi öppnar igen på ${weekdayNames[dayIndex]} kl ${nextOpen}:00`;
                }

                statusClass = "closed";
            }
        }

        bar.innerHTML = `
            <div class="openingBar ${statusClass}">
                ${text}
            </div>
        `;
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initOpeningHours);
    } else {
        initOpeningHours();
    }
})();


