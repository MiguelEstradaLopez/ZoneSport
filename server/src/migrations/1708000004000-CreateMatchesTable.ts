import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateMatchesTable1708000004000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'matches',
                columns: [
                    {
                        name: 'id',
                        type: 'integer',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'teamA',
                        type: 'varchar',
                        length: '100',
                        isNullable: false,
                    },
                    {
                        name: 'teamB',
                        type: 'varchar',
                        length: '100',
                        isNullable: false,
                    },
                    {
                        name: 'scoreA',
                        type: 'integer',
                        isNullable: true,
                    },
                    {
                        name: 'scoreB',
                        type: 'integer',
                        isNullable: true,
                    },
                    {
                        name: 'status',
                        type: 'enum',
                        enum: ['SCHEDULED', 'IN_PROGRESS', 'PLAYED'],
                        default: `'SCHEDULED'`,
                    },
                    {
                        name: 'scheduledDate',
                        type: 'timestamp',
                        isNullable: false,
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
            }),
            true,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('matches');
    }
}
