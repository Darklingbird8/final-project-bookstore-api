import { signUp, logIn } from '../services/authService.js';

export async function signUpHandler(req, res, next) {
    try {
        const { email, password } = req.body;
        const newUser = await signUp(email, password);
        res.status(201).json({ message: `New user created with an id of ${newUser.id}` });
    } catch (error) {
        next(error);
    }
}

export async function logInHandler(req, res, next) {
    try {
        const { email, password } = req.body;
        const accessToken = await logIn(email, password);
        res.status(200).json({ accessToken });
    } catch (error) {
        next(error);
    }
}