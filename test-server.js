import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

console.log('1. Importing routes...');
import authRoutes from './src/routes/authRoutes.js';
console.log('2. Auth routes imported');
import userRoutes from './src/routes/userRoutes.js';
console.log('3. User routes imported');

console.log('4. Setting up Express...');
const app = express();
app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());

console.log('5. Adding route handlers...');
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

console.log('6. Adding error handlers...');
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  if (!err.status) {
    err.status = 500;
    err.message = 'Internal Server Error';
  }
  res.status(err.status).json({ error: err.message });
});

console.log('7. Starting server...');
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✓ Server is running on port ${PORT}`));
