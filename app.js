//var config = require('./config.js');
var SlackBot = require('slackbots');
var twitch = require('twitch-irc-lite');
var params, slackBot, twitchBot

var config = {
    slack:{
        setToken:function(t){
            config.slack.token = t
            return config
        },
        setName:function(n){
            config.slack.name = n
            return config
        },
        setChannel:function(c){
            config.slack.channel = c
            return config
        },
        setCommandPrefix:function(c){
            config.slack.commandPrefix = c
            return config
        },
        setChannelName:function(c){
            config.slack.channelName = c
            return config
        },
        setIcon:function(i){
            config.slack.icon_emoji = i
            return config
        }
    },
    twitch:{
        setToken:function(t){
            config.twitch.token = t
        },
        setBotName:function(n){
            config.twitch.botName = n
            return config
        },
        setChannel:function(c){
            config.twitch.channel = c
            return config
        }
    }
}
function configure(){
    
}
function startSlackToTwitch(){
    params = {
        icon_emoji: config.slack.icon_emoji
    }
    slackBot = new SlackBot({
        token: config.slack.token,
        name: config.slack.name
    });

    twitchBot = new twitch(config.twitch.token, config.twitch.botName);
    twitchBot.join(config.twitch.channel)
    twitchBot.chatEvents.addListener('message', function(channel, from, message){
        slackBot.postMessageToChannel(config.slack.channelName, "IRC User "+from+": "+message, params);
    });
    
    slackBot.on('message', function(data) { 
        if(isCommandString(data.text,data.channel)===true&&data.text!=null){
            if(checkAdmin(data.user)===true){
                twitchBot.chat("/"+data.text.substring(5,data.text.length), config.twitch.channel); 
                slackBot.postMessageToChannel(config.slack.channelName, "Sent command '/"+command+"' to twitch.", params);
            }else{
                getUserName(data.user,function(userName){
                    slackBot.postMessageToChannel(config.slack.channelName, "Slack user "+userName+" is not a Slack admin for this team and therefore cannot execute Twitch commands.", params);  
                })
            }
        }
    });
}
function getUserName(userId,callback){
    console.log(userId)
    slackBot.getUsers().then(function(userData){
        const index = userData.members.findIndex(member => member.id === userId);
        console.log(userData.members[index].name)
        callback(userData.members[index].name)
        return userData.members[index].name
    })
}
function checkAdmin(user){
    slackBot.getUsers().then(function(userData){
        const index = userData.members.findIndex(member => member.id === user);
        if(index!=-1&&userData.members[index].is_admin==true){
            return true
        }else{
            return false
        }
    })
}

function isCommandString(message,channel){
    if(message&&channel==config.slack.channel&&message.substring(0,5)=="exec "&&message.length>4){
        return true
    }else{
        return false
    }
}

module.exports = {
    config:config,
    start:startSlackToTwitch
}