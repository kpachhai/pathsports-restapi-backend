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
token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJyamhrUkRxQnkiLCJkaWQiOiJkaWQ6ZWxhc3RvczpSYU5kME1kSWQiLCJwYXNzd29yZCI6IlBAc3N3MHJkIiwicGVybWlzc2lvbkxldmVsIjoxLCJyZWZyZXNoS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjpbMjM2LDIwMCwyOSw2MSwxMjEsNjgsMjE2LDE2OCwxOTksMjQ5LDg1LDk4LDIxMSwyMywyNTAsMTgxXX0sImlhdCI6MTYzNTUyNzkwOCwiZXhwIjoxNjQzMzAzOTA4fQ._17mIIUNgeGES28frNQ64aHo9ISuC0sM5kUeMyJB90Y,refreshToken:rQMmakKwyexWCSJNJEkbWqg0CGnPZZ2pIATElyvAN8eOEShqss+a+tsRk8fTnSfQeyagBefNLx1ucg9pqVF54g=="
curl --request POST \
  --url http://localhost:3000/players \
  --header "Authorization: Bearer $token" \
  --header "Content-Type: application/json" \
  --data "@test/players/newPlayer.json"
```

To update a player,

```
token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJyamhrUkRxQnkiLCJkaWQiOiJkaWQ6ZWxhc3RvczpSYU5kME1kSWQiLCJwYXNzd29yZCI6IlBAc3N3MHJkIiwicGVybWlzc2lvbkxldmVsIjoxLCJyZWZyZXNoS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjpbMjM2LDIwMCwyOSw2MSwxMjEsNjgsMjE2LDE2OCwxOTksMjQ5LDg1LDk4LDIxMSwyMywyNTAsMTgxXX0sImlhdCI6MTYzNTUyNzkwOCwiZXhwIjoxNjQzMzAzOTA4fQ._17mIIUNgeGES28frNQ64aHo9ISuC0sM5kUeMyJB90Y,refreshToken:rQMmakKwyexWCSJNJEkbWqg0CGnPZZ2pIATElyvAN8eOEShqss+a+tsRk8fTnSfQeyagBefNLx1ucg9pqVF54g=="
curl --request PATCH \
  --url http://localhost:3000/players/did:elastos:RaNd0MdId \
  --header "Authorization: Bearer $token" \
  --header "Content-Type: application/json" \
  --data "@test/players/updatePlayer.json"
```

To add new stats,

```
token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJyamhrUkRxQnkiLCJkaWQiOiJkaWQ6ZWxhc3RvczpSYU5kME1kSWQiLCJwYXNzd29yZCI6IlBAc3N3MHJkIiwicGVybWlzc2lvbkxldmVsIjoxLCJyZWZyZXNoS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjpbMjM2LDIwMCwyOSw2MSwxMjEsNjgsMjE2LDE2OCwxOTksMjQ5LDg1LDk4LDIxMSwyMywyNTAsMTgxXX0sImlhdCI6MTYzNTUyNzkwOCwiZXhwIjoxNjQzMzAzOTA4fQ._17mIIUNgeGES28frNQ64aHo9ISuC0sM5kUeMyJB90Y,refreshToken:rQMmakKwyexWCSJNJEkbWqg0CGnPZZ2pIATElyvAN8eOEShqss+a+tsRk8fTnSfQeyagBefNLx1ucg9pqVF54g=="
curl --request PATCH \
  --url http://localhost:3000/players/did:elastos:RaNd0MdId/stats \
  --header "Authorization: Bearer $token" \
  --header "Content-Type: application/json" \
  --data "@test/players/newStats.json"
```

# Deploy to production

-   Deploy

```
eb deploy
```

Boilerplate Credit: [Marcos](https://github.com/makinhs/toptal-rest-series/)
