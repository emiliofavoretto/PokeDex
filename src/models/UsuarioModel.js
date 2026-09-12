import prisma from '../lib/services/prismaClient.js';

export default class UsuarioModel {
    constructor({ id = null, name, email, password } = {}) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
    }

    async criar() {
        return prisma.usuario.create({
            data: {
                name: this.name,
                email: this.email,
                password: this.password,
            },
        });
    }

    async atualizar() {
        return prisma.usuario.update({
            where: { id: this.id },
            data: { name: this.name, email: this.email, password: this.password },
        });
    }

    async deletar() {
        return prisma.usuario.delete({ where: { id: this.id } });
    }

    static async buscarTodos(filtros = {}) {
        const where = {};

        if (filtros.name) {
            where.name = { contains: filtros.name, mode: 'insensitive' };
        }
        if (filtros.email !== undefined) {
            where.email = filtros.email === 'true';
        }
        if (filtros.password !== undefined) {
            where.password = filtros.password;
        }

        return prisma.usuario.findMany({ where });
    }

    static async buscarPorId(id) {
        const data = await prisma.usuario.findUnique({ where: { id } });
        if (!data) {
            return null;
        }
        return new UsuarioModel(data);
    }

    static async buscarPorEmail(email) {
        return await prisma.usuario.findUnique({
            where: { email }
        });
    }
}