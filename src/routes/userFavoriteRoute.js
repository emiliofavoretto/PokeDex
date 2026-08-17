import express from 'express';
import * as controller from '../controllers/userFavoriteController.js';

const router = express.Router();

router.post('/', controller.criar);
router.get('/', controller.buscarTodos);
router.get('/:id', controller.buscarPorId);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.deletar);

export default router;