const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure users file exists
if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]));
    console.log('[Users] Created persistent users.json file');
}

function getUsers() {
    try {
        const data = fs.readFileSync(USERS_FILE);
        return JSON.parse(data);
    } catch (error) {
        console.error('[Users] Error reading users file:', error);
        return [];
    }
}

function saveUsers(users) {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
        console.log('[Users] Users saved to disk');
    } catch (error) {
        console.error('[Users] Error saving users file:', error);
    }
}

async function createUser(username, password) {
    console.log(`[Users] Creating user: ${username}`);
    const users = getUsers();

    if (users.find(u => u.username === username)) {
        throw new Error('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
        id: Date.now().toString(),
        username,
        password: hashedPassword,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
}

function findUser(username) {
    const users = getUsers();
    const user = users.find(u => u.username === username);
    console.log(`[Users] Find user '${username}': ${user ? 'Found' : 'Not Found'}`);
    return user;
}

async function validatePassword(user, password) {
    return bcrypt.compare(password, user.password);
}

module.exports = {
    createUser,
    findUser,
    validatePassword
};
