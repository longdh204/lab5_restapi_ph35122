require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000; // Sử dụng cổng 10000 mặc định nếu không có biến PORT
// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// MongoDB Atlas connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Error connecting to MongoDB Atlas:', err));

// Car model
const Car = mongoose.model('Car', {
    code: String,
    color: String,
    price: Number
});

// Routes
app.post('/api/cars', async (req, res) => {
    try {
        const car = new Car(req.body);
        await car.save();
        res.status(201).send(car);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.get('/api/cars', async (req, res) => {
    try {
        const cars = await Car.find();
        res.send(cars);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// MongoDB Atlas connection
console.log('Attempting to connect to MongoDB Atlas...');
console.log('MONGODB_URI:', process.env.MONGODB_URI); // Log the URI (make sure to remove this in production)

if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not defined in the environment variables');
    process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => {
        console.error('Error connecting to MongoDB Atlas:', err);
        process.exit(1);
    });
// Routes
app.post('/api/cars', async (req, res) => {
    console.log('Received POST request:', req.body);
    try {
        const car = new Car(req.body);
        await car.save();
        console.log('Car saved successfully:', car);
        res.status(201).send(car);
    } catch (error) {
        console.error('Error saving car:', error);
        res.status(400).send({ message: error.message });
    }
});

app.get('/api/cars', async (req, res) => {
    console.log('Received GET request');
    try {
        const cars = await Car.find();
        console.log('Cars fetched:', cars);
        res.send(cars);
    } catch (error) {
        console.error('Error fetching cars:', error);
        res.status(500).send({ message: error.message });
    }
});