# Twitch Plays

### THIS IS A WORK IN PROGRESS

---

## Requirements

- Node JS (min version v0.11.3)
- Program to control computer (Ex. xdotool)
- Twitch account and app
- Twitch oauth key with chat:read access
- Knowledge of some JavaScript

## Setup

If you already have a key just download or clone the program and edit the values in TwitchPlays.js, then run it with node

If you don't have a key then go to the twitch developer console, create an app, then put your client secret and client id codes in here and select chat:read as "yes" [twitchtokengenerator.com](https://twitchtokengenerator.com/)
After that copy the code they give into the TwitchPlays.js file as well as fill out everything else.

To refresh the key use twitchtokengenerator, or
with curl run

```
curl -sX POST 'https://id.twitch.tv/oauth2/token' \
  -d 'client_id=<your client ID>' \
  -d 'client_secret=<your client secret>' \
  -d 'grant_type=refresh_token' \
  -d "refresh_token=<your refresh token>
```

Then copy the value for access_token and write down the refresh_token value so you can use it again
