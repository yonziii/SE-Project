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

    // Event listener for status tabs
    statusTabs.forEach(tab => {
        tab.addEventListener("click", (event) => {
            // Remove active class from all tabs
            statusTabs.forEach(t => t.classList.remove("active"));
            // Add active class to the clicked tab
            event.currentTarget.classList.add("active");
            
            filterTable(); // Re-filter when a tab is clicked

            // Contoh notifikasi saat filter diubah (bisa dihapus nanti)
            // showNotification(`Filter changed to: ${event.currentTarget.textContent}`, 'info');
        });
    });

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

    // --- CONTOH PANGGILAN NOTIFIKASI SAAT HALAMAN DIMUAT (Bisa dihapus) ---
    // Anda bisa memanggil showNotification() kapan pun Anda butuhkan.
    // Misalnya, setelah data berhasil dimuat, atau saat ada aksi user.
    // showNotification('Data kompetisi berhasil dimuat!', 'success');
    // showNotification('Terjadi kesalahan saat memuat data.', 'error');
    // --- Akhir Contoh ---
});