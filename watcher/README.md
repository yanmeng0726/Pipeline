# Watcher

Watcher continually watchs for game status changes.
when one game are live, open a new thread and publish real time data to kafka. when games ends, stop. 

## Prerequisites

 Please make sure start dependencies first:
```console
databse
seeder
kafka
writer
```

## Quick Start Locally
### Watch Data for Live Game

    
  The quickest way to get started to start the server as shown below.
  
  Access to Watcher folder:

   
  Install dependencies:

```console
$ npm install

```

  Start the server:

```console
$ npm run start
```
**Please Note : You can see data comes only when there is a live game.**



### Load Data for Pevious Games Locally
If you want to load previous games data to DB, please change QUERY which is located in  .env file based on [NHL API Rules](https://github.com/sportradarus/sportradar-advanced-challenge/blob/main/documentation.md#schedule). For example : 
```console
QUERY='season=20202021'
```
```console
QUERY='date=2018-01-09'
```




## Docker Start
**Please Note : You can see data only when there is a live game.**

In Pipeline folder, please run :
```console
$ docker-compose up watcher
```

 



## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.





## License

[MIT](https://choosealicense.com/licenses/mit/)