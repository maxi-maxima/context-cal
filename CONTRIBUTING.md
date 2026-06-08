# Contributing

Thanks for helping improve `context-cal`.

## Development

```bash
npm install
npm run check
```

## Local Demo

```bash
npm run dev -- demo --out reports/demo
```

## Rule Contributions

Good rules should be:

- deterministic
- local-first
- explainable in one sentence
- tied to context budget or maintainability
- backed by a fixture or unit test

Avoid rules that require live model calls, private telemetry, or guessing developer intent from unrelated source code.

## Pull Requests

Before opening a PR:

```bash
npm run check
node dist/cli.js demo --out reports/demo
```

Include a short note describing the user-visible behavior and any rule changes.
