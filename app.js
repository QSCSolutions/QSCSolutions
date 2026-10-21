const BACKEND_URL = 'PASTE_YOUR_DEPLOYED_APPS_SCRIPT_WEB_APP_URL';

const state = {
  selectedProfile: null,
  searchTimer: null,
  lastQuery: ''
};

const searchInput = document.getElementById('search-input');
const searchLoading = document.getElementById('search-loading');
const searchStatus = document.getElementById('search-status');
const searchResults = document.getElementById('search-results');
const profileSection = document.getElementById('profile-section');
const profileContent = document.getElementById('profile-content');
const formSection = document.getElementById('collection-form');
const updateForm = document.getElementById('update-form');
const selectedAppIdField = document.getElementById('selected-application-id');
const shortCodeField = document.getElementById('short-code');
const remarksField = document.getElementById('remarks');
const submitButton = document.getElementById('submit-button');
const formStatus = document.getElementById('form-status');

const SECTION_FIELDS = {
  'Applicant Details': [
    'ApplicationId',
    'NBFC',
    'Institute Name',
    'Applicant Name',
    'Applicant Mobile'
  ],
  'Loan Details': [
    'Loan Amount',
    'Emi Start Date',
    'Loan Tenure',
    'Emi Amount',
    'Emi Cycle Date',
    'Loan Pos'
  ],
  'Collection Details': [
    'Risk BKT',
    'Resolved/Not Resolved',
    'Manager Name',
    'Agency Name',
    'Total Amount Overdue',
    'Total Amount Paid'
  ],
  'Address Information': [
    'Applicant Permanent Address City',
    'Correspondence Address',
    'Permanent Address',
    'Course Name'
  ]
};

function setStatus(element, type, message) {
  element.className = `status-message ${type}`;
  element.textContent = message;
}

function showLoading(flag) {
  searchLoading.classList.toggle('hidden', !flag);
}

function formatMoney(value) {
  if (value === null || value === undefined || value === '') {
    return 'Not available';
  }

  const numericValue = Number(String(value).replace(/[^0-9.-]/g, ''));
  if (Number.isNaN(numericValue)) {
    return 'Not available';
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(numericValue);
}

function formatDisplayValue(value) {
  if (value === null || value === undefined || value === '') {
    return 'Not available';
  }
  return String(value).trim();
}

function resetSuggestions() {
  searchResults.innerHTML = '';
}

function renderSuggestions(results) {
  resetSuggestions();

  if (!results || results.length === 0) {
    searchResults.innerHTML = '<div class="status-message info">No matching applicants found. Try a different name or Application ID.</div>';
    return;
  }

  results.forEach((record) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'suggestion-item';
    button.setAttribute('aria-label', `Select applicant ${record.ApplicationId}`);
    button.innerHTML = `
      <div>
        <div class="suggestion-label">Application ID</div>
        <div class="suggestion-value">${escapeHtml(record.ApplicationId || 'Not available')}</div>
      </div>
      <div>
        <div class="suggestion-label">Applicant Name</div>
        <div class="suggestion-value">${escapeHtml(record.ApplicantName || 'Not available')}</div>
      </div>
      <div>
        <div class="suggestion-label">NBFC</div>
        <div class="suggestion-value">${escapeHtml(record.NBFC || 'Not available')}</div>
      </div>
      <div>
        <div class="suggestion-label">Institute</div>
        <div class="suggestion-value">${escapeHtml(record.InstituteName || 'Not available')}</div>
      </div>
    `;

    button.addEventListener('click', () => {
      handleApplicantSelection(record);
    });

    searchResults.appendChild(button);
  });
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function handleApplicantSelection(record) {
  state.selectedProfile = record;
  selectedAppIdField.value = record.ApplicationId || '';
  searchInput.value = record.ApplicantName || record.ApplicationId || '';
  resetSuggestions();
  formSection.classList.remove('hidden');
  profileSection.classList.remove('hidden');
  renderProfile(record);
  setStatus(formStatus, 'info', 'Customer selected. Complete the collection update below.');
}

function renderProfile(record) {
  const detailSections = Object.entries(SECTION_FIELDS)
    .map(([sectionName, keys]) => {
      const items = keys
        .map((key) => {
          const value = record[key];
          const displayValue = key.toLowerCase().includes('amount') || key.toLowerCase().includes('overdue') || key.toLowerCase().includes('paid') || key.toLowerCase().includes('loan') || key.toLowerCase().includes('emi')
            ? formatMoney(value)
            : formatDisplayValue(value);

          return `
            <div class="detail-item">
              <span class="detail-label">${escapeHtml(key)}</span>
              <span class="detail-value ${/[Aa]mount|Amount|Overdue|Paid|Loan|Emi/.test(key) ? 'money' : ''}">${escapeHtml(displayValue)}</span>
            </div>
          `;
        })
        .join('');

      return `
        <div class="profile-card">
          <h3>${escapeHtml(sectionName)}</h3>
          <div class="detail-grid">${items}</div>
        </div>
      `;
    })
    .join('');

  profileContent.innerHTML = `<div class="profile-columns">${detailSections}</div>`;
}

async function performSearch(query) {
  const trimmed = query.trim();
  if (trimmed.length < 3) {
    resetSuggestions();
    setStatus(searchStatus, 'info', 'Begin typing at least 3 characters to search.');
    return;
  }

  if (!BACKEND_URL || BACKEND_URL.includes('PASTE_')) {
    setStatus(searchStatus, 'error', 'Configure the deployed Google Apps Script URL before using the search box.');
    return;
  }

  showLoading(true);
  setStatus(searchStatus, 'info', 'Searching applicant records...');

  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        action: 'search',
        query: trimmed,
        limit: 10
      })
    });

    const payload = await response.json();

    if (!response.ok || !payload || payload.ok === false) {
      const message = payload && payload.message ? payload.message : 'Unable to complete the search request.';
      setStatus(searchStatus, 'error', message);
      resetSuggestions();
      return;
    }

    const results = Array.isArray(payload.results) ? payload.results : [];

    if (results.length === 0) {
      setStatus(searchStatus, 'info', 'No matching applicants were found.');
      renderSuggestions([]);
      return;
    }

    setStatus(searchStatus, 'success', `Found ${results.length} matching record${results.length > 1 ? 's' : ''}.`);
    renderSuggestions(results);
  } catch (error) {
    console.error('Search failed:', error);
    setStatus(searchStatus, 'error', 'Search failed. Please check the Apps Script deployment and network connection.');
    resetSuggestions();
  } finally {
    showLoading(false);
  }
}

