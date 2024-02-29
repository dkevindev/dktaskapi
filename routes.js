import { authMid } from "./config.js";
import userController from "./controllers/userController.js";
import Express from "express";
import { filesController } from "./controllers/filesController.js";
import multer from "multer";
import { taskController } from "./controllers/tasksController.js";
import { fincController } from "./controllers/fincController.js";

const routes = Express.Router();

const storage = multer.memoryStorage()

const upload = multer({ storage: storage });


routes.get('/criancas', authMid, userController.getChildrens);
routes.get('/getTarefas', authMid, taskController.getTarefas);
routes.get('/confirmeTarefa/:tarefa_id', authMid, taskController.tarefasConfirm);
routes.get('/saldo', authMid, fincController.consultarSaldo);
routes.get('/saldo/:filho_id', authMid, fincController.consultarSaldoFilho);
routes.get('/consultar/saldo', authMid, fincController.consultarSaldoConectado);
routes.get('/financacrianca', authMid, fincController.getFinancaCrianca);
routes.get('/solicitacaosaque', authMid, fincController.solicitacaosaque);
routes.get('/respsaque/:saque_id', authMid, fincController.confirmSaque);
routes.get('/getfaltas', authMid, taskController.getFaltas);
routes.get('/getbonus', authMid, taskController.getBonus);
routes.get('/getpunicoes', authMid, taskController.getPunicoesModel);
routes.get('/registrodetarefas', authMid, taskController.getRegistroTarefas)
routes.get('/getDesafios', authMid, taskController.getDesafios)
routes.get('/getDesafiosFilhos', authMid, taskController.getDesafiosFilho)
routes.post('/cancelarDesafios', authMid, taskController.cancelarDesafio)


// ROTAS DELETE

routes.delete('/punicaomodeo/:id', authMid, taskController.puncModelDelete);

// ROTAS POST
routes.post('/criancasid', authMid, userController.getChildrensid);
routes.post('/novousuario', userController.createUser);
routes.post('/novatarefa', authMid, taskController.createTarefa);
routes.post('/novacrianca', authMid, userController.createChildren);
routes.post('/novobonus', authMid, taskController.newBonus);
routes.post('/novodesafio', authMid, taskController.newDesafio);
routes.post('/novafalta', authMid, taskController.newFaltas);
routes.post('/faltastatus', authMid, taskController.faltasUpdate);
routes.post('/pagamentotarefa', authMid, fincController.pagamentopTarefa);
routes.post('/saque', authMid, fincController.saque);
routes.post('/solicitarsaque', authMid, fincController.SolicitarSaque);
routes.post('/novamodelpunicao', authMid, taskController.newPunicaoModel);
routes.post('/atualizarPunicaoModel', authMid, taskController.puncModelUpdate);
routes.post('/login', userController.loginUser);
routes.post('/verificartoken', userController.verificarToken);
routes.post('/userlogado', authMid, userController.userLogado);
routes.post('/updateprofile', authMid, userController.updateProfile);
routes.post('/updateprofile2', authMid, userController.updateProfileChildren);
routes.post('/uploadavatar', authMid, upload.single('profile'), filesController.uploadAvatar)
routes.post('/uploadavataruser', authMid, upload.single('profile'), filesController.uploadAvatarUser)
routes.post('/uploadavatarchildren', authMid, upload.single('profile'), filesController.uploadAvatarChildren)


export default routes;
