import {
  StatusBar,
  Platform,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
  Dimensions,
  PermissionsAndroid,
} from "react-native";
import RNFetchBlob from "rn-fetch-blob";
import appConfig from "../utils/appConfig";
import Toast from "react-native-simple-toast";
import { Image, Video } from "react-native-compressor";

export const { OS } = Platform;

export const TouchableFeedback =
  OS === "ios" ? TouchableWithoutFeedback : TouchableNativeFeedback;

const { config, fs } = RNFetchBlob;
const { dirs } = RNFetchBlob.fs;

export const regex = {
  getMessages: (element, selectedUser, loginUSer) => {
    let message = {
      ack_count: element?.ack_count,
      ack_required: element.ack_required,
      avatar: element.avatar,
      chat_type: element.chat_type,
      every: element.every || null,
      first_name: element.first_name,
      id: element.id,
      idx: element.idx,
      is_edited: element.is_edited,
      is_expired: element.is_expired || null,
      is_read: element.is_read || null,
      is_repeat: element.is_repeat || null,
      is_reply_later: element.is_reply_later || null,
      is_set_remind: element.is_set_remind || null,
      last_name: element.last_name,
      message: element.message,
      my_star: element.my_star || null,
      occurrence: element.occurrence || null,
      sender_id: element.sender_id,
      status: element.status,
      task_content: element.task_content || null,
      task_start_at: element.task_start_at || null,
      task_type: element.task_type || null,
      time: element.time,
      createdAt: element.time,
      type: element.type,
      updated_at: element.updated_at,
      chatUser:
        selectedUser?.user_id === undefined
          ? selectedUser
          : selectedUser?.user_id,
      onlineUser: loginUSer.id,
      is_room:
        element.is_room == 0 || element.is_room == undefined
          ? 0
          : element.is_room == 1
          ? 1
          : 1,
      user_name: element.user_name,
      _id: element.id,
      user: {
        _id: element.sender_id === loginUSer.id ? 2 : 1,
      },
    };
    return message;
  },
  sendMessage: (
    element,
    randomId,
    messageType,
    idx,
    loginUSer,
    sendMessage
  ) => {
    let message = {
      ack_count: 0,
      ack_required: 0,
      avatar: loginUSer.avatar,
      chat_type: element.is_room === 0 ? "private" : "group",
      every: null,
      first_name: loginUSer.first_name,
      id: randomId,
      idx: idx,
      is_edited: 0,
      is_expired: null,
      is_read: null,
      is_repeat: null,
      is_reply_later: null,
      is_set_remind: null,
      last_name: loginUSer.last_name,
      message: sendMessage,
      my_star: null,
      occurrence: null,
      sender_id: loginUSer.id,
      status: 10,
      task_content: null,
      task_start_at: null,
      task_type: null,
      time: null,
      type: messageType,
      updated_at: null,
      chatUser: element.user_id === undefined ? element.id : element.user_id,
      onlineUser: loginUSer.id,
      is_room: element.is_room == 0 ? 0 : element.is_room == 1 ? 1 : 1,
      user_name: loginUSer.user_name,
      _id: randomId,
      user: {
        _id: 2,
      },
    };
    return message;
  },
  sendReplyMessage: (selectedMessage, newMessage, replySendMessageType) => {
    let msg_data = {};
    let new_msg_data = {};
    new_msg_data["new_content"] = newMessage;
    new_msg_data["new_type"] = replySendMessageType;
    let reply_msg_data = {};

    if (selectedMessage.type == 8) {
      let replyParseMessage = JSON.parse(selectedMessage.message).new_message;
      reply_msg_data["reply_id"] = selectedMessage._id;
      reply_msg_data["reply_content"] = replyParseMessage.new_content;
      reply_msg_data["reply_type"] = replyParseMessage.new_type;
      reply_msg_data["reply_from"] = selectedMessage.first_name;
      reply_msg_data["reply_from_id"] = selectedMessage.onlineUser;
    } else {
      reply_msg_data["reply_id"] = selectedMessage._id;
      reply_msg_data["reply_content"] = selectedMessage.message;
      reply_msg_data["reply_type"] = selectedMessage.type;
      reply_msg_data["reply_from"] = selectedMessage.first_name;
      reply_msg_data["reply_from_id"] = selectedMessage.onlineUser;
    }

    msg_data["reply_message"] = reply_msg_data;
    msg_data["new_message"] = new_msg_data;

    return JSON.stringify(msg_data);
  },
};

