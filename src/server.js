const express = require('express');
const session = require('express-session');
const path = require('path');
const SmartBot = require('./bot');
const users = require('./users');

const app = express();
const port = 3000;

// Initialize bot
const bot = new SmartBot({
    name: 'WebBot',
    mode: 'general'
});

bot.start();

// Middleware
app.use(express.json());
app.use(session({
    secret: 'your-secret-key-change-this',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Auth Middleware
const requireAuth = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        // If API request, return 401
        if (req.path.startsWith('/api/') && req.path !== '/api/login' && req.path !== '/api/signup') {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        // If page request, redirect to login
        if (!req.path.startsWith('/api/') && !req.path.includes('login.html') && !req.path.includes('signup.html') && !req.path.includes('features.html') && !req.path.includes('style.css')) {
            return res.redirect('/login.html');
        }
        next();
    }
};

// Public routes (style.css needs to be accessible)
app.use('/style.css', express.static(path.join(__dirname, '../public/style.css')));
app.use('/login.html', express.static(path.join(__dirname, '../public/login.html')));
app.use('/signup.html', express.static(path.join(__dirname, '../public/signup.html')));

// API Routes - Auth
app.post('/api/signup', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
    }

    try {
        const user = await users.createUser(username, password);
        req.session.userId = user.id;
        req.session.username = user.username;
        res.json({ success: true, user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
    }

    const user = users.findUser(username);
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await users.validatePassword(user, password);
    if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.userId = user.id;
    req.session.username = user.username;
    res.json({ success: true, user: { id: user.id, username: user.username } });
});

app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

app.get('/api/me', (req, res) => {
    if (req.session.userId) {
        res.json({ authenticated: true, username: req.session.username });
    } else {
        res.json({ authenticated: false });
    }
});

// Protected Routes
app.use(requireAuth);

// Serve other static files (index.html, etc.) only after auth check
app.use(express.static(path.join(__dirname, '../public')));

// Protect Send Message API
app.post('/api/send-message', (req, res) => {
    const { targetId, message } = req.body;

    if (!targetId || !message) {
        return res.status(400).json({ error: 'Missing targetId or message' });
    }

    const result = bot.sendMessage(targetId, message);

    if (result.error) {
        return res.status(500).json(result);
    }

    res.json(result);
});

// Start server
app.listen(port, () => {
    console.log(`Web interface running at http://localhost:${port}`);
});
