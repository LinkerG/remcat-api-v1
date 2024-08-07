# RemCat - Server

Developed with express.js & mongodb

## Author

- [Iker Gonzalez Tirado](https://www.github.com/LinkerG)

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MONGO_URI` To connect to a remote or local database

`PORT` If you want the app to run on a specific port

## Documentation

You will need an `API_KEY` to be able to make HTTP requests to the API

Once you have your own API_KEY you can import this [Postman Collection](https://) and add your key as a variable {{api_key}} so you can test the server

## Run Locally

Clone the project

```bash
  git clone https://github.com/LinkerG/RemCat-Server
  cd RemCat-Server
```

```bash
  npm install
  npm start
```

If you want to seed your own database you can run

```bash
  npm run seed
```

## Used By

This project is used in its frontend:

- [RemCat - Client](https://github.com/LinkerG/RemCat-Client)
