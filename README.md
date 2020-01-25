# catch-me-if-you-can

A Cache API server built on top of Mongo DB

## Pre-requisites

- [Node.js](https://nodejs.org/en/) should be installed
- [MongoDB](https://www.mongodb.com/) should be installed

### Optional

- Install a client to access MongoDB to check documents manually.
e.g. [Robo 3T](https://robomongo.org/)

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install dependencies.

```bash
npm install
```

## Starting the server

Run the following command inside the project directory,

```bash
npm start
```

## Usage

**API Endpoints:**

- **GET | /cache/keys**: Get all the keys present in the cache.

- **GET | /cache/keys/:key**: Get the value for the specified key if the expiresOn timestamp hasn't been exceeded. If value is not present in the cache or expiresOn timestamp has been exceeded, create a random string and return it.

- **POST | /cache | body format: {key: string, value: string}**: Add specified key and value in the body to cache. If value is already present in the cache for the specified key, update the value.
Same API endpoint is used for both creation and updation based on the requirements, instead of individual POST and PUT respectively.
Doesn't update the expiresOn on updation since it's not mentioned in the requirements.

- **DELETE | /cache/keys**: Delete all items from the cache


## Test

Start the server and run the following command inside the project directory,

```bash
npm test
```


## License
[MIT](https://choosealicense.com/licenses/mit/)