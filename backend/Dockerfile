FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file first for caching
COPY requirements.txt . 

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the app code
COPY . .

# Expose the port that the Flask app will run on
EXPOSE 5000

# Use Gunicorn to run the app for production
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "run:app"]
