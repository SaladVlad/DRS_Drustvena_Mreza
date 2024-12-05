from configuration.config import app, db
from db import Base,engine

def init_db():
    Base.metadata.create_all(engine)
    print("Database initialized")

if __name__ == '__main__':
    init_db()
    app.run() # Run the app
    