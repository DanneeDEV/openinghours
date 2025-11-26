console.log("Opening-hours script LOADED");

(function () {
    function initOpeningHours() {
        console.log("Opening-hours init()");
        const bar = document.getElementById("openingHoursBar");
        if (!bar) {
            console.log("openingHoursBar not found");
            return;
        }

        const schedule = {
            0: null,      // Sunday closed
            1: [10, 16],  // Mon–Fri 10–16
            2: [10, 16],
            3: [10, 16],
            4: [10, 16],
            5: [10, 16],
            6: [10, 14]   // Saturday 10–14
        };

        const now = new Date();
        const day = now.getDay();
        const hour = now.getHours();

        const hours = schedule[day];

        let text = "";
        let statusClass = "";

        if (!hours) {
            text = "Stängt idag";
            statusClass = "closed";
        } else {
            const [open, close] = hours;

            if (hour >= open && hour < close) {
                text = `Öppet just nu — ${open}:00–${close}:00`;
                statusClass = "open";
            } else if (hour < open) {
                text = `Stängt — öppnar idag ${open}:00`;
                statusClass = "closed";
            } else {
                text = `Stängt — öppnar imorgon ${open}:00`;
                statusClass = "closed";
            }
        }

        bar.innerHTML = `
            <div class="openingBar ${statusClass}">
                ${text}
            </div>
        `;
    }

    // If DOM is still loading, wait. Otherwise run immediately.
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initOpeningHours);
    } else {
        initOpeningHours();
    }
})();
