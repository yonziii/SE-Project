// admincompetitions.js

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
const statusTabs = document.querySelectorAll(".status-tabs .tab");
    const competitionBody = document.getElementById("competition-body");
    const searchTableInput = document.querySelector(".table-search-bar input");

    // Fetch competitions from backend and render
    async function loadCompetitions() {
        try {
            const res = await fetch('/api/competitions');
            const competitions = await res.json();

            // Clear existing rows
            competitionBody.innerHTML = '';

            competitions.forEach(comp => {
                const tr = document.createElement('tr');
                tr.setAttribute('data-status', comp.status);

                // Format date/time
                const createdAt = new Date(comp.createdAt || comp.created_at);
                const dateStr = createdAt.toLocaleDateString('en-GB') + ' - ' +
                                createdAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

                // Format start/end dates
                const startDate = new Date(comp.start_date).toLocaleDateString('en-GB');
                const endDate = new Date(comp.end_date).toLocaleDateString('en-GB');

                // Organizer avatar (placeholder if not available)
                const avatarUrl = `https://i.pravatar.cc/30?u=${encodeURIComponent(comp.organizer_name || 'user')}`;

                tr.innerHTML = `
                    <td><input type="checkbox" /></td>
                    <td>${comp.id.slice(0, 6).toUpperCase()}</td>
                    <td>${comp.title}</td>
                    <td>${dateStr}</td>
                    <td><img class="avatar" src="${avatarUrl}" /> ${comp.organizer_name}</td>
                    <td>${startDate}</td>
                    <td>${endDate}</td>
                    <td><span class="status ${comp.status}">${capitalizeFirst(comp.status)}</span></td>
                `;

                tr.addEventListener('click', () => {
                    window.location.href = `admincompetition-detail.html?id=${comp.id}`;
                });
                competitionBody.appendChild(tr);
            });

            showNotification('Data kompetisi berhasil dimuat!', 'success');
            filterTable(); // Re-apply filter after loading
        } catch (err) {
            showNotification('Terjadi kesalahan saat memuat data.', 'error');
        }
    }

    // Helper to capitalize first letter
    function capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Event listener for table-specific search input
    if (searchTableInput) {
        searchTableInput.addEventListener("keyup", () => {
            filterTable(); // Re-filter when search input changes
        });
    }

    // Function to filter table rows based on active tab and search query
    function filterTable() {
        const activeTab = document.querySelector(".status-tabs .tab.active");
        const statusFilter = activeTab ? activeTab.getAttribute("data-status-filter") : "all";
        const searchQuery = searchTableInput ? searchTableInput.value.toLowerCase() : "";

        const rows = competitionBody.querySelectorAll("tr");

        rows.forEach(row => {
            const rowStatus = row.getAttribute("data-status");
            const rowText = row.textContent.toLowerCase();

            const matchesStatus = (statusFilter === "all" || rowStatus === statusFilter);
            const matchesSearch = rowText.includes(searchQuery);

            if (matchesStatus && matchesSearch) {
                row.style.display = "table-row";
            } else {
                row.style.display = "none";
            }
        });
    }

    // Initial filter on page load
    filterTable();
    loadCompetitions();
    // --- CONTOH PANGGILAN NOTIFIKASI SAAT HALAMAN DIMUAT (Bisa dihapus) ---
    // Anda bisa memanggil showNotification() kapan pun Anda butuhkan.
    // Misalnya, setelah data berhasil dimuat, atau saat ada aksi user.
    // showNotification('Data kompetisi berhasil dimuat!', 'success');
    // showNotification('Terjadi kesalahan saat memuat data.', 'error');
    // --- Akhir Contoh ---
});