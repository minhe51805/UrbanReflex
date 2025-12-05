# Contributing to UrbanReflex

First off, thank you for considering contributing to UrbanReflex! It's people like you that make UrbanReflex such a great platform for smart city data visualization and air quality monitoring.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Workflow](#development-workflow)
- [Style Guidelines](#style-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

This project and everyone participating in it is governed by the [UrbanReflex Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.10+
- uv (Python package manager)
- Just (command runner)
- Git

### Local Development Setup

1. **Fork and clone the repository**

   ```bash
   git clone https://github.com/YOUR_USERNAME/UrbanReflex.git
   cd UrbanReflex
   ```

2. **Install dependencies**

   ```bash
   just setup
   ```

3. **Set up environment variables**

   ```bash
   just setup-env
   # Edit .env and .env.local with your API keys
   ```

4. **Run the development servers**

   ```bash
   # Terminal 1: Backend
   just backend-dev

   # Terminal 2: Frontend
   just frontend-dev
   ```

5. **Verify everything works**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8000
   - API Health: http://localhost:8000/health

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check [existing issues](https://github.com/minhe51805/UrbanReflex/issues) as you might find out that you don't need to create one.

**When you are creating a bug report, please include as many details as possible:**

- Use a clear and descriptive title
- Describe the exact steps which reproduce the problem
- Provide specific examples to demonstrate the steps
- Describe the behavior you observed after following the steps
- Explain which behavior you expected to see instead and why
- Include screenshots if possible

### Suggesting Enhancements

Enhancement suggestions are tracked as [GitHub issues](https://github.com/minhe51805/UrbanReflex/issues).

**When creating an enhancement suggestion, please include:**

- Use a clear and descriptive title
- Provide a step-by-step description of the suggested enhancement
- Provide specific examples to demonstrate the steps
- Describe the current behavior and explain which behavior you expected to see instead
- Explain why this enhancement would be useful

### Contributing Code

#### Areas for Contribution

- **Frontend (Next.js/React)**: UI/UX improvements, new visualizations
- **Backend (FastAPI)**: API endpoints, data processing
- **Data Integration**: New data sources, NGSI-LD entities
- **AI/ML**: Chatbot improvements, data analysis features
- **Infrastructure**: Docker, deployment, monitoring
- **Documentation**: README improvements, API docs, tutorials

## Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/feature-name` - Feature development
- `bugfix/bug-name` - Bug fixes
- `hotfix/fix-name` - Critical production fixes

### Workflow Steps

1. **Create a feature branch**

   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**

   - Follow coding standards
   - Add tests if applicable
   - Update documentation

3. **Test your changes**

   ```bash
   just test
   just backend-test
   just frontend-lint
   ```

4. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   # Create PR on GitHub targeting 'develop' branch
   ```

## Style Guidelines

### Python (Backend)

- Follow PEP 8 style guide
- Use type hints for function parameters and return values
- Use docstrings for classes and functions
- Maximum line length: 88 characters (Black formatter)

**Example:**

```python
async def get_air_quality_data(
    location: str,
    start_date: Optional[datetime] = None
) -> Dict[str, Any]:
    """
    Retrieve air quality data for a specific location.

    Args:
        location: Location identifier or name
        start_date: Optional start date for data range

    Returns:
        Dictionary containing air quality measurements
    """
    # Implementation here
```

### TypeScript/React (Frontend)

- Use TypeScript for all new code
- Follow React functional components with hooks
- Use Tailwind CSS for styling
- Use meaningful component and variable names

**Example:**

```typescript
interface AirQualityProps {
  location: string;
  measurements: AirQualityMeasurement[];
}

const AirQualityCard: React.FC<AirQualityProps> = ({
  location,
  measurements,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800">{location}</h3>
      {/* Component implementation */}
    </div>
  );
};
```

### File Organization

```
app/                    # Backend
├── routers/           # API route handlers
├── models/            # Data models
├── utils/             # Utility functions
└── ai_service/        # AI/ML services

website/               # Frontend
├── app/              # Next.js pages (App Router)
├── components/       # Reusable components
├── lib/             # Utilities and API clients
└── types/           # TypeScript definitions
```

## Commit Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

### Examples

```bash
git commit -m "feat: add real-time air quality alerts"
git commit -m "fix: resolve map clustering performance issue"
git commit -m "docs: update API authentication guide"
git commit -m "refactor: simplify data transformation pipeline"
```

## Pull Request Process

### Before Submitting

1. **Update documentation** if you've made changes to APIs
2. **Add tests** for new functionality
3. **Run the full test suite**
4. **Update CHANGELOG.md** with notable changes
5. **Rebase your branch** on the latest develop

### PR Requirements

- **Target the `develop` branch** (not main)
- **Clear title and description** explaining the changes
- **Reference related issues** using keywords (fixes #123)
- **Include screenshots** for UI changes
- **Ensure CI passes** (tests, linting, build)

### PR Template

When creating a PR, please use this template:

```markdown
## Description

Brief description of the changes made.

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing

- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] I have tested the changes in a local development environment

## Screenshots (if applicable)

## Checklist

- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
```

## Community

### Getting Help

- **GitHub Issues**: Bug reports and feature requests
- **Discussions**: General questions and community discussions
- **Documentation**: Check the [docs folder](docs/) for detailed guides

### Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes for significant contributions
- GitHub contributors page

## Development Tips

### Useful Just Commands

```bash
just --list              # See all available commands
just dev                 # Run both backend and frontend
just backend-dev         # Run only backend
just frontend-dev        # Run only frontend
just test               # Run all tests
just health             # Check service health
just setup              # Initial project setup
```

### Debugging

- **Backend logs**: Check terminal running `just backend-dev`
- **Frontend logs**: Check browser console and terminal
- **API testing**: Use `/docs` endpoint for Swagger UI
- **Database**: Use MongoDB Compass for data inspection

### Common Issues

1. **Port conflicts**: Make sure ports 3000 and 8000 are free
2. **Environment variables**: Ensure .env files are properly configured
3. **Dependencies**: Run `just install` if you encounter import errors

## License

By contributing to UrbanReflex, you agree that your contributions will be licensed under the terms of the [GNU General Public License v3.0](LICENSE).


---

Thank you for contributing to UrbanReflex! 🚀
