const crypto = require("crypto");
const { RefreshToken } = require("../models");


function generateRefreshToken(user, ipAddress) {
    // create a refresh token that expires in 7 days
    return new RefreshToken({
        user: user.id,
        token: randomTokenString(),
        expires: new Date(Date.now() + 4*60*60*1000),
        createdByIp: ipAddress
    });
}

function setTokenCookie(res, token)
{
    // create http only cookie with refresh token that expires in 7 days
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 4*60*60*1000)
    };
    res.cookie('refreshToken', token, cookieOptions);
}

function randomTokenString() {
    return crypto.randomBytes(40).toString('hex');
}

module.exports = {
    generateRefreshToken,
    setTokenCookie
}