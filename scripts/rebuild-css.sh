echo "Rebuilding CSS..."

# Remove .next directory to clear cache
rm -rf .next

# Clean node_modules/.cache
rm -rf node_modules/.cache

# Reinstall tailwind and postcss
npm install -D tailwindcss postcss autoprefixer

# Generate tailwind.css
npx tailwindcss -i ./app/globals.css -o ./app/output.css

echo "CSS rebuild complete!"
