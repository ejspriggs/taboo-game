# taboo-game
An editable shared deck of cards, requiring a login to edit and deal, but not to draw, that combines with a voice call done in other software to enable remote play of the game Taboo.

Heroku deployment: https://taboo-game-f3ac1b145f45.herokuapp.com/

## Card list
This interface is only for registered users who are logged in.
![Screenshot 2024-03-06 081008](https://github.com/ejspriggs/taboo-game/assets/32990599/ba4e250a-7d2b-4958-930e-0e2b5035d2a6)

## Game list
This interface is also only for logged-in users.
![Screenshot 2024-03-06 080909](https://github.com/ejspriggs/taboo-game/assets/32990599/6c9f6808-5f41-41e5-a98b-eefec0e74c7e)

## Gameplay screen
Anyone who has a link to a game can play, but only the registered creator of the game sees the "user management" panel on the right.
![Screenshot 2024-03-06 081043](https://github.com/ejspriggs/taboo-game/assets/32990599/0e2634d2-84cd-4a85-858e-485c89953597)

# Technologies used
Mongo (via Mongoose), Express, React, Node.js, Tailwind CSS

# Installation
Run "npm i" in the root of your clone of this repo, to download the project's Node dependencies.
In a file in the root of the repository called .env (generally for development), and/or in the environment (generally for deployment), define the following variables:
- PORT: The port on which Express should run (generally 3000 for development, or determined by your provider in production).
- MONGODBURI: The connection string for a Mongo database to which you have write access.
- JWT_SECRET_KEY: An arbitrary string JWT shares only with its own past self, to enable it to recognize all and only its own tokens.
- ON_HEROKU: switches some functionality that's useful only for development on ("false") or off ("true")
In development, run separate backend (Express) and frontend (Vite) servers at the same time with "npm run backend" and "npm run frontend" in different terminals.  The Express instance running on your configured port will be proxied to the frontend, so navigate to Vite's port (generally 5173) on localhost to use the site.
In production, run a single server with "npm start".  This will compile everything from the frontend together, and serve it from Express on your configured port, alongside the backend API.  Where to navigate to use the site depends on details of your deployment, and is beyond the scope of this document.

# User stories
- AAU, I want to play the game Taboo with people, but not enough to install anything, buy anything, or sign up for anything.
- AAU, I want to play the game Taboo with the folks from the first user story, because they are more numerous than folks who will put in more effort, like me.
- As a hiring manager, I want to see whether this Spriggs guy is any good at programs.
- As one of Edward's friends, I'm curious what he's been working on for all this time.

# Major hurdles
The two nastiest bugs to fix were both of the type, "I formed a closure without intending to, thereby causing some code to unexpectedly see old data."  This is somewhat to be expected, since closures are a significant aspect of Javascript programming that doesn't really have any analogous element in C, the language with which I have most of my experience.  To a lesser extent, handling throws+returns as function output, instead of just returns, was a stumbling block for the same reason.

# Next steps
The application in its current state is functional, but not especially resistant to cheaters/griefers/DOS.  Future versions will be more locked-down, including in particular that new accounts will undergo some sort of appropriate validation.
