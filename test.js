let unixTime = 1718735685; // example Unix timestamp
let date = new Date(unixTime * 1000); // multiply by 1000 to convert to milliseconds

let day = date.getDate();
let month = date.getMonth() + 1; // getMonth() returns month from 0 to 11
let year = date.getFullYear();

day = day < 10 ? '0' + day : day;
month = month < 10 ? '0' + month : month;

let formattedDate = month + '/' + day + '/' + year;

console.log(formattedDate); // outputs the date as mm/dd/yyyy


