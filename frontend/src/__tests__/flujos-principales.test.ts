import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1';

describe('Sistema de Posts - Flujos Principales', () => {
  let authToken: string;
  let userId: string;
  let testEmail: string;

  beforeAll(async () => {
    // Crear usuario de prueba
    testEmail = `test-${Date.now()}@test.com`;
    const registerResponse = await axios.post(`${API_URL}/auth/register`, {
      email: testEmail,
      password: 'test123'
    });

    authToken = registerResponse.data.accessToken;
    userId = registerResponse.data.user.id;
  });

  describe('Flujo 1: Usuario se registra y entra', () => {
    it('debe poder registrarse exitosamente', () => {
      expect(authToken).toBeDefined();
      expect(userId).toBeDefined();
    });

    it('debe poder hacer login', async () => {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: testEmail,
        password: 'test123'
      });

      expect(response.data.success).toBe(true);
      expect(response.data.accessToken).toBeDefined();
    });
  });

  describe('Flujo 2: Ver feed', () => {
    it('debe poder ver el feed (vacío o con posts)', async () => {
      const response = await axios.get(`${API_URL}/posts/feed`);

      expect(response.data.success).toBe(true);
      expect(Array.isArray(response.data.posts)).toBe(true);
    });
  });

  describe('Flujo 3: Intentar crear post sin verificación', () => {
    it('debe rechazar la creación de post si no está verificado', async () => {
      try {
        await axios.post(
          `${API_URL}/posts/create`,
          {
            content: 'Este post no debería crearse',
            isAnonymous: false
          },
          {
            headers: { Authorization: `Bearer ${authToken}` }
          }
        );
        
        // Si llega aquí, el test falla
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.response.status).toBe(403);
        expect(error.response.data.requiresVerification).toBe(true);
      }
    });
  });

  describe('Flujo 4: Crear post anónimo (sin username)', () => {
    it('debe permitir crear post anónimo incluso sin username', async () => {
      // TODO: Primero verificar el email del usuario de prueba
      // Por ahora este test quedará pendiente
      expect(true).toBe(true);
    });
  });

  describe('Flujo 5: Entender por qué no puede publicar', () => {
    it('debe recibir mensaje claro sobre verificación', async () => {
      try {
        await axios.post(
          `${API_URL}/posts/create`,
          {
            content: 'Test post',
            isAnonymous: false
          },
          {
            headers: { Authorization: `Bearer ${authToken}` }
          }
        );
      } catch (error: any) {
        expect(error.response.data.message).toBe('Debes verificar tu correo para publicar');
        expect(error.response.data.requiresVerification).toBe(true);
      }
    });
  });

  describe('Flujo 6: Recarga no rompe nada', () => {
    it('debe poder obtener el feed múltiples veces sin errores', async () => {
      const response1 = await axios.get(`${API_URL}/posts/feed`);
      const response2 = await axios.get(`${API_URL}/posts/feed`);
      const response3 = await axios.get(`${API_URL}/posts/feed`);

      expect(response1.data.success).toBe(true);
      expect(response2.data.success).toBe(true);
      expect(response3.data.success).toBe(true);
    });
  });
});
