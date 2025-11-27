// Configuration
const ADMIN_PASSWORD = 'ibot2025-26'; // Change this to your secure password
const ADMIN_SECRET_KEY = 'ibot-admin-2025'; // Secret passphrase - change this!
const STORAGE_KEY = 'rl_leaderboard_data';
const ADMIN_AUTH_KEY = 'rl_admin_auth';
// Use relative path so the site fetches `data.json` from the Pages domain.
// This avoids cross-CDN caching for raw.githubusercontent.com and respects
// our aggressive cache-busting query string.
const GITHUB_DATA_URL = './data.json';
const USE_GITHUB_STORAGE = true; // Set to true to use GitHub, false to use localStorage only

// State
let participants = [];
let isAdminLoggedIn = false;
let editingIndex = -1;

// DOM Elements
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearch');
const searchResult = document.getElementById('searchResult');
const leaderboardContainer = document.getElementById('leaderboardContainer');
const fullLeaderboardContainer = document.getElementById('fullLeaderboardContainer');
const loadingState = document.getElementById('loadingState');
const emptyState = document.getElementById('emptyState');
const lastUpdatedSection = document.getElementById('lastUpdatedSection');
const lastUpdatedLabel = document.getElementById('lastUpdatedLabel');

// Modals
const adminModal = document.getElementById('adminModal');
const adminPanelModal = document.getElementById('adminPanelModal');
const fullLeaderboardModal = document.getElementById('fullLeaderboardModal');

// Buttons
const adminBtn = document.getElementById('adminBtn');
const viewAllBtn = document.getElementById('viewAllBtn');
const refreshDataBtn = document.getElementById('refreshDataBtn');
const closeAdminModal = document.getElementById('closeAdminModal');
const closeAdminPanel = document.getElementById('closeAdminPanel');
const closeFullLeaderboard = document.getElementById('closeFullLeaderboard');
const addParticipantBtn = document.getElementById('addParticipantBtn');
const syncGitHubBtn = document.getElementById('syncGitHubBtn');
const exportDataBtn = document.getElementById('exportDataBtn');
const importDataBtn = document.getElementById('importDataBtn');
const importFile = document.getElementById('importFile');

// Forms
const adminLoginForm = document.getElementById('adminLoginForm');
const participantForm = document.getElementById('participantForm');
const participantFormElement = document.getElementById('participantFormElement');
const cancelFormBtn = document.getElementById('cancelForm');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    checkAdminAuth();
    setupEventListeners();
    setupSecretAdminAccess();
    
    // Load from GitHub if enabled
    if (USE_GITHUB_STORAGE) {
        loadFromGitHub();
    } else {
        renderLeaderboard();
    }
});

// Secret Admin Access - Press Ctrl+Shift+A to show admin button
function setupSecretAdminAccess() {
    let keysPressed = {};
    let typedSequence = '';
    let sequenceTimeout;
    
    // Listen for typed sequence
    document.addEventListener('keypress', (e) => {
        clearTimeout(sequenceTimeout);
        typedSequence += e.key;
        
        // Keep only last 20 characters
        if (typedSequence.length > 20) {
            typedSequence = typedSequence.slice(-20);
        }
        
        // Check if secret key was typed
        if (typedSequence.includes(ADMIN_SECRET_KEY)) {
            showAdminButton();
            typedSequence = '';
        }
        
        // Reset sequence after 2 seconds of no typing
        sequenceTimeout = setTimeout(() => {
            typedSequence = '';
        }, 2000);
    });
    
    // Also allow Ctrl+Shift+A for quick access (but still hidden)
    document.addEventListener('keydown', (e) => {
        keysPressed[e.key] = true;
        
        // Check for Ctrl+Shift+A (or Cmd+Shift+A on Mac)
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
            e.preventDefault();
            // Prompt for secret passphrase
            const passphrase = prompt('Enter secret passphrase:');
            if (passphrase === ADMIN_SECRET_KEY) {
                showAdminButton();
            } else if (passphrase !== null) {
                console.log('Invalid passphrase');
            }
        }
    });
    
    document.addEventListener('keyup', (e) => {
        delete keysPressed[e.key];
    });
}

