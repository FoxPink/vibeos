import { useState } from 'react'
import { Book, ChevronRight, Home } from 'lucide-react'
import './DocsPage.css'

const docsSections = [
  {
    title: 'Getting Started',
    items: [
      { id: 'introduction', label: 'Introduction' },
      { id: 'quick-start', label: 'Quick Start' },
      { id: 'installation', label: 'Installation' },
    ]
  },
  {
    title: 'Core Concepts',
    items: [
      { id: 'workspaces', label: 'Workspaces' },
      { id: 'notes', label: 'Notes' },
      { id: 'ai-assistant', label: 'AI Assistant' },
    ]
  },
  {
    title: 'Features',
    items: [
      { id: 'ai-actions', label: 'AI Actions' },
      { id: 'quick-prompts', label: 'Quick Prompts' },
      { id: 'chat-history', label: 'Chat History' },
    ]
  },
  {
    title: 'API Reference',
    items: [
      { id: 'authentication', label: 'Authentication' },
      { id: 'storage', label: 'Storage' },
      { id: 'ai-api', label: 'AI API' },
    ]
  }
]

const docsContent: Record<string, { title: string; content: string }> = {
  introduction: {
    title: 'Introduction',
    content: `Welcome to VibeOS Documentation!

VibeOS is an AI-native workspace designed for indie builders. It combines note-taking, AI assistance, and workspace management in one seamless experience.

Key Features:
• AI-powered note management
• Context-aware AI assistant
• Multiple workspaces
• Real-time synchronization
• Clean, modern interface`
  },
  'quick-start': {
    title: 'Quick Start',
    content: `Get started with VibeOS in minutes!

1. Sign Up
   Visit the homepage and click "Get started" to create your account.

2. Create Your First Workspace
   Click the "+" button in the sidebar to create a new workspace.

3. Add Notes
   Click "New Note" to start writing. Your notes are automatically saved.

4. Use AI Assistant
   Click the chat bubble to open the AI assistant. Ask questions or request actions.

That's it! You're ready to use VibeOS.`
  },
  installation: {
    title: 'Installation',
    content: `VibeOS is a web application - no installation required!

Simply visit our website and sign up for an account. VibeOS works on:
• Desktop browsers (Chrome, Firefox, Safari, Edge)
• Mobile browsers (iOS Safari, Chrome)
• Tablets

For the best experience, we recommend using a modern browser with JavaScript enabled.`
  },
  workspaces: {
    title: 'Workspaces',
    content: `Workspaces help you organize your notes by project or topic.

Creating a Workspace:
• Click the "+" button in the sidebar
• Enter a name for your workspace
• Press Enter to create

Managing Workspaces:
• Double-click a workspace name to rename it
• Click the "×" button to delete a workspace
• Switch between workspaces by clicking on them

Each workspace has its own:
• Notes collection
• AI chat history
• Independent context`
  },
  notes: {
    title: 'Notes',
    content: `Notes are the core of VibeOS. Create, edit, and organize your thoughts.

Creating Notes:
• Click "New Note" in the notes panel
• Start typing - notes auto-save
• Use the title field to name your note

Editing Notes:
• Click on any note to open it
• Edit the title and content
• Changes are saved automatically

Deleting Notes:
• Click the "×" button on a note
• Confirm deletion in the dialog

Notes support plain text and are optimized for quick capture.`
  },
  'ai-assistant': {
    title: 'AI Assistant',
    content: `The AI Assistant understands your workspace and helps you manage notes.

Opening the Assistant:
• Click the chat bubble in the bottom-right corner
• The assistant opens in collapsed mode
• Click the expand button (⤢) for full-screen mode

What the AI Can Do:
• Create new notes
• Update existing notes
• Delete notes
• Search through your notes
• Answer questions about your workspace
• Create and manage workspaces

The AI has access to all your workspaces and notes for context-aware responses.`
  },
  'ai-actions': {
    title: 'AI Actions',
    content: `The AI Assistant can perform actions on your behalf.

Available Actions:

1. Create Note
   "Create a note about project ideas"
   
2. Update Note
   "Update the meeting notes with action items"
   
3. Delete Note
   "Delete the old draft note"
   
4. Create Workspace
   "Create a workspace for my new project"
   
5. Rename Workspace
   "Rename this workspace to 'Personal'"
   
6. Delete Workspace
   "Delete the test workspace"

The AI will execute these actions and confirm completion.`
  },
  'quick-prompts': {
    title: 'Quick Prompts',
    content: `Quick Prompts help you interact with the AI faster.

Available Prompts:
• /create - Create a new note
• /list - List all notes
• /search - Search for notes
• /summary - Summarize workspace
• /workspace - Manage workspaces
• /help - Get help

Using Quick Prompts:
1. Click the "+" button in the chat input
2. Select a prompt from the grid
3. The prompt text is inserted
4. Complete the prompt and send

You can also type "/" to show the quick prompts menu.`
  },
  'chat-history': {
    title: 'Chat History',
    content: `Each workspace maintains its own chat history.

Features:
• Conversations are saved per workspace
• Switch workspaces to see different chat histories
• Clear chat history with the "Clear" button
• Chat history persists across sessions

Privacy:
• Chat history is stored locally in your browser
• Only you can access your conversations
• Clear history anytime from the chat interface

The AI uses recent conversation context to provide better responses.`
  },
  authentication: {
    title: 'Authentication',
    content: `VibeOS uses Puter.js for secure authentication.

Sign Up:
• Visit the auth page
• Enter your username and password
• Click "Sign up" to create an account

Sign In:
• Enter your credentials
• Click "Sign in" to access your workspace

Security:
• Passwords are securely hashed
• Sessions are managed by Puter.js
• Automatic session persistence

Your data is private and secure.`
  },
  storage: {
    title: 'Storage',
    content: `VibeOS uses Puter.js KV storage for data persistence.

What's Stored:
• Workspaces
• Notes
• Chat history
• User preferences

Storage Features:
• Automatic synchronization
• Real-time updates
• Reliable persistence
• Cross-device access

Data Structure:
• workspaces: Array of workspace objects
• notes_{workspaceId}: Notes for each workspace
• ai_chat_{workspaceId}: Chat history per workspace

All data is stored securely in your Puter.js account.`
  },
  'ai-api': {
    title: 'AI API',
    content: `VibeOS uses Puter.js AI API for intelligent assistance.

Features:
• Context-aware responses
• Action execution
• Natural language understanding
• Workspace knowledge

API Usage:
The AI receives:
• All workspace information
• All notes content
• Recent conversation history
• User's current workspace

Response Format:
• Plain text responses
• Action tags for operations
• Confirmation messages

The AI is powered by advanced language models through Puter.js.`
  }
}

