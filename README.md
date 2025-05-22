# M-Pesa Dashboard

A comprehensive dashboard for managing M-Pesa payments with STK push functionality.

## Features

- Customer management
- Payment tracking across different M-Pesa channels (Till, Paybill, USSD)
- STK push payment initiation
- Transaction analytics and reporting
- Docker containerization for easy deployment

## Tech Stack

- Next.js 14 (App Router)
- PostgreSQL
- Prisma ORM
- Docker & Docker Compose
- Tailwind CSS
- shadcn/ui components
- Recharts for data visualization

## Getting Started

### Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- M-Pesa API credentials (for production use)

### Setup with Docker

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/mpesa-dashboard.git
   cd mpesa-dashboard
   \`\`\`

2. Create a `.env` file based on `.env.example`:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

3. Update the `.env` file with your M-Pesa API credentials.

4. Start the application with Docker Compose:
   \`\`\`bash
   docker-compose up -d
   \`\`\`

5. The application will be available at http://localhost:3000

### Local Development Setup

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/mpesa-dashboard.git
   cd mpesa-dashboard
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Create a `.env` file based on `.env.example`:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

4. Update the `.env` file with your database and M-Pesa API credentials.
   - For local development, use: `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mpesa_dashboard`

5. Start the PostgreSQL database with Docker:
   \`\`\`bash
   docker-compose up -d postgres
   \`\`\`

6. Generate Prisma client:
   \`\`\`bash
   npx prisma generate
   \`\`\`
   

7. Run database migrations:
   \`\`\`bash
   npx prisma migrate dev
   \`\`\`

8. Seed the database with sample data:
   \`\`\`bash
   npm run prisma:seed
   \`\`\`

9. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

10. The application will be available at http://localhost:3000

## Troubleshooting

### Prisma Client Generation Issues

If you encounter errors related to the Prisma client, such as:

\`\`\`
Cannot find module '.prisma/client/default'
\`\`\`

Run the following commands to fix the issue:

\`\`\`bash
# Generate Prisma client
npx prisma generate

# If you're using Docker, you might need to rebuild the container
npm run docker:build
\`\`\`

### Database Connection Issues

If you're having trouble connecting to the database:

1. Make sure your PostgreSQL server is running
2. Check that your `.env` file has the correct `DATABASE_URL`
3. Try running the migrations manually:

\`\`\`bash
npx prisma migrate deploy
\`\`\`

4. If you're using Docker, make sure the PostgreSQL container is running:

\`\`\`bash
docker-compose ps
\`\`\`

### React Hooks Errors

If you see errors related to React hooks, it's often a side effect of other issues. Try:

1. Clearing your Next.js cache:

\`\`\`bash
rm -rf .next
\`\`\`

2. Reinstalling dependencies:

\`\`\`bash
rm -rf node_modules
npm install
\`\`\`

## Database Setup

The application uses PostgreSQL as the database. When running with Docker Compose, a PostgreSQL container is automatically created and configured.

### Database Schema

The database includes the following tables:
- `customers` - Customer information
- `payment_channels` - M-Pesa payment channels (Till, Paybill, USSD)
- `transactions` - Transaction records
- `stk_requests` - STK push request records

### Database Management

You can connect to the PostgreSQL database using any PostgreSQL client with these credentials:
- Host: localhost
- Port: 5432
- Database: mpesa_dashboard
- Username: postgres
- Password: postgres

## M-Pesa Integration

This application integrates with the M-Pesa API for STK push functionality. To use this feature:

1. Register for M-Pesa API access on the Safaricom Developer Portal
2. Create a Daraja app to get your Consumer Key and Secret
3. Set up your callback URL (must be publicly accessible)
4. Update your `.env` file with the credentials

### Setting Up the Callback URL

M-Pesa requires a publicly accessible HTTPS URL to send payment notifications. Here's how to set it up:

#### For Production

1. Deploy your application to a hosting platform like Vercel, Netlify, or a VPS
2. Set your callback URL in the `.env` file:
   \`\`\`
   MPESA_CALLBACK_URL=https://your-domain.com/api/mpesa/callback
   \`\`\`
3. Make sure this URL is also registered in your Daraja app settings

#### For Development

During development, you need to expose your local server to the internet. You can use ngrok:

1. Install ngrok:
   \`\`\`bash
   npm install -g ngrok
   \`\`\`

2. Start your Next.js app:
   \`\`\`bash
   npm run dev
   \`\`\`

3. In a new terminal, run:
   \`\`\`bash
   ngrok http 3000
   \`\`\`

4. Copy the HTTPS URL provided by ngrok (e.g., https://a1b2c3d4.ngrok.io)

5. Set your callback URL in the `.env` file:
   \`\`\`
   MPESA_CALLBACK_URL=https://a1b2c3d4.ngrok.io/api/mpesa/callback
   \`\`\`

6. Make sure this URL is also registered in your Daraja app settings

7. Test your callback URL by visiting:
   \`\`\`
   https://a1b2c3d4.ngrok.io/api/mpesa/callback
   \`\`\`
   You should see a success message if it's properly configured.

## Docker Deployment

The application is containerized and can be easily deployed to any environment that supports Docker:

\`\`\`bash
# Build and start containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
\`\`\`

## License

This project is licensed under the MIT License - see the LICENSE file for details.
