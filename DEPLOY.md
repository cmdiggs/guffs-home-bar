# How to Deploy Changes from Cursor to Vercel

## Quick Steps (3 commands)

```bash
# 1. Stage all your changes
git add -A

# 2. Commit with a message
git commit -m "Your commit message here"

# 3. Push to GitHub (automatically deploys to Vercel)
git push
```

---

## Detailed Steps

### 1️⃣ Open Terminal in Cursor
- Press **Cmd+J** (Mac) or **Ctrl+J** (Windows/Linux)
- This opens the integrated terminal at the bottom

### 2️⃣ Stage Your Changes
```bash
git add -A
```
This stages all modified, new, and deleted files.

### 3️⃣ Commit Your Changes
```bash
git commit -m "Brief description of what you changed"
```

**Examples of good commit messages:**
- `"Add new cocktail photos"`
- `"Fix homepage image display"`
- `"Update memorabilia section"`

### 4️⃣ Push to GitHub
```bash
git push
```

This pushes your changes to GitHub, which **automatically triggers a Vercel deployment**.

---

## Watch Your Deployment

After pushing, go to:
**https://vercel.com/cmdiggs/guffs-home-bar/deployments**

You'll see your deployment building. It takes about 1-2 minutes.

---

## One-Liner (All 3 Steps)

You can also run all three commands at once:

```bash
git add -A && git commit -m "Your message" && git push
```

---

## Troubleshooting

### If you get "nothing to commit"
This means there are no changes to deploy. You're all up to date!

### If push is rejected
Run this first to get the latest changes:
```bash
git pull --rebase
```
Then try pushing again:
```bash
git push
```

### Check what will be committed
Before committing, see what changed:
```bash
git status
```

---

## Pro Tips

- **Commit often** - Small, focused commits are better than huge ones
- **Write clear messages** - Future you will thank you
- **Check Vercel** - Always verify your deployment succeeded
- **Wait for build** - New changes appear in 1-2 minutes after deployment completes

---

## Need Help?

If something goes wrong, you can always ask me to help push your changes!
