# Student AI Dashboard - Project Context

## Project Overview
This is a Next.js 16 application called "Student AI Dashboard" that provides AI-powered educational tools for students. The application features:
- AI Math Storyteller that converts math problems into engaging adventure stories
- Smart Quizzer for AI-generated adaptive quizzes
- Syllabus Buddy for study plan assistance
- Authentication via Clerk
- Database integration with Prisma and Neon (PostgreSQL)
- AI integration using multiple providers (Google, Groq, OpenAI)
- Modern UI with Tailwind CSS and Lucide React icons

## Technology Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with custom theme configuration
- **Authentication**: Clerk for user authentication and management
- **Database**: Prisma ORM with Neon (PostgreSQL) database
- **AI/ML**: AI SDK with multiple providers (Google, Groq, OpenAI)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Font**: Geist (automatically optimized via next/font)

## Project Structure
```
student-ai-dashboard/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (chat, story)
│   ├── dashboard/         # Main dashboard with AI tools
│   ├── sign-in/           # Authentication pages
│   ├── sign-up/
│   ├── favicon.ico
│   ├── globals.css        # Global styles with Tailwind
│   ├── layout.tsx         # Root layout with ClerkProvider
│   └── page.tsx           # Home page
├── lib/                   # Shared utilities and database logic
│   ├── prisma.ts          # Prisma client configuration
│   └── sync-student.ts    # Student synchronization with Clerk
├── public/                # Static assets
├── prisma/                # Prisma schema and migrations
├── package.json           # Dependencies and scripts
└── next.config.ts         # Next.js configuration
```

## Key Features
1. **Authentication**: User authentication and management via Clerk
2. **Student Synchronization**: Automatically syncs Clerk users to the database
3. **AI Chat Interface**: Real-time chat with AI models for educational content
4. **Math Storytelling**: Converts math problems into adventure stories using Groq's Llama model
5. **Responsive Design**: Mobile-first responsive UI with Tailwind CSS

## Environment Setup
1. Install dependencies: `npm install`
2. Set up environment variables (likely in `.env.local`):
   - Clerk environment variables
   - Database connection string for Neon
   - AI provider API keys (Google, Groq, OpenAI)

## Building and Running
- **Development**: `npm run dev` (starts Next.js development server on port 3000)
- **Production Build**: `npm run build` (creates optimized production build)
- **Start Production**: `npm run start` (runs production server)
- **Linting**: `npm run lint` (runs ESLint)

## Key Files and Components
- `app/page.tsx`: Home page
- `app/dashboard/page.tsx`: Main dashboard with AI tools
- `app/dashboard/story/page.tsx`: AI Math Storyteller interface
- `app/api/chat/route.ts`: Chat API endpoint using Groq Llama model
- `lib/sync-student.ts`: Logic for synchronizing Clerk users with database
- `lib/prisma.ts`: Prisma client configuration
- `app/layout.tsx`: Root layout with ClerkProvider

## Development Conventions
- Uses TypeScript for type safety
- Follows Next.js App Router conventions
- Implements Clerk for authentication
- Uses Prisma for database operations
- Follows Tailwind CSS for styling
- Implements AI SDK for AI model interactions
- Uses modern React patterns (React 19)

## Database Schema
The application uses Prisma ORM with a schema likely defined in `prisma/schema.prisma` (not examined). Based on the code, there's at least a `Student` model with fields for Clerk ID, email, and name.

## AI Integration
The application integrates with multiple AI providers:
- Groq (for the main chat functionality using 'llama-3.3-70b-versatile')
- Google AI
- OpenAI
- Uses the AI SDK for consistent API interactions

## Authentication Flow
1. Clerk handles user authentication
2. The `syncStudent()` function in `lib/sync-student.ts` ensures each authenticated user has a corresponding record in the database
3. The `ClerkProvider` in `app/layout.tsx` enables authentication context throughout the app