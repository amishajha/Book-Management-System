from fastapi import FastAPI ,Depends,HTTPException
from sqlalchemy.orm import Session
import models,schemas
from database import engine, SessionLocal

from typing import Optional
from fastapi.middleware.cors import CORSMiddleware

schemas.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Dependency to get DB session
def get_db():
    db  = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# GET Endpoint with Path Parameter
# @app.get("/books/{book_id}")
# def get_book(book_id: int):
#     print("DEBUG: requested id =", book_id, type(book_id))
#     for book in books:
#         print("DEBUG: checking book id =", book["id"], type(book["id"]))
#         if book["id"] == book_id:
#             print("DEBUG: FOUND!")
#             return book
#     print("DEBUG: NOT FOUND")
#     return {"error": "Book not found"}


#GET QUERY PARAMETER

@app.post("/books/", response_model=models.BookResponse)
def create_book(book: models.BookCreate, db: Session = Depends(get_db)):
    db_book = schemas.Book(title=book.title, author=book.author)
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book

# ✅ Get all Books
@app.get("/books/", response_model=list[models.BookResponse])
def get_books(db: Session = Depends(get_db)):
    return db.query(schemas.Book).all()

@app.get("/books/{book_id}", response_model=models.BookResponse)
def get_book(book_id: int, db: Session = Depends(get_db)):
    book = db.query(schemas.Book).filter(schemas.Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book


# ✅ Update a Book
@app.put("/books/{book_id}", response_model=models.BookResponse)
def update_book(book_id: int,book_update:models.BookUpdate, db: Session = Depends(get_db)):
    book = db.query(schemas.Book).filter(schemas.Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    if book_update.title is not None:
        book.title = book_update.title
    if book_update.author is not None:
        book.author = book_update.author
    db.commit()
    db.refresh(book)
    return book

@app.delete("/books/{book_id}")
def delete_book(book_id:int, db:Session=Depends(get_db)):
    book = db.query(schemas.Book).filter(schemas.Book.id==book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    db.delete(book)
    db.commit()
    return {"detail":"Book deleted successfully"}







app.add_middleware(
  CORSMiddleware,
  allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # add your dev origin
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)


# app.add_middleware(CORSMiddleware, ...)

# add_middleware is a FastAPI method to add middleware, which is a piece of code that runs before and/or after every request.

# CORSMiddleware is a specific middleware that handles CORS (Cross-Origin Resource Sharing).
