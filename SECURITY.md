# Security

`context-cal` is local-first and does not call model APIs, remote services, or telemetry endpoints.

## Reporting Vulnerabilities

Please open a GitHub security advisory or email the maintainer listed on the npm package.

Include:

- affected version
- operating system
- command that reproduces the issue
- whether untrusted repository content is required

## Scope

In scope:

- arbitrary code execution through report generation or parsing
- path traversal in output writing
- unsafe handling of repository files

Out of scope:

- reports about intentionally fake demo content
- requests for secret scanning or prompt-injection detection
- findings that require calling a live model
