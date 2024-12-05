# Use the official MySQL image from the Docker Hub
FROM mysql:8.0

# Copy the dbinit.sql script to the container's /docker-entrypoint-initdb.d/ directory
# This directory is special in MySQL Docker images and any script inside it will be run when the container is initialized.
COPY dbinit.sql /docker-entrypoint-initdb.d/

# Expose the MySQL port
EXPOSE 3306
