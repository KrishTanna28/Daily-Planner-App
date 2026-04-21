import { describe, expect, it } from 'vitest';

import {
  hasValidationErrors,
  isValidEmail,
  isValidTime,
  validateLoginForm,
  validateRegisterForm,
  validateTaskForm,
} from './validation';

describe('validation utilities', () => {
  it('validates email format correctly', () => {
    expect(isValidEmail('person@example.com')).toBe(true);
    expect(isValidEmail('  person@example.com  ')).toBe(true);
    expect(isValidEmail('invalid-email')).toBe(false);
    expect(isValidEmail('person@')).toBe(false);
  });

  it('validates due time in HH:mm format', () => {
    expect(isValidTime('')).toBe(true);
    expect(isValidTime('09:30')).toBe(true);
    expect(isValidTime('23:59')).toBe(true);
    expect(isValidTime('24:00')).toBe(false);
    expect(isValidTime('9:30')).toBe(false);
    expect(isValidTime('10:77')).toBe(false);
  });

  it('returns register form errors for invalid values', () => {
    const errors = validateRegisterForm({
      fullName: ' ',
      email: 'wrong',
      password: '123',
      confirmPassword: '456',
    });

    expect(errors.fullName).toBe('Full name is required.');
    expect(errors.email).toBe('Enter a valid email address.');
    expect(errors.password).toBe('Password must be at least 6 characters.');
    expect(errors.confirmPassword).toBe('Passwords do not match.');
    expect(hasValidationErrors(errors)).toBe(true);
  });

  it('returns no register errors for valid values', () => {
    const errors = validateRegisterForm({
      fullName: 'Planner User',
      email: 'planner@example.com',
      password: '123456',
      confirmPassword: '123456',
    });

    expect(errors).toEqual({});
    expect(hasValidationErrors(errors)).toBe(false);
  });

  it('validates login form requirements', () => {
    const errors = validateLoginForm({
      email: 'not-an-email',
      password: '',
    });

    expect(errors.email).toBe('Enter a valid email address.');
    expect(errors.password).toBe('Password is required.');
  });

  it('validates task form requirements', () => {
    const errors = validateTaskForm({
      title: ' ',
      description: 'Optional details',
      dueTime: '99:99',
    });

    expect(errors.title).toBe('Task title is required.');
    expect(errors.dueTime).toBe('Use HH:mm format.');
  });
});
