import express from 'express';
import { createCommentRoute, getAllFilmRoute, getFilmRoute } from './comment';

const router = express.Router();

router.get('/', (_, res) => res.json({ success: true, message: 'User gateway v1 up.' }));

router.post('/create-comment', createCommentRoute);
router.get('/get-film', getFilmRoute);

export default router;
