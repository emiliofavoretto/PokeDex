import express from 'express';
import cors from "cors";
import 'dotenv/config';
import usuarioRoutes from './routes/usuarioRoute.js';
import userFavoriteRoutes from './routes/userFavoriteRoute.js';

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  "http://localhost:5173",          
  "https://pokedex-2q5n.onrender.com", 
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Origem não permitida pelo CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

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