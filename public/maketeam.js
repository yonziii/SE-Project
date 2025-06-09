// createteam.js

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
    const teamAvatarInput = document.getElementById('teamAvatarInput');
    const teamAvatarPreview = document.getElementById('teamAvatarPreview');
    const cameraPlaceholder = document.querySelector('.camera-placeholder'); // Mendapatkan placeholder ikon kamera
    const makeTeamBtn = document.querySelector('.make-team-btn');
    const backArrow = document.querySelector('.back-arrow');

    // Handle team avatar upload
    if (teamAvatarInput && teamAvatarPreview && cameraPlaceholder) {
        teamAvatarInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    teamAvatarPreview.src = e.target.result;
                    teamAvatarPreview.classList.remove('hidden-preview'); // Tampilkan gambar preview
                    cameraPlaceholder.style.display = 'none'; // Sembunyikan ikon kamera placeholder
                };
                reader.readAsDataURL(file);
                showNotification('Team avatar selected!', 'success');
            } else {
                teamAvatarPreview.src = ''; // Kosongkan src jika tidak ada file
                teamAvatarPreview.classList.add('hidden-preview'); // Sembunyikan gambar preview
                cameraPlaceholder.style.display = 'flex'; // Tampilkan ikon kamera placeholder
            }
        });
    }

    // Inisialisasi awal: pastikan ikon kamera terlihat jika tidak ada gambar
    if (!teamAvatarPreview.src || teamAvatarPreview.src.includes('placehold.co')) { // Cek jika src kosong atau masih placeholder
        teamAvatarPreview.classList.add('hidden-preview');
        if(cameraPlaceholder) cameraPlaceholder.style.display = 'flex';
    } else {
        if(cameraPlaceholder) cameraPlaceholder.style.display = 'none';
        teamAvatarPreview.classList.remove('hidden-preview');
    }


    // Handle "Make a team" button click
    if (makeTeamBtn) {
        makeTeamBtn.addEventListener('click', () => {
            const teamName = document.getElementById('teamName').value;
            const description = document.getElementById('description').value;
            const participant = document.getElementById('participant').value;
            const allowRequests = document.getElementById('allowRequests').checked;

            if (!teamName || !description || !participant) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }

            // Simulate team creation
            showNotification(`Team "${teamName}" created successfully!`, 'success');
            console.log({ teamName, description, participant, allowRequests });

            // Redirect or show team details (example)
            // setTimeout(() => {
            //     window.location.href = `teamview.html?name=${encodeURIComponent(teamName)}&desc=${encodeURIComponent(description)}`;
            // }, 1000);
        });
    }

    // Handle back arrow click
    if (backArrow) {
        backArrow.addEventListener('click', () => {
            history.back(); // Go back to the previous page
        });
    }
});