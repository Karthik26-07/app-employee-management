# Fullstack Project with React and Node.js

This project is a fullstack application with a React frontend (using Vite) and a Node.js backend server. The project is structured with separate folders for the client and server.

## Prerequisites

Before running the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) (Node Package Manager)

## Project Structure

- `employee-client/` - Contains the React application.
- `employee-server/` - Contains the Node.js backend server.
- `package.json` - Configuration file for npm scripts and dependencies.

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Karthik26-07/app-employee-management.git
cd app-employee-management
```

### 2.Install Dependencies
  # a. Install client Dependencies
  Navigate to the `employee-client` folder and install the dependencies:

  ```bash
  cd employee-client
  npm install
  ```

  # b. Install Server  Dependencies
  Navigate to the `employee-server` folder and install the dependencies:

  ```bash
  cd employee-server
  npm install
  ```


### 3. Configure MySQL Database

  Update the database configuration in your `employee-server` folder. 
  Ensure that the MySQL credentials and database name are set correctly in your `utils/env-helper`

  ```bash
       DATABASE: {
        name: 'database',
        password: 'password',
        host: 'host',
        user: 'user'
       }
```

### 4. Running the Project
  # a. Start the Backend Server
    To start the Node.js backend server, run:
  ```bash
  cd employee-server
  npm start
  ```

  # a. Start the Frontend
     In a new terminal, navigate to the `employee-client` folder and start the React frontend
  ```bash
  cd employee-client
  npm run dev
  ```

