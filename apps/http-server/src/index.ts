import express from 'express';
import userRoutes from './routes/user.routes'
import roomRoutes from './routes/room.routes'
import drawingRoutes from './routes/drawing.routes'
import cors from 'cors';

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use('/api/v1/users', userRoutes);
app.use('/api/vi/rooms', roomRoutes);
app.use('/api/v1/drawings', drawingRoutes);

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});