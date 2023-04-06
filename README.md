# NHL Data Pipeline

A data pipeline to ingest National Hockey League  real-time data.

Pipeline can : 
1. continually watch for game status changes and toggle the next process on game status changes.
2. when games are live, ingest game data from the NHL. when games ends, stop
3. query database to get data

## Quick Start

  The quickest way to get started to start the server as shown below:

   
  Install dependencies:

```console
$ npm install
```

  Start the server:

```console
$ npm run serve
```

 The default server will run at: http://localhost:8080

## Docker Start

```console
$ make up
```
 
## System Architecture
[![system-design.png](https://i.postimg.cc/d35WgfkV/system-design.png)](https://postimg.cc/0KJdwc0T)


## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.





## License

[MIT](https://choosealicense.com/licenses/mit/)