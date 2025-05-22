echo "Fixing CSS issues..."

# Remove .next directory to clear cache
rm -rf .next

# Clean node_modules/.cache
rm -rf node_modules/.cache

# Reinstall Tailwind and PostCSS
npm install -D tailwindcss postcss autoprefixer

# Generate a new tailwind.config.js file
npx tailwindcss init -p

# Ensure globals.css is properly set up
echo "Checking globals.css..."

# Restart the development server
echo "Please restart your development server with:"
echo "npm run dev"

echo "CSS fix complete!"
