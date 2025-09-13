# Claude Code Documentation Context

## Overview

The `.claude-docs-context.md` file is a special configuration file used by Claude Code to provide contextual information about your project. This file helps Claude understand your project structure, preferences, and specific requirements, enabling more accurate and helpful assistance.

## Purpose

This file serves as a "knowledge base" that:
- Provides project-specific context to Claude Code
- Documents coding standards and conventions
- Lists important project configurations
- Explains project architecture and patterns
- Helps Claude provide more targeted assistance

## Location

The file should be placed in your project root directory:
```
your-project/
├── .claude-docs-context.md  ← This file
├── package.json
├── src/
└── ...
```

## Structure and Content

### Recommended Sections

1. **Project Overview**
   - Brief description of the project
   - Technology stack
   - Main purpose and goals

2. **Architecture**
   - Key architectural decisions
   - Folder structure explanation
   - Component organization

3. **Coding Standards**
   - Style preferences
   - Naming conventions
   - Code organization patterns

4. **Configuration Notes**
   - Important config files and their purposes
   - Environment-specific settings
   - Build and deployment notes

5. **Common Tasks**
   - Frequently needed operations
   - Build commands
   - Testing procedures

## Example Content

```markdown
# Project Context

## Tech Stack
- Framework: Qwik City
- Styling: SCSS + Tailwind-like variables
- Build: Vite
- Deployment: GitHub Pages

## Key Conventions
- Use TypeScript for all new files
- Component files should use PascalCase
- Prefer functional components with hooks
- Use CSS modules for component-specific styles

## Important Files
- `vite.config.ts`: Main build configuration
- `src/lib/gallery.ts`: Gallery data management
- `public/images/`: Static assets
```

## Benefits

### For Claude Code
- Understands your project's specific context
- Provides more accurate code suggestions
- Follows your established patterns
- Avoids suggesting incompatible solutions

### For Development Team
- Documents project knowledge in one place
- Helps onboard new team members
- Maintains consistency across the codebase
- Serves as a quick reference guide

## Best Practices

1. **Keep it Updated**
   - Update when making architectural changes
   - Add notes about new conventions
   - Document lessons learned

2. **Be Specific**
   - Include concrete examples
   - Mention specific file paths
   - Note version-specific details

3. **Focus on Context**
   - Explain *why* decisions were made
   - Note any constraints or requirements
   - Highlight project-specific patterns

4. **Regular Review**
   - Review during code reviews
   - Update during refactoring
   - Ensure accuracy over time

## Usage with Claude Code

When working with Claude Code, the content of this file is automatically considered when:
- Asking for code assistance
- Requesting architectural advice
- Getting help with debugging
- Planning new features

Claude Code will refer to this context to provide more relevant and project-appropriate suggestions.

## Example for This Project

For the KPS Interiéry project, key context includes:
- Qwik City framework with static generation
- GitHub Pages deployment with base path `/KPS-interiery/`
- AVIF-optimized gallery images
- Component-based architecture
- SCSS styling with CSS custom properties

This context helps Claude understand why certain path configurations and image handling patterns are necessary for proper deployment.

## Maintenance

- Update when adding new major features
- Document important bug fixes and their contexts
- Note any deployment-specific configurations
- Keep examples current with the actual codebase

The `.claude-docs-context.md` file is a living document that grows with your project and becomes an invaluable resource for maintaining code quality and consistency.