# DownloadTwitchEmotes

## A handy JavaScript tool for downloading emotes from Twitch, 7TV, FrankerFaceZ, and BetterTwitchTV for any specified user.

## Installation. 

**Download Node.js**

Ensure that Node.js is installed on your machine.
It includes the `fs` and `path` modules needed for this script.

**Install Dependencies**

Open your terminal and run the following commands to install the required modules:
   ```
   npm install axios
   npm install fluent-ffmpeg
   ```

## Usage. 

**Configure the Script**   

Visit [Twitch Channel ID Converter](https://www.streamweasels.com/tools/convert-twitch-username-to-user-id/) to retrieve Twitch channel ID.

Open the script file and replace the placeholders with the appropriate values:
   - `channelTwitchID: The Twitch User ID of the broadcaster.`

**Example:**
   ```
   channelTwitchID: 71092938   
   ```

 **Additional Settings**

   Configure any other settings as required by your use case.

## Downloading Twitch Emotes

   **Generate a Token**

   Visit [Twitch Token Generator](https://twitchtokengenerator.com/) to generate an access token.

**Replace Tokens**

   In the script, replace the placeholders with your generated token and client ID:
   - `userToken: Your access token.`
   - `clientId: Your client ID.`

**Example (Fake Tokens):**
   ```
   userToken: k7zv8n3k5qrp9x2c5sy6hj1m4tb7wl
   clientId: bx173zkkhnfdvqwja9u318sm4ty5c2
   ```