searchInput.addEventListener('input', (event) => {
  const query = event.target.value.trim();

  if (state.searchTimer) {
    clearTimeout(state.searchTimer);
  }

  if (query.length < 3) {
    resetSuggestions();
    setStatus(searchStatus, 'info', 'Begin typing at least 3 characters to search.');
    return;
  }

  state.searchTimer = window.setTimeout(() => {
    performSearch(query);
  }, 350);
});

async function submitUpdate(event) {
  event.preventDefault();

  const applicationId = selectedAppIdField.value.trim();
  const shortCode = shortCodeField.value.trim();
  const remarks = remarksField.value.trim();

  if (!applicationId) {
    setStatus(formStatus, 'error', 'Please select an applicant before submitting an update.');
    return;
  }

  if (!shortCode) {
    setStatus(formStatus, 'error', 'Please select a valid short code before submitting.');
    return;
  }

  if (remarks.length < 10 || remarks.length > 500) {
    setStatus(formStatus, 'error', 'Remarks must contain between 10 and 500 characters.');
    return;
  }

  const shouldSubmit = window.confirm(`Submit a collection update for Application ID ${applicationId}?`);
  if (!shouldSubmit) {
    setStatus(formStatus, 'info', 'Submission cancelled.');
    return;
  }

  submitButton.disabled = true;
  setStatus(formStatus, 'info', 'Submitting collection update...');

  try {
    if (!BACKEND_URL || BACKEND_URL.includes('PASTE_')) {
      throw new Error('Configure the deployed backend URL first.');
    }

    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        action: 'update',
        applicationId,
        shortCode,
        remarks
      })
    });

    const payload = await response.json();

    if (!response.ok || !payload || payload.ok === false) {
      const message = payload && payload.message ? payload.message : 'The collection update could not be submitted.';
      setStatus(formStatus, 'error', message);
      return;
    }

    setStatus(formStatus, 'success', payload.message || 'Collection update saved successfully.');
    remarksField.value = '';
    shortCodeField.value = '';
  } catch (error) {
    console.error('Update failed:', error);
    setStatus(formStatus, 'error', 'The update request failed. Please verify the backend URL and Google authorization.');
  } finally {
    submitButton.disabled = false;
  }
}

updateForm.addEventListener('submit', submitUpdate);

searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    resetSuggestions();
  }
});
