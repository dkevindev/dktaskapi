import { Usuario, Filho } from '../models/model.js';
import { generateToken } from '../config.js';
import fs from 'fs/promises';
import path from 'path';
import jwt from 'jsonwebtoken';
import { sequelize } from '../db.js';



const userController = {
  createUser: async (req, res) => {
    try {
      const { email, senha } = req.body;
      // Verifica se o e-mail e a senha foram fornecidos
      if (!email || !senha) {
        return res.status(400).json('E-mail e senha são obrigatórios.');
      }

      // Verifica se o e-mail já existe no banco de dados

      const usuarioExistente = await Usuario.findOne({
        where: { email }
      });

      if (usuarioExistente) {
        return res.status(409).json('E-mail já cadastrado. Escolha outro e-mail.');
      }

      // Cria o usuário se as verificações passarem
      await Usuario.create(req.body);
      res.status(201).json('Usuário criado com sucesso!!');
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      res.status(500).send('Erro interno ao criar usuário.');
    }
  },
  createChildren: async (req, res) => {

    try {
      const { usuario, senha } = req.body;
      // Verifica se o e-mail e a senha foram fornecidos
      if (!usuario || !senha) {
        return res.status(400).json('E-mail e senha são obrigatórios.');
      }


      const usuarioExistente = await Filho.findOne({
        where: { usuario }
      });

      if (usuarioExistente) {
        const usuarioExistente = await Filho.findAll({
          where: { usuario_id: req.user.usuario_id }
        });
        const filename = `profile-${usuarioExistente.length + 1}.png`;
        const filePath = path.join('./', 'uploads', filename);

        const fileExists = await fs.access(filePath)
          .then(() => true)
          .catch(() => false);

        if (fileExists) {
          await fs.unlink(filePath);
        }
        return res.status(409).json('Usuario já cadastrado. Escolha outro  nome de usuario.');
      }

      // Cria o usuário se as verificações passarem
      await Filho.create({ ...req.body, usuario_id: req.user.usuario_id });
      res.status(201).json('Conta para crianca criada com sucesso!!');
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      res.status(500).send('Erro interno ao criar usuário.');
    }
  },


  loginUser: async (req, res) => {
    try {
      if (req.body.usuario && req.body.senha) {
        let { usuario, senha } = req.body;

        let user = await Usuario.findOne({
          where: { usuario, senha }
        });

        if (user) {
          // Atualize o contador do usuário
          await Usuario.update(
            { contador: sequelize.literal('contador + 1') },
            { where: { usuario_id: user.usuario_id } }
          );

          const token = generateToken({ usuario_id: user.usuario_id });
          res.json({ status: true, token, admin: true });
          return;  // Importante: interromper a execução após enviar a resposta
        }

        let crianca = await Filho.findOne({
          where: { usuario, senha }
        });

        if (crianca) {
          const token = generateToken({ filho_id: crianca.filho_id });
          res.json({ status: true, token, admin: false });
          return;  // Importante: interromper a execução após enviar a resposta
        };




      }

      res.json({ status: false });
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      res.status(500).json('Erro interno ao realizar login.');
    }
  },



  getChildrens: async (req, res) => {
    try {
      const response = await Filho.findAll({
        where: { usuario_id: req.user.usuario_id }
      });
      res.status(201).json(response);
    } catch (error) {
      console.error('Erro ao localizar crianças:', error);
      res.status(500).send('Erro interno ao localizar as crianças.');
    }
  },

  getChildrensid: async (req, res) => {
    try {

      const response = await Filho.findOne({
        where: { filho_id: req.body.filho_id }
      });
      res.status(201).json(response);
    } catch (error) {
      console.error('Erro ao localizar crianças:', error);
      res.status(500).send('Erro interno ao localizar as crianças.');
    }
  },


  userLogado: async (req, res) => {
    try {
      res.status(201).json(req.user)
    } catch (error) {
      res.status(201).json('Deu Erro')
    }
  },
  verificarToken: (req, res) => {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ valido: false });
    }

    try {
      // Verifique se o token é válido
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // O token é válido
      return res.json({ valido: true });
    } catch (error) {
      // O token não é válido
      return res.json({ valido: false });
    }
  },
  updateProfile: async (req, res) => {
    try {
      console.log('entrei aqui')
      const usuario = await Usuario.update(
        { profile: req.body.profile },
        {
          where: {
            usuario_id: req.user.usuario_id
          }
        }
      )
      return res.status(201).json(usuario)
    } catch {

    }
  },
  updateProfileChildren: async (req, res) => {
    try {
      console.log('entrei aqui2')
      const usuario = await Filho.update(
        { profile: req.body.profile },
        {
          where: {
            filho_id: req.body.filho_id
          }
        }
      )
      return res.status(201).json(usuario)
    } catch {

    }
  },
};

export default userController;