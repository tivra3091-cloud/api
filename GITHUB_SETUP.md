# GitHub Push Instructions

## Step 1: Install Git
Download and install Git from: https://git-scm.com/download/win

## Step 2: Initialize Git Repository
```bash
git init
```

## Step 3: Add All Files
```bash
git add .
```

## Step 4: Commit Changes
```bash
git commit -m "Setup new matchDetails API endpoint"
```

## Step 5: Create GitHub Repository
1. Go to https://github.com
2. Click "New repository"
3. Create a new repository (don't initialize with README)

## Step 6: Add Remote and Push
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name.
