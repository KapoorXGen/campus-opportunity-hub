# Campus Opportunity Hub

A full-stack platform that brings student opportunities into one focused place.

Campus Opportunity Hub helps students discover internships, hackathons, scholarships, and other opportunities, while giving organizations a dedicated space to publish and manage opportunities and review applications.

---

## Live Application

**Frontend:**  
https://campus-opportunity-hub-tn75.vercel.app

**Backend API:**  
https://campus-opportunity-hub.vercel.app

**API Health Check:**  
https://campus-opportunity-hub.vercel.app/api/health

---

## Overview

Students often discover opportunities across multiple platforms, websites, social media posts, and communities. This makes it difficult to keep track of opportunities, saved listings, applications, and personal information.

Campus Opportunity Hub provides a centralized platform where:

- Students can discover opportunities
- Students can save opportunities for later
- Students can apply to opportunities
- Students can maintain their profile and resume
- Organizations can publish opportunities
- Organizations can manage their own opportunities
- Organizations can view applicants
- Organizations can review applicant resumes
- Organizations can update application statuses

The application is designed around two primary user roles:

**Student** and **Organization**

---

## Features

### Student

- Student account registration and login
- Browse published opportunities
- Search opportunities
- Filter opportunities by type
- View detailed opportunity information
- Save opportunities
- Apply to opportunities
- Track submitted applications
- View application status
- Create and update profile
- Add skills and interests
- Add GitHub and LinkedIn profiles
- Upload resume
- View saved opportunities
- Logout

### Organization

- Organization account registration and login
- Create opportunities
- Edit opportunities
- Delete opportunities
- View organization-owned opportunities
- View applicant counts
- View applicants for individual opportunities
- View applicant profiles
- Access applicant resumes
- Update application status
- Logout

---

## Role-Based Authorization

The application implements role-based access control.

### Student

Students can access student functionality such as:

- Opportunities
- Saved opportunities
- Applications
- Profile

### Organization

Organizations can access organization functionality such as:

- Opportunity creation
- Opportunity management
- Applicant management
- Application status management

Authorization is enforced on the backend rather than relying only on frontend navigation.

---

## Technology Stack

### Frontend

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- Lucide React
- Next.js App Router

### Backend

- Node.js
- Express
- TypeScript
- Mongoose
- MongoDB
- JWT Authentication
- bcryptjs
- Zod
- Multer

### Deployment

- Vercel
- MongoDB Atlas
- GitHub

---

## Architecture

```text
                    ┌─────────────────────────┐
                    │        Student          │
                    │                         │
                    │ Browse / Save / Apply   │
                    │ Profile / Resume        │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │      Next.js 16         │
                    │        Frontend         │
                    │                         │
                    │ React + TypeScript      │
                    │ Tailwind CSS            │
                    └────────────┬────────────┘
                                 │
                              REST API
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │        Express          │
                    │        Backend          │
                    │                         │
                    │ Authentication          │
                    │ Authorization           │
                    │ Validation              │
                    │ Business Logic          │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │      MongoDB Atlas      │
                    │                         │
                    │ Users                   │
                    │ Opportunities           │
                    │ Applications            │
                    │ Saved Opportunities     │
                    │ Student Profiles        │
                    └─────────────────────────┘
