from configuration.config import app, db, socketio
from db import Base,engine
from controllers.logging import start_logging,create_log

def init_db():
    Base.metadata.create_all(engine)
    create_log("Database initialized", "DB_INITIALIZED")

if __name__ == '__main__':
    start_logging()
    create_log("Server starting", "SERVER_STARTED")

    init_db()
    socketio.run(app,host="0.0.0.0",port=5000) # Run the app
    