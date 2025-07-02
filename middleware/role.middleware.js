const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        const { role } = user;
        if (role == 'user') return res.status(403).json({ err: 'User has no access' });
        req.user = user;
        next();
    });
};
