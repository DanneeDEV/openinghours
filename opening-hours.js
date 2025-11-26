console.log("Opening-hours script LOADED");

(function () {
    function initOpeningHours() {
        console.log("Opening-hours init()");
        const bar = document.getElementById("openingHoursBar");
        if (!bar) {
            console.log("openingHoursBar not found");
            return;
        }

        // 0 = Sunday, 6 = Saturday
        const schedule = {
            0: null,       // Sunday closed
            1: null,       // Monday closed
            2: [11, 17],   // Tuesday 11–17
            3: [11, 17],   // Wednesday
            4: [11, 17],   // Thursday
            5: [11, 17],   // Friday
            6: [10, 14]    // Saturday 10–14
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

        const now = new Date();
        const day = now.getDay();
        const hour = now.getHours();

        const todaysHours = schedule[day];

        function findNextOpenDay(fromDay) {
            // look up to 7 days ahead
            for (let i = 1; i <= 7; i++) {
                const checkDay = (fromDay + i) % 7;
                const hours = schedule[checkDay];
                if (hours) {
                    return { dayIndex: checkDay, openHour: hours[0] };
                }
            }
            return null; // no opening found (shouldn't happen here)
        }

        let text = "";
        let statusClass = "";

        if (todaysHours && hour >= todaysHours[0] && hour < todaysHours[1]) {
            // Open right now
            const [open, close] = todaysHours;
            text = `Öppet just nu — ${open}:00–${close}:00`;
            statusClass = "open";
        } else if (todaysHours && hour < todaysHours[0]) {
            // Closed now, but opens later today
            const [open] = todaysHours;
            text = `Stängt — öppnar idag ${open}:00`;
            statusClass = "closed";
        } else {
            // Either:
            // - today is fully closed (todaysHours == null)
            // - or we've passed today's closing time
            const next = findNextOpenDay(day);

            if (!next) {
                text = "Stängt — öppettider ej tillgängliga";
                statusClass = "closed";
            } else {
                const { dayIndex, openHour } = next;
                const isTomorrow = dayIndex === (day + 1) % 7;

                let dayText;
                if (isTomorrow) {
                    dayText = "imorgon";
                } else {
                    dayText = `på ${weekdayNames[dayIndex]}`;
                }

                text = `Stängt — öppnar ${dayText} ${openHour}:00`;
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


