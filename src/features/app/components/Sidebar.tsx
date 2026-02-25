import { useState } from 'react'
import type { Workspace } from '../MainApp'
import './Sidebar.css'

interface SidebarProps {
  workspaces: Workspace[]
  activeWorkspaceId: string | null
  onWorkspaceSelect: (id: string) => void
  onWorkspaceCreate: (name: string) => void
  onWorkspaceDelete: (id: string) => void
}

export const Sidebar = ({
  workspaces,
  activeWorkspaceId,
  onWorkspaceSelect,
  onWorkspaceCreate,
  onWorkspaceDelete
}: SidebarProps) => {
  const [isCreating, setIsCreating] = useState(false)
  const [newWorkspaceName, setNewWorkspaceName] = useState('')

  const handleCreate = () => {
    if (newWorkspaceName.trim()) {
      onWorkspaceCreate(newWorkspaceName.trim())
      setNewWorkspaceName('')
      setIsCreating(false)
    }
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-small">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">VibeOS</span>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="section-header">
          <h3>Workspaces</h3>
          <button 
            className="btn-icon"
            onClick={() => setIsCreating(true)}
            title="New workspace"
          >
            +
          </button>
        </div>

        {isCreating && (
          <div className="workspace-create">
            <input
              type="text"
              placeholder="Workspace name"
              value={newWorkspaceName}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              autoFocus
            />
            <div className="create-actions">
              <button onClick={handleCreate}>Create</button>
              <button onClick={() => {
                setIsCreating(false)
                setNewWorkspaceName('')
              }}>Cancel</button>
            </div>
          </div>
        )}

        <div className="workspace-list">
          {workspaces.map(workspace => (
            <div
              key={workspace.id}
              className={`workspace-item ${workspace.id === activeWorkspaceId ? 'active' : ''}`}
              onClick={() => onWorkspaceSelect(workspace.id)}
            >
              <span className="workspace-name">{workspace.name}</span>
              {workspaces.length > 1 && (
                <button
                  className="btn-delete"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (confirm(`Delete "${workspace.name}"?`)) {
                      onWorkspaceDelete(workspace.id)
                    }
                  }}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
