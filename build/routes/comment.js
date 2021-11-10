"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilmCharactersRoute = exports.getFilmRoute = exports.createCommentRoute = void 0;
const comment_1 = require("../controllers/comment");
const createCommentRoute = async (req, res) => {
    try {
        const data = {
            commenter_ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip || null,
            movie_id: req.body.movie_id,
            comment: req.body.comment,
        };
        const response = await comment_1.createComment(data);
        const responseCode = response.success === true ? 200 : 400;
        return res.status(responseCode).json(response);
    }
    catch (error) {
        return res.status(500).json({ success: false, error: 'Could not fetch beneficiaries.' });
    }
};
exports.createCommentRoute = createCommentRoute;
const getFilmRoute = async (req, res) => {
    try {
        const response = await comment_1.getFilmList(req.query);
        const responseCode = response.success === true ? 200 : 400;
        return res.status(responseCode).json(response);
    }
    catch (error) {
        return res.status(500).json({ success: false, error: 'Could not fetch beneficiaries.' });
    }
};
exports.getFilmRoute = getFilmRoute;
const getFilmCharactersRoute = async (req, res) => {
    try {
        const response = await comment_1.getFilmCharactersList(req.query);
        const responseCode = response.success === true ? 200 : 400;
        return res.status(responseCode).json(response);
    }
    catch (error) {
        return res.status(500).json({ success: false, error: 'Could not fetch beneficiaries.' });
    }
};
exports.getFilmCharactersRoute = getFilmCharactersRoute;
//# sourceMappingURL=comment.js.map