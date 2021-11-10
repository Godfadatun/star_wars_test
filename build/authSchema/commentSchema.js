"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilmSchema = exports.commentSchema = void 0;
/* eslint-disable max-classes-per-file */
const joi_1 = __importDefault(require("joi"));
exports.commentSchema = joi_1.default.object().keys({
    commenter_ip: joi_1.default.string().required(),
    comment: joi_1.default.string().max(500).required(),
    movie_id: joi_1.default.string().required(),
});
exports.getFilmSchema = joi_1.default.object().keys({
    character: joi_1.default.string().valid('characters').optional(),
    film_index: joi_1.default.string().max(500).optional(),
    viewComment: joi_1.default.string().valid('comments').optional(),
});
//# sourceMappingURL=commentSchema.js.map