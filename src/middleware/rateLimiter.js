import { rateLimit } from 'express-rate-limit';

const LogInLimiter = rateLimit({
    windowMs: 60 * 1000, //1min
    limit: process.env.NODE_ENV === 'test' ? 1000 : 3,
    handler: (req, res, next) => {
        const error = new Error('Too many login requests. Try again later.');
        error.status = 429;
        next(error);
    },
});

export default LogInLimiter;