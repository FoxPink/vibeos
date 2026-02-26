import { useState } from 'react'
import puter from '@heyputer/puter.js'
import type { Workspace } from '../MainApp'
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
import './Sidebar.css'

interface SidebarProps {
  workspaces: Workspace[]
  activeWorkspaceId: string | null
  onWorkspaceSelect: (id: string) => void
  onWorkspaceCreate: (name: string) => void
  onWorkspaceDelete: (id: string) => void
  onWorkspaceRename: (id: string, name: string) => void
}

export const Sidebar = ({
  workspaces,
  activeWorkspaceId,
  onWorkspaceSelect,
  onWorkspaceCreate,
  onWorkspaceDelete,
  onWorkspaceRename
}: SidebarProps) => {
  const [isCreating, setIsCreating] = useState(false)
  const [newWorkspaceName, setNewWorkspaceName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null)

  const handleCreate = () => {
    if (newWorkspaceName.trim()) {
      onWorkspaceCreate(newWorkspaceName.trim())
      setNewWorkspaceName('')
      setIsCreating(false)
    }
  }

  const handleRename = (id: string) => {
    if (editName.trim()) {
      onWorkspaceRename(id, editName.trim())
      setEditingId(null)
      setEditName('')
    }
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <a href="/" className="logo-small">
          <div className="logo-icon">V</div>
          <span className="logo-text">VibeOS</span>
        </a>
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
              {editingId === workspace.id ? (
                <input
                  type="text"
                  className="workspace-rename-input"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRename(workspace.id)
                    if (e.key === 'Escape') {
                      setEditingId(null)
                      setEditName('')
                    }
                  }}
                  onBlur={() => handleRename(workspace.id)}
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
              ) : (
                <>
                  <span 
                    className="workspace-name"
                    onDoubleClick={(e) => {
                      e.stopPropagation()
                      setEditingId(workspace.id)
                      setEditName(workspace.name)
                    }}
                  >
                    {workspace.name}
                  </span>
                  {workspaces.length > 1 && (
                    <button
                      className="btn-delete"
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeleteConfirm({ id: workspace.id, name: workspace.name })
                      }}
                    >
                      ×
                    </button>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="sidebar-footer">
        <button 
          className="btn-logout"
          onClick={async () => {
            await puter.auth.signOut()
            window.location.href = '/'
          }}
        >
          Logout
        </button>
      </div>

      <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workspace?</AlertDialogTitle>
            <AlertDialogDescription>
              Delete "{deleteConfirm?.name}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteConfirm) {
                  onWorkspaceDelete(deleteConfirm.id)
                  setDeleteConfirm(null)
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </aside>
  )
}
