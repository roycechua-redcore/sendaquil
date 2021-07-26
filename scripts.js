
/* 
    Scripts for helpful utility functions
*/

var args = process.argv.slice(2);

switch (args[0]) {
    case 'jwt':
        generateJWT();
        break;

    default:
        break;
}

//  Write your utility functions here
function generateJWT() {
    var jwt = require('jsonwebtoken');
    const JWTpayload = {type: 'jwt'};
    console.log('Generated JWT Token:')
    console.log(jwt.sign(JWTpayload, '01F5WZRCGVZDTP57G2XPQRZ0BC', {expiresIn: '1h'}))
}