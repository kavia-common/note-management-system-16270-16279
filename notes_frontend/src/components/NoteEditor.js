import React, { useEffect, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * Editor for a note: title and content with Save/Delete actions.
 */
function NoteEditor({ note, onSave, onDelete }) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const isNew = !note?.id;

  useEffect(() => {
    setTitle(note?.title || "");
    setContent(note?.content || "");
  }, [note?.id]); // reset when different note selected

  if (!note) {
    return (
      <section className="editor" aria-label="Note editor">
        <div className="empty-state">
          <div>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Select a note to get started</div>
            <div className="row" style={{ justifyContent: "center" }}>
              <div className="badge">Or create a new one</div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="editor" aria-label="Note editor">
      <div className="editor-header">
        <input
          className="title-input"
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Note title"
        />
        {!isNew && (
          <button className="btn ghost" onClick={() => onDelete?.(note.id)} aria-label="Delete note">
            Delete
          </button>
        )}
        <button
          className="btn"
          onClick={() => onSave?.({ ...note, title: title.trim() || "Untitled", content })}
          aria-label="Save note"
        >
          {isNew ? "Create" : "Save"}
        </button>
      </div>
      <div className="editor-body">
        <textarea
          className="textarea"
          placeholder="Write your note here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          aria-label="Note content"
        />
        <div className="footer-actions">
          <span className="badge">Auto date: {new Date(note.updatedAt || Date.now()).toLocaleString()}</span>
        </div>
      </div>
    </section>
  );
}

export default NoteEditor;
