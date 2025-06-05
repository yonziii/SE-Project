function generateCalendar() {
    const date = new Date();
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const calendarDates = document.querySelector('.calendar-dates');
    calendarDates.innerHTML = '';

    // Events data (you can modify this based on your needs)
    const events = [10, 13, 20, 24, 25, 26]; // Days with events

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
        const emptyDate = document.createElement('div');
        emptyDate.className = 'date empty';
        calendarDates.appendChild(emptyDate);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dateDiv = document.createElement('div');
        dateDiv.className = 'date';
        dateDiv.textContent = day;

        // Add today class
        if (day === date.getDate() && currentMonth === date.getMonth()) {
            dateDiv.classList.add('today');
        }

        // Add event indicator
        if (events.includes(day)) {
            dateDiv.classList.add('has-event');
        }

        calendarDates.appendChild(dateDiv);
    }
}

// Initialize calendar
document.addEventListener('DOMContentLoaded', generateCalendar);

// Add month navigation
document.querySelector('.prev-month').addEventListener('click', () => {
    // Add previous month logic
});

document.querySelector('.next-month').addEventListener('click', () => {
    // Add next month logic
});
