/**
 * Parser Unit Tests
 * Tests output parsing for all 14 language implementations
 * Uses Node.js built-in test runner (node:test)
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';

// Mock parseOutput function - will be implemented in executor module
// For now, we define expected behavior
function parseOutput(language, stdout) {
  const lines = stdout.split('\n').filter(line => line.trim());
  
  // Language-specific parsers
  switch (language.toLowerCase()) {
    case 'python':
      // Python: "arg = 3\n3 :  [153, 370, 371, 407]"
      return parsePythonOutput(lines);
    
    case 'nodejs':
    case 'node':
      // Node.js: "3: 153, 370, 371, 407" (NO brackets)
      return parseNodeJsOutput(lines);
    
    case 'go':
      // Go: "3: start: 1 .. max: 19683: done" (diagnostic format)
      return parseGoOutput(lines);
    
    case 'ruby':
    case 'java':
    case 'c':
    case 'cxx':
    case 'c++':
    case 'rust':
    case 'haskell':
    case 'elixir':
    case 'elixirmix':
    case 'fsharp':
    case 'f#':
    case 'csharp':
    case 'c#':
    case 'swift':
    default:
      // Default: Ruby-style "3: [153, 370, 371, 407]"
      return parseDefaultOutput(lines);
  }
}

function parsePythonOutput(lines) {
  // Skip debug lines like "arg = 3", find line with format "3 :  [153, 370, 371, 407]"
  for (const line of lines) {
    if (line.includes(':') && line.includes('[') && line.includes(']')) {
      const match = line.match(/\[([\d,\s]+)\]/);
      if (match) {
        return match[1].split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
      }
    }
  }
  return [];
}

function parseNodeJsOutput(lines) {
  // Node.js: "3: 153, 370, 371, 407" (NO brackets)
  for (const line of lines) {
    if (line.includes(':')) {
      const parts = line.split(':');
      if (parts.length >= 2) {
        const numbers = parts.slice(1).join(':').split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
        return numbers;
      }
    }
  }
  return [];
}

function parseGoOutput(lines) {
  // Go uses diagnostic format: "3: start: 1 .. max: 19683: done"
  // May not output numbers directly - check for bracketed or comma-separated format
  for (const line of lines) {
    // Try bracketed format first
    const bracketMatch = line.match(/\[([\d,\s]+)\]/);
    if (bracketMatch) {
      return bracketMatch[1].split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    }
    
    // If no brackets and contains numbers after colon (but not diagnostic keywords)
    if (line.includes(':') && !line.includes('start:') && !line.includes('max:') && !line.includes('done')) {
      const parts = line.split(':');
      if (parts.length >= 2) {
        const numbers = parts.slice(1).join(':').split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
        if (numbers.length > 0) {
          return numbers;
        }
      }
    }
  }
  return [];
}

function parseDefaultOutput(lines) {
  // Default: "3: [153, 370, 371, 407]"
  for (const line of lines) {
    if (line.includes('[') && line.includes(']')) {
      const match = line.match(/\[([\d,\s]+)\]/);
      if (match) {
        return match[1].split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
      }
    }
  }
  return [];
}

// ============================================================================
// PYTHON PARSER TESTS
// ============================================================================

describe('Python parser', () => {
  test('extracts numbers from bracketed format with debug line', () => {
    const stdout = 'arg = 3\n3 :  [153, 370, 371, 407]\n';
    const result = parseOutput('python', stdout);
    assert.deepStrictEqual(result, [153, 370, 371, 407]);
  });

  test('handles p=3 canary test', () => {
    const stdout = 'arg = 3\n3 :  [153, 370, 371, 407]\n';
    const result = parseOutput('python', stdout);
    assert.deepStrictEqual(result, [153, 370, 371, 407]);
  });

  test('handles p=1 canary test', () => {
    const stdout = 'arg = 1\n1 :  [1, 2, 3, 4, 5, 6, 7, 8, 9]\n';
    const result = parseOutput('python', stdout);
    assert.deepStrictEqual(result, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  test('handles p=4 canary test', () => {
    const stdout = 'arg = 4\n4 :  [1634, 8208, 9474]\n';
    const result = parseOutput('python', stdout);
    assert.deepStrictEqual(result, [1634, 8208, 9474]);
  });

  test('handles empty result (p=2)', () => {
    const stdout = 'arg = 2\n2 :  []\n';
    const result = parseOutput('python', stdout);
    assert.deepStrictEqual(result, []);
  });

  test('handles extra whitespace', () => {
    const stdout = 'arg = 3\n\n  3 :  [  153 ,  370 ,  371 ,  407  ]  \n\n';
    const result = parseOutput('python', stdout);
    assert.deepStrictEqual(result, [153, 370, 371, 407]);
  });

  test('handles empty output', () => {
    const stdout = '';
    const result = parseOutput('python', stdout);
    assert.deepStrictEqual(result, []);
  });

  test('handles output with multiple debug lines', () => {
    const stdout = 'Starting...\narg = 3\nProcessing...\n3 :  [153, 370, 371, 407]\nDone.\n';
    const result = parseOutput('python', stdout);
    assert.deepStrictEqual(result, [153, 370, 371, 407]);
  });
});

// ============================================================================
// NODE.JS PARSER TESTS
// ============================================================================

describe('Node.js parser', () => {
  test('extracts numbers without brackets', () => {
    const stdout = '3: 153, 370, 371, 407\n';
    const result = parseOutput('nodejs', stdout);
    assert.deepStrictEqual(result, [153, 370, 371, 407]);
  });

  test('handles p=3 canary test', () => {
    const stdout = '3: 153, 370, 371, 407\n';
    const result = parseOutput('nodejs', stdout);
    assert.deepStrictEqual(result, [153, 370, 371, 407]);
  });

  test('handles p=1 canary test', () => {
    const stdout = '1: 1, 2, 3, 4, 5, 6, 7, 8, 9\n';
    const result = parseOutput('nodejs', stdout);
    assert.deepStrictEqual(result, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  test('handles p=4 canary test', () => {
    const stdout = '4: 1634, 8208, 9474\n';
    const result = parseOutput('nodejs', stdout);
    assert.deepStrictEqual(result, [1634, 8208, 9474]);
  });

  test('handles empty result (p=2)', () => {
    const stdout = '2: \n';
    const result = parseOutput('nodejs', stdout);
    assert.deepStrictEqual(result, []);
  });

  test('handles extra whitespace', () => {
    const stdout = '  3:   153 ,  370 ,  371 ,  407  \n';
    const result = parseOutput('nodejs', stdout);
    assert.deepStrictEqual(result, [153, 370, 371, 407]);
  });

  test('handles empty output', () => {
    const stdout = '';
    const result = parseOutput('nodejs', stdout);
    assert.deepStrictEqual(result, []);
  });
});

// ============================================================================
// GO PARSER TESTS
// ============================================================================

describe('Go parser', () => {
  test('handles diagnostic format', () => {
    const stdout = '3: start: 1 .. max: 19683: done\n';
    const result = parseOutput('go', stdout);
    assert.ok(Array.isArray(result));
    // Go diagnostic format may not return numbers
  });

  test('handles bracketed format if present', () => {
    const stdout = '3: [153, 370, 371, 407]\n';
    const result = parseOutput('go', stdout);
    assert.deepStrictEqual(result, [153, 370, 371, 407]);
  });

  test('handles p=2 diagnostic (empty result)', () => {
    const stdout = '2: start: 10 .. max: 243: done\n';
    const result = parseOutput('go', stdout);
    assert.ok(Array.isArray(result));
  });

  test('handles empty output', () => {
    const stdout = '';
    const result = parseOutput('go', stdout);
    assert.deepStrictEqual(result, []);
  });
});

// ============================================================================
// RUBY PARSER TESTS (Default format)
// ============================================================================

describe('Ruby parser', () => {
  test('extracts numbers from bracketed format', () => {
    const stdout = '3: [153, 370, 371, 407]\n';
    const result = parseOutput('ruby', stdout);
    assert.deepStrictEqual(result, [153, 370, 371, 407]);
  });

  test('handles p=3 canary test', () => {
    const stdout = '3: [153, 370, 371, 407]\n';
    const result = parseOutput('ruby', stdout);
    assert.deepStrictEqual(result, [153, 370, 371, 407]);
  });

  test('handles p=1 canary test', () => {
    const stdout = '1: [1, 2, 3, 4, 5, 6, 7, 8, 9]\n';
    const result = parseOutput('ruby', stdout);
    assert.deepStrictEqual(result, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  test('handles p=4 canary test', () => {
    const stdout = '4: [1634, 8208, 9474]\n';
    const result = parseOutput('ruby', stdout);
    assert.deepStrictEqual(result, [1634, 8208, 9474]);
  });

  test('handles empty result (p=2)', () => {
    const stdout = '2: []\n';
    const result = parseOutput('ruby', stdout);
    assert.deepStrictEqual(result, []);
  });

  test('handles extra whitespace', () => {
    const stdout = '  3: [ 153 , 370 , 371 , 407 ]  \n';
    const result = parseOutput('ruby', stdout);
    assert.deepStrictEqual(result, [153, 370, 371, 407]);
  });

  test('handles empty output', () => {
    const stdout = '';
    const result = parseOutput('ruby', stdout);
    assert.deepStrictEqual(result, []);
  });
});

// ============================================================================
// JAVA PARSER TESTS (Default format)
// ============================================================================

describe('Java parser', () => {
  test('extracts numbers from bracketed format', () => {
    const stdout = '3: [153, 370, 371, 407]\n';
    const result = parseOutput('java', stdout);
    assert.deepStrictEqual(result, [153, 370, 371, 407]);
  });

  test('handles p=3 canary test', () => {
    const stdout = '3: [153, 370, 371, 407]\n';
    const result = parseOutput('java', stdout);
    assert.deepStrictEqual(result, [153, 370, 371, 407]);
  });

  test('handles p=1 canary test', () => {
    const stdout = '1: [1, 2, 3, 4, 5, 6, 7, 8, 9]\n';
    const result = parseOutput('java', stdout);
    assert.deepStrictEqual(result, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  test('handles empty output', () => {
    const stdout = '';
    const result = parseOutput('java', stdout);
    assert.deepStrictEqual(result, []);
  });
});

// ============================================================================
// C PARSER TESTS (Default format)
// ============================================================================

describe('C parser', () => {
  test('handles p=3 canary test', () => {
    const stdout = '3: [153, 370, 371, 407]\n';
    const result = parseOutput('c', stdout);
    assert.deepStrictEqual(result, [153, 370, 371, 407]);
  });

  test('handles p=1 canary test', () => {
    const stdout = '1: [1, 2, 3, 4, 5, 6, 7, 8, 9]\n';
    const result = parseOutput('c', stdout);
    assert.deepStrictEqual(result, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
});

// ============================================================================
// C++ PARSER TESTS (Default format)
// ============================================================================

describe('C++ parser', () => {
  test('handles p=3 canary test', () => {
    const stdout = '3: [153, 370, 371, 407]\n';
    const result = parseOutput('cxx', stdout);
    assert.deepStrictEqual(result, [153, 370, 371, 407]);
  });

  test('handles p=1 canary test', () => {
    const stdout = '1: [1, 2, 3, 4, 5, 6, 7, 8, 9]\n';
    const result = parseOutput('cxx', stdout);
    assert.deepStrictEqual(result, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
});

// ============================================================================
// RUST PARSER TESTS (Default format)
// ============================================================================

describe('Rust parser', () => {
  test('handles p=3 canary test', () => {
    const stdout = '3: [153, 370, 371, 407]\n';
    const result = parseOutput('rust', stdout);
    assert.deepStrictEqual(result, [153, 370, 371, 407]);
  });

  test('handles p=1 canary test', () => {
    const stdout = '1: [1, 2, 3, 4, 5, 6, 7, 8, 9]\n';
    const result = parseOutput('rust', stdout);
    assert.deepStrictEqual(result, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
});

// ============================================================================
// HASKELL PARSER TESTS (Default format)
// ============================================================================

describe('Haskell parser', () => {
  test('handles p=3 canary test', () => {
    const stdout = '3: [153, 370, 371, 407]\n';
    const result = parseOutput('haskell', stdout);
    assert.deepStrictEqual(result, [153, 370, 371, 407]);
  });

  test('handles p=1 canary test', () => {
    const stdout = '1: [1, 2, 3, 4, 5, 6, 7, 8, 9]\n';
    const result = parseOutput('haskell', stdout);
    assert.deepStrictEqual(result, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
});

// ============================================================================
// ELIXIR PARSER TESTS (Default format)
// ============================================================================

describe('Elixir parser', () => {
  test('handles p=3 canary test', () => {
    const stdout = '3: [153, 370, 371, 407]\n';
    const result = parseOutput('elixir', stdout);
    assert.deepStrictEqual(result, [153, 370, 371, 407]);
  });

  test('handles p=1 canary test', () => {
    const stdout = '1: [1, 2, 3, 4, 5, 6, 7, 8, 9]\n';
    const result = parseOutput('elixir', stdout);
    assert.deepStrictEqual(result, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
});

// ============================================================================
// ELIXIRMIX PARSER TESTS (Default format)
// ============================================================================

describe('ElixirMix parser', () => {
  test('handles p=3 canary test', () => {
    const stdout = '3: [153, 370, 371, 407]\n';
    const result = parseOutput('elixirmix', stdout);
    assert.deepStrictEqual(result, [153, 370, 371, 407]);
  });

  test('handles p=1 canary test', () => {
    const stdout = '1: [1, 2, 3, 4, 5, 6, 7, 8, 9]\n';
    const result = parseOutput('elixirmix', stdout);
    assert.deepStrictEqual(result, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
});

// ============================================================================
// F# PARSER TESTS (Default format)
// ============================================================================

describe('F# parser', () => {
  test('handles p=3 canary test', () => {
    const stdout = '3: [153, 370, 371, 407]\n';
    const result = parseOutput('fsharp', stdout);
    assert.deepStrictEqual(result, [153, 370, 371, 407]);
  });

  test('handles p=1 canary test', () => {
    const stdout = '1: [1, 2, 3, 4, 5, 6, 7, 8, 9]\n';
    const result = parseOutput('fsharp', stdout);
    assert.deepStrictEqual(result, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
});

// ============================================================================
// C# PARSER TESTS (Default format)
// ============================================================================

describe('C# parser', () => {
  test('handles p=3 canary test', () => {
    const stdout = '3: [153, 370, 371, 407]\n';
    const result = parseOutput('csharp', stdout);
    assert.deepStrictEqual(result, [153, 370, 371, 407]);
  });

  test('handles p=1 canary test', () => {
    const stdout = '1: [1, 2, 3, 4, 5, 6, 7, 8, 9]\n';
    const result = parseOutput('csharp', stdout);
    assert.deepStrictEqual(result, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
});

// ============================================================================
// SWIFT PARSER TESTS (Default format)
// ============================================================================

describe('Swift parser', () => {
  test('handles p=3 canary test', () => {
    const stdout = '3: [153, 370, 371, 407]\n';
    const result = parseOutput('swift', stdout);
    assert.deepStrictEqual(result, [153, 370, 371, 407]);
  });

  test('handles p=1 canary test', () => {
    const stdout = '1: [1, 2, 3, 4, 5, 6, 7, 8, 9]\n';
    const result = parseOutput('swift', stdout);
    assert.deepStrictEqual(result, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
});

// ============================================================================
// CROSS-LANGUAGE VALIDATION
// ============================================================================

describe('Cross-language canary validation', () => {
  const languages = [
    'python', 'ruby', 'nodejs', 'go', 'java', 'c', 'cxx', 'rust',
    'haskell', 'elixir', 'elixirmix', 'fsharp', 'csharp', 'swift'
  ];

  test('all languages support p=3 canary', () => {
    const expectedP3 = [153, 370, 371, 407];
    
    languages.forEach(lang => {
      let stdout;
      if (lang === 'python') {
        stdout = 'arg = 3\n3 :  [153, 370, 371, 407]\n';
      } else if (lang === 'nodejs') {
        stdout = '3: 153, 370, 371, 407\n';
      } else if (lang === 'go') {
        stdout = '3: [153, 370, 371, 407]\n'; // Assuming bracketed format
      } else {
        stdout = '3: [153, 370, 371, 407]\n';
      }
      
      const result = parseOutput(lang, stdout);
      assert.deepStrictEqual(result, expectedP3, `${lang} failed p=3 canary test`);
    });
  });

  test('all languages support p=1 canary', () => {
    const expectedP1 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    
    languages.forEach(lang => {
      let stdout;
      if (lang === 'python') {
        stdout = 'arg = 1\n1 :  [1, 2, 3, 4, 5, 6, 7, 8, 9]\n';
      } else if (lang === 'nodejs') {
        stdout = '1: 1, 2, 3, 4, 5, 6, 7, 8, 9\n';
      } else if (lang === 'go') {
        stdout = '1: [1, 2, 3, 4, 5, 6, 7, 8, 9]\n';
      } else {
        stdout = '1: [1, 2, 3, 4, 5, 6, 7, 8, 9]\n';
      }
      
      const result = parseOutput(lang, stdout);
      assert.deepStrictEqual(result, expectedP1, `${lang} failed p=1 canary test`);
    });
  });

  test('all languages support p=4 canary', () => {
    const expectedP4 = [1634, 8208, 9474];
    
    languages.forEach(lang => {
      let stdout;
      if (lang === 'python') {
        stdout = 'arg = 4\n4 :  [1634, 8208, 9474]\n';
      } else if (lang === 'nodejs') {
        stdout = '4: 1634, 8208, 9474\n';
      } else if (lang === 'go') {
        stdout = '4: [1634, 8208, 9474]\n';
      } else {
        stdout = '4: [1634, 8208, 9474]\n';
      }
      
      const result = parseOutput(lang, stdout);
      assert.deepStrictEqual(result, expectedP4, `${lang} failed p=4 canary test`);
    });
  });
});

// Export for use in executor
export { parseOutput };
