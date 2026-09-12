import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UsuarioModel from '../models/UsuarioModel.js';

export const criar = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const { name, email, password } = req.body;

        if (!name || typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({ error: 'O campo "name" é obrigatório!' });
        }
        if (name.length > 50) {
            return res.status(400).json({ error: 'O nome deve ter no máximo 50 caracteres (incluindo espaços)!' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || typeof email !== 'string' || !email.trim()) {
            return res.status(400).json({ error: 'O campo "email" é obrigatório!' });
        }
        if (!emailRegex.test(email.trim())) {
            return res.status(400).json({ error: 'Informe um e-mail em formato válido (ex: nome@gmail.com)!' });
        }

        if (!password || typeof password !== 'string' || !password.trim()) {
            return res.status(400).json({ error: 'O campo "password" é obrigatório!' });
        }
        if (password.length < 8) {
            return res.status(400).json({ error: 'A senha deve ter no mínimo 8 caracteres!' });
        }

        const nomeFormatado = name.trim();
        const emailFormatado = email.trim().toLowerCase();

        const passwordHash = await bcrypt.hash(password, 10);

        const usuario = new UsuarioModel({ 
            name: nomeFormatado, 
            email: emailFormatado, 
            password: passwordHash 
        });
        
        const data = await usuario.criar();

        delete data.password;

        return res.status(201).json({ message: 'Registro criado com sucesso!', data });
    } catch (error) {
        
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'Este e-mail já está em uso por outro usuário!' });
        }

        console.error('Erro ao criar:', error);
        return res.status(500).json({ error: 'Erro interno ao salvar o registro.' });
    }
};

export const buscarTodos = async (req, res) => {
    try {
        const registros = await UsuarioModel.buscarTodos(req.query);

        if (!registros || registros.length === 0) {
            return res.status(400).json({ message: 'Nenhum registro encontrado.' });
        }

        return res.status(200).json(registros);
    } catch (error) {
        console.error('Erro ao buscar:', error);
        return res.status(500).json({ error: 'Erro ao buscar registros.' });
    }
};

export const buscarPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });
        }

        const usuario = await UsuarioModel.buscarPorId(parseInt(id));

        if (!usuario) {
            return res.status(404).json({ error: 'Registro não encontrado.' });
        }

        return res.status(200).json({ data: usuario });
    } catch (error) {
        console.error('Erro ao buscar:', error);
        return res.status(500).json({ error: 'Erro ao buscar registro.' });
    }
};

export const atualizar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const usuario = await UsuarioModel.buscarPorId(parseInt(id));

        if (!usuario) {
            return res.status(404).json({ error: 'Registro não encontrado para atualizar.' });
        }

        if (req.body.name !== undefined) {
            usuario.name = req.body.name;
        }

        if (req.body.email !== undefined) {
            usuario.email = req.body.email;
        }

        if (req.body.password !== undefined) {
            usuario.password = req.body.password;
        }

        const data = await usuario.atualizar();

        return res.status(200).json({ message: `O registro "${data.name}" foi atualizado com sucesso!`, data });
    } catch (error) {
        console.error('Erro ao atualizar:', error);
        return res.status(500).json({ error: 'Erro ao atualizar registro.' });
    }
};

export const deletar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        const usuario = await UsuarioModel.buscarPorId(parseInt(id));

        if (!usuario) {
            return res.status(404).json({ error: 'Registro não encontrado para deletar.' });
        }

        await usuario.deletar();

        return res.status(200).json({ message: `O registro "${usuario.name}" foi deletado com sucesso!`, deletado: usuario });
    } catch (error) {
        console.error('Erro ao deletar:', error);
        return res.status(500).json({ error: 'Erro ao deletar registro.' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'E-mail e senha são obrigatórios!' });
        }

        const usuario = await UsuarioModel.buscarPorEmail(email.trim().toLowerCase());

        if (!usuario) {
            return res.status(401).json({ error: 'E-mail ou senha inválidos!' });
        }

        const senhaValida = await bcrypt.compare(password, usuario.password);

        if (!senhaValida) {
            return res.status(401).json({ error: 'E-mail ou senha inválidos!' });
        }

        delete usuario.password;

       const token = jwt.sign(
            { id: usuario.id, role: usuario.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        return res.status(200).json({ 
            message: 'Login realizado com sucesso!', 
            usuario,
            token 
        });

    } catch (error) {
        console.error('Erro no login:', error);
        return res.status(500).json({ error: 'Erro interno ao tentar fazer login.' });
    }
};
