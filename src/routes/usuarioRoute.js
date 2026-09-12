import express from 'express';
import * as controller from '../controllers/usuarioController.js';
import { verificarAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', controller.criar);
router.get('/', controller.buscarTodos);
router.get('/:id', controller.buscarPorId);
router.put('/:id', controller.atualizar);
router.post('/login', controller.login);
router.delete('/:id', verificarAdmin, controller.deletar);

export default router;