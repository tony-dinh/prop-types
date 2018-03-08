#!/bin/bash
ROOT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"

# Clear existing build folder
echo -e "🗑 Cleaning '/dist'...\n"
rm -rf $ROOT_DIR/dist

# Transpile Components & Utilities
echo -e "📝 Transpiling...\n"
./node_modules/.bin/babel ./src -x ".js",".jsx" --ignore "*.test.js","test.js" --out-dir dist/
