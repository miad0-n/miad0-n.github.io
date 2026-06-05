# Miad — Exploring

A modern portfolio website showcasing ideas, projects, and explorations in web development and AI integration.

**Live Site:** https://miadnine.me

## About

Miad is a student and professional beginner exploring new possibilities and accumulating untitled ideas. This portfolio is built as a React application with Vite, featuring AI-powered capabilities through Google Gemini API integration.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS, Motion animations
- **Backend:** Express.js
- **AI Integration:** Google Gemini API (`@google/genai`)
- **UI Components:** Lucide React icons
- **Routing:** React Router DOM

## Prerequisites

- Node.js (v18 or higher recommended)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory and add your Gemini API key:

```
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

Get your API key from [Google AI Studio](https://ai.google.dev/)

### 3. Run Locally

```bash
npm run dev
```

The application will start at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm run lint` - Type-check with TypeScript
- `npm run clean` - Clean build artifacts

## Project Structure

```
src/
├── components/     # React components
├── App.tsx         # Main application component
├── main.tsx        # React entry point
├── data.ts         # Data and content configuration
├── types.ts        # TypeScript type definitions
└── index.css       # Global styles
```

## Features

- Dark mode support with persistent theme preference
- Responsive design with Tailwind CSS
- Smooth animations and transitions with Motion
- AI-powered capabilities via Gemini API
- Server-side API integration with Express

## Development

The project uses Vite for fast development and optimized builds. TypeScript ensures type safety throughout the codebase.

### Type Checking

```bash
npm run lint
```

## Building for Production

```bash
npm run build
npm run preview
```

## License

MIT
