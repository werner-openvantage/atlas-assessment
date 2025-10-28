# Open Vantage Atlas Assessment - BE

This is the backend for the Open Vantage Atlas assessment.

## Overview

This is the backend for the Open Vantage Atlas assessment. It is built with NodeJS, Express, and Knex.

## Technologies Used

- NodeJS
- Express
- Knex
- Postgres
- HTML
- CSS
- TypeScript

## Docker Setup

- Run `docker compose up -d` to start the database

## Installation

- Run `yarn install` to install the dependencies
- Run `yarn migrate` to run the migrations
- Run `yarn seed` to seed the database
- Run `yarn start` to start the server

## Swagger Documentation

- After running the server, you can access the swagger documentation at `http://localhost:3000/api-docs`

## There is one user and one post in the database after seeding.
- User:
  - Email: admin@atlas.co.za
  - Password: Admin1234@
- Post:
  - Title: Post 1
  - Content: Content 1
  - User ID: 1
