# FcienciasApp - Development Setup

.PHONY: help install dev up down logs clean test

help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies for both frontend and backend
	@echo "Installing backend dependencies..."
	cd backend && npm install
	@echo "Installing frontend dependencies..."
	cd frontend && npm install
	@echo "Generating Prisma client..."
	cd backend && npx prisma generate

dev-services: ## Start development services (databases, etc.)
	@echo "Starting development services..."
	docker compose -f ops/docker-compose.dev.yml up -d

dev-backend: ## Start backend in development mode
	@echo "Starting backend development server..."
	cd backend && npm run start:dev

dev-frontend: ## Start frontend in development mode
	@echo "Starting frontend development server..."
	cd frontend && npm run dev

dev: dev-services ## Start all development services
	@echo "All development services started!"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend: http://localhost:4000"
	@echo "API Docs: http://localhost:4000/docs"
	@echo "PGAdmin: http://localhost:5050"
	@echo "MailHog: http://localhost:8025"
	@echo "MinIO Console: http://localhost:9001"

stop: ## Stop all services
	docker compose -f ops/docker-compose.dev.yml down

logs: ## Show logs from development services
	docker compose -f ops/docker-compose.dev.yml logs -f

clean: ## Clean all containers and volumes
	docker compose -f ops/docker-compose.dev.yml down -v
	docker system prune -f

db-migrate: ## Run database migrations
	cd backend && npx prisma migrate dev

db-reset: ## Reset database
	cd backend && npx prisma migrate reset

db-studio: ## Open Prisma Studio
	cd backend && npx prisma studio

test-backend: ## Run backend tests
	cd backend && npm test

test-frontend: ## Run frontend tests
	cd frontend && npm test

lint: ## Run linting for both projects
	cd backend && npm run lint
	cd frontend && npm run lint

build: ## Build both projects
	cd backend && npm run build
	cd frontend && npm run build

setup: install dev-services db-migrate ## Complete project setup for first time
	@echo "Setup complete! Run 'make dev' to start development servers."
