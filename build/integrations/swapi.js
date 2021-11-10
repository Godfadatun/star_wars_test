"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSwapiCharactersAPI = exports.getSwapiFilmsAPI = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_1 = __importDefault(require("../utils/logger"));
const secrets_1 = require("../utils/secrets");
const axiosInstance = axios_1.default.create({
    baseURL: secrets_1.SWAPI_BASE_URL,
});
async function getSwapiFilmsAPI(film_index) {
    try {
        const { data } = await axiosInstance.get(`/films/${film_index || ''}`);
        return {
            success: true,
            data,
        };
    }
    catch (error) {
        logger_1.default.error(error.response.data);
        return {
            success: false,
            error: error.response.data.message,
        };
    }
}
exports.getSwapiFilmsAPI = getSwapiFilmsAPI;
async function getSwapiCharactersAPI(people_index) {
    try {
        const { data } = await axiosInstance.get(`/people/${people_index}`);
        return {
            success: true,
            data,
        };
    }
    catch (error) {
        logger_1.default.error(error.response.data);
        return {
            success: false,
            error: error.response.data.message,
        };
    }
}
exports.getSwapiCharactersAPI = getSwapiCharactersAPI;
//# sourceMappingURL=swapi.js.map