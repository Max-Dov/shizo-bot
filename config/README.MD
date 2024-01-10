# Environment Variables

`.env.default` file provides default env variables for an app, 
but `BOT_TOKEN` variable has to be filled manually. 
Variables enable or disable bot features. 
You can obtain your own API token by talking to [BotFather](https://telegram.me/botfather).

I recommend creating separate `.env.local` file for your own configuration. 
It would be ignored by Git. 
To make app read new config file, update env file name in `~/src/main.ts` file.