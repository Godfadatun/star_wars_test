"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommentTable1636201652292 = void 0;
const typeorm_1 = require("typeorm");
class createCommentTable1636201652292 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'comments',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'commenter_ip',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'comment',
                    type: 'varchar',
                    default: false,
                    isNullable: false,
                },
                {
                    name: 'movie_id',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'created_at',
                    type: 'timestamptz',
                    default: 'NOW()',
                    isNullable: false,
                },
                {
                    name: 'updated_at',
                    type: 'timestamptz',
                    default: 'NOW()',
                    isNullable: false,
                },
            ],
        }), true);
    }
    async down(queryRunner) {
        await queryRunner.dropTable('comments');
    }
}
exports.createCommentTable1636201652292 = createCommentTable1636201652292;
//# sourceMappingURL=1636201652292-create-comment-table.js.map