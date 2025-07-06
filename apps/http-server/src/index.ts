import express from 'express';
import userRoutes from './routes/user.routes'
import roomRoutes from './routes/room.routes'

const app = express();

app.use('/api/v1/users', userRoutes);
app.use('/api/vi/rooms', roomRoutes);

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});