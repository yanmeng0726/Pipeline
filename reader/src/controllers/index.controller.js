import pg from 'pg';
import dotenv from 'dotenv';
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

const getGameById = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: 'game Id is required' });
    }
    const id = req.params.id;
    const response = await pool.query('SELECT * FROM games WHERE id = $1', [id]);
    if(!response.rows.length){
      return res.status(204).json();
    }
    const homeTeamId = response.rows[0].home_team;
    const awayTeamId = response.rows[0].away_team;
    const homeTeam = await pool.query('SELECT * FROM teams WHERE id = $1', [homeTeamId]);
    const awayTeam = await pool.query('SELECT * FROM teams WHERE id = $1', [awayTeamId]);
    const homePoints = (
      await pool.query(
        'SELECT SUM (points) AS team_points from stats a JOIN players b ON a.player_id = b.id WHERE game_id = $1 AND b.team = $2 ',
        [id, homeTeamId]
      )
    ).rows[0].team_points;
    const homeHits = (
      await pool.query(
        'SELECT SUM (hits) AS team_hits from stats a JOIN players b ON a.player_id = b.id WHERE game_id = $1 AND b.team = $2 ',
        [id, homeTeamId]
      )
    ).rows[0].team_hits;

    const homeAssists = (
      await pool.query(
        'SELECT SUM (assists) AS team_assists from stats a JOIN players b ON a.player_id = b.id WHERE game_id = $1 AND b.team = $2 ',
        [id, homeTeamId]
      )
    ).rows[0].team_assists;
    const homeGoals = (
      await pool.query(
        'SELECT SUM (goals) AS team_goals from stats a JOIN players b ON a.player_id = b.id WHERE game_id = $1 AND b.team = $2 ',
        [id, homeTeamId]
      )
    ).rows[0].team_goals;
    const homePenaltyMinutes = (
      await pool.query(
        'SELECT SUM (penalty_minutes) AS team_penalties from stats a JOIN players b ON a.player_id = b.id WHERE game_id = $1 AND b.team = $2 ',
        [id, homeTeamId]
      )
    ).rows[0].team_penalties;

    const homeTeamStats = {
      points: homePoints,
      hits: homeHits,
      assists: homeAssists,
      goals: homeGoals,
      penaltyMinutes: homePenaltyMinutes
    };

    const awayPoints = (
      await pool.query(
        'SELECT SUM (points) AS team_points from stats a JOIN players b ON a.player_id = b.id WHERE game_id = $1 AND b.team = $2 ',
        [id, awayTeamId]
      )
    ).rows[0].team_points;
    const awayHits = (
      await pool.query(
        'SELECT SUM (hits) AS team_hits from stats a JOIN players b ON a.player_id = b.id WHERE game_id = $1 AND b.team = $2 ',
        [id, awayTeamId]
      )
    ).rows[0].team_hits;

    const awayAssists = (
      await pool.query(
        'SELECT SUM (assists) AS team_assists from stats a JOIN players b ON a.player_id = b.id WHERE game_id = $1 AND b.team = $2 ',
        [id, awayTeamId]
      )
    ).rows[0].team_assists;
    const awayGoals = (
      await pool.query(
        'SELECT SUM (goals) AS team_goals from stats a JOIN players b ON a.player_id = b.id WHERE game_id = $1 AND b.team = $2 ',
        [id, awayTeamId]
      )
    ).rows[0].team_goals;
    const awayPenaltyMinutes = (
      await pool.query(
        'SELECT SUM (penalty_minutes) AS team_penalties from stats a JOIN players b ON a.player_id = b.id WHERE game_id = $1 AND b.team = $2 ',
        [id, awayTeamId]
      )
    ).rows[0].team_penalties;

    const awayTeamStats = {
      points: awayPoints,
      hits: awayHits,
      assists: awayAssists,
      goals: awayGoals,
      penaltyMinutes: awayPenaltyMinutes
    };

    const gameObj = {
      id: response.rows[0].id,
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

const getTeamById = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: 'team Id is required' });
    }
    const id = req.params.id;
    const response = await pool.query('SELECT * FROM teams WHERE id = $1', [id]);
    if(!response.rows.length){
      return res.status(204).json();
    }
    res.status(200).json(response.rows);
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
    if(!response.rows.length){
      return res.status(204).json();
    }
    res.status(200).json(response.rows);
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
    } else {
      response = await pool.query('SELECT * FROM stats WHERE player_id = $1', [id]);
    }

    if(!response.rows.length){
      return res.status(204).json();
    }
    res.status(200).json(response.rows);
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

export { getGameById, getTeamById, getPlayerById, getPlayerStats };
