import express from 'express';
import bodyParser from 'body-parser';
import messageRoutes from './routes/messageRoutes';

const app = express();

app.use(bodyParser.json());

app.use('/messages', messageRoutes);

export default app;
