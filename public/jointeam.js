// joinateam.js

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
        <span class="material-symbols-rounded">${type === 'success' ? 'check_circle' : 'error'}</span>
        <p>${message}</p>
    `;

    notificationArea.appendChild(notificationMessage);

    // Hapus notifikasi setelah 5 detik (waktu disesuaikan dengan animasi fadeOut)
    setTimeout(() => {
        notificationMessage.remove();
    }, 5000); // 5000ms = 5 detik
}
// --- Akhir Fungsi Notifikasi ---


document.addEventListener("DOMContentLoaded", () => {
    // Event listener untuk tombol "Request to join"
    const requestButtons = document.querySelectorAll('.request-to-join-btn');
    requestButtons.forEach(button => {
        button.addEventListener('click', () => {
            showNotification('Request to join sent!', 'success');
            // Anda bisa menambahkan logika lain di sini, misalnya:
            // - Menonaktifkan tombol setelah diklik
            // - Mengirim data request ke server
        });
    });

    // Event listener untuk tombol "Make a team"
    const createTeamBtn = document.querySelector('.create-team-btn');
    if (createTeamBtn) {
        createTeamBtn.addEventListener('click', () => {
            showNotification('Preparing to make a new team...', 'info'); // info type not explicitly styled, defaults to primary text
            // Anda bisa mengarahkan user ke halaman pembuatan tim atau membuka modal
            // window.location.href = 'createteam.html';
        });
    }

    // Event listener untuk panah kembali (opsional, jika ingin ada fungsi back)
    const backArrow = document.querySelector('.back-arrow');
    if (backArrow) {
        backArrow.addEventListener('click', () => {
            history.back(); // Kembali ke halaman sebelumnya
        });
    }

});