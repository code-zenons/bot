const BaseBot = require('./BaseBot');

class InstagramBot extends BaseBot {
  constructor() {
    super('InstagramBot');
  }

  /**
   * Open the Instagram Application (or Safari if App is not preferred)
   */
  async runScriptWithCheck(script, actionName) {
    try {
      const result = await this.runAppleScript(script);
      if (!result || !result.success) {
        const errorMsg = result ? result.error : 'Unknown error';
        this.log(`Error during ${actionName}: ${errorMsg}`);
        return { success: false, message: `Failed to ${actionName}. Error: ${errorMsg}` };
      }
      return { success: true, message: `${actionName} successful.` };
    } catch (e) {
      this.log(`Exception during ${actionName}: ${e.message}`);
      return { success: false, message: `Critical error during ${actionName}: ${e.message}` };
    }
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
    return await this.runScriptWithCheck(script, 'Open Instagram');
  }

  /**
   * Send a Direct Message
   */
  async sendMessage(username, message) {
    if (!username || !message) {
      return { success: false, message: "Username and message are required." };
    }

    this.log(`Sending message to ${username}: ${message}`);

    // Using ig.me shortlink which redirects to the correct direct thread
    const script = `
      tell application "Safari"
        activate
        open location "https://ig.me/m/" & "${username}"
      end tell
    `;
    return await this.runScriptWithCheck(script, `Send DM to ${username}`);
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
    return await this.runScriptWithCheck(script, `Open Reels for ${tag}`);
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
        const header = await this.openInstagram();
        return header.message;

      case '/dm':
        if (args.length < 2) return "Usage: /dm <username> <message>";
        const user = args[0];
        const msg = args.slice(1).join(' ');
        const dmResult = await this.sendMessage(user, msg);
        return dmResult.message;

      case '/reel':
        const category = args[0] || 'trending';
        const reelResult = await this.sendReel(category);
        return reelResult.message;

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
