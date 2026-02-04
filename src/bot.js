/**
 * SmartBot Class
 * Core logic for the general purpose bot
 */
class SmartBot {
  constructor(options = {}) {
    this.name = options.name || 'SmartBot';
    this.mode = options.mode || 'general'; // 'support', 'info', 'task', 'general'
    this.isRunning = false;
    this.userSessions = new Map();
    this.responseCount = 0;

    // Knowledge base for different use cases
    this.knowledgeBase = {
      greetings: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
      farewells: ['bye', 'goodbye', 'see you', 'later', 'farewell'],
      help: ['help', 'assist', 'support', 'how to', 'what can you do'],
      thanks: ['thank', 'thanks', 'appreciate', 'grateful'],
      questions: ['what', 'why', 'how', 'when', 'where', 'who', 'which', 'can you', 'could you'],
      reels: ['reel', 'reels', 'video', 'short video', 'send reel']
    };

    // Pre-defined responses for common queries
    this.responses = {
      greeting: [
        `Hello! I'm ${this.name}. How can I help you today?`,
        `Hi there! Welcome! What can I assist you with?`,
        `Hey! I'm here to help. What do you need?`
      ],
      farewell: [
        'Goodbye! Have a great day!',
        'See you later! Feel free to come back anytime.',
        'Bye! It was nice helping you!'
      ],
      help: [
        `I can help you with:\n- Answering questions\n- Providing information\n- Automated task assistance\n- Customer support queries\n\nJust ask me anything!`,
        `Here's what I can do:\n- Chat and answer your questions\n- Provide instant information\n- Help automate tasks\n- Support you 24/7\n\nHow can I assist?`
      ],
      thanks: [
        "You're welcome! Happy to help!",
        "No problem! Let me know if you need anything else.",
        "Glad I could assist! Is there anything more I can help with?"
      ],
      reels: [
        "🎬 Here's a reel for you! [In a full implementation, this would send an actual video/reel link]",
        "🎬 Check out this reel! [Reel content would be sent here]",
        "🎬 I've got a great reel for you! [Video content would appear here]"
      ],
      unknown: [
        "I'm not sure I understand. Could you rephrase that?",
        "I'd like to help! Can you provide more details?",
        "Let me think about that... Could you be more specific?"
      ]
    };

    // Task automation patterns
    this.taskPatterns = {
      remind: /remind(?:er)?|schedule|set alarm/i,
      calculate: /calculate|compute|what is \d+/i,
      search: /search|find|look up|lookup/i,
      time: /time|date|what day|current time/i,
      weather: /weather|temperature|forecast/i,
      reel: /reel|reels|send reel|show reel|video/i
    };
  }

  /**
   * Start the bot
   */
  start() {
    this.isRunning = true;
    console.log(`[${this.name}] Bot started in ${this.mode} mode.`);
    console.log(`[${this.name}] Ready to receive messages...`);
    return { status: 'started', mode: this.mode };
  }

  /**
   * Stop the bot
   */
  stop() {
    this.isRunning = false;
    console.log(`[${this.name}] Bot stopped.`);
    return { status: 'stopped', totalResponses: this.responseCount };
  }

  /**
   * Create or get a user session
   */
  getSession(userId) {
    if (!this.userSessions.has(userId)) {
      this.userSessions.set(userId, {
        userId,
        startTime: new Date(),
        messageCount: 0,
        context: []
      });
    }
    return this.userSessions.get(userId);
  }

  /**
   * Process user input and generate response
   */
  processMessage(userId, message) {
    if (!this.isRunning) {
      return { error: 'Bot is not running. Please start the bot first.' };
    }

    if (!message || typeof message !== 'string') {
      return { error: 'Invalid message format. Please provide a valid string.' };
    }

    const session = this.getSession(userId);
    session.messageCount++;
    session.context.push({ role: 'user', content: message, timestamp: new Date() });

    const response = this.generateResponse(message.toLowerCase().trim());

    session.context.push({ role: 'bot', content: response, timestamp: new Date() });
    this.responseCount++;

    return {
      userId,
      message,
      response,
      timestamp: new Date().toISOString(),
      sessionMessages: session.messageCount
    };
  }

