# 🗳️ Online Voting System (Flask + MongoDB + JWT)

A secure and minimal backend for an **Online Voting System**, built using **Flask**, **MongoDB**, and **JWT authentication**. This project enables **Admins** to manage elections and candidates, and allows **Voters** to cast their votes securely.

---

## 🔥 Features

- 🔐 JWT-based authentication for Admins and Voters
- 👨‍💼 Admin login and candidate management
- 🗂️ Create elections with selected candidates
- 👤 Voter signup and login
- 🗳️ Vote in active elections (only once per election)
- 📊 Secure vote counting (visible only to Admin)
- 🔒 Vote privacy – voters can't see vote counts

---

## 🧑‍💼 Roles

### Admin
- Login
- Add candidates
- Create elections
- View all elections with vote counts

### Voter
- Sign up and login
- View list of elections and participating candidates
- Cast vote in an election (only once per election)
- Cannot view vote counts to preserve fairness

---

## 🛠️ Tech Stack

- **Backend**: Flask (Python)
- **Database**: MongoDB (NoSQL)
- **Authentication**: JWT (Flask-JWT-Extended)
- **Password Hashing**: Werkzeug Security
