import { useState } from 'react'
import type { Workspace } from '../app/MainApp'
import { NotesList } from '../notes/NotesList'
import { NoteEditor } from '../notes/NoteEditor'
import { AIChat } from '../ai/AIChat'
import './WorkspaceView.css'

interface WorkspaceViewProps {
  workspace: Workspace
}

export const WorkspaceView = ({ workspace }: WorkspaceViewProps) => {
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null)
  const [showAI, setShowAI] = useState(false)

  return (
    <div className="workspace-view">
      <div className="workspace-header">
        <h1>{workspace.name}</h1>
        <button 
          className="btn-ai"
          onClick={() => setShowAI(!showAI)}
        >
          {showAI ? '📝 Notes' : '🤖 AI Assistant'}
        </button>
      </div>

      <div className="workspace-content">
        {showAI ? (
          <AIChat workspaceId={workspace.id} />
        ) : (
          <div className="notes-layout">
            <NotesList
              workspaceId={workspace.id}
              activeNoteId={activeNoteId}
              onNoteSelect={setActiveNoteId}
            />
            <NoteEditor
              workspaceId={workspace.id}
              noteId={activeNoteId}
            />
          </div>
        )}
      </div>
    </div>
  )
}
