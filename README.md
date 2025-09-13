# 📊 Mutual Fund Portfolio Tracker

A backend service to track mutual fund investments, calculate portfolio value, and sync NAV prices automatically.

---

##  Features
-  User authentication (JWT + bcrypt)
-  Add/remove funds to portfolio
-  Calculate current portfolio value
-  Profit/Loss tracking with percentage
-  Historical performance view
-  Fund master data sync from [mfapi.in](https://www.mfapi.in/)
-  Security best practices: input validation & rate limiting
-  Automated NAV sync via cron jobs

---

##  Tech Stack
- **Backend:** Node.js + Express
- **Database:** MongoDB (Mongoose ODM)
- **Auth:** JWT + bcrypt
- **Scheduler:** node-cron
- **HTTP Client:** Axios

---

## 📂 Project Structure
src/
├── config/ # DB config
├── controllers/ # Route handlers
├── middleware/ # Auth, validation, rate limiting
├── models/ # Mongoose schemas
├── routes/ # API routes
├── services/ # External API services
├── cronJobs/ # Cron jobs
├── app.js
└── server.js


 ⚙️ Setup & Installation

1. **Clone repository**
```bash
git clone 
cd mutual-fund-tracker
Install dependencies

bash
Copy code
npm install
Environment variables
Create a .env file in project root:

ini
Copy code
PORT=5000
MONGO_URI=mongodb+srv://yourUser:yourPassword@cluster.mongodb.net/mutualFundDB
JWT_SECRET=yourSecret
Run in dev mode

bash
Copy code
npm run dev
Run in production

bash
Copy code
npm start

⏲️ Cron Jobs – NAV Update Flow
Runs daily at 12:00 AM IST using node-cron.

Fetches latest NAVs from mfapi.in.

Updates:

FundLatestNav → stores most recent NAV.

FundNavHistory → keeps daily NAV history.



📌 API Documentation
Full API documentation is available here: docs/api.md

Example: Signup
POST /api/auth/signup

json
Copy code
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
Response:

json
Copy code
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJI...",
  "user": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "john@example.com"
  }

Example: Add Fund to Portfolio
POST /api/portfolio/add

json
Copy code
{
  "schemeCode": 152075,
  "units": 100.5
}
Response:

json
Copy code
{
  "success": true,
  "message": "Fund added successfully",
  "portfolio": {
    "schemeCode": 152075,
    "units": 100.5,
    "schemeName": "ICICI Prudential Bluechip Fund - Direct Plan - Growth"
  }

🚨 Error Handling
Example error response:

json
Copy code
{
  "success": false,
  "errors": [
    { "field": "email", "message": "Invalid email format" }
  ]
}
🧪 Testing with Postman
Import the Postman collection:
MutualFundTracker.postman_collection.json

Login and copy the JWT token.

Set {{token}} variable in Postman.

Test portfolio, funds, and history APIs.

🗄️ Database Schemas
Users
json
Copy code
{
  "_id": "ObjectId",
  "email": "string",
  "passwordHash": "string",
  "name": "string",
  "role": "user|admin",
  "createdAt": "Date"
}
Portfolio
json
Copy code
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "schemeCode": "number",
  "units": "number",
  "purchaseDate": "Date",
  "createdAt": "Date"
}
Fund
json
Copy code
{
  "schemeCode": "number",
  "schemeName": "string",
  "fundHouse": "string",
  "schemeType": "string",
  "schemeCategory": "string"
}
FundLatestNav
json
Copy code
{
  "schemeCode": "number",
  "nav": "number",
  "date": "string (DD-MM-YYYY)"
}
FundNavHistory
json
Copy code
{
  "schemeCode": "number",
  "nav": "number",
  "date": "string (DD-MM-YYYY)"
}
