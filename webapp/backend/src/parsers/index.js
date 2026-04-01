export function parseOutput(language, stdout) {
  const parsers = {
    python: parsePython,
    ruby: parseRuby,
    nodejs: parseNodeJS,
    go: parseGo,
    java: parseJava,
    c: parseDefault,
    cxx: parseDefault,
    csharp: parseCSharp,
    fsharp: parseFSharp,
    haskell: parseDefault,
    elixir: parseDefault,
    elixirmix: parseDefault,
    rust: parseDefault,
    swift: parseDefault
  };
  
  const parser = parsers[language] || parseDefault;
  return parser(stdout);
}

function parsePython(stdout) {
  // Python output: "arg =  3\n3 :  [153, 370, 371, 407]"
  const lines = stdout.trim().split('\n');
  for (let i = lines.length - 1; i >= 0; i--) {
    const match = lines[i].match(/\[([0-9,\s]+)\]/);
    if (match) {
      return match[1].split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    }
  }
  return [];
}

function parseRuby(stdout) {
  // Ruby output: "3: [153, 370, 371, 407]"
  const match = stdout.match(/\[([0-9,\s]+)\]/);
  if (match) {
    return match[1].split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
  }
  return [];
}

function parseNodeJS(stdout) {
  // Node.js output: "3: 153, 370, 371, 407" (no brackets)
  const match = stdout.match(/:\s*([0-9,\s]+)/);
  if (match) {
    return match[1].split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
  }
  return [];
}

function parseGo(stdout) {
  // Go output: "3: start: 10 .. max: 2916: 153, 370, 371, 407, done"
  const match = stdout.match(/max:\s*\d+:\s*([0-9,\s]+),\s*done/);
  if (match) {
    return match[1].split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
  }
  return [];
}

function parseJava(stdout) {
  // Java output: "Narcissistic Number\n2916: 3: \n153, 370, 371, 407,"
  const lines = stdout.trim().split('\n');
  for (let i = lines.length - 1; i >= 0; i--) {
    const nums = lines[i].match(/\d+/g);
    if (nums && nums.length > 1) {
      const candidates = nums.map(n => parseInt(n));
      // Filter out likely metadata (small numbers < 10 or large numbers > 10000)
      const results = candidates.filter(n => n >= 10);
      if (results.length > 0) {
        return results;
      }
    }
  }
  return [];
}

function parseCSharp(stdout) {
  return parseDefault(stdout);
}

function parseFSharp(stdout) {
  // F# output: "[153L; 370L; 371L; 407L]"
  const match = stdout.match(/\[([0-9L;\s]+)\]/);
  if (match) {
    return match[1].split(';').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
  }
  return [];
}

function parseDefault(stdout) {
  // Try bracketed list first
  const bracketMatch = stdout.match(/\[([0-9,\s]+)\]/);
  if (bracketMatch) {
    return bracketMatch[1].split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
  }
  
  // Try comma-separated numbers after colon
  const colonMatch = stdout.match(/:\s*([0-9,\s]+)/);
  if (colonMatch) {
    return colonMatch[1].split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
  }
  
  // Last resort: extract all multi-digit numbers
  const numbers = stdout.match(/\b\d{2,}\b/g);
  if (numbers) {
    return numbers.map(n => parseInt(n)).filter(n => n >= 10 && n < 100000);
  }
  
  return [];
}

export default parseOutput;
