// const otplib = require('otplib');
// const secret = 'dhcqd5wx27c567yj';
// console.log(secret.length)
// const token = otplib.authenticator.generate(secret);
// console.log('TOTP:', token);


const otplib = require('otplib');

// Set the step value
otplib.authenticator.options = { step: 30 };

// Secret key
const secret = 'lszxmglnn7vzls5l';

// Generate TOTP
const token = otplib.authenticator.generate(secret);
console.log('TOTP:', token);

// Get the time remaining for the current code
const epoch = Math.floor(Date.now() / 1000);
const step = otplib.authenticator.options.step;
const timeRemaining = step - (epoch % step);

console.log('Time remaining:', timeRemaining, 'seconds');

