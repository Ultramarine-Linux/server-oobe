# Ultramarine Server OOBE

Standalone local web UI for the Ultramarine Server first-run experience.

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm check
pnpm test:accessibility
```

Translations live in `po/<lang>/server-oobe.ftl`.

## libtaidan bridge

Every operation is validated through `tdnx server-oobe`, built from the
[taidan](https://github.com/Ultramarine-Linux/taidan) repository:

```sh
cargo build --release -p tdnx --no-default-features --features server-oobe
```

An operation fails if `tdnx` is missing or rejects it. The packaged
`ultramarine-server-oobe.service` points `TDNX_PATH` at the installed binary.
Set `OOBE_FIXTURE_MODE=true` for development and tests without `tdnx`.