  /**
   * Send a proactive message to a user
   */
  sendMessage(userId, content) {
    if (!this.isRunning) {
      return { error: 'Bot is not running.' };
    }

    const session = this.getSession(userId);
    // Add bot message to context
    session.context.push({ role: 'bot', content, timestamp: new Date() });
    this.responseCount++;

    console.log(`[${this.name}] Sending message to ${userId}: ${content}`);

    return {
      success: true,
      userId,
      message: content,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Check if input matches a category of keywords
   */
  matchesCategory(input, category) {
    return this.knowledgeBase[category].some(keyword => input.includes(keyword));
  }

  /**
   * Get a random response for a category
   */
  getRandomResponse(category) {
    const responses = this.responses[category];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  /**
   * Generate response based on input analysis
   */
  generateResponse(input) {
    // Check for greetings
    if (this.matchesCategory(input, 'greetings')) {
      return this.getRandomResponse('greeting');
    }
    if (this.matchesCategory(input, 'farewells')) {
      return this.getRandomResponse('farewell');
    }
    if (this.matchesCategory(input, 'help')) {
      return this.getRandomResponse('help');
    }
    if (this.matchesCategory(input, 'thanks')) {
      return this.getRandomResponse('thanks');
    }

    // Check for tasks
    if (this.taskPatterns.calculate.test(input)) {
      // Extract numbers and operator logic is handled in safeCalculate, 
      // but here we just need to pass the expression.
      // Let's assume the user says "calculate 5 + 5"
      const match = input.match(/[\d\s\+\-\*\/]+/);
      if (match) {
        try {
          return "Result: " + this.safeCalculate(match[0]);
        } catch (e) {
          return "I couldn't calculate that. Format: number operator number";
        }
      }
    }

    if (this.taskPatterns.reel.test(input)) {
      return this.handleReelRequest(input);
    }

    // Default
    return this.getRandomResponse('unknown');
  }

  /**
   * Handle reel requests with category detection
   */
  handleReelRequest(input) {
    // Check for reel categories
    if (input.includes('funny') || input.includes('comedy') || input.includes('humor')) {
      return "🎬 Here's a funny reel for you! [In a full implementation, this would send an actual funny video/reel link]";
    }

    if (input.includes('educational') || input.includes('learning') || input.includes('tutorial')) {
      return "🎬 Here's an educational reel for you! [In a full implementation, this would send an actual educational video/reel link]";
    }

    if (input.includes('motivational') || input.includes('inspiring') || input.includes('motivation')) {
      return "🎬 Here's a motivational reel to inspire you! [In a full implementation, this would send an actual motivational video/reel link]";
    }

    // Default reel response
    return this.getRandomResponse('reels');
  }

  /**
   * Safe calculation of simple math expressions
   */
  safeCalculate(expression) {
    // Only allow digits, operators, and spaces - no parentheses or dots for safety
    if (!/^[\d\s\+\-\*\/]+$/.test(expression)) {
      throw new Error('Invalid expression');
    }

    // Parse and calculate manually for safety
    const parts = expression.split(/(\+|\-|\*|\/)/).map(p => p.trim()).filter(p => p);
    // This split might be too simple if there are multiple operators. 
    // But for the scope of this file, I'll keep the logic I saw in the original thought process 
    // or try to support basic 2 operand calc as seen in the snippet.

    // The snippet expected 3 parts: num1, op, num2
    if (parts.length !== 3) {
      throw new Error('Invalid expression format - expected format: number operator number');
    }

    const num1 = parseFloat(parts[0]);
    const operator = parts[1];
    const num2 = parseFloat(parts[2]);

    if (isNaN(num1) || isNaN(num2)) {
      throw new Error('Invalid numbers in expression');
    }

    switch (operator) {
      case '+': return num1 + num2;
      case '-': return num1 - num2;
      case '*': return num1 * num2;
      case '/': return num2 !== 0 ? num1 / num2 : 'Cannot divide by zero';
      default: throw new Error('Invalid operator');
    }
  }
}

module.exports = SmartBot;
