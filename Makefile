# Paths
FRONTEND_DIR := src
BACKEND_DIR := src/backend

# Commands
PYTHON := python3
UVICORN := uvicorn
NPM := npm

# Entrypoints
BACKEND_ENTRY := $(BACKEND_DIR)/main.py

# Targets

# Help Command
help:
	@echo "Makefile commands:"
	@echo "  backend          - Run the FastAPI backend"
	@echo "  frontend         - Run the Vite frontend"
	@echo "  dev              - Run both backend and frontend in parallel"
	@echo "  install-frontend - Install frontend dependencies"
	@echo "  install-backend  - Install backend dependencies"
	@echo "  lint             - Lint Python backend code"
	@echo "  clean            - Clean cache files"
	@echo "  help             - Show this help message"

# Run backend (FastAPI)
backend:
	cd $(BACKEND_DIR) && $(UVICORN) main:app --reload

# Run frontend (Vite)
frontend:
	cd $(FRONTEND_DIR) && $(NPM) run dev

# Run both frontend and backend in parallel
dev:
	@echo "Starting backend and frontend..."
	@make -j2 backend frontend

# Install frontend dependencies
install-frontend:
	cd $(FRONTEND_DIR) && $(NPM) install

# Install backend dependencies (if using requirements.txt)
install-backend:
	cd $(BACKEND_DIR) && pip install -r requirements.txt

# Lint Python backend
lint:
	flake8 $(BACKEND_DIR)

# Clean cache files
clean:
	find . -name '__pycache__' -exec rm -rf {} +


