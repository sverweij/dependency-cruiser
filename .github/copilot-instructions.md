# GitHub Copilot Instructions for dependency-cruiser

These instructions help GitHub Copilot generate code that aligns with the dependency-cruiser project's conventions. Keep responses brief and focused on the task at hand.

## Communication Style

- Provide concise responses without unnecessary elaboration
- Focus on code solutions rather than lengthy explanations
- Use bullet points for multi-part information when appropriate
- Avoid repetition of information already visible in the code

## Module System

- Use ECMAScript Modules (ESM) with `.mjs` file extensions for new code
- Use CommonJS with `.cjs` for backward compatibility when needed
- Include explicit file extensions in imports (`.mjs` or `.cjs`)
- Use the `#` import alias for internal modules (e.g., `import xyz from "#config-utl/extract-depcruise-config.mjs"`)

## File Organization

- Source code is located in `/src` directory, organized in feature-specific subdirectories
- Tests are in `/test` directory, mirroring the structure of `/src`
- Test files have the same name as the file they test with a `.spec.mjs` extension
- Place test files in the same directory structure as the source files

## Code Style & Formatting

### Naming & Coding Conventions

- Variables/functions: camelCase
- Classes: PascalCase
- Parameters: prefix with `p` (e.g., `pOptions`)
- Local variables: prefix with `l` (e.g., `lVersion`)
- Constants: UPPER_SNAKE_CASE
- Boolean functions: use `is`/`has` prefixes
- Strings: double quotes
- Line length: ~80 characters
- Prefer `const` over `let`
- Use semicolons
- Use ES6+ features (arrow functions, destructuring)

## Documentation

### JSDoc

- Use JSDoc for public functions, classes, and methods
- Include `@param`, `@returns`, and `@throws` tags
- Use TypeScript-style type annotations
- Use `@typedef` for complex types

Example:
```javascript
/**
 * Function description
 *
 * @param {string} pModuleName - Description of parameter
 * @param {object} [pOptions] - Options object (square brackets denote optional)
 * @param {string} [pOptions.semanticVersion] - A semantic version range
 * @returns {Promise<NodeModule|false>} - Description of return value
 * @throws {Error} - When something goes wrong
 */
```

## Testing

### Mocha Testing Framework

- Tests use Mocha (note the `describe`, `it`, `beforeEach`, `afterEach` syntax)
- Use Node.js built-in `assert` library for assertions (`import { deepEqual, ok } from "node:assert/strict"`)
- Group related tests in `describe` blocks
- Use meaningful test descriptions that explain what's being tested
- When appropriate, use `beforeEach`/`afterEach` hooks for setup and teardown
- Test both success and error cases

Example test structure:
```javascript
import { deepEqual, ok } from "node:assert/strict";
import functionToTest from "#path/to/function.mjs";

describe("[I] module/functionToTest", () => {
  it("should handle normal case", () => {
    const result = functionToTest(input);
    deepEqual(result, expectedOutput);
  });

  it("throws when given invalid input", () => {
    let error = null;
    try {
      functionToTest(invalidInput);
    } catch (pError) {
      error = pError;
    }
    ok(error instanceof Error);
  });
});
```

## Error Handling

- Prefer try/catch blocks for error handling, especially with async operations
- Return `false` or null for expected failure conditions instead of throwing (see `tryImport` pattern)
- Use descriptive error messages that help pinpoint the issue
- Use appropriate error types when throwing

## Types

- The project uses JSDoc comments with TypeScript-style types
- Type definitions are stored in the `/types` directory with `.d.mts` extensions
- Import types from type definition files where needed
- Use TypeScript annotations in JSDoc comments where appropriate

## Dependencies and Imports

- Import statements should be ordered:
  1. Node.js built-in modules (prefixed with `node:`)
  2. External dependencies
  3. Internal modules (using the `#` alias)
- Use named imports where appropriate
- Use async import() for dynamic imports

## Best Practices

- Write pure functions where possible
- Avoid side effects
- Use early returns to reduce nesting
- Apply the single responsibility principle
- Be mindful of performance, especially for operations that may run on large dependency trees
- Write defensive code that handles edge cases gracefully
- For optional features/dependencies, use the `tryImport` pattern to check availability
