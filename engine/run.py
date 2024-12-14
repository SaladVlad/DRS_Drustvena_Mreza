from configuration.config import app, db, socketio
from controllers.logging import start_logging,create_log

if __name__ == '__main__':
    start_logging()
    create_log("Server starting", "SERVER_STARTED")
    socketio.run(app, host="0.0.0.0",debug=True, port=5000) # Run the app
    with app.app_context():
        
        db.create_all() # Create all database tables if they don't exist
    
