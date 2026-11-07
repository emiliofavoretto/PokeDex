import express from 'express';
import * as controller from '../controllers/usuarioController.js';
import { verificarAdmin, verificarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', controller.criar);
router.post('/login', controller.login);
router.get('/', verificarAdmin, controller.buscarTodos);
router.get('/:id', verificarToken, controller.buscarPorId);
router.put('/:id', verificarToken, controller.atualizar);
router.delete('/:id', verificarAdmin, controller.deletar);

export default router;