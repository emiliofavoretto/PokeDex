import prisma from '../lib/services/prismaClient.js';

const SEM_SENHA = {
    id: true,
    name: true,
    email: true,
    role: true,
    avatarUrl: true,
    favoritePokemonId: true,
    createdAt: true,
    updatedAt: true,
};

export default class UsuarioModel {
    constructor({ id = null, name, email, password, role, avatarUrl, favoritePokemonId } = {}) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.avatarUrl = avatarUrl;
        this.favoritePokemonId = favoritePokemonId;
    }

    async criar() {
        return prisma.usuario.create({
            data: {
                name: this.name,
                email: this.email,
                password: this.password,
            },
            select: SEM_SENHA,
        });
    }

    async atualizar() {
        return prisma.usuario.update({
            where: { id: this.id },
            data: {
                name: this.name,
                email: this.email,
                password: this.password,
                avatarUrl: this.avatarUrl,
                favoritePokemonId: this.favoritePokemonId,
            },
            select: SEM_SENHA,
        });
    }

    async deletar() {
        return prisma.usuario.delete({ where: { id: this.id }, select: SEM_SENHA });
    }

    static async buscarTodos(filtros = {}) {
        const where = {};

        if (filtros.name) {
            where.name = { contains: filtros.name, mode: 'insensitive' };
        }
        if (filtros.email) {
            where.email = { contains: filtros.email, mode: 'insensitive' };
        }

        return prisma.usuario.findMany({ where, select: SEM_SENHA });
    }

    static async buscarPorId(id) {
        const data = await prisma.usuario.findUnique({ where: { id } });
        if (!data) return null;
        return new UsuarioModel(data);
    }

    static async buscarPorEmail(email) {
        return prisma.usuario.findUnique({ where: { email } });
    }
}