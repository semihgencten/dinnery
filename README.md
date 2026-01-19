# Dinnery Monorepo

This repository contains the source code for the Dinnery application, managed as a monorepo containing both the backend and frontend services.

## Structure

*   **backend/**: A NestJS application handling the API and server-side logic.
*   **frontend/**: A React application for the user interface (Currently a placeholder).

## Backend Setup

The backend is built with [NestJS](https://nestjs.com/).

### Prerequisites

*   Node.js
*   npm or pnpm

### Installation

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    pnpm install
    ```

### Running the Server

*   **Development**:
    ```bash
    npm run start:dev
    ```
*   **Production**:
    ```bash
    npm run start:prod
    ```

### Running Tests

*   **Unit Tests**:
    ```bash
    npm run test
    ```
*   **E2E Tests**:
    ```bash
    npm run test:e2e
    ```

## Frontend Setup

*(Instructions to be added once frontend is initialized)*
