# Image Upload Pipeline

## Size Limits

```
Browser (any size) → Compress → Server (10MB) → S3 (no limit)
```

| Stage | Limit | Enforcement |
|-------|-------|-------------|
| Browser input | None | User can upload any size |
| Browser → Server | 10MB | Client compresses until it fits |
| Server validation | 10MB (base64 ~13.7MB) | DoS protection |
| Server → S3 | None | MinIO accepts any size |

## Browser Compression

Located in `$lib/shared/logic/image-processing.ts`:

```ts
const SERVER_LIMIT = 10 * 1024 * 1024; // 10MB
const QUALITY_STEPS = [0.9, 0.7, 0.5, 0.3];
const DIMENSION_STEPS = [1920, 1440, 1080, 720];
```

Algorithm:
1. Start at 1920px, quality 0.9
2. If > 10MB, reduce quality (0.9 → 0.7 → 0.5 → 0.3)
3. If all qualities fail, reduce dimension (1920 → 1440)
4. Reset quality, repeat
5. Max 16 attempts (4 qualities × 4 dimensions)
6. Best-effort: if still > 10MB after all attempts, return smallest achieved

## Server Validation

Located in `$lib/data/private/storage.remote.ts`:

```ts
const MAX_BASE64_SIZE = Math.ceil(10 * 1024 * 1024 * 1.37);
```

- Base64 adds ~37% overhead
- 10MB file → ~13.7MB base64

## S3 Key Format

Keys follow the format: `{folder}/{uuid}-{filename}.{ext}`

Example: `articles/a1b2c3d4-e5f6-7890-abcd-ef1234567890-cover.webp`

Allowed folders: `images`, `uploads`, `covers`, `avatars`, `articles`, `members`, `projects`

## S3 Cleanup

When images are changed or removed, the old S3 file is automatically deleted:

- **Change**: Old image deleted after new upload succeeds
- **Remove**: Image deleted immediately when "Remove" button clicked
- **External URLs**: Non-S3 URLs (different host) are ignored safely

The `removeByUrl` command in `storage.remote.ts` handles URL-to-key conversion server-side.

## User Input Methods

The `ImageUpload` component supports:

1. **Click**: Click to open file picker
2. **Drag & Drop**: Drag image files onto the component
3. **Paste (Ctrl+V)**: Paste from clipboard anywhere on the page

Paste is handled globally via `svelte:window onpaste` and skips INPUT/TEXTAREA elements to avoid conflicts.

## Design Decisions

- **Never reject user uploads**: Compress instead of refusing
- **Quality over size**: Try high quality first, only reduce if needed
- **GIF exception**: GIFs skip compression (animation would be lost)
- **Clean up S3**: Delete old files on change/remove to avoid orphans
- **Fire-and-forget cleanup**: S3 deletion errors don't block the UI
