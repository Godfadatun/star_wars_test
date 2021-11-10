import { RequestHandler } from 'express';
import { createComment, getFilmCharactersList, getFilmList } from '../controllers/comment';

export const createCommentRoute: RequestHandler = async (req, res) => {
  try {
    const data = {
      commenter_ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip || null,
      movie_id: req.body.movie_id,
      comment: req.body.comment,
    };

    const response = await createComment(data);
    const responseCode = response.success === true ? 200 : 400;
    return res.status(responseCode).json(response);
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Could not fetch beneficiaries.' });
  }
};

export const getFilmRoute: RequestHandler = async (req, res) => {
  try {
    const response = await getFilmList(req.query);
    const responseCode = response.success === true ? 200 : 400;
    return res.status(responseCode).json(response);
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Could not fetch beneficiaries.' });
  }
};

export const getFilmCharactersRoute: RequestHandler = async (req, res) => {
  try {
    const response = await getFilmCharactersList(req.query);
    const responseCode = response.success === true ? 200 : 400;
    return res.status(responseCode).json(response);
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Could not fetch beneficiaries.' });
  }
};
