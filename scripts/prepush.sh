#!/bin/bash

# Run linting
npm run lint || exit 1

# Run TypeScript type checking
npm run tsc --noEmit || exit 1

# Run tests
npm test --runInBand || exit 1

# Check for unused exports
npx ts-prune --error || exit 1

# Check for unused dependencies
npx depcheck --ignores="@types/*" || exit 1 