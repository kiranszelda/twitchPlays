import tls from "tls";

export default function TwitchIRC(ssl, nickname, token, channel) {
  // Server configs
  this.port = ssl ? 6697 : 6667; // 6697 is SSL, use 6667 for non-SSL
  this.nickname = nickname;
  this.token = token;
  this.channel = channel;

  // Message and username declarations for startRead
  this.chatMessage;
  this.chatUsername;

  // Misc variables
  let connecting = false;
  let connected = false;
  this.reading = false;

  // TLS Connection configs
  const options = {
    host: "irc.chat.twitch.tv",
    port: this.port,
    rejectUnauthorized: false, // Bypass certificate hostname validation
  };

  this.connect = async () => {
    if (!connecting) {
      return new Promise((resolve) => {
        connecting = true;
        this.client = tls.connect(options, () => {
          console.log("Connecting to Twitch IRC");

          // Authenticate with Twitch IRC
          this.client.write(`PASS ${token}\r\n`);
          this.client.write(`NICK ${nickname}\r\n`);
          this.client.write(`JOIN ${channel}\r\n`);
          connected = true;
          console.log("Connected to Twitch IRC");
          resolve();
        });
      });
    } else {
      return new Promise((resolve) => {
        const connectingInterval = setInterval(() => {
          if (connected) {
            clearInterval(connectingInterval);
            resolve();
          }
        }, 100);
      });
    }
  };

  this.sendMessage = async (inputMessage) => {
    await this.connect();
    this.client.write(`PRIVMSG ${channel} :${inputMessage}\r\n`);
  };

  this.startRead = async (onRead) => {
    await this.connect();
    if (!this.reading) {
      console.log("Using the dev version");
      this.reading = true;
      this.client.on("data", (data) => {
        // Get data in from :username!username@username.tmi.twitch.tv PRIVMSG #(channel) :(Message)
        // Send data in form PRIVMSG #(channel) :(Message)\r\n
        const messages = data.toString().split(`\r\n`);

        if (!this.reading) {
          return;
        }
        messages.forEach((message) => {
          if (!message) return;

          // Twitch sends a ping message which you have to reply to with PONG
          if (message.startsWith("PING")) {
            this.client.write("PONG :tmi.twitch.tv\r\n");
          }
          const match = message.match(
            /^:(\w+)!\w+@\w+\.tmi\.twitch\.tv PRIVMSG #\w+ :(.*)$/ // I fucking hate javascrip regex
          );
          if (match) {
            this.chatUsername = match[1];
            this.chatMessage = match[2];
            onRead();
          }
        });
      });
    }
  };

  // TODO: Implement stopRead
  this.stopRead = () => {
    this.reading = false;
  };

  this.disconnect = async () => {
    await this.connect();
    this.client.end();
  };

  // Here to make sure client is defined
  if (this.client != undefined) {
    this.client.on("error", (err) => {
      console.error("Connection error:", err.message);
    });

    this.client.on("close", () => {
      console.log("Disconnected from Twitch IRC");
    });
  }
}
