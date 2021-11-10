"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const comment_1 = require("./comment");
const router = express_1.default.Router();
router.get('/', (_, res) => res.json({ success: true, message: 'User gateway v1 up.' }));
router.post('/create-comment', comment_1.createCommentRoute);
router.get('/get-film', comment_1.getFilmRoute);
router.get('/get-film-characters', comment_1.getFilmCharactersRoute);
exports.default = router;
//# sourceMappingURL=index.js.map