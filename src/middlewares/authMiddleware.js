import jwt from 'jsonwebtoken';
import usuarioModel from '../models/UsuarioModel.js';

export const verificarAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: 'Token de autenticação não fornecido!' });
        }

        const parts = authHeader.split(' ');
        if (parts.length !== 2) {
            return res.status(401).json({ error: 'Erro no formato do token!' });
        }

        const [scheme, token] = parts;

        if (!/^Bearer$/i.test(scheme)) {
            return res.status(401).json({ error: 'Token mal formatado!' });
        }

        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Token inválido ou expirado!' });
            }

            const usuarioId = decoded.id;

            const usuario = await usuarioModel.buscarPorId(usuarioId);

            if (!usuario) {
                return res.status(401).json({ error: 'Usuário do token não encontrado!' });
            }

            if (decoded.role !== 'ADMIN') {
                return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem acessar esta rota!' });
            }

            return next();
        });

    } catch (error) {
        console.error('Erro no middleware de admin:', error);
        return res.status(500).json({ error: 'Erro interno na validação de permissão.' });
    }
};