# React Facebook Documentation Site

Modern documentation website for the react-facebook library.

## Features

- **Interactive Examples** - Live code examples with syntax highlighting
- **API Reference** - Complete documentation of all components and hooks
- **Getting Started Guide** - Step-by-step setup instructions
- **Advanced Usage** - Best practices, security, and performance tips
- **Mobile Responsive** - Optimized for all devices
- **Dark Mode Support** - Built-in dark mode for code blocks

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Prism React Renderer** - Syntax highlighting
- **Lucide Icons** - Beautiful icons

## Deployment

The site is configured for deployment to GitHub Pages or any static hosting service:

1. **GitHub Pages**: Push to main branch, GitHub Actions will auto-deploy
2. **Vercel**: Connect repo and deploy automatically
3. **Netlify**: Connect repo and deploy automatically
4. **Custom Domain**: Update CNAME in deploy script

## Structure

```
docs-site/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage
│   ├── getting-started/   # Setup guide
│   ├── examples/          # Code examples
│   ├── api/              # API reference
│   └── advanced/         # Advanced usage
├── components/            # Reusable components
│   ├── Navigation.tsx    # Site navigation
│   ├── CodeBlock.tsx     # Code display
│   └── FeatureCard.tsx   # Feature cards
└── public/               # Static assets
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © Zlatko Fedor