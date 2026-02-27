import { useState, useEffect, useRef } from 'react'
import puter from '@heyputer/puter.js'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import '@/components/ui/alert-dialog-custom.css'
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
  onNoteAction?: (action: 'create' | 'update' | 'delete', noteData: any) => void
  onWorkspaceAction?: (action: 'create' | 'rename' | 'delete', workspaceData: any) => void
}

export const AIChat = ({ workspaceId, hideHeader = false, onNoteAction, onWorkspaceAction }: AIChatProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showQuickPrompts, setShowQuickPrompts] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const quickPrompts = [
    { key: '/create', label: 'Tạo note', prompt: 'Tạo note mới về: ' },
    { key: '/list', label: 'Liệt kê', prompt: 'Liệt kê tất cả notes' },
    { key: '/search', label: 'Tìm kiếm', prompt: 'Tìm note về: ' },
    { key: '/summary', label: 'Tóm tắt', prompt: 'Tóm tắt workspace' },
    { key: '/workspace', label: 'Workspace', prompt: 'Tạo workspace: ' },
    { key: '/help', label: 'Trợ giúp', prompt: 'Hướng dẫn sử dụng' },
  ]

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
      } else {
        // Clear messages if workspace has no chat history
        setMessages([])
      }
    } catch (error) {
      console.error('Failed to load messages:', error)
      setMessages([])
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
    // Parse all CREATE actions
    const createMatches = content.matchAll(/\[ACTION:CREATE\]([\s\S]*?)\[\/ACTION\]/gi)
    for (const match of createMatches) {
      const actionContent = match[1]
      const titleMatch = actionContent.match(/Title:\s*(.+)/i)
      const contentMatch = actionContent.match(/Content:\s*([\s\S]+)/i)
      
      if (titleMatch && contentMatch) {
        const title = titleMatch[1].trim()
        const noteContent = contentMatch[1].trim()
        await createNote(title, noteContent)
      }
    }

    // Parse all UPDATE actions
    const updateMatches = content.matchAll(/\[ACTION:UPDATE\]([\s\S]*?)\[\/ACTION\]/gi)
    for (const match of updateMatches) {
      const actionContent = match[1]
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

    // Parse all DELETE actions
    const deleteMatches = content.matchAll(/\[ACTION:DELETE\]([\s\S]*?)\[\/ACTION\]/gi)
    for (const match of deleteMatches) {
      const actionContent = match[1]
      const idMatch = actionContent.match(/NoteID:\s*(.+)/i)
      
      if (idMatch) {
        const noteId = idMatch[1].trim()
        await deleteNote(noteId)
      }
    }

    // Parse all CREATE_WORKSPACE actions
    const createWorkspaceMatches = content.matchAll(/\[ACTION:CREATE_WORKSPACE\]([\s\S]*?)\[\/ACTION\]/gi)
    for (const match of createWorkspaceMatches) {
      const actionContent = match[1]
      const nameMatch = actionContent.match(/Name:\s*(.+)/i)
      
      if (nameMatch) {
        const name = nameMatch[1].trim()
        await createWorkspace(name)
      }
    }

    // Parse all RENAME_WORKSPACE actions
    const renameWorkspaceMatches = content.matchAll(/\[ACTION:RENAME_WORKSPACE\]([\s\S]*?)\[\/ACTION\]/gi)
    for (const match of renameWorkspaceMatches) {
      const actionContent = match[1]
      const idMatch = actionContent.match(/WorkspaceID:\s*(.+)/i)
      const nameMatch = actionContent.match(/Name:\s*(.+)/i)
      
      if (idMatch && nameMatch) {
        const wsId = idMatch[1].trim()
        const name = nameMatch[1].trim()
        await renameWorkspace(wsId, name)
      }
    }

    // Parse all DELETE_WORKSPACE actions
    const deleteWorkspaceMatches = content.matchAll(/\[ACTION:DELETE_WORKSPACE\]([\s\S]*?)\[\/ACTION\]/gi)
    for (const match of deleteWorkspaceMatches) {
      const actionContent = match[1]
      const idMatch = actionContent.match(/WorkspaceID:\s*(.+)/i)
      
      if (idMatch) {
        const wsId = idMatch[1].trim()
        await deleteWorkspace(wsId)
      }
    }
  }

  const cleanMessageContent = (content: string): string => {
    // Simply remove action tags - AI will handle the confirmation messages
    let cleaned = content

    // Remove all action tags but keep the content around them
    cleaned = cleaned.replace(/\[ACTION:CREATE\]([\s\S]*?)\[\/ACTION\]/gi, '')
    cleaned = cleaned.replace(/\[ACTION:UPDATE\]([\s\S]*?)\[\/ACTION\]/gi, '')
    cleaned = cleaned.replace(/\[ACTION:DELETE\]([\s\S]*?)\[\/ACTION\]/gi, '')
    cleaned = cleaned.replace(/\[ACTION:CREATE_WORKSPACE\]([\s\S]*?)\[\/ACTION\]/gi, '')
    cleaned = cleaned.replace(/\[ACTION:RENAME_WORKSPACE\]([\s\S]*?)\[\/ACTION\]/gi, '')
    cleaned = cleaned.replace(/\[ACTION:DELETE_WORKSPACE\]([\s\S]*?)\[\/ACTION\]/gi, '')

    return cleaned.trim()
  }

  const getWorkspaceContext = async () => {
    try {
      // Get all workspaces
      const workspacesKey = 'workspaces'
      const workspaces = await puter.kv.get<any[]>(workspacesKey) || []
      
      let contextText = '=== ALL WORKSPACES ===\n'
      
      // Load notes from all workspaces
      for (const ws of workspaces) {
        contextText += `\n[Workspace: ${ws.name}]${ws.id === workspaceId ? ' (CURRENT)' : ''}\n`
        contextText += `Internal ID: ${ws.id}\n`
        contextText += `Internal Name: ${ws.name}\n`
        
        const notesKey = `notes_${ws.id}`
        const notes = await puter.kv.get<any[]>(notesKey) || []
        
        if (notes.length === 0) {
          contextText += '  Không có ghi chú nào.\n'
        } else {
          notes.forEach((note, idx) => {
            contextText += `  [Ghi chú ${idx + 1}]\n`
            contextText += `  Internal Note ID: ${note.id}\n`
            contextText += `  Tiêu đề: ${note.title}\n`
            contextText += `  Nội dung: ${note.content.slice(0, 200)}${note.content.length > 200 ? '...' : ''}\n\n`
          })
        }
      }
      
      return { text: contextText, notes: [] }
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

  const createWorkspace = async (name: string) => {
    try {
      const workspacesKey = 'workspaces'
      const workspaces = await puter.kv.get<any[]>(workspacesKey) || []
      
      const newWorkspace = {
        id: Date.now().toString(),
        name,
        createdAt: new Date().toISOString()
      }
      
      const updated = [...workspaces, newWorkspace]
      await puter.kv.set(workspacesKey, updated)
      
      if (onWorkspaceAction) {
        onWorkspaceAction('create', newWorkspace)
      }
      
      return newWorkspace
    } catch (error) {
      console.error('Failed to create workspace:', error)
      return null
    }
  }

  const renameWorkspace = async (workspaceId: string, name: string) => {
    try {
      const workspacesKey = 'workspaces'
      const workspaces = await puter.kv.get<any[]>(workspacesKey) || []
      
      const updated = workspaces.map(w =>
        w.id === workspaceId ? { ...w, name } : w
      )
      
      await puter.kv.set(workspacesKey, updated)
      
      const updatedWorkspace = updated.find(w => w.id === workspaceId)
      if (onWorkspaceAction && updatedWorkspace) {
        onWorkspaceAction('rename', updatedWorkspace)
      }
      
      return updatedWorkspace
    } catch (error) {
      console.error('Failed to rename workspace:', error)
      return null
    }
  }

  const deleteWorkspace = async (workspaceId: string) => {
    try {
      const workspacesKey = 'workspaces'
      const workspaces = await puter.kv.get<any[]>(workspacesKey) || []
      
      if (workspaces.length === 1) {
        return false // Cannot delete last workspace
      }
      
      // Get workspace name before deleting
      const workspaceToDelete = workspaces.find(w => w.id === workspaceId)
      const workspaceName = workspaceToDelete?.name || 'Unknown'
      
      const updated = workspaces.filter(w => w.id !== workspaceId)
      await puter.kv.set(workspacesKey, updated)
      
      if (onWorkspaceAction) {
        onWorkspaceAction('delete', { id: workspaceId, name: workspaceName })
      }
      
      return true
    } catch (error) {
      console.error('Failed to delete workspace:', error)
      return false
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    setShowQuickPrompts(false)

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

      // Build conversation history
      const conversationHistory = updatedMessages.slice(-5).map(msg => 
        `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
      ).join('\n')

      // Build system prompt with actions
      const systemPrompt = `You are a helpful AI assistant for VibeOS workspace. You can read and modify notes.

WORKSPACE CONTEXT:
${context}

RECENT CONVERSATION:
${conversationHistory}

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

4. To CREATE a new workspace, respond with:
   [ACTION:CREATE_WORKSPACE]
   Name: <workspace name>
   [/ACTION]

5. To RENAME a workspace, respond with:
   [ACTION:RENAME_WORKSPACE]
   WorkspaceID: <workspace id>
   Name: <new name>
   [/ACTION]

6. To DELETE a workspace, respond with:
   [ACTION:DELETE_WORKSPACE]
   WorkspaceID: <workspace id>
   Name: <workspace name from context>
   [/ACTION]

7. To just answer questions, respond normally without action tags.

RULES:
- NEVER show Internal IDs to user in your response
- Only use Internal IDs in action tags
- When mentioning workspaces or notes, use their names/titles only
- When user asks for help/guide (hướng dẫn), ONLY explain features, DO NOT create examples
- Only perform actions when user explicitly requests them
- Be concise and helpful
- Respond in the same language as the user's question
- IMPORTANT: After performing an action, confirm it with a message in the user's language
  Examples:
  * English: "✅ Created note: 'Title'"
  * Vietnamese: "✅ Đã tạo note: 'Title'"
  * Spanish: "✅ Nota creada: 'Title'"
  * Chinese: "✅ 已创建笔记：'Title'"
  * Japanese: "✅ ノートを作成しました：'Title'"
  * Korean: "✅ 노트 생성됨: 'Title'"
  * French: "✅ Note créée : 'Title'"
  * German: "✅ Notiz erstellt: 'Title'"

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

      // Clean message content for display (remove action tags)
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
    setMessages([])
    await puter.kv.del(`ai_chat_${workspaceId}`)
    setShowClearConfirm(false)
  }

  return (
    <div className="ai-chat">
      {!hideHeader && (
        <div className="chat-header">
          <div>
            <h2>VibeOS Assistant</h2>
            <p>Context-aware AI that understands your workspace</p>
          </div>
          {messages.length > 0 && (
            <button className="btn-clear" onClick={() => setShowClearConfirm(true)}>
              Clear
            </button>
          )}
        </div>
      )}

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <p>Hi! I'm your VibeOS assistant.</p>
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
        <div className="input-wrapper">
          <button
            className="btn-quick-prompts"
            onClick={() => setShowQuickPrompts(!showQuickPrompts)}
            title="Quick prompts"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              if (e.target.value === '/') {
                setShowQuickPrompts(true)
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
              if (e.key === 'Escape') {
                setShowQuickPrompts(false)
              }
            }}
            placeholder="Ask anything or press + for quick actions..."
            disabled={isLoading}
          />
          <button 
            className="btn-send"
            onClick={sendMessage} 
            disabled={isLoading || !input.trim()}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M14.5 1.5L7 9M14.5 1.5L10 14.5L7 9M14.5 1.5L1.5 6L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        {showQuickPrompts && (
          <div className="quick-prompts-popup">
            <div className="prompts-header">
              <span>Quick Actions</span>
              <button onClick={() => setShowQuickPrompts(false)}>×</button>
            </div>
            <div className="prompts-grid">
              {quickPrompts.map(prompt => (
                <button
                  key={prompt.key}
                  className="prompt-btn"
                  onClick={() => {
                    setInput(prompt.prompt)
                    setShowQuickPrompts(false)
                  }}
                >
                  {prompt.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all messages?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete all chat history in this workspace. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={clearChat}>
              Clear
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
