from pydantic import BaseModel
from typing import Optional

class BookBase(BaseModel):
    title: str
    author: str

class BookCreate(BookBase):  # for POST requests
    pass

class BookUpdate(BaseModel):  # for PATCH/PUT requests
    title: Optional[str] = None
    author: Optional[str] = None

class BookResponse(BookBase):  # for responses (GET requests)
    id: int

    class Config:
        orm_mode = True   # allows SQLAlchemy objects → Pydantic
