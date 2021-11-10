"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-vars */
const express_1 = __importDefault(require("express"));
const typeorm_1 = require("typeorm");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const logger_1 = __importDefault(require("./utils/logger"));
const routes_1 = __importDefault(require("./routes"));
dotenv_1.default.config();
const port = process.env.USER_GATEWAY_PORT;
async function startServer() {
    const app = express_1.default();
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: false }));
    app.use(cors_1.default());
    app.use(helmet_1.default());
    app.use('/api', routes_1.default);
    app.get('/', (req, res) => {
        res.json({ greeting: `Hello, Good Morning ${port} !` });
    });
    app.use((req, res, _next) => {
        res.status(404).send({
            status: false,
            error: 'resource not found',
        });
    });
    // handle unexpected errors
    app.use((err, req, res, _next) => {
        res.status(err.status || 500).send({
            success: false,
            error: 'Internal server error.',
        });
    });
    await typeorm_1.createConnection()
        .then(() => logger_1.default.info('Database connected'))
        .catch((err) => {
        logger_1.default.error('Database connection failed');
        logger_1.default.error(JSON.stringify(err));
        process.exit(1);
    });
    app.listen(port, () => {
        logger_1.default.info(`App is listening on port ${port} !`);
    });
}
startServer();
//# sourceMappingURL=index.js.map