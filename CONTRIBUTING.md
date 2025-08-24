# Contributing to React Facebook

Thank you for your interest in contributing to React Facebook! This guide will help you get started with contributing to our project.

## 🚀 Quick Start

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Install dependencies** with `npm install`
4. **Create a feature branch** from `master`
5. **Make your changes** and add tests
6. **Run tests** to ensure everything works
7. **Submit a pull request**

## 📋 Table of Contents

- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Documentation](#documentation)
- [Pull Request Process](#pull-request-process)
- [Code Style Guidelines](#code-style-guidelines)
- [Component Development](#component-development)
- [Bug Reports](#bug-reports)
- [Feature Requests](#feature-requests)

## 🏗 Development Setup

### Prerequisites

- **Node.js** 18+ and **npm** 8+
- **Git** for version control
- A **Facebook App ID** for testing (create one at [Facebook Developers](https://developers.facebook.com))

### Installation

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/react-facebook.git
cd react-facebook

# Install dependencies (this will install for all packages)
npm install

# Build the react-facebook package
npm run build

# Start the documentation development server
npm run dev:docs
```

### Development Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Build the react-facebook package |
| `npm run dev:docs` | Start documentation dev server at http://localhost:3000 |
| `npm run test` | Run all tests |
| `npm run test:component` | Run Cypress component tests |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run lint` | Run code linting |

## 📁 Project Structure

```
react-facebook/
├── packages/
│   └── react-facebook/          # Main library package
│       ├── src/
│       │   ├── components/      # React components
│       │   ├── hooks/          # Custom React hooks
│       │   ├── utils/          # Utility functions
│       │   └── constants/      # Type definitions and constants
│       ├── cypress/            # Component tests
│       ├── package.json        # Package configuration
│       └── README.md          # Package documentation
├── apps/
│   └── docs/                   # Documentation website
│       ├── app/               # Next.js pages
│       ├── components/        # Doc-specific components
│       └── package.json       # Docs configuration
├── examples/                   # Usage examples
└── .github/                   # GitHub Actions workflows
```

## 🔄 Making Changes

### 1. Create a Feature Branch

```bash
# Create and switch to a new branch
git checkout -b feature/amazing-new-component
# or
git checkout -b fix/specific-bug-description
```

### 2. Development Workflow

1. **Make your changes** in the appropriate package
2. **Add or update tests** for your changes
3. **Update documentation** if needed
4. **Test your changes** thoroughly
5. **Commit your changes** with clear messages

### 3. Commit Message Format

Use clear, descriptive commit messages:

```bash
# Good examples
git commit -m "Add FacebookPixel component with tracking support"
git commit -m "Fix useLogin hook memory leak on unmount"
git commit -m "Update LoginButton component to support custom render"
git commit -m "Add comprehensive tests for Share component"

# Include breaking changes
git commit -m "BREAKING: Remove deprecated render prop from FacebookLogin"
```

## 🧪 Testing

We use **Cypress** for component testing with real Facebook integration.

### Running Tests

```bash
# Run all component tests
npm run test:component

# Open Cypress UI for interactive testing
npm run test:component:open

# Run specific test file
npm run test:component -- --spec="cypress/component/LoginButton.cy.tsx"

# Run tests for specific component pattern
npm run test:component -- --spec="cypress/component/*Login*"
```

### Writing Tests

Create test files in `packages/react-facebook/cypress/component/`:

```typescript
// cypress/component/MyComponent.cy.tsx
import { mount } from 'cypress/react18'
import { FacebookProvider, MyComponent } from '../..'

describe('MyComponent', () => {
  it('should render correctly', () => {
    mount(
      <FacebookProvider appId="123456789">
        <MyComponent />
      </FacebookProvider>
    )
    
    cy.get('[data-cy=my-component]').should('be.visible')
  })

  it('should handle Facebook SDK interaction', () => {
    mount(
      <FacebookProvider appId="123456789">
        <MyComponent />
      </FacebookProvider>
    )
    
    // Test Facebook SDK interactions
    cy.window().should('have.property', 'FB')
  })
})
```

### Test Guidelines

- **Test user interactions**, not implementation details
- **Use real Facebook App ID** (671184534658954) for integration tests
- **Mock external API calls** when appropriate
- **Test error scenarios** and edge cases
- **Add accessibility tests** when relevant

## 📚 Documentation

### README Updates

When adding new components or features:

1. **Update the Available Components list** with clickable links
2. **Add usage examples** in appropriate sections
3. **Include TypeScript examples** with proper typing
4. **Update Table of Contents** if needed

### Interactive Documentation

The docs site (`apps/docs/`) includes:

- **Live playground** with all components
- **Interactive examples** with prop controls
- **Complete API reference**
- **Real Facebook integration**

To add a new component to the playground:

1. **Add to playground page** (`apps/docs/app/playground/page.tsx`)
2. **Create prop controls** for interactive testing
3. **Add to API reference** (`apps/docs/app/api/page.tsx`)
4. **Test with real Facebook App ID**

## 🔀 Pull Request Process

### Before Submitting

- [ ] **Tests pass** - All existing and new tests pass
- [ ] **TypeScript compiles** - No type errors
- [ ] **Documentation updated** - README, API docs, examples
- [ ] **Examples work** - Test with real Facebook integration
- [ ] **No breaking changes** without proper notice

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Added/updated tests
- [ ] All tests pass
- [ ] Tested with real Facebook integration

## Documentation
- [ ] Updated README
- [ ] Updated API docs
- [ ] Added examples

## Checklist
- [ ] Self-review completed
- [ ] TypeScript types updated
- [ ] No breaking changes (or properly documented)
```

### Review Process

1. **Automated checks** - CI runs tests, type checking, builds
2. **Code review** - Maintainers review code and approach
3. **Testing** - Ensure examples work with real Facebook integration
4. **Documentation review** - Check README and docs accuracy
5. **Merge** - After approval and passing checks

## 🎨 Code Style Guidelines

### TypeScript

- **Use strict TypeScript** - Properly type all props and return values
- **Prefer interfaces** over types for component props
- **Export types** that might be useful to consumers
- **Use generics** where appropriate for flexibility

```typescript
// Good
export interface FacebookLoginProps {
  appId?: string;
  onSuccess?: (response: LoginResponse) => void;
  onFail?: (error: Error) => void;
  children?: ReactNode | ((props: RenderProps) => ReactElement);
}

// Export useful types
export type LoginResponse = {
  authResponse: AuthResponse;
  status: LoginStatus;
};
```

### React Components

- **Use function components** with hooks
- **Implement proper error boundaries** where needed
- **Follow React best practices** - proper dependencies, cleanup
- **Use descriptive prop names** and provide defaults

```typescript
// Good component structure
export default function FacebookLogin(props: FacebookLoginProps) {
  const {
    onSuccess,
    onFail,
    children,
    scope = 'public_profile,email',
    ...rest
  } = props;

  // Hooks and logic here
  
  // Children as function pattern
  if (typeof children === 'function') {
    return children({ onClick: handleLogin, isLoading, isDisabled });
  }

  // Default rendering
  return <button onClick={handleLogin} {...rest}>{children}</button>;
}
```

### Hooks

- **Follow React hooks rules** - conditional calls, dependencies
- **Provide comprehensive return values** with clear naming
- **Handle loading and error states** consistently
- **Clean up resources** in useEffect cleanup functions

```typescript
export function useLogin(): LoginHookReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>();

  const login = useCallback(async (options: LoginOptions) => {
    try {
      setIsLoading(true);
      setError(undefined);
      // Login logic
      return response;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { login, isLoading, error };
}
```

## 🧩 Component Development

### Creating a New Component

1. **Create component file** in `packages/react-facebook/src/components/`
2. **Define TypeScript interface** for props
3. **Implement component** with proper Facebook SDK integration
4. **Add to exports** in `packages/react-facebook/src/components/index.ts`
5. **Write component tests**
6. **Update documentation**
7. **Add to playground**

### Component Checklist

- [ ] **TypeScript interface** with proper prop types
- [ ] **Default props** where appropriate  
- [ ] **Error handling** for Facebook SDK errors
- [ ] **Loading states** for async operations
- [ ] **Accessibility attributes** (ARIA labels, roles)
- [ ] **Forward refs** if component wraps DOM elements
- [ ] **Component tests** with real integration
- [ ] **Documentation examples** in README
- [ ] **Playground integration** for interactive testing

### Facebook SDK Integration

- **Always check SDK availability** before calling Facebook methods
- **Handle SDK loading errors** gracefully
- **Use proper Facebook SDK patterns** - initialization, parsing, etc.
- **Test with real Facebook App ID** to ensure compatibility

```typescript
// Example SDK integration pattern
export default function MyFacebookComponent() {
  const { api, isLoading } = useFacebook();
  
  const handleAction = useCallback(async () => {
    if (!api) {
      console.warn('Facebook SDK not available');
      return;
    }
    
    try {
      const response = await api.ui({
        method: 'share',
        href: 'https://example.com',
      });
      console.log('Share successful:', response);
    } catch (error) {
      console.error('Share failed:', error);
    }
  }, [api]);

  if (isLoading) {
    return <div>Loading Facebook SDK...</div>;
  }

  return <button onClick={handleAction}>Share</button>;
}
```

## 🐛 Bug Reports

### Before Reporting

- **Search existing issues** to avoid duplicates
- **Try with latest version** to ensure bug still exists
- **Test with minimal reproduction** case
- **Check if it's a Facebook SDK limitation**

### Bug Report Template

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- react-facebook version: x.x.x
- React version: x.x.x
- Browser: Chrome/Firefox/Safari
- Facebook SDK version: (if relevant)

## Minimal Reproduction
Code snippet or CodeSandbox link

## Additional Context
Screenshots, console errors, etc.
```

## 💡 Feature Requests

### Before Requesting

- **Check existing issues** for similar requests
- **Consider if it fits** the project scope
- **Think about breaking changes** and backwards compatibility
- **Provide use case justification**

### Feature Request Template

```markdown
## Feature Description
Clear description of the proposed feature

## Use Case
Why is this feature needed? What problem does it solve?

## Proposed API
How would the feature be used?

```typescript
// Example usage
<NewComponent 
  prop1="value"
  onAction={handleAction}
/>
```

## Implementation Ideas
Any thoughts on how to implement this?

## Alternatives Considered
Other ways to solve this problem?
```

## 🤝 Community Guidelines

- **Be respectful** and constructive in all interactions
- **Help others** learn and contribute
- **Follow the code of conduct**
- **Share knowledge** through issues and discussions
- **Celebrate contributions** from all community members

## 📞 Getting Help

- **Documentation**: [https://seeden.github.io/react-facebook](https://seeden.github.io/react-facebook)
- **Issues**: [GitHub Issues](https://github.com/seeden/react-facebook/issues)
- **Discussions**: [GitHub Discussions](https://github.com/seeden/react-facebook/discussions)

## 🎉 Recognition

Contributors are recognized in:
- **README acknowledgments**
- **Release notes** for significant contributions
- **GitHub contributors list**

Thank you for contributing to React Facebook! 🚀

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.