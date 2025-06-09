// teamview.js

// --- Fungsi Notifikasi (COPY DARI ADMIN.JS) ---
function showNotification(message, type = 'success') {
    const notificationArea = document.getElementById('notification-area');
    if (!notificationArea) {
        console.error('Notification area not found!');
        return;
    }

    const notificationMessage = document.createElement('div');
    notificationMessage.classList.add('notification-message', type);
    notificationMessage.innerHTML = `
        <span class="material-symbols-rounded">${type === 'success' ? 'check_circle' : (type === 'error' ? 'error' : 'info')}</span>
        <p>${message}</p>
    `;

    notificationArea.appendChild(notificationMessage);

    setTimeout(() => {
        notificationMessage.remove();
    }, 5000);
}
// --- Akhir Fungsi Notifikasi ---


document.addEventListener('DOMContentLoaded', () => {
    const backArrow = document.querySelector('.back-arrow');
    const editDescriptionBtn = document.querySelector('.edit-description-btn');
    const acceptBtns = document.querySelectorAll('.accept-btn');
    const rejectBtns = document.querySelectorAll('.reject-btn');
    const copyLinkBtn = document.querySelector('.copy-link-btn');
    const inviteLinkInput = document.getElementById('inviteLink');

    // Handle back arrow click
    if (backArrow) {
        backArrow.addEventListener('click', () => {
            history.back(); // Go back to the previous page
        });
    }

    // Handle Edit Description button
    if (editDescriptionBtn) {
        editDescriptionBtn.addEventListener('click', () => {
            showNotification('Edit description functionality coming soon!', 'info');
            // In a real app, this would open a modal or navigate to an edit page
        });
    }

    // Handle Accept/Reject Join Request buttons
    acceptBtns.forEach(button => {
        button.addEventListener('click', (event) => {
            const requestItem = event.target.closest('.request-item');
            const memberName = requestItem.querySelector('h4').textContent;
            showNotification(`Accepted ${memberName}'s join request!`, 'success');
            requestItem.remove(); // Remove the request item from the list
        });
    });

    rejectBtns.forEach(button => {
        button.addEventListener('click', (event) => {
            const requestItem = event.target.closest('.request-item');
            const memberName = requestItem.querySelector('h4').textContent;
            showNotification(`Rejected ${memberName}'s join request.`, 'error');
            requestItem.remove(); // Remove the request item from the list
        });
    });

    if (copyLinkBtn && inviteLinkInput) {
        copyLinkBtn.addEventListener('click', () => {
            inviteLinkInput.select(); // Select the text in the input
            document.execCommand('copy'); // Copy the selected text to clipboard (deprecated but works in iframe)
            showNotification('Invite link copied to clipboard!', 'success');
        });
    }
});