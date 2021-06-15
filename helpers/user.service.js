//const config = require('config.json');
//const jwt = require('jsonwebtoken');
//const bcrypt = require('bcryptjs');
//const db = require('_helpers/db');
//const crypto = require("crypto");
const { generarJWT } = require("../helpers/generar_jwt");
const { generateRefreshToken } = require("../helpers/helper_refresh_token");
const { RefreshToken, User } = require("../models");

module.exports = {
    refreshToken,
    revokeToken,
    getRefreshTokens
};

/*async function authenticate({ username, password, ipAddress }) {
    const user = await db.User.findOne({ username });

    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
        throw 'Username or password is incorrect';
    }

    // authentication successful so generate jwt and refresh tokens
    //const jwtToken = generateJwtToken(user);
    const jwtToken = await generarJWT(user.id);
    const refreshToken = generateRefreshToken(user, ipAddress);

    // save refresh token
    await refreshToken.save();

    // return basic details and tokens
    return { 
        ...basicDetails(user),
        jwtToken,
        refreshToken: refreshToken.token
    };
}*/

async function refreshToken({ token, ipAddress }) {
    const refreshToken = await getRefreshToken(token);
    const { user } = refreshToken;

    // replace old refresh token with a new one and save
    const newRefreshToken = generateRefreshToken(user, ipAddress);
    refreshToken.revoked = Date.now();
    refreshToken.revokedByIp = ipAddress;
    refreshToken.replacedByToken = newRefreshToken.token;
    await refreshToken.save();
    await newRefreshToken.save();

    // generate new jwt
    const jwtToken = await generarJWT(user.id);
    //const jwtToken = generateJwtToken(user);

    // return basic details and tokens
    return { 
        user,
        token:jwtToken,
        refreshToken: newRefreshToken
    };
}

async function revokeToken({ token, ipAddress }) {
    const refreshToken = await getRefreshToken(token);

    // revoke token and save
    refreshToken.revoked = Date.now();
    refreshToken.revokedByIp = ipAddress;
    await refreshToken.save();
}


async function getRefreshTokens(userId) {
    // check that user exists
    await getUser(userId);

    // return refresh tokens for user
    const refreshTokens = await db.RefreshToken.find({ user: userId }).populate({path:'user',populate:{path:"rol"}});
    return refreshTokens;
}

async function getUser(id) {
    const user = await User.findById(id).populate('rol');
    if (!user) throw 'User not found';
    return user;
}

// helper functions

async function getRefreshToken(token) {
    const refreshToken = await RefreshToken.findOne({ token }).populate({path:'user',populate:{path:"rol"}});
    if (!refreshToken || !refreshToken.isActive) throw 'Invalid token';
    return refreshToken;
}

//function generateJwtToken(user) {
//    // create a jwt token containing the user id that expires in 15 minutes
//    return jwt.sign({ sub: user.id, id: user.id }, config.secret, { expiresIn: '15m' });
//}

//function basicDetails(user) {
//    const { id, firstName, lastName, username, role } = user;
//    return { id, firstName, lastName, username, role };
//}
