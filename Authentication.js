import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).send('Access denied');
    }

    jwt.verify(token, 'secretKey', (err, decoded) => {
        if (err) {
            return res.status(403).send('Invalid token');
        }
        req.user = decoded;
        next();
    });
};
