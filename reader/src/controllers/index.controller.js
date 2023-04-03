import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  database: 'nhl'
});

const getGameById = async (req, res) => {
  const id = req.params.id;
  const response = await pool.query('SELECT * FROM games WHERE id = $1', [id]);
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
  res.json(gameObj);
};

const getTeamById = async (req, res) => {
  const id = req.params.id;
  const response = await pool.query('SELECT * FROM teams WHERE id = $1', [id]);
  res.json(response.rows);
};

const getPlayerById = async (req, res) => {
  const id = req.params.id;
  const response = await pool.query('SELECT * FROM players WHERE id = $1', [id]);
  res.json(response.rows);
};

const getPlayerStats = async (req, res) => {
  const id = req.params.playerId;
  const gameId = req.query.gameId;
  let response;
  if (gameId) {
    response = await pool.query(
      'SELECT * FROM stats WHERE player_id = $1 AND game_id = $2',
      [id, gameId]
    );
  } else {
    response = await pool.query('SELECT * FROM stats WHERE player_id = $1', [id]);
  }

  res.json(response.rows);
};

export { getGameById, getTeamById, getPlayerById, getPlayerStats };
