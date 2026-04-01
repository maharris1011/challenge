import { spawn } from 'child_process';
import { getRunner } from './runners/index.js';
import { parseOutput } from '../parsers/index.js';
import os from 'os';

const TIMEOUT_MS = parseInt(process.env.EXECUTION_TIMEOUT_MS || '60000', 10);

export async function execute(language, power) {
  const startTime = Date.now();
  
  const runner = getRunner(language);
  if (!runner) {
    return {
      language,
      power,
      status: 'error',
      stdout: '',
      stderr: `Unknown language: ${language}`,
      exitCode: -1,
      executionMs: 0,
      numbersFound: [],
      platform: os.platform()
    };
  }
  
  // Build if needed
  if (runner.needsBuild && runner.getBuildCommand) {
    try {
      await runCommand(runner.getBuildCommand());
    } catch (buildError) {
      return {
        language,
        power,
        status: 'error',
        stdout: '',
        stderr: `Build failed: ${buildError.message}`,
        exitCode: -1,
        executionMs: Date.now() - startTime,
        numbersFound: [],
        platform: os.platform()
      };
    }
  }
  
  // Execute
  try {
    const cmd = runner.getCommand(power);
    const result = await runCommand(cmd, TIMEOUT_MS);
    const executionMs = Date.now() - startTime;
    
    const numbersFound = parseOutput(language, result.stdout);
    
    return {
      language,
      power,
      status: result.exitCode === 0 ? 'success' : 'error',
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode: result.exitCode,
      executionMs,
      numbersFound,
      platform: os.platform()
    };
  } catch (error) {
    const executionMs = Date.now() - startTime;
    
    if (error.code === 'TIMEOUT') {
      return {
        language,
        power,
        status: 'timeout',
        stdout: error.stdout || '',
        stderr: error.stderr || '',
        exitCode: -1,
        executionMs,
        numbersFound: [],
        platform: os.platform()
      };
    }
    
    return {
      language,
      power,
      status: 'error',
      stdout: error.stdout || '',
      stderr: error.stderr || error.message,
      exitCode: error.exitCode || -1,
      executionMs,
      numbersFound: [],
      platform: os.platform()
    };
  }
}

function runCommand(cmd, timeout = 30000) {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd.cmd, cmd.args, {
      cwd: cmd.cwd,
      env: process.env,
      timeout: 0 // We handle timeout manually
    });
    
    let stdout = '';
    let stderr = '';
    let timedOut = false;
    
    const timeoutHandle = setTimeout(() => {
      timedOut = true;
      proc.kill('SIGTERM');
      
      setTimeout(() => {
        if (!proc.killed) {
          proc.kill('SIGKILL');
        }
      }, 5000);
    }, timeout);
    
    proc.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    proc.on('error', (error) => {
      clearTimeout(timeoutHandle);
      reject({
        code: 'EXEC_ERROR',
        message: error.message,
        stdout,
        stderr,
        exitCode: -1
      });
    });
    
    proc.on('close', (code) => {
      clearTimeout(timeoutHandle);
      
      if (timedOut) {
        reject({
          code: 'TIMEOUT',
          message: `Command timed out after ${timeout}ms`,
          stdout,
          stderr,
          exitCode: -1
        });
      } else {
        resolve({
          stdout,
          stderr,
          exitCode: code || 0
        });
      }
    });
  });
}

export default { execute };