export const onDownload = {
  checkPermission: () => {
    return PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    );
  },

  checkDirectory: (path) => {
    return RNFetchBlob.fs.isDir(path);
  },

  makeNewDirectory: (path) => {
    return RNFetchBlob.fs.mkdir(path);
  },

  downloadFile: (data, type, callback) => {
    let res = null;
    onDownload.checkPermission().then((isPermited) => {
      const folderPath = `/storage/emulated/0/Android/media/com.srp_live/${type}`;
      const filePath = folderPath + "/" + data;

      if (isPermited) {
        RNFetchBlob.fs.isDir(folderPath).then(async (isDir) => {
          if (isDir) {
            res = await onDownload.addFile(filePath, data, type);
            callback(res);
          } else {
            RNFetchBlob.fs
              .mkdir(folderPath)
              .then(async () => {
                res = await onDownload.addFile(filePath, data, type);
                callback(res);
              })
              .catch((e) => console.log("makeDirError: ", e));
          }
        });
      } else {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        ).then((isPermited) => {
          if (isPermited) {
            RNFetchBlob.fs.isDir(folderPath).then(async (isDir) => {
              if (isDir) {
                res = await onDownload.addFile(filePath, data, type);
                callback(res);
              } else {
                RNFetchBlob.fs.mkdir(folderPath).then(async () => {
                  res = await onDownload.addFile(filePath, data, type);
                  callback(res);
                });
              }
            });
          }
        });
      }
    });
  },

  downloadFileIos: (data, type, callback) => {
    const folderPath = `${fs.dirs.DocumentDir}/srp_live/${type}`;
    const filePath = folderPath + "/" + data;
    let res;
    RNFetchBlob.fs.isDir(folderPath).then(async (isDir) => {
      if (isDir) {
        res = await onDownload.addFile(filePath, data, type);
        callback(res);
      } else {
        RNFetchBlob.fs
          .mkdir(folderPath)
          .then(async () => {
            res = await onDownload.addFile(filePath, data, type);
            callback(res);
          })
          .catch((e) => console.log("makeDirError: ", e));
      }
    });
  },

  addFile: async (filePath, data, type) => {
    let url = "";
    if (type === "Files") {
      url = appConfig.filePath + data;
    } else if (type === "Images") {
      url = appConfig.imageLargePath + data;
    } else if (type === "Videos") {
      url = appConfig.videoImagePath + data;
    } else if (type === "Audios") {
      url = appConfig.adiouPath + data;
    }
    url = url.replace(/ /g, "%20");
    const downloadRes = await RNFetchBlob.config({
      path: filePath,
    }).fetch("GET", url);

    return downloadRes;
  },

  checkExistingMedia: (media, type) => {
    let path =
      Platform.OS == "ios"
        ? `${fs.dirs.DocumentDir}/srp_live/${type}/${media}`
        : appConfig.localPath + type + "/" + media;
    return RNFetchBlob.fs.exists(path);
  },
  checkExistingMediaSend: (media, type) => {
    let path =
      Platform.OS == "ios"
        ? `${fs.dirs.DocumentDir}/srp_live/${type}/Sent/${media}`
        : appConfig.localPath + type + "/Sent" + "/" + media;
    return RNFetchBlob.fs.exists(path);
  },

  doCopy: (src, des) => {
    console.log("src: ", src);
    console.log("des: ", des);
    RNFetchBlob.fs
      .cp(src, des)
      .then(() => {
        console.log("Copied Successfully");
      })
      .catch((err) => {
        console.log("copyError: ", err);
      });
  },

  copyFileAndroid: (src, names, type) => {
    src.forEach((element, index) => {
      let url = "";
      let name = "";
      if (type === 2) {
        url = appConfig.localPath + "Images/Sent";
        name = `/${names[index]}`;
      } else if (type === 6) {
        url = appConfig.localPath + "Files/Sent";
        name = `/${names[index]?.name}`;
      } else if (type === 7) {
        url = appConfig.localPath + "Audios/Sent";
        name = `/${names[index]?.name}`;
      } else if (type === 11) {
        url = appConfig.localPath + "Videos/Sent";
        name = `/${names[index]?.name}`;
      }

      onDownload.checkPermission().then((isPermitted) => {
        if (isPermitted) {
          onDownload.checkDirectory(url).then(async (isDir) => {
            if (isDir) {
              if (type === 6) {
                onDownload.doCopy(element.fileCopyUri, url + name);
              } else if (type === 2) {
                const compressedMedia = await Image.compress(element.uri, {
                  quality: 0.8,
                });
                onDownload.doCopy(compressedMedia, url + name);
              } else if (type === 11) {
                const compressedMedia = await Video.compress(element.uri, {
                  compressionMethod: "auto",
                });
                onDownload.doCopy(compressedMedia, url + name);
              }
            } else {
              RNFetchBlob.fs
                .mkdir(url)
                .then(async (isDirMade) => {
                  if (isDirMade) {
                    if (type === 6) {
                      onDownload.doCopy(element.fileCopyUri, url + name);
                    } else if (type === 2) {
                      const compressedMedia = await Image.compress(
                        element.uri,
                        {
                          quality: 0.8,
                        }
                      );
                      onDownload.doCopy(compressedMedia, url + name);
                    } else if (type === 11) {
                      const compressedMedia = await Video.compress(
                        element.uri,
                        {
                          compressionMethod: "auto",
                        }
                      );
                      onDownload.doCopy(compressedMedia, url + name);
                    }
                  }
                })
                .catch((err) => {
                  console.log("makeDirError", err);
                });
            }
          });
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
          ).then((isPermitted) => {
            if (isPermitted) {
              onDownload.checkDirectory(url).then(async (isDir) => {
                if (isDir) {
                  if (type === 6) {
                    onDownload.doCopy(element.fileCopyUri, url + name);
                  } else if (type === 2) {
                    const compressedMedia = await Image.compress(element.uri, {
                      quality: 0.8,
                    });
                    onDownload.doCopy(compressedMedia, url + name);
                  } else if (type === 11) {
                    const compressedMedia = await Video.compress(element.uri, {
                      compressionMethod: "auto",
                    });
                    onDownload.doCopy(compressedMedia, url + name);
                  }
                } else {
                  RNFetchBlob.fs
                    .mkdir(url)
                    .then(async (isDirMade) => {
                      if (isDirMade) {
                        if (type === 6) {
                          onDownload.doCopy(element.fileCopyUri, url + name);
                        } else if (type === 2) {
                          const compressedMedia = await Image.compress(
                            element.uri,
                            {
                              quality: 0.8,
                            }
                          );
                          onDownload.doCopy(compressedMedia, url + name);
                        } else if (type === 11) {
                          const compressedMedia = await Video.compress(
                            element.uri,
                            {
                              compressionMethod: "auto",
                            }
                          );
                          onDownload.doCopy(compressedMedia, url + name);
                        }
                      }
                    })
                    .catch((err) => {
                      console.log("makeDirError", err);
                    });
                }
              });
            } else {
              Toast.show("Permission not granted", Toast.SHORT);
            }
          });
        }
      });
    });
  },

  copyFileIos: (src, names, type) => {
    src.forEach((element, index) => {
      let url = "";
      let name = "";
      if (type === 2) {
        url = fs.dirs.DocumentDir + "/srp_live/Images/Sent";
        name = `/${names[index]}`;
      } else if (type === 6) {
        url = fs.dirs.DocumentDir + "/srp_live/Files/Sent";
        name = `/${names[index]?.name}`;
      } else if (type === 7) {
        url = fs.dirs.DocumentDir + "/srp_live/Audios/Sent";
        name = `/${names[index]?.name}`;
      } else if (type === 11) {
        url = fs.dirs.DocumentDir + "/srp_live/Videos/Sent";
        name = `/${names[index]?.name}`;
      }

      RNFetchBlob.fs.isDir(url).then((isDir) => {
        if (isDir) {
          if (type === 11 || type === 6) {
            onDownload.doCopy(element.uri.slice(8), url + name);
          } else {
            onDownload.doCopy(element.uri, url + name);
          }
        } else {
          RNFetchBlob.fs
            .mkdir(url)
            .then((isDirMade) => {
              if (isDirMade) {
                onDownload.doCopy(element.uri, url + name);
              }
            })
            .catch((err) => {
              console.log("makeDirError", err);
            });
        }
      });
    });
  },

  copyFile: (src, names, type) => {
    if (Platform.OS == "android") {
      onDownload.copyFileAndroid(src, names, type);
    } else {
      onDownload.copyFileIos(src, names, type);
    }
  },
};

