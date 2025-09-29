import React, { useEffect, useState } from "react";
import { api } from "../Api";
import EditBook from "./EditBook";

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null); // book object being edited

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.getBooks();
      setBooks(data);
    } catch (err) {
      alert("Failed to load books: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // refresh when other components make changes (simple event bus)
    const cb = () => load();
    window.addEventListener("books:changed", cb);
    return () => window.removeEventListener("books:changed", cb);
  }, []);

  const remove = async (id) => {
    if (!confirm("Delete this book?")) return;
    try {
      await api.deleteBook(id);
      window.dispatchEvent(new Event("books:changed"));
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  const filtered = books.filter((b) => {
    if (!q.trim()) return true;
    const s = q.toLowerCase();
    return b.title.toLowerCase().includes(s) || b.author.toLowerCase().includes(s);
  });

  return (
    <div className="card">
      <div className="toolbar">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title or author..." />
        <button onClick={load}>Refresh</button>
      </div>

      {loading ? (
        <p>Loading...</p>
) : (
  <div className="table-container">
    <table className="book-table">
      <thead>
        <tr><th>ID</th><th>Title</th><th>Author</th><th>Actions</th></tr>
      </thead>
      <tbody>
        {filtered.map(book => (
          <tr key={book.id}>
            <td data-label="ID">{book.id}</td>
            <td data-label="Title">{book.title}</td>
            <td data-label="Author">{book.author}</td>
            <td data-label="Actions">
              <button onClick={() => setEditing(book)}>Edit</button>
              <button onClick={() => remove(book.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
{/* No additional code needed here for "edi" */}
      {editing && <EditBook book={editing} onClose={() => setEditing(null)} />}
    </div>
    
  );
}
