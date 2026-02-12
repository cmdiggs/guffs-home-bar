# Connect Guffs Web App to GitHub (simple steps)

Your project is **already connected** to this repo: **https://github.com/cmdiggs/guffs-home-bar**

If you’re having trouble **pushing** or **seeing your code on GitHub**, follow the steps below.

---

## Option A: Fix “can’t push” / authentication

If the problem is errors when you run `git push` (e.g. “Authentication failed” or “Permission denied”):

### 1. Use a Personal Access Token (recommended on Mac)

1. In your browser, go to **https://github.com** and log in.
2. Click your **profile picture (top right)** → **Settings**.
3. Scroll down the left sidebar and click **Developer settings**.
4. Click **Personal access tokens** → **Tokens (classic)**.
5. Click **Generate new token** → **Generate new token (classic)**.
6. Give it a name (e.g. “Guffs laptop”), choose an expiration, and check the box for **repo** (full control of private repositories).
7. Click **Generate token**, then **copy the token** (you won’t see it again).
8. In Terminal (see “Push your code” below), when Git asks for your **password**, paste this token instead of your GitHub password.

### 2. Or use GitHub Desktop (easiest if you prefer not to use Terminal)

1. Download **GitHub Desktop**: https://desktop.github.com/
2. Install and open it, then sign in with your GitHub account.
3. In the menu: **File** → **Add local repository**.
4. Choose the folder: `Guffs Web App` (your project folder).
5. Use the app to **Commit** and **Push** — it will use your GitHub login so you don’t need to set up a token.

---

## Option B: Connect a different or new GitHub repo

If you want this project to point to a **different** repo (or you’re creating one from scratch):

### 1. Create a new repo on GitHub (if you don’t have one yet)

1. Go to **https://github.com** and log in.
2. Click the **+** (top right) → **New repository**.
3. Name it (e.g. `guffs-web-app`).
4. Leave “Add a README” **unchecked** (you already have code).
5. Click **Create repository**.

### 2. Point your project at that repo

In Terminal, from your project folder, run (replace `YOUR_USERNAME` and `REPO_NAME` with your GitHub username and repo name):

```bash
cd "/Users/cmdiggs/Library/CloudStorage/Dropbox-Personal/Guffs Web App"

# Remove the current GitHub link
git remote remove origin

# Add your repo (use the URL from the new repo’s green “Code” button)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
```

Example if your username is `jane` and repo is `guffs-web-app`:

```bash
git remote add origin https://github.com/jane/guffs-web-app.git
```

---

## Push your code (Terminal)

Do this from your **project folder** in Terminal.

### 1. Open Terminal

- **Mac**: Spotlight (Cmd + Space), type **Terminal**, press Enter.
- Or: **Applications** → **Utilities** → **Terminal**.

### 2. Go to your project folder

```bash
cd "/Users/cmdiggs/Library/CloudStorage/Dropbox-Personal/Guffs Web App"
```

### 3. See what would be committed

```bash
git status
```

### 4. Stage everything (add all changes)

```bash
git add -A
```

### 5. Commit with a message

```bash
git commit -m "Update Guffs app: homies, collection, lightbox, HEIC support"
```

### 6. Push to GitHub

```bash
git push -u origin main
```

- If it asks for **username**: your GitHub username (e.g. `cmdiggs`).
- If it asks for **password**: use a **Personal Access Token** (see Option A above), not your normal GitHub password.

After this, your code will be at: **https://github.com/cmdiggs/guffs-home-bar** (or whatever repo you set as `origin`).

---

## Quick checklist

- [ ] Logged in at https://github.com
- [ ] Created a Personal Access Token (repo scope) if using Terminal and HTTPS
- [ ] In Terminal: `cd` into the Guffs Web App folder
- [ ] `git add -A` → `git commit -m "Your message"` → `git push -u origin main`
- [ ] If push fails: check that the remote is correct with `git remote -v`

---

## See your current GitHub link

In Terminal, from the project folder:

```bash
git remote -v
```

You should see something like:

```
origin  https://github.com/cmdiggs/guffs-home-bar.git (fetch)
origin  https://github.com/cmdiggs/guffs-home-bar.git (push)
```

That’s the repo your project is connected to. Pushing will update that repo.
