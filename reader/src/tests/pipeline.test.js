import request from 'supertest';


describe('test', () => {
  let server;
  beforeAll(async () => {
    const mod = await import('../index.js');
    server = mod .default;
  });

  afterAll((done) => {
    if (server) {
      server.close();
      done();
    }
  });

  it('should return no context if player does not exist', async () => {
    const res = await request(server)
      .get('/players/1')
      expect(res.statusCode).toBe(204);
  });
});