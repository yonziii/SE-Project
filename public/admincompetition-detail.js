document.addEventListener('DOMContentLoaded', async () => {
    // 1. Get competition ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const compId = urlParams.get('id');
    if (!compId) return;

    try {
        // 2. Fetch competition data from backend
        const res = await fetch(`/api/competitions/${compId}`);
        if (!res.ok) return alert('Competition not found!');
        const comp = await res.json();

        // 3. Fill the fields
        document.getElementById('poster-img').src = comp.image_url;
        document.getElementById('eligibility').textContent = capitalize(comp.eligibility);
        document.getElementById('competition-title').textContent = comp.title;
        document.getElementById('competition-categories').textContent = (comp.categories || []).join(', ');
        document.getElementById('competition-scope').textContent = capitalize(comp.scope);
        document.getElementById('participant-type').textContent = capitalize(comp.participant_type);
        document.getElementById('min-participants').textContent = comp.min_participants ?? '-';
        document.getElementById('max-participants').textContent = comp.max_participants ?? '-';
        document.getElementById('entry-fee-type').textContent = capitalize(comp.entry_fee_type);
        document.getElementById('fee-amount').textContent = comp.fee_amount ? `Rp${comp.fee_amount}` : (comp.entry_fee_type === 'free' ? 'Free' : '-');
        document.getElementById('organizer-name').textContent = comp.organizer_name;
        document.getElementById('competition-website').textContent = comp.website || '-';
        document.getElementById('start-date').textContent = formatDate(comp.start_date);
        document.getElementById('end-date').textContent = formatDate(comp.end_date);
        document.getElementById('competition-description').textContent = comp.description;
    } catch (err) {
        alert('Failed to load competition data.');
    }
        document.getElementById('activate-btn').onclick = () => updateStatus('active');
    document.getElementById('reject-btn').onclick = () => updateStatus('rejected');

    async function updateStatus(status) {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`/api/competitions/${compId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({ status })
            });
            const data = await res.json();
            if (res.ok) {
                alert('Status updated!');
                window.location.href = 'admincompetitions.html';
            } else {
                alert(data.message || 'Failed to update status.');
            }
        } catch (err) {
            alert('Network error.');
        }
    }
    
    // Helpers
    function capitalize(str) {
        return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
    }
    function formatDate(dateStr) {
        if (!dateStr) return '-';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
    }
});