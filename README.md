"# DownloadTwitchEmotesA JavaScript tool to download Twitch, 7TV, FrankerFaceZ, and BetterTwitchTV emotes for a specified user.
## Installation1. 
**Download Node.js**
Ensure that Node.js is installed on your machine. 
It includes the `fs` and `path` modules needed for this script.

2. **Install Dependencies**

Open your terminal and run the following commands to install the required modules:
   ```
   npm install axios
   npm install fluent-ffmpeg
   ```

## Usage1. 

**Configure the Script**   

Open the script file and replace the placeholders with the appropriate values:
   - `channelTwitchID`: The Twitch User ID of the broadcaster.
   - `channelTwitchName`: The Twitch username of the broadcaster.

   **Example:**
   ```
   channelTwitchID: 71092938   
   channelTwitchName: xqc
   ```

2. **Additional Settings**

   Configure any other settings as required by your use case.

## Downloading Twitch Emotes

1. **Generate a Token**

   Visit [Twitch Token Generator](https://twitchtokengenerator.com/) to generate an access token.

2. **Replace Tokens**

   In the script, replace the placeholders with your generated token and client ID:
   - `userToken`: Your access token.
   - `clientId`: Your client ID.

   **Example (Fake Tokens):**
   ```
   userToken: k7zv8n3k5qrp9x2c5sy6hj1m4tb7wl
   clientId: bx173zkkhnfdvqwja9u318sm4ty5c2
   ```
