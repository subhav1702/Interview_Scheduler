## Live Demo

Check out the live application here:  
👉 https://interview-scheduler-zeta.vercel.app/

# Interview Scheduler

A modern, responsive interview scheduling dashboard built with React, TypeScript, and Tailwind CSS.

## Design Decisions

1. **State Management:** Used React's local state (`useState`, `useEffect`) since the application state is currently simple enough to not require external libraries like Redux or Zustand. The state is centralized in top-level components to ensure downward data flow.
2. **Styling & Theming:** Utilized Tailwind CSS v4 variables configuration for a robust Dark/Light mode toggle. CSS custom properties (`var(--bg-primary)`, etc.) are updated dynamically when the `.dark` class is toggled on the root document element. This ensures the app is scalable and semantic.
3. **Component Architecture:** Used standard `function` declarations project-wide instead of `React.FC` and arrow functions. This promotes better debuggability and cleaner React code.
4. **Layout Structure:** The UI implements a classic Sidebar + Main Content layout. Responsive design uses Tailwind's mobile-first breakpoints and a collapsible sidebar on smaller screens.
5. **Calendar Logic:** A custom calendar grid was built from scratch to calculate available and overlapping 30-minute intervals between candidates and engineers accurately, giving recruiters optimal match options.

## Setup Instructions

1. Install dependencies: `npm install`
2. Run development server: `npm run dev`
3. Build for production: `npm run build`

