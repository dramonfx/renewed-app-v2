
# 🔧 Technical Specifications - RENEWED App V2 Phase 1 Week 1

## 🏗️ Architecture Overview

### Technology Stack
- **Framework**: Next.js 15.3.2 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with custom sacred design system
- **Animations**: Framer Motion for spiritual transitions
- **Authentication**: Supabase Auth with custom spiritual context
- **Database**: Supabase with Prisma ORM
- **State Management**: React hooks with localStorage persistence

### Sacred Design System
```css
/* Sacred Color Palette */
--sacred-blue-50: hsl(220, 14%, 96%);
--sacred-blue-100: hsl(220, 13%, 91%);
--sacred-blue-600: hsl(220, 18%, 20%);
--sacred-blue-900: hsl(220, 39%, 11%);
--sacred-gold-400: hsl(45, 93%, 58%);
--sacred-gold-500: hsl(45, 93%, 47%);
--sacred-gradient: linear-gradient(135deg, #60B5FF, #FF9149);
```

---

## 🕊️ Authentication System

### Enhanced Components
- **Signup Page** (`/src/app/signup/page.js`)
- **Login Page** (`/src/app/login/page.js`)
- **Auth Context** (`/src/contexts/AuthContext.tsx`)

### Spiritual Preparation Flow
```typescript
interface SpiritualPreparation {
  title: string;
  description: string;
  icon: string;
  message: string;
}

const spiritualPreparation = [
  {
    title: "Sacred Intention",
    description: "Set your heart toward transformation",
    icon: "🕊️",
    message: "Every spiritual journey begins with a sacred intention..."
  },
  // ... additional steps
];
```

### Authentication Features
- 3-step spiritual preparation sequence
- Enhanced loading states with sacred context
- Automatic redirect to onboarding after signup
- Sacred messaging throughout auth flow
- Responsive design with spiritual gradients

---

## 🏛️ Dashboard Spiritual Foundation

### Core Components
- **Dashboard Page** (`/src/app/dashboard/page.jsx`)
- **Spiritual Mindset Tracker** (inline component)
- **Sacred Metrics Dashboard** (inline component)

### Mindset Evolution System
```typescript
interface MindsetStage {
  title: string;
  description: string;
  icon: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  progress: number;
  characteristics: string[];
}

const mindsetStages = {
  natural: {
    title: 'Natural Mind',
    description: 'Beginning your journey of awareness',
    icon: '🌱',
    color: 'bg-emerald-500',
    // ... additional properties
  },
  // ... transition and spiritual stages
};
```

### Sacred Metrics Schema
```typescript
interface SpiritualMetrics {
  totalReadingTime: number;      // Minutes of sacred study
  reflectionsCompleted: number;  // Deep contemplations count
  sectionsCompleted: number;     // Chapters completed
  spiritualGrowthScore: number;  // Overall development percentage
  mindsetEvolution: string;      // Current mindset stage
}
```

### Dashboard Features
- Real-time spiritual progress tracking
- Mindset evolution visualization
- Sacred metrics with spiritual context
- Enhanced reading progress with themes
- Responsive grid layout with animations

---

## 🧭 Navigation & Layout System

### Enhanced Layout Component
- **Layout Component** (`/src/components/Layout.tsx`)
- **Collapsible Navigation**: 80px collapsed / 320px expanded
- **Spiritual Context Integration**: Progress tracking in sidebar

### Sacred Navigation Schema
```typescript
interface SacredNavigation {
  title: string;
  href: string;
  icon: string;
  description: string;
  spiritualContext: string;
  conditional?: boolean;
  featured?: boolean;
}
```

### Navigation Features
- Dynamic sidebar width with smooth transitions
- Sacred navigation items with spiritual descriptions
- Spiritual progress indicator in sidebar header
- Enhanced sections with spiritual themes
- Breadcrumb navigation system
- Sacred user profile section

### Section Enhancement
```typescript
interface Section {
  id: number;
  title: string;
  slug: string;
  order: number;
  spiritualTheme?: string; // New spiritual context
}
```

---

## 🎨 Spiritual Design Components

### Sacred UI Components
- **SacredButton** (`/src/components/ui/sacred-button.tsx`)
- **SacredCard** (`/src/components/ui/sacred-card.tsx`)
- **SacredInput** (`/src/components/ui/sacred-input.tsx`)

### Animation System
```typescript
// Framer Motion spiritual transitions
const spiritualVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};
```

