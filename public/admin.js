// admin.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Perbaikan Agresif untuk Warna Chart ---
    // Mengambil warna primer dari CSS yang sudah diterapkan di body
    const primaryColor = getComputedStyle(document.body).getPropertyValue('--primary-color').trim();
    const primaryColorRGBA = `rgba(29, 196, 215, 0.2)`; // Hardcode RGBA untuk fill, jika var(--primary-color) tidak bisa langsung diubah opacity-nya di JS

    // Log untuk debugging (Anda bisa lihat ini di console browser)
    console.log('Primary Color from CSS:', primaryColor);
    console.log('Primary Color RGBA for fill:', primaryColorRGBA);
    // --- Akhir Perbaikan Agresif ---

    // Grafik Active Users
    const ctx = document.getElementById('userChart');
    if (ctx) { // Check if canvas element exists
        const userChart = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Active Users',
                    data: [10000, 20000, 25000, 40000, 30000, 35000, 15000],
                    borderColor: primaryColor, // Menggunakan warna yang diambil dari CSS
                    backgroundColor: primaryColorRGBA, // Menggunakan warna RGBA yang sudah didefinisikan
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 3
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    // Grafik New Users This Week
    const newUsersCtx = document.getElementById('newUsersChart');
    if (newUsersCtx) { // Check if canvas element exists
        const newUsersChart = new Chart(newUsersCtx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'New Users',
                    data: [150, 200, 250, 300, 280, 270, 310],
                    backgroundColor: primaryColor, // Menggunakan warna yang diambil dari CSS
                    borderRadius: 6,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
});