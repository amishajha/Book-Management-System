import React, { useState } from "react";
import { api } from "../Api";

export default function AddBookForm() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return alert("title and author required");
    setLoading(true);
    try {
      await api.createBook({ title: title.trim(), author: author.trim() });
      // Trigger global event so BookList refreshes
      window.dispatchEvent(new Event("books:changed"));
      setTitle("");
      setAuthor("");
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="cardform" onSubmit={submit}>
      <h3>Add Book</h3>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author" />
      <button disabled={loading}>{loading ? "Adding..." : "Add Book"}</button>
    </form>
  );
}
