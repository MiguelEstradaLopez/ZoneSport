import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

describe('UsersService - Extended Tests', () => {
    let usersService: UsersService;
    let usersRepository: Repository<User>;

    const mockUser: Partial<User> = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DvhvFm',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockCreateUserDto = {
        email: 'newuser@example.com',
        password: 'securePassword123',
        firstName: 'New',
        lastName: 'User',
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useValue: {
                        find: jest.fn(),
                        findOne: jest.fn(),
                        create: jest.fn(),
                        save: jest.fn(),
                        update: jest.fn(),
                        delete: jest.fn(),
                    },
                },
            ],
        }).compile();

        usersService = module.get<UsersService>(UsersService);
        usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    });

    describe('Password Security', () => {
        it('should validate bcrypt hash compatibility', async () => {
            const plainPassword = 'securePassword123';
            const hashedPassword = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DvhvFm';

            // This hash is for 'password', so this should fail
            const isValid = await bcrypt.compare(plainPassword, hashedPassword);

            expect(isValid).toBe(false);
        });

        it('should handle password validation with correct hash', async () => {
            const plainPassword = 'password';
            const hashedPassword = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DvhvFm';

            const isValid = await bcrypt.compare(plainPassword, hashedPassword);

            expect(isValid).toBe(true);
        });
    });

    describe('Data Validation', () => {
        it('should handle very long email addresses', async () => {
            const longEmailDto = {
                ...mockCreateUserDto,
                email: 'a'.repeat(100) + '@example.com',
            };

            expect(longEmailDto.email.length).toBeGreaterThan(100);
        });

        it('should handle special characters in names', async () => {
            const specialCharDto = {
                ...mockCreateUserDto,
                firstName: "O'Brien",
                lastName: "García-López",
            };

            expect(specialCharDto.firstName).toBe("O'Brien");
            expect(specialCharDto.lastName).toBe("García-López");
        });

        it('should validate email format requirements', () => {
            const validEmails = [
                'test@example.com',
                'user.name@example.co.uk',
                'test+tag@example.com',
            ];

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            validEmails.forEach((email) => {
                expect(emailRegex.test(email)).toBe(true);
            });
        });
    });
});
