// 1) Initialize Supabase client
const SUPABASE_URL     = 'https://eqwwbxzhttxvlqtmctnl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxd3dieHpodHR4dmxxdG1jdG5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNTMzNjcsImV4cCI6MjA2MzkyOTM2N30.R8o_9OpZtsTR3kDyPV83nUR5SN-lzTRkL1viO6Fjm08';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', function() {
  // --- Existing drag-drop & preview logic unchanged ---
  const dropZone     = document.getElementById('drop-zone');
  const fileInput    = document.getElementById('file-input');
  const uploadBox    = document.getElementById('upload-box');
  const filePreview  = document.getElementById('file-preview');
  const fileNameElem = document.getElementById('file-name');
  const fileSizeElem = document.getElementById('file-size');
  const removeFile   = document.getElementById('remove-file');

  ['dragenter','dragover','dragleave','drop'].forEach(evt =>
    dropZone.addEventListener(evt, preventDefaults, false)
  );
  ['dragenter','dragover'].forEach(evt =>
    dropZone.addEventListener(evt, highlight, false)
  );
  ['dragleave','drop'].forEach(evt =>
    dropZone.addEventListener(evt, unhighlight, false)
  );
  dropZone.addEventListener('drop', handleDrop, false);
  fileInput.addEventListener('change', e => handleFiles(e.target.files));
  removeFile.addEventListener('click', clearFile);

  function preventDefaults(e) { e.preventDefault(); e.stopPropagation(); }
  function highlight()       { uploadBox.classList.add('drag-over'); }
  function unhighlight()     { uploadBox.classList.remove('drag-over'); }

  function handleDrop(e) {
    handleFiles(e.dataTransfer.files);
  }

  function handleFiles(files) {
    if (!files.length) return;
    const file = files[0];
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    const valid = ['.png','.jpg','.jpeg','.mp3','.mp4'];
    if (!valid.includes(ext)) return alert('Please upload PNG, JPEG, MP3, or MP4.');
    if (file.size > 10*1024*1024)       return alert('Max size 10MB.');
    showFilePreview(file);
    simulateUpload();
  }

  function showFilePreview(file) {
    dropZone.style.display = 'none';
    filePreview.style.display = 'flex';
    fileNameElem.textContent = file.name;
    fileSizeElem.textContent = formatFileSize(file.size);
  }

  function simulateUpload() {
    const bar  = document.getElementById('progress-bar');
    const text = document.getElementById('progress-text');
    let pct = 0;
    const iv = setInterval(() => {
      pct = Math.min(100, pct + Math.random()*30);
      bar.style.width = pct+'%';
      text.textContent = Math.round(pct)+'%';
      if (pct===100) {
        clearInterval(iv);
        setTimeout(()=> text.textContent='Completed',200);
      }
    },500);
  }

  function clearFile() {
    fileInput.value = '';
    dropZone.style.display    = 'flex';
    filePreview.style.display = 'none';
    fileNameElem.textContent  = '';
    fileSizeElem.textContent  = '';
    document.getElementById('progress-bar').style.width  = '0';
    document.getElementById('progress-text').textContent = '0%';
  }

  function formatFileSize(bytes) {
    if (bytes===0) return '0 Bytes';
    const k=1024, sizes=['Bytes','KB','MB','GB'], i=Math.floor(Math.log(bytes)/Math.log(k));
    return (bytes/Math.pow(k,i)).toFixed(2)+' '+sizes[i];
  }

  // --- Category selection logic (unchanged) ---
  const categoryInput        = document.getElementById('category-input');
  const categoryDropdown     = document.getElementById('category-dropdown');
  const selectedCategories   = document.getElementById('selected-categories');
  const categoryInputPlaceholder = categoryInput.querySelector('.category-placeholder');
  const selectedValues       = new Set();

  categoryInput.addEventListener('click', () => categoryDropdown.classList.toggle('active'));
  document.addEventListener('click', e => {
    if (!e.target.closest('.category-container')) categoryDropdown.classList.remove('active');
  });

  function createCategoryTag(value, text) {
    categoryInputPlaceholder.style.display = 'none';
    const tag = document.createElement('div');
    tag.className = 'category-tag';
    tag.innerHTML = `${text}<span class="remove-tag material-symbols-rounded">close</span>`;
    tag.querySelector('.remove-tag').addEventListener('click', e => {
      e.stopPropagation();
      selectedValues.delete(value);
      tag.remove();
      categoryDropdown.querySelector(`.category-option[data-value="${value}"]`)
        .classList.remove('selected');
      if (!selectedValues.size) categoryInputPlaceholder.style.display='block';
    });
    return tag;
  }

  document.querySelectorAll('.category-option').forEach(opt =>
    opt.addEventListener('click', () => {
      const val = opt.dataset.value, text = opt.textContent;
      if (!selectedValues.has(val)) {
        selectedValues.add(val);
        opt.classList.add('selected');
        selectedCategories.append(createCategoryTag(val,text));
      }
    })
  );

  // --- Team size toggle ---
  const participantType = document.getElementById('participant-type');
  const teamSizeInputs  = document.getElementById('team-size-inputs');
  participantType.addEventListener('change', e => {
    teamSizeInputs.style.display = e.target.value==='team' ? 'grid' : 'none';
  });

  // --- Fee amount toggle ---
  const entryFeeType   = document.getElementById('entry-fee-type');
  const feeAmountInput = document.getElementById('fee-amount-input');
  entryFeeType.addEventListener('change', e => {
    feeAmountInput.style.display = e.target.value==='paid' ? 'flex' : 'none';
  });

  // --- Form validation & submission ---
  const submitBtn = document.querySelector('.submit-btn');
  submitBtn.addEventListener('click', validateAndSubmit);

  async function validateAndSubmit(e) {
    e.preventDefault();
    const errors = [];
    // Image required
    if (filePreview.style.display==='none') errors.push('Please upload a poster.');

    // Title
    const titleEl = document.getElementById('competition-title');
    if (!titleEl.value.trim()) { titleEl.classList.add('error'); errors.push('Title required.'); }

    // Categories
    if (!selectedValues.size) {
      document.querySelector('.category-container').classList.add('error');
      errors.push('Select at least one category.');
    }

    // Scope
    const scopeEl = document.getElementById('competition-scope');
    if (!scopeEl.value) { scopeEl.classList.add('error'); errors.push('Scope required.'); }

    // Participant / team size
    const partEl = document.getElementById('participant-type');
    if (!partEl.value) { partEl.classList.add('error'); errors.push('Participant type required.'); }
    if (partEl.value==='team') {
      const minEl = document.getElementById('min-participants');
      const maxEl = document.getElementById('max-participants');
      if (!minEl.value||!maxEl.value) {
        minEl.classList.add('error'); maxEl.classList.add('error');
        errors.push('Team size limits required.');
      } else if (+minEl.value > +maxEl.value) {
        minEl.classList.add('error'); maxEl.classList.add('error');
        errors.push('Min team size cannot exceed max.');
      }
    }

    // Entry fee
    const feeTypeEl = document.getElementById('entry-fee-type');
    if (!feeTypeEl.value) { feeTypeEl.classList.add('error'); errors.push('Entry fee type required.'); }
    if (feeTypeEl.value==='paid') {
      const feeEl = document.getElementById('fee-amount');
      if (!feeEl.value|| feeEl.value<=0) {
        feeEl.classList.add('error'); errors.push('Valid fee amount required.');
      }
    }

    // Organizer
    const orgEl = document.getElementById('organizer-name');
    if (!orgEl.value.trim()) { orgEl.classList.add('error'); errors.push('Organizer name required.'); }

    // Website
    const webEl = document.getElementById('competition-website');
    if (webEl.value && !isValidUrl(webEl.value)) {
      webEl.classList.add('error'); errors.push('Valid website URL required.');
    }

    // Dates
    const startEl = document.getElementById('start-date');
    const endEl   = document.getElementById('end-date');
    if (!startEl.value||!endEl.value) {
      if (!startEl.value) startEl.classList.add('error');
      if (!endEl.value)   endEl.classList.add('error');
      errors.push('Start & end dates required.');
    } else {
      const s=new Date(startEl.value), e=new Date(endEl.value), today=new Date();
      today.setHours(0,0,0,0);
      if (s<today)      { startEl.classList.add('error'); errors.push('Start date cannot be in past.'); }
      if (e<=s)         { endEl.classList.add('error');   errors.push('End must follow start.'); }
    }

    // Description
    const descEl = document.getElementById('competition-description');
    if (!descEl.value.trim()) { descEl.classList.add('error'); errors.push('Description required.'); }

    // If errors, show them
    if (errors.length) {
      showErrorNotification(errors);
      return;
    }

    // Otherwise, proceed to upload image + submit data
    showSuccessNotification('Uploading competition…');
    await submitCompetition();
  }

  //  Helpers
  function isValidUrl(s) {
    try { new URL(s); return true; }
    catch { return false; }
  }
  function showErrorNotification(errs) {
    const n = document.createElement('div');
    n.className = 'notification error';
    n.innerHTML = `<h3>Fix these:</h3><ul>${errs.map(e=>`<li>${e}</li>`).join('')}</ul>`;
    document.body.appendChild(n);
    setTimeout(()=>n.remove(),5000);
  }
  function showSuccessNotification(msg='Success!') {
    const n = document.createElement('div');
    n.className = 'notification success';
    n.textContent = msg;
    document.body.appendChild(n);
    setTimeout(()=>n.remove(),3000);
  }

  // 6) Submission logic
  async function submitCompetition() {
    // Gather form data again
    const file        = fileInput.files[0];
    const eligibility = document.querySelector('input[name="eligibility"]:checked').value;
    const categories  = Array.from(document.querySelectorAll('.category-option.selected'))
                              .map(el => el.dataset.value);
    // build payload fields same as controller expects
    const payload = {
      title:            document.getElementById('competition-title').value.trim(),
      description:      document.getElementById('competition-description').value.trim(),
      eligibility,
      categories,
      scope:            document.getElementById('competition-scope').value,
      participant_type: document.getElementById('participant-type').value,
      min_participants: document.getElementById('min-participants').value || null,
      max_participants: document.getElementById('max-participants').value || null,
      entry_fee_type:   document.getElementById('entry-fee-type').value,
      fee_amount:       document.getElementById('fee-amount').value || null,
      organizer_name:   document.getElementById('organizer-name').value.trim(),
      website:          document.getElementById('competition-website').value.trim() || null,
      start_date:       new Date(document.getElementById('start-date').value).toISOString(),
      end_date:         new Date(document.getElementById('end-date').value).toISOString(),
    };

    // 6A) Upload image to Supabase Storage
    const filePath = `competitions/${Date.now()}_${file.name}`;
    const { error: uploadErr } = await supabase
      .storage
      .from('competition-images')
      .upload(filePath, file, { cacheControl:'3600', upsert:false });
    if (uploadErr) return alert('Image upload failed.');

    const { data, error: urlErr } = supabase
    .storage
    .from('competition-images')
    .getPublicUrl(filePath);

    if (urlErr || !data.publicUrl) return alert('Could not retrieve image URL.');

    payload.image_url = data.publicUrl;

    // 6B) Send to backend
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/competitions', {
        method: 'POST',
        headers: {
          'Content-Type':'application/json',
          'Authorization':'Bearer '+token
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) return alert('Error: '+data.message);
      showSuccessNotification('Submitted! Redirecting…');
      setTimeout(()=> window.location.href='competition.html', 2000);
    } catch (err) {
      console.error(err);
      alert('Network error.');
    }
  }

  // Remove error highlights once user corrects input
  document.querySelectorAll('input,select,textarea').forEach(el =>
    el.addEventListener('input', () => el.classList.remove('error'))
  );
});
