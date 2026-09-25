# 🩸 Blood Donation System

A full stack web application that connects blood donors with people who need blood. The backend is a REST API built with **FastAPI**, and the frontend is a responsive interface built with **React** and **Tailwind CSS**.

> **Live demo:** (https://blood-donation-system-phitron.netlify.app/) · 


---

## Features


- Donor registration and profile management
- Search donors by blood group and location / city
- Blood request creation and tracking
- User authentication (login / signup)
- Role-based access, e.g. admin / donor / recipient
- Input validation and clear error messages
- Responsive design for mobile and desktop

## Tech Stack

| Layer     | Technology                              |
| --------- | --------------------------------------- |
| Frontend  | React, Tailwind CSS,        |
| Backend   | Python, FastAPI, Pydantic             |
| Database  | PostgreSQL  |
| Auth      | JWT                         |

## Project Structure

```
blood-donation-system/
├── backend/          # FastAPI application
│   ├── app/
│   └── requirements.txt
├── frontend/         # React + Tailwind application
│   ├── src/
│   └── package.json
└── README.md
```

> Adjust the folder names to match your repository.

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+ and npm
- [Database, if it needs separate setup]

### 1. Clone the repository

```bash
git clone https://github.com/taseen17/Blood-Donation-System-Frontend
cd blood-donation-system
```

### 2. Run the backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload   # adjust to your entry file
```

The API runs at `http://localhost:8000`. Interactive docs are available at `http://localhost:8000/docs`.

### 3. Run the frontend

```bash
cd frontend
npm install
npm run dev                     # or npm start
```

The app runs at `http://localhost:5173` (or `http://localhost:3000`).

### 4. Environment variables

Create a `.env` file in the backend folder:

```env
DATABASE_URL=[your database url]
SECRET_KEY=[your secret key]
```

And in the frontend folder, if needed:

```env
VITE_API_URL=http://localhost:8000
```

## API Overview

| Method | Endpoint            | Description                    |
| ------ | ------------------- | ------------------------------ |
| POST   | `/register`  | Register a new user            |
| POST   | `/login`     | Log in                         |
| GET    | `/donor/available`         | List or search donors          |
| POST   | `/blood_requests`       | Create a blood request         |
| GET    | `/blood_requests/available`       | View blood requests            |

> Replace these with your real routes. FastAPI's `/docs` page lists all of them.






## What I Learned

- Designing and structuring a REST API with FastAPI
- Connecting a React frontend to a backend API
- Building responsive layouts with Tailwind CSS
- Complex state managements
- FastApi based authentication and authorization

## Future Improvements

- Email or SMS notifications for urgent requests
- Map-based donor search
- Automated tests and CI

## Author

**Mir Muktadir Ali Taseen**

- Portfolio: https://taseen17.github.io/My-Portfolio/
- GitHub: https://github.com/taseen17
- LinkedIn: https://www.linkedin.com/in/mir-muktadir-ali-taseen-68098a2a4/

## License

[MIT](LICENSE) — or choose the license you prefer.
