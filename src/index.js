#!/usr/bin/env node

/**
 * Social Media Bot - Interactive Menu
 */

require('dotenv').config();
const readline = require('readline');
const InstagramBot = require('./bots/instagram');
const WhatsAppBot = require('./bots/whatsapp');
const SmartBot = require('./bot');

const igBot = new InstagramBot();
const waBot = new WhatsAppBot();
const smartBot = new SmartBot({ name: 'Assistant' });

// Start the smart bot logic
smartBot.start();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (query) => new Promise(resolve => rl.question(query, resolve));
const clear = () => process.stdout.write('\x1Bc');

async function ensureExit() {
  console.log('\nGoodbye! 👋');
  smartBot.stop();
  rl.close();
  process.exit(0);
}

// --- Instagram Menu ---
async function instagramMenu() {
  while (true) {
    console.log('\n--- 📸 Instagram Automation ---');
    console.log('1. Open Instagram');
    console.log('2. Send Direct Message');
    console.log('3. Open/Send Reel');
    console.log('4. Back to Main Menu');

    const choice = await ask('\nSelect option (1-4): ');

    switch (choice.trim()) {
      case '1':
        await igBot.processCommand('/open');
        break;
      case '2':
        const user = await ask('Enter Username: ');
        const message = await ask('Enter Message: ');
        await igBot.sendMessage(user, message);
        break;
      case '3':
        const category = await ask('Enter Category (e.g. funny, tech): ');
        await igBot.sendReel(category);
        break;
      case '4':
        return;
      default:
        console.log('❌ Invalid option.');
    }
  }
}

// --- WhatsApp Menu ---
async function whatsappMenu() {
  while (true) {
    console.log('\n--- 💬 WhatsApp Automation ---');
    console.log('1. Open WhatsApp Web');
    console.log('2. Send Message (Open Chat)');
    console.log('3. Back to Main Menu');

    const choice = await ask('\nSelect option (1-3): ');

    switch (choice.trim()) {
      case '1':
        await waBot.processCommand('open', []);
        break;
      case '2':
        const num = await ask('Enter Phone Number (e.g. 15551234567): ');
        const msg = await ask('Enter Message: ');
        await waBot.sendDirectMessage(num, msg);
        break;
      case '3':
        return;
      default:
        console.log('❌ Invalid option.');
    }
  }
}

// --- Chat with SmartBot ---
async function chatMenu() {
  console.log('\n--- 🤖 Chat with SmartBot (Type "exit" to back) ---');
  while (true) {
    const input = await ask('\nYou: ');
    if (input.toLowerCase() === 'exit') return;

    const result = smartBot.processMessage('user-cli', input);
    console.log(`Bot: ${result.response}`);
  }
}

// --- Main Menu ---
async function mainMenu() {
  clear();
  console.log('==========================================');
  console.log('  🤖 Social Media Automation Bot');
  console.log('==========================================');

  while (true) {
    console.log('\n--- Main Menu ---');
    console.log('1. Instagram');
    console.log('2. WhatsApp');
    console.log('3. Chat with Bot');
    console.log('4. Exit');

    const choice = await ask('\nSelect Platform (1-4): ');

    switch (choice.trim()) {
      case '1':
        await instagramMenu();
        break;
      case '2':
        await whatsappMenu();
        break;
      case '3':
        await chatMenu();
        break;
      case '4':
        await ensureExit();
        return;
      default:
        console.log('❌ Invalid option. Please select 1-4.');
    }
  }
}

// Handle shutdown
process.on('SIGINT', () => {
  ensureExit();
});

// Start
mainMenu().catch(console.error);
