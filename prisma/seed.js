import pg from 'pg';
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Limpando registros antigos...');

  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "usuario_favorito", "usuario" RESTART IDENTITY CASCADE;`);
  // 1. Limpa primeiro a tabela dependente (UserFavorite) para não quebrar a chave estrangeira
  await prisma.userFavorite.deleteMany();
  // 2. Limpa a tabela principal de Usuários
  await prisma.usuario.deleteMany();

  console.log('📦 Inserindo novos usuários...');

  const joao = await prisma.usuario.create({
    data: { name: 'João', email: 'joao@example.com', password: '123' },
  });

  const maria = await prisma.usuario.create({
    data: { name: 'Maria', email: 'maria@example.com', password: '123' },
  });

  await prisma.usuario.create({
    data: { name: 'Pedro', email: 'pedro@example.com', password: '123' },
  });
  await prisma.usuario.create({
    data: { name: 'Ana', email: 'ana@example.com', password: '123' },
  });

  console.log('⭐ Inserindo Pokémon favoritos...');

  await prisma.userFavorite.createMany({
    data: [
      { userId: joao.id, pokemonId: 1 },
      { userId: joao.id, pokemonId: 25 },
      { userId: maria.id, pokemonId: 4 },
    ],
  });

  console.log('✅ Seed executado com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });