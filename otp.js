const otplib = require('otplib');
const secret = 'j6rz7vhdfqn52jyk';
const token = otplib.authenticator.generate(secret);
console.log('TOTP:', token);
