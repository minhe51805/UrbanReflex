# Code Style Guide - UrbanReflex Monorepo

This document describes the code style conventions and tooling used across the UrbanReflex monorepo for Python backend, JavaScript/TypeScript frontend, and related files.

## Overview

We use automated tools to enforce consistent code style across the project. This eliminates debates about formatting and allows developers to focus on logic.

**Tools:**

- **Python**: Black, Flake8, isort
- **JavaScript/TypeScript**: ESLint, Prettier
- **Optional**: Biome (for additional linting)

## Python Backend (`src/backend/`)

### Black - Code Formatter

Black is an opinionated code formatter that ensures consistent Python style.

**Configuration** (in `pyproject.toml`):

```toml
[tool.black]
line-length = 100
target-version = ["py310"]
```

**Usage:**

```bash
# Format a file
black src/backend/app.py

# Format entire backend
black src/backend/

# Check without modifying
black --check src/backend/
```

**Key Rules:**

- Line length: 100 characters
- Double quotes (except in strings with quotes)
- Two blank lines between top-level definitions
- One blank line between method definitions

### Flake8 - Linting

Flake8 checks for logical errors and style issues.

**Configuration** (in `pyproject.toml`):

```toml
[tool.flake8]
max-line-length = 100
extend-ignore = ["E203", "E266", "E501", "W503"]
```

**Usage:**

```bash
# Check for issues
flake8 src/backend/

# Common checks:
# E501: Line too long (handled by Black)
# W503: Line break before binary operator
# E203: Whitespace before ':'
```

### isort - Import Organization

isort organizes Python imports alphabetically and by section.

**Configuration** (in `pyproject.toml`):

```toml
[tool.isort]
profile = "black"
line_length = 100
```

**Usage:**

```bash
# Sort imports
isort src/backend/

# Check without modifying
isort --check-only src/backend/
```

**Import Order:**

1. Future imports (`from __future__ import ...`)
2. Standard library
3. Third-party packages
4. Local application imports

Example:

```python
from __future__ import annotations

import os
from typing import Optional

import numpy as np
from fastapi import FastAPI

from ..config.config import Settings
from .utils import helper_function
```

## Frontend (`src/frontend/`)

### ESLint - Linting

ESLint checks for common JavaScript/TypeScript errors and style issues.

**Configuration**: `eslint.config.mjs`

Uses Next.js recommended rules:

- `eslint-config-next/core-web-vitals`
- `eslint-config-next/typescript`

**Usage:**

```bash
cd src/frontend

# Check for issues
npm run lint

# Fix issues automatically
npm run lint:fix
```

### Prettier - Code Formatter

Prettier automatically formats JavaScript, TypeScript, JSON, and Markdown files.

**Configuration**: Root `.prettierrc.json`

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

**Usage:**

```bash
# Format all files
npm run format

# Check without modifying
npm run format:check

# Format specific file
npx prettier --write src/frontend/components/Header.tsx
```

**Key Rules:**

- 100 character line width
- 2 space indentation
- Single quotes for strings
- Semicolons required
- Trailing commas in ES5

## Biome (Optional Alternative)

Biome is a modern, all-in-one linter, formatter, and organizer for JavaScript/TypeScript.

**Configuration**: `biome.json` at root

**Usage:**

```bash
# Install (optional)
npm install --save-dev @biomejs/biome

# Format
npx biome format . --write

# Lint
npx biome lint . --write

# Combined check
npx biome check .
```

**Comparison:**

- ESLint + Prettier: More mature, widely adopted
- Biome: Faster, combined tool, newer but gaining popularity

We currently use ESLint + Prettier, but Biome config is available if you prefer to migrate.

## Pre-Commit Integration

All code style checks are automatically run via Husky pre-commit hooks:

```bash
git add .
git commit -m "feat: new feature"
# Hooks run automatically:
# - Frontend: ESLint --fix + Prettier
# - Backend: Black + isort
# - All: JSON/Markdown formatting
```

## Running Style Checks Manually

### Python Backend

```bash
# Format code
black src/backend/

# Check style
flake8 src/backend/

# Organize imports
isort src/backend/

# All at once
black src/backend/ && isort src/backend/ && flake8 src/backend/
```

### Frontend

```bash
cd src/frontend

# Check linting
npm run lint

# Fix linting
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

### Entire Project

```bash
# Format all
npm run format

# Check all
npm run format:check
```

## IDE Integration

### VS Code

#### Python

Install extensions:

- `ms-python.python`
- `ms-python.vscode-pylance`

Add to `.vscode/settings.json`:

```json
{
  "python.linting.enabled": true,
  "python.linting.flake8Enabled": true,
  "python.linting.flake8Args": ["--max-line-length=100"],
  "python.formatting.provider": "black",
  "python.formatting.blackArgs": ["--line-length=100"],
  "editor.formatOnSave": true
}
```

#### JavaScript/TypeScript

Install extensions:

- `dbaeumer.vscode-eslint`
- `esbenp.prettier-vscode`

Add to `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## CI/CD Integration

In GitHub Actions or similar CI, run these checks:

```yaml
- name: Format Check - Python
  run: black --check src/backend/

- name: Lint - Python
  run: flake8 src/backend/

- name: Format Check - Frontend
  run: |
    cd src/frontend
    npm run format:check

- name: Lint - Frontend
  run: |
    cd src/frontend
    npm run lint
```

## Handling Conflicts

### "My style differs from the tool"

We follow the principle of **consistency over personal preference**. The tools are configured project-wide so everyone follows the same rules.

### Disabling Rules

Only disable linting rules when absolutely necessary:

**Python:**

```python
# noqa: E501  # Ignore long line
some_long_function_call()  # noqa: F401
```

**JavaScript:**

```javascript
// eslint-disable-next-line no-unused-vars
const unusedVar = 'reason for exception';

/* eslint-disable no-console */
console.log('debug message');
/* eslint-enable no-console */
```

Avoid disabling rules globally. Always comment why.

## Line Lengths

Both Python and JavaScript/TypeScript enforce **100 character line limit**.

Good:

```python
user = User.objects.filter(
    email=email,
    is_active=True
).first()
```

Bad:

```python
user = User.objects.filter(email=email, is_active=True).first()  # Too long
```

## String Quotes

### Python

Black uses double quotes by default:

```python
message = "Hello, world!"
```

### JavaScript/TypeScript

Prettier uses single quotes:

```javascript
const message = 'Hello, world!';
```

## Trailing Commas

### Python

Black includes trailing commas in multi-line collections:

```python
data = [
    1,
    2,
    3,  # Trailing comma
]
```

### JavaScript/TypeScript

Prettier includes trailing commas (ES5 compatible):

```javascript
const data = [
  1,
  2,
  3, // Trailing comma
];
```

## References

- [Black Documentation](https://black.readthedocs.io/)
- [Flake8 Documentation](https://flake8.pycqa.org/)
- [isort Documentation](https://pycqa.github.io/isort/)
- [ESLint Documentation](https://eslint.org/)
- [Prettier Documentation](https://prettier.io/)
- [Biome Documentation](https://biomejs.dev/)
