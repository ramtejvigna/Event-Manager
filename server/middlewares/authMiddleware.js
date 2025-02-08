import jwt from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'event_manager';

const authenticateToken = (req, res, next) => {
    const authHeader = req.header("Authorization")
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) return res.status(401).json({ message: 'Access denied' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        console.log(err);
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    })
}

export default authenticateToken;