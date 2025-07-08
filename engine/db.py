from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from configuration.config import app

# Centralizovane definicije
engine = create_engine(app.config['SQLALCHEMY_DATABASE_URI'],pool_size=20, max_overflow=0)
Session = sessionmaker(bind=engine)
Base = declarative_base()


Base.metadata.create_all(engine)