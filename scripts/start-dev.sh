#!/bin/bash

# Kill any processes using the specified ports
kill_port() {
    local port=$1
    if lsof -i :$port > /dev/null; then
        echo "Killing process on port $port"
        lsof -ti :$port | xargs kill -9
    fi
}

# Kill processes on commonly used ports
kill_port 3000
kill_port 5432

# Down any existing containers
docker-compose -f docker-compose.dev.yml down

# Clean up Docker resources
docker system prune -f
docker volume prune -f

# Start the development environment
docker-compose -f docker-compose.dev.yml up --build 