### Responsive Design Breakpoints
```css
/* Sacred responsive system */
.sacred-container {
  @apply max-w-6xl mx-auto px-4 sm:px-6 lg:px-8;
}

/* Collapsible navigation */
.sidebar-expanded { width: 320px; }
.sidebar-collapsed { width: 80px; }
```

---

## 💾 Data Persistence & State Management

### localStorage Schema
```typescript
// Spiritual metrics persistence
interface StoredSpiritualMetrics {
  totalReadingTime: number;
  reflectionsCompleted: number;
  sectionsCompleted: number;
  spiritualGrowthScore: number;
  mindsetEvolution: 'natural' | 'transition' | 'spiritual';
  lastUpdated: string;
}

// Onboarding data persistence
interface OnboardingData {
  assessment?: {
    spiritualReadiness: string;
  };
  completed: boolean;
  // ... additional onboarding fields
}
```

### State Management Pattern
- React hooks for component state
- localStorage for persistence
- Context providers for global state
- Custom hooks for spiritual functionality

---

## 🔒 Security & Performance

### TypeScript Standards
- Strict mode enabled
- No `any` types in new code
- Proper type definitions for all interfaces
- Generic type safety for spiritual data

### Performance Optimizations
- Code splitting by route
- Lazy loading for enhanced components
- Optimized bundle sizes
- Efficient re-renders with React.memo where appropriate

### Security Measures
- Supabase authentication with RLS
- Secure session management
- Protected API routes
- Input validation and sanitization

---

## 📱 Accessibility & Responsive Design

### WCAG 2.1 AA Compliance
- Proper ARIA labels and descriptions
- Keyboard navigation support
- Screen reader friendly elements
- Focus management and visual indicators
- Sufficient color contrast ratios

### Responsive Breakpoints
```css
/* Mobile First Approach */
.mobile-first {
  /* Base styles for mobile */
}

@media (min-width: 640px) {
  /* Small tablets */
}

@media (min-width: 768px) {
  /* Tablets */
}

@media (min-width: 1024px) {
  /* Desktop */
}

@media (min-width: 1280px) {
  /* Large desktop */
}
```

---

## 🧪 Testing & Quality Assurance

### Build Verification
- **Successful Compilation**: All 31 pages generating
- **TypeScript Strict**: Zero critical errors
- **Bundle Analysis**: Optimized sizes
- **Performance**: Sub-second loading times

### Quality Metrics
```bash
# Build output
Route (app)                    Size    First Load JS
├ ○ /dashboard                8.61 kB     183 kB
├ ○ /login                    3.87 kB     185 kB
├ ○ /signup                   4.4 kB      186 kB
# ... all 31 routes successful
```

### Testing Strategy
- Component integration testing
- User flow validation
- Accessibility testing
- Performance monitoring
- Cross-device compatibility

---

## 📚 Development Guidelines

### Sacred Development Principles
1. **Spiritual Integrity First**: Every component reflects transformation
2. **Quality Over Speed**: Contemplative development pace
3. **User-Centered Sacred Design**: Inclusive and accessible
4. **Performance Consciousness**: Optimized and efficient
5. **Security as Sacred Trust**: Protected and secure

### Code Standards
```typescript
// Example: Spiritual component pattern
interface SpiritualComponentProps {
  spiritualContext?: string;
  mindsetStage?: MindsetStage;
  onSacredAction?: (data: SpiritualData) => void;
}

const SpiritualComponent: React.FC<SpiritualComponentProps> = ({
  spiritualContext,
  mindsetStage,
  onSacredAction
}) => {
  // Component implementation with spiritual integrity
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={spiritualVariants}
      className="sacred-component"
    >
      {/* Sacred content */}
    </motion.div>
  );
};
```

### Git Commit Convention
```bash
# Sacred commit format
git commit -m "🕊️ Component: Description - Sacred Context

✨ Feature details:
- Spiritual enhancement 1
- Sacred improvement 2

🎯 Objective: [Objective name] - [Status]
Sacred development principles maintained 🙏"
```

---

## 🔄 Integration Points

### Supabase Integration
- Authentication with spiritual context
- Row Level Security (RLS) policies
- Real-time data synchronization
- Spiritual metrics persistence

### External Services
- Font loading (Playfair Display + Inter)
- Image optimization (Next.js Image)
- Performance monitoring
- Error tracking and reporting

---

## 📈 Monitoring & Analytics

### Performance Monitoring
- Bundle size tracking
- Page load times
- User interaction metrics
- Spiritual journey progression

### Spiritual Analytics
- Mindset evolution tracking
- Sacred action completion rates
- Spiritual growth progression
- User engagement with contemplative features

---

*🕊️ Technical specifications maintained with spiritual integrity and contemplative care*
