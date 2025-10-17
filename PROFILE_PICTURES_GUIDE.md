# 📸 Profile Pictures Setup Guide

## How to Add Custom Profile Pictures

Follow these steps to add photos from your laptop to replace the auto-generated avatars.

---

## Step 1: Prepare Your Photos

1. **Find your photos** on your laptop (Marcus, Sarah, etc.)
2. **Rename them** to simple names:
   - `marcus.jpg` for Marcus Johnson
   - `sarah.jpg` for Sarah Chen
   - `emma.jpg` for Emma Williams
   - etc.

### Photo Requirements:

- ✅ **Format**: JPG, PNG, or WEBP
- ✅ **Size**: Recommended 400x400px minimum (square works best)
- ✅ **File size**: Keep under 500KB for fast loading
- ✅ **Quality**: Clear, well-lit headshots work best

---

## Step 2: Add Photos to Your Project

### Method A: Using Finder (Mac)

1. Open Finder
2. Navigate to: `/Users/zoebulle/Desktop/HackJam-Shark-Tank/public/avatars/`
3. Drag and drop your renamed photos into this folder

### Method B: Using Terminal

```bash
cd /Users/zoebulle/Desktop/HackJam-Shark-Tank/public/avatars/
# Then copy your photos here
cp ~/Desktop/marcus.jpg .
cp ~/Desktop/sarah.jpg .
```

---

## Step 3: Update the Avatar Mapping

1. Open the file: `src/lib/avatars.ts`
2. Find the `CUSTOM_AVATARS` object (around line 8)
3. Update the entries to match your filenames:

```typescript
const CUSTOM_AVATARS: Record<string, string> = {
  "Sarah Chen": "/avatars/sarah.jpg", // ✅ Update if different filename
  "Marcus Johnson": "/avatars/marcus.jpg", // ✅ Update if different filename
  "Emma Williams": "/avatars/emma.jpg",
  "David Park": "/avatars/david.jpg",
  "Lisa Anderson": "/avatars/lisa.jpg",
  "Ryan Thompson": "/avatars/ryan.jpg",
};
```

**Important Notes:**

- The **key** (left side) must match the **exact name** used in your app
- The **value** (right side) should be `/avatars/your-filename.jpg`
- Keep the quotes and comma at the end

---

## Step 4: Test Your Changes

1. Save the file
2. Your development server will automatically reload
3. Visit the leaderboard or dashboard
4. You should see your custom photos!

---

## Example: Adding a New User

Let's say you want to add a photo for "Alex Rodriguez":

1. **Add the photo** to `public/avatars/alex.jpg`
2. **Update** `src/lib/avatars.ts`:
   ```typescript
   const CUSTOM_AVATARS: Record<string, string> = {
     "Sarah Chen": "/avatars/sarah.jpg",
     "Marcus Johnson": "/avatars/marcus.jpg",
     "Alex Rodriguez": "/avatars/alex.jpg", // ✅ New entry
     // ... other users
   };
   ```
3. Save and test!

---

## Troubleshooting

### Photo Not Showing Up?

**Check 1: File path**

- Make sure the photo is in `public/avatars/`
- File name matches exactly (case-sensitive!)

**Check 2: Name matching**

- The name in `CUSTOM_AVATARS` must match the user's name exactly
- Check for extra spaces or spelling differences

**Check 3: File format**

- Use common formats: `.jpg`, `.jpeg`, `.png`, `.webp`
- Avoid `.heic` (iPhone format) - convert to JPG first

**Check 4: Browser cache**

- Hard refresh: `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows)
- Or clear browser cache

### Fallback System

If a photo fails to load:

- The app will show a gradient circle with initials
- This is normal and ensures the UI always looks good
- Check the console for any 404 errors

---

## Current Avatar Locations

Your custom avatars will appear in:

- ✅ **Leaderboard** - Top 3 podium (large avatars)
- ✅ **Leaderboard** - Top innovators list (medium avatars)
- ✅ **Dashboard** - Idea cards (small avatars next to author names)
- ✅ **Idea Detail Pages** - Author information

---

## Quick Reference: File Structure

```
HackJam-Shark-Tank/
├── public/
│   └── avatars/              ← Put your photos here
│       ├── sarah.jpg
│       ├── marcus.jpg
│       ├── emma.jpg
│       └── ...
└── src/
    └── lib/
        └── avatars.ts        ← Update the mapping here
```

---

## Pro Tips

### Optimize Your Photos

Before adding photos, you can optimize them:

1. **Resize** to 400x400px (perfect square)
2. **Compress** using tools like:
   - tinypng.com
   - squoosh.app
   - ImageOptim (Mac app)
3. Save as **JPG** at 80-90% quality

### Batch Renaming (Mac)

If you have many photos:

1. Select all photos in Finder
2. Right-click → "Rename X items"
3. Choose format and rename in bulk

### Professional Look

For best results:

- Use consistent lighting
- Same background style/color
- Centered faces
- Neutral expressions or smiles

---

## Need Help?

If photos aren't working:

1. Check the browser console for errors (F12)
2. Verify file paths are correct
3. Make sure dev server restarted
4. Try a hard browser refresh

The system will always fall back to generated avatars if custom photos fail, so it's safe to experiment!
