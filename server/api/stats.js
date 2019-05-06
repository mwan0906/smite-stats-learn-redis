const router = require('express').Router();
const { GodPlayerStats, God, GodInfo } = require('../../db');
const godStats = require('../util/godStats');
const defaultStats = Object.keys(require('../util/defaultPlayerGodStats'));

const retrieveCache = require('./redisHelper');

router.get('/', async(req, res, next) => {
    try {
        res.send(defaultStats.slice(0, -3));
    } catch(err){
        next(err);
    }
})

router.get('/all', async(req, res, next) => {
    try {
        let stats = await retrieveCache(req.originalUrl, godStats.getStats(null, defaultStats, req.query));
//        let stats = await godStats.getStats(null, defaultStats, req.query);
        let maxStats = defaultStats.reduce((obj, stat) => {
            let max = Math.max(...stats.map(god => god[stat] || 0));
            obj[stat] = max;
            return obj;
        }, {})
        res.send(maxStats);
    } catch(err){
        next(err);
    }
})

router.get('/:statName', async(req, res, next) => {
    try {
        if(req.params.statName.toUpperCase() === 'KDA'){
            res.send( await retrieveCache(req.originalUrl, godStats.getKDA(null, req.query)) );
        } else if(req.params.statName.toUpperCase() === 'GAMES'){
            res.send( await retrieveCache(req.originalUrl, godStats.getGames(null, req.query)) );
        } else {
            res.send( await retrieveCache(req.originalUrl, godStats.getStats(null, [req.params.statName], req.query)) );
        }
    } catch(err){
        next(err);
    }
})

module.exports = router;