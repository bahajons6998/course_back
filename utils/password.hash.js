const bcrypt = require('bcryptjs');

exports.hashPassword = async (plain) => await bcrypt.hash(plain, 10);
exports.comparePassword = async (plain, hash) => await bcrypt.compare(plain, hash);
