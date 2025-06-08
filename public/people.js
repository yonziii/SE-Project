const contentHeaderButtons = document.querySelectorAll('.content-header button');
contentHeaderButtons.forEach(button => {
    button.addEventListener('click', () => {
        contentHeaderButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        // Here you would typically load different content based on the tab
        // For this example, it just changes the active state
    });
});
document.querySelectorAll('.friend-request-btn').forEach(button => {
    button.addEventListener('click', () => {
        button.classList.toggle('followed');
        
        if (button.classList.contains('followed')) {
            button.innerHTML = `
                <span class="material-symbols-rounded">person</span>
                Following
            `;
        } else {
            button.innerHTML = `
                <span class="material-symbols-rounded">person_add</span>
                Friend Request
            `;
        }
    });
});
document.addEventListener('DOMContentLoaded', function() {
    // Handle card clicks
    const cards = document.querySelectorAll('.person-card');
    cards.forEach(card => {
        const link = card.querySelector('.card-link');
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking the button
            if (!e.target.closest('.friend-request-btn')) {
                link.click();
            }
        });
    });
});