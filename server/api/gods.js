const router = require('express').Router();
const { GodPlayerStats, God, GodInfo } = require('../../db');
const godStats = require('../util/godStats');
const defaultStats = Object.keys(require('../util/defaultPlayerGodStats'));

const retrieveCache = require('./redisHelper');

router.get('/', async (req, res, next) => {
    try {
        res.send( await retrieveCache(req.originalUrl, God.findAll().map(god => god.name) ) );
    } catch(err){
        next(err);
    }
})

router.get('/:godName', async (req, res, next) => {
    try {
        let godInfo = await retrieveCache(req.originalUrl, God.findOne({
            where: {
                name: req.params.godName
            },
            include: [{
                model: GodInfo,
                required: true
            }]
        }));
        res.send(godInfo);
    } catch(err){
        next(err);
    }
})

router.get('/:godName/stats', async (req, res, next) => {
    try {
//        let godInfo = await God.findOne({where: {name: req.params.godName}});
        let godInfo = await retrieveCache(
            req.originalUrl,
            God.findOne({where: {name: req.params.godName}})
        );
//        let stats = await godStats.getStats(req.params.godName, defaultStats, req.query);
        let stats = await retrieveCache(
            req.originalUrl,
            godStats.getStats(req.params.godName, defaultStats, req.query)
        );
        
        godInfo.stats = stats;
        res.send(godInfo);
    } catch(err){
        next(err);
    }
})

router.get('/:godName/stats/KDA', async (req, res, next) => {
    try {
        let godKDAs = await retrieveCache(
            req.originalUrl,
            godStats.getKDA(req.params.godName, req.query)
        );
//        let godKDAs = await godStats.getKDA(req.params.godName, req.query);
        res.send(godKDAs);
    } catch(err){
        next(err);
    }
})

router.get('/:godName/stats/games', async (req, res, next) => {
    try {
        let gamesPlayed = await retrieveCache(
            req.originalUrl,
            godStats.getGames(req.params.godName, req.query)
        );
        res.send(gamesPlayed);
    } catch(err){
        next(err);
    }
})

router.get('/:godName/stats/:statName', async (req, res, next) => {
    try {
        let stat = await retrieveCache(
            req.originalUrl,
            godStats.getStats(req.params.godName, [req.params.statName], req.query)
        );
        res.send(stat);
    } catch(err){
        next(err);
    }
})

module.exports = router;