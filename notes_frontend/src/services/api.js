/**
 * PUBLIC_INTERFACE
 * A lightweight API client that uses REST endpoints when REACT_APP_API_BASE_URL is defined,
 * otherwise falls back to localStorage for persistence.
 */
const BASE_URL = process.env.REACT_APP_API_BASE_URL?.trim();

/** Note shape:
 * { id: string, title: string, content: string, updatedAt: number }
 */

const LS_KEY = "notes_app_items_v1";

function loadFromLS() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  } catch {
    return [];
  }
}
function saveToLS(items) {
  localStorage.setItem(LS_KEY, JSON.stringify(items));
}

async function http(method, path, body) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Request failed: ${res.status} ${txt}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

// PUBLIC_INTERFACE
export async function listNotes() {
  if (!BASE_URL) {
    return loadFromLS().sort((a, b) => b.updatedAt - a.updatedAt);
  }
  return http("GET", "/notes");
}

// PUBLIC_INTERFACE
export async function createNote({ title, content }) {
  const now = Date.now();
  if (!BASE_URL) {
    const items = loadFromLS();
    const note = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(now),
      title: title?.trim() || "Untitled",
      content: content || "",
      updatedAt: now,
    };
    items.push(note);
    saveToLS(items);
    return note;
  }
  return http("POST", "/notes", { title, content, updatedAt: now });
}

// PUBLIC_INTERFACE
export async function updateNote(id, { title, content }) {
  const now = Date.now();
  if (!BASE_URL) {
    const items = loadFromLS();
    const idx = items.findIndex(n => n.id === id);
    if (idx >= 0) {
      items[idx] = { ...items[idx], title, content, updatedAt: now };
      saveToLS(items);
      return items[idx];
    }
    throw new Error("Note not found");
  }
  return http("PUT", `/notes/${encodeURIComponent(id)}`, { title, content, updatedAt: now });
}

// PUBLIC_INTERFACE
export async function deleteNote(id) {
  if (!BASE_URL) {
    const items = loadFromLS().filter(n => n.id !== id);
    saveToLS(items);
    return true;
  }
  await http("DELETE", `/notes/${encodeURIComponent(id)}`);
  return true;
}
