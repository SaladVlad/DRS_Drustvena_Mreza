from configuration.config import app, socketio
from db import Base, engine
from controllers.logging import start_logging, create_log

def start_server():
    start_logging()
    create_log("Server starting", "SERVER_STARTED")
    Base.metadata.create_all(engine)
    create_log("Database initialized", "DB_INITIALIZED")

# if __name__ == '__main__':
#     start_server()
#     socketio.run(app, host="0.0.0.0", port=5000)
