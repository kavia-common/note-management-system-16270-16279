import React from "react";

/**
 * PUBLIC_INTERFACE
 * Header component showing app name and a "New Note" action.
 */
function Header({ onNew }) {
  return (
    <header className="header" role="banner">
      <div className="header-inner">
        <div className="brand" aria-label="Notes brand">
          <div className="brand-logo" />
          <div className="brand-title">Notes</div>
          <span className="badge" aria-label="light theme">Light</span>
        </div>
        <div className="header-actions">
          <button className="btn accent" onClick={onNew} aria-label="Create new note">
            + New Note
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
