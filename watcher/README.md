# Watcher

Watcher continually watchs for game status changes.
when one game are live, open a new thread and publish real time data to kafka. when games ends, stop. 

## Prerequisites

 Please make sure start dependencies first:
```console
databse
kafka
writer
```

## Quick Start 
### Watch Data for Live Game


  The quickest way to get started to start the server as shown below.


```
   
  Install dependencies:

```console
$ npm install

```

  Start the server:

```console
$ npm run start
```
Please note : You can only see data when there is a live game



### Load Data for Pevious Game
If you want to load previous games data, please change QUERY which is located in  .env file based on [NHL API Rules](https://github.com/sportradarus/sportradar-advanced-challenge/blob/main/documentation.md#schedule). For example : 
```console
QUERY='season=20202021'
```
```console
QUERY='date=2018-01-09'
```

## Docker Start

```console
$ make up
```

 



## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.





## License

[MIT](https://choosealicense.com/licenses/mit/)