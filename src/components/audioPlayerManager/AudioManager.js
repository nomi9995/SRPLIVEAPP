import AudioRecorderPlayer from "react-native-audio-recorder-player";

let audioRecorderPlayer = undefined;
let currentPath = undefined;
let currentCallback = () => {};
let currentPosition = 0;

const AUDIO_STATUS = {
  play: "play",
  begin: "begin",
  pause: "pause",
  resume: "resume",
  stop: "stop",
};
async function startPlayer(path, callback) {
  // console.log({currentPath, path});

  if (currentPath === undefined) {
    console.log("currentPath", currentPath);
    currentPath = path;
    currentCallback = callback;
  } else if (currentPath !== path) {
    if (audioRecorderPlayer !== undefined) {
      try {
        await stopPlayer();
      } catch (error) {
        console.log("ERROR STOP PLAYER TOP");
      }
    }
    currentPath = path;
    currentCallback = callback;
  } else {
    console.log("here");
  }

  if (audioRecorderPlayer === undefined) {
    audioRecorderPlayer = new AudioRecorderPlayer();
  }

  try {
    let activePath = undefined;
    if (currentPath === path && currentPosition > 0) {
      activePath = await audioRecorderPlayer.resumePlayer();
      console.log("resume");
    } else {
      console.log("start new");

      activePath = await audioRecorderPlayer.startPlayer(currentPath);
    }
    console.log(activePath, currentPosition);
    currentCallback({
      status:
        currentPath === path && currentPosition > 0
          ? AUDIO_STATUS.resume
          : AUDIO_STATUS.begin,
    });
    audioRecorderPlayer.addPlayBackListener(async (e) => {
      currentPosition = e.currentPosition;
      currentCallback({
        status: AUDIO_STATUS.play,
        data: e,
        audio_playTime:
          audioRecorderPlayer
            .mmssss(Math.floor(e.currentPosition))
            .toString()
            .split(":")[0] +
          ":" +
          audioRecorderPlayer
            .mmssss(Math.floor(e.currentPosition))
            .toString()
            .split(":")[1],
      });
      if (e.currentPosition == e.duration) {
        try {
          await stopPlayer();
        } catch (error) {
          console.log("ERROR STOP PLAYER IN LISTENER");
        }
      }
      return;
    });
  } catch (error) {
    console.log({ "ERROR PLAY PLAYER": error });
  }
}

async function pausePlayer() {
  try {
    await audioRecorderPlayer.pausePlayer();
    currentCallback({ status: AUDIO_STATUS.pause });
  } catch (error) {
    console.log({ "ERROR PAUSE PLAYER": error });
  }
}

async function stopPlayer() {
  const isStop = await audioRecorderPlayer.stopPlayer();
  console.log({ isStop });
  audioRecorderPlayer.removePlayBackListener();
  currentPosition = 0;
  currentPath = undefined;
  currentCallback({ status: AUDIO_STATUS.stop });
  audioRecorderPlayer = undefined;
}

export { AUDIO_STATUS, startPlayer, stopPlayer, pausePlayer };
