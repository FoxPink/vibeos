import { useState, useEffect } from 'react'
import puter from '@heyputer/puter.js'
import { Sidebar } from './components/Sidebar'
import { WorkspaceView } from '../workspace/WorkspaceView'
import './MainApp.css'

export interface Workspace {
  id: string
  name: string
  createdAt: string
}

export const MainApp = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadWorkspaces()
  }, [])

  const loadWorkspaces = async () => {
    try {
      const saved = await puter.kv.get<Workspace[]>('workspaces')
      if (saved && saved.length > 0) {
        setWorkspaces(saved)
        setActiveWorkspaceId(saved[0].id)
      } else {
        // Create default workspace
        const defaultWorkspace: Workspace = {
          id: 'default',
          name: 'My Workspace',
          createdAt: new Date().toISOString()
        }
        setWorkspaces([defaultWorkspace])
        setActiveWorkspaceId('default')
        await puter.kv.set('workspaces', [defaultWorkspace])
      }
    } catch (error) {
      console.error('Failed to load workspaces:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const createWorkspace = async (name: string) => {
    const newWorkspace: Workspace = {
      id: Date.now().toString(),
      name,
      createdAt: new Date().toISOString()
    }
    const updated = [...workspaces, newWorkspace]
    setWorkspaces(updated)
    setActiveWorkspaceId(newWorkspace.id)
    await puter.kv.set('workspaces', updated)
  }

  const deleteWorkspace = async (id: string) => {
    if (workspaces.length === 1) {
      alert('Cannot delete the last workspace')
      return
    }
    const updated = workspaces.filter(w => w.id !== id)
    setWorkspaces(updated)
    if (activeWorkspaceId === id) {
      setActiveWorkspaceId(updated[0].id)
    }
    await puter.kv.set('workspaces', updated)
  }

  const renameWorkspace = async (id: string, name: string) => {
    const updated = workspaces.map(w =>
      w.id === id ? { ...w, name } : w
    )
    setWorkspaces(updated)
    await puter.kv.set('workspaces', updated)
  }

  const handleWorkspaceAction = async (action: 'create' | 'rename' | 'delete', workspaceData: any) => {
    if (action === 'create') {
      setWorkspaces(prev => [...prev, workspaceData])
      setActiveWorkspaceId(workspaceData.id)
    } else if (action === 'rename') {
      setWorkspaces(prev => prev.map(w => 
        w.id === workspaceData.id ? workspaceData : w
      ))
    } else if (action === 'delete') {
      const updated = workspaces.filter(w => w.id !== workspaceData.id)
      
      // If no workspaces left, create default workspace
      if (updated.length === 0) {
        const defaultWorkspace: Workspace = {
          id: Date.now().toString(),
          name: 'My Workspace',
          createdAt: new Date().toISOString()
        }
        setWorkspaces([defaultWorkspace])
        setActiveWorkspaceId(defaultWorkspace.id)
        await puter.kv.set('workspaces', [defaultWorkspace])
      } else {
        setWorkspaces(updated)
        if (activeWorkspaceId === workspaceData.id) {
          setActiveWorkspaceId(updated[0].id)
        }
        await puter.kv.set('workspaces', updated)
      }
    }
  }

  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId)

  if (isLoading) {
    return <div className="loading-screen">Loading workspace...</div>
  }

  return (
    <div className="main-app">
      <Sidebar
        workspaces={workspaces}
        activeWorkspaceId={activeWorkspaceId}
        onWorkspaceSelect={setActiveWorkspaceId}
        onWorkspaceCreate={createWorkspace}
        onWorkspaceDelete={deleteWorkspace}
        onWorkspaceRename={renameWorkspace}
      />
      <div className="main-content">
        {activeWorkspace && (
          <WorkspaceView 
            workspace={activeWorkspace}
            onWorkspaceAction={handleWorkspaceAction}
          />
        )}
      </div>
    </div>
  )
}
