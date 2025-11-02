/**
 * Tests for Custom Error Classes
 *
 * Tests all custom error types and error handling utilities
 */

import { describe, it, expect } from 'vitest';
import {
  ServiceError,
  ValidationError,
  NotFoundError,
  DatabaseError,
  withErrorHandling,
  createErrorContext,
} from '../errors.js';

describe('ServiceError', () => {
  it('creates error with Error object', () => {
    const originalError = new Error('Database connection failed');
    const error = new ServiceError('getAllSites', originalError, { filter: 'mosque' });

    expect(error.name).toBe('ServiceError');
    expect(error.message).toBe('getAllSites failed: Database connection failed');
    expect(error.operation).toBe('getAllSites');
    expect(error.originalError).toBe(originalError);
    expect(error.context).toEqual({ filter: 'mosque' });
    expect(error.timestamp).toBeDefined();
    expect(error.originalStack).toBe(originalError.stack);
  });

  it('creates error with string message', () => {
    const error = new ServiceError('updateSite', 'Invalid ID format');

    expect(error.message).toBe('updateSite failed: Invalid ID format');
    expect(error.originalError).toBeInstanceOf(Error);
    expect(error.originalError.message).toBe('Invalid ID format');
  });

  it('preserves stack trace', () => {
    const error = new ServiceError('test', 'test error');

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('ServiceError');
  });

  it('converts to JSON correctly', () => {
    const originalError = new Error('Test error');
    const error = new ServiceError('testOp', originalError, { foo: 'bar' });
    const json = error.toJSON();

    expect(json.name).toBe('ServiceError');
    expect(json.operation).toBe('testOp');
    expect(json.context).toEqual({ foo: 'bar' });
    expect(json.timestamp).toBeDefined();
    expect(json.originalMessage).toBe('Test error');
    expect(json.stack).toBeDefined();
  });

  it('formats toString() correctly', () => {
    const error = new ServiceError('testOp', new Error('Test message'));
    const str = error.toString();

    expect(str).toBe('[ServiceError] testOp failed: Test message');
  });

  it('handles empty context', () => {
    const error = new ServiceError('testOp', 'error');

    expect(error.context).toEqual({});
  });
});

describe('ValidationError', () => {
  it('creates validation error with correct properties', () => {
    const error = new ValidationError('createSite', 'Name is required', { field: 'name' });

    expect(error.name).toBe('ValidationError');
    expect(error.statusCode).toBe(400);
    expect(error.message).toContain('createSite failed');
    expect(error.message).toContain('Name is required');
    expect(error.operation).toBe('createSite');
    expect(error.context).toEqual({ field: 'name' });
  });

  it('extends ServiceError', () => {
    const error = new ValidationError('test', 'Invalid input');

    expect(error).toBeInstanceOf(ServiceError);
    expect(error).toBeInstanceOf(ValidationError);
  });
});

describe('NotFoundError', () => {
  it('creates not found error with correct message', () => {
    const error = new NotFoundError('getSiteById', 'Site', 'site-123');

    expect(error.name).toBe('NotFoundError');
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe('getSiteById failed: Site with ID "site-123" not found');
    expect(error.context).toEqual({
      resourceType: 'Site',
      resourceId: 'site-123'
    });
  });

  it('extends ServiceError', () => {
    const error = new NotFoundError('test', 'Resource', 'id-1');

    expect(error).toBeInstanceOf(ServiceError);
    expect(error).toBeInstanceOf(NotFoundError);
  });
});

describe('DatabaseError', () => {
  it('creates database error with query context', () => {
    const dbError = new Error('Connection timeout');
    const error = new DatabaseError('findAll', dbError, 'SELECT * FROM sites');

    expect(error.name).toBe('DatabaseError');
    expect(error.statusCode).toBe(500);
    expect(error.message).toContain('findAll failed');
    expect(error.message).toContain('Connection timeout');
    expect(error.context).toEqual({ query: 'SELECT * FROM sites' });
  });

  it('works without query parameter', () => {
    const error = new DatabaseError('insert', new Error('Constraint violation'));

    expect(error.context).toEqual({ query: null });
  });

  it('extends ServiceError', () => {
    const error = new DatabaseError('test', new Error('DB error'));

    expect(error).toBeInstanceOf(ServiceError);
    expect(error).toBeInstanceOf(DatabaseError);
  });
});

describe('withErrorHandling', () => {
  it('returns result when function succeeds', async () => {
    const successFn = async (x, y) => x + y;
    const wrapped = withErrorHandling(successFn, 'add');

    const result = await wrapped(2, 3);
    expect(result).toBe(5);
  });

  it('converts regular errors to ServiceError', async () => {
    const failFn = async () => {
      throw new Error('Something went wrong');
    };
    const wrapped = withErrorHandling(failFn, 'testOperation');

    await expect(wrapped()).rejects.toThrow(ServiceError);

    try {
      await wrapped();
    } catch (error) {
      expect(error.name).toBe('ServiceError');
      expect(error.operation).toBe('testOperation');
      expect(error.originalError.message).toBe('Something went wrong');
    }
  });

  it('preserves ServiceError instances', async () => {
    const failFn = async () => {
      throw new ValidationError('validate', 'Invalid data');
    };
    const wrapped = withErrorHandling(failFn, 'wrapper');

    await expect(wrapped()).rejects.toThrow(ValidationError);

    try {
      await wrapped();
    } catch (error) {
      expect(error.name).toBe('ValidationError');
      expect(error.operation).toBe('validate'); // Original operation preserved
    }
  });

  it('includes function arguments in error context', async () => {
    const failFn = async (id, data) => {
      throw new Error('Failed');
    };
    const wrapped = withErrorHandling(failFn, 'update');

    try {
      await wrapped('site-1', { name: 'New Name' });
    } catch (error) {
      expect(error.context.args).toEqual(['site-1', { name: 'New Name' }]);
    }
  });
});

describe('createErrorContext', () => {
  it('creates context for regular Error', () => {
    const error = new Error('Test error');
    const context = createErrorContext(error);

    expect(context.timestamp).toBeDefined();
    expect(context.error.name).toBe('Error');
    expect(context.error.message).toBe('Test error');
    expect(context.error.stack).toBeDefined();
  });

  it('includes ServiceError specific fields', () => {
    const error = new ServiceError('testOp', new Error('Original error'), { foo: 'bar' });
    const context = createErrorContext(error);

    expect(context.error.operation).toBe('testOp');
    expect(context.error.context).toEqual({ foo: 'bar' });
    expect(context.error.originalMessage).toBe('Original error');
    expect(context.error.originalStack).toBeDefined();
  });

  it('includes request information when provided', () => {
    const mockRequest = {
      method: 'GET',
      path: '/api/sites',
      query: { type: 'mosque' },
      params: { id: 'site-1' },
      ip: '127.0.0.1',
      id: 'req-123',
      get: (header) => (header === 'user-agent' ? 'test-agent' : null)
    };

    const error = new Error('Test error');
    const context = createErrorContext(error, mockRequest);

    expect(context.requestId).toBe('req-123');
    expect(context.request).toEqual({
      method: 'GET',
      path: '/api/sites',
      query: { type: 'mosque' },
      params: { id: 'site-1' },
      ip: '127.0.0.1',
      userAgent: 'test-agent'
    });
  });

  it('works without request object', () => {
    const error = new Error('Test');
    const context = createErrorContext(error, null);

    expect(context.request).toBeUndefined();
    expect(context.requestId).toBeUndefined();
  });
});
