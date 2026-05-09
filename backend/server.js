const express = require('express');
const app = express();
const PORT = parseInt(process.env.PORT) || 5000;

// Request logging middleware (har request ko log karega)
app.use((req, res, next) => {
  console.log(`📥 Incoming: ${req.method} ${req.path}`);
  next();
});

// Simple health endpoint
app.get('/api/health', (req, res) => {
  console.log('✅ Health check hit!');
  res.json({ 
    status: 'ok', 
    port: PORT,
    env_port: process.env.PORT,
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Minimal Server Running!' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Minimal server listening on 0.0.0.0:${PORT}`);
  console.log(`📍 Env PORT variable: ${process.env.PORT}`);
});