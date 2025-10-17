# Profile Pictures Folder

## 📸 Add Your Custom Profile Pictures Here

This folder is for storing custom profile pictures for users.

### Quick Start:

1. **Add your photos** to this folder
2. **Name them** clearly (e.g., `sarah.jpg`, `marcus.jpg`)
3. **Update the mapping** in `src/lib/avatars.ts`

### Recommended Specs:

- **Size**: 400x400px (square)
- **Format**: JPG, PNG, or WEBP
- **File size**: Under 500KB
- **Quality**: Clear headshots

### Example:

```
avatars/
├── sarah.jpg
├── marcus.jpg
├── emma.jpg
└── david.jpg
```

Then update `src/lib/avatars.ts`:

```typescript
const CUSTOM_AVATARS = {
  "Sarah Chen": "/avatars/sarah.jpg",
  "Marcus Johnson": "/avatars/marcus.jpg",
  // ... add more
};
```

📖 **Full guide**: See `/PROFILE_PICTURES_GUIDE.md` in the project root.
