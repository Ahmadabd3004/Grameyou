const bcrypt = require('bcryptjs');

let password = '123'
var salt = bcrypt.genSaltSync(10);
console.log(password)
var hash = bcrypt.hashSync(password, salt);

console.log(hash)
// Load hash from your password DB.
console.log(bcrypt.compareSync('123', hash)) // true
console.log(bcrypt.compareSync('1234', hash)) // true
bcrypt.compareSync("not_bacon", hash); // false