export const DocsPage = () => {
  const [activeSection, setActiveSection] = useState('introduction')

  const currentDoc = docsContent[activeSection]

  return (
    <div className="docs-page">
      <nav className="docs-navbar">
        <div className="docs-navbar-content">
          <a href="/" className="docs-logo">
            <div className="logo-icon">V</div>
            <span className="logo-text">VibeOS</span>
          </a>
          <a href="/" className="btn-back">
            <Home size={18} />
            Back to Home
          </a>
        </div>
      </nav>

      <div className="docs-container">
        <aside className="docs-sidebar">
          <div className="docs-sidebar-header">
            <Book size={20} />
            <h2>Documentation</h2>
          </div>
          
          {docsSections.map((section) => (
            <div key={section.title} className="docs-section">
              <h3 className="docs-section-title">{section.title}</h3>
              <ul className="docs-section-items">
                {section.items.map((item) => (
                  <li key={item.id}>
                    <button
                      className={`docs-item ${activeSection === item.id ? 'active' : ''}`}
                      onClick={() => setActiveSection(item.id)}
                    >
                      <ChevronRight size={16} />
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside>

        <main className="docs-content">
          <article className="docs-article">
            <h1 className="docs-title">{currentDoc.title}</h1>
            <div className="docs-body">
              {currentDoc.content.split('\n\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </article>
        </main>
      </div>
    </div>
  )
}
