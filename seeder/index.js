import pg from 'pg';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();
// seed data for teams
fetch('https://statsapi.web.nhl.com/api/v1/teams')
  .then((response) => {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(response);
  })
  .then((body) => {
    const teams = [];
    for (const team of body.teams) {
      const teamObj = { id: team.id, name: team.name };
      teams.push(teamObj);
    }
    return teams;
  })
  .then(async (teams) => {
    const Client = pg.Client;
    const client = new Client({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT
    });
    client.connect();
    for (const team of teams) {
      console.dir(team);
      const insert = 'INSERT INTO teams(id, name) VALUES($1, $2)';
      const update = 'ON CONFLICT (id) DO UPDATE SET name = excluded.name;';
      await client.query({
        text: insert + update,
        values: [team.id, team.name]
      });
    }
  })
  .then(() => process.exit(0))
  .catch((response) => {
    console.error(response);
  });
