from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker




DATABASE_URL = "sqlite:///./books.db"


# create_engine creates a connection object (called an engine) that tells SQLAlchemy how to talk to your database.

engine = create_engine(DATABASE_URL,connect_args={"check_same_thread": False})

# sessionmaker creates a Session class, which you use to talk to the database in a transaction-safe way.

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)



Base = declarative_base()