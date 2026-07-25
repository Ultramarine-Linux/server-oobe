# Ultramarine Server OOBE

Standalone local web UI for the Ultramarine Server first-run experience.

This repository is intentionally separate from:

- the global Ultramarine Dashboard;
- the desktop Taidan application;
- the `libtaidan` backend crate.

The first screen is fixture-backed and uses the same Tailwind v4 foundation,
semantic design tokens, Inter typography, and Ultramarine color system as
Ultramarine Server Dashboard. It does not import Dashboard backend code or
`libhelium`.

Canonical Ultramarine branding assets are copied from `um-dashboard/static` into
`static/`:

- `ultramarine-logo.svg`
- `ultramarine-favicon.ico`
- `ultramarine-favicon-16x16.png`
- `ultramarine-favicon-32x32.png`
- `ultramarine-apple-touch-icon.png`

If Dashboard branding changes, update these files from the canonical Dashboard
assets rather than creating OOBE-specific variants.

## Development

```sh
pnpm install
pnpm dev
```

Then open the local Vite URL shown by the command.

Checks:

```sh
pnpm check
pnpm lint
pnpm build
pnpm test:accessibility
```

The app uses Tailwind v4 through `@tailwindcss/vite`. Dashboard-derived tokens
are defined in `src/app.css` and exposed through `@theme inline`, so new OOBE
components should prefer semantic utilities such as `bg-background`,
`text-foreground`, `border-border`, and `text-muted-foreground` over new
hardcoded colors.

## OOBE roadmap

The local roadmap documents live in this repository:

- [`OOBE-SERVER-ARCHITECTURE.local.md`](OOBE-SERVER-ARCHITECTURE.local.md) — overall local OOBE, Fyra, Tetra, and global Dashboard architecture.
- [`OOBE-LIBTAIDAN-TETRA-SPLIT.local.md`](OOBE-LIBTAIDAN-TETRA-SPLIT.local.md) — responsibility and security boundary between `libtaidan` and Tetra.
- [`OOBE-UI-SLICE-1.local.md`](OOBE-UI-SLICE-1.local.md) — standalone Dashboard-derived frontend slice.

## Planned backend boundary

The frontend will eventually communicate only with a local OOBE service backed
by `libtaidan`. The service will expose typed setup state and operations; it will
not expose arbitrary command execution or Dashboard database access.
