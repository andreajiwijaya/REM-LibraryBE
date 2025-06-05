import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import swaggerRouter from './config/swagger';


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/', routes);

app.use('/api-docs', swaggerRouter);

export default app;
