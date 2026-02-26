import { useState, useEffect } from 'react'
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
  refreshTrigger?: number
}

export const NotesList = ({ workspaceId, activeNoteId, onNoteSelect, refreshTrigger }: NotesListProps) => {
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string } | null>(null)

  useEffect(() => {
    loadNotes()
  }, [workspaceId])

  // Refresh when trigger changes
  useEffect(() => {
    if (refreshTrigger !== undefined && refreshTrigger > 0) {
      loadNotes()
    }
  }, [refreshTrigger])

  const loadNotes = async () => {
    try {
      const key = `notes_${workspaceId}`
      const saved = await puter.kv.get<Note[]>(key)
      if (saved) {
        setNotes(saved)
        if (saved.length > 0 && !activeNoteId) {
          onNoteSelect(saved[0].id)
        }
      } else {
        // Clear notes if workspace has no notes
        setNotes([])
      }
    } catch (error) {
      console.error('Failed to load notes:', error)
      setNotes([])
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
                  setDeleteConfirm({ id: note.id, title: note.title })
                }}
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>

      <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workspace?</AlertDialogTitle>
            <AlertDialogDescription>
              Delete "{deleteConfirm?.title}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteConfirm) {
                  deleteNote(deleteConfirm.id)
                  setDeleteConfirm(null)
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
