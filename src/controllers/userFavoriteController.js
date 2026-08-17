import UserFavoriteModel from '../models/UserFavoriteModel.js';

export const criar = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const { userId, pokemonId } = req.body;
        const numUserId = Number(userId);
        const numPokemonId = Number(pokemonId);

        if (!userId || isNaN(numUserId)) {
            return res.status(400).json({ error: 'O campo "userId" é obrigatório e deve ser um número!' });
        }

        if (!pokemonId || isNaN(numPokemonId)) {
            return res.status(400).json({ error: 'O campo "pokemonId" é obrigatório e deve ser um número!' });
        }

        const usuario_favorito = new UserFavoriteModel({ 
            userId: numUserId, 
            pokemonId: numPokemonId 
        });
        
        const data = await usuario_favorito.criar();

        return res.status(201).json({ message: 'Registro criado com sucesso!', data });
    } catch (error) {
        console.error('Erro ao criar:', error);
        return res.status(500).json({ error: 'Erro interno ao salvar o registro.' });
    }
};

export const buscarTodos = async (req, res) => {
    try {
        const registros = await UserFavoriteModel.buscarTodos(req.query);

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

        const usuario_favorito = await UserFavoriteModel.buscarPorId(parseInt(id));

        if (!usuario_favorito) {
            return res.status(404).json({ error: 'Registro não encontrado.' });
        }

        return res.status(200).json({ data: usuario_favorito });
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

        const usuario_favorito = await UserFavoriteModel.buscarPorId(parseInt(id));

        if (!usuario_favorito) {
            return res.status(404).json({ error: 'Registro não encontrado para atualizar.' });
        }

        if (req.body.userId !== undefined) {
            usuario_favorito.userId = req.body.userId;
        }

        if (req.body.pokemonId !== undefined) {
            usuario_favorito.pokemonId = req.body.pokemonId;
        }

        const data = await usuario_favorito.atualizar();

        return res.status(200).json({ message: `O registro "${data.userId}" foi atualizado com sucesso!`, data });
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

        const usuario_favorito = await UserFavoriteModel.buscarPorId(parseInt(id));

        if (!usuario_favorito) {
            return res.status(404).json({ error: 'Registro não encontrado para deletar.' });
        }

        await usuario_favorito.deletar();

        return res.status(200).json({ message: `O registro "${usuario_favorito.userId}" foi deletado com sucesso!`, deletado: usuario_favorito });
    } catch (error) {
        console.error('Erro ao deletar:', error);
        return res.status(500).json({ error: 'Erro ao deletar registro.' });
    }
};