# ThunderStorage

This project solves the problem of storing data onto the blockchain,
an extremely expensive endeavor. It uses a normal SQL database to load
and store data, but adds in a cryptographic hash published onto the blockchain
to ensure immutability of the data.

At the same time, currently it only allows authorized individuals to save the data
because the operator of this will be paying for all gas fees involved with the
storage.

## Tools

- Typescript
- NestJs
- Typeorm
- Etherjs
- Redoc

## Overview

The backend is split into modules with a v1 module serving our api routes.  
The Auth module is responsible for creating and validating jwts limiting access to our routes.  
The Datasaver module is responsible for taking in data, saving it into the db and onto the chain.  
The Polling module is the specifically designed to take in survey data and saving it.

## Setup

Configurations are located in `backend/src/config`  
The way its setup only supports 4 environment, but can be changed for other usecase  
`cd backend`  
`yarn install or npm install`  
`yarn db:migrate`  
`yarn start or npm start`

Tests can be run with  
`yarn test or npm test`
