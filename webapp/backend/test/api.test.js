/**
 * HTTP API Integration Tests
 * Tests the REST API endpoints
 */

import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import http from 'http';

// Mock API server base URL (will be set when server starts)
const API_BASE = 'http://localhost:3001';

// Helper function to make HTTP requests
function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_BASE);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, body: parsed, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, body: data, headers: res.headers });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

// ============================================================================
// LANGUAGES ENDPOINT TESTS
// ============================================================================

describe('GET /api/languages', () => {
  test('returns array of languages', async () => {
    const { status, body } = await makeRequest('GET', '/api/languages');
    assert.strictEqual(status, 200);
    assert.ok(Array.isArray(body));
  });

  test('returns exactly 14 languages', async () => {
    const { status, body } = await makeRequest('GET', '/api/languages');
    assert.strictEqual(status, 200);
    assert.strictEqual(body.length, 14);
  });

  test('each language has key and name', async () => {
    const { status, body } = await makeRequest('GET', '/api/languages');
    assert.strictEqual(status, 200);
    
    body.forEach(lang => {
      assert.ok(lang.key, 'Language missing key');
      assert.ok(lang.name, 'Language missing name');
      assert.strictEqual(typeof lang.key, 'string');
      assert.strictEqual(typeof lang.name, 'string');
    });
  });

  test('includes expected languages', async () => {
    const { status, body } = await makeRequest('GET', '/api/languages');
    assert.strictEqual(status, 200);
    
    const keys = body.map(l => l.key);
    const expectedLanguages = [
      'python', 'ruby', 'nodejs', 'go', 'java', 'c', 'cxx', 'rust',
      'haskell', 'elixir', 'elixirmix', 'fsharp', 'csharp', 'swift'
    ];
    
    expectedLanguages.forEach(lang => {
      assert.ok(keys.includes(lang), `Missing language: ${lang}`);
    });
  });
});

// ============================================================================
// RUN ENDPOINT TESTS
// ============================================================================

describe('POST /api/run', () => {
  test('executes single language successfully', async () => {
    const { status, body } = await makeRequest('POST', '/api/run', {
      language: 'python',
      power: 3
    });
    
    assert.strictEqual(status, 200);
    assert.ok(body.id, 'Missing run ID');
    assert.strictEqual(body.language, 'python');
    assert.strictEqual(body.power, 3);
    assert.ok(body.status);
    assert.ok(Array.isArray(body.numbersFound));
  });

  test('returns 400 when language is missing', async () => {
    const { status, body } = await makeRequest('POST', '/api/run', {
      power: 3
    });
    
    assert.strictEqual(status, 400);
    assert.ok(body.error);
  });

  test('returns 400 when power is missing', async () => {
    const { status, body } = await makeRequest('POST', '/api/run', {
      language: 'python'
    });
    
    assert.strictEqual(status, 400);
    assert.ok(body.error);
  });

  test('returns 400 when body is empty', async () => {
    const { status, body } = await makeRequest('POST', '/api/run', {});
    
    assert.strictEqual(status, 400);
    assert.ok(body.error);
  });

  test('returns 400 for invalid language', async () => {
    const { status, body } = await makeRequest('POST', '/api/run', {
      language: 'nonexistent',
      power: 3
    });
    
    assert.strictEqual(status, 400);
    assert.ok(body.error);
  });

  test('returns 400 for invalid power (negative)', async () => {
    const { status, body } = await makeRequest('POST', '/api/run', {
      language: 'python',
      power: -1
    });
    
    assert.strictEqual(status, 400);
    assert.ok(body.error);
  });

  test('returns 400 for invalid power (too large)', async () => {
    const { status, body } = await makeRequest('POST', '/api/run', {
      language: 'python',
      power: 25
    });
    
    assert.strictEqual(status, 400);
    assert.ok(body.error);
  });

  test('result includes executionMs', async () => {
    const { status, body } = await makeRequest('POST', '/api/run', {
      language: 'python',
      power: 3
    });
    
    assert.strictEqual(status, 200);
    assert.ok(typeof body.executionMs === 'number');
    assert.ok(body.executionMs > 0);
  });

  test('result includes timestamp', async () => {
    const { status, body } = await makeRequest('POST', '/api/run', {
      language: 'python',
      power: 3
    });
    
    assert.strictEqual(status, 200);
    assert.ok(body.timestamp);
  });
});

// ============================================================================
// BATCH ENDPOINT TESTS
// ============================================================================

describe('POST /api/batch', () => {
  test('runs multiple languages in serial', async () => {
    const { status, body } = await makeRequest('POST', '/api/batch', {
      languages: ['python', 'ruby', 'nodejs'],
      power: 3
    });
    
    assert.strictEqual(status, 200);
    assert.ok(Array.isArray(body.results));
    assert.strictEqual(body.results.length, 3);
  });

  test('each result has correct structure', async () => {
    const { status, body } = await makeRequest('POST', '/api/batch', {
      languages: ['python', 'ruby'],
      power: 3
    });
    
    assert.strictEqual(status, 200);
    body.results.forEach(result => {
      assert.ok(result.id);
      assert.ok(result.language);
      assert.ok(result.power);
      assert.ok(result.status);
      assert.ok(Array.isArray(result.numbersFound));
    });
  });

  test('returns 400 when languages is missing', async () => {
    const { status, body } = await makeRequest('POST', '/api/batch', {
      power: 3
    });
    
    assert.strictEqual(status, 400);
    assert.ok(body.error);
  });

  test('returns 400 when power is missing', async () => {
    const { status, body } = await makeRequest('POST', '/api/batch', {
      languages: ['python', 'ruby']
    });
    
    assert.strictEqual(status, 400);
    assert.ok(body.error);
  });

  test('returns 400 when languages is not an array', async () => {
    const { status, body } = await makeRequest('POST', '/api/batch', {
      languages: 'python',
      power: 3
    });
    
    assert.strictEqual(status, 400);
    assert.ok(body.error);
  });

  test('returns 400 when languages array is empty', async () => {
    const { status, body } = await makeRequest('POST', '/api/batch', {
      languages: [],
      power: 3
    });
    
    assert.strictEqual(status, 400);
    assert.ok(body.error);
  });

  test('batch includes totalExecutionMs', async () => {
    const { status, body } = await makeRequest('POST', '/api/batch', {
      languages: ['python', 'ruby'],
      power: 3
    });
    
    assert.strictEqual(status, 200);
    assert.ok(typeof body.totalExecutionMs === 'number');
    assert.ok(body.totalExecutionMs > 0);
  });
});

// ============================================================================
// HISTORY/RUNS ENDPOINT TESTS
// ============================================================================

describe('GET /api/runs', () => {
  test('returns array of runs', async () => {
    const { status, body } = await makeRequest('GET', '/api/runs');
    assert.strictEqual(status, 200);
    assert.ok(Array.isArray(body));
  });

  test('runs are sorted by timestamp descending', async () => {
    const { status, body } = await makeRequest('GET', '/api/runs');
    assert.strictEqual(status, 200);
    
    if (body.length > 1) {
      for (let i = 0; i < body.length - 1; i++) {
        const t1 = new Date(body[i].timestamp).getTime();
        const t2 = new Date(body[i + 1].timestamp).getTime();
        assert.ok(t1 >= t2, 'Runs not sorted by timestamp descending');
      }
    }
  });

  test('supports pagination with limit', async () => {
    const { status, body } = await makeRequest('GET', '/api/runs?limit=5');
    assert.strictEqual(status, 200);
    assert.ok(body.length <= 5);
  });

  test('supports filtering by language', async () => {
    const { status, body } = await makeRequest('GET', '/api/runs?language=python');
    assert.strictEqual(status, 200);
    
    body.forEach(run => {
      assert.strictEqual(run.language, 'python');
    });
  });

  test('supports filtering by power', async () => {
    const { status, body } = await makeRequest('GET', '/api/runs?power=3');
    assert.strictEqual(status, 200);
    
    body.forEach(run => {
      assert.strictEqual(run.power, 3);
    });
  });
});

// ============================================================================
// INDIVIDUAL RUN ENDPOINT TESTS
// ============================================================================

describe('GET /api/runs/:id', () => {
  test('returns run details for valid ID', async () => {
    // First create a run
    const createRes = await makeRequest('POST', '/api/run', {
      language: 'python',
      power: 3
    });
    const runId = createRes.body.id;
    
    // Then fetch it
    const { status, body } = await makeRequest('GET', `/api/runs/${runId}`);
    assert.strictEqual(status, 200);
    assert.strictEqual(body.id, runId);
    assert.ok(body.language);
    assert.ok(body.power);
  });

  test('returns 404 for non-existent ID', async () => {
    const { status, body } = await makeRequest('GET', '/api/runs/nonexistent-id');
    assert.strictEqual(status, 404);
    assert.ok(body.error);
  });

  test('includes full details including stdout/stderr', async () => {
    const createRes = await makeRequest('POST', '/api/run', {
      language: 'python',
      power: 3
    });
    const runId = createRes.body.id;
    
    const { status, body } = await makeRequest('GET', `/api/runs/${runId}`);
    assert.strictEqual(status, 200);
    assert.ok(body.hasOwnProperty('stdout'));
    assert.ok(body.hasOwnProperty('stderr'));
  });
});

// ============================================================================
// HEALTH ENDPOINT TESTS
// ============================================================================

describe('GET /api/health', () => {
  test('returns 200 OK', async () => {
    const { status, body } = await makeRequest('GET', '/api/health');
    assert.strictEqual(status, 200);
  });

  test('returns status healthy', async () => {
    const { status, body } = await makeRequest('GET', '/api/health');
    assert.strictEqual(status, 200);
    assert.strictEqual(body.status, 'healthy');
  });
});

// ============================================================================
// CORS TESTS
// ============================================================================

describe('CORS headers', () => {
  test('includes CORS headers in response', async () => {
    const { status, headers } = await makeRequest('GET', '/api/languages');
    assert.strictEqual(status, 200);
    assert.ok(headers['access-control-allow-origin']);
  });

  test('handles OPTIONS preflight request', async () => {
    const { status, headers } = await makeRequest('OPTIONS', '/api/run');
    assert.ok([200, 204].includes(status));
    assert.ok(headers['access-control-allow-methods']);
  });
});

// ============================================================================
// ERROR HANDLING TESTS
// ============================================================================

describe('Error handling', () => {
  test('returns 404 for non-existent endpoint', async () => {
    const { status } = await makeRequest('GET', '/api/nonexistent');
    assert.strictEqual(status, 404);
  });

  test('returns 405 for wrong HTTP method', async () => {
    const { status } = await makeRequest('DELETE', '/api/languages');
    assert.ok([405, 404].includes(status));
  });

  test('returns 400 for malformed JSON', async () => {
    const url = new URL('/api/run', API_BASE);
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    };

    const promise = new Promise((resolve, reject) => {
      const req = http.request(url, options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ status: res.statusCode }));
      });
      req.on('error', reject);
      req.write('{invalid json}');
      req.end();
    });

    const { status } = await promise;
    assert.strictEqual(status, 400);
  });
});

// Export for potential use in other tests
export { makeRequest, API_BASE };
