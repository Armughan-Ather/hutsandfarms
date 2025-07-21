import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

// Middleware
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
   allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
}))
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes will go here later
import propertyRoutes from './routes/property.routes.js';
// other imports...

// Routes
app.use('/api/v1/property', propertyRoutes);

export default app;