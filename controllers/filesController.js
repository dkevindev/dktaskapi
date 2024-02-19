import Jimp from 'jimp';
import path from 'path';
import { Filho } from '../models/model.js';


export const filesController = {
    uploadAvatar: async (req, res) => {
        
        try {
            const image = await Jimp.read(req.file.buffer);
            await image.resize(Jimp.AUTO, 120);
            const usuarioExistente = await Filho.findAll({ 
                where: {usuario_id: req.user.usuario_id}
               });
            const filename = `profile-${usuarioExistente.length + 1}.png`;
            const filePath = path.join('./', 'uploads', filename);
            await image.writeAsync(filePath);
            const imageUrl = `/${filename}`;
            res.json({ imageUrl });
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao processar a imagem.' });
          }
      },
      uploadAvatarUser: async (req, res) => {
        
        try {
            const image = await Jimp.read(req.file.buffer);
            await image.resize(Jimp.AUTO, 120);
            const filename = `profile-${req.user.usuario_id}.png`;
            const filePath = path.join('./', 'uploads', filename);
            await image.writeAsync(filePath);
            const imageUrl = `/${filename}`;
            res.json({ imageUrl });
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao processar a imagem.' });
          }
      }
};