function showAdminButton() {
    adminBtn.style.display = 'block';
    adminBtn.classList.add('highlight');
    setTimeout(() => adminBtn.classList.remove('highlight'), 2000);
}

// Event Listeners
function setupEventListeners() {
    // Search
    searchInput.addEventListener('input', handleSearch);
    clearSearchBtn.addEventListener('click', clearSearch);

    // Modals
    adminBtn.addEventListener('click', () => {
        if (isAdminLoggedIn) {
            openModal(adminPanelModal);
            renderAdminTable();
        } else {
            openModal(adminModal);
        }
    });

    viewAllBtn.addEventListener('click', () => {
        openModal(fullLeaderboardModal);
        renderFullLeaderboard();
    });

    refreshDataBtn.addEventListener('click', () => {
        refreshDataBtn.textContent = '⏳ Refreshing...';
        refreshDataBtn.disabled = true;
        if (USE_GITHUB_STORAGE) {
            loadFromGitHub();
            setTimeout(() => {
                refreshDataBtn.textContent = '🔄 Refresh';
                refreshDataBtn.disabled = false;
            }, 2000);
        } else {
            renderLeaderboard();
            refreshDataBtn.textContent = '🔄 Refresh';
            refreshDataBtn.disabled = false;
        }
    });

    closeAdminModal.addEventListener('click', () => closeModal(adminModal));
    closeAdminPanel.addEventListener('click', () => {
        closeModal(adminPanelModal);
        hideParticipantForm();
    });
    closeFullLeaderboard.addEventListener('click', () => closeModal(fullLeaderboardModal));

    // Close modal on background click
    [adminModal, adminPanelModal, fullLeaderboardModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal);
        });
    });

    // Admin Login
    adminLoginForm.addEventListener('submit', handleAdminLogin);

    // Admin Actions
    addParticipantBtn.addEventListener('click', showAddParticipantForm);
    syncGitHubBtn.addEventListener('click', showGitHubUpdateInstructions);
    exportDataBtn.addEventListener('click', exportData);
    importDataBtn.addEventListener('click', () => importFile.click());
    importFile.addEventListener('change', importData);
    cancelFormBtn.addEventListener('click', hideParticipantForm);

    // Participant Form
    participantFormElement.addEventListener('submit', handleParticipantSubmit);
}

// Data Management
function loadData() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            participants = JSON.parse(stored);
        } catch (e) {
            console.error('Error loading data:', e);
            participants = [];
        }
    }
}

function formatLastUpdated(value) {
    if (!value) {
        return 'Not provided';
    }

    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
        return parsed.toLocaleString(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short'
        });
    }

    // Fallback to raw string if parsing fails
    return value;
}

function setLastUpdatedLabel(displayText, tooltipText) {
    if (!lastUpdatedSection || !lastUpdatedLabel) {
        return;
    }

    lastUpdatedSection.style.display = 'flex';
    lastUpdatedLabel.textContent = displayText;
    lastUpdatedSection.title = tooltipText || displayText;
}

function loadFromGitHub() {
    loadingState.style.display = 'flex';
    setLastUpdatedLabel('Fetching latest…', 'Requesting data.json from GitHub Pages');
    
    // Aggressive cache busting with timestamp and random number
    const cacheBuster = `?t=${Date.now()}&r=${Math.random()}`;
    const url = GITHUB_DATA_URL + cacheBuster;
    
    fetch(url, {
        cache: 'no-store', // Prevent browser caching
        headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.participants && Array.isArray(data.participants)) {
                participants = data.participants;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(participants));
                console.log('✅ Loaded from GitHub:', participants.length, 'participants');
                renderLeaderboard();
                const remoteTimestamp = data.lastUpdated || null;
                const formatted = formatLastUpdated(remoteTimestamp);
                setLastUpdatedLabel(`GitHub Pages: ${formatted}`, remoteTimestamp || 'No lastUpdated provided.');
            } else {
                console.log('⚠️ No participants in GitHub data');
                renderLeaderboard();
                setLastUpdatedLabel('GitHub Pages: no participants array', 'The data.json file did not include a participants array.');
            }
            loadingState.style.display = 'none';
        })
        .catch(error => {
            console.error('❌ Error loading from GitHub:', error);
            // Fallback to localStorage
            renderLeaderboard();
            loadingState.style.display = 'none';
            setLastUpdatedLabel('Offline: showing cached data', 'Failed to fetch from GitHub Pages. Check console for details.');
        });
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(participants));
    renderLeaderboard();
    
    // Show instructions to update GitHub
    if (USE_GITHUB_STORAGE && isAdminLoggedIn) {
        setLastUpdatedLabel('Local draft (not yet synced)', 'Push the updated data.json to GitHub so other devices can see it.');
        showGitHubUpdateInstructions();
    }
}

