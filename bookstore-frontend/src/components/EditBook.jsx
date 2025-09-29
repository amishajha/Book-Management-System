import React, { useState } from "react";
import { api } from "../Api";

export default function EditBook({ book, onClose }) {
  const [title, setTitle] = useState(book.title ?? "");
  const [author, setAuthor] = useState(book.author ?? "");
  const [saving, setSaving] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Use PUT with body (allowed)
      await api.updateBook(book.id, { title, author });
      window.dispatchEvent(new Event("books:changed"));
      onClose();
    } catch (err) {
      alert("Update failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal">
      <form className="cardform" onSubmit={save}>
        <h3>Edit Book (#{book.id})</h3>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author" />
        <div className="buttons">
          <button type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
