# RL Competition Leaderboard

A beautiful, modern leaderboard website for Reinforcement Learning competitions with admin access for manual participant management.

🔗 **Live Demo:** `https://YOUR_USERNAME.github.io/rl-leaderboard/`

## Features

✨ **User Features:**
- 🏆 View top 10 teams on the main page
- 📋 View full leaderboard in a modal
- 🔍 Search for teams by name or ID
- 📱 Fully responsive design
- 🎨 Beautiful gradient UI with animations

🔐 **Admin Features (Hidden):**
- 🔑 Double-layer secret access (passphrase + keyboard shortcut)
- 🔒 Password-protected admin panel
- ➕ Add new participants
- ✏️ Edit existing participants
- 🗑️ Delete participants
- 📤 Export data to JSON
- 📥 Import data from JSON
- 💾 Auto-save to browser localStorage

**⚠️ ULTRA-SECURE: Admin button is completely hidden!**
- **Method 1:** Type the secret passphrase anywhere on the page: `ibot-admin-2025`
- **Method 2:** Press **Ctrl+Shift+A** and enter passphrase when prompted
- Then login with password (default: `admin123`)
- **Only you** will know both the passphrase and shortcut!

## Quick Start

### 1. Local Testing

1. Clone or download this repository
2. Open `index.html` in your web browser
3. **Access Admin Panel** (choose one method):
   - Type: `ibot-admin-2025` anywhere on the page
   - OR Press **Ctrl+Shift+A** and enter passphrase when prompted
4. Click "Admin Login" and use password: `admin123`

### 2. Deploy to GitHub Pages

#### Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon → "New repository"
3. Name it `rl-leaderboard` (or any name you prefer)
4. Make it **Public**
5. Don't initialize with README (we already have one)
6. Click "Create repository"

#### Step 2: Upload Your Files

**Option A: Using Git (Recommended)**

```bash
# Navigate to the rl-leaderboard folder
cd "c:\Users\rishik\OneDrive\Desktop\python fun\rl-leaderboard"

# Initialize git repository
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit: RL Competition Leaderboard"

# Add your GitHub repository as remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/rl-leaderboard.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Option B: Using GitHub Web Interface**

1. Go to your new repository on GitHub
2. Click "uploading an existing file"
3. Drag and drop all files:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `README.md`
   - `logo.svg` (if you have one)
4. Click "Commit changes"

#### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll to "Pages" in the left sidebar
4. Under "Source", select `main` branch
5. Click "Save"
6. Wait 1-2 minutes for deployment
7. Your site will be live at: `https://YOUR_USERNAME.github.io/rl-leaderboard/`

## Configuration

### Change Admin Password

Edit `script.js` lines 2-3:

```javascript
const ADMIN_PASSWORD = 'your_secure_password_here';
const ADMIN_SECRET_KEY = 'your-secret-passphrase-here'; // What you type to reveal admin button
```

**Important:** After changing these values, commit and push to GitHub:

```bash
git add script.js
git commit -m "Update admin password"
git push
```

### Add Your Logo

1. Replace the placeholder SVG in `index.html` (lines 19-23) with your logo:

```html
<div class="logo-placeholder">
    <img src="logo.svg" alt="Logo" width="60" height="60">
</div>
```

2. Or use an image URL:

```html
<div class="logo-placeholder">
    <img src="https://your-image-url.com/logo.png" alt="Logo" width="60" height="60">
</div>
```

### Customize Colors

Edit `styles.css` root variables (lines 1-16):

```css
:root {
    --primary-color: #6366f1;  /* Change to your brand color */
    --primary-dark: #4f46e5;
    /* ... */
}
```

## Usage Guide

### For Participants

1. Visit the leaderboard website
2. View your ranking in the top 10 or click "View Full Leaderboard"
3. Use the search bar to find your team by name or ID
4. Click "View Repo" links to see HuggingFace repositories

### For Admins

**🔑 Double-Layer Secret Access:**

**Option 1 - Silent Mode (Recommended):**
1. Simply type `ibot-admin-2025` anywhere on the page (no input box needed)
2. The admin button will appear automatically
3. Click "Admin Login"
4. Enter password (default: `admin123`)

**Option 2 - Keyboard Shortcut:**
1. Press **Ctrl+Shift+A** (Windows/Linux) or **Cmd+Shift+A** (Mac)
2. A prompt will ask for the secret passphrase
3. Enter: `ibot-admin-2025`
4. Admin button will appear
5. Click "Admin Login" and enter password

**Security Notes:**
- Change both `ADMIN_SECRET_KEY` and `ADMIN_PASSWORD` in `script.js`
- The passphrase is completely invisible to users
- No hints or clues exist on the public-facing site

#### Adding Participants

1. Click "Admin Login"
2. Enter password (default: `admin123`)
3. Click "Add Participant"
4. Fill in the form:
   - **Team Name:** Team's display name
   - **Team ID:** Unique identifier
   - **Score:** Numerical score
   - **HuggingFace Repo:** (Optional) URL to their repo
5. Click "Save Participant"

#### Editing Participants

1. In the admin panel table, find the participant
2. Click "Edit"
3. Modify the fields
4. Click "Save Participant"

#### Deleting Participants

1. In the admin panel table, find the participant
2. Click "Delete"
3. Confirm deletion

#### Export/Import Data

**Export:**
- Click "Export Data" to download a JSON backup
- File will be named: `rl-leaderboard-YYYY-MM-DD.json`

**Import:**
- Click "Import Data"
- Select a previously exported JSON file
- Confirm replacement (this will overwrite current data)

## Data Storage

- Data is stored in browser's `localStorage`
- Each visitor's browser has independent storage
- **Important:** Admin changes are only saved locally
- For persistent hosting, consider using:
  - [Firebase Realtime Database](https://firebase.google.com/)
  - [Supabase](https://supabase.com/)
  - GitHub API with automated commits

## File Structure

```
rl-leaderboard/
├── index.html          # Main HTML structure
├── styles.css          # Styling and responsive design
├── script.js           # JavaScript logic and admin functions
├── README.md           # This file
└── logo.svg            # (Optional) Your logo file
```

## Browser Compatibility

✅ Chrome 90+
✅ Firefox 88+
✅ Safari 14+
✅ Edge 90+

## Security Notes

⚠️ **Important Security Considerations:**

1. The admin password is stored in plain text in `script.js`
2. Anyone can view the source code and see the password
3. This is suitable for low-security scenarios (competition leaderboards)

**For production use:**
- Implement proper backend authentication
- Use environment variables for sensitive data
- Consider using a CMS or database backend

## Troubleshooting

### Site not loading on GitHub Pages
- Wait 2-3 minutes after enabling Pages
- Check that `index.html` is in the root directory
- Verify the repository is public

### Admin login not working
- Check browser console for errors (F12)
- Verify password in `script.js`
- Clear browser cache and localStorage

### Data not persisting
- Data is stored per-browser, per-device
- Clear browser data will erase the leaderboard
- Use Export feature to backup regularly

### Search not working
- Make sure JavaScript is enabled
- Check browser console for errors
- Try clearing the search and typing again

## Customization Ideas

- Add submission timestamps
- Show participant avatars
- Add filtering by score range
- Implement pagination for large datasets
- Add charts/graphs for score distribution
- Email notifications for new submissions
- Multi-competition support

## License

MIT License - feel free to use and modify for your competition!

## Support

For issues or questions:
- Check the troubleshooting section
- Review browser console for errors
- Ensure all files are uploaded correctly

---

**Made with ❤️ for RL Competitions**
