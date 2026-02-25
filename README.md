# ServiceHub Frontend

A modern React frontend application for the ServiceHub service marketplace platform.

## Tech Stack

- **React 18** - UI Library
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **React Router v6** - Routing
- **Axios** - HTTP client
- **TailwindCSS** - Styling
- **Socket.io Client** - Real-time chat
- **Formik + Yup** - Form handling and validation
- **React Hot Toast** - Notifications

## Prerequisites

- Node.js 18+ and npm/yarn
- Backend API running on http://localhost:8000

## Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```
   
   ⚠️ **Important**: See [SECURITY_SETUP.md](SECURITY_SETUP.md) for detailed instructions on configuring Firebase, Google OAuth, and other credentials.

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## Project Structure

```
src/
├── api/                 # API services
├── app/                 # Redux store configuration
├── assets/              # Static assets
├── components/          # Reusable components
├── context/             # React context providers
├── features/            # Redux slices
├── hooks/               # Custom hooks
├── layouts/             # Page layouts
├── pages/               # Page components
├── router/              # Routing configuration
├── utils/               # Utility functions
├── index.css            # Global styles
└── main.jsx             # Entry point
```

## Features

- 🔐 JWT Authentication
- 👤 User & Provider Profiles
- 📅 Service Booking System
- 💳 Payment Integration (Stripe)
- ⭐ Reviews & Ratings
- 💬 Real-time Chat
- 🔔 Notifications
- 📱 Responsive Design
- 🎨 Modern UI with TailwindCSS

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

See `.env.example` for required environment variables.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License
