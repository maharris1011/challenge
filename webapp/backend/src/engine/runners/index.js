import { join } from 'path';

const CHALLENGE_ROOT = process.env.CHALLENGE_ROOT || '/Users/markharris/Code/challenge/3-sum-of-digits-to-power';

export const python = {
  name: 'Python',
  dir: join(CHALLENGE_ROOT, 'python'),
  getCommand(power) {
    return {
      cmd: 'python3',
      args: ['digitsum.py', '-p', String(power)],
      cwd: join(CHALLENGE_ROOT, 'python')
    };
  }
};

export const ruby = {
  name: 'Ruby',
  dir: join(CHALLENGE_ROOT, 'ruby'),
  getCommand(power) {
    return {
      cmd: 'ruby',
      args: ['digitsum.rb', String(power)],
      cwd: join(CHALLENGE_ROOT, 'ruby')
    };
  }
};

export const java = {
  name: 'Java',
  dir: join(CHALLENGE_ROOT, 'java'),
  needsBuild: true,
  getBuildCommand() {
    return {
      cmd: 'make',
      args: ['build'],
      cwd: join(CHALLENGE_ROOT, 'java')
    };
  },
  getCommand(power) {
    return {
      cmd: 'java',
      args: ['Sumdigits', String(power)],
      cwd: join(CHALLENGE_ROOT, 'java')
    };
  }
};

export const nodejs = {
  name: 'Node.js',
  dir: join(CHALLENGE_ROOT, 'nodejs'),
  getCommand(power) {
    return {
      cmd: 'node',
      args: ['digitsum.js', String(power)],
      cwd: join(CHALLENGE_ROOT, 'nodejs')
    };
  }
};

export const go = {
  name: 'Go',
  dir: join(CHALLENGE_ROOT, 'go'),
  getCommand(power) {
    return {
      cmd: './digitsum',
      args: ['--power', String(power)],
      cwd: join(CHALLENGE_ROOT, 'go')
    };
  }
};

export const c = {
  name: 'C',
  dir: join(CHALLENGE_ROOT, 'C'),
  getCommand(power) {
    return {
      cmd: './digitsum',
      args: [String(power)],
      cwd: join(CHALLENGE_ROOT, 'C')
    };
  }
};

export const cxx = {
  name: 'C++',
  dir: join(CHALLENGE_ROOT, 'CXX'),
  getCommand(power) {
    return {
      cmd: './digitsum',
      args: [String(power)],
      cwd: join(CHALLENGE_ROOT, 'CXX')
    };
  }
};

export const csharp = {
  name: 'C#',
  dir: join(CHALLENGE_ROOT, 'csharp/cs-sum-of-digits-to-power'),
  getCommand(power) {
    return {
      cmd: join(CHALLENGE_ROOT, 'csharp/cs-sum-of-digits-to-power/bin/Release/net10.0/osx-arm64/publish/cs-sum-of-digits-to-power'),
      args: [String(power)],
      cwd: join(CHALLENGE_ROOT, 'csharp/cs-sum-of-digits-to-power')
    };
  }
};

export const fsharp = {
  name: 'F#',
  dir: join(CHALLENGE_ROOT, 'fsharp'),
  getCommand(power) {
    return {
      cmd: join(CHALLENGE_ROOT, 'fsharp/bin/Release/net10.0/osx-arm64/publish/fs-sum-of-digits-to-power'),
      args: [String(power)],
      cwd: join(CHALLENGE_ROOT, 'fsharp')
    };
  }
};

export const haskell = {
  name: 'Haskell',
  dir: join(CHALLENGE_ROOT, 'haskell'),
  needsBuild: true,
  getBuildCommand() {
    return {
      cmd: 'cabal',
      args: ['build'],
      cwd: join(CHALLENGE_ROOT, 'haskell')
    };
  },
  getCommand(power) {
    return {
      cmd: join(CHALLENGE_ROOT, 'haskell/dist-newstyle/build/aarch64-osx/ghc-9.4.8/haskell-sum-of-digits-0.1.0.0/x/haskell-sum-of-digits-exe/build/haskell-sum-of-digits-exe/haskell-sum-of-digits-exe'),
      args: [String(power)],
      cwd: join(CHALLENGE_ROOT, 'haskell')
    };
  }
};

export const elixir = {
  name: 'Elixir',
  dir: join(CHALLENGE_ROOT, 'elixir'),
  getCommand(power) {
    return {
      cmd: 'elixir',
      args: ['sum-digits.exs', String(power)],
      cwd: join(CHALLENGE_ROOT, 'elixir')
    };
  }
};

export const elixirmix = {
  name: 'Elixir Mix',
  dir: join(CHALLENGE_ROOT, 'elixirmix'),
  needsBuild: true,
  getBuildCommand() {
    return {
      cmd: 'mix',
      args: ['compile'],
      cwd: join(CHALLENGE_ROOT, 'elixirmix')
    };
  },
  getCommand(power) {
    return {
      cmd: './sum_digits',
      args: ['--power', String(power)],
      cwd: join(CHALLENGE_ROOT, 'elixirmix')
    };
  }
};

export const rust = {
  name: 'Rust',
  dir: join(CHALLENGE_ROOT, 'rust'),
  getCommand(power) {
    return {
      cmd: join(CHALLENGE_ROOT, 'rust/target/release/sumdigits'),
      args: ['--power', String(power)],
      cwd: join(CHALLENGE_ROOT, 'rust')
    };
  }
};

export const swift = {
  name: 'Swift',
  dir: join(CHALLENGE_ROOT, 'Swift/sum-of-digits-to-power/sum-of-digits-to-power'),
  getCommand(power) {
    return {
      cmd: join(CHALLENGE_ROOT, 'Swift/sum-of-digits-to-power/sum-of-digits-to-power/.build/release/sum-of-digits-to-power'),
      args: [String(power)],
      cwd: join(CHALLENGE_ROOT, 'Swift/sum-of-digits-to-power/sum-of-digits-to-power')
    };
  }
};

export const LANGUAGES = {
  python,
  ruby,
  java,
  nodejs,
  go,
  c,
  cxx,
  csharp,
  fsharp,
  haskell,
  elixir,
  elixirmix,
  rust,
  swift
};

export function getRunner(language) {
  return LANGUAGES[language] || null;
}

export default LANGUAGES;
