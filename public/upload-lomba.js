document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const uploadBox = document.getElementById('upload-box');
    const filePreview = document.getElementById('file-preview');
    const fileName = document.getElementById('file-name');
    const fileSize = document.getElementById('file-size');
    const removeFile = document.getElementById('remove-file');

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    // Highlight drop zone when dragging over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    // Handle dropped files
    dropZone.addEventListener('drop', handleDrop, false);
    
    // Handle file input change
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    // Handle remove file
    removeFile.addEventListener('click', clearFile);

    function preventDefaults (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight(e) {
        uploadBox.classList.add('drag-over');
    }

    function unhighlight(e) {
        uploadBox.classList.remove('drag-over');
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    function handleFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            // Check file type
            const validTypes = ['.png', '.jpg', '.jpeg', '.mp3', '.mp4'];
            const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
            
            if (!validTypes.includes(fileExtension)) {
                alert('Please upload a valid file type (PNG, JPEG, MP3, MP4)');
                return;
            }

            // Check file size (10MB max)
            if (file.size > 10 * 1024 * 1024) {
                alert('File size must be less than 10MB');
                return;
            }

            showFilePreview(file);
            simulateUpload();
        }
    }

    function showFilePreview(file) {
        dropZone.style.display = 'none';
        filePreview.style.display = 'flex';
        fileName.textContent = file.name;
        fileSize.textContent = formatFileSize(file.size);
    }

    function simulateUpload() {
        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');
        let progress = 0;

        const interval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress > 100) progress = 100;
            
            progressBar.style.width = `${progress}%`;
            progressText.textContent = `${Math.round(progress)}%`;

            if (progress === 100) {
                clearInterval(interval);
                setTimeout(() => {
                    progressText.textContent = 'Completed';
                }, 200);
            }
        }, 500);
    }


    function clearFile() {
        fileInput.value = '';
        dropZone.style.display = 'flex';
        filePreview.style.display = 'none';
        fileName.textContent = '';
        fileSize.textContent = '';
        document.getElementById('progress-bar').style.width = '0';
        document.getElementById('progress-text').textContent = '0%';
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    // Category selection handling
    // Category selection handling - move these to the top of the category section
    const categoryInput = document.getElementById('category-input');
    const categoryDropdown = document.getElementById('category-dropdown');
    const selectedCategories = document.getElementById('selected-categories');
    const categoryInputPlaceholder = categoryInput.querySelector('span:not(.material-symbols-rounded)');
    const selectedValues = new Set();

    // Toggle dropdown
    categoryInput.addEventListener('click', () => {
        categoryDropdown.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.category-container')) {
            categoryDropdown.classList.remove('active');
        }
    });

    function createCategoryTag(value, text) {
        categoryInputPlaceholder.style.display = 'none'; // Always hide when adding

        const tag = document.createElement('div');
        tag.className = 'category-tag';
        tag.innerHTML = `
            ${text}
            <span class="remove-tag material-symbols-rounded">close</span>
        `;

        tag.querySelector('.remove-tag').addEventListener('click', (e) => {
            e.stopPropagation();
            selectedValues.delete(value);
            tag.remove();
            const option = document.querySelector(`.category-option[data-value="${value}"]`);
            if (option) {
                option.classList.remove('selected');
            }

            // Show placeholder text if no categories are selected
            if (selectedValues.size === 0) {
                categoryInputPlaceholder.style.display = 'block';
            }
        });

        return tag;
    }

    // Handle category selection
    document.querySelectorAll('.category-option').forEach(option => {
        option.addEventListener('click', () => {
            const value = option.dataset.value;
            const text = option.textContent;

            if (!selectedValues.has(value)) {
                selectedValues.add(value);
                option.classList.add('selected');
                const tag = createCategoryTag(value, text);
                selectedCategories.appendChild(tag);
            }
        });
    });

    // Team size inputs handling
    const participantType = document.getElementById('participant-type');
    const teamSizeInputs = document.getElementById('team-size-inputs');

    participantType.addEventListener('change', function(e) {
        if (e.target.value === 'team') {
            teamSizeInputs.style.display = 'grid';
        } else {
            teamSizeInputs.style.display = 'none';
        }
    });

    const entryFeeType = document.getElementById('entry-fee-type');
    const feeAmountInput = document.getElementById('fee-amount-input');

    entryFeeType.addEventListener('change', function(e) {
        if (e.target.value === 'paid') {
            feeAmountInput.style.display = 'flex';
        } else {
            feeAmountInput.style.display = 'none';
        }
    });
});