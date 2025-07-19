import express, { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware';
import { getDrawings } from '../controllers/drawing.controller';

const router: Router = express.Router();

router.get('/:roomId', (req, res) => {
  getDrawings(req, res);
});

export default router;