import passport from 'passport';
import 'dotenv/config';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { Usuario, Filho } from './models/model.js';
import jwt from 'jsonwebtoken';




export const notAuthorizedJson = { status: 401, message: 'Não autorizado' }

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}

passport.use(new JWTStrategy(options, async (payload, done) => {

    if (payload.usuario_id !== undefined) {
        const user = await Usuario.findByPk(payload.usuario_id);
        if (user) {
            return done(null, user);
        } else {
            return done(notAuthorizedJson, false);
        }
    } else if (payload.filho_id !== undefined) {
        const user = await Filho.findByPk(payload.filho_id);
    if (user) {
        return done(null, user);
    } else {
        return done(notAuthorizedJson, false);
    }
    }

}));


export const generateToken = (data) => {
    return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '24h' });
}


export const authMid = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (err) {
            console.error('Erro durante autenticação:', err);
            return res.status(500).json({ error: 'Erro interno durante autenticação' });
        }

        if (!user) {
            return res.status(401).json({ error: 'Não autorizado' });
        }
        req.user = user;
        return next();
    })(req, res, next);
};

export default passport;