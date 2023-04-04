import pg from 'pg';



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
    return teams
  }).then(async(teams)=>{
    const Client = pg.Client;
    const client = new Client({
      user: 'postgres',
      host: 'localhost',
      database: 'nhl',
      password: 'admin',
      port: 5432
    });
    client.connect();
    for (const team of teams) {
        console.dir(team)
        const insert = 'INSERT INTO teams(id, name) VALUES($1, $2)';
        const update = 'ON CONFLICT (id) DO UPDATE SET name = excluded.name;';
         await client.query({
          text: insert + update,
          values: [team.id, team.name]
        });
      }
  })
  .catch((response) => {
    console.error(response);
  });