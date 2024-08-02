const fs = require('fs');
const path = require('path');
const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');

// SETTINGS
let channelTwitchID = '104391402';
let channelTwitchName = 'psp1g';
let emotesToDownload = 5; // Ensure this is greater than 0
let downloadGlobalEmotes = true;

let convertTTVEmotes = true; // MIGHT BE BUGGY

// INPUT YOUR ACCESS TOKEN AND CLIENT ID IF YOU WANT TO DOWLOAD CHANNEL TWITCH EMOTES
// https://twitchtokengenerator.com/
// MAKE SURE THE USERTOKEN IS ONLY THE TOKEN (ACCESS TOKEN)
let userToken = '';
let clientId = '';

// DO NOT CHANGE ANYTHING BELOW
const FgBlack = "\x1b[30m";
const FgRed = "\x1b[31m";
const FgGreen = "\x1b[32m";
const FgYellow = "\x1b[33m";
const FgBlue = "\x1b[34m";
const FgMagenta = "\x1b[35m";
const FgCyan = "\x1b[36m";
const FgWhite = "\x1b[37m";

// TTV
let TTVEmoteData = [];

// 7TV
let SevenTVID = '0';
let SevenTVemoteSetId = '0';

let SevenTVGlobalEmoteData = [];
let SevenTVEmoteData = [];

// FFZ
let FFZGlobalEmoteData = [];
let FFZEmoteData = [];

// BTTV
let BBTVGlobalEmoteData = [];
let BBTVEmoteData = [];

let allEmoteData = [];

const gqlUrl = 'https://7tv.io/v3/gql';
const payload = {
    operationName: "SearchUsers",
    variables: {
        query: channelTwitchName,
    },
    query: `
    query SearchUsers($query: String!) {
      users(query: $query) {
        id
        username
        display_name
        roles
        style {
          color
        }
        avatar_url
      }
    }
  `
};

async function LoadEmotes() {
    // TTV
    if (userToken != '' && clientId != '') {
        await fetchTTVEmoteData();
    } else {
        console.log(FgMagenta + 'USERTOKEN or CLIENT ID was not set' + FgWhite)
    }

    // 7TV
    try {
        await get7TVUserID();
        await get7TVEmoteSetID();
        await fetch7TVEmoteData('global');
        await fetch7TVEmoteData(SevenTVemoteSetId);
    } catch (err) {
        console.log('ERROR GETTING 7TV EMOTES')
    }

    // FFZ
    try {
        await fetchFFZGlobalEmotes();
        await fetchFFZEmotes();
    } catch (err) {
        console.log('ERROR GETTING FFZ EMOTES')
    }

    // BTTV
    try {
        await fetchBTTVGlobalEmoteData();
        await fetchBTTVEmoteData();
    } catch (err) {
        console.log('ERROR GETTING BTTV EMOTES')
    }

    if (downloadGlobalEmotes) {
        allEmoteData = [
            ...SevenTVGlobalEmoteData,
            ...SevenTVEmoteData,
            ...BBTVGlobalEmoteData,
            ...BBTVEmoteData,
            ...FFZGlobalEmoteData,
            ...FFZEmoteData,
            ...TTVEmoteData,
        ];
    } else {
        allEmoteData = [
            ...SevenTVEmoteData,
            ...BBTVEmoteData,
            ...FFZEmoteData,
            ...TTVEmoteData,
        ];
    }

    console.log('LOADED!');

    downloadEmotes().catch(err => {
        console.error("Error downloading emotes:", err);
    });
}

LoadEmotes();

