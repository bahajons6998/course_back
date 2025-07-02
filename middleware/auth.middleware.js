const jwt = require('jsonwebtoken');
const { prisma } = require('../prisma/prisma');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'There is not token' });

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    const { email } = user;
    const usercheck = await prisma.user.findFirst({ where: { email } });
    console.log("usercheck=", usercheck);
    if (!usercheck) return res.status(401).json({ message: 'There is no user in DB' });

    if (err) return res.status(401).json({ message: 'Wrong Token' });
    req.user = user;
    next();
  });
};
