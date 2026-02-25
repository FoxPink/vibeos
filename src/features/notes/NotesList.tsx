import { useState, useEffect } from 'react'
import puter from '@heyputer/puter.js'
import './NotesList.css'

interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

interface NotesListProps {
  workspaceId: string
  activeNoteId: string | null
  onNoteSelect: (id: string) => void
}

export const NotesList = ({ workspaceId, activeNoteId, onNoteSelect }: NotesListProps) => {
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadNotes()
  }, [workspaceId])

  const loadNotes = async () => {
    try {
      const key = `notes_${workspaceId}`
      const saved = await puter.kv.get<Note[]>(key)
      if (saved) {
        setNotes(saved)
        if (saved.length > 0 && !activeNoteId) {
          onNoteSelect(saved[0].id)
        }
      }
    } catch (error) {
      console.error('Failed to load notes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const createNote = async () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    const updated = [newNote, ...notes]
    setNotes(updated)
    onNoteSelect(newNote.id)
    await puter.kv.set(`notes_${workspaceId}`, updated)
  }

  const deleteNote = async (id: string) => {
    const updated = notes.filter(n => n.id !== id)
    setNotes(updated)
    if (activeNoteId === id && updated.length > 0) {
      onNoteSelect(updated[0].id)
    }
    await puter.kv.set(`notes_${workspaceId}`, updated)
  }

  if (isLoading) {
    return <div className="notes-list loading">Loading notes...</div>
  }

  return (
    <div className="notes-list">
      <div className="notes-header">
        <h2>Notes</h2>
        <button className="btn-new-note" onClick={createNote}>
          + New
        </button>
      </div>

      <div className="notes-items">
        {notes.length === 0 ? (
          <div className="empty-state">
            <p>No notes yet</p>
            <button onClick={createNote}>Create your first note</button>
          </div>
        ) : (
          notes.map(note => (
            <div
              key={note.id}
              className={`note-item ${note.id === activeNoteId ? 'active' : ''}`}
              onClick={() => onNoteSelect(note.id)}
            >
              <div className="note-title">{note.title}</div>
              <div className="note-preview">
                {note.content.slice(0, 60) || 'Empty note'}
              </div>
              <button
                className="btn-delete-note"
                onClick={(e) => {
                  e.stopPropagation()
                  if (confirm(`Delete "${note.title}"?`)) {
                    deleteNote(note.id)
                  }
                }}
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
