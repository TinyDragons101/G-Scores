# How to Run the Code
This guide will help you set up and run the project locally.

### Prerequisites
Ensure you have the following installed:
- Node.js (version 14 or higher)
- npm (Node Package Manager)
- Docker (for containerized setup)

### If you want to run the whole backend, frontend and db mysql in Docker containers: 
1. uncomment the backend and frontend sections in the `docker-compose.yml`
2. Run the following command in the root directory of the project:
``` bash
docker-compose up -d
```
The build will take some time ~ 5 minutes because of migrations and seeding the database.

3. Open your web browser and navigate to`http://localhost:5173` for the frontend application.

### If you want to run the backend and frontend separately without Docker:

### Database Setup
1. Navigate to the database directory (ensure commenting the backend and frontend sections in docker-compose.yml) and run the following command to start the MySQL container:
``` bash
docker compose up -d
```
2. Navigate to the backend directory to do migrations and seed the database:
``` bash
cd backend
npm run migration:run
```
Wait for the migrations to complete, then run:
``` bash
npm run seed
```
This will take a little time 

### Backend Setup
1. Navigate to the backend directory:
``` bash
cd backend
```
2. Install the required dependencies:
``` bash
npm install
```
3. Start the backend server:
``` bash
npm run start:dev
```

### Frontend Setup
1. Navigate to the frontend directory:
``` bash
cd frontend
```
2. Install the required dependencies:
``` bash
npm install
```
3. Start the frontend development server:
``` bash
npm run dev
```

4. Open your web browser and navigate to `http://localhost:5173` to view the frontend application.