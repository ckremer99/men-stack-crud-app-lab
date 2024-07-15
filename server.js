const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const Planet = require('./models/planet.js');
const methodOverride = require('method-override');
const morgan = require('morgan');

const app = express();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}`);
});

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));

// Middleware to set locals for debugging purposes
app.use((req, res, next) => {
    res.locals.reqBody = req.body;
    res.locals.reqParams = req.params;
    res.locals.reqQuery = req.query;
    next();
});

app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.get('/planets/new', (req, res) => {
    res.render('planets/new.ejs');
});

app.post('/planets', async (req, res) => {
    req.body.isGasGiant = req.body.isGasGiant === 'on';
    await Planet.create(req.body);
    res.redirect('/planets/');
});

app.get('/planets', async (req, res) => {
    const allPlanets = await Planet.find();
    res.render('planets/index.ejs', { planets: allPlanets });
});

app.delete('/planets/:planetId', async (req, res) => {
    await Planet.findByIdAndDelete(req.params.planetId);
    res.redirect('/planets');
});

app.get('/planets/:planetId/edit', async (req, res) => {
    const foundPlanet = await Planet.findById(req.params.planetId);
    res.render('planets/edit.ejs', { planet: foundPlanet });
});

app.get('/planets/:planetId', async (req, res) => {
    const foundPlanet = await Planet.findById(req.params.planetId);
    res.render('planets/show.ejs', { planet: foundPlanet });
});

app.put('/planets/:planetId', async (req, res) => {
    req.body.isGasGiant = req.body.isGasGiant === 'on';
    console.log('Attempted PUT request with data:', req.body);
    await Planet.findByIdAndUpdate(req.params.planetId, req.body);
    res.redirect(`/planets/${req.params.planetId}`);
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});
