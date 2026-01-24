/**
 * Smart Multi-Purpose Bot
 * 
 * A smart automated bot designed to help users perform different tasks automatically.
 * Uses pattern matching and keyword analysis to understand user input and provide
 * accurate responses.
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
      questions: ['what', 'why', 'how', 'when', 'where', 'who', 'which', 'can you', 'could you']
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
      weather: /weather|temperature|forecast/i
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
   * Generate response based on input analysis
   */
  generateResponse(input) {
    // Check for greetings
    if (this.matchesCategory(input, 'greetings')) {
      return this.getRandomResponse('greeting');
    }

    // Check for farewells
    if (this.matchesCategory(input, 'farewells')) {
      return this.getRandomResponse('farewell');
    }

    // Check for help requests
    if (this.matchesCategory(input, 'help')) {
      return this.getRandomResponse('help');
    }

    // Check for thanks
    if (this.matchesCategory(input, 'thanks')) {
      return this.getRandomResponse('thanks');
    }

    // Check for task automation requests
    const taskResponse = this.handleTaskRequest(input);
    if (taskResponse) {
      return taskResponse;
    }

    // Check for questions
    if (this.matchesCategory(input, 'questions')) {
      return this.handleQuestion(input);
    }

    // Default response
    return this.getRandomResponse('unknown');
  }

  /**
   * Check if input matches a knowledge category
   */
  matchesCategory(input, category) {
    const keywords = this.knowledgeBase[category] || [];
    return keywords.some(keyword => input.includes(keyword));
  }

  /**
   * Get a random response from a category
   */
  getRandomResponse(category) {
    const responses = this.responses[category] || this.responses.unknown;
    return responses[Math.floor(Math.random() * responses.length)];
  }

  /**
   * Handle task automation requests
   */
  handleTaskRequest(input) {
    // Time/Date request
    if (this.taskPatterns.time.test(input)) {
      const now = new Date();
      return `Current date and time: ${now.toLocaleString()}`;
    }

    // Calculator request
    if (this.taskPatterns.calculate.test(input)) {
      const mathMatch = input.match(/\d+\s*[\+\-\*\/]\s*\d+/);
      if (mathMatch) {
        try {
          // Safe evaluation of simple math expressions
          const result = this.safeCalculate(mathMatch[0]);
          return `The result is: ${result}`;
        } catch {
          return "I couldn't calculate that. Please provide a valid expression like '5 + 3'.";
        }
      }
      return "Please provide a calculation, for example: 'calculate 5 + 3'";
    }

    // Reminder request
    if (this.taskPatterns.remind.test(input)) {
      return "I've noted your reminder request. In a full implementation, I would set up a reminder for you!";
    }

    // Search request
    if (this.taskPatterns.search.test(input)) {
      const searchTerm = input.replace(/search|find|look up|lookup|for|about/gi, '').trim();
      if (searchTerm) {
        return `I would search for "${searchTerm}" for you. In a full implementation, this would query a search API!`;
      }
      return "What would you like me to search for?";
    }

    // Weather request
    if (this.taskPatterns.weather.test(input)) {
      return "In a full implementation, I would fetch the current weather for you. Please integrate a weather API for this feature!";
    }

    return null;
  }

  /**
   * Safe calculation of simple math expressions
   */
  safeCalculate(expression) {
    // Only allow digits, operators, spaces, and parentheses
    if (!/^[\d\s\+\-\*\/\(\)\.]+$/.test(expression)) {
      throw new Error('Invalid expression');
    }
    
    // Parse and calculate manually for safety
    const parts = expression.split(/(\+|\-|\*|\/)/).map(p => p.trim()).filter(p => p);
    if (parts.length === 3) {
      const num1 = parseFloat(parts[0]);
      const operator = parts[1];
      const num2 = parseFloat(parts[2]);
      
      switch (operator) {
        case '+': return num1 + num2;
        case '-': return num1 - num2;
        case '*': return num1 * num2;
        case '/': return num2 !== 0 ? num1 / num2 : 'Cannot divide by zero';
        default: throw new Error('Invalid operator');
      }
    }
    throw new Error('Invalid expression format');
  }

  /**
   * Handle question-type inputs
   */
  handleQuestion(input) {
    // About the bot
    if (input.includes('you') || input.includes('your name') || input.includes('who are')) {
      return `I'm ${this.name}, a smart automated bot designed to help you with various tasks. I can answer questions, provide information, and assist with automation!`;
    }

    // Capabilities question
    if (input.includes('can you') || input.includes('what can')) {
      return this.getRandomResponse('help');
    }

    // Generic question handling
    return `That's an interesting question! I'd be happy to help you find the answer. Could you provide more specific details about what you're looking for?`;
  }

  /**
   * Get bot status
   */
  getStatus() {
    return {
      name: this.name,
      mode: this.mode,
      isRunning: this.isRunning,
      activeSessions: this.userSessions.size,
      totalResponses: this.responseCount
    };
  }

  /**
   * Set bot mode
   */
  setMode(mode) {
    const validModes = ['support', 'info', 'task', 'general'];
    if (!validModes.includes(mode)) {
      return { error: `Invalid mode. Choose from: ${validModes.join(', ')}` };
    }
    this.mode = mode;
    return { status: 'mode_changed', mode: this.mode };
  }
}

module.exports = SmartBot;
