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
            config.slack.channel = c
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
        slackBot.postMessageToChannel(config.slack.channel, "IRC User "+from+": "+message, params);
    });
    
    slackBot.on('message', function(data) { 
        slackBot.getChannels().then(function(chls){
            const index2 = chls.channels.findIndex(channel => channel.id === data.channel);
           //console.log(chls.channels[2])
            if(isCommandString(data.text,chls.channels[index2].name)===true&&data.text!=null){
                if(checkAdmin(data.user)===true){
                    twitchBot.chat("/"+data.text.substring(5,data.text.length), config.twitch.channel); 
                    slackBot.postMessageToChannel(config.slack.channel, "Sent command '/"+command+"' to twitch.", params);
                }else{
                    getUserName(data.user,function(userName){
                        console.log(userName)
                        slackBot.postMessageToChannel(config.slack.channel, "Slack user "+userName+" is not a Slack admin for this team and therefore cannot execute Twitch commands.", params);  
                    })
                }
            }
        })

    });
}
function getUserName(userId,callback){
    //console.log(userId)
    slackBot.getUsers().then(function(userData){
        const index3 = userData.members.findIndex(member => member.id === userId);
        //console.log(userData.members[index].name)
        callback(userData.members[index3].name)
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
function getChannelName(channelId,callBack){
    slackBot.getChannels().then(function(channels){
        console.log("channel "+channelId)
        const index2 = channels.channels.findIndex(channel => channel.id === channelId);
        console.log("index "+channels.channels[index2].name)
        callBack()
    })
}
module.exports = {
    config:config,
    start:startSlackToTwitch
}