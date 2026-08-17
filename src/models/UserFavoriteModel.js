import prisma from '../lib/services/prismaClient.js';

export default class UserFavoriteModel {
    constructor({ id = null, userId, pokemonId } = {}) {
        this.id = id;
        this.userId = userId;
        this.pokemonId = pokemonId;
    }

    async criar() {
        return prisma.userFavorite.create({
            data: {
                userId: this.userId,
                pokemonId: this.pokemonId,
            },
        });
    }

    async atualizar() {
        return prisma.userFavorite.update({
            where: { id: this.id },
            data: { userId: this.userId, pokemonId: this.pokemonId },
        });
    }

    async deletar() {
        return prisma.userFavorite.delete({ where: { id: this.id } });
    }

    static async buscarTodos(filtros = {}) {
        const where = {};

        if (filtros.userId) {
            where.userId = { contains: filtros.userId, mode: 'insensitive' };
        }
        if (filtros.pokemonId !== undefined) {
            where.pokemonId = filtros.pokemonId === 'true';
        }

        return prisma.userFavorite.findMany({ where });
    }

    static async buscarPorId(id) {
        const data = await prisma.userFavorite.findUnique({ where: { id } });
        if (!data) {
            return null;
        }
        return new UserFavoriteModel(data);
    }
}