function showGitHubUpdateInstructions() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.style.zIndex = '10000';
    modal.innerHTML = `
        <div class="modal-content modal-small">
            <div class="modal-header">
                <h2>🔄 Sync to GitHub</h2>
                <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <p style="margin-bottom: 1rem; font-weight: 600; color: var(--primary-color);">
                    ⚠️ IMPORTANT: Changes only sync when you update GitHub!
                </p>
                <div style="background: #fff3cd; border-left: 4px solid #f59e0b; padding: 1rem; margin-bottom: 1rem; border-radius: 0.5rem;">
                    <p style="font-size: 0.875rem; color: #856404; margin: 0;">
                        <strong>Note:</strong> Local changes are saved on THIS device only. To sync across all devices, you MUST update the GitHub file.
                    </p>
                </div>
                <ol style="margin-left: 1.5rem; margin-bottom: 1.5rem; line-height: 1.8;">
                    <li><strong>Step 1:</strong> Click "Export & Copy" below → file downloads + copies to clipboard</li>
                    <li><strong>Step 2:</strong> Click "Open GitHub Editor" → opens in new tab</li>
                    <li><strong>Step 3:</strong> In GitHub, press <code>Ctrl+A</code> (select all)</li>
                    <li><strong>Step 4:</strong> Press <code>Ctrl+V</code> (paste new data)</li>
                    <li><strong>Step 5:</strong> Scroll to bottom → Click green "Commit changes" button</li>
                    <li><strong>Wait 1-2 minutes</strong> → Data syncs to all devices!</li>
                </ol>
                <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                    <p style="font-size: 0.875rem; color: var(--text-secondary); margin: 0;">
                        💡 <strong>On other devices:</strong> Click the "🔄 Refresh" button to see updated data immediately.
                    </p>
                </div>
                <button onclick="exportDataForGitHub(); this.textContent='✅ Exported & Copied!'; this.style.background='#10b981';" class="btn-primary" style="width: 100%; margin-bottom: 0.5rem;">
                    📥 Export & Copy to Clipboard
                </button>
                <button onclick="window.open('https://github.com/rishik103/RL-competition/edit/main/data.json', '_blank')" class="btn-secondary" style="width: 100%; margin-bottom: 0.5rem;">
                    🔗 Open GitHub Editor
                </button>
                <button onclick="this.closest('.modal').remove()" class="btn-secondary" style="width: 100%;">
                    Close
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function exportDataForGitHub() {
    const data = {
        participants: participants,
        lastUpdated: new Date().toISOString()
    };
    const dataStr = JSON.stringify(data, null, 2);
    
    // Download the file
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.click();
    URL.revokeObjectURL(url);
    
    // Copy to clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(dataStr).then(() => {
            alert('✅ Success!\n\n📥 Downloaded: data.json\n📋 Copied to clipboard\n\nNow paste this into GitHub data.json file.');
        }).catch(err => {
            console.error('Could not copy to clipboard:', err);
            alert('✅ Downloaded: data.json\n\n⚠️ Could not auto-copy. Please open the downloaded file and copy its contents.');
        });
    } else {
        alert('✅ Downloaded: data.json\n\nPlease open the file and copy its contents to GitHub.');
    }
}

function checkAdminAuth() {
    const auth = sessionStorage.getItem(ADMIN_AUTH_KEY);
    if (auth === 'true') {
        isAdminLoggedIn = true;
        adminBtn.textContent = 'Admin Panel';
    }
}

// Search Functionality
function handleSearch(e) {
    const query = e.target.value.trim().toLowerCase();
    
    if (query === '') {
        searchResult.style.display = 'none';
        clearSearchBtn.style.display = 'none';
        return;
    }

    clearSearchBtn.style.display = 'block';

    const results = participants.filter(p => 
        p.teamName.toLowerCase().includes(query) || 
        p.teamId.toLowerCase().includes(query)
    );

    if (results.length > 0) {
        displaySearchResults(results);
    } else {
        searchResult.innerHTML = '<p style="color: var(--text-secondary);">No teams found matching your search.</p>';
        searchResult.style.display = 'block';
    }
}

function displaySearchResults(results) {
    const sorted = [...participants].sort((a, b) => b.score - a.score);
    
    const html = results.map(participant => {
        const rank = sorted.findIndex(p => p.teamId === participant.teamId) + 1;
        return createLeaderboardItemHTML(participant, rank);
    }).join('');

    searchResult.innerHTML = `
        <h3>Search Results (${results.length})</h3>
        <div class="leaderboard">${html}</div>
    `;
    searchResult.style.display = 'block';
}

function clearSearch() {
    searchInput.value = '';
    searchResult.style.display = 'none';
    clearSearchBtn.style.display = 'none';
}

// Leaderboard Rendering
function renderLeaderboard() {
    if (participants.length === 0) {
        leaderboardContainer.style.display = 'none';
        loadingState.style.display = 'none';
        emptyState.style.display = 'block';
        viewAllBtn.disabled = true;
        viewAllBtn.style.opacity = '0.5';
        return;
    }

    emptyState.style.display = 'none';
    viewAllBtn.disabled = false;
    viewAllBtn.style.opacity = '1';

    const sorted = [...participants].sort((a, b) => b.score - a.score);
    const top10 = sorted.slice(0, 10);

    const html = top10.map((participant, index) => 
        createLeaderboardItemHTML(participant, index + 1)
    ).join('');

    leaderboardContainer.innerHTML = html;
    leaderboardContainer.style.display = 'flex';
    loadingState.style.display = 'none';
}

function renderFullLeaderboard() {
    const sorted = [...participants].sort((a, b) => b.score - a.score);

    const html = sorted.map((participant, index) => 
        createLeaderboardItemHTML(participant, index + 1)
    ).join('');

    fullLeaderboardContainer.innerHTML = html || '<p style="text-align: center; color: var(--text-secondary);">No participants yet.</p>';
}

function createLeaderboardItemHTML(participant, rank) {
    const rankClass = rank <= 3 ? `rank-${rank}` : '';
    const repoLink = participant.hfRepo && isAdminLoggedIn ? 
        `<a href="${participant.hfRepo}" target="_blank" class="repo-link">View Repo →</a>` : 
        '';

    return `
        <div class="leaderboard-item ${rankClass}">
            <div class="rank">#${rank}</div>
            <div class="team-info">
                <div class="team-name">${escapeHtml(participant.teamName)}</div>
                <div class="team-id">ID: ${escapeHtml(participant.teamId)}</div>
            </div>
            <div class="score">${participant.score.toFixed(2)}</div>
            ${repoLink}
        </div>
    `;
}

// Admin Functions
function handleAdminLogin(e) {
    e.preventDefault();
    const password = document.getElementById('adminPassword').value;

    if (password === ADMIN_PASSWORD) {
        isAdminLoggedIn = true;
        sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
        adminBtn.textContent = 'Admin Panel';
        closeModal(adminModal);
        openModal(adminPanelModal);
        renderAdminTable();
        renderLeaderboard(); // Re-render to show repo links
        renderFullLeaderboard(); // Re-render full leaderboard too
        document.getElementById('adminPassword').value = '';
    } else {
        alert('Incorrect password!');
    }
}

function renderAdminTable() {
    const sorted = [...participants].sort((a, b) => b.score - a.score);
    const tbody = document.getElementById('adminTableBody');

    if (sorted.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-secondary);">No participants yet. Add one to get started!</td></tr>';
        return;
    }

    tbody.innerHTML = sorted.map((participant, index) => {
        const actualIndex = participants.findIndex(p => p.teamId === participant.teamId);
        const repoDisplay = participant.hfRepo ? 
            `<a href="${participant.hfRepo}" target="_blank" style="color: var(--primary-color);">Link</a>` : 
            '<span style="color: var(--text-secondary);">—</span>';

        return `
            <tr>
                <td><strong>#${index + 1}</strong></td>
                <td>${escapeHtml(participant.teamName)}</td>
                <td>${escapeHtml(participant.teamId)}</td>
                <td>${participant.score.toFixed(2)}</td>
                <td>${repoDisplay}</td>
                <td>
                    <div class="action-btns">
                        <button class="btn-edit" onclick="editParticipant(${actualIndex})">Edit</button>
                        <button class="btn-delete" onclick="deleteParticipant(${actualIndex})">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function showAddParticipantForm() {
    editingIndex = -1;
    document.getElementById('formTitle').textContent = 'Add New Participant';
    participantFormElement.reset();
    document.getElementById('editIndex').value = '';
    participantForm.style.display = 'block';
    participantForm.scrollIntoView({ behavior: 'smooth' });
}

