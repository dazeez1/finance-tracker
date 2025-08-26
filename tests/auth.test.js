const request = require('supertest');
const app = require('../app');

describe('Authentication Endpoints', () => {
  describe('POST /api/auth/signup', () => {
    it('should create a new user account', async () => {
      const userData = {
        fullName: 'Test User',
        emailAddress: 'test@example.com',
        accountType: 'personal',
        password: 'TestPass123'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.fullName).toBe(userData.fullName);
      expect(response.body.data.user.emailAddress).toBe(userData.emailAddress);
      expect(response.body.data.authToken).toBeDefined();
    });

    it('should return validation errors for invalid data', async () => {
      const invalidData = {
        fullName: '',
        emailAddress: 'invalid-email',
        accountType: 'invalid',
        password: '123'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('POST /api/auth/login', () => {
    it('should authenticate valid credentials', async () => {
      const loginData = {
        emailAddress: 'test@example.com',
        password: 'TestPass123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.authToken).toBeDefined();
    });
  });
});
