import express, {Router} from 'express';
import { getRoom, createRoom, updateRoom, deleteRoom } from './../controllers/room.controller'
import { verifyToken } from './../middlewares/auth.middleware'

const router: Router = express.Router();

router.get('/:roomId', verifyToken, getRoom);
router.post('/', verifyToken, createRoom);
router.put('/', verifyToken, updateRoom);
router.delete('/', verifyToken, deleteRoom);

export default router;