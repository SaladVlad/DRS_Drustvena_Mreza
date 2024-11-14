FROM python:3.9

WORKDIR /app/engine

# Copy the requirements file first
COPY requirements.txt .

# Install dependencies and print installed packages for verification
RUN pip install --no-cache-dir -r requirements.txt && pip list

# Now copy the rest of the app code
COPY . .

CMD ["python", "run.py"]