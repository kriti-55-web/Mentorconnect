# Quick Start Guide - MentorConnect

## Step 1: Start the Server

Run this command in the root directory:

```bash
npm run dev
```

This will start:
- **Backend server** on port 5000
- **Frontend development server** on port 3000

You should see output like:
```
[0] Server running on port 5000
[1] Compiled successfully!
[1] You can now view mentorconnect in the browser.
[1] Local: http://localhost:3000
```

## Step 2: Access the Application

Once both servers are running, open your web browser and go to:

**http://localhost:3000**

You should see the MentorConnect homepage.

## Step 3: First Time Setup - Create Accounts

### 3.1 Register as a Student

1. Click **"Sign Up"** or go to http://localhost:3000/register
2. Select **"Student"** as user type
3. Fill in your details:
   - First Name
   - Last Name
   - Email
   - Password (minimum 6 characters)
   - Optional: Phone, Bio
4. Click **"Create account"**
5. You'll be automatically logged in and redirected to the Dashboard

### 3.2 Register as a Mentor (Alumni)

**Option A: Use Incognito/Private Window**
- Open a new incognito/private browser window
- Go to http://localhost:3000/register
- Select **"Mentor (Alumni)"** as user type
- Fill in your details and create the account

**Option B: Logout and Register**
- Logout from the student account
- Register a new mentor account

## Step 4: Complete Your Profiles

### For Students:

1. Go to **Profile** page (click your name in the navbar)
2. Click **"Edit Profile"**
3. Fill in:
   - **Graduation Year**: e.g., 2025
   - **Major**: e.g., Computer Science
   - **Career Interests**: e.g., Software Engineering, Data Science
   - **Skills**: e.g., Python, React, Machine Learning
   - **Goals**: Your career goals and what you want from mentorship
4. Click **"Save Changes"**

### For Mentors:

1. Go to **Profile** page
2. Click **"Edit Profile"**
3. Fill in:
   - **Graduation Year**: When you graduated
   - **Major**: Your field of study
   - **Current Position**: e.g., Senior Software Engineer
   - **Company**: e.g., Google, Microsoft
   - **Industry**: e.g., Technology, Finance
   - **Expertise Areas**: e.g., Software Engineering, Leadership, Product Management
   - **Years of Experience**: e.g., 5
   - **Availability**: e.g., Weekends, Evenings
4. Click **"Save Changes"**

## Step 5: Start Using the Platform

### For Students:

1. **Find Mentors**:
   - Go to **"Find Mentors"** page
   - Browse available mentors
   - Use search and filters (Major, Industry, Expertise)
   - Click **"Request Match"** on mentors you're interested in

2. **View Matches**:
   - Go to **"Matches"** page
   - See your match requests (pending, accepted, rejected)
   - View match suggestions based on compatibility

3. **Communicate**:
   - Once a mentor accepts your request, go to **"Messages"**
   - Start chatting with your mentor

4. **Set Goals**:
   - Go to **"Goals"** page
   - Select a match
   - Create goals with milestones
   - Track your progress

5. **Join Forums**:
   - Go to **"Forums"** page
   - Browse discussion forums
   - Create posts and participate in discussions

### For Mentors:

1. **Manage Match Requests**:
   - Go to **"Matches"** page
   - See pending match requests from students
   - Click **"Accept"** or **"Reject"** for each request

2. **Communicate**:
   - After accepting a match, go to **"Messages"**
   - Chat with your mentee

3. **Set Goals**:
   - Go to **"Goals"** page
   - Select a match
   - Create mentorship goals and milestones
   - Help track your mentee's progress

4. **Join Forums**:
   - Participate in discussion forums
   - Share your expertise and advice

## Step 6: Test the Features

### Testing Matching:
1. As a student, send match requests to mentors
2. As a mentor, accept/reject requests
3. Check match scores and compatibility

### Testing Messaging:
1. Open Messages page
2. Select an accepted match
3. Send messages (real-time with Socket.io)

### Testing Goals:
1. Create a goal with target date
2. Add milestones
3. Mark milestones as complete
4. Track progress

### Testing Forums:
1. Create a new forum
2. Add posts to forums
3. View and respond to posts

## Troubleshooting

### If servers don't start:

1. **Check if ports are available**:
   - Port 5000 (backend)
   - Port 3000 (frontend)
   - If occupied, change PORT in `.env` file

2. **Reinstall dependencies**:
   ```bash
   npm run install-all
   ```

3. **Check Node.js version**:
   ```bash
   node --version
   ```
   Should be v14 or higher

### If database issues occur:

- The database is created automatically on first start
- Location: `server/mentorconnect.db`
- To reset: Delete the file and restart the server

### If you see errors:

- Check the terminal output for error messages
- Make sure `.env` file exists with correct values
- Ensure both servers are running (you should see both in the terminal)

## What You'll See After Starting

After running `npm run dev`, you should see:

1. **Terminal Output**: Two processes running
   - Backend server logs
   - Frontend compilation status

2. **Browser**: Automatically opens to http://localhost:3000
   - If not, manually navigate to it

3. **Homepage**: MentorConnect landing page
   - Features overview
   - Sign up/Login buttons

## Next Steps

1. ✅ Start the server: `npm run dev`
2. ✅ Open browser: http://localhost:3000
3. ✅ Register accounts (Student and Mentor)
4. ✅ Complete profiles
5. ✅ Start matching and using the platform!

Enjoy using MentorConnect! 🚀

