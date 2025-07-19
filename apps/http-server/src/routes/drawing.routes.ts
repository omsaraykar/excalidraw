import express, { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware';
import { getDrawings } from '../controllers/drawing.controller';

const router: Router = express.Router();

router.get('/:roomId', verifyToken, (req, res, next) => {
  getDrawings(req, res).catch(next);
});

export default router;