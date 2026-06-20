// backend/src/utils/helpers.js
const bcrypt = require('bcryptjs');

exports.hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

exports.comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

exports.generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

exports.formatResponse = (success, data, message) => {
  return { success, data, message };
};