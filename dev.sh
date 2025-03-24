#!/bin/bash
# This script runs Next.js directly without using npm scripts
echo "Running Next.js directly..."
# Explicitly override any flags
NODE_OPTIONS='' npx next dev 