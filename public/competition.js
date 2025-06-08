function capitalizeWords(str) {
  return str.replace(/\b\w/g, c => c.toUpperCase()).replace(/-/g, ' ');
}

document.addEventListener('DOMContentLoaded', async () => {
  const list = document.querySelector('.competition-list');
  if (!list) return;

  try {
    const res = await fetch('/api/competitions');
    const competitions = await res.json();

    list.innerHTML = ''; // Clear existing cards

    competitions.forEach(comp => {
      const card = document.createElement('div');
      card.className = 'competition-card-main';
      card.innerHTML = `
        <div class="card-header-main">
          <img src="${comp.image_url}" alt="Competition Poster">
          <div class="card-info-main">
            <h3>${comp.title}</h3>
            <p class="date-main"><img src="./asset/hourglass.png" alt="">${new Date(comp.start_date).toLocaleDateString()} - ${new Date(comp.end_date).toLocaleDateString()}</p>
            <p class="description-main">${comp.description}</p>
            <p class="created-by-main">Created by <a href="#">${comp.organizer_name}</a></p>
            <div class="tags-main">
            ${(Array.isArray(comp.categories) ? comp.categories : [])
                .map(cat => `<span class="tag-main">${capitalizeWords(cat)}</span>`).join('')}
            </div>
          </div>
          <div class="card-actions-main">
            <span class="material-symbols-rounded">bookmark</span>
            <span class="material-symbols-rounded">more</span>
          </div>
        </div>
      `;
      list.appendChild(card);
    });
  } catch (err) {
    list.innerHTML = '<p>Failed to load competitions.</p>';
  }
});