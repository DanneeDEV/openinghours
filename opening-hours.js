document.addEventListener("DOMContentLoaded", () => {
    const bar = document.getElementById("openingHoursBar");
    if (!bar) return;

    const schedule = {
        0: null,           // Sunday closed
        1: [10, 16],       // Monday 10–16
        2: [10, 16],
        3: [10, 16],
        4: [10, 16],
        5: [10, 16],
        6: [10, 14]        // Saturday shorter hours
    };

    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();

    const hours = schedule[day];

    let text = "";
    let bg = "";
    let statusClass = "";

    if (!hours) {
        // Closed all day
        text = "Stängt idag";
        bg = "rgba(255, 70, 70, 0.25)";
        statusClass = "closed";
    } else {
        const open = hours[0];
        const close = hours[1];

        if (hour >= open && hour < close) {
            text = `Öppet just nu — ${open}:00–${close}:00`;
            bg = "rgba(8, 172, 84, 0.20)";
            statusClass = "open";
        } else {
            text = `Stängt — öppnar ${open}:00`;
            bg = "rgba(255, 70, 70, 0.25)";
            statusClass = "closed";
        }
    }

    bar.innerHTML = `
        <div class="openingBar ${statusClass}">
            ${text}
        </div>
    `;
});
