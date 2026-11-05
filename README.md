# BookMart Frontend

React 18 + JavaScript/JSX (Create React App), React Router, Fetch API, Jest และ React Testing Library ตามรูปแบบบทเรียน Frontend

## รันในเครื่อง

1. ติดตั้ง Node.js 20 ขึ้นไป
2. คัดลอก `.env.example` เป็น `.env.local` และตั้ง `REACT_APP_API_URL=http://localhost:8080/api`
3. รัน `npm install` แล้ว `npm start` (เว็บเปิดที่ http://localhost:3000)

Backend Go และไฟล์ฐานข้อมูล Supabase อยู่ในโฟลเดอร์ `../BookMart - Backend` แยกจาก React app

## ตรวจสอบ

- `npm test` รัน Jest + React Testing Library
- `npm run build` สร้างเว็บ production ที่ `build/`

## Deploy

เชื่อมโฟลเดอร์นี้กับ Vercel โดยใช้ Build Command `npm run build`, Output Directory `build`; ตั้ง `REACT_APP_API_URL` ให้ชี้ไป URL ของ Render API ตามด้วย `/api`. ตั้งค่า rewrite จาก `vercel.json` สำหรับ React Router.
