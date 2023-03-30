const jwt = require("jsonwebtoken");
const secret=process.env.JWT_SECRET
const generateRefreshToken = (id) => {
    return jwt.sign({ id },`${secret}`, { expiresIn: "3d" });
};

module.exports = { generateRefreshToken };