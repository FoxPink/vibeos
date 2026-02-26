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
  hideHeader?: boolean
  onNoteAction?: (action: 'create' | 'update', noteData: any) => void
}

export const AIChat = ({ workspaceId, hideHeader = false, onNoteAction }: AIChatProps) => {
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
        // Ensure all loaded messages have string content
        const normalizedMessages = saved.map(msg => {
          let content: string = msg.content
          
          // If content is an object, extract the actual text
          if (typeof content === 'object' && content !== null) {
            const contentObj = content as any
            if ('content' in contentObj && typeof contentObj.content === 'string') {
              content = contentObj.content
            } else if ('content' in contentObj) {
              content = String(contentObj.content)
            } else {
              content = JSON.stringify(content)
            }
          } else if (typeof content !== 'string') {
            content = String(content)
          }
          
          return {
            ...msg,
            content
          }
        })
        
        setMessages(normalizedMessages)
        
        // Save the cleaned data back
        await puter.kv.set(key, normalizedMessages)
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

  const parseAndExecuteActions = async (content: string) => {
    // Parse CREATE action
    const createMatch = content.match(/\[ACTION:CREATE\]([\s\S]*?)\[\/ACTION\]/i)
    if (createMatch) {
      const actionContent = createMatch[1]
      const titleMatch = actionContent.match(/Title:\s*(.+)/i)
      const contentMatch = actionContent.match(/Content:\s*([\s\S]+)/i)
      
      if (titleMatch && contentMatch) {
        const title = titleMatch[1].trim()
        const noteContent = contentMatch[1].trim()
        await createNote(title, noteContent)
      }
    }

    // Parse UPDATE action
    const updateMatch = content.match(/\[ACTION:UPDATE\]([\s\S]*?)\[\/ACTION\]/i)
    if (updateMatch) {
      const actionContent = updateMatch[1]
      const idMatch = actionContent.match(/NoteID:\s*(.+)/i)
      const titleMatch = actionContent.match(/Title:\s*(.+)/i)
      const contentMatch = actionContent.match(/Content:\s*([\s\S]+)/i)
      
      if (idMatch && titleMatch && contentMatch) {
        const noteId = idMatch[1].trim()
        const title = titleMatch[1].trim()
        const noteContent = contentMatch[1].trim()
        await updateNote(noteId, title, noteContent)
      }
    }

    // Parse DELETE action
    const deleteMatch = content.match(/\[ACTION:DELETE\]([\s\S]*?)\[\/ACTION\]/i)
    if (deleteMatch) {
      const actionContent = deleteMatch[1]
      const idMatch = actionContent.match(/NoteID:\s*(.+)/i)
      
      if (idMatch) {
        const noteId = idMatch[1].trim()
        await deleteNote(noteId)
      }
    }
  }

  const cleanMessageContent = (content: string): string => {
    // Remove action tags and replace with user-friendly message
    let cleaned = content

    // Replace CREATE action
    cleaned = cleaned.replace(/\[ACTION:CREATE\]([\s\S]*?)\[\/ACTION\]/gi, (match, actionContent) => {
      const titleMatch = actionContent.match(/Title:\s*(.+)/i)
      if (titleMatch) {
        return `✅ Đã tạo note: "${titleMatch[1].trim()}"`
      }
      return '✅ Đã tạo note mới'
    })

    // Replace UPDATE action
    cleaned = cleaned.replace(/\[ACTION:UPDATE\]([\s\S]*?)\[\/ACTION\]/gi, (match, actionContent) => {
      const titleMatch = actionContent.match(/Title:\s*(.+)/i)
      if (titleMatch) {
        return `✅ Đã cập nhật note: "${titleMatch[1].trim()}"`
      }
      return '✅ Đã cập nhật note'
    })

    // Replace DELETE action
    cleaned = cleaned.replace(/\[ACTION:DELETE\]([\s\S]*?)\[\/ACTION\]/gi, () => {
      return '✅ Đã xóa note'
    })

    return cleaned.trim()
  }

  const getWorkspaceContext = async () => {
    try {
      const notesKey = `notes_${workspaceId}`
      const notes = await puter.kv.get<any[]>(notesKey) || []
      
      if (notes.length === 0) {
        return { text: 'No notes in this workspace yet.', notes: [] }
      }

      const contextText = notes.map((note, idx) => 
        `[Note ${idx + 1}] ID: ${note.id}\nTitle: ${note.title}\nContent: ${note.content.slice(0, 300)}${note.content.length > 300 ? '...' : ''}`
      ).join('\n\n')
      
      return { text: contextText, notes }
    } catch (error) {
      return { text: 'Unable to load workspace context.', notes: [] }
    }
  }

  const createNote = async (title: string, content: string) => {
    try {
      const notesKey = `notes_${workspaceId}`
      const notes = await puter.kv.get<any[]>(notesKey) || []
      
      const newNote = {
        id: Date.now().toString(),
        title,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      const updated = [newNote, ...notes]
      await puter.kv.set(notesKey, updated)
      
      if (onNoteAction) {
        onNoteAction('create', newNote)
      }
      
      return newNote
    } catch (error) {
      console.error('Failed to create note:', error)
      return null
    }
  }

  const updateNote = async (noteId: string, title: string, content: string) => {
    try {
      const notesKey = `notes_${workspaceId}`
      const notes = await puter.kv.get<any[]>(notesKey) || []
      
      const updated = notes.map(n =>
        n.id === noteId
          ? { ...n, title, content, updatedAt: new Date().toISOString() }
          : n
      )
      
      await puter.kv.set(notesKey, updated)
      
      const updatedNote = updated.find(n => n.id === noteId)
      if (onNoteAction && updatedNote) {
        onNoteAction('update', updatedNote)
      }
      
      return updatedNote
    } catch (error) {
      console.error('Failed to update note:', error)
      return null
    }
  }

  const deleteNote = async (noteId: string) => {
    try {
      const notesKey = `notes_${workspaceId}`
      const notes = await puter.kv.get<any[]>(notesKey) || []
      
      const updated = notes.filter(n => n.id !== noteId)
      await puter.kv.set(notesKey, updated)
      
      if (onNoteAction) {
        onNoteAction('delete' as any, { id: noteId })
      }
      
      return true
    } catch (error) {
      console.error('Failed to delete note:', error)
      return false
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
      const { text: context } = await getWorkspaceContext()

      // Build system prompt with actions
      const systemPrompt = `You are a helpful AI assistant for VibeOS workspace. You can read and modify notes.

WORKSPACE CONTEXT:
${context}

AVAILABLE ACTIONS:
1. To CREATE a new note, respond with:
   [ACTION:CREATE]
   Title: <note title>
   Content: <note content>
   [/ACTION]

2. To UPDATE an existing note, respond with:
   [ACTION:UPDATE]
   NoteID: <note id from context>
   Title: <new title>
   Content: <new content>
   [/ACTION]

3. To DELETE a note, respond with:
   [ACTION:DELETE]
   NoteID: <note id from context>
   [/ACTION]

4. To just answer questions, respond normally without action tags.

RULES:
- Always show the action you performed
- Be concise and helpful
- Use Vietnamese for communication

User question: ${input}`

      // Call Puter AI with context
      const response = await puter.ai.chat(systemPrompt)

      console.log('AI Response:', response) // Debug log

      // Extract message content from response
      let messageContent = 'No response'
      
      if (typeof response === 'string') {
        messageContent = response
      } else if (response && typeof response === 'object') {
        const resp = response as any
        
        // Handle Puter AI response structure: result.message.content
        if (resp.result && resp.result.message && resp.result.message.content) {
          messageContent = resp.result.message.content
        }
        // Handle direct message.content
        else if (resp.message && resp.message.content) {
          messageContent = resp.message.content
        }
        // Handle direct content
        else if (resp.content) {
          if (typeof resp.content === 'string') {
            messageContent = resp.content
          } else if (resp.content.content) {
            messageContent = resp.content.content
          }
        }
        // Fallback
        else {
          console.warn('Unexpected AI response format:', response)
          messageContent = 'Unable to parse AI response'
        }
      }

      // Parse and execute actions
      await parseAndExecuteActions(messageContent)

      // Clean message content for display
      const cleanedContent = cleanMessageContent(messageContent)

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: cleanedContent,
        timestamp: new Date().toISOString()
      }

      const finalMessages = [...updatedMessages, aiMessage]
      setMessages(finalMessages)
      
      // Ensure all messages have string content before saving
      const messagesToSave = finalMessages.map(msg => ({
        ...msg,
        content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)
      }))
      await saveMessages(messagesToSave)
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
      {!hideHeader && (
        <div className="chat-header">
          <div>
            <h2>AI Assistant</h2>
            <p>Context-aware AI that understands your workspace</p>
          </div>
          {messages.length > 0 && (
            <button className="btn-clear" onClick={clearChat}>
              Clear
            </button>
          )}
        </div>
      )}

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <p>Hi! I'm your AI assistant.</p>
            <p>I can help you with your notes, ideas, and tasks in this workspace.</p>
            <p>Ask me anything!</p>
          </div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className={`message ${msg.role}`}>
              <div className="message-content">
                {typeof msg.content === 'string' 
                  ? msg.content 
                  : JSON.stringify(msg.content)
                }
              </div>
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
