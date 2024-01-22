import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import { UserController } from './controllers/userController';
import { CarController } from './controllers/carController';

const app = express();
const PORT = 3000;

mongoose.connect('mongodb+srv://2021wide:W8DdeRUP1AU3eaHz@cluster0.liiv0zd.mongodb.net/?retryWrites=true&w=majority');
const db = mongoose.connection;
db.once('open', () => {
  console.log('Connected to MongoDB');
});
db.on('error', (error) => {
  console.error('Mongoose connection error:', error);
});

app.use(bodyParser.json());

app.post('/register', UserController.registerUser);
app.post('/login', UserController.loginUser);

app.use('/cars', (req, res, next) => {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({ error: 'Authentication token missing' });
  }

  jwt.verify(authToken, 'supersecretkey', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden - Invalid token' });
    }
    next();
  });
});
app.get('/cars/:brand', CarController.getCarsByBrand);
app.get('/cars', CarController.getAllCars);
app.post('/cars', CarController.addCar);
app.put('/cars/:id', CarController.updateCar);
app.delete('/cars/:id', CarController.deleteCar);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
