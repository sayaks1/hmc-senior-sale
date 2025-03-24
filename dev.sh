#!/bin/bash
# This script runs Next.js directly without using npm scripts
echo "Starting Next.js development server..."
# Clear any environment variables that might be adding flags
unset NODE_OPTIONS
# Run Next.js directly without any flags
npx next dev 