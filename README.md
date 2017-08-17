# slack-to-twitch

slack-to-twitch is a simple npm module to allow you to send commands from slack to twitch IRC.
It also replays all twitch chatter in your slack channel but all chat in slack is private to slack for moderation purposes.

# Installation
mkdir mynewproject
npm install slack-to-twitch

# Usage
Slack - You will need to have created a bot user in slack and have its api access token to hand.
Also you need to create a dedicated channel ins slack and have added the bot to it.
    
Twitch - You will need to have made a Twitch IRC channel and also have its access token to hand.
    
create an app.js file and add the following
    
```
var slackTwitch = require('slack-to-twitch')

slackTwitch.config.slack.setToken("SLACK_BOT_API_TOKEN")
                .slack.setChannelName("SLACK_CHANNEL_NAME")
                .slack.setCommandPrefix("exec")
                .slack.setIcon(":cat:")
                .slack.setName("SLACK_BOT_USER_NAME")
                .twitch.setBotName("TWITCH_BOT_NAME")
                .twitch.setChannel("TWICT_CHANNEL_NAME")
                .twitch.setToken("TWITCH_API_TOKEN")
slackTwitch.start()
```
Then 
```
node index.js
```
To send / commands to IRC simply start a slack message in your new channel wit the word exec

example
```
exec me test
```
    This will be sent to IRC as /me test, any commands can be sent in this format, 
    messages not proceeded with exec get sent as normal slack mesages and dont hit twitch.
    Done

