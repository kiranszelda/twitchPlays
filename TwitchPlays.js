import TwitchIRC from "./TwitchIRC.js";

// For executing commands
import { execSync } from "child_process";

// Your twitch username, all lowercase
const nickname = "placeholder_name";

// Requires a key with at minimum chat:read access
const token = "oauth:palceholder_token";

// Channel name to read from, all lowercase
const channel = "placeholder_channel";

// The do tool is what handles doing the action.
// The example here is xdotool which only runs on Xorg
const dotool = "xdotool";

// Write the main function here
// There's also an example
function onMessage(username, message) {
  if (message === "jump") {
    execSync(`${dotool} key space`);
  } else if (message === "left") {
    execSync(`${dotool} keyup d`);
    execSync(`${dotool} keydown a`);
  } else if (message === "right") {
    execSync(`${dotool} keyup a`);
    execSync(`${dotool} keydown d`);
  } else if (message === "forward") {
    execSync(`${dotool} keyup s`);
    execSync(`${dotool} keydown w`);
  } else if (message === "backward") {
    execSync(`${dotool} keyup w`);
    execSync(`${dotool} keydown s`);
  } else if (message === "stop") {
    execSync(`${dotool} keyup w`);
    execSync(`${dotool} keyup a`);
    execSync(`${dotool} keyup s`);
    execSync(`${dotool} keyup d`);
  } else {
    console.log("Not a command");
  }
}

// Behind the scenes code, hide this with code editor
{
  const IRC = new TwitchIRC(true, nickname, token, channel);

  IRC.connect();
  IRC.startRead(() => {
    onMessage(IRC.chatUsername, IRC.chatMessage);
  });
}
