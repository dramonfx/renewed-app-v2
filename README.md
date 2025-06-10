# Renewed App v2

A modern Next.js application for the "Renewed: The New Man Story" digital guidebook and audiobook platform.

## Features

- 📖 Interactive digital guidebook with sections and chapters
- 🎵 Full audiobook player with chapter navigation
- 🔐 User authentication with Supabase
- 📱 Responsive design with Tailwind CSS
- 🎨 Modern glassmorphism UI design
- 🔒 Secure environment variable management

## Tech Stack

- **Framework**: Next.js 15.3.2 with App Router
- **Styling**: Tailwind CSS with custom brand colors
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: React Icons
- **Markdown**: React Markdown with GitHub Flavored Markdown
- **Testing**: Jest with React Testing Library

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone https://github.com/dramonfx/renewed-app-v2.git
cd renewed-app-v2
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── forgot-password/    # Password reset page
│   ├── login/             # Login page
│   ├── signup/            # Registration page
│   └── ...
├── components/            # Reusable React components
│   ├── AudioPlayer.jsx    # Audio player component
│   ├── Layout.jsx         # Main layout component
│   └── LoadingSpinner.jsx # Loading spinner component
├── contexts/              # React contexts
├── hooks/                 # Custom React hooks
├── lib/                   # Library configurations
│   └── supabaseClient.js  # Supabase client setup
├── utils/                 # Utility functions
├── constants/             # Application constants
├── types/                 # Type definitions
└── __tests__/             # Test files
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage

## Environment Variables

Create a `.env.local` file based on `.env.example`:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key |

## Database Setup

This application uses Supabase for data storage. Ensure your Supabase project has the following tables:

- `sections` - Book sections/chapters
- User authentication is handled by Supabase Auth

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security

- Environment variables are properly configured
- API keys are never committed to version control
- Security headers are configured in `next.config.mjs`
- Input validation is implemented throughout the application

## License

This project is private and proprietary.