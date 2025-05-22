echo "Setting up environment for Docker..."

# Remove package-lock.json to force regeneration
rm -f package-lock.json

# Install dependencies and generate a fresh package-lock.json
npm install

# Generate Prisma client
npx prisma generate

echo "Setup complete! You can now run 'docker-compose build'"
