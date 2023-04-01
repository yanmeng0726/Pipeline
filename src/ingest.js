import { workerData, parentPort } from 'worker_threads';
import fetch from 'node-fetch';
parentPort.postMessage(getLiveData(workerData.gameId));

async function getLiveData(gameId) {
    const response = await fetch(`https://statsapi.web.nhl.com/api/v1/game/${gameId}/feed/live`);
        console.dir('hittt');
        // const response = await fetch(`https://statsapi.web.nhl.com/api/v1/game/${gameId}/feed/live`);
        console.dir(response)
        const awayTeam = response.gameData.teams.away;
        const awayTeamObj = { id: awayTeam.id, name: awayTeam.name };
        console.dir('1' + awayTeamObj);
        const homeTeam = response.gameData.teams.home;
        const homeTeamObj = { id: homeTeam.id, name: homeTeam.name };
        console.dir('2' + homeTeamObj);
        // const playerObjs = [];
        // Object.values(response.gameData.players).forEach((player) => {
        //   const playObj = {
        //     id: player.id,
        //     name: player.fullName,
        //     age: player.currentAge,
        //     number: player.primaryNumber,
        //     position: player.position
        //   };
        //   playerObjs.push(playObj);
        // });
      
        // console.dir(playerObjs);
      
        // let awayTeamAssists = 0;
        // Object.values(response.liveData.boxscore.teams.away.players).forEach((player) => {
        //   awayTeamAssists += player.stats.goalieStats.assists;
        // });
        // const awayTeamGoals = response.liveData.boxscore.teams.away.teamStats.teamSkaterStats.goals;
        // console.dir('3' + awayTeamGoals);
        // const awayTeamPoints = awayTeamAssists + awayTeamGoals;
        // console.dir('4' + awayTeamPoints);
      
        // let homeTeamAssists = 0;
        // Object.values(response.liveData.boxscore.teams.home.players).forEach((player) => {
        //   homeTeamAssists += player.stats.goalieStats.assists;
        // });
        // const homeTeamGoals = response.liveData.boxscore.teams.home.teamStats.teamSkaterStats.goals;
        // console.dir('5' + homeTeamAssists);
        // const homeTeamPoints = homeTeamAssists + homeTeamGoals;
        // console.dir('6' + homeTeamPoints);

 
}