function hideParticipantForm() {
    participantForm.style.display = 'none';
    participantFormElement.reset();
    editingIndex = -1;
}

function editParticipant(index) {
    editingIndex = index;
    const participant = participants[index];
    
    document.getElementById('formTitle').textContent = 'Edit Participant';
    document.getElementById('teamName').value = participant.teamName;
    document.getElementById('teamId').value = participant.teamId;
    document.getElementById('score').value = participant.score;
    document.getElementById('hfRepo').value = participant.hfRepo || '';
    document.getElementById('editIndex').value = index;

    participantForm.style.display = 'block';
    participantForm.scrollIntoView({ behavior: 'smooth' });
}

function deleteParticipant(index) {
    const participant = participants[index];
    if (confirm(`Are you sure you want to delete ${participant.teamName}?`)) {
        participants.splice(index, 1);
        saveData();
        renderAdminTable();
    }
}

function handleParticipantSubmit(e) {
    e.preventDefault();

    const participant = {
        teamName: document.getElementById('teamName').value.trim(),
        teamId: document.getElementById('teamId').value.trim(),
        score: parseFloat(document.getElementById('score').value),
        hfRepo: document.getElementById('hfRepo').value.trim()
    };

    // Validate unique team ID (except when editing the same participant)
    const isDuplicate = participants.some((p, idx) => 
        p.teamId === participant.teamId && idx !== editingIndex
    );

    if (isDuplicate) {
        alert('A participant with this Team ID already exists!');
        return;
    }

    if (editingIndex >= 0) {
        participants[editingIndex] = participant;
    } else {
        participants.push(participant);
    }

    saveData();
    renderAdminTable();
    hideParticipantForm();
}

// Import/Export
function exportData() {
    const dataStr = JSON.stringify(participants, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rl-leaderboard-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function importData(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target.result);
            if (Array.isArray(data)) {
                if (confirm(`This will replace all current data with ${data.length} participants. Continue?`)) {
                    participants = data;
                    saveData();
                    renderAdminTable();
                    alert('Data imported successfully!');
                }
            } else {
                alert('Invalid file format!');
            }
        } catch (e) {
            alert('Error reading file: ' + e.message);
        }
        importFile.value = '';
    };
    reader.readAsText(file);
}

// Modal Helpers
function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Utility
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Make functions globally accessible for inline event handlers
window.editParticipant = editParticipant;
window.deleteParticipant = deleteParticipant;
window.exportDataForGitHub = exportDataForGitHub;
