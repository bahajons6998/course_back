const express = require('express');
const cors = require('cors');
const templateRouter = require('./routes/template.routes');
const victorinaRouter = require('./routes/victorina.routes');
const auth = require('./routes/auth.routes');
const app = express();
const path = require('path');
const uploadRouter = require("./routes/file.route");


app.use(
  cors({
    origin: ['http://157.230.26.234:3000', 'http://localhost:3000'], // Frontend URL (React ilovangiz manzili)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// JSON parser
app.use(express.json());

// Routerlar
app.use('/auth', auth);
app.use('/api', templateRouter);
app.use('/api/victorina', victorinaRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Statik fayllar uchun papka (rasmlar bu yerda saqlanadi)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/api", uploadRouter);


// Serverni ishga tushirish
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server http://localhost:${PORT} is running`);
});