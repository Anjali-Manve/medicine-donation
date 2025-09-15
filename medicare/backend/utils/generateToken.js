import jwt from "jsonwebtoken";


export default function generateToken(userId) {
return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
expiresIn: "7d", // access token valid for 7 days
});
}