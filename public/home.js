function generateCalendar() {
    const date = new Date();
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const calendarDates = document.querySelector('.calendar-dates');
    calendarDates.innerHTML = '';

    // Events data (you can modify this based on your needs)
    const events = [10, 13, 20, 24, 25, 26]; // Days with events

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
        const emptyDate = document.createElement('div');
        emptyDate.className = 'date empty';
        calendarDates.appendChild(emptyDate);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dateDiv = document.createElement('div');
        dateDiv.className = 'date';
        dateDiv.textContent = day;

        // Add today class
        if (day === date.getDate() && currentMonth === date.getMonth()) {
            dateDiv.classList.add('today');
        }

        // Add event indicator
        if (events.includes(day)) {
            dateDiv.classList.add('has-event');
        }

        calendarDates.appendChild(dateDiv);
    }
}

// Initialize calendar
document.addEventListener('DOMContentLoaded', generateCalendar);

// Add month navigation
document.querySelector('.prev-month').addEventListener('click', () => {
    // Add previous month logic
});

document.querySelector('.next-month').addEventListener('click', () => {
    // Add next month logic
});

// Add modal handling code
const createPostInput = document.querySelector('.create-post-input');
const createPostFeedBtn = document.querySelector('.post-action-btn:nth-child(3)');
const modal = document.getElementById('create-post-modal');
const closeModal = document.querySelector('.close-modal');

function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModalHandler() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset all file inputs
    initialImageInput.value = '';
    initialVideoInput.value = '';
    imageInput.value = '';
    videoInput.value = '';
    documentInput.value = '';
    
    // Clear the preview area
    const previews = filePreview.querySelectorAll('img, video');
    previews.forEach(preview => {
        URL.revokeObjectURL(preview.src);
    });
    filePreview.innerHTML = '';
    
    // Reset textarea
    document.querySelector('.modal-body textarea').value = '';
}

// Event listeners
createPostInput.addEventListener('click', openModal);
createPostFeedBtn.addEventListener('click', openModal);
closeModal.addEventListener('click', closeModalHandler);

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModalHandler();
    }
});

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModalHandler();
    }
});

// Add these after your existing modal code
const imageBtn = document.getElementById('image-btn');
const videoBtn = document.getElementById('video-btn');
const documentBtn = document.getElementById('document-btn');
const imageInput = document.getElementById('image-input');
const videoInput = document.getElementById('video-input');
const documentInput = document.getElementById('document-input');
const filePreview = document.getElementById('file-preview');
const createPostImageBtn = document.querySelector('.create-post-actions .post-action-btn:nth-child(1)');
const createPostVideoBtn = document.querySelector('.create-post-actions .post-action-btn:nth-child(2)');

// Handle file button clicks
imageBtn.addEventListener('click', () => imageInput.click());
videoBtn.addEventListener('click', () => videoInput.click());
documentBtn.addEventListener('click', () => documentInput.click());

// Handle file selection
imageInput.addEventListener('change', handleFileSelect);
videoInput.addEventListener('change', handleFileSelect);
documentInput.addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const previewItem = document.createElement('div');
    previewItem.className = 'preview-item';

    // Create remove button
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-file';
    removeBtn.innerHTML = '×';
    removeBtn.onclick = () => {
        previewItem.remove();
        event.target.value = ''; // Reset input
    };

    if (file.type.startsWith('image/')) {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        previewItem.appendChild(img);
    } else if (file.type.startsWith('video/')) {
        const video = document.createElement('video');
        video.src = URL.createObjectURL(file);
        video.controls = true;
        previewItem.appendChild(video);
    } else {
        const docPreview = document.createElement('div');
        docPreview.className = 'document-preview';
        docPreview.innerHTML = `
            <span class="material-symbols-rounded">description</span>
            <span>${file.name}</span>
        `;
        previewItem.appendChild(docPreview);
    }

    previewItem.appendChild(removeBtn);
    filePreview.appendChild(previewItem);
}

// Add hidden file inputs to handle initial file selection
const initialImageInput = document.createElement('input');
initialImageInput.type = 'file';
initialImageInput.accept = 'image/*';
initialImageInput.style.display = 'none';
document.body.appendChild(initialImageInput);

const initialVideoInput = document.createElement('input');
initialVideoInput.type = 'file';
initialVideoInput.accept = 'video/*';
initialVideoInput.style.display = 'none';
document.body.appendChild(initialVideoInput);

// Handle create post button clicks
createPostImageBtn.addEventListener('click', () => {
    initialImageInput.click();
});

createPostVideoBtn.addEventListener('click', () => {
    initialVideoInput.click();
});

// Handle file selection and open modal
initialImageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        openModal();
        // Small delay to ensure modal is open before adding preview
        setTimeout(() => {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            imageInput.files = dataTransfer.files;
            handleFileSelect({ target: imageInput });
        }, 100);
    }
});

initialVideoInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        openModal();
        setTimeout(() => {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            videoInput.files = dataTransfer.files;
            handleFileSelect({ target: videoInput });
        }, 100);
    }
});

//privacy drop down
// Add this code for privacy dropdown functionality
const privacyBtn = document.querySelector('.privacy-btn');
const privacyDropdown = document.querySelector('.privacy-dropdown');
const privacyIcon = document.getElementById('privacy-icon');
const privacyText = document.getElementById('privacy-text');
const dropdownItems = document.querySelectorAll('.dropdown-item');

// Toggle dropdown
privacyBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    privacyDropdown.classList.toggle('active');
});

// Close dropdown when clicking outside
document.addEventListener('click', () => {
    privacyDropdown.classList.remove('active');
});

// Handle option selection
dropdownItems.forEach(item => {
    item.addEventListener('click', () => {
        const value = item.dataset.value;
        const icon = item.querySelector('.material-symbols-rounded').textContent;
        const text = item.querySelector('.dropdown-text span').textContent;
        
        privacyIcon.textContent = icon;
        privacyText.textContent = text;
        privacyDropdown.classList.remove('active');
    });
});

// Prevent dropdown from closing when clicking inside
privacyDropdown.addEventListener('click', (e) => {
    e.stopPropagation();
});