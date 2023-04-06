import KafkaService from '../producer.js';
import fetch from 'node-fetch';

async function seedSchedules(refreshTime, todayGameTimes) {
  // seed game basic info for today's schedule
  let url = 'https://statsapi.web.nhl.com/api/v1/schedule'
  if(process.env.QUERY){
    url += '?'+process.env.QUERY
  }
  console.dir(url)
  return await fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      return Promise.reject(response);
    })
    .then((body) => {
      const games = [];
      for (const game of body.dates[0]['games']) {
        const gameObj = {
          id: game.gamePk,
          awayTeam: game.teams.away.team.id,
          homeTeam: game.teams.home.team.id
        };
        games.push(gameObj);
        todayGameTimes.push({ id: game.gamePk, time: game.gameDate });
      }
      KafkaService.sendRecord({ games: games });

      todayGameTimes.sort(function (a, b) {
        return new Date(a.time) - new Date(b.time);
      });

      let updatedRefreshScheduleTime = new Date();
      updatedRefreshScheduleTime.setTime(refreshTime.getTime() + 24 * 60 * 60 * 1000);
      console.log('next time for pulling schedule is ');
      console.dir(updatedRefreshScheduleTime);

      return updatedRefreshScheduleTime;
    })
    .catch((response) => {
      console.error(response.body);
    });
}

export default seedSchedules;
