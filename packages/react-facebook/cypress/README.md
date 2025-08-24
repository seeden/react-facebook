# Testing Setup for React Facebook Library

This directory contains the modern Cypress testing setup for the React Facebook library.

## Testing Structure

```
cypress/
├── component/           # Component tests (isolated)
│   ├── Share.cy.tsx    # Share & ShareButton tests (EU compatible)
│   ├── Page.cy.tsx     # Facebook Page widget tests (EU compatible)
│   ├── EmbeddedPost.cy.tsx # Posts & Videos (EU compatible)
│   ├── Like.cy.tsx     # Like & Comments (EU restricted)
│   ├── Login.cy.tsx    # Login functionality tests
│   └── Site.cy.tsx     # Integration tests (multiple components)
├── e2e/                # End-to-end tests (full integration)
├── support/            # Test utilities and configuration
│   ├── commands.ts     # Custom Cypress commands
│   ├── component.ts    # Component test setup with real FB SDK
│   └── e2e.ts         # E2E test setup
└── README.md          # This file
```

## Available Test Commands

```bash
# Development (opens Cypress UI)
npm run test                    # Open Cypress (default)
npm run test:component         # Open component tests only
npm run test:e2e              # Open e2e tests only

# CI/CD (headless)
npm run test:run              # Run all tests headlessly
npm run test:component:run    # Run component tests only
npm run test:e2e:run         # Run e2e tests only
npm run test:ci              # Build + run component tests (for CI)
```

## Component Tests

Component tests run **isolated** with a **mocked Facebook SDK**:

- Import from `../../src/index` (not dist)
- Facebook SDK is automatically mocked
- Fast execution, no external dependencies
- Perfect for testing component logic and rendering

Example:
```typescript
import { Like, FacebookProvider } from '../../src/index';

it('should render Like button', () => {
  cy.mount(
    <FacebookProvider appId="test-app-id">
      <Like href="https://example.com" data-testid="like-btn" />
    </FacebookProvider>
  );
  
  cy.get('[data-testid="like-btn"]').should('be.visible');
  cy.get('.fb-like').should('have.attr', 'data-href', 'https://example.com');
});
```

## E2E Tests

E2E tests run with **real or mocked Facebook SDK**:

- Test full user workflows
- Can include real Facebook integration (with test app)
- Slower but more comprehensive
- Test cross-component interactions

## Custom Commands

### Component Testing
- `cy.waitForFacebookSDK()` - Wait for FB SDK (auto-mocked in component tests)
- `cy.waitForFacebookWidget(selector)` - Wait for widget to render
- `cy.mockFacebookAPI(endpoint, response)` - Mock specific FB API calls

### E2E Testing
- `cy.loadFacebookSDK()` - Load real Facebook SDK
- `cy.mockFacebookLogin(status)` - Mock login responses

## Real Facebook SDK Testing

Component tests use the **real Facebook SDK** loaded from `connect.facebook.net`:

```javascript
// Real Facebook SDK is loaded in beforeEach
window.fbAsyncInit = function() {
  window.FB.init({
    appId: '671184534658954',
    version: 'v19.0',
    xfbml: true,
    cookie: true,
    status: true
  });
};
```

**Benefits:**
- ✅ Tests real Facebook behavior
- ✅ Catches API changes
- ✅ Validates actual widget rendering
- ✅ Tests integration with Facebook servers

**Limitations:**
- ⚠️ EU region restrictions for Like/Comments
- ⚠️ Requires internet connection
- ⚠️ Slower than mocked tests

## Best Practices

### Component Tests
1. Use `data-testid` attributes for reliable selectors
2. Test component props and rendering
3. Mock external API calls
4. Keep tests fast and focused

### E2E Tests
1. Test real user workflows
2. Use actual Facebook test app when possible
3. Test error scenarios and edge cases
4. Include visual regression testing

### General
1. Use TypeScript for all tests
2. Follow the existing test patterns
3. Add proper assertions and waits
4. Document complex test scenarios

## Configuration Files

- `cypress.config.ts` - Main Cypress configuration
- `cypress/tsconfig.json` - TypeScript config for tests
- `vite.config.ts` - Vite config for component testing
- `cypress/support/component-index.html` - HTML template for component tests

## EU Region Testing Notes

**Like & Comments components** are restricted in EU due to GDPR:
- ❌ Like buttons may not render without login + consent
- ❌ Comments widgets may not render without login + consent  
- ✅ Share, Page, EmbeddedPost work fine in EU

**Solutions:**
1. **Use VPN** to test from non-EU region (US, Asia)
2. **Test with login** - Like/Comments work after Facebook login
3. **Focus on EU-compatible components** for main testing
4. **Use CI/CD outside EU** for full component testing

## Troubleshooting

### Tests importing from dist/
❌ `import { Like } from '../../dist/esm/index'`
✅ `import { Like } from '../../src/index'`

### Like/Comments not rendering
- Check if you're in EU region (GDPR restrictions)
- Try with VPN to US/Asia region
- Test after Facebook login
- Use Share/Page components instead

### Facebook SDK loading issues
- Check internet connection
- Verify Facebook app ID is valid
- Check browser console for errors
- Ensure `connect.facebook.net` is accessible

### TypeScript errors
- Make sure `cypress/tsconfig.json` extends the main tsconfig
- Install proper type definitions
- Use the custom command types

### Slow tests
- Facebook SDK loading adds ~2-3 seconds per test
- Use `.skip()` for EU-restricted tests when in Europe
- Consider regional test execution strategies