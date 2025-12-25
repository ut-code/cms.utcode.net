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

## Design Decisions

- **Never reject user uploads**: Compress instead of refusing
- **Quality over size**: Try high quality first, only reduce if needed
- **GIF exception**: GIFs skip compression (animation would be lost)
