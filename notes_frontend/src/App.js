import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import NoteList from "./components/NoteList";
import NoteEditor from "./components/NoteEditor";
import { listNotes, createNote, updateNote, deleteNote } from "./services/api";

/**
 * PUBLIC_INTERFACE
 * App component organizing the layout and managing notes state.
 */
function App() {
  const [notes, setNotes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load notes
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await listNotes();
        if (mounted) {
          setNotes(data);
          setSelectedId(data[0]?.id || null);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const selected = useMemo(() => notes.find(n => n.id === selectedId), [notes, selectedId]);

  // Create new note and select it
  const handleNew = useCallback(async () => {
    const draft = { title: "Untitled", content: "" };
    const created = await createNote(draft);
    setNotes(prev => [created, ...prev]);
    setSelectedId(created.id);
  }, []);

  // Delete note by id
  const handleDelete = useCallback(async (id) => {
    await deleteNote(id);
    setNotes(prev => prev.filter(n => n.id !== id));
    setSelectedId(prev => (prev === id ? null : prev));
  }, []);

  // Save note (create or update based on presence of id)
  const handleSave = useCallback(async (note) => {
    if (!note.id) {
      const created = await createNote({ title: note.title, content: note.content });
      setNotes(prev => [created, ...prev]);
      setSelectedId(created.id);
      return;
    }
    const updated = await updateNote(note.id, { title: note.title, content: note.content });
    setNotes(prev => prev.map(n => (n.id === updated.id ? updated : n)));
  }, []);

  // Start new draft in editor without persisting until user clicks Create
  const startDraft = useCallback(() => {
    const tmp = { id: null, title: "", content: "", updatedAt: Date.now() };
    setSelectedId(null);
    // we do not add to list; just render editor with no selection
    setNotes(prev => [...prev]);
  }, []);

  return (
    <div className="app">
      <Header onNew={startDraft} />
      <main className="main">
        <div className="surface split" role="main">
          <NoteList
            notes={notes}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onDelete={handleDelete}
          />
          {loading ? (
            <section className="editor">
              <div className="empty-state">
                <div>Loading…</div>
              </div>
            </section>
          ) : (
            <NoteEditor
              note={selected || (selectedId === null ? { id: null, title: "", content: "", updatedAt: Date.now() } : null)}
              onSave={handleSave}
              onDelete={handleDelete}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
