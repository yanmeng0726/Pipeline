# NHL Data Pipeline

A data pipeline to ingest National Hockey League  real-time data.

Pipeline can : 
1. continually watch for game status changes and toggle the next process on game status changes.
2. when games are live, ingest game data from the NHL. when games ends, stop
3. query database to get data

## Quick Start

  The quickest way to get started to start the server as shown below:

   
  Install dependencies:

# NHL Data Pipeline

A data pipeline to ingest National Hockey League  real-time data.

Pipeline can : 
1. continually watch for game status changes and toggle the next process on game status changes.
2. when games are live, ingest game data from the NHL. when games ends, stop
3. query database to get data


## Docker Quick Start

```console
$ docker-compose up
```
After run above command, below things happened:
1. DB (postgres) and Kafka are up. The default Topic in Kafka is called 'pipeline'
2. Seeder seeds teams basic info to database
3. Writer, Watcher Reader-api up
4. Watcher pull today's schedule and send baisc game info to Writer; Writer writes to DB
5. Next time for automation pulling scheudle is set to midnight (Eastern Time)
6. If there is a live game, watcher and writer will start process
7. If there is not a live game, watcher wait until five minutes before earliest game to ingest data


## Local Quick Start
If you want to run watcher/reader/writer locally, please make sure DB, Seeder and Kafka are up first. please run:
```console
$ docker-compose up init-kafka seeder
```
## System Architecture
[![system-architecture.png](https://i.postimg.cc/66hVz6Qh/system-architecture.png)](https://postimg.cc/F17JH43f)


## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.





## License

[MIT](https://choosealicense.com/licenses/mit/)