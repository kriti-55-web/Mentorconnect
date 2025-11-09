 #Quick Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- npm

## Installation Steps

1. **Install Dependencies**
   ```bash
   npm run install-all
   ```

2. **Create Environment File**
   Create a `.env` file in the root directory with:
   ```
   PORT=5000
   JWT_SECRET=your-secret-key-change-in-production
   NODE_ENV=development
   ```

3. **Start the Application**
   ```bash
   npm run dev
   ```
   This starts both the backend (port 5000) and frontend (port 3000) servers.

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## First Time Setup

1. **Register as a Student**
   - Go to http://localhost:3000/register
   - Select "Student" as user type
   - Fill in your details and create an account

2. **Register as a Mentor (Alumni)**
   - Open an incognito/private window
   - Go to http://localhost:3000/register
   - Select "Mentor (Alumni)" as user type
   - Fill in your details and create an account

3. **Complete Profiles**
   - Login and go to the Profile page
   - Fill in all relevant information:
     - Students: Major, career interests, skills, goals
     - Mentors: Current position, company, industry, expertise areas, experience

4. **Start Matching**
   - Students can browse mentors and send match requests
   - Mentors can accept or reject match requests
   - Once accepted, both can communicate via messages

## Troubleshooting

### Database Issues
- The database is automatically created on first server start
- If you need to reset the database, delete `server/mentorconnect.db` and restart the server

### Port Already in Use
- Change the PORT in `.env` file if port 5000 is already in use
- Update the frontend socket connection in `client/src/pages/Messages.js` if you change the port

### Socket.io Connection Issues
- Make sure both servers are running
- Check that CORS is properly configured
- Verify the socket URL matches your backend port

## Development

- Backend runs on: http://localhost:5000
- Frontend runs on: http://localhost:3000
- Database file: `server/mentorconnect.db`

## Production Build

```bash
# Build the frontend
cd client
npm run build

# The built files will be in client/build/
# Serve the build folder and the backend server in production
```

