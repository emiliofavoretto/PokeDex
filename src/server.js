import express from 'express';
import cors from "cors";
import 'dotenv/config';
import usuarioRoutes from './routes/usuarioRoute.js';
import userFavoriteRoutes from './routes/userFavoriteRoute.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('🚀 API funcionando');
});

// Rotas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/usuarios_favoritos', userFavoriteRoutes);

app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});