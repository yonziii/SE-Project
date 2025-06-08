document.addEventListener('DOMContentLoaded', function() {
    // Get all connect buttons
    const connectButtons = document.querySelectorAll('.connect-btn');
    
    // Add click event listener to each button
    connectButtons.forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-user-id');
            
            // Toggle button state
            if (this.classList.contains('connected')) {
                // Remove connection
                this.classList.remove('connected');
                this.innerHTML = '<span class="material-symbols-rounded">add</span>';
                this.style.background = 'white';
                this.style.color = 'var(--primary-color)';
            } else {
                // Add connection
                this.classList.add('connected');
                this.innerHTML = '<span class="material-symbols-rounded">check</span>';
                this.style.background = 'var(--primary-color)';
                this.style.color = 'white';
                
                // Optional: Show success message
                showNotification('Connection request sent!');
            }
        });
    });
});

// Helper function to show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}