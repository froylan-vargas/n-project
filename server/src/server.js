const http = require('http');
require('dotenv').config();
const app = require('./app');
const { mongoConnect } = require('./services/mongo');
const { loadPlanets } = require('./models/planets.model');
const { loadLaunchesData } = require('./models/launches.model');

const PORT = process.env.PORT;

const server = http.createServer(app);

async function startServer() {
    await mongoConnect();
    await loadPlanets();
    await loadLaunchesData();
    server.listen(PORT, () => {
        console.log(`Listening on PORT ${PORT}`);
    });
}

startServer();