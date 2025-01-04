const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { models, sequelize } = require('../../../src/infra/db');
const AuthService = require('../../../src/domain/services/auth');

beforeAll(async () => {
    await sequelize.sync({ force: true });
    // Seed an admin user for login tests
    await models.User.create({
        username: 'testuser',
        password: await bcrypt.hash('password123', 10),
        role: 'Admin',
    });
});

afterAll(async () => {
    await sequelize.close();
});

describe('AuthService', () => {
    test('should register a new user successfully', async () => {
        const mockReq = {
            body: {
                username: 'newuser',
                password: 'newpassword123',
                role: 'KAM',
            },
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await AuthService.register(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
            message: 'User registered successfully',
        }));
    });

    test('should fail login with invalid credentials', async () => {
        const mockReq = {
            body: {
                username: 'invaliduser',
                password: 'wrongpassword',
            },
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const mockNext = jest.fn();

        await AuthService.login(mockReq, mockRes, mockNext);
        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
            error: 'Invalid username or password',
        }));
    });

    test('should generate a valid token on successful login', async () => {
        const mockReq = {
            body: {
                username: 'testuser',
                password: 'password123',
            },
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await AuthService.login(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        const token = mockRes.json.mock.calls[0][0].token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        expect(decoded).toHaveProperty('id');
        expect(decoded.role).toBe('Admin');
    });
});
