
import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import axios from 'axios';


var key;
const cognito_key_url = 'https://cognito-idp.' + process.env.AWSREGION + ".amazonaws.com/" + process.env.AWSPOOLID + "/.well-known/jwks.json";
axios.get(cognito_key_url).then((res) => {
    key = res.data;
});


var parseJwt = function (key, token) {
    var pem = jwkToPem(key);
    let user_id = null;
    let email, googleId = null;
    jwt.verify(token, pem, { algorithms: ['RS256'] }, function (err, decodedToken) {
        if (err == null) {
            if (decodedToken.email !== undefined)
                email = decodedToken.email;
            (decodedToken.identities !== undefined) ? googleId = decodedToken.identities[0].providerName + "_" + decodedToken.identities[0].userId : googleId = decodedToken.username;
            user_id = { email: email, googleId: googleId };
        } else {
            console.log(err);
            return null;
        }
    });
    return user_id;
};

export function validate_token(token) {
    try {
        let kid = JSON.parse(Buffer.from(token.split('.')[0], 'base64')).kid;
        var user_id = null;
        key.keys.forEach(element => {
            if (element.kid == kid)
                user_id = parseJwt(element, token);
        });
        return user_id;
    } catch (e) {
        return null; // error in the above string (in this case, yes)!
    }
}