# H1B Job Application Platform

A comprehensive job search and application platform specifically designed for H1B visa sponsorship opportunities. The platform leverages AI-powered resume analysis, job recommendations, and company sponsorship tracking to help international job seekers find H1B sponsoring employers.

## Features

### Core Functionality
- **Advanced Job Search**: Search and filter job listings from multiple sources with H1B sponsorship information
- **AI-Powered Resume Analysis**: Upload and analyze resumes using OpenAI to extract skills, experience, and keywords
- **Smart Job Recommendations**: Vector-based job matching using PgVector for semantic similarity
- **Company Sponsorship Database**: Track and search companies with H1B sponsorship history
- **Application Tracking**: Manage job applications with status tracking and timeline
- **Resume Management**: Upload, store, and manage multiple resume versions

### User Features
- **User Authentication**: Secure JWT-based authentication with role-based access control (USER/ADMIN)
- **User Dashboard**: Personalized dashboard with saved jobs and application history
- **Profile Management**: Update user profiles, preferences, and settings
- **Activity Tracking**: Monitor user activity and search history

### AI Integration
- **Resume Parsing**: Extract structured data from PDF resumes
- **Keyword Suggestions**: AI-generated keyword recommendations for resume optimization
- **Job Matching**: Semantic search using embeddings for intelligent job recommendations

## Tech Stack

### Backend
- **Java 17** with **Spring Boot 3.5.9**
- **Spring Security** for authentication and authorization
- **Spring AI** for OpenAI integration
- **Spring Data JPA** with Hibernate
- **PostgreSQL** with **PgVector** extension for vector similarity search
- **Redis** for caching and session management
- **JWT** for token-based authentication
- **Apache PDFBox** for resume parsing
- **Flyway** for database migrations

### Frontend
- **React 19** with **TypeScript**
- **Vite** for fast development and build
- **React Router v7** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons

### Infrastructure
- **Docker** and **Docker Compose** for containerization
- **PgAdmin** for database management

## Prerequisites

Before running the application, ensure you have the following installed:

