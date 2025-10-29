# MERN Blog - Assignment Complete

This project implements a MERN stack blog application with:
- CRUD for Posts and Categories (REST API)
- User authentication (register/login) with JWT
- Image uploads (multer) for featured images
- Pagination, search, and filtering for posts
- React front-end built with Vite, axios API service, React Router

## Run (development)
1. Start MongoDB locally.
2. Server:
   cd server
   npm install
   cp .env.example .env
   # edit .env if needed then:
   npm run dev
3. Client:
   cd client
   npm install
   npm run dev

API is served at http://localhost:5000 (by default) and client at http://localhost:3000
