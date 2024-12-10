import os
import threading
import queue
import datetime

log_file_name = os.getenv("LOG_FILE_NAME")
if not log_file_name:
    raise ValueError("LOG_FILE_NAME environment variable must be set")

log_queue = queue.Queue()

def log_worker():
    """
    Runs in a background thread and processes log records from the
    log_queue. This function is run in a separate thread by the
    start_logging() function.

    The thread will exit when a None is posted to the log_queue.
    """
    print(f"Logging to {log_file_name}")
    with open(log_file_name, "a") as log_file:
        while True:
            record = log_queue.get()
            if record is None:
                break
            # If record is empty, don't write anything to the file
            if record:
                print(record)
                log_file.write(record + "\n")
                log_file.flush()

def create_log(record,log_type):
    add_log_record(f"[{datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}]  {log_type}: {record}")

def start_logging():
    """
    Starts a thread to handle all log records in the background. This must be called
    before any log records are added.
    """
    
    t = threading.Thread(target=log_worker, daemon=True)
    t.start()
    print(f"Started logging to {log_file_name}")

def add_log_record(record):
    log_queue.put(record)

