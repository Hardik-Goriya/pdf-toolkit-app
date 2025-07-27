# PDF Toolkit Full-Stack Application

This is a web application built with React and Node.js/Express that provides several tools for working with PDF files.

## Features

- **PDF to Word:** Converts a PDF file into a DOCX document.
- **Secure PDF:** Adds a password to an unprotected PDF file.
- **Unlock PDF:** Removes the password from an encrypted PDF file.

## Technology Stack

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Python Scripts:** `pdf2docx`, `pypdf` for core PDF processing.

## How to Run This Project Locally

### Prerequisites

- Node.js and npm
- Python and pip
- `pip install pypdf pdf2docx`

### 1. Clone the Repository

```bash
git clone [https://github.com/Hardik-Goriya/pdf-toolkit-app.git](https://github.com/Hardik-Goriya/pdf-toolkit-app.git)
cd pdf-toolkit-app


2. Install Backend Dependencies
cd server
npm install

3. Install Frontend Dependencies
cd ../client
npm install


4. Run the Application

    In one terminal, start the backend server (from the server folder): node server.js

    In a second terminal, start the frontend app (from the client folder): npm start

The application will be running at http://localhost:3000.