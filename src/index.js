import app from './app.js'
import { connectDB } from './db.js'
import dotenv from 'dotenv';

dotenv.config();

connectDB()
.then(() => {
    const port = process.env.PORT || 3001;
    
    // Escuchar en 0.0.0.0 (necesario para Render)
    app.listen(port, '0.0.0.0', () => {
      console.log(`✅ Servidor activo en http://0.0.0.0:${port}`);
    });
  })
  .catch((error) => {
    console.error('⛔ Fallo al iniciar:', error);
    process.exit(1);
  });