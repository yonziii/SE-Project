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

    // Form validation
    const submitBtn = document.querySelector('.submit-btn');
    const form = document.querySelector('.form-container');

    submitBtn.addEventListener('click', validateAndSubmit);

    function validateAndSubmit(e) {
        e.preventDefault();
        let isValid = true;
        const errors = [];

        // Check file upload
        const filePreview = document.getElementById('file-preview');
        if (filePreview.style.display === 'none') {
            errors.push("Please upload a competition poster");
            isValid = false;
        }

        // Check title
        const title = document.getElementById('competition-title');
        if (!title.value.trim()) {
            title.classList.add('error');
            errors.push("Title is required");
            isValid = false;
        }

        // Check categories
        if (selectedValues.size === 0) {
            document.querySelector('.category-container').classList.add('error');
            errors.push("Please select at least one category");
            isValid = false;
        }

        // Check competition scope
        const scope = document.getElementById('competition-scope');
        if (!scope.value) {
            scope.classList.add('error');
            errors.push("Competition scope is required");
            isValid = false;
        }

        // Check participant type and team size
        const participantType = document.getElementById('participant-type');
        if (!participantType.value) {
            participantType.classList.add('error');
            errors.push("Participant type is required");
            isValid = false;
        }

        if (participantType.value === 'team') {
            const minSize = document.getElementById('min-participants');
            const maxSize = document.getElementById('max-participants');
            
            if (!minSize.value || !maxSize.value) {
                minSize.classList.add('error');
                maxSize.classList.add('error');
                errors.push("Team size limits are required");
                isValid = false;
            } else if (parseInt(minSize.value) > parseInt(maxSize.value)) {
                minSize.classList.add('error');
                maxSize.classList.add('error');
                errors.push("Minimum team size cannot be greater than maximum");
                isValid = false;
            }
        }

        // Check entry fee
        const entryFeeType = document.getElementById('entry-fee-type');
        if (!entryFeeType.value) {
            entryFeeType.classList.add('error');
            errors.push("Entry fee type is required");
            isValid = false;
        }

        if (entryFeeType.value === 'paid') {
            const feeAmount = document.getElementById('fee-amount');
            if (!feeAmount.value || feeAmount.value <= 0) {
                feeAmount.classList.add('error');
                errors.push("Valid fee amount is required");
                isValid = false;
            }
        }

        // Check organizer name
        const organizerName = document.getElementById('organizer-name');
        if (!organizerName.value.trim()) {
            organizerName.classList.add('error');
            errors.push("Organizer name is required");
            isValid = false;
        }

        // Check website URL
        const website = document.getElementById('competition-website');
        if (website.value && !isValidUrl(website.value)) {
            website.classList.add('error');
            errors.push("Please enter a valid website URL");
            isValid = false;
        }

        // Check dates
        const startDate = document.getElementById('start-date');
        const endDate = document.getElementById('end-date');
        
        if (!startDate.value || !endDate.value) {
            if (!startDate.value) startDate.classList.add('error');
            if (!endDate.value) endDate.classList.add('error');
            errors.push("Both start and end dates are required");
            isValid = false;
        } else {
            const start = new Date(startDate.value);
            const end = new Date(endDate.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (start < today) {
                startDate.classList.add('error');
                errors.push("Start date cannot be in the past");
                isValid = false;
            }
            
            if (end <= start) {
                endDate.classList.add('error');
                errors.push("End date must be after start date");
                isValid = false;
            }
        }

        // Check description
        const description = document.getElementById('competition-description');
        if (!description.value.trim()) {
            description.classList.add('error');
            errors.push("Description is required");
            isValid = false;
        }

        // Handle validation result
        if (!isValid) {
            showErrorNotification(errors);
        } else {
            showSuccessNotification();
            setTimeout(() => {
                window.location.href = 'competition.html';
            }, 2000);
        }
    }

    // Helper functions
    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    function showErrorNotification(errors) {
        const notification = document.createElement('div');
        notification.className = 'notification error';
        notification.innerHTML = `
            <h3>Please fix the following errors:</h3>
            <ul>
                ${errors.map(error => `<li>${error}</li>`).join('')}
            </ul>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
    }

    function showSuccessNotification() {
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.textContent = 'Competition successfully uploaded! Redirecting...';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    }

    // Remove error class on input
    document.querySelectorAll('input, select, textarea').forEach(element => {
        element.addEventListener('input', () => {
            element.classList.remove('error');
        });
    });
});