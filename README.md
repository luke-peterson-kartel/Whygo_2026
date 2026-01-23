# WhyGo v.2 - Kartel AI Goal Management Platform

A React + TypeScript web application for managing company, department, and individual WhyGOs (goals) at Kartel's AI.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Firebase (Firestore + Authentication)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod
- **Authentication**: Google Workspace SSO

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase project set up
- Google Workspace account (@kartel.ai)

### Installation

1. Clone the repository:
```bash
cd "WhyGo v.2"
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication > Google Sign-In
   - Create a Firestore database
   - Copy your Firebase config

4. Configure environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Firebase credentials:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

5. Start the development server:
```bash
npm run dev
```

6. Open http://localhost:5173 in your browser

## Project Structure

```
src/
├── config/              # Firebase configuration
├── types/               # TypeScript type definitions
├── lib/                 # Utilities and helpers
│   ├── firebase/        # Firebase utilities
│   ├── utils/           # Business logic (status calc, permissions)
│   └── markdown/        # MD parser for data migration
├── hooks/               # Custom React hooks
├── store/               # Zustand state management
├── components/          # Reusable React components
│   ├── layout/          # App layout components
│   ├── auth/            # Authentication components
│   ├── whygo/           # WhyGO-specific components
│   ├── dashboard/       # Dashboard components
│   └── ui/              # Primitive UI components
├── pages/               # Page components
│   ├── philosophy/      # Philosophy education module
│   ├── dashboards/      # Dashboard pages
│   ├── goals/           # Goal management pages
│   └── progress/        # Progress tracking pages
└── data/                # Static/seed data
```

## Features

### MVP Features (Phase 1 Completed)

✅ **Foundation**
- React + TypeScript + Vite setup
- Tailwind CSS configuration
- Firebase authentication with Google Workspace SSO
- Protected routes and authentication flow
- Basic app layout with sidebar navigation

### Coming Soon

🔄 **Philosophy Module** (Phase 2)
- Interactive WhyGo framework guide
- Educational content and examples

🔄 **Goal Dashboards** (Phase 3)
- Company-level dashboard
- Department-level dashboards
- Individual goal tracking

🔄 **Progress Tracking** (Phase 4)
- Quarterly progress updates
- Status indicators [+/~/−]
- Progress history

🔄 **Goal Creation** (Phase 5)
- Multi-step goal creation wizard
- Validation and approval workflows

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code (when configured)

### Key Business Logic

**Status Calculation:**
- [+] On pace: ≥100% of quarterly target
- [~] Slightly off: 80-99% of target
- [−] Off pace: <80% of target

**Permission Levels:**
- Executive: Full access to all features
- Department Head: Manage department + individual goals
- Manager: Manage team member goals
- IC: Manage own individual goals

## Firebase Setup

### Collections Schema

1. **employees** - User profiles and org hierarchy
2. **whygos** - Goal documents (company/department/individual)
3. **outcomes** - Measurable results (subcollection of whygos)
4. **progressUpdates** - Audit trail of updates
5. **reviews** - Meeting/review records

### Security Rules

Deploy Firestore security rules from `firebase/firestore.rules` to enforce role-based access control.

## Data Migration

To import existing WhyGOs from markdown files, run:

```bash
npm run migrate
```

This will parse and import:
- 4 company WhyGOs for 2026
- 5 department WhyGOs
- 22 employee records

## Contributing

This is an internal Kartel AI project. Contact Luke Peterson or the engineering team for access.

## License

Proprietary - Kartel AI © 2026
