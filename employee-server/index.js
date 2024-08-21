const express = require('express');
const cors = require('cors');
const path = require('path');

require('express-async-errors')

const config = require('./utils/env-helper');
const routes = require('./controller/index')
const errorHandler = require('./middleware/exception-handler')

const { PORT } = config;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);
app.use(errorHandler);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



app.listen(PORT, () => {
    console.log("Listening to ", { PORT })
});