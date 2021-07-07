# Vidly
An API that provide features to manage a movie rental store

## Table of contents
* [About](#about)
* [Features](#features)
* [Technologies](#technologies)
* [Startup](#startup)
* [Tests](#tests)
* [Documentation](#documentation)
* [Usefull commands](#usefull-commands)
* [Status](#status)
* [Contact](#contact)

## About
The intention of doing this project was to understand how to develop the backend architecture using Node and Javascript.

## Features
List of features ready and TODOs for future development
* Signin
* Create user
* Update user
* Delete user
* Search users
* Create costumer
* Update costumer
* Delete costumer
* Search costumers
* Create genre
* Update genre
* Delete genre
* List genres
* Create movie
* Update movie
* Delete movie
* List movies
* Rental movies
* List rental
* Return rental

To-do list:
* Create the frontend web application

## Technologies
* Node - https://nodejs.org/en/
* Javascript - https://developer.mozilla.org/pt-BR/docs/Aprender/JavaScript
* Jest - https://jestjs.io/
* MongoDB - https://www.mongodb.com/
* Docker - https://www.docker.com/
* Docker Compose - https://docs.docker.com/compose/install/

## Startup

#### Tools
You must install [docker](https://www.digitalocean.com/community/tutorials/como-instalar-e-usar-o-docker-no-ubuntu-18-04-pt)  and [docker-compose](https://docs.docker.com/compose/install/) and [yarn](https://linuxize.com/post/how-to-install-yarn-on-ubuntu-18-04/).

#### Clone the repository
```sh
git clone https://github.com/tiagovbarreto/vidly.git
```

#### Start project
```sh
$ docker-compose up
```

## Tests
#### To run tests
```sh
$ docker-compose exec backend yarn test
```

## Usefull commands
#### To see running containers
```sh
$ docker ps or docker container ls or $ docker-compose ps
```

#### To access the backend container
```sh
$ docker exec -it <container id> /bin/sh or $ docker-compose exec backend /bin/sh
```

#### To access the db container
```sh
$ docker exec -it <container id> /bin/sh or $ docker-compose exec db /bin/sh
```

## Status
Project is: _finished_

## Contact
Created by tiagovalentim@gmail.com - feel free to contact me!


