"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilmCharactersSchema = exports.getFilmSchema = exports.commentSchema = void 0;
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
exports.getFilmCharactersSchema = joi_1.default
    .object({
    film_index: joi_1.default.string().max(500).required(),
    gender: joi_1.default.string().valid('male', 'female', 'not-available').optional(),
    height: joi_1.default.number().integer().min(1).optional(),
    operator: joi_1.default.string().valid('greaterThan', 'lessThan', 'equalto').optional(),
})
    .oxor('height', 'gender')
    .and('height', 'operator');
//# sourceMappingURL=commentSchema.js.map