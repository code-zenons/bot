const { exec } = require('child_process');

/**
 * BaseBot Class
 * Provides common functionality for all bots
 */
class BaseBot {
    constructor(name) {
        this.name = name || 'BaseBot';
    }

    /**
     * Execute AppleScript command
     * @param {string} script - The AppleScript code to execute
     * @returns {Promise<{success: boolean, output?: string, error?: string}>}
     */
    async runAppleScript(script) {
        return new Promise((resolve, reject) => {
            exec(`osascript -e '${script}'`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`${this.name}: AppleScript Execution Error:`, stderr);
                    resolve({ success: false, error: stderr });
                    return;
                }
                resolve({ success: true, output: stdout.trim() });
            });
        });
    }

    /**
     * Log a message with the bot name
     * @param {string} message 
     */
    log(message) {
        console.log(`[${this.name}] ${message}`);
    }
}

module.exports = BaseBot;
