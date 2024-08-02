"# DownloadTwitchEmotes\n\nA JavaScript tool to download Twitch, 7TV, FrankerFaceZ, and BetterTwitchTV emotes for a specified user.\n\n
## Installation\n\n1. 
**Download Node.js**\n\n
Ensure that Node.js is installed on your machine. 
It includes the `fs` and `path` modules needed for this script.

\n\n2. **Install Dependencies**\n\n

Open your terminal and run the following commands to install the required modules:
\n\n   ```bash\n   npm install axios\n   ```
\n\n   ```bash\n   npm install fluent-ffmpeg\n   ```

\n\n## Usage\n\n1. 

**Configure the Script**\n\n   

Open the script file and replace the placeholders with the appropriate values:
\n\n   - `channelTwitchID`: The Twitch User ID of the broadcaster.
\n   - `channelTwitchName`: The Twitch username of the broadcaster.

\n\n   **Example:**
\n\n   ```javascript\n   channelTwitchID: 71092938\n   channelTwitchName: xqc\n   ```

\n\n2. **Additional Settings**

\n\n   Configure any other settings as required by your use case.

\n\n## Downloading Twitch Emotes

\n\n1. **Generate a Token**

\n\n   Visit [Twitch Token Generator](https://twitchtokengenerator.com/) to generate an access token.

\n\n2. **Replace Tokens**

\n\n   In the script, replace the placeholders with your generated token and client ID:
\n\n   - `userToken`: Your access token.
\n   - `clientId`: Your client ID.

\n\n   **Example (Fake Tokens):**
\n\n   ```javascript\n   userToken: k7zv8n3k5qrp9x2c5sy6hj1m4tb7wl\n   clientId: bx173zkkhnfdvqwja9u318sm4ty5c2\n   ```
