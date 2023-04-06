# Reader Api

Getting data from DB

## Prerequisites

 Please make sure start dependencies first:
```console
databse
kafka
writer
watcher
seeder
```

## Quick Start Locally



  The quickest way to get started to start the server as shown below.

  Access to Reader-api folder.
  
  
  Install dependencies:

```console
$ npm install

```

  Start the server:

```console
$ npm run start
```

## Open Endpoints


```console
router.get('/teams');
router.get('/teams/:id');
router.get('/players/:id');
router.get('/games/:id');
router.get('/liveGames');
router.get('/stats/:playerId');
router.get('/stats/:playerId?gameId=xxx');
```



## Test
In Reader-api, please run :
```console
$ npm run test
```
## Docker Start
In Pipeline folder, please run :
```console
$ docker-compose up reader
```

 



## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.





## License

[MIT](https://choosealicense.com/licenses/mit/)