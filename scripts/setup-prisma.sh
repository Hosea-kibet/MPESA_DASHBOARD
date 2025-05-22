# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Check if the generation was successful
if [ $? -eq 0 ]; then
  echo "Prisma client generated successfully!"
else
  echo "Failed to generate Prisma client. Please check your Prisma schema."
  exit 1
fi

echo "Setup complete!"
