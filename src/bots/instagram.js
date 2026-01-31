const BaseBot = require('./BaseBot');

class InstagramBot extends BaseBot {
  constructor() {
    super('InstagramBot');
  }

  /**
   * Open the Instagram Application (or Safari if App is not preferred)
   */
  async openInstagram() {
    const script = `
      tell application "Safari"
        activate
        open location "https://www.instagram.com"
      end tell
    `;
    this.log('Opening Instagram in Safari...');
    return await this.runAppleScript(script);
  }

  /**
   * Send a Direct Message
   */
  async sendMessage(username, message) {
    this.log(`Sending message to ${username}: ${message}`);

    // Using ig.me shortlink which redirects to the correct direct thread
    // Note: The 'message' part cannot be pre-filled via URL on Instagram Web easily
    const script = `
      tell application "Safari"
        activate
        open location "https://ig.me/m/" & "${username}"
      end tell
    `;
    return await this.runAppleScript(script);
  }

  /**
   * Send a Reel (Simulated)
   * @param {string} category - The category of reel to send
   */
  async sendReel(category) {
    this.log(`Finding reel for category: ${category}`);
    // Open the explore page for the category/tag
    const tag = category || 'reels';
    const script = `
      tell application "Safari"
        activate
        open location "https://www.instagram.com/explore/tags/" & "${tag}"
      end tell
    `;
    return await this.runAppleScript(script);
  }

  /**
   * Handle incoming CLI commands
   */
  async processCommand(command) {
    const parts = command.split(' ');
    const action = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (action) {
      case '/open':
        await this.openInstagram();
        return "Instagram opened.";

      case '/dm':
        if (args.length < 2) return "Usage: /dm <username> <message>";
        const user = args[0];
        const msg = args.slice(1).join(' ');
        await this.sendMessage(user, msg);
        return `Opened DM for ${user}.`;

      case '/reel':
        const category = args[0] || 'trending';
        await this.sendReel(category);
        return `Opened Reels for category: ${category}`;

      case '/help':
        return `
Available Commands:
  /open            - Open Instagram
  /dm <user> <msg> - Send a message (opens DM)
  /reel <category> - Open Reels/Tags for a category
  /help            - Show this help
        `;

      default:
        return "Unknown command. Type /help for options.";
    }
  }
}

module.exports = InstagramBot;
