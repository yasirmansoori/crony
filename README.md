<h1 align="center">
Crony - Job Scheduling Service
</h1>
<div align="center">
Crony is a robust job scheduling service built with Node.js and TypeScript that allows you to create, manage, and monitor cron jobs through a RESTful API.
</div>

## Tech Stack Used
![Javascript](https://img.shields.io/badge/Javascript-F0DB4F?style=for-the-badge&labelColor=black&logo=javascript&logoColor=F0DB4F)
![express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Nodejs](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

## ✨ Features
- `Simple Job Management`: Create, start, stop, and monitor scheduled jobs
- `Cron Expressions`: Use standard cron syntax for flexible scheduling
- `Persistent Storage`: Jobs stored in MongoDB for durability across restarts
- `Comprehensive Logging`: System-wide and job-specific logging
- `RESTful API`: Modern API with validation and error handling
- `Containerized`: Ready to deploy with Docker and Docker Compose
- `Graceful Shutdown`: Proper handling of termination signals

## 📋 Prerequisites
- Node.js 20+
- MongoDB 6.0+
- Docker and Docker Compose (for containerized deployment)

## 📦 Getting Started

- Clone the repository:
```sh
git clone https://github.com/yasirmansoori/RBAC_Authentication_with_JWT.git
```
- Install dependencies:
```sh
 npm install
```
- Start the development server:
```sh
  npm run build
  npm start
```
- Or for development with auto-restart:
```sh
  npm run dev
```

## 📦 Docker Deployment
- Ensure Docker and Docker Compose are installed.
- Build and run the Docker container:
```sh
docker-compose up -d --build
```

## 📝 Environment Variables

- Create a .env file in the root of the server directory and add the following environment variables:
```sh
PORT = "YOUR_PORT_NUMBER" # e.g., 3000
NODE_ENV = development
MONGODB_URI = "YOUR_MONGODB_URI" # e.g., mongodb://localhost:27017/yourdb
```

- For docker deployment, change the `MONGODB_URI` to:
```sh
MONGODB_URI = "mongodb://mongodb:27017/yourdb"
```

## 📚Schema Overview
-   ### Job

    -   `_id` _(auto-generated-unique)_ 
    -   `name` _(string)_
    -   `isActive` _(boolean)_
    -   `schedule` _(cron expression)_
    -   `message` _(string)_

## **🚀API Router Endpoints** 

<h1>Application Routes -</h1>
<table>
  <tr>
    <th colspan="4" style="text-align:center">General</th>
  </tr>
  <tr>
    <td>Endpoints</td>
    <td>Method</td>
    <td>Description</td>
    <td>Request Body</td>
  </tr>
  </tr>
  <tr>
    <td>/health</td>
    <td>GET</td>
    <td>Check service health</td>
    <td>None</td>
  </tr>
  <tr>
    <td>/api/v1/jobs</td>
    <td>GET</td>
    <td>List all jobs</td>
    <td>None</td>
  </tr>
  <tr>
    <td>/api/v1/jobs/create	</td>
    <td>POST</td>
    <td>Create a new job</td>
    <td>
      <pre>
{
  "name": "SampleJob",
  "schedule": "* * * * *",
  "message": "This is a sample job"
}
      </pre>
    </td>
  </tr>
  <tr>
    <td>/api/v1/jobs/:id/start</td>
    <td>POST</td>
    <td>Start a job</td>
    <td>None</td>
  </tr>
  <tr>
    <td>/api/v1/jobs/:id/stop</td>
    <td>POST</td>
    <td>Stop a job</td>
    <td>None</td>
  </tr>
  <tr>
    <td>/api/v1/jobs/:id/logs</td>
    <td>GET</td>
    <td>Get job logs</td>
    <td>None</td>
  </tr>
  <tr>
    <td>/api/v1/jobs/:id/stats</td>
    <td>GET</td>
    <td>Get job statistics</td>
    <td>None</td>
  </tr>
</table>

## 📄 Swagger Documentation
For detailed API documentation, visit the Swagger UI at:
```plaintext
http://localhost:8000/api-docs/v1
```


## 🏗️ Project Structure
```plaintext
src/
  ├── utils/        # Utility functions
  ├── middlewares/  # Express middlewares
  ├── validators/   # Request validation
  ├── models/       # Mongoose models
  ├── services/     # Business logic
  ├── routes/       # API routes
  ├── controller/   # Route controllers
  ├── config/       # Configuration files
  ├── db/           # Database connection
  └── index.ts      # Application entry point
```

## 📊 Logging
Logs are stored in the following structure:
```plaintext
logs/
  ├── combined.log  # All application logs
  ├── error.log     # Error logs only
  └── jobs/         # Job-specific logs
      └── {JobName}/
          └── job.log
```

## 🔒 Security
- Helmet for HTTP security headers
- Rate limiting to prevent abuse
- CORS configuration
- Input validation with Zod

## 📚 Architecture
Crony follows a layered architecture:

- `Routes Layer`: API endpoints definition
- `Controller Layer`: Request handling and response formatting
- `Service Layer`: Business logic and job scheduling
- `Data Layer`: MongoDB data storage via Mongoose
<div align="center">Made with ❤️</div>