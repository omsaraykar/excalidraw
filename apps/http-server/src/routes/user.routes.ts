  import express from 'express';
  import { Router } from 'express';
  import { signUpUser, signInUser } from '../controllers/user.controller';

  const router: Router = express.Router();

  router.post('/signup', signUpUser);
  router.post('/signin', signInUser);

  export default router;