- **Java 17+** ([Download](https://adoptium.net/))
- **Node.js 18+** and **npm** ([Download](https://nodejs.org/))
- **Docker** and **Docker Compose** ([Download](https://www.docker.com/products/docker-desktop))
- **Maven** (or use the included Maven wrapper)
- **Git**

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Saipavangundrathi/H1JobApplicationPlatform.git
cd H1JobApplicationPlatform
```

### 2. Environment Configuration

Create `backend/src/main/resources/application-local.properties` with the following:

```properties
# OpenAI API Key (Required for AI features)
spring.ai.openai.api-key=your-openai-api-key-here

# JWT Secret (Required for authentication)
jwt.secret=your-secure-jwt-secret-key-minimum-256-bits

# RapidAPI Key (Required for JSearch job listings)
rapidapi.key=your-rapidapi-key-here
```

**Important**: Never commit `application-local.properties` to version control (it's already in `.gitignore`).

### 3. Start Infrastructure Services

Start PostgreSQL, Redis, and PgAdmin using Docker Compose:

```bash
docker-compose up -d
```

Verify services are running:
```bash
docker-compose ps
```

### 4. Run the Backend

Navigate to the backend directory and start the Spring Boot application:

```bash
cd backend
./mvnw spring-boot:run
```

Or on Windows:
```bash
mvnw.cmd spring-boot:run
```

The backend will be available at `http://localhost:8080`

### 5. Run the Frontend

In a new terminal, navigate to the frontend directory:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Project Structure

```
H1JobApplicationPlatform/
├── backend/                          # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/h1b/backend/
│   │   │   │   ├── config/          # Configuration classes
│   │   │   │   ├── controller/      # REST API endpoints
│   │   │   │   ├── dto/             # Data Transfer Objects
│   │   │   │   ├── entity/          # JPA entities
│   │   │   │   ├── repository/      # Database repositories
│   │   │   │   ├── security/        # Security & JWT configuration
│   │   │   │   └── service/         # Business logic
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── db/migration/    # Database migrations
│   │   └── test/
│   └── pom.xml                      # Maven dependencies
├── frontend/                         # React frontend
│   ├── src/
│   │   ├── components/              # Reusable React components
│   │   ├── pages/                   # Page components
│   │   ├── App.tsx                  # Main application
│   │   └── types.ts                 # TypeScript definitions
│   ├── package.json
│   └── vite.config.ts
├── docker-compose.yml               # Docker services configuration
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token

### Jobs
- `GET /api/jobs/search` - Search jobs with filters
- `GET /api/jobs/{id}` - Get job details
- `POST /api/jobs/{id}/save` - Save a job
- `DELETE /api/jobs/{id}/save` - Remove saved job
- `GET /api/jobs/saved` - Get user's saved jobs
- `POST /api/jobs/{id}/apply` - Apply to a job
- `GET /api/jobs/recommended` - Get AI-recommended jobs

### Resumes
- `POST /api/resumes/upload` - Upload resume (PDF)
- `GET /api/resumes` - Get user's resumes
- `GET /api/resumes/{id}` - Get resume details
- `DELETE /api/resumes/{id}` - Delete resume
- `POST /api/resumes/{id}/analyze` - Analyze resume with AI

### User Profile
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/password` - Update password
- `GET /api/users/settings` - Get user settings
- `PUT /api/users/settings` - Update settings

### Company Sponsorship
- `GET /api/companies/search` - Search H1B sponsoring companies
- `GET /api/companies/{id}` - Get company details

### AI Features
- `POST /api/ai/resume/analyze` - AI resume analysis
- `POST /api/ai/keywords/suggest` - Get keyword suggestions

### Admin (Admin role required)
- `GET /api/admin/users` - List all users
- `DELETE /api/admin/users/{id}` - Delete user
- `POST /api/admin/jobs/fetch` - Manually trigger job fetch

## Database Access

**PgAdmin** is available at `http://localhost:5050`

- **Email**: admin@h1b.com
- **Password**: admin

Connection details for PostgreSQL:
- **Host**: postgres (or localhost from your machine)
- **Port**: 5432
- **Database**: h1b_db
- **Username**: postgres
- **Password**: password

## Configuration

### Required API Keys

1. **OpenAI API Key**: Get from [OpenAI Platform](https://platform.openai.com/api-keys)
   - Used for resume analysis and AI features
   - Model: `text-embedding-3-small`

2. **RapidAPI Key**: Get from [RapidAPI JSearch](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch)
   - Used for fetching job listings
   - Subscription required

### JWT Configuration

Generate a secure JWT secret (minimum 256 bits):

```bash
openssl rand -base64 32
```

Add the output to `application-local.properties` as `jwt.secret`

## Development

### Backend Development

```bash
cd backend
./mvnw spring-boot:run
```

Backend runs on port 8080 with hot reload enabled.

### Frontend Development

```bash
cd frontend
npm run dev
```

Frontend runs on port 5173 with hot reload enabled.

### Database Migrations

Flyway migrations are located in `backend/src/main/resources/db/migration/`. The application automatically runs pending migrations on startup.

## Production Deployment

### Build Backend

```bash
cd backend
./mvnw clean package
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

### Build Frontend

```bash
cd frontend
npm run build
```

The production build will be in `frontend/dist/`.

## Environment Variables

### Backend (`application-local.properties`)

```properties
# OpenAI Configuration
spring.ai.openai.api-key=your-api-key

# JWT Configuration
jwt.secret=your-jwt-secret

# RapidAPI Configuration
rapidapi.key=your-rapidapi-key

# Database (if different from docker-compose)
spring.datasource.url=jdbc:postgresql://localhost:5432/h1b_db
spring.datasource.username=postgres
spring.datasource.password=password

# Redis (if different from docker-compose)
spring.data.redis.host=localhost
spring.data.redis.port=6379
```

## Troubleshooting

### Backend won't start
- Ensure PostgreSQL and Redis are running: `docker-compose ps`
- Check database connection in `application.properties`
- Verify Java 17+ is installed: `java -version`

### Frontend won't start
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear npm cache: `npm cache clean --force`

### Database connection errors
- Restart Docker services: `docker-compose restart`
- Check PostgreSQL logs: `docker-compose logs postgres`

### Authentication errors
- Verify JWT secret is configured in `application-local.properties`
- Check token expiration settings

## Features Roadmap

- [ ] Email notifications for application updates
- [ ] Advanced analytics and insights dashboard
- [ ] Integration with LinkedIn for profile import
- [ ] Mobile app development
- [ ] Real-time notifications with WebSocket

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

Sai Pavan Goud Gundrathi - [GitHub](https://github.com/Saipavangundrathi)

Project Link: [https://github.com/Saipavangundrathi/H1JobApplicationPlatform](https://github.com/Saipavangundrathi/H1JobApplicationPlatform)

## Acknowledgments

- [Spring Boot](https://spring.io/projects/spring-boot)
- [Spring AI](https://spring.io/projects/spring-ai)
- [PgVector](https://github.com/pgvector/pgvector)
- [OpenAI API](https://openai.com/api/)
- [JSearch API](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)