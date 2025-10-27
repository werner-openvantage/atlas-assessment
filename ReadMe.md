# Open Vantage Atlas Assessment.

This is a simple assessment for the Open Vantage Atlas stream.

## Overview

The assessment is a simple web application that allows you to create, read, update, and delete data from a database.

## Technologies Used

- NodeJS
- Docker
- Express
- Postgres
- HTML
- CSS
- JavaScript
- React
- React Router
- React Hook Form

# Features

- Create a new user
- Login
- Logout
- Create a new post
- Read a post
- Update a post
- Delete a post

# Installation

- Clone the repository
- DB:
  - Run `docker compose up -d` to start the database
- BE:
  - Run `yarn install` to install the dependencies
  - Run `yarn migrate` to run the migrations
  - Run `yarn seed` to seed the database
  - Run `yarn start` to start the server
- FE:
  - Run `pnpm install` to install the dependencies
  - Run `pnpm start` to start the development server

# What you need to do:
- Build a login page using React Hook Forms
  - The password should have validation rules:
    - At least 8 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one number
    - At least one special character
  - The email should have validation rules:
    - It should be a valid email address
  - The form should have a submit button
  - The form should have a reset button
  - The form should have a redirect to the home page after successful login
  - The form should have a redirect to the login page if the login fails
- Build a register page using React Hook Forms
  - The password should have validation rules:
    - At least 8 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one number
    - At least one special character
  - The email should have validation rules:
    - It should be a valid email address
    - The email should be unique and not already in the database
  - A verification email should be sent to the user after registration
    - This will be sent via ethereal.email
  - The form should have a submit button
- Build a home page using React Router
  - The signed in user should be prefetched using react router loader
  - The signed in user should be displayed in the header
  - The signed in user should have a logout button
  - The signed in user should have a link to the profile page
  - The signed in user should have a link to the logout page
  - The signed in user should have a link to the login page
- Build a post page using React Router
  - Where the user is not signed in, they should be redirected to the login page
  - Where the user can see all the posts
  - Where the user can create a new post
  - Where the user can update a post
  - Where the user can delete a post
  - Where the user can see the details of a post
  - The page should have lazy loading for the posts. 5 at a time.
- Build a Create Post page using React Hook Forms
  - The user should be able to create a post with a wysiwyg editor.
  - The user should be able to add a title to the post
  - The user should be able to add a description to the post - This is where the wysiwyg editor will be used
- Build a Update Post page using React Hook Forms
  - The user should be able to update a post with a wysiwyg editor.
  - The user should be able to add a title to the post
  - The user should be able to add a description to the post - This is where the wysiwyg editor will be used
- Build a Delete Post page using React Hook Forms
  - The user should be able to delete a post
  - The user should be able to confirm the deletion of the post
  - The user should be redirected to the home page after successful deletion
  - The user should be redirected to the login page if the deletion fails
- Build a Post Details page using React Router
  - The user should be able to see the details of a post

## Notes:
- If there are any issues in terms of responses from the BE, you need to fix the issue to get the correct response.
- If the response from the BE is not what you expect, you need to change it to return the correct response.
- Please create a User email and PW from ethereal.email for testing purposes. And add it to the emailHelper.ts file that can be found in the BE/src/helpers folder.
