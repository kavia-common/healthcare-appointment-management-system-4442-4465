# Healthcare Appointment Management - Frontend Client

React-based frontend for nurses and doctors to manage patients, schedules, and appointments.

## Features
- Role-based login (nurse, doctor)
- Nurse dashboard: patient management, create appointments, view doctor schedules
- Doctor dashboard: set daily plan, view appointments
- Lists and forms with validation and user feedback
- Centralized API client and Auth context
- Error and loading UI states

## Getting Started
1. Copy environment example:
   cp .env.example .env
2. Set REACT_APP_API_BASE_URL to your backend (e.g., http://localhost:3001)
3. Install and start:
   npm install
   npm start

## Important Environment Variables
- REACT_APP_API_BASE_URL: Backend API base URL

## Navigation
- /login
- /dashboard/nurse (requires nurse)
- /dashboard/doctor (requires doctor)
- /patients (nurse)
- /appointments (nurse/doctor)
- /schedules (doctor for editing, nurse read-only)
