# LearnOdys - Build Skills ,Break Limits

## Project Overview

This mini project focuses on developing a web-based Course Recommendation Platform that integrates Large Language Models (LLMs) and AI agents to deliver a personalized and adaptive learning experience.
The system begins with user authentication and profile setup, where learners specify their domain interests, existing skill sets, and learning objectives. Based on this information, users are redirected to a domain-specific dashboard where courses are filtered according to their individual requirements.
Using AI intelligence, the platform generates a structured and personalized learning roadmap. Within this roadmap, the system recommends relevant courses while also highlighting trending and industry-aligned options. Selected courses are added to a tracked learning list, enabling users to monitor progress over time.
Upon course or certification completion, the platform suggests domain-specific projects aligned with the learner’s acquired skills, helping bridge the gap between theoretical learning and practical application. The AI agent continuously analyzes learning history to detect overlapping content and recommends adjustments to optimize the learning path.
To support knowledge retention and validation, the platform provides periodic quizzes and assessments. Users can also switch domains while preserving their learning history and progress. Each recommendation includes a brief explanation to ensure transparency, along with alerts for trending courses and relevant updates.                                                                                            
## Problem Statement

With the rapid expansion of online learning platforms, learners often struggle to select suitable courses, identify the correct learning sequence, and track long-term progress. Most existing platforms merely list courses without adapting to individual learner needs or validating learning decisions.
There is a clear need for an intelligent learning system that can guide users through personalized learning paths, dynamically adapt recommendations based on progress, and support the transition from learning to real-world application.

## Objectives

- To develop a web-based course recommendation platform
- To personalize learning paths using LLMs and AI agents
- To generate adaptive learning roadmaps based on user profiles
- To track selected and completed courses
- To recommend practical projects after course completion
- To provide quizzes for learning validation
- To notify users about trending and relevant courses

## Core Features

- User authentication and profile management
- Domain and skill-based course filtering
- AI-generated personalized learning roadmap
- Course selection and progress tracking
- Detection of redundant or overlapping learning content
- Quiz and assessment module
- Project recommendations after course completion
- Alerts for trending courses and updates
- Domain switching with preserved learning history


## Stakeholders

### 1.Learner (User)
Uses the platform to explore, select, and track courses.

### 2.Admin
Manages course metadata and system configurations.

### 3.AI Agent
Analyzes learning history and determines learning path adjustments.

### 4.LLM (Large Language Model)
Generates learning roadmaps, course recommendations, and explanations.

### 5.External Course Platforms
Provide original course content through referenced links.


## Roles & Interactions Flow

User -> Web Interface -> Backend Services -> Database -> AI Agent -> LLM -> Course Recommendations, Roadmaps & Alerts -> User Interface


## Tech Stack

- Frontend: React.js
- Backend: Node.js, Express.js
- Database: MongoDB
- AI Integration: OpenAI API / Gemini API
- Authentication: JWT
- API Integration: YouTube Data API, GitHub API
- Automation: Cron Jobs

## Packages

### Frontend Packages (React)

- react – Build UI components (Login, Home, Dashboard, etc.)
- react-dom – Render components in browser
- react-router-dom – Page navigation
- axios – Connect to backend APIs
- react-hook-form – Handle forms (Login, Profile, Course Selection)

### Backend Packages (Node.js + Express)

- express – REST APIs (users, courses, roadmap, progress)
- mongoose – MongoDB schemas & queries
- cors – Allow frontend-backend communication
- dotenv – Store secrets (DB URL, API keys, JWT secret)
- bcryptjs – Encrypt user passwords
- jsonwebtoken – User authentication (JWT)
- node-cron – Schedule tasks (trending updates, reminders)
- openai – AI-generated roadmap, quizzes, project suggestions, overlap detection


- Domain & Skill-Based Course Filtering – mongoose
- AI-Generated Personalized Learning Roadmap – openai
- Course Selection & Progress Tracking – axios, mongoose
- Detection of Redundant / Overlapping Content – openai
- Quiz & Assessment Module – openai
- Project Recommendations After Course Completion – openai
- Alerts for Trending Courses & Updates – node-cron
- Domain Switching with Preserved Learning History – mongoose


## Tools

### Development & Coding Tools

- VS Code – Writing frontend & backend code
- Command Prompt – Running React & Node servers
- Node.js – JavaScript runtime environment
- npm – Package management

### Frontend Development Tools

- React – Building UI components (Login, Dashboard, Learning Roadmap)
- Web Browser (Chrome / Edge) – Testing frontend UI
- React Router – Page navigation
- Axios – Connect frontend to backend APIs
- React Hook Form – Forms handling (Login, Profile, Course Selection)

### Backend Development Tools

- Node.js + Express.js – Backend runtime & API development
- Postman – Testing backend APIs
- OpenAI API – AI-generated roadmap, quizzes, project suggestions

### Database Tools

- MongoDB – NoSQL database
- MongoDB Compass – Database visualization & testing

### Version Control & Collaboration

- Git – Version control
- GitHub – Code hosting & collaboration  