const X_WIDTH = 375;
const X_HEIGHT = 812;

const XSMAX_WIDTH = 414;
const XSMAX_HEIGHT = 896;

export const { height: W_HEIGHT, width: W_WIDTH } = Dimensions.get("window");

let isIPhoneX = false;

if (Platform.OS === "ios" && !Platform.isPad && !Platform.isTVOS) {
  isIPhoneX =
    (W_WIDTH === X_WIDTH && W_HEIGHT === X_HEIGHT) ||
    (W_WIDTH === XSMAX_WIDTH && W_HEIGHT === XSMAX_HEIGHT);
}

export function getStatusBarHeight(skipAndroid) {
  return Platform.select({
    ios: isIPhoneX ? 40 : 20,
    android: skipAndroid ? 0 : StatusBar.currentHeight,
    default: 0,
  });
}

export async function getFolderSize(mediaType, send = 0) {
  let FOLDER_PATH =
    Platform.OS == "ios"
      ? `${fs.dirs.DocumentDir}/srp_live/${mediaType}`
      : appConfig.localPath + mediaType;
  return {
    recieve: await getFolderSendRecSize(FOLDER_PATH, mediaType),
    send: await getFolderSendRecSize(FOLDER_PATH + "/Sent", mediaType),
  };
}
export async function getFolderSendRecSize(FOLDER_PATH, mediaType) {
  let sendFolder;
  let SendFolderSize = 0;
  let FolderSize = 0;
  console.log(FOLDER_PATH);
  return RNFetchBlob.fs
    .lstat(FOLDER_PATH)
    .then((result) => {
      console.log(`result${mediaType}:`, result);
      if (result?.length > 0) {
        sendFolder = result.filter((res) => res.type == "directory");
        if (sendFolder?.length > 0) {
          SendFolderSize = sendFolder[0]?.size;
        } else {
          SendFolderSize = 0;
        }
        result.map(
          (res) => (FolderSize = parseFloat(res.size) + parseFloat(FolderSize))
        );
        return parseFloat(FolderSize - SendFolderSize);
      } else {
        return 0;
      }
    })
    .catch((err) => {
      console.log("err", err);
      return 0;
    });
}

export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export const Header_Height =
  getStatusBarHeight() + (Platform.OS === "ios" ? 44 : 34);
