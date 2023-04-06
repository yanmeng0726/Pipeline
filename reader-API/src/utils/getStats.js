

async function getStatsBasedOnGame(teamId,id, pool){

    const points = (
        await pool.query(
          'SELECT SUM (points) AS team_points from stats a JOIN players b ON a.player_id = b.id WHERE game_id = $1 AND b.team = $2 ',
          [id, teamId]
        )
      ).rows[0].team_points;
      const hits = (
        await pool.query(
          'SELECT SUM (hits) AS team_hits from stats a JOIN players b ON a.player_id = b.id WHERE game_id = $1 AND b.team = $2 ',
          [id, teamId]
        )
      ).rows[0].team_hits;
  
      const assists = (
        await pool.query(
          'SELECT SUM (assists) AS team_assists from stats a JOIN players b ON a.player_id = b.id WHERE game_id = $1 AND b.team = $2 ',
          [id, teamId]
        )
      ).rows[0].team_assists;
      const goals = (
        await pool.query(
          'SELECT SUM (goals) AS team_goals from stats a JOIN players b ON a.player_id = b.id WHERE game_id = $1 AND b.team = $2 ',
          [id, teamId]
        )
      ).rows[0].team_goals;
      const penaltyMinutes = (
        await pool.query(
          'SELECT SUM (penalty_minutes) AS team_penalties from stats a JOIN players b ON a.player_id = b.id WHERE game_id = $1 AND b.team = $2 ',
          [id, teamId]
        )
      ).rows[0].team_penalties;

      return {
        points: points,
        hits: hits,
        assists: assists,
        goals: goals,
        penaltyMinutes: penaltyMinutes
      };

}

export default getStatsBasedOnGame