# WebDev Clients Feedback Platform

A modern web application for collecting and managing client feedback and reviews.

## Features

- Public review submission
- Admin dashboard with analytics
- Review management system
- Rating and service-based filtering
- Export functionality (Excel, PDF)
- Responsive design
- Secure authentication

## Tech Stack

- **Frontend**: Vue.js, Nuxt 3, TailwindCSS
- **Backend**: Node.js, Nuxt Server
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/tauraijob/webdev-clients-feedback.git
cd webdev-clients-feedback
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Set up the database
```bash
npx prisma migrate dev
npm run seed
```

5. Run the development server
```bash
npm run dev
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run seed` - Seed the database
- `npm run create-admin` - Create admin user

## License

MIT License
