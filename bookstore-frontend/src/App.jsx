import React from "react";
import "./App.css";
import AddBookForm from "./components/AddBookForm";
import BookList from "./components/BookList";


export default function App() {
  return (
    <div className="app">
      <header>
        <h1>Book Store</h1>
      </header>

      <main>
        <AddBookForm />
        <BookList />
      </main>
    </div>
  )}