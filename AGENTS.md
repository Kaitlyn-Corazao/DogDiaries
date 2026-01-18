# AGENTS.md

## Project Overview

Dog Profile Generator - A React + TypeScript application with Express backend for creating dog profile pages. Built with Vite, Tailwind CSS, and shadcn/ui components.

Original Figma design: https://www.figma.com/design/z0AQ0RUJakz5pYRluGLNr3/Dog-Profile-Generator

## Setup Commands

- Install dependencies: `npm i`
- Start dev server (frontend only): `npm run dev`
- Start backend server: `npm run dev:server`
- Start both frontend and backend: `npm run dev:all`
- Build for production: `npm run build`
- Start production server: `npm start`

## Project Structure

- `/src` - Frontend React application
  - `/app` - Main application components
    - `/components` - Reusable components
      - `/ui` - shadcn/ui component library
      - `/figma` - Figma-specific components (e.g., ImageWithFallback)
  - `/styles` - CSS files including Tailwind and theme configuration
- `/server` - Express backend API server
- `/guidelines` - Project-specific design guidelines

## Development Environment

- **Port Configuration:**
  - Frontend dev server: `http://localhost:5173`
  - Backend API server: `http://localhost:3001`
  - API proxy configured: `/api` routes forward to backend

- **Path Aliases:**
  - `@/` resolves to `/src` directory

- **Key Technologies:**
  - React 18.3.1
  - TypeScript
  - Vite 6.3.5
  - Tailwind CSS 4.1.12
  - Express (backend)
  - shadcn/ui (Radix UI components)
  - Motion (animations)

## Code Style Guidelines

- TypeScript throughout the project
- Use Tailwind CSS for styling (already configured with `@tailwindcss/vite`)
- Component library: shadcn/ui (Radix UI primitives)
- Path aliases: Use `@/` for src imports (e.g., `import { Button } from '@/app/components/ui/button'`)
- Only use absolute positioning when necessary - prefer flexbox/grid layouts
- Keep file sizes manageable - extract helper functions and components into separate files
- Refactor code incrementally to maintain cleanliness

### UI Components

- Use existing shadcn/ui components from `/src/app/components/ui/`
- Available components include: Button, Card, Dialog, Form, Input, Select, Tabs, and many more
- Follow Radix UI patterns for accessible component composition
- Utility functions available in `/src/app/components/ui/utils.ts`

### Design System

- Refer to `/guidelines/Guidelines.md` for project-specific design rules
- Use responsive mobile hooks from `/src/app/components/ui/use-mobile.ts`
- Theme configuration in `/src/styles/theme.css`
- Custom fonts loaded via `/src/styles/fonts.css`

## Testing & Quality

- Always test both frontend and backend when making full-stack changes
- Run `npm run dev:all` to test the complete application
- Verify proxy configuration works for `/api` routes
- Check console for TypeScript errors during development

## Backend API Development

- Server entry point: `/server/index.js`
- Uses Express with CORS enabled
- Environment variables loaded via dotenv
- Restart required: Use `npm run dev:server` with nodemon for auto-reload

## Build & Deployment

- Build command: `npm run build`
- Output directory: `/dist` (Vite default)
- Production server: `npm start` runs backend server
- Ensure environment variables are configured for production

## Common Tasks

### Adding a new UI component
1. Check if shadcn/ui component already exists in `/src/app/components/ui/`
2. If not, follow shadcn/ui patterns for new components
3. Use TypeScript interfaces for props
4. Apply Tailwind classes for styling

### Making API calls
- Frontend proxy configured for `/api/*` routes
- Backend handles requests at `http://localhost:3001`
- Use Express routing patterns in `/server/index.js`

### Working with Figma imports
- Figma-specific components in `/src/app/components/figma/`
- Use `ImageWithFallback` component for robust image handling

## Dependencies to Note

- **UI Framework:** Material UI (@mui/material, @mui/icons-material) alongside Radix UI
- **Animations:** Motion (framer-motion successor)
- **Forms:** react-hook-form for form management
- **Drag & Drop:** react-dnd with HTML5 backend
- **Charts:** recharts for data visualization
- **Notifications:** sonner for toast notifications
- **Azure OpenAI:** Available for AI features (@azure/openai)
