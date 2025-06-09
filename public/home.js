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
imageInput.addEventListener('change', function(event) {
    if (imageInput.files.length > 15) {
        showNotification('You can upload a maximum of 15 images.', 'error');
        imageInput.value = '';
        return;
    }

    handleFileSelect(event);
});
videoInput.addEventListener('change', function(event) {
    if (videoInput.files.length > 1) {
        showNotification('You can upload only 1 video.', 'error');
        videoInput.value = '';
        return;
    }
    const file = videoInput.files[0];
    if (file && file.size > 1024 * 1024 * 1024) { // 1GB
        showNotification('Video must be less than 1GB.', 'error');
        videoInput.value = '';
        return;
    }
    handleFileSelect(event);
});

documentInput.addEventListener('change', async function(event) {
    if (documentInput.files.length > 1) {
        showNotification('You can upload only 1 document.', 'error');
        documentInput.value = '';
        return;
    }
    const file = documentInput.files[0];
    if (file && file.size > 100 * 1024 * 1024) { // 100MB
        showNotification('Document must be less than 100MB.', 'error');
        documentInput.value = '';
        return;
    }

    // PDF check
    if (file && (file.type === 'application/pdf' || file.name.endsWith('.pdf'))) {
        const pageCount = await getPdfPageCount(file);
        if (pageCount > 300) {
            showNotification('PDF must be 300 pages or less.', 'error');
            documentInput.value = '';
            return;
        }
        const wordCount = await getPdfWordCount(file);
        if (wordCount > 1000000) {
            showNotification('PDF must be 1 million words or less.', 'error');
            documentInput.value = '';
            return;
        }
    }

    // DOCX check
    if (file && (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx'))) {
        const { pageCount, wordCount } = await getDocxStats(file);
        if (pageCount > 300) {
            showNotification('DOCX must be 300 pages or less.', 'error');
            documentInput.value = '';
            return;
        }
        if (wordCount > 1000000) {
            showNotification('DOCX must be 1 million words or less.', 'error');
            documentInput.value = '';
            return;
        }
    }

    handleFileSelect(event);
});

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

async function getDocxStats(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async function(e) {
            try {
                const arrayBuffer = e.target.result;
                const result = await mammoth.extractRawText({ arrayBuffer });
                const text = result.value;
                const wordCount = text.split(/\s+/).length;
                // DOCX doesn't have a page count, but you can estimate:
                // Assume 500 words per page as a rough estimate
                const pageCount = Math.ceil(wordCount / 500);
                resolve({ pageCount, wordCount });
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

async function getPdfPageCount(file) {
    const pdfjsLib = window['pdfjs-dist/build/pdf'];
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    return pdf.numPages;
}

async function getPdfWordCount(file) {
    const pdfjsLib = window['pdfjs-dist/build/pdf'];
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let wordCount = 0;
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const text = textContent.items.map(item => item.str).join(' ');
        wordCount += text.split(/\s+/).length;
    }
    return wordCount;
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

// Add this after your existing modal code
const postBtn = document.querySelector('.post-btn');

postBtn.addEventListener('click', async () => {
    const textarea = document.querySelector('.modal-body textarea');
    const filePreview = document.getElementById('file-preview');
    const privacyValue = Array.from(dropdownItems).find(item =>
        item.querySelector('.dropdown-text span').textContent === privacyText.textContent
    )?.dataset.value || 'public';

    // Basic validation
    if (!textarea.value.trim() && !filePreview.hasChildNodes()) {
        showNotification('Please add some content or media to your post', 'error');
        return;
    }

    // Prepare media arrays
    let image_urls = [];
    let video_url = null;
    let document_url = null;

    // Upload all selected images
    if (imageInput.files.length > 0) {
        for (const file of imageInput.files) {
            const filePath = `posts/${Date.now()}_${file.name}`;
            const { error: uploadErr } = await supabase
                .storage
                .from('post-media')
                .upload(filePath, file, { cacheControl: '3600', upsert: false });
            if (uploadErr) {
                showNotification('Image upload failed.', 'error');
                continue;
            }
            const { data, error: urlErr } = supabase
                .storage
                .from('post-media')
                .getPublicUrl(filePath);
            if (urlErr || !data.publicUrl) {
                showNotification('Could not retrieve image URL.', 'error');
                continue;
            }
            image_urls.push(data.publicUrl);
        }
    }

    // Upload video if selected
    if (videoInput.files.length > 0) {
        const file = videoInput.files[0];
        const filePath = `posts/${Date.now()}_${file.name}`;
        const { error: uploadErr } = await supabase
            .storage
            .from('post-media')
            .upload(filePath, file, { cacheControl: '3600', upsert: false });
        if (uploadErr) {
            showNotification('Video upload failed.', 'error');
        } else {
            const { data, error: urlErr } = supabase
                .storage
                .from('post-media')
                .getPublicUrl(filePath);
            if (urlErr || !data.publicUrl) {
                showNotification('Could not retrieve video URL.', 'error');
            } else {
                video_url = data.publicUrl;
            }
        }
    }

    // Upload document if selected
    if (documentInput.files.length > 0) {
        const file = documentInput.files[0];
        const filePath = `posts/${Date.now()}_${file.name}`;
        const { error: uploadErr } = await supabase
            .storage
            .from('post-media')
            .upload(filePath, file, { cacheControl: '3600', upsert: false });
        if (uploadErr) {
            showNotification('Document upload failed.', 'error');
        } else {
            const { data, error: urlErr } = supabase
                .storage
                .from('post-media')
                .getPublicUrl(filePath);
            if (urlErr || !data.publicUrl) {
                showNotification('Could not retrieve document URL.', 'error');
            } else {
                document_url = data.publicUrl;
            }
        }
    }

    // Prepare payload
    const payload = {
        content: textarea.value.trim(),
        image_urls,
        video_url,
        document_url,
        privacy: privacyValue
    };

    // Send to backend
    const token = localStorage.getItem('token');
    try {
        const res = await fetch('/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) return showNotification('Error: ' + data.message, 'error');
        showNotification('Post created successfully!', 'success');
        setTimeout(() => {
            closeModalHandler();
            window.location.href = 'home.html';
        }, 2000);
    } catch (err) {
        showNotification('Failed to create post.', 'error');
    }
});

// Add notification function
function showNotification(message, type) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="material-symbols-rounded">${type === 'success' ? 'check_circle' : 'error'}</span>
            <p>${message}</p>
        </div>
    `;

    // Add to document
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Helper to format "time ago"
function formatTimeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`;

    // Show "26 May" if more than a day ago
    return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}

async function loadPosts() {
    const feed = document.querySelector('.feed');
    // Remove all posts except the create-post box
    feed.querySelectorAll('.post').forEach(post => post.remove());

    try {
        const res = await fetch('/api/posts');
        const { posts } = await res.json();

        posts.forEach(post => {
            const postDiv = document.createElement('div');
            postDiv.className = 'post';

            // Format attachments (images, video, document)
            let mediaHtml = '';
            if (post.attachments && Array.isArray(post.attachments)) {
                post.attachments.forEach(att => {
                    if (att.type === 'image') {
                        mediaHtml += `<img src="${att.file_url}" alt="Post Image" class="post-image">`;
                    } else if (att.type === 'video') {
                        mediaHtml += `<video src="${att.file_url}" controls class="post-video"></video>`;
                    } else if (att.type === 'document') {
                        mediaHtml += `<a href="${att.file_url}" target="_blank" class="post-document">📄 Document</a>`;
                    }
                });
            }

            postDiv.innerHTML = `
                <div class="post-header">
                    <img src="./asset/yonzi.png" alt="Profile Picture">
                    <div class="post-info">
                        <div class="post-author">
                            <h4>${post.author_name || 'User'}</h4>
                            <p>•</p>
                            <span class="follow-btn">Follow</span>
                            <span class="material-symbols-rounded">more_horiz</span>
                        </div>
                        <p class="post-time">${formatTimeAgo(post.created_at)}</p>
                    </div>
                </div>
                <div class="post-content">
                    <p>${post.content}</p>
                    ${mediaHtml}
                </div>
                <div class="post-actions">
                    <button><i class="far fa-heart"></i> 0</button>
                    <button><i class="far fa-comment"></i> 0</button>
                    <button><i class="fas fa-retweet"></i> 0</button>
                    <button><i class="far fa-share-square"></i> Share</button>
                </div>
            `;
            feed.appendChild(postDiv);
        });
    } catch (err) {
        showNotification('Failed to load posts.', 'error');
    }
}

// Call this after DOMContentLoaded
document.addEventListener('DOMContentLoaded', loadPosts);