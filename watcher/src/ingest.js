import { workerData, parentPort } from 'worker_threads';
import fetch from 'node-fetch';
import _ from 'lodash';
import KafkaService from './producer.js';

parentPort.postMessage(getLiveData(workerData.gameId));

let prevPlayersRealTimeStats = {};
let diffStats =[]

function getLiveData(gameId) {
  setInterval(() => ingest(gameId), 1000);
}

function ingest(gameId) {
  fetch(`https://statsapi.web.nhl.com/api/v1/game/${gameId}/feed/live`).then((response) =>
    response.json().then((body) => {

      const playerRealTimeStats = {}
      Object.keys(body.liveData.boxscore.teams.away.players).forEach((key) => {
        if(!playerRealTimeStats[key]){
          playerRealTimeStats[key] = {'game': gameId}
        }
        const stats = body.liveData.boxscore.teams.away.players[key].stats.skaterStats;
        if (stats) {
          playerRealTimeStats[key].assists = stats.assists;
          playerRealTimeStats[key].hits = stats.hits;
          playerRealTimeStats[key].goals = stats.goals;
          playerRealTimeStats[key].points = playerRealTimeStats[key].assists + playerRealTimeStats[key].goals;
          playerRealTimeStats[key].penaltyMinutes = stats.penaltyMinutes;
        }
      });

      Object.keys(body.liveData.boxscore.teams.home.players).forEach((key) => {
        if(!playerRealTimeStats[key]){
          playerRealTimeStats[key] = {'game': gameId}
        }
        const stats = body.liveData.boxscore.teams.home.players[key].stats.skaterStats;
        if (stats) {
          playerRealTimeStats[key].assists = stats.assists;
          playerRealTimeStats[key].hits = stats.hits;
          playerRealTimeStats[key].goals = stats.goals;
          playerRealTimeStats[key].points = playerRealTimeStats[key].assists + playerRealTimeStats[key].goals;
          playerRealTimeStats[key].penaltyMinutes = stats.penaltyMinutes;
        }
      });

      Object.keys(playerRealTimeStats).forEach((key)=>{
          if (!_.isEqual(prevPlayersRealTimeStats[key], playerRealTimeStats[key])){
            diffStats.push({id: key.substring(2), assists: playerRealTimeStats[key].assists, goals: playerRealTimeStats[key].goals,hits:playerRealTimeStats[key].hits, points:playerRealTimeStats[key].points, penaltMinutes: playerRealTimeStats[key].penaltyMinutes, game:gameId})

          }
      })
      if(diffStats.length){
        console.dir("stats changed ")
        console.dir(diffStats)
        KafkaService.sendRecord({'stats': diffStats});
      }
      diffStats = []
      prevPlayersRealTimeStats = playerRealTimeStats

    })
  );
}

// export default getLiveData
