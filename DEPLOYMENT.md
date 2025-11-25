# Step-by-Step GitHub Pages Deployment

## Prerequisites
- GitHub account
- Git installed on your computer
- The rl-leaderboard folder ready

## Method 1: Using Git Command Line (Recommended)

### Step 1: Install Git (if not already installed)
Download from: https://git-scm.com/download/win

### Step 2: Configure Git (First time only)
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 3: Create GitHub Repository
1. Go to https://github.com
2. Click "+" → "New repository"
3. Repository name: `rl-leaderboard`
4. Description: "Reinforcement Learning Competition Leaderboard"
5. Make it **Public**
6. **Don't** check "Add a README file"
7. Click "Create repository"

### Step 4: Push Your Code

Open PowerShell and run:

```powershell
# Navigate to your project folder
cd "c:\Users\rishik\OneDrive\Desktop\python fun\rl-leaderboard"

# Initialize Git repository
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit: RL Competition Leaderboard"

# Add your GitHub repository as remote
# Replace YOUR_USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/rl-leaderboard.git

# Push to GitHub
git branch -M main
git push -u origin main
```

If prompted for credentials:
- Username: Your GitHub username
- Password: Use a Personal Access Token (not your password)
  - Generate token at: https://github.com/settings/tokens
  - Select "repo" scope
  - Copy the token and use it as password

### Step 5: Enable GitHub Pages

1. Go to your repository: `https://github.com/YOUR_USERNAME/rl-leaderboard`
2. Click **Settings** tab
3. Click **Pages** in left sidebar
4. Under "Source":
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**
6. Wait 1-2 minutes
7. Your site will be at: `https://YOUR_USERNAME.github.io/rl-leaderboard/`

---

## Method 2: Using GitHub Desktop (Easier)

### Step 1: Install GitHub Desktop
Download from: https://desktop.github.com/

### Step 2: Sign in to GitHub Desktop
- Open GitHub Desktop
- Sign in with your GitHub account

### Step 3: Create Repository

1. File → New Repository
2. Name: `rl-leaderboard`
3. Local Path: `c:\Users\rishik\OneDrive\Desktop\python fun`
4. **Uncheck** "Initialize with README"
5. Click "Create Repository"

### Step 4: Add Files

1. Copy all files from `rl-leaderboard` folder to the new repository folder
2. GitHub Desktop will show the changes
3. Add commit message: "Initial commit: RL Competition Leaderboard"
4. Click "Commit to main"

### Step 5: Publish to GitHub

1. Click "Publish repository"
2. **Uncheck** "Keep this code private"
3. Click "Publish repository"

### Step 6: Enable GitHub Pages

1. Go to your repository on GitHub.com
2. Settings → Pages
3. Source: `main` branch
4. Save
5. Wait for deployment

---

## Method 3: GitHub Web Upload (No Git Required)

### Step 1: Create Repository
1. Go to https://github.com
2. New repository → `rl-leaderboard`
3. Public repository
4. Create repository

### Step 2: Upload Files

1. Click "uploading an existing file"
2. Drag and drop these files:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `README.md`
   - `DEPLOYMENT.md`
3. Commit message: "Add leaderboard files"
4. Click "Commit changes"

### Step 3: Enable GitHub Pages

1. Settings → Pages
2. Source: `main` branch
3. Save

---

## Updating Your Site Later

### Using Git:
```powershell
cd "c:\Users\rishik\OneDrive\Desktop\python fun\rl-leaderboard"
git add .
git commit -m "Update leaderboard"
git push
```

### Using GitHub Desktop:
1. Make changes to files
2. Commit changes
3. Push to origin

### Using Web:
1. Navigate to file on GitHub
2. Click pencil icon (Edit)
3. Make changes
4. Commit changes

---

## Verification Checklist

✅ Repository created on GitHub
✅ All files uploaded (index.html, styles.css, script.js)
✅ GitHub Pages enabled in Settings
✅ Site accessible at `https://YOUR_USERNAME.github.io/rl-leaderboard/`
✅ Admin login works with password
✅ Leaderboard displays correctly

---

## Important Notes

1. **Custom Domain (Optional)**
   - You can use your own domain
   - Settings → Pages → Custom domain
   - Add CNAME record in your DNS

2. **HTTPS**
   - GitHub Pages automatically provides HTTPS
   - Enforce HTTPS in Settings → Pages

3. **Updates**
   - Changes take 1-2 minutes to appear
   - Clear browser cache if needed

4. **Backup Your Data**
   - Use "Export Data" in admin panel regularly
   - Keep JSON backups safe

---

## Troubleshooting

**404 Error:**
- Wait 2-3 minutes after enabling Pages
- Check repository is public
- Verify `index.html` is in root directory

**Changes not showing:**
- Wait a few minutes
- Hard refresh browser (Ctrl + F5)
- Check GitHub Actions tab for build status

**Admin password not working:**
- Check `script.js` line 2
- Verify you committed and pushed changes

---

## Next Steps

1. ✅ Deploy to GitHub Pages
2. 🔐 Change admin password in `script.js`
3. 🎨 Add your logo
4. 📢 Share the link with participants
5. 🏆 Start adding participants!

---

**Need Help?**
- GitHub Pages Docs: https://docs.github.com/pages
- Git Tutorial: https://git-scm.com/docs/gittutorial
- GitHub Desktop Guide: https://docs.github.com/desktop
