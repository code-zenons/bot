/**
 * Smart Bot Test Suite
 * 
 * Tests for the SmartBot class functionality
 */

const SmartBot = require('../src/bot');

// Test utilities
let testsPassed = 0;
let testsFailed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    testsPassed++;
  } catch (error) {
    console.log(`❌ ${name}`);
    console.log(`   Error: ${error.message}`);
    testsFailed++;
  }
}

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`Expected ${expected} but got ${actual}`);
      }
    },
    toEqual(expected) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
      }
    },
    toContain(substring) {
      if (typeof actual !== 'string' || !actual.includes(substring)) {
        throw new Error(`Expected "${actual}" to contain "${substring}"`);
      }
    },
    toBeTruthy() {
      if (!actual) {
        throw new Error(`Expected truthy value but got ${actual}`);
      }
    },
    toBeFalsy() {
      if (actual) {
        throw new Error(`Expected falsy value but got ${actual}`);
      }
    },
    toBeInstanceOf(constructor) {
      if (!(actual instanceof constructor)) {
        throw new Error(`Expected instance of ${constructor.name}`);
      }
    }
  };
}

console.log('\n==========================================');
console.log('  🧪 SmartBot Test Suite');
console.log('==========================================\n');

// Test: Bot initialization
test('Bot initializes with default options', () => {
  const bot = new SmartBot();
  expect(bot.name).toBe('SmartBot');
  expect(bot.mode).toBe('general');
  expect(bot.isRunning).toBe(false);
});

test('Bot initializes with custom options', () => {
  const bot = new SmartBot({ name: 'TestBot', mode: 'support' });
  expect(bot.name).toBe('TestBot');
  expect(bot.mode).toBe('support');
});

// Test: Bot start/stop
test('Bot starts correctly', () => {
  const bot = new SmartBot();
  const result = bot.start();
  expect(result.status).toBe('started');
  expect(bot.isRunning).toBe(true);
});

test('Bot stops correctly', () => {
  const bot = new SmartBot();
  bot.start();
  const result = bot.stop();
  expect(result.status).toBe('stopped');
  expect(bot.isRunning).toBe(false);
});

// Test: Message processing
test('Bot rejects messages when not running', () => {
  const bot = new SmartBot();
  const result = bot.processMessage('user1', 'hello');
  expect(result.error).toContain('not running');
});

test('Bot rejects invalid messages', () => {
  const bot = new SmartBot();
  bot.start();
  const result = bot.processMessage('user1', null);
  expect(result.error).toContain('Invalid message');
});

test('Bot processes valid messages', () => {
  const bot = new SmartBot();
  bot.start();
  const result = bot.processMessage('user1', 'hello');
  expect(result.response).toBeTruthy();
  expect(result.userId).toBe('user1');
});

// Test: Greeting responses
test('Bot responds to greetings', () => {
  const bot = new SmartBot();
  bot.start();
  const result = bot.processMessage('user1', 'hello');
  expect(result.response).toBeTruthy();
  // Response should be one of the greeting responses
  const validGreetings = ['Hello', 'Hi', 'Hey', 'Welcome'];
  const hasGreeting = validGreetings.some(g => result.response.includes(g));
  if (!hasGreeting) {
    throw new Error('Expected greeting response');
  }
});

// Test: Farewell responses
test('Bot responds to farewells', () => {
  const bot = new SmartBot();
  bot.start();
  const result = bot.processMessage('user1', 'goodbye');
  expect(result.response).toBeTruthy();
});

// Test: Help responses
test('Bot responds to help requests', () => {
  const bot = new SmartBot();
  bot.start();
  const result = bot.processMessage('user1', 'help me');
  expect(result.response).toBeTruthy();
  // Response should contain helpful content
  const helpIndicators = ['help', 'assist', 'questions', 'support'];
  const hasHelp = helpIndicators.some(h => result.response.toLowerCase().includes(h));
  if (!hasHelp) {
    throw new Error('Expected help-related response');
  }
});

// Test: Thanks responses
test('Bot responds to thanks', () => {
  const bot = new SmartBot();
  bot.start();
  const result = bot.processMessage('user1', 'thank you');
  expect(result.response).toBeTruthy();
});

// Test: Task automation - Time
test('Bot provides current time', () => {
  const bot = new SmartBot();
  bot.start();
  const result = bot.processMessage('user1', 'what time is it');
  expect(result.response).toContain('Current date and time');
});

// Test: Task automation - Calculator
test('Bot calculates math expressions', () => {
  const bot = new SmartBot();
  bot.start();
  const result = bot.processMessage('user1', 'calculate 5 + 3');
  expect(result.response).toContain('8');
});

test('Bot handles division', () => {
  const bot = new SmartBot();
  bot.start();
  const result = bot.processMessage('user1', 'calculate 10 / 2');
  expect(result.response).toContain('5');
});

test('Bot handles multiplication', () => {
  const bot = new SmartBot();
  bot.start();
  const result = bot.processMessage('user1', 'calculate 4 * 3');
  expect(result.response).toContain('12');
});

test('Bot handles subtraction', () => {
  const bot = new SmartBot();
  bot.start();
  const result = bot.processMessage('user1', 'calculate 10 - 7');
  expect(result.response).toContain('3');
});

// Test: Session management
test('Bot creates and maintains user sessions', () => {
  const bot = new SmartBot();
  bot.start();
  bot.processMessage('user1', 'hello');
  bot.processMessage('user1', 'how are you');
  const session = bot.getSession('user1');
  expect(session.messageCount).toBe(2);
});

test('Bot handles multiple users', () => {
  const bot = new SmartBot();
  bot.start();
  bot.processMessage('user1', 'hello');
  bot.processMessage('user2', 'hi');
  const status = bot.getStatus();
  expect(status.activeSessions).toBe(2);
});

// Test: Mode changes
test('Bot changes mode correctly', () => {
  const bot = new SmartBot();
  const result = bot.setMode('support');
  expect(result.status).toBe('mode_changed');
  expect(result.mode).toBe('support');
});

test('Bot rejects invalid modes', () => {
  const bot = new SmartBot();
  const result = bot.setMode('invalid');
  expect(result.error).toBeTruthy();
});

// Test: Status reporting
test('Bot reports status correctly', () => {
  const bot = new SmartBot({ name: 'TestBot' });
  bot.start();
  bot.processMessage('user1', 'hello');
  const status = bot.getStatus();
  expect(status.name).toBe('TestBot');
  expect(status.isRunning).toBe(true);
  expect(status.totalResponses).toBe(1);
});

// Test: Question handling
test('Bot responds to questions about itself', () => {
  const bot = new SmartBot();
  bot.start();
  const result = bot.processMessage('user1', 'who are you');
  expect(result.response).toContain('SmartBot');
});

// Test: Search request handling
test('Bot handles search requests', () => {
  const bot = new SmartBot();
  bot.start();
  const result = bot.processMessage('user1', 'search for weather');
  expect(result.response).toContain('search');
});

// Test: Unknown input handling
test('Bot handles unknown input gracefully', () => {
  const bot = new SmartBot();
  bot.start();
  const result = bot.processMessage('user1', 'xyzabc random gibberish');
  expect(result.response).toBeTruthy();
});

// Print summary
console.log('\n==========================================');
console.log(`  Tests passed: ${testsPassed}`);
console.log(`  Tests failed: ${testsFailed}`);
console.log('==========================================\n');

// Exit with appropriate code
process.exit(testsFailed > 0 ? 1 : 0);
