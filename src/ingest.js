import { workerData, parentPort } from 'worker_threads';
import fetch from 'node-fetch';
import _ from 'lodash';
import { KafkaService } from './producer';
parentPort.postMessage(getLiveData(workerData.gameId));

function getLiveData(gameId) {
    console.dir("can't see this")
  console.dir(gameId);
  let prevAwayTeam = null;
  let prevHomeTeam = null;
  let players = {};
  // setInterval(ingest(gameId, prevHomeTeam, prevAwayTeam,players), 1000);
}

function ingest(gameId, prevHomeTeam, prevAwayTeam, players) {
  console.dir('hitt');
  fetch(`https://statsapi.web.nhl.com/api/v1/game/${gameId}/feed/live`).then((response) =>
    response.json().then((body) => {
      const awayTeam = body.gameData.teams.away;
      const awayTeamObj = { id: awayTeam.id, name: awayTeam.name };
      //   if(!_.isEqual(prevAwayTeam, awayTeamObj)){
      //     KafkaService.sendRecord(awayTeamObj)
      //   }
      const homeTeam = body.gameData.teams.home;
      const homeTeamObj = { id: homeTeam.id, name: homeTeam.name };
      const playerObjs = {};
      Object.keys(body.gameData.players).forEach((key) => {
        const player = body.gameData.players[key];
        const playObj = {
          id: player.id,
          name: player.fullName,
          age: player.currentAge,
          number: player.primaryNumber,
          position: player.primaryPosition,
          team: player.currentTeam.id
        };
        playerObjs[`${key}`] = playObj;
      });

      Object.keys(body.liveData.boxscore.teams.away.players).forEach((key) => {
        const stats = body.liveData.boxscore.teams.away.players[key].stats.skaterStats;
        if (stats) {
          playerObjs[key].assists = stats.assists;
          playerObjs[key].hits = stats.hits;
          playerObjs[key].goals = stats.goals;
          playerObjs[key].points = playerObjs[key].assists + playerObjs[key].goals;
          playerObjs[key].penaltyMinutes = stats.penaltyMinutes;
        }
      });

      Object.keys(body.liveData.boxscore.teams.home.players).forEach((key) => {
        const stats = body.liveData.boxscore.teams.home.players[key].stats.skaterStats;
        if (stats) {
          playerObjs[key].assists = stats.assists;
          playerObjs[key].hits = stats.hits;
          playerObjs[key].goals = stats.goals;
          playerObjs[key].points = playerObjs[key].assists + playerObjs[key].goals;
          playerObjs[key].penaltyMinutes = stats.penaltyMinutes;
        }
      });

      console.dir(playerObjs);
    })
  );
}
