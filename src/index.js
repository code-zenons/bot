#!/usr/bin/env node

/**
 * Smart Multi-Purpose Bot - Main Entry Point
 * 
 * This is the main entry point for running the smart bot.
 * It provides a command-line interface for interacting with the bot.
 */

const readline = require('readline');
const crypto = require('crypto');
const SmartBot = require('./bot');

// Initialize the bot
const bot = new SmartBot({
  name: 'SmartBot',
  mode: 'general'
});

// Start the bot
bot.start();

// Create readline interface for CLI interaction
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n==========================================');
console.log('  🤖 Smart Multi-Purpose Bot');
console.log('==========================================');
console.log('  Type your message to chat with the bot.');
console.log('  Commands:');
console.log('    /help    - Show available commands');
console.log('    /status  - Show bot status');
console.log('    /mode    - Change bot mode');
console.log('    /quit    - Exit the bot');
console.log('==========================================\n');

// Generate a unique user ID for this session using crypto
const userId = crypto.randomUUID();

/**
 * Handle special commands
 */
function handleCommand(command) {
  const parts = command.slice(1).split(' ');
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  switch (cmd) {
    case 'help':
      console.log('\n📚 Available Commands:');
      console.log('  /help            - Show this help message');
      console.log('  /status          - Show current bot status');
      console.log('  /mode <mode>     - Change mode (support, info, task, general)');
      console.log('  /quit or /exit   - Stop the bot and exit');
      console.log('\n💡 Tips:');
      console.log('  - Ask any question to get an answer');
      console.log('  - Say "help" to see what the bot can do');
      console.log('  - Try "calculate 5 + 3" for math');
      console.log('  - Try "what time is it" for current time\n');
      break;

    case 'status':
      const status = bot.getStatus();
      console.log('\n📊 Bot Status:');
      console.log(`  Name: ${status.name}`);
      console.log(`  Mode: ${status.mode}`);
      console.log(`  Running: ${status.isRunning ? 'Yes' : 'No'}`);
      console.log(`  Active Sessions: ${status.activeSessions}`);
      console.log(`  Total Responses: ${status.totalResponses}\n`);
      break;

    case 'mode':
      if (args.length === 0) {
        console.log('\n⚠️  Please specify a mode: support, info, task, general');
        console.log('  Usage: /mode <mode>\n');
      } else {
        const result = bot.setMode(args[0]);
        if (result.error) {
          console.log(`\n⚠️  ${result.error}\n`);
        } else {
          console.log(`\n✅ Mode changed to: ${result.mode}\n`);
        }
      }
      break;

    case 'quit':
    case 'exit':
      console.log('\n👋 Shutting down...');
      const stopResult = bot.stop();
      console.log(`📊 Total responses given: ${stopResult.totalResponses}`);
      console.log('Goodbye!\n');
      rl.close();
      process.exit(0);

    default:
      console.log(`\n⚠️  Unknown command: /${cmd}`);
      console.log('  Type /help to see available commands.\n');
  }
}

/**
 * Process user input
 */
function processInput(input) {
  const trimmedInput = input.trim();

  if (!trimmedInput) {
    return;
  }

  // Handle commands
  if (trimmedInput.startsWith('/')) {
    handleCommand(trimmedInput);
    return;
  }

  // Process message through bot
  const result = bot.processMessage(userId, trimmedInput);

  if (result.error) {
    console.log(`\n⚠️  ${result.error}\n`);
  } else {
    console.log(`\n🤖 ${result.response}\n`);
  }
}

/**
 * Prompt loop
 */
function prompt() {
  rl.question('You: ', (input) => {
    processInput(input);
    prompt();
  });
}

// Start the prompt loop
prompt();

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Received interrupt signal. Shutting down...');
  bot.stop();
  rl.close();
  process.exit(0);
});
