# ⚡ VibeOS

> Your AI-powered creative command center

An AI-native workspace designed for indie builders, content creators, and solo founders who are building online.

## 🎯 What is VibeOS?

VibeOS is NOT:
- ❌ Another productivity app
- ❌ Just an AI chatbot
- ❌ A Notion clone

VibeOS IS:
- ✅ Context-aware AI workspace
- ✅ Lightweight & performance-first
- ✅ Built for solo builders

## 🔥 Key Features

### 1. Context-Aware AI
AI that understands your entire workspace - all your notes, ideas, and projects.

### 2. Modular System
Micro apps you can drag to your workspace. Minimalist by design.

### 3. Performance-First
Smooth like Linear. No lag. No bloat. < 1.5s load time.

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: CSS Variables (Light/Dark mode)
- **Backend**: Puter.js (Zero backend!)
  - Built-in authentication
  - Cloud storage
  - AI services
  - No infrastructure to maintain

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
src/
├── features/
│   ├── auth/          # Authentication with Puter.js
│   ├── app/           # Main app shell & sidebar
│   ├── workspace/     # Workspace management
│   ├── notes/         # Note editor & list
│   └── ai/            # Context-aware AI chat
├── .shared/           # Reusable components (future)
└── styles/            # Global styles & design system
```

## 🎨 Design System

### Colors
```css
/* Light Mode */
--bg-primary: #ffffff
--bg-secondary: #f8fafc
--text-primary: #0f172a
--accent: #6366f1

/* Dark Mode */
--bg-primary: #0f172a
--bg-secondary: #1e293b
--text-primary: #f8fafc
--accent: #818cf8
```

## 📋 Month 1 MVP Features

- [x] Authentication (Puter.js)
- [x] Workspace system (create/switch/delete)
- [x] Note module (editor with auto-save)
- [x] Context-aware AI chat
- [x] Light/Dark mode support

## 🗺️ Roadmap

### Month 2
- Task board module
- Idea board module
- AI caption generator
- Shareable public links

### Month 3
- Landing page
- Waitlist system
- Product Hunt launch

## 💰 Monetization (Planned)

### Free Tier
- 2 workspaces
- 100 AI actions/month
- Basic features

### Pro ($8/month)
- Unlimited workspaces
- Full context AI
- Custom themes
- Public share pages

### Power ($15/month)
- AI automation
- Export options
- API access

## 🌍 Target Audience

Built for:
- Indie hackers
- Content creators
- Solo founders
- Freelance designers/developers
- TikTok / YouTube creators

NOT for:
- Large enterprises
- Traditional office workers
- Mass market students

## 🤝 Contributing

This is currently a solo project. Contributions welcome after initial launch.

## 🔗 Links

- [Puter.js Documentation](https://docs.puter.com)
- [Product Spec](./docs/VIBEOS_SPEC.md)

---

**Built with ❤️ for indie builders**
