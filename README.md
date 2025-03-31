# 🏋️‍♂️ Sports Program Management API

This is a RESTful API built with **NestJS**, **TypeORM**, and **PostgreSQL** for managing sports programs. It includes features like user registration, role-based access control, class scheduling, enrollments, unit and full end-to-end testing.

---

## 🚀 Features

- User registration and authentication (JWT + Refresh tokens)
- Role-based access (Admin/User)
- Manage sports, classes, and schedules
- Users can enroll in classes
- Filter and view sports classes
- Full E2E and unit testing setup
- Swagger API documentation
- Dockerized for local dev and production

---

## 🧱 Tech Stack

- **Backend**: NestJS (TypeScript)
- **Database**: PostgreSQL (TypeORM)
- **Auth**: Passport (JWT + Local strategies)
- **Validation**: class-validator, Joi
- **Testing**: Jest, Supertest
- **DevOps**: Docker, Docker Compose

---

## ⚙️ Setup & Installation

### 1. Clone the repo

```bash
git clone https://github.com/Urs97/sports-classes-management-app.git
cd sports-classes-management-app
```

### 2. Set up environment variables

Copy the example files:

```bash
cp .env.example .env
cp .env.test.example .env.test
```

Then update the values inside `.env` and `.env.test` if needed.

---

## 🐳 Docker Setup

### Start services in development

```bash
docker-compose up --build
```

### Start production build

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
```

---

## 🧪 Testing

### Run all unit and integration tests

```bash
npm run test
```

### Run E2E tests

```bash
npm run test:e2e
```

---

## 📖 API Documentation

Once the server is running, access Swagger at:

```
http://localhost:3000/api/v1/docs
```

---

## 🧑‍💻 Author

Made by Urs Stipeč

---

## 📄 License

This project is for educational and evaluation purposes only.
