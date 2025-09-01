# Notes Frontend (React)

A modern, lightweight React frontend for managing notes with a light theme.

## Features

- Create, edit, delete, and list notes
- Split-pane layout: left list, right editor
- Modern, accessible UI with the provided color palette
- Uses REST API if REACT_APP_API_BASE_URL is set; falls back to localStorage otherwise

## Getting Started

Install and run:

```
npm install
npm start
```

Open http://localhost:3000/ in your browser.

## Environment

Copy `.env.example` to `.env` and set:

```
REACT_APP_API_BASE_URL=http://localhost:4000
```

If not set, data will persist in the browser via localStorage.

## Project Structure

- src/
  - components/
    - Header.js
    - NoteList.js
    - NoteEditor.js
  - services/
    - api.js
  - App.js
  - App.css
  - index.css
  - index.js

## Development Notes

- Components are functional with hooks and follow modern React patterns.
- Public interfaces in code are marked with the "PUBLIC_INTERFACE" comment and include docstrings where applicable.
- No external UI frameworks; styling uses CSS with the provided color palette:
  - primary: #1976d2
  - secondary: #64b5f6
  - accent: #ff9800

## Scripts

- `npm start` - development server
- `npm test` - run tests
- `npm run build` - production build
