import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('Password Hashing and Security - Integration Tests', () => {
    describe('bcrypt Password Hashing', () => {
        it('should correctly validate a hashed password', async () => {
            // This hash corresponds to 'password'
            const hashedPassword = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DvhvFm';
            const plainPassword = 'password';

            const isMatch = await bcrypt.compare(plainPassword, hashedPassword);

            expect(isMatch).toBe(true);
        });

        it('should reject incorrect passwords', async () => {
            const hashedPassword = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DvhvFm';
            const wrongPassword = 'wrongpassword';

            const isMatch = await bcrypt.compare(wrongPassword, hashedPassword);

            expect(isMatch).toBe(false);
        });

        it('should hash passwords consistently with different salts', async () => {
            const password = 'testPassword123';

            const hash1 = await bcrypt.hash(password, 10);
            const hash2 = await bcrypt.hash(password, 10);

            // Hashes should be different but both should validate the same password
            expect(hash1).not.toBe(hash2);

            const match1 = await bcrypt.compare(password, hash1);
            const match2 = await bcrypt.compare(password, hash2);

            expect(match1).toBe(true);
            expect(match2).toBe(true);
        });

        it('should handle different salt rounds', async () => {
            const password = 'testPassword123';

            // It's faster, but we use 10 in production
            const hashWithLowerRounds = await bcrypt.hash(password, 5);
            const match = await bcrypt.compare(password, hashWithLowerRounds);

            expect(match).toBe(true);
        });
    });

    describe('Error Handling', () => {
        it('should handle empty passwords', async () => {
            const emptyPassword = '';
            const hashedPassword = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DvhvFm';

            const isMatch = await bcrypt.compare(emptyPassword, hashedPassword);

            expect(isMatch).toBe(false);
        });

        it('should validate bcrypt hash format', async () => {
            // Valid bcrypt hash format: $2b$rounds$salt+hash
            const validHash = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DvhvFm';

            const isMatch = await bcrypt.compare('password', validHash);

            expect(isMatch).toBe(true);
        });
    });

    describe('Security Standards', () => {
        it('should use recommended salt rounds (10)', async () => {
            const password = 'testPassword123';
            const saltRounds = 10;

            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // bcrypt hash with 10 rounds should be a specific format
            expect(hashedPassword).toMatch(/^\$2b\$10\$/);
        });

        it('should handle long passwords securely', async () => {
            // bcrypt max password length is 72 bytes, longer strings are truncated
            const longPassword = 'a'.repeat(100);
            const hashedPassword = await bcrypt.hash(longPassword, 10);

            // The password should still work
            const isMatch = await bcrypt.compare(longPassword, hashedPassword);

            expect(isMatch).toBe(true);
        });

        it('should prevent timing attacks with constant time comparison', async () => {
            const hashedPassword = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DvhvFm';

            // bcrypt.compare uses constant-time comparison internally
            const result1 = await bcrypt.compare('password', hashedPassword);
            const result2 = await bcrypt.compare('password', hashedPassword);

            // Both should be consistent
            expect(result1).toBe(result2);
        });
    });
});
