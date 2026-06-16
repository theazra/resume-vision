# 🚀 ResumeVision

AI-powered web application that helps users build, analyze, and optimize their CVs while preparing for job applications.

## Demo
![Demo](video_demo.gif)

---

## 📌 Overview

ResumeVision is an intelligent career assistant that uses AI and real job market data to help users improve their CVs, identify skill gaps, and prepare for interviews.

It is designed as a full-stack platform combining AI, job APIs, and document processing.

---

## ✨ Key Features

- 🧾 **CV Builder** – Create structured CVs with live preview
- 📊 **CV Analysis (AI-powered)** – Get feedback and improvement suggestions
- 💼 **Job Recommendations** – Personalized job listings via API
- 📉 **Skill Gap Analysis** – Compare skills with job requirements
- 🤖 **AI Career Suggestions** – Learn what to improve based on roles
- 🎤 **Interview Preparation** – AI-generated interview questions and answers
- 📄 **PDF Export** – Generate downloadable CVs

---

## 🛠️ Tech Stack

**Frontend:** React  
**Backend:** Node.js, Express.js  
**Database:** MongoDB  
**AI:** Google Gemini API  
**Jobs API:** Jooble API  
**PDF Generation:** Puppeteer  

---

## 🧠 Architecture

- React frontend for UI and CV builder
- Express backend for APIs and AI processing
- MongoDB for user and CV storage
- Modular services for AI, jobs, and PDF generation

---

## ⚙️ Getting Started

```bash
git clone https://github.com/yourusername/resumevision.git
cd resumevision

npm install

cp .env.example .env
# add API keys

npm run dev