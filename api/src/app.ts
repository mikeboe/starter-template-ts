import express, { Express, Request, Response , Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { statusRoutes } from './routes/status/statusRoutes';
import morganMiddleware from './middleware/morgan';

//For env File 
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Middleware
app.use(morganMiddleware);

// Routes
/* ----- STATUS ----- */
app.use('/status', statusRoutes)


app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
