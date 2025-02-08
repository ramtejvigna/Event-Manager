import User from "../models/User.js"
import { generateToken } from "../services/jwtService.js"
import { hashPassword, comparePassword } from "../services/bcryptService.js"

export const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const hashedPassword = await hashPassword(password);

        const user = new User({ email, password: hashedPassword, name });
        await user.save();

        const token = generateToken(user._id);
        res.status(201).json({ token, user: user });
    } catch (error) {
        res.status(500).json({ message: "Error registering user" })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await comparePassword(password, user.password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user._id);
        res.json({ jwTtoken: token, user: { id: user._id, email: user.email, name: user.name } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};