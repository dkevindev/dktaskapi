import Express from "express";
import 'dotenv/config';
import routes from './routes.js';
import cors from 'cors';
import passport from 'passport';
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);




const app = Express();
const PORT = process.env.PORT;
app.use(cors());
app.use(Express.json());
app.use(Express.static(path.join(__dirname, 'uploads')));


app.use(passport.initialize())
app.use(routes);


app.listen(PORT, () => {
    console.log('Servidor iniciado com sucesso!')
});