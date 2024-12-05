FROM python:3.9

WORKDIR /app

# Copy the requirements file first
COPY requirements.txt .

# Install dependencies and print installed packages for verification
RUN pip install --no-cache-dir -r requirements.txt && pip list

# Now copy the rest of the app code
COPY . .

# List the contents of /app to ensure all files are copied
RUN ls -R /app

WORKDIR /app

ENV PYTHONPATH /app

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "run:app"]
