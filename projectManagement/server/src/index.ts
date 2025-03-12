import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import session from 'express-session';
import { createServer } from 'http';
import compression from 'compression';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import helmet from 'helmet';
import hpp from 'hpp';
import db from './config/sequelize'; // Adjust path
import routes from './routes/index';
import { errorMiddleware } from "./middleware/error";
import morganMiddleware from './logger/morganLogger';

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || '8080', 10);
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

// Middleware setup
app.use(morganMiddleware);
app.use(bodyParser.json());
app.use(helmet());
app.use(compression());
app.use(hpp());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET || 'default_secret', // Use a secure secret in production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'), false);
      }
    },
    methods: 'GET,POST,PUT,DELETE,PATCH',
    credentials: true,
  })
);

// Define the routes
app.use("",routes);

app.use('//uploads', express.static('uploads'));


// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});

// Error-handling middleware
app.use(errorMiddleware);
// Create HTTP server
const server = createServer(app);
// Connect to database
db.authenticate()
  .then(() => console.log('Database connected successfully!'))
  .catch(err => console.error('Database connection failed:', err));
  


server.listen(port,'0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});