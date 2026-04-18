const crypto = require('crypto');

const generateBookingReference = () => {
  return `VAC-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
};

module.exports = generateBookingReference;
