# Raquib Ahmed - Portfolio

A modern, magazine-style portfolio built with Next.js 14, Tailwind CSS, and Framer Motion.

## Features

- **Magazine Cover Hero**: Layered typography with parallax mouse tracking
- **Floating macOS-style Dock**: Navigation with magnification hover effects
- **Responsive Design**: Mobile-first approach (320px to 1920px+)
- **Smooth Animations**: Framer Motion powered micro-interactions

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## Project Structure

```
├── app/
│   ├── layout.tsx       # Root layout with metadata
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles + Tailwind
├── components/
│   ├── Hero.tsx         # Magazine-style hero section
│   └── FloatingDock.tsx # macOS-style navigation dock
├── lib/
│   └── utils.ts         # Utility functions (cn)
└── public/
    └── 89301.jpg        # Hero image
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Typography**: Oswald (Display), JetBrains Mono (Code)

## Customization

### Update Personal Info

Edit `components/Hero.tsx`:
- Line 52-57: Top-right description text
- Line 73-74: Floating label text
- Line 86-88: Large display text

### Modify Colors

The hero uses `bg-zinc-400` as the base. Update in:
- `components/Hero.tsx` (line 50)
- `app/globals.css` (body styles)

### Replace Image

Replace `89301.jpg` with your photo in the root directory, or update the path in `Hero.tsx` (line 117).

## Build for Production

```bash
npm run build
npm start
```

## Deploy

This project is optimized for deployment on [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/raquib-portfolio)
