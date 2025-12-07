# Pre-Commit Framework - Python Linting Guide

The UrbanReflex project uses **pre-commit** framework to automatically check Python code quality before each commit.

## What is Pre-Commit?

Pre-commit is a framework that manages and maintains multi-language pre-commit hooks. It automatically runs checks before you commit code, preventing bad code from being committed.

## Setup

Pre-commit is already installed:

```bash
pip install pre-commit
```

Hooks are installed in `.git/hooks/pre-commit`:

```bash
pre-commit install
```

## Configured Hooks

### 1. Black - Code Formatter

Automatically formats Python code to be consistent and readable.

**Configuration:**

- Line length: 100 characters
- Uses double quotes (Black default)

**What it does:**

- Reformats code to consistent style
- Normalizes whitespace, indentation, line breaks
- **Note**: Black makes changes automatically (not just warnings)

### 2. isort - Import Organizer

Automatically sorts and organizes Python imports.

**Configuration:**

- Profile: `black` (compatible with Black)
- Line length: 100 characters

**What it does:**

- Groups imports: future, stdlib, third-party, local
- Sorts alphabetically within groups
- Removes duplicate imports
- **Note**: Makes changes automatically

### 3. Flake8 - Linter

Checks for logical errors and style violations.

**Configuration:**

```
max-line-length = 100
extend-ignore = E203, E266, E501, W503
```

**What it does:**

- Checks for undefined variables
- Finds unused imports
- Detects logic errors
- Reports style violations
- **Note**: Only warns, doesn't auto-fix

### 4. General Checks

Additional hooks from `pre-commit/pre-commit-hooks`:

- Check YAML/JSON syntax
- Check for merge conflicts
- Trim trailing whitespace
- Fix end-of-file newlines
- Verify Python syntax (AST)
- Validate TOML files

## Workflow

### Normal Workflow (Automatic)

```bash
# Make changes to Python files
git add src/backend/app.py

# Attempt commit
git commit -m "feat(backend): add new feature"

# Pre-commit hooks run automatically:
# 1. Black formats the code
# 2. isort organizes imports
# 3. Flake8 checks for issues
# 4. If all pass, commit succeeds
# 5. If any fail, commit is rejected
```

### If Commit Fails

Pre-commit may modify files (Black, isort) or report issues (Flake8):

```bash
# Some files were modified by Black/isort
# Review the changes
git diff

# Stage the changes
git add .

# Retry commit
git commit -m "feat(backend): add new feature"
```

## Manual Hook Execution

### Run all hooks on all files

```bash
pre-commit run --all-files
```

### Run specific hook

```bash
pre-commit run black --all-files
pre-commit run flake8 --all-files
pre-commit run isort --all-files
```

### Run hooks on staged files only

```bash
pre-commit run
```

## Bypass Hooks (Not Recommended)

If absolutely necessary:

```bash
git commit --no-verify
```

**Note**: This bypasses all pre-commit checks and should be avoided.

## Updating Hooks

Update all hooks to latest versions:

```bash
pre-commit autoupdate
```

Update specific hook:

```bash
pre-commit autoupdate --repo https://github.com/psf/black
```

## Configuration

Pre-commit configuration is in `.pre-commit-config.yaml`:

```yaml
repos:
  - repo: local
    hooks:
      - id: black # Code formatter
      - id: isort # Import sorter
      - id: flake8 # Linter

  - repo: https://github.com/pre-commit/pre-commit-hooks
    hooks:
      - id: check-yaml
      - id: check-json
      # ... more checks
```

## Python Code Standards

### Line Length

Maximum 100 characters (enforced by Black and Flake8).

Good:

```python
def long_function_name(param1, param2, param3):
    result = some_calculation(
        param1,
        param2,
        param3
    )
    return result
```

Bad:

```python
def long_function_name(param1, param2, param3):
    result = some_calculation(param1, param2, param3); return result
```

### Import Order

isort enforces this order:

```python
from __future__ import annotations

import os
import sys
from typing import Optional

import numpy as np
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel

from ..config import settings
from .utils import helper_function
```

### Code Style (Black)

Black enforces consistent style:

```python
# Correct (Black style)
def greet(name: str) -> str:
    """Return a greeting."""
    message = f"Hello, {name}!"
    return message

# Black will change this:
def greet(name:str)->str:
    '''Return a greeting.'''
    message = f'Hello, {name}!'
    return message
```

## Troubleshooting

### "pre-commit hook failed"

**Issue**: Black formatted files differently than expected

**Solution**: Review the changes, stage them, and retry commit

```bash
git diff
git add .
git commit -m "same message"
```

### Flake8 errors (E501 - line too long)

This shouldn't happen since Black enforces 100 char limit. If it does:

```bash
# Black should fix it
black src/backend/

# Then stage and commit
git add .
git commit -m "your message"
```

### "isort thinks I made a syntax error"

isort may misidentify imports in some edge cases.

**Solution**: Check the import syntax, or disable isort for that file:

```python
# isort: skip_file
```

### Hooks not running

**Solution**: Verify hooks are installed

```bash
pre-commit install
cat .git/hooks/pre-commit
```

### Performance issues

Pre-commit initializes environments (slow on first run). Subsequent runs are faster.

**Tip**: Use `pre-commit run --all-files` during development to find issues early.

## CI/CD Integration

In GitHub Actions:

```yaml
- name: Run pre-commit hooks
  run: pre-commit run --all-files
```

## See Also

- [Pre-commit Official Docs](https://pre-commit.com/)
- [CODE_STYLE_GUIDE.md](../CODE_STYLE_GUIDE.md) - Complete style guide
- [Black Documentation](https://black.readthedocs.io/)
- [Flake8 Documentation](https://flake8.pycqa.org/)
- [isort Documentation](https://pycqa.github.io/isort/)
