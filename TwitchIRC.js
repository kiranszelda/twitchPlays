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

  // TLS Connection configs
  const options = {
    host: "irc.chat.twitch.tv",
    port: this.port,
    rejectUnauthorized: false, // Bypass certificate hostname validation
  };

  this.connect = () => {
    this.client = tls.connect(options, () => {
      console.log("Connecting to Twitch IRC");

      // Authenticate with Twitch IRC
      this.client.write(`PASS ${token}\r\n`);
      this.client.write(`NICK ${nickname}\r\n`);
      this.client.write(`JOIN ${channel}\r\n`);
      console.log("Connected to Twitch IRC");
      return 1;
    });
  };

  // TODO: Fix this, weird async code is making this execute before connecting
  /*this.disconnect = () => {
    if (connected) {
      this.client.write(`PART #${channel}`);
      console.log("Disconnected to the Twitch IRC");
      connected = false;
    }
    };*/

  // TODO: Fix this as well, same issue as disconnect
  /*this.sendMessage = async (inputMessage) => {
    this.client.write(`PRIVMSG #kiranszelda :${inputMessage}\r\n`);
    };*/

  this.startRead = async (onRead) => {
    this.client.on("data", (data) => {
      // Get data in from :username!username@username.tmi.twitch.tv PRIVMSG #(channel) :(Message)
      // Send data in form PRIVMSG #(channel) :(Message)\r\n
      const messages = data.toString().split(`\r\n`);

      messages.forEach((message) => {
        if (!message) return;

        // Twitch sends a ping message which you have to reply to with PONG
        if (message.startsWith("PING")) {
          this.client.write("PONG :tmi.twitch.tv\r\n");
        }
        const match = message.match(
          /^:(\w+)!\w+@\w+\.tmi\.twitch\.tv PRIVMSG #\w+ :(.*)$/
        );
        if (match) {
          this.chatUsername = match[1];
          this.chatMessage = match[2];
          onRead();
        }
      });
    });
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
