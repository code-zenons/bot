const BaseBot = require('./BaseBot');

class WhatsAppBot extends BaseBot {
    constructor() {
        super('WhatsAppBot');
    }

    /**
     * Open WhatsApp Application
     */
    async openWhatsApp() {
        this.log('Opening WhatsApp...');
        // Try to open the desktop app directly, fall back to web if needed implementation
        // For now we use the URL scheme which MacOS handles
        const script = `
      tell application "Safari"
        activate
        open location "https://web.whatsapp.com"
      end tell
    `;
        return await this.runAppleScript(script);
    }

    /**
     * Open chat for a specific number with optional message
     * @param {string} number - The phone number (international format without +)
     * @param {string} message - Optional message to pre-fill
     */
    async sendDirectMessage(number, message = '') {
        this.log(`Opening chat for ${number}...`);

        // Clean number (remove +, spaces, dashes)
        const cleanNumber = number.replace(/[^\d]/g, '');
        const encodedMessage = encodeURIComponent(message);
        const url = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

        const script = `
      tell application "Safari"
        activate
        open location "${url}"
      end tell
    `;
        return await this.runAppleScript(script);
    }

    /**
     * Process WhatsApp commands
     */
    async processCommand(command, args) {
        switch (command) {
            case 'open':
                await this.openWhatsApp();
                return "WhatsApp Web opened.";

            case 'dm':
            case 'send':
                if (args.length < 1) return "Usage: /wa dm <number> [message]";
                const number = args[0];
                const msg = args.slice(1).join(' ');
                await this.sendDirectMessage(number, msg);
                return `Opened chat for ${number}`;

            case 'help':
                return `
WhatsApp Commands:
  /wa open              - Open WhatsApp Web
  /wa dm <num> <msg>    - Open chat with number and pre-filled message
        `;

            default:
                return "Unknown WhatsApp command.";
        }
    }
}

module.exports = WhatsAppBot;
