import { Bonus, Desafio, PunicaoModelo, Falta, Tarefa } from '../models/model.js';
import { Op } from 'sequelize';

export const taskController = {
    createTarefa: async (req, res) => {
        try {
            await Tarefa.create({ ...req.body, usuario_id: req.user.usuario_id });
            res.status(201).json('Tarefa criada com sucesso!')
        } catch (error) {
            console.error('error:', error)
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    },
    getTarefas: async (req, res) => {
        try {
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0); // Configura a hora para 00:00:00:00 para pegar a data de hoje

            if (req.user) {
            const tarefas = await Tarefa.findAll({
                where: {
                    filho_id: req.user.filho_id,
                    data: {
                        [Op.gte]: hoje, // Retorna tarefas com datas a partir de hoje
                        [Op.lt]: new Date(hoje.getTime() + 24 * 60 * 60 * 1000), // Até o final do dia
                    },
                },
            });
        
            res.status(201).json(tarefas);
        }

            
        } catch (error) {
            res.status(500).send('Erro ao obter tarefas');
        }
    }
    , getRegistroTarefas: async (req, res) => {
        const usuarioId = req.user.usuario_id;

        try {
            const tarefasNaoConcluidas = await Tarefa.findAll({
                where: {
                    usuario_id: usuarioId,
                    concluido: true,
                },
            });


            return res.json(tarefasNaoConcluidas);
        } catch (error) {
            console.error('Erro ao consultar tarefas:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    },
    tarefasConfirm: async (req, res) => {
        try {
            console.log(req.params)
            const response = await Tarefa.update(
                {
                    concluido: true
                },
                {
                    where: {
                        tarefa_id: req.params.tarefa_id
                    }
                }
            );
            console.log(response)
            res.status(201).json('Tarefa enviada para análise!')

        } catch (error) {
            console.log(error)
            res.status(201).json('Erro interno!')
        }
    },
    newBonus: async (req, res) => {
        try {
            await Bonus.create(req.body)
            res.status(201).json('Bonus ativado com sucesso!')
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao processar a imagem.' });
        }
    },
    getBonus: async (req, res) => {
        try {
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);
            const response = await Bonus.findOne({
                where: {
                    filho_id: req.user.filho_id,
                    data: {
                        [Op.gte]: hoje,
                        [Op.lt]: new Date(hoje.getTime() + 24 * 60 * 60 * 1000),
                    }
                }
            })
            res.status(201).json(response)
        } catch (error) {
            res.status(501).json('Erro ao carregar bonus')
        }
    },
    newDesafio: async (req, res) => {
        try {
            await Desafio.create({ ...req.body, usuario_id: req.user.usuario_id })
            res.status(201).json('Desafio ativado com sucesso!')
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao cadastrar desafios.' });
        }
    },
    getDesafios: async (req, res) => {
        try {
            const desafios = await Desafio.findAll({
                where: {
                    usuario_id: req.user.usuario_id,
                    cancelado: false
                }
            })
            return res.status(201).json(desafios)
        } catch (error) {
            res.status(500).json({ error: 'Erro ao carregar desafios.' });
        }
    },
    getDesafiosFilho: async (req, res) => {
        try {
            const desafios = await Desafio.findAll({
                where: {
                    filho_id: req.user.filho_id,
                    cancelado: false,
                    pagar: false
                }
            })
            return res.status(201).json(desafios)
        } catch (error) {
            res.status(500).json({ error: 'Erro ao carregar desafios.' });
        }
    },
    cancelarDesafio: async (req, res) => {
        try {
            const { desafio_id, motivo } = req.body
            await Desafio.update(
                { cancelado: true, motivo },
                {
                    where: {
                        desafio_id
                    }
                }
            )
            res.status(201).json('Desafio cancelado com sucesso!')
        } catch (error) {
            res.status(500).json({ error: 'Erro ao cancelar desafio.' });
        }
    }
    ,
    newPunicaoModel: async (req, res) => {
        try {
            await PunicaoModelo.create({ ...req.body, usuario_id: req.user.usuario_id })
            res.status(201).json('Punicão definida com sucesso!')
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao criar modelo de Punição' });
        }
    },
    getFaltas: async (req, res) => {
        try {
            const faltasUser = await Falta.findAll({
                where: {
                    usuario_id: req.user.usuario_id
                }
            })
            res.status(201).json(faltasUser)
        } catch (error) {
            res.status(500).json({ error: 'Erro ao gerar lista' });
        }
    },
    getPunicoesModel: async (req, res) => {
        try {
            const PunicaoModeloUser = await PunicaoModelo.findAll({
                where: {
                    usuario_id: req.user.usuario_id
                }
            })
            res.status(201).json(PunicaoModeloUser)
        } catch (error) {
            res.status(500).json({ error: 'Erro ao gerar lista' });
        }
    },
    newFaltas: async (req, res) => {
        try {
            const filhoId = req.body.filho_id;
            const valor = req.body.valor.replace(',', '.');

            // Verifica se já existe uma falta para o filho_id
            const faltaExistente = await Falta.findOne({
                where: {
                    filho_id: filhoId
                }
            });

            if (faltaExistente) {
                // Se existe, atualiza a falta existente
                await Falta.update(
                    { valor },
                    {
                        where: {
                            id: faltaExistente.id
                        }
                    }
                );
                res.status(201).json('Falta atualizada com sucesso');
            } else {
                // Se não existe, cria uma nova falta
                await Falta.create({ ...req.body, usuario_id: req.user.usuario_id });
                res.status(201).json('Falta adicionada com sucesso');
            }

        } catch (error) {
            res.status(500).json({ error: 'Erro ao adicionar' });
        }
    },
    faltasUpdate: async (req, res) => {
        try {
            await Falta.update(
                { status: req.body.status },
                {
                    where: {
                        filho_id: req.body.id
                    }
                }
            );
            res.status(201).json('Falta atualizada com sucesso');
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar status' });
        }
    },
    puncModelUpdate: async (req, res) => {
        const valor = req.body.valor.replace(',', '.');
        try {
            await PunicaoModelo.update(
                { valor },
                {
                    where: {
                        id: req.body.id
                    }
                }
            );
            res.status(201).json('Modelo atualizado com sucesso');
        } catch (error) {

            res.status(500).json({ error: 'Erro ao atualizar status' });
        }
    },
    puncModelDelete: async (req, res) => {
        const { id } = req.params;

        try {
            const punicao = await PunicaoModelo.findByPk(id);

            if (!punicao) {
                return res.status(404).json({ error: 'Punição não encontrada' });
            }

            await punicao.destroy();
            return res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar status' });
        }
    },
}