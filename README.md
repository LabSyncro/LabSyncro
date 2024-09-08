# LabSynchro

## Techstack

* Fullstack framework: `nuxt`
* DBMS:
* Runtime: `bun`
* Code quality assurance: `eslint`
* Devops: Github Action, `docker`

## Development guide

### Setup

```
bun install
```

### Development

Start the development server on `http://localhost:3000`:

```bash
bun run dev
```

Linting:

```bash
bun run lint
bun run lint:fix
```

### Production

Build the application for production:

```bash
bun run build
```

Locally preview production build:

```bash
bun run preview
```