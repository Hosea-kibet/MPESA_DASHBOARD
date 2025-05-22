echo "Fixing CSS issues..."

# Remove .next directory to clear cache
rm -rf .next

# Clean node_modules/.cache
rm -rf node_modules/.cache

# Reinstall dependencies
npm install

# Copy globals.css to public directory for direct access
mkdir -p public
cp app/globals.css public/

# Rebuild the application
npm run build

echo "CSS fix complete! Please restart your development server with 'npm run dev'"
