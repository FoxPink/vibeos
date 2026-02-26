import { useState, useEffect } from 'react'
import type { Workspace } from '../app/MainApp'
import { NotesList } from '../notes/NotesList'
import { NoteEditor } from '../notes/NoteEditor'
import { AIChat } from '../ai/AIChat'
import './WorkspaceView.css'

interface WorkspaceViewProps {
  workspace: Workspace
  onWorkspaceAction?: (action: 'create' | 'rename' | 'delete', workspaceData: any) => void
}

export const WorkspaceView = ({ workspace, onWorkspaceAction }: WorkspaceViewProps) => {
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null)
  const [showChatBubble, setShowChatBubble] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [notesRefreshTrigger, setNotesRefreshTrigger] = useState(0)
  const [notesWidth, setNotesWidth] = useState(320)
  const [isResizing, setIsResizing] = useState(false)
  const [isNotesCollapsed, setIsNotesCollapsed] = useState(false)

  // Reset when workspace changes
  useEffect(() => {
    setActiveNoteId(null)
    setNotesRefreshTrigger(prev => prev + 1)
  }, [workspace.id])

  const handleNoteSaved = () => {
    // Trigger notes list refresh without remounting
    setNotesRefreshTrigger(prev => prev + 1)
  }

  const handleNoteAction = (action: 'create' | 'update' | 'delete', noteData: any) => {
    // Refresh notes list when AI creates/updates/deletes notes
    setNotesRefreshTrigger(prev => prev + 1)
    
    // If creating new note, select it
    if (action === 'create') {
      setActiveNoteId(noteData.id)
    }
    
    // If deleting active note, clear selection
    if (action === 'delete' && activeNoteId === noteData.id) {
      setActiveNoteId(null)
    }
  }

  const handleWorkspaceAction = (action: 'create' | 'rename' | 'delete', workspaceData: any) => {
    // Forward to parent
    if (onWorkspaceAction) {
      onWorkspaceAction(action, workspaceData)
    }
  }

  const handleMouseDown = () => {
    setIsResizing(true)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return
    
    const newWidth = e.clientX - 280 // 280 is sidebar width
    if (newWidth >= 200 && newWidth <= 600) {
      setNotesWidth(newWidth)
    }
  }

  const handleMouseUp = () => {
    setIsResizing(false)
  }

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove as any)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    } else {
      document.removeEventListener('mousemove', handleMouseMove as any)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove as any)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing])

  return (
    <div className="workspace-view">
      <div className="workspace-header">
        <h1>{workspace.name}</h1>
      </div>

      <div className="workspace-content">
        <div 
          className="notes-layout" 
          data-collapsed={isNotesCollapsed}
          style={{ '--notes-width': `${notesWidth}px` } as React.CSSProperties}
        >
          <div className="notes-column" style={{ width: isNotesCollapsed ? '0px' : `${notesWidth}px` }}>
            <NotesList
              workspaceId={workspace.id}
              activeNoteId={activeNoteId}
              onNoteSelect={setActiveNoteId}
              refreshTrigger={notesRefreshTrigger}
            />
          </div>
          {!isNotesCollapsed && (
            <div 
              className="resize-handle"
              onMouseDown={handleMouseDown}
            />
          )}
          <button 
            className="toggle-notes-btn"
            onClick={() => setIsNotesCollapsed(!isNotesCollapsed)}
            title={isNotesCollapsed ? 'Show Notes' : 'Hide Notes'}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              {isNotesCollapsed ? (
                <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              ) : (
                <path d="M8 2L4 6L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              )}
            </svg>
          </button>
          <div className="editor-column">
            <NoteEditor
              workspaceId={workspace.id}
              noteId={activeNoteId}
              onNoteSaved={handleNoteSaved}
              refreshTrigger={notesRefreshTrigger}
            />
          </div>
        </div>
        
        {/* Floating Chat Bubble */}
        {showChatBubble && (
          <div className={`chat-bubble-container ${isExpanded ? 'expanded' : ''}`}>
            <div className="chat-bubble-header">
              <span>VibeOS Assistant</span>
              <div className="chat-bubble-actions">
                <button 
                  className="btn-expand"
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={isExpanded ? 'Collapse' : 'Expand'}
                >
                  {isExpanded ? '⤓' : '⤢'}
                </button>
                <button 
                  className="btn-minimize"
                  onClick={() => {
                    setShowChatBubble(false)
                    setIsExpanded(false)
                  }}
                  title="Minimize"
                >
                  −
                </button>
              </div>
            </div>
            <div className="chat-bubble-content">
              <AIChat 
                workspaceId={workspace.id} 
                hideHeader={true}
                onNoteAction={handleNoteAction}
                onWorkspaceAction={handleWorkspaceAction}
              />
            </div>
          </div>
        )}
        
        {/* Floating Action Button */}
        {!showChatBubble && (
          <button 
            className="fab-chat"
            onClick={() => {
              setShowChatBubble(true)
              setIsExpanded(false)
            }}
            title="Open AI Chat"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 13.93 2.6 15.71 3.63 17.17L2.05 21.95L7.01 20.42C8.39 21.24 10.14 21.75 12 21.75C17.52 21.75 22 17.27 22 11.75C22 6.23 17.52 2 12 2Z" fill="currentColor"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
