import request from 'supertest';

// please seed  data for season 2020-2021 to run tests
describe('test endpoints with 2020-2021 season', () => {
  let server;
  beforeAll(async () => {
    const mod = await import('../index.js');
    server = mod.default;
  });

  afterAll((done) => {
    if (server) {
      server.close();
      done();
    }
  });

  it('should return not found if player does not exist', async () => {
    const res = await request(server).get('/players/1');
    expect(res.statusCode).toBe(404);
    expect(res.body).toBe('player 1 not exist');
  });

  it('should return player data', async () => {
    const id = `8469455`;
    const res = await request(server).get(`/players/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(id);
    expect(res.body.name).toBe('Jason Spezza');
    expect(res.body.team).toBe('10');
    expect(res.body.age).toBe(39);
    expect(res.body.number).toBe(19);
    expect(res.body.position).toBe('Center');
  });

  it('should return not found if game does not exist', async () => {
    const res = await request(server).get('/games/1');
    expect(res.statusCode).toBe(404);
    expect(res.body).toBe('game 1 not exist');
  });

  it('should return game data', async () => {
    const id = `2020020001`;
    const res = await request(server).get(`/games/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(id);
    expect(res.body.home_team.id).toBe('5');
    expect(res.body.home_team.name).toBe('Pittsburgh Penguins');
    expect(res.body.home_team.state).not.toBeNull();
    expect(res.body.away_team.id).toBe('4');
    expect(res.body.away_team.name).toBe('Philadelphia Flyers');
    expect(res.body.away_team.state).not.toBeNull();
  });

  it('should return not found if team does not exist', async () => {
    const res = await request(server).get('/teams/27');
    expect(res.statusCode).toBe(404);
    expect(res.body).toBe('team 27 not exist');
  });

  it('should return team data', async () => {
    const id = `1`;
    const res = await request(server).get(`/teams/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('New Jersey Devils');
  });


  it('should return not found if player does not have stats', async () => {
    let id = 1
    const res = await request(server).get(`/stats/${id}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toBe(`stats with player ${id} not exist`);

  });

  it('should return not found if player does not have for specific stats', async () => {
    let id = '8466138';
    let gameId = '1'
    const res = await request(server).get(`/stats/${id}?gameId=${gameId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toBe(`game ${gameId} stats with player ${id} not exist`);

  });

  it('should return stats data for one player', async () => {
    const id = `8478439`;
    const res = await request(server).get(`/stats/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.assists).toBe(1);
    expect(res.body.hits).toBe(4);
    expect(res.body.points).toBe(1);
  });
});
