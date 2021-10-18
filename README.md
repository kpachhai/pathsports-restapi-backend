# Pathsports dApp Rest API

To start, clone pathsports-restapi-backend repo

```
git clone https://github.com/tuum-tech/pathsports-restapi-backend.git;
cd pathsports-restapi-backend;
```

# Prerequisites

To run the cloned codebase directly, you need to have Node.js and Docker installed.

-   Install docker at [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/)

-   Install node (LTS) at [https://nodejs.org/en/download/](https://nodejs.org/en/download/)

-   Run `npm i` to install dependencies.
-   Run `sudo docker-compose up -d` to get a MongoDB instance running.

# Run the service

-   Copy example environment file

```
cp .env.example .env
```

-   Modify .env file with your own values

-   [OPTIONAL]: If you want to remove previous mongodb data and start fresh, remove the mongodb directory

```
rm -rf ~/.pathsports-mongodb-data
```

-   Start API server

```
- `npm start`
```

-   Run tests or debug

```
-   `npm run test`
-   `npm run test-debug`
-   `npm run debug`
```

# Verify

-   To check whether the API is working:

```
curl http://localhost:3000
```

To create a user,

```
curl --request POST \
  --url http://localhost:3000/users \
  --header 'Content-Type: application/json' \
  --data-raw '{
	"did": "did:elastos:RaNd0MdId",
	"password": "P@ssw0rd"
}'
```

To request an auth access token for a user,

```
curl --request POST \
  --url http://localhost:3000/auth \
  --header 'Content-Type: application/json' \
  --data-raw '{
	"did": "did:elastos:RaNd0MdId",
	"password": "P@ssw0rd"
}'
```

To create a player,

```
curl --request POST \
  --url http://localhost:3000/players \
  --header 'Authorization: Bearer <ACCESS_TOKEN_HERE>' \
  --header 'Content-Type: application/json' \
  --data-raw @test/players/newPlayer.json
```

To update a player,

```
curl --request PATCH \
  --url http://localhost:3000/players/did:elastos:<DID_HERE> \
  --header 'Authorization: Bearer <ACCESS_TOKEN_HERE>' \
  --header 'Content-Type: application/json' \
  --data-raw @test/players/updatePlayer.json
```

To add new stats,

```
curl --request PATCH \
  --url http://localhost:3000/players/did:elastos:<DID_HERE>/stats \
  --header 'Authorization: Bearer <ACCESS_TOKEN_HERE>' \
  --header 'Content-Type: application/json' \
  --data-raw @test/players/newStats.json
```

# Deploy to production

-   Deploy

```
eb deploy
```

Boilerplate Credit: [Marcos](https://github.com/makinhs/toptal-rest-series/)
