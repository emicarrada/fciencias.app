import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Authentication Flow
 * 
 * These tests simulate complete user journeys through the authentication system
 */

test.describe('Authentication Flow', () => {
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'password123';
  const testUsername = `testuser${Date.now()}`;

  test.beforeEach(async ({ page }) => {
    // Start from homepage
    await page.goto('/');
  });

  test('should complete full registration and login flow', async ({ page }) => {
    // Navigate to register page
    await page.click('text=Regístrate');
    await expect(page).toHaveURL(/.*auth\/register/);

    // Fill registration form
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.fill('input[name="confirmPassword"]', testPassword);

    // Submit form
    await page.click('button[type="submit"]');

    // Should see success message
    await expect(page.locator('text=Cuenta creada')).toBeVisible({ timeout: 5000 });

    // In development mode, use dev-verify endpoint
    if (process.env.NODE_ENV !== 'production') {
      // Navigate to dev verify page or call endpoint
      await page.goto('/auth/login');
    }

    // Login with new account
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 5000 });
  });

  test('should show validation errors on invalid registration', async ({ page }) => {
    await page.goto('/auth/register');

    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Should show validation errors
    await expect(page.locator('text=/email.*requerido/i')).toBeVisible();
    await expect(page.locator('text=/contraseña.*requerido/i')).toBeVisible();
  });

  test('should show error on invalid login', async ({ page }) => {
    await page.goto('/auth/login');

    // Try invalid credentials
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Should show error message
    await expect(page.locator('text=/incorrecto/i')).toBeVisible({ timeout: 5000 });
  });

  test('should validate password length', async ({ page }) => {
    await page.goto('/auth/register');

    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', '12345'); // Too short
    await page.fill('input[name="confirmPassword"]', '12345');
    await page.click('button[type="submit"]');

    // Should show password length error
    await expect(page.locator('text=/6 caracteres/i')).toBeVisible();
  });

  test('should validate password confirmation match', async ({ page }) => {
    await page.goto('/auth/register');

    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.fill('input[name="confirmPassword"]', 'differentpassword');
    await page.click('button[type="submit"]');

    // Should show password mismatch error
    await expect(page.locator('text=/no coinciden/i')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // This test assumes a logged-in user
    // In a real scenario, you'd want to create a helper to login first
    
    // For now, skip if not logged in
    test.skip();

    // await page.goto('/dashboard');
    // await page.click('text=Cerrar sesión');
    // await expect(page).toHaveURL('/');
  });
});

test.describe('Password Recovery Flow', () => {
  test('should navigate to forgot password page', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Click "¿Olvidaste tu contraseña?" link
    await page.click('text=/Recuperar contraseña/i');
    
    await expect(page).toHaveURL(/.*auth\/forgot-password/);
    await expect(page.locator('h1:has-text("¿Olvidaste tu contraseña?")')).toBeVisible();
  });

  test('should submit forgot password form', async ({ page }) => {
    await page.goto('/auth/forgot-password');

    // Fill email
    await page.fill('input[type="email"]', 'test@example.com');
    
    // Submit
    await page.click('button:has-text("Enviar enlace")');

    // Should show success message
    await expect(page.locator('text=/Revisa tu correo/i')).toBeVisible({ timeout: 5000 });
  });

  test('should validate email in forgot password form', async ({ page }) => {
    await page.goto('/auth/forgot-password');

    // Try to submit without email
    await page.click('button[type="submit"]');

    // Button should be disabled or show error
    const button = page.locator('button[type="submit"]');
    await expect(button).toBeDisabled();
  });

  test('should navigate back to login from forgot password', async ({ page }) => {
    await page.goto('/auth/forgot-password');

    await page.click('text=/Volver al inicio/i');
    
    await expect(page).toHaveURL(/.*auth\/login/);
  });
});

test.describe('Email Verification', () => {
  test('should resend verification email', async ({ page }) => {
    // This test requires a registered but unverified user
    test.skip();

    // await page.goto('/auth/verify');
    // await page.click('text=/Reenviar/i');
    // await expect(page.locator('text=/enviado/i')).toBeVisible();
  });
});
