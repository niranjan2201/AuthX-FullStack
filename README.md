# AuthX Full-Stack Auth System Using Spring Boot and React

## Overview
**AuthX** is a full-stack authentication system built using **Spring Boot + Spring Security + JWT** for the backend and **React (Vite)** for the frontend.  
It provides secure user authentication, profile management, and password reset flow with **SMTP email support**.

---

## Project Preview

### Home Page
<img width="940" height="428" alt="image" src="https://github.com/user-attachments/assets/58e3fded-a687-4fdf-8c0a-47b42f0f709d" />

### Login Page
<img width="940" height="449" alt="image" src="https://github.com/user-attachments/assets/6421c4a8-22b1-410e-ac42-5e904aa089bc" />

### Register Page
<img width="940" height="450" alt="image" src="https://github.com/user-attachments/assets/c4d2eb32-a7c9-4a16-aae2-0d7329abd008" />

---

## Email OTP Screenshots

### Password Reset OTP Email
<img width="940" height="456" alt="image" src="https://github.com/user-attachments/assets/e663489b-4e66-4e73-abec-8add3aabbfb2" />

### Registration Email
<img width="940" height="390" alt="image" src="https://github.com/user-attachments/assets/a95c33c4-10ef-4203-9685-8c18a5f8e616" />

### Account Verification OTP Email
<img width="750" height="357" alt="image" src="https://github.com/user-attachments/assets/0ca91e08-5f7c-46d7-818c-7544c7e95002" />

---

## Postman & Database

### Postman API Calling Structure
<img width="973" height="459" alt="image" src="https://github.com/user-attachments/assets/166376c9-5553-4df3-b067-924ec1fb3903" />

### MySQL Structure
<img width="839" height="455" alt="image" src="https://github.com/user-attachments/assets/b2e33af3-f9c5-4265-b5bc-eae02ad5a27b" />

---

## Architecture
<img width="708" height="471" alt="image" src="https://github.com/user-attachments/assets/2a0fd227-9fc7-4faa-8040-6bae02bf3933" />

---

## Features
- User Registration & Login  
- JWT Token based Authentication  
- Secure APIs with Spring Security  
- User Profile API (Protected)  
- Forgot Password / Reset Password (OTP via Email)  
- Clean frontend UI using React  
- Reusable auth service for future projects  

---

## Tech Stack

### Frontend
- React (Vite)
- JavaScript (JSX)
- Axios
- React Router DOM

### Backend
- Spring Boot
- Spring Security
- JWT
- Java Mail Sender (SMTP)
- Maven

### Database
- MySQL

---

## Setup

### 1) Clone the Repository

```bash
git clone https://github.com/niranjan2201/AuthX-FullStack.git
cd AuthX-FullStack

```

### 2) Backend Setup (Spring Boot)

Go to backend folder:
```bash
cd Backend
```
Run backend:
```bash
./mvnw spring-boot:run
```
Backend runs on:
```bash
http://localhost:8099/api/v1.0
```

if you have any error while running the backend, enter the values directly in the keys like this or just replace the application.properties file with this: here I used the brevo for sending emails you can also use google email app for this. 
 ```bash
server.port=8099

spring.datasource.url=jdbc:mysql://localhost:3306/your_db 
spring.datasource.username=root 
spring.datasource.password=your db password

spring.jpa.hibernate.ddl-auto=update jwt.secret.key=create a long jwt secret key

server.servlet.context-path=/api/v1.0 //SMTP:

spring.mail.host=smtp-relay.brevo.com 
spring.mail.port=587 
spring.mail.username=your smtp username 
spring.mail.password=your smtp password 
spring.mail.properties.mail.smtp.auth=true 
spring.mail.properties.mail.smtp.starttls.enable=true 
spring.mail.protocols=smtp 
spring.mail.properties.mail.smtp.from=your email id
```

### 3) Frontend Setup (React)
Go to frontend folder:
```bash
cd ../Frontend/AuthX
```
Install dependencies:
```bash
npm install
```
Start frontend:
```bash
npm run dev
```
Frontend runs on:
```bash
http://localhost:5173
```

### 4) Database Setup
Create one database named AuthX:
```bash
CREATE DATABASE AuthX;
USE AuthX;
```
(Optional check):
```bash
SELECT * FROM AuthX;
```
---
## API Endpoints 
### Public APIs 
-	POST /register → Register user 
-	POST /login → Login user 
-	POST /send-reset-otp → Send OTP email 
-	POST /reset-password → Reset password using OTP 
-	POST /logout → Logout 
### Protected APIs (Requires JWT) 
-	GET /profile → Get user profile 
-	PUT /profile → Update user profile 

---

## Author
**Niranjan Naik**  
BTech CSE | Full Stack Java Developer 
- GitHub: https://github.com/niranjan2201  
- Email: naikniranjan300305@gmail.com
- LinkedIn: https://www.linkedin.com/in/niranjan-naik-691347307/
