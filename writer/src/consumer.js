import kafka from 'kafka-node';
import pg from 'pg';
(async () => {
  const Client = pg.Client;
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'nhl',
    password: 'admin',
    port: 5432
  });
  client.connect();
  const kafkaClientOptions = { sessionTimeout: 100, spinDelay: 100, retries: 2 };
  const kafkaClient = new kafka.KafkaClient(
    'http://localhost:2181',
    'consumer-client',
    kafkaClientOptions
  );

  const topics = [{ topic: 'pipeline' }];

  const options = {
    autoCommit: true,
    fetchMaxWaitMs: 1000,
    fetchMaxBytes: 1024 * 1024,
    encoding: 'buffer'
  };

  const kafkaConsumer = new kafka.Consumer(kafkaClient, topics, options);

  kafkaConsumer.on('message', async function (message) {
    const jsonString = message.value.toString();
    const jsonObject = JSON.parse(jsonString);

    if (jsonObject['teams']) {
      console.dir(jsonObject['teams'])
      for (const team of jsonObject['teams']) {
        const insert = 'INSERT INTO teams(id, name) VALUES($1, $2)';
        const update = 'ON CONFLICT (id) DO UPDATE SET name = excluded.name;';
        await client.query({
          text: insert + update,
          values: [team.id, team.name]
        });
      }
    }

    if (jsonObject['games']) {
        for (const game of jsonObject['games']) {
            console.dir(game)
          const insert = 'INSERT INTO games(id, home_team, away_team) VALUES($1, $2, $3)';
          const update = 'ON CONFLICT (id) DO UPDATE SET home_team = excluded.home_team,away_team = excluded.away_team ;';
          await client.query({
            text: insert + update,
            values: [game.id, game.awayTeam, game.homeTeam]
          });
        }
      }



    if (jsonObject['players']) {
        for (const player of jsonObject['players']) {
          const insert = 'INSERT INTO players(id, team, age, number, position, name) VALUES($1, $2, $3,$4,$5, $6)';
          const update = 'ON CONFLICT (id) DO UPDATE SET team = excluded.team, age = excluded.age, number = excluded.number, position = excluded.position, name = excluded.name;';
          await client.query({
            text: insert + update,
            values: [player.id, player.team, player.age, player.number, player.position, player.name]
          });
        }
      }

    if (jsonObject['stats']) {
      for (const stat of jsonObject['stats']) {
        console.dir(stat);
        const time = new Date().toISOString();

        const insert ='INSERT INTO stats(game_id, player_id, assists, goals, hits, points, penalty_minutes, update_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8)'
        const update = 'ON CONFLICT (game_id, player_id) DO UPDATE SET assists = excluded.assists, goals = excluded.goals, hits =excluded.hits, points = excluded.points, penalty_minutes = excluded.penalty_minutes, update_at = excluded.update_at ;'
        await client.query({
          text: insert+update,
          values: [
            stat.game,
            stat.id,
            stat.assists,
            stat.goals,
            stat.hits,
            stat.points,
            stat.penaltMinutes,
            time
          ]
        });
      }
    }
  });

  kafkaClient.on('error', (error) => console.error('Kafka client error:', error));
  kafkaConsumer.on('error', (error) => console.error('Kafka consumer error:', error));
})();
