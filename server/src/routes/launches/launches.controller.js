const {
    getAllLaunches,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortLaunchById
} = require('../../models/launches.model');

const { getPagination } = require('../../services/query');

async function httpGetAllLaunches(req, res) {
    const { skip, limit } = getPagination(req.query);
    const launches = await getAllLaunches(skip, limit);
    return res.status(200).json(launches);
}

async function httpAddNewLaunch(req, res) {
    const launch = req.body;
    const { mission, rocket, launchDate, target } = launch;
    if (!mission || !rocket || !launchDate || !target) {
        return res.status(400).json({
            error: 'Missing required launch info'
        });
    }
    launch.launchDate = new Date(launch.launchDate);
    if (isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: 'Invalid launch date'
        });
    }
    const savedLaunch = await scheduleNewLaunch(launch);
    return res.status(201).json(savedLaunch);
}

async function httpAbortLaunch(req, res) {
    const id = Number(req.params.id);
    const existLaunch = await existsLaunchWithId(id);
    if (!existLaunch) {
        return res.status(404).json({
            error: 'Launch not found'
        });
    }
    const aborted = await abortLaunchById(id);
    if (!aborted) {
        return res.status(400).json({
            error: 'Launch not aborted'
        })
    }
    return res.status(200).json({
        ok: true
    });
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
}