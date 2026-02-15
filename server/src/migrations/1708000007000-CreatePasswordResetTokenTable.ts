import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreatePasswordResetTokenTable1708000007000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'password_reset_token',
                columns: [
                    {
                        name: 'id',
                        type: 'integer',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'token',
                        type: 'varchar',
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: 'userId',
                        type: 'integer',
                        isNullable: false,
                    },
                    {
                        name: 'expiresAt',
                        type: 'timestamp',
                        isNullable: false,
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'now()',
                    },
                ],
                foreignKeys: [
                    new TableForeignKey({
                        columnNames: ['userId'],
                        referencedTableName: 'users',
                        referencedColumnNames: ['id'],
                        onDelete: 'CASCADE',
                    }),
                ],
            }),
            true,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('password_reset_token');
    }
}