async function get7TVUserID() {
    try {
        const response = await axios.post(gqlUrl, payload, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = response.data;
        if (data && data.data && data.data.users) {
            const user = data.data.users[0];
            if (user) {
                SevenTVID = user.id;
                console.log(FgBlue + '7TV User ID:', SevenTVID + FgWhite);
            } else {
                throw new Error('User not found');
            }
        } else {
            throw new Error('Invalid response format.');
        }
    } catch (error) {
        console.error('Error fetching user ID:', error);
    }
}

async function get7TVEmoteSetID() {
    try {
        const response = await axios.get(`https://7tv.io/v3/users/${SevenTVID}`);
        const data = response.data;
        data.connections.forEach(connection => {
            if (connection.platform === 'TWITCH' && connection.emote_set) {
                SevenTVemoteSetId = connection.emote_set.id;
                console.log(FgBlue + 'Emote Set ID:', SevenTVemoteSetId + FgWhite);
            }
        });
    } catch (error) {
        console.error('Error fetching emote set ID:', error);
    }
}

async function fetch7TVEmoteData(emoteSet) {
    try {
        const response = await axios.get(`https://7tv.io/v3/emote-sets/${emoteSet}`);
        const data = response.data;
        if (emoteSet === 'global') {
            SevenTVGlobalEmoteData = data.emotes.map(emote => ({
                name: emote.name,
                url: `https://cdn.7tv.app/emote/${emote.id}/4x.webp`,
                flags: emote.flags,
                site: '7TV'
            }));
            console.log(FgBlue + 'Success in getting Global 7TV emotes!' + FgWhite);
        } else {
            SevenTVEmoteData = data.emotes.map(emote => ({
                name: emote.name,
                url: `https://cdn.7tv.app/emote/${emote.id}/4x.webp`,
                flags: emote.flags,
                site: '7TV'
            }));
            console.log(FgBlue + 'Success in getting Channel 7TV emotes!' + FgWhite);
        }
    } catch (error) {
        console.error('Error fetching emote data:', error);
        throw error;
    }
}

async function fetchFFZGlobalEmotes() {
    try {
        const response = await axios.get(`https://api.frankerfacez.com/v1/set/global`);
        const data = response.data;
        FFZGlobalEmoteData = data.sets[data.default_sets[0]].emoticons.map(emote => ({
            name: emote.name,
            url: emote.animated ? `https://cdn.frankerfacez.com/emote/${emote.id}/animated/4` : `https://cdn.frankerfacez.com/emote/${emote.id}/4`,
            site: 'FFZ'
        }));

        console.log(FgGreen + 'Success in getting Global FrankerFaceZ emotes!' + FgWhite);
    } catch (error) {
        console.error('Error fetching FFZ global emotes:', error);
        throw error;
    }
}

async function fetchFFZEmotes() {
    try {
        const response = await axios.get(`https://api.frankerfacez.com/v1/room/id/${channelTwitchID}`);
        const data = response.data;
        FFZEmoteData = data.sets[data.room.set].emoticons.map(emote => ({
            name: emote.name,
            url: emote.animated ? `https://cdn.frankerfacez.com/emote/${emote.id}/animated/4` : `https://cdn.frankerfacez.com/emote/${emote.id}/4`,
            site: 'FFZ'
        }));
        console.log(FgGreen + 'Success in getting Channel FrankerFaceZ emotes!' + FgWhite);
    } catch (error) {
        console.error('Error fetching FFZ user emotes:', error);
        throw error;
    }
}

async function fetchBTTVGlobalEmoteData() {
    try {
        const response = await axios.get(`https://api.betterttv.net/3/cached/emotes/global`);
        const data = response.data;
        BBTVGlobalEmoteData = data.map(emote => ({
            name: emote.code,
            url: `https://cdn.betterttv.net/emote/${emote.id}/3x`,
            site: 'BTTV'
        }));
        console.log(FgRed + 'Success in getting Global BetterTTV emotes!' + FgWhite);
    } catch (error) {
        console.error('Error fetching emote data:', error);
        throw error;
    }
}

async function fetchBTTVEmoteData() {
    try {
        const response = await axios.get(`https://api.betterttv.net/3/cached/users/twitch/${channelTwitchID}`);
        const data = response.data;

        const sharedEmotesData = data.sharedEmotes.map(emote => ({
            name: emote.code,
            url: `https://cdn.betterttv.net/emote/${emote.id}/3x`,
            site: 'BTTV'
        }));

        const channelEmotesData = data.channelEmotes.map(emote => ({
            name: emote.code,
            url: `https://cdn.betterttv.net/emote/${emote.id}/3x`,
            site: 'BTTV'
        }));

        BBTVEmoteData = [...sharedEmotesData, ...channelEmotesData];

        console.log(FgRed + 'Success in getting Channel BetterTTV emotes!' + FgWhite);
    } catch (error) {
        console.error('Error fetching emote data:', error);
        throw error;
    }
}

async function fetchTTVEmoteData() {
    try {
        const response = await fetch(`https://api.twitch.tv/helix/chat/emotes?broadcaster_id=${channelTwitchID}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${userToken}`,
                'Client-ID': clientId
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        TTVEmoteData = data.data.map(emote => ({
            name: emote.name,
            url: `https://static-cdn.jtvnw.net/emoticons/v2/${emote.id}/default/dark/3.0`,
            site: 'TTV'
        }));
        console.log(FgMagenta + 'Success in getting TTV emotes!' + FgWhite)
    } catch (error) {
        console.log('Error fetching user ID:', error);
    }
}

function sanitizeFileName(name) {
    return name.replace(/[<>:"\/\\|?*]/g, '');
}

async function downloadFile(url, filepath) {
    const writer = fs.createWriteStream(filepath);
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

const emotesDir = path.join(__dirname, 'emotes');
if (!fs.existsSync(emotesDir)) {
    fs.mkdirSync(emotesDir);
}

async function downloadEmotes() {
    const selectedEmotes = [];
    while (selectedEmotes.length < emotesToDownload && allEmoteData.length > 0) {
        const randomIndex = Math.floor(Math.random() * allEmoteData.length);
        selectedEmotes.push(allEmoteData.splice(randomIndex, 1)[0]);
    }

    for (const emote of selectedEmotes) {
        const url = emote.url;
        const name = sanitizeFileName(emote.name);
        const originalExtension = path.extname(url).split('?')[0] || '.webp';
        const originalFilepath = path.join(emotesDir, name + originalExtension);
        const webpFilepath = path.join(emotesDir, name + '.webp');

        console.log(`Downloading ${name} from ${url}...`);
        await downloadFile(url, originalFilepath);

        if (!originalFilepath.endsWith('.webp') && originalFilepath.endsWith('.0') && convertTTVEmotes) {
            let newFilepath = originalFilepath.replace(/0$/, 'webp');

            ffmpeg(originalFilepath)
                .output(newFilepath)
                .outputOptions('-vf', 'scale=iw:ih', '-q:v', '125')
                .on('end', () => {
                    console.log(`${originalFilepath} Converted to ${newFilepath}`);

                    fs.unlink(originalFilepath, (err) => {
                        if (err) {
                            console.error('Error deleting original file:', err);
                        }
                    });
                })
                .on('error', (err) => {
                    console.error('Error:', err);
                })
                .run();
        }
    }
    console.log("Download complete.");
}
