"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilmCharactersList = exports.getFilmList = exports.createComment = void 0;
const errors_1 = require("../utils/errors");
const db_1 = require("../database/helpers/db");
const commentSchema_1 = require("../authSchema/commentSchema");
const Comment_1 = require("../database/models/Comment");
const swapi_1 = require("../integrations/swapi");
const logger_1 = __importDefault(require("../utils/logger"));
const createComment = async (data) => {
    const validation = commentSchema_1.commentSchema.validate(data);
    if (validation.error)
        return errors_1.ResourceNotFoundError(validation.error);
    const queryRunner = await db_1.getQueryRunner();
    try {
        await queryRunner.manager.save(Comment_1.Comments, {
            commenter_ip: String(data.commenter_ip),
            movie_id: data.movie_id,
            comment: data.comment,
        });
        return {
            success: true,
            message: 'Comment added successfully',
        };
    }
    catch (e) {
        await queryRunner.rollbackTransaction();
        return {
            success: false,
            message: 'Adding Comments failed, kindly try again',
        };
    }
    finally {
        await queryRunner.release();
    }
};
exports.createComment = createComment;
const getFilmList = async ({ character, film_index, viewComment }) => {
    const validation = commentSchema_1.getFilmSchema.validate({ character, film_index, viewComment });
    if (validation.error)
        return errors_1.ResourceNotFoundError(validation.error);
    const queryRunner = await db_1.getQueryRunner();
    try {
        if (!film_index) {
            const allFilms = await swapi_1.getSwapiFilmsAPI(film_index);
            console.log(allFilms.data.results[0].release_date);
            const newDate = (data) => new Date(data);
            const films = allFilms.data.results.sort((a, b) => newDate(b.release_date) - newDate(a.release_date));
            return {
                success: true,
                message: 'film gotten successfully',
                data: films,
            };
        }
        const film = await swapi_1.getSwapiFilmsAPI(film_index);
        if (!film.success)
            return Object.assign(Object.assign({}, film), { message: `Can not get film` });
        const { opening_crawl, title } = film.data;
        const film_comments = await queryRunner.manager.find(Comment_1.Comments, {
            where: [{ movie_id: film_index }],
            order: { id: 'DESC' },
        });
        if (!film_comments)
            return {
                success: false,
                message: 'No comments',
            };
        const newData = Object.assign({ title,
            opening_crawl, comment_count: film_comments.length }, (viewComment && { comments: film_comments }));
        if (character) {
            const characterResult = await Promise.all(film.data.characters.map((single_character) => swapi_1.getSwapiCharactersAPI(single_character.split('/')[single_character.split('/').length - 2])));
            return {
                success: true,
                message: 'Films gotten successfully',
                data: Object.assign(Object.assign({}, newData), { characterResult }),
            };
        }
        return {
            success: true,
            message: 'film gotten successfully',
            data: Object.assign({}, newData),
        };
    }
    catch (e) {
        logger_1.default.error(e);
        return {
            success: false,
            message: 'Getting Film failed, kindly try again',
        };
    }
    finally {
        await queryRunner.release();
    }
};
exports.getFilmList = getFilmList;
const converCMToFeetAndInches = (data) => {
    const newfeet = `${data / 30.48}`.split('.');
    const inches = Number(newfeet[1]) * 12;
    return `${newfeet[0]}ft ${inches.toFixed(2)}In`;
};
const getFilmCharactersList = async ({ film_index, height, gender, operator }) => {
    const validation = commentSchema_1.getFilmCharactersSchema.validate({ film_index, height, gender, operator });
    if (validation.error)
        return errors_1.ResourceNotFoundError(validation.error);
    const queryRunner = await db_1.getQueryRunner();
    try {
        const film = await swapi_1.getSwapiFilmsAPI(film_index);
        if (!film.success)
            return Object.assign(Object.assign({}, film), { message: `Can not get film` });
        const { opening_crawl, title } = film.data;
        const newData = {
            title,
            opening_crawl,
        };
        const characterResult = await Promise.all(film.data.characters.map((single_character) => swapi_1.getSwapiCharactersAPI(single_character.split('/')[single_character.split('/').length - 2])));
        const genderCharacters = {
            success: true,
            message: 'Film Characters gotten successfully',
            data: Object.assign(Object.assign({}, newData), { characterResult: [] }),
        };
        if (gender) {
            if (gender === 'not-available') {
                const others = characterResult.filter((character) => character.data.gender === 'n/a');
                genderCharacters.data.characterResult = others;
                return genderCharacters;
            }
            const binaryGender = characterResult.filter((character) => character.data.gender === gender);
            genderCharacters.data.characterResult = binaryGender;
            return genderCharacters;
        }
        if (height) {
            let newHeight;
            if (operator === 'greaterThan')
                newHeight = characterResult.filter((character) => Number(character.data.height) > height);
            if (operator === 'lessThan')
                newHeight = characterResult.filter((character) => Number(character.data.height) < height);
            if (operator === 'equalto')
                newHeight = characterResult.filter((character) => Number(character.data.height) === Number(height));
            const others = newHeight.sort((a, b) => Number(a.data.height) - Number(b.data.height));
            genderCharacters.data.characterResult = others;
            return genderCharacters;
        }
        genderCharacters.data.characterResult = characterResult;
        return genderCharacters;
    }
    catch (e) {
        logger_1.default.error(e);
        return {
            success: false,
            message: 'Getting Film Characters failed, kindly try again',
        };
    }
    finally {
        await queryRunner.release();
    }
};
exports.getFilmCharactersList = getFilmCharactersList;
//# sourceMappingURL=comment.js.map