import pg from 'pg';
import dotenv from 'dotenv';
import getStatsBasedOnGame from '../utils/getStats.js';
const { Pool } = pg;

dotenv.config({ override: true });
const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  database: process.env.DATABASE,
  password: process.env.PASSWORD
});


const getLiveGames = async (req, res) => {
  try {
    const response = await pool.query('SELECT * FROM games WHERE in_process = true');
    if (!response.rows.length) {
      return res.status(404).json(`no live games exists`);
    }
    const gameObjs =[];
    for(const game of response.rows){
    const homeTeamId = game.home_team;
    const awayTeamId = game.away_team;
    const id = game.id
    const homeTeam = await pool.query('SELECT * FROM teams WHERE id = $1', [homeTeamId]);
    const awayTeam = await pool.query('SELECT * FROM teams WHERE id = $1', [awayTeamId]);
    const homeTeamStats = await getStatsBasedOnGame(homeTeamId, id, pool)
    const awayTeamStats = await getStatsBasedOnGame(awayTeamId, id, pool)
    const gameObj = {
      id: id,
      home_team: homeTeam.rows[0],
      away_team: awayTeam.rows[0]
    };
    gameObj.home_team['state'] = homeTeamStats;
    gameObj.away_team['state'] = awayTeamStats;
    gameObjs.push(gameObj);
  }
    res.status(200).json(gameObjs);
  } catch (error) {
    console.dir(error);
    switch (Number(error.status)) {
      case 401:
        res.status(401).json({ message: `Unauthorized Error` });
        break;
      default:
        res.status(500).json({ message: 'Internal Error' });
    }
  }
};

const getGameById = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: 'game Id is required' });
    }
    const id = req.params.id;
    const response = await pool.query('SELECT * FROM games WHERE id = $1', [id]);
    if (!response.rows.length) {
      return res.status(404).json(`game ${id} not exist`);
    }
    const homeTeamId = response.rows[0].home_team;
    const awayTeamId = response.rows[0].away_team;
    const homeTeam = await pool.query('SELECT * FROM teams WHERE id = $1', [homeTeamId]);
    const awayTeam = await pool.query('SELECT * FROM teams WHERE id = $1', [awayTeamId]);
    const homeTeamStats = await getStatsBasedOnGame(homeTeamId, id, pool)
    const awayTeamStats = await getStatsBasedOnGame(awayTeamId, id, pool)
    const gameObj = {
      id: response.rows[0].id,
      in_process: response.rows[0].in_process,
      home_team: homeTeam.rows[0],
      away_team: awayTeam.rows[0]
    };
    gameObj.home_team['state'] = homeTeamStats;
    gameObj.away_team['state'] = awayTeamStats;
    res.status(200).json(gameObj);
  } catch (error) {
    console.dir(error);
    switch (Number(error.status)) {
      case 401:
        res.status(401).json({ message: `Unauthorized Error` });
        break;
      default:
        res.status(500).json({ message: 'Internal Error' });
    }
  }
};


const getTeams = async (req, res) => {
  try {
    const response = await pool.query('SELECT * FROM teams');

    if (!response.rows.length) {
      return res.status(404).json(`teams have not been seed`);
    }
    res.status(200).json(response.rows);
  } catch (error) {
    console.dir(error)
    switch (Number(error.status)) {
      case 401:
        res.status(401).json({ message: `Unauthorized Error` });
        break;
      default:
        res.status(500).json({ message: 'Internal Error' });
    }
  }
};
const getTeamById = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: 'team Id is required' });
    }
    const id = req.params.id;
    const response = await pool.query('SELECT * FROM teams WHERE id = $1', [id]);
    const team = response.rows[0];
    const players = await pool.query('SELECT * FROM players WHERE team = $1', [id]);
    if(players.rows.length){
      team.players = players.rows;
    }

    if (!response.rows.length) {
      return res.status(404).json(`team ${id} not exist`);
    }
    res.status(200).json(team);
  } catch (error) {
    switch (Number(error.status)) {
      case 401:
        res.status(401).json({ message: `Unauthorized Error` });
        break;
      default:
        res.status(500).json({ message: 'Internal Error' });
    }
  }
};

const getPlayerById = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: 'player Id is required' });
    }
    const id = req.params.id;
    const response = await pool.query('SELECT * FROM players WHERE id = $1', [id]);
    if (!response.rows.length) {
      return res.status(404).json(`player ${id} not exist`);
    }
    res.status(200).json(response.rows[0]);
  } catch (error) {
    switch (Number(error.status)) {
      case 401:
        res.status(401).json({ message: `Unauthorized Error` });
        break;
      default:
        res.status(500).json({ message: 'Internal Error' });
    }
  }
};

const getPlayerStats = async (req, res) => {
  try {
    if (!req.params.playerId) {
      return res.status(400).json({ error: 'player Id is required' });
    }
    const id = req.params.playerId;
    const gameId = req.query.gameId;
    let response;
    if (gameId) {
      response = await pool.query('SELECT * FROM stats WHERE player_id = $1 AND game_id = $2', [
        id,
        gameId
      ]);
      if (!response.rows.length) {
        return res.status(404).json(`game ${gameId} stats with player ${id} not exist`);
      }
    } else {
      response = await pool.query('SELECT * FROM stats WHERE player_id = $1', [id]);
      if (!response.rows.length) {
        return res.status(404).json(`stats with player ${id} not exist`);
      }
    }

    if (!response.rows.length) {
      return res.status(404).json(`player ${id} not exist`);
    }
    res.status(200).json(response.rows[0]);
  } catch (error) {
    switch (Number(error.status)) {
      case 401:
        res.status(401).json({ message: `Unauthorized Error` });
        break;
      default:
        res.status(500).json({ message: 'Internal Error' });
    }
  }
};

export { getGameById, getTeamById, getPlayerById, getPlayerStats, getTeams, getLiveGames };
