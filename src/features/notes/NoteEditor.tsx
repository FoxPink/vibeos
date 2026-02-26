import { useState, useEffect } from 'react'
import puter from '@heyputer/puter.js'
import './NoteEditor.css'

interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

interface NoteEditorProps {
  workspaceId: string
  noteId: string | null
  onNoteSaved?: () => void
  refreshTrigger?: number
}

export const NoteEditor = ({ workspaceId, noteId, onNoteSaved, refreshTrigger }: NoteEditorProps) => {
  const [note, setNote] = useState<Note | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    if (noteId) {
      loadNote()
    }
  }, [noteId, workspaceId])

  // Reload when external changes happen (AI updates)
  useEffect(() => {
    if (refreshTrigger !== undefined && refreshTrigger > 0 && noteId) {
      loadNote()
    }
  }, [refreshTrigger])

  const loadNote = async () => {
    if (!noteId) return

    try {
      const key = `notes_${workspaceId}`
      const notes = await puter.kv.get<Note[]>(key)
      const found = notes?.find(n => n.id === noteId)
      if (found) {
        setNote(found)
        setTitle(found.title)
        setContent(found.content)
      }
    } catch (error) {
      console.error('Failed to load note:', error)
    }
  }

  const saveNote = async () => {
    if (!note) return

    try {
      const key = `notes_${workspaceId}`
      const notes = await puter.kv.get<Note[]>(key) || []
      const updated = notes.map(n =>
        n.id === note.id
          ? { ...n, title, content, updatedAt: new Date().toISOString() }
          : n
      )
      await puter.kv.set(key, updated)
      
      // Notify parent to refresh notes list
      if (onNoteSaved) {
        onNoteSaved()
      }
    } catch (error) {
      console.error('Failed to save note:', error)
    }
  }

  // Auto-save after 1 second of inactivity
  useEffect(() => {
    if (!note) return
    const timer = setTimeout(() => {
      saveNote()
    }, 1000)
    return () => clearTimeout(timer)
  }, [title, content])

  if (!noteId) {
    return (
      <div className="note-editor empty">
        <div className="empty-editor">
          <p>Select a note or create a new one</p>
        </div>
      </div>
    )
  }

  return (
    <div className="note-editor">
      <div className="editor-header">
        <input
          type="text"
          className="note-title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled Note"
        />
      </div>

      <textarea
        className="note-content-input"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start writing..."
      />
    </div>
  )
}
