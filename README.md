# Renewed App V2

A Next.js application for spiritual transformation and personal growth.

## Foundation Purification Status ✅

**COMPLETE** - All TypeScript errors resolved, build system stabilized, Phase 7.1 integration preserved.

### Key Achievements
- ✅ 28 TypeScript compilation errors resolved
- ✅ All 29 pages generating successfully
- ✅ Build process fully stabilized
- ✅ Phase 7.1 cross-track bookmark navigation preserved
- ✅ Runtime issues resolved (SSR, Suspense boundaries)
- ✅ Production-ready stable foundation established

## Getting Started

### Prerequisites
- Node.js 18+ 
- Yarn package manager
- Supabase account (for database)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/dramonfx/renewed-app-v2.git
cd renewed-app-v2
```

2. Install dependencies:
```bash
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/                    # Next.js 13+ app directory
│   ├── api/               # API routes
│   ├── book/              # Book sections and content
│   ├── dashboard/         # User dashboard
│   ├── journal/           # Journaling features
│   ├── login/             # Authentication
│   └── onboarding/        # User onboarding flow
├── components/            # Reusable React components
│   ├── audio/            # Audio player components
│   ├── journal/          # Journal-specific components
│   ├── onboarding/       # Onboarding components
│   └── ui/               # UI component library
├── contexts/             # React contexts
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
└── types/                # TypeScript type definitions
```

## Features

### Core Features
- **Spiritual Journey Tracking**: Personal growth and transformation tracking
- **Audio Content**: Enhanced audio player with advanced features
- **Journaling System**: Sacred journaling with mindset tracking
- **User Authentication**: Secure login/signup with Supabase
- **Responsive Design**: Mobile-first responsive design

### Audio Engine (Phase 7.1)
- **Cross-Track Bookmark Navigation**: Seamless navigation between audio tracks
- **Enhanced Audio Player**: Advanced playback controls and features
- **Performance Optimization**: Efficient audio loading and caching
- **Error Recovery**: Robust error handling and recovery mechanisms

### Technical Features
- **TypeScript**: Full type safety throughout the application
- **Next.js 15**: Latest Next.js with app directory structure
- **Tailwind CSS**: Utility-first CSS framework
- **Supabase**: Backend-as-a-Service for authentication and database
- **Testing**: Jest and React Testing Library setup

## Development

### Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint
- `yarn lint:fix` - Fix ESLint issues
- `yarn test` - Run tests
- `yarn test:watch` - Run tests in watch mode
- `yarn test:coverage` - Run tests with coverage

### Code Quality

- **ESLint**: Code linting with Next.js recommended rules
- **Prettier**: Code formatting
- **TypeScript**: Static type checking
- **Testing**: Unit and integration tests

## Deployment

The application is optimized for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For support and questions, please contact the development team.
