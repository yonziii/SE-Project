document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const compId = urlParams.get('id');
  if (!compId) return;

  try {
    const res = await fetch(`/api/competitions/${compId}`);
    if (!res.ok) return alert('Competition not found!');
    const comp = await res.json();

    // Fill poster image
    const poster = document.getElementById('competition-poster');
    if (poster) poster.src = comp.image_url || '';

    // Fill title
    const title = document.getElementById('competition-title');
    if (title) title.textContent = comp.title || '';

    // Fill organizer
    const organizer = document.getElementById('competition-organizer');
    if (organizer) {
      organizer.textContent = comp.organizer_name || '';
      organizer.href = comp.website || '#';
    }

    // Fill short description
    const desc = document.getElementById('competition-description');
    if (desc) desc.textContent = comp.description || '';

    // Fill tags
    const tagsDiv = document.getElementById('competition-tags');
    if (tagsDiv) {
      const categories = Array.isArray(comp.categories)
        ? comp.categories
        : (typeof comp.categories === 'string' ? comp.categories.split(',') : []);
      tagsDiv.innerHTML = categories
        .map(cat => `<span class="tag">${capitalizeWords(cat.trim())}</span>`)
        .join('');
    }

    // Fill detail section
    const detailSection = document.getElementById('competition-detail-section');
    if (detailSection) {
      let peopleText;
      if (comp.participant_type === 'individual') {
        peopleText = '1 Person';
      } else {
        const min = comp.min_participants ?? '-';
        const max = comp.max_participants ?? '-';
        peopleText = `${min} - ${max} Persons`;
      }
      detailSection.innerHTML = `
        <h3>Detail</h3>
        <p><img src="./asset/users.png" alt=""> ${peopleText}</p>
        <p><img src="./asset/hourglass.png" alt=""> ${formatDate(comp.start_date)} - ${formatDate(comp.end_date)}</p>
        <p><img src="./asset/web.png" alt=""> <a href="${comp.website || '#'}" target="_blank"><b>${comp.website || '-'}</b></a></p>
      `;
    }

    // Fill eligibility section
    const eligibilitySection = document.getElementById('competition-eligibility-section');
    if (eligibilitySection) {
      eligibilitySection.innerHTML = `
        <h3>Participation Eligibility</h3>
        <div class="section-in">
          <h3>${capitalize(comp.eligibility)}</h3>
          <p>${getEligibilityDescription(comp.eligibility)}</p>
        </div>
      `;
    }

    // Fill description section
    const descriptionSection = document.getElementById('competition-description-section');
    if (descriptionSection) {
      descriptionSection.innerHTML = `
        <h3>Description</h3>
        <div class="description">
          <p>${comp.description || ''}</p>
        </div>
      `;
    }

    // Set the shareable link
    const linkInput = document.getElementById('competition-link');
    if (linkInput) linkInput.value = window.location.href;

  } catch (err) {
    console.error(err);
    alert('Failed to load competition data.');
  }

  function capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
  }
  function formatDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
  }
  function getEligibilityDescription(type) {
    if (type === 'general') return 'Open to all individuals, regardless of age, education level, or affiliation.';
    if (type === 'school') return 'Open to school students only.';
    if (type === 'university') return 'Open to university students only.';
    return '';
  }
  function capitalizeWords(str) {
    return str.replace(/\b\w/g, c => c.toUpperCase());
  }
});