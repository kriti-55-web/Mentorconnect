# MentorConnect - Student-Alumni Mentorship Platform

A comprehensive web-based platform that connects students with alumni mentors based on shared interests, academic backgrounds, career aspirations, and skills. The platform provides essential tools to enhance mentorship interactions and ensure long-term engagement.

## Features

### Core Functionalities

- **Mentor-Student Matching**: A structured system for students to find and connect with suitable mentors based on academic and career interests
- **Interactive Communication Tools**: Built-in messaging with real-time updates and discussion forums for seamless mentor-student interaction
- **Goal-Setting & Progress Tracking**: A system to define mentorship objectives, track milestones, and measure progress over time

### Key Features

- User authentication and authorization (JWT-based)
- User profiles with detailed information (students and mentors)
- Smart matching algorithm based on multiple criteria
- Real-time messaging using Socket.io
- Discussion forums for community engagement
- Goal tracking with milestones
- Progress monitoring and reporting

## Tech Stack

### Backend
- Node.js with Express.js
- SQLite database
- Socket.io for real-time messaging
- JWT for authentication
- bcryptjs for password hashing

### Frontend
- React.js
- React Router for navigation
- Axios for API calls
- Socket.io-client for real-time features
- Tailwind CSS for styling
- React Icons for icons

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mentorconnect
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```
   This will install dependencies for both the server and client.

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```
   PORT=5000
   JWT_SECRET=your-secret-key-change-in-production
   NODE_ENV=development
   ```

4. **Initialize the database**
   The database will be automatically created when you start the server for the first time.

5. **Start the development servers**
   ```bash
   npm run dev
   ```
   This will start both the backend server (port 5000) and the frontend development server (port 3000).

   Alternatively, you can run them separately:
   ```bash
   # Backend only
   npm run server

   # Frontend only (in a new terminal)
   npm run client
   ```

## Usage

### Getting Started

1. **Register an account**
   - Navigate to the registration page
   - Choose your role: Student or Mentor (Alumni)
   - Fill in your basic information

2. **Complete your profile**
   - Go to the Profile page
   - Add detailed information about yourself
   - For students: Add major, career interests, skills, and goals
   - For mentors: Add current position, company, industry, expertise areas, and experience

3. **Find matches**
   - Students can browse and search for mentors
   - The system suggests mentors based on compatibility
   - Send match requests to mentors

4. **Accept matches**
   - Mentors can view and accept/reject match requests
   - Once accepted, both parties can communicate

5. **Communicate**
   - Use the messaging system for direct communication
   - Participate in discussion forums for community engagement

6. **Set goals**
   - Create mentorship goals with target dates
   - Break down goals into milestones
   - Track progress together

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `PUT /api/users/:id/student-profile` - Update student profile
- `PUT /api/users/:id/mentor-profile` - Update mentor profile

### Mentors
- `GET /api/mentors` - Get all mentors
- `GET /api/mentors/:id` - Get mentor by ID
- `POST /api/mentors/search` - Search mentors

### Matches
- `GET /api/matches` - Get user's matches
- `POST /api/matches` - Create match request
- `POST /api/matches/suggest` - Get match suggestions (students only)
- `PUT /api/matches/:id/status` - Update match status

### Messages
- `GET /api/messages/match/:matchId` - Get messages for a match
- `POST /api/messages` - Send message
- `PUT /api/messages/read/:matchId` - Mark messages as read
- `GET /api/messages/unread/count` - Get unread message count

### Goals
- `GET /api/goals/match/:matchId` - Get goals for a match
- `POST /api/goals` - Create goal
- `PUT /api/goals/:id` - Update goal
- `POST /api/goals/:goalId/milestones` - Create milestone
- `PUT /api/goals/milestones/:id` - Update milestone

### Forums
- `GET /api/forums` - Get all forums
- `GET /api/forums/:id` - Get forum with posts
- `POST /api/forums` - Create forum
- `POST /api/forums/:forumId/posts` - Create forum post
- `PUT /api/forums/posts/:id` - Update forum post
- `DELETE /api/forums/posts/:id` - Delete forum post

## Database Schema

The application uses SQLite with the following main tables:
- `users` - User accounts
- `student_profiles` - Student-specific information
- `mentor_profiles` - Mentor-specific information
- `matches` - Mentor-student matches
- `messages` - Private messages
- `goals` - Mentorship goals
- `milestones` - Goal milestones
- `forums` - Discussion forums
- `forum_posts` - Forum posts

## Project Structure

```
mentorconnect/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context (Auth)
│   │   ├── pages/         # Page components
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                # Node.js backend
│   ├── routes/           # API routes
│   ├── middleware/       # Auth middleware
│   ├── database.js       # Database setup
│   └── index.js          # Server entry point
├── package.json
└── README.md
```

## Development

### Running Tests
Currently, the project doesn't include automated tests. You can test the application manually by:
1. Starting the development servers
2. Registering test accounts (both student and mentor)
3. Testing the matching, messaging, and goal features

### Building for Production
```bash
# Build the frontend
npm run build

# The built files will be in client/build/
```

## Security Considerations

- Passwords are hashed using bcryptjs
- JWT tokens are used for authentication
- API routes are protected with authentication middleware
- Input validation should be added for production use
- Change the JWT_SECRET in production
- Consider using environment variables for sensitive data

## Future Enhancements

- Email notifications
- Video call integration
- Advanced search and filtering
- Analytics and reporting
- Mobile app version
- Calendar integration for scheduling
- File sharing capabilities
- Rating and feedback system

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on the GitHub repository.

