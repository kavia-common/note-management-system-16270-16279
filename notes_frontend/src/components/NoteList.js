import React, { useMemo, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * Renders a searchable list of notes with select and delete controls.
 */
function NoteList({ notes, selectedId, onSelect, onDelete }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(n =>
      (n.title || "").toLowerCase().includes(q) ||
      (n.content || "").toLowerCase().includes(q)
    );
  }, [notes, query]);

  return (
    <aside className="sidebar" aria-label="Notes list">
      <div className="sidebar-header">
        <input
          className="input"
          placeholder="Search notes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search notes"
        />
      </div>
      <div className="notes-list">
        {filtered.length === 0 && (
          <div className="empty-state">
            <div>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>No notes found</div>
              <div className="row" style={{ justifyContent: "center" }}>
                <div className="badge">Try a different search</div>
              </div>
            </div>
          </div>
        )}
        {filtered.map((n) => (
          <div
            key={n.id}
            className={"note-item" + (n.id === selectedId ? " active" : "")}
            onClick={() => onSelect?.(n.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onSelect?.(n.id)}
            aria-label={`Open note ${n.title || "Untitled"}`}
          >
            <div>
              <div className="note-title">{n.title || "Untitled"}</div>
              <div className="note-snippet">
                {(n.content || "").slice(0, 90)}
                {n.content && n.content.length > 90 ? "…" : ""}
              </div>
            </div>
            <div className="note-meta">
              <span>{new Date(n.updatedAt).toLocaleDateString()}</span>
              <button
                className="btn ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(n.id);
                }}
                aria-label={`Delete note ${n.title || "Untitled"}`}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default NoteList;
