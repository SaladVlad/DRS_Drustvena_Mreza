
from Configuration.config import app, db


if __name__ == '__main__':
    with app.app_context():
        db.create_all() # Create all database tables if they don't exist
    app.run(debug=True, port=5000) # Run the app with debug mode on port 5000
