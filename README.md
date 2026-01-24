# 🤖 Smart Multi-Purpose Bot

A smart automated bot designed to help users perform different tasks automatically. The bot can chat with users, answer questions, give information, and perform actions without human help.

## Features

- **24/7 Availability**: Works continuously without stopping
- **Instant Responses**: Provides fast and accurate replies
- **Multi-User Support**: Handles many users simultaneously
- **Task Automation**: Automates common tasks like calculations, time queries, and searches
- **Session Management**: Maintains context for each user session
- **Multiple Modes**: Support, Info, Task, and General modes

## Use Cases

- Customer support automation
- Automatic message replies
- Information provider
- Task automation assistant
- Smart personal assistant

## Installation

```bash
# Clone the repository
git clone https://github.com/code-zenons/bot.git

# Navigate to the project directory
cd bot

# Install dependencies (if any)
npm install
```

## Usage

### Running the Bot

```bash
npm start
```

### CLI Commands

Once the bot is running, you can use these commands:

| Command | Description |
|---------|-------------|
| `/help` | Show available commands |
| `/status` | Display current bot status |
| `/mode <mode>` | Change bot mode (support, info, task, general) |
| `/quit` | Stop the bot and exit |

### Example Conversations

```
You: hello
🤖 Hello! I'm SmartBot. How can I help you today?

You: what time is it
🤖 Current date and time: 1/24/2026, 10:30:00 AM

You: calculate 15 + 27
🤖 The result is: 42

You: help
🤖 I can help you with:
   - Answering questions
   - Providing information
   - Automated task assistance
   - Customer support queries

You: goodbye
🤖 Goodbye! Have a great day!
```

## Programmatic Usage

You can also use the SmartBot class directly in your code:

```javascript
const SmartBot = require('./src/bot');

// Create a bot instance
const bot = new SmartBot({
  name: 'MyBot',
  mode: 'support'
});

// Start the bot
bot.start();

// Process messages
const response = bot.processMessage('user123', 'Hello!');
console.log(response.response);

// Get bot status
const status = bot.getStatus();
console.log(status);

// Stop the bot
bot.stop();
```

## Running Tests

```bash
npm test
```

## Project Structure

```
bot/
├── src/
│   ├── bot.js      # Core bot logic
│   └── index.js    # CLI entry point
├── test/
│   └── bot.test.js # Test suite
├── package.json
├── LICENSE
└── README.md
```

## API Reference

### SmartBot Class

#### Constructor Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `name` | string | 'SmartBot' | Bot's display name |
| `mode` | string | 'general' | Operating mode |

#### Methods

| Method | Description |
|--------|-------------|
| `start()` | Start the bot |
| `stop()` | Stop the bot |
| `processMessage(userId, message)` | Process a user message and get a response |
| `getStatus()` | Get current bot status |
| `setMode(mode)` | Change the bot's operating mode |
| `getSession(userId)` | Get or create a user session |

## Supported Commands

The bot understands and responds to:

- **Greetings**: hello, hi, hey, good morning, etc.
- **Farewells**: bye, goodbye, see you, etc.
- **Help requests**: help, assist, support, how to, etc.
- **Thanks**: thank you, thanks, appreciate, etc.
- **Time queries**: what time, current date, etc.
- **Calculations**: calculate 5 + 3, compute 10 * 2, etc.
- **Search requests**: search for, find, look up, etc.
- **Questions**: what, why, how, when, where, who, etc.

## License

MIT License - See [LICENSE](LICENSE) for details.
