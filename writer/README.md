# Writer

Writer continually consume data from Kafka, writing to database. 

## Prerequisites

 Please make sure start dependencies first:
```console
databse
kafka
seeder
```

## Quick Start Locally


  The quickest way to get started to start the server as shown below.
  
  Access Writer folder:

   
  Install dependencies:

```console
$ npm install

```

Start the server locally:

```console
$ npm run start
```



## Docker Start

In Pipeline folder, please run :
```console
$ docker-compose up writer
```