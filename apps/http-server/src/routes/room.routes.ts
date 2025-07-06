import express, {Router} from 'express';
import { getRoom, createRoom, updateRoom, deleteRoom } from './../controllers/room.controller'
import { verifyToken } from './../middlewares/auth.middleware'

const router: Router = express.Router();

router.get('/room', verifyToken, getRoom);
router.post('/room', verifyToken, createRoom);
router.put('/room', verifyToken, updateRoom);
router.delete('/room', verifyToken, deleteRoom);

export default router;