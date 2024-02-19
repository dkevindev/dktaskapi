import { Tarefa, Financa, Saque } from '../models/model.js';
import { sequelize } from '../db.js';

export const fincController = {
    pagamentopTarefa: async (req, res) => {
        try {
            const pay = req.body.pay
            const valor = req.body.valor.replace(',', '.');
            const tarefa = await Tarefa.update(
                {
                    valor: (valor * pay),
                    status: true,
                    motivo: req.body.descricao,
                    concluido: false
                },
                {
                    where: {
                        tarefa_id: req.body.tarefa_id
                    }
                }
            )
    
            res.status(201).json('valor atualizado com sucesso');
        } catch (error) {
            res.status(500).json('Error!!')
        }
    },
    consultarSaldo: async (req, res) => {
        try {
            const usuario_id = req.user.usuario_id;
        
            const result = await sequelize.query(`
              SELECT usuario_id, filho_id, nome_filho, profile, saldo
              FROM crianca_saldo
              WHERE usuario_id = ${usuario_id};
            `, { type: sequelize.QueryTypes.SELECT });
        
            res.json(result);
          } catch (error) {
          console.error('Erro ao obter saldos das crianças:', error);
          res.status(500).json({ error: 'Erro interno do servidor' });
        }
      },
      consultarSaldoFilho: async (req, res) => {
        try {
          const usuario_id = req.user.usuario_id;
          const filho_id = req.params.filho_id;
      
          const result = await sequelize.query(`
            SELECT usuario_id, filho_id, nome_filho, profile, saldo
            FROM crianca_saldo
            WHERE usuario_id = ${usuario_id} AND filho_id = ${filho_id};
          `, { type: sequelize.QueryTypes.SELECT });
      
          // Verifica se houve algum resultado da consulta
          if (result.length === 0) {
            res.status(404).json({ error: 'Criança não encontrada' });
          } else {
            res.json(result[0]); // Retorna o primeiro resultado (deveria haver apenas um, se houver correspondência)
          }
        } catch (error) {
          console.error('Erro ao obter saldo da criança:', error);
          res.status(500).json({ error: 'Erro interno do servidor' });
        }
      },
      consultarSaldoConectado: async (req, res) => {
        try {
          const filho_id = req.user.filho_id;
      
          const result = await sequelize.query(`
            SELECT usuario_id, filho_id, nome_filho, profile, saldo
            FROM crianca_saldo
            WHERE filho_id = ${filho_id};
          `, { type: sequelize.QueryTypes.SELECT });
      
          // Verifica se houve algum resultado da consulta
          if (result.length === 0) {
            res.status(404).json({ error: 'Criança não encontrada' });
          } else {
            res.json(result[0]); // Retorna o primeiro resultado (deveria haver apenas um, se houver correspondência)
          }
        } catch (error) {
          console.error('Erro ao obter saldo da criança:', error);
          res.status(500).json({ error: 'Erro interno do servidor' });
        }
      },
      saque: async (req, res) => {
        try {
            const usuario_id = req.user.usuario_id;
            const senha = req.user.senha;
            const data = new Date();
          
            // Substituir vírgulas por pontos no valor
            const valor = req.body.valor.replace(',', '.');
          
            if (req.body.senha == senha) {
              await Financa.create({
                descricao: 'Saque',
                valor,
                data,
                tipo_transacao: 'perda',
                usuario_id,
                filho_id: req.body.filho_id
              });
          
              res.status(201).json('Saque realizado com sucesso!!');
            } else {
              res.status(201).json('Senha incorreta!');
            }
          } catch (error) {
            console.log(error);
            res.status(501).json('Erro ao realizar saque, tente novamente mais tarde.');
          }
  
      },
      SolicitarSaque: async (req, res) => {
        try {
            const result = Saque.create({
                  data: new Date(),
                  valor: req.body.valor,
                  usuario_id: req.user.usuario_id,
                  filho_id: req.user.filho_id,
                  motivo: req.body.motivo,
                  status: true,
                  pagar: false
            })
            res.status(201).json('Saque solicitado com sucesso!!')
        } catch {
          res.status(501).json('Erro interno!!')
        }
      },
      getFinancaCrianca: async (req, res) => {
        try {
          const response = await Financa.findAll({
            where: {
              filho_id: req.user.filho_id
            },
            order: [['data', 'DESC']],
            limit: 10, 
          });
          res.status(201).json(response);
        } catch (error) {
          res.status(501).json('Erro interno!!')
        }
      },
      solicitacaosaque: async (req, res) => {
        try {
          const response = await Saque.findAll({
            where: {
              usuario_id: req.user.usuario_id,
              status: true,
              pagar: false

            },
          });
          res.status(201).json(response);
        } catch (error) {
          res.status(501).json('Erro interno!!')
        }
      },
      confirmSaque: async (req, res) => {
        try {
          await Saque.update(
            {pagar: true},
            {where: {
              saque_id: req.params.saque_id
            }}
          )
          res.status(201).json('Saque realizado com sucesso!!')
        } catch (error) {
          console.log(error)
          res.status(501).json('Erro interno!!')
        }
      } 
}