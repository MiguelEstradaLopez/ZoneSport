import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableUnique } from 'typeorm';

export class CreateClassificationsTable1708000005000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'classifications',
                columns: [
                    {
                        name: 'id',
                        type: 'integer',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'teamName',
                        type: 'varchar',
                        length: '100',
                        isNullable: false,
                    },
                    {
                        name: 'points',
                        type: 'integer',
                        default: 0,
                    },
                    {
                        name: 'wins',
                        type: 'integer',
                        default: 0,
                    },
                    {
                        name: 'draws',
                        type: 'integer',
                        default: 0,
                    },
                    {
                        name: 'losses',
                        type: 'integer',
                        default: 0,
                    },
                    {
                        name: 'goalsFor',
                        type: 'integer',
                        default: 0,
                    },
                    {
                        name: 'goalsAgainst',
                        type: 'integer',
                        default: 0,
                    },
                    {
                        name: 'position',
                        type: 'integer',
                        default: 0,
                    },
                    {
                        name: 'eventId',
                        type: 'integer',
                        isNullable: false,
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'updatedAt',
                        type: 'timestamp',
                        default: 'now()',
                        onUpdate: 'now()',
                    },
                ],
                foreignKeys: [
                    new TableForeignKey({
                        columnNames: ['eventId'],
                        referencedTableName: 'events',
                        referencedColumnNames: ['id'],
                        onDelete: 'CASCADE',
                    }),
                ],
                uniques: [
                    new TableUnique({
                        columnNames: ['eventId', 'teamName'],
                    }),
                ],
            }),
            true,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('classifications');
    }
}
