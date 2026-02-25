import { useState, useEffect, useRef } from 'react'
import puter from '@heyputer/puter.js'
import './AIChat.css'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface AIChatProps {
  workspaceId: string
}

export const AIChat = ({ workspaceId }: AIChatProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadMessages()
  }, [workspaceId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadMessages = async () => {
    try {
      const key = `ai_chat_${workspaceId}`
      const saved = await puter.kv.get<Message[]>(key)
      if (saved) {
        setMessages(saved)
      }
    } catch (error) {
      console.error('Failed to load messages:', error)
    }
  }

  const saveMessages = async (msgs: Message[]) => {
    try {
      const key = `ai_chat_${workspaceId}`
      await puter.kv.set(key, msgs)
    } catch (error) {
      console.error('Failed to save messages:', error)
    }
  }

  const getWorkspaceContext = async () => {
    try {
      const notesKey = `notes_${workspaceId}`
      const notes = await puter.kv.get<any[]>(notesKey) || []
      
      if (notes.length === 0) {
        return 'No notes in this workspace yet.'
      }

      return notes.map(note => 
        `Note: ${note.title}\n${note.content.slice(0, 200)}...`
      ).join('\n\n')
    } catch (error) {
      return 'Unable to load workspace context.'
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setIsLoading(true)

    try {
      // Get workspace context
      const context = await getWorkspaceContext()

      // Call Puter AI with context
      const response = await puter.ai.chat(
        `You are a helpful AI assistant for VibeOS workspace. Here's the user's workspace context:\n\n${context}\n\nUser question: ${input}`
      )

      // Extract message content from response
      let messageContent = 'No response'
      if (typeof response === 'string') {
        messageContent = response
      } else if (response && typeof response === 'object' && 'message' in response) {
        messageContent = (response as any).message || 'No response'
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: messageContent,
        timestamp: new Date().toISOString()
      }

      const finalMessages = [...updatedMessages, aiMessage]
      setMessages(finalMessages)
      await saveMessages(finalMessages)
    } catch (error) {
      console.error('AI error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      }
      const finalMessages = [...updatedMessages, errorMessage]
      setMessages(finalMessages)
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = async () => {
    if (confirm('Clear all messages?')) {
      setMessages([])
      await puter.kv.del(`ai_chat_${workspaceId}`)
    }
  }

  return (
    <div className="ai-chat">
      <div className="chat-header">
        <div>
          <h2>🤖 AI Assistant</h2>
          <p>Context-aware AI that understands your workspace</p>
        </div>
        {messages.length > 0 && (
          <button className="btn-clear" onClick={clearChat}>
            Clear
          </button>
        )}
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <p>👋 Hi! I'm your AI assistant.</p>
            <p>I can help you with your notes, ideas, and tasks in this workspace.</p>
            <p>Ask me anything!</p>
          </div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className={`message ${msg.role}`}>
              <div className="message-content">{msg.content}</div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="message assistant">
            <div className="message-content typing">Thinking...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask me anything about your workspace..."
          disabled={isLoading}
        />
        <button onClick={sendMessage} disabled={isLoading || !input.trim()}>
          Send
        </button>
      </div>
    </div>
  )
}
