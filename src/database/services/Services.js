import { ConnectableObservable } from "rxjs";
import SQLiteDB from "../connection";
import { TableFields } from "./TableFields";

export const ChatUsersQuieries = {
  create: (tableName) => {
    let fields = TableFields[tableName]();
    SQLiteDB().transaction(function (txn) {
      txn.executeSql(
        `CREATE TABLE ${tableName}(${fields})`,
        [],
        function (tx, res) {},
        (error) => {
          console.log("Table is Already Created " + error.message);
        }
      );
    });
  },

  getTableFields: (tableName) => {
    return SQLiteDB().transaction((txn) => {
      txn.executeSql(
        `PRAGMA table_info(${tableName});`,
        [],
        (sqlTxn, res) => {
          let len = res.rows.length;
          var resultItemIdArr = new Array();
          if (len > 0) {
            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i);
              resultItemIdArr.push(item);
            }
          }
        },
        (error) => {
          console.log("error on creating table " + error.message);
        }
      );
    });
  },

  selectDb: (offset, params, callback) => {
    let limit = 10;
    SQLiteDB().transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM users_list_table where online_user_id=${params.onlineUserId} AND last_message IS NOT NULL group by user_id,is_room  Order by last_message_time desc limit ${offset}, ${limit}`,
        [],
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            var resultItemIdArr = new Array();
            for (let i = 0; i < results.rows.length; ++i) {
              resultItemIdArr.push(results.rows.item(i));
            }
          } else {
            var resultItemIdArr = null;
          }
          callback(resultItemIdArr);
        },
        (error) => {
          console.log("error on select db table " + error.message);
        }
      );
    });
  },

  checkUserExsist: (params, callback) => {
    SQLiteDB().transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM users_list_table where user_id=${params.userId} AND online_user_id=${params.onlineUser} AND is_room=${params.isroom}`,
        [],
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            callback(true);
          } else {
            callback(false);
          }
        }
      );
    });
  },

  insertAndUpdateUserListonlogin: (tableName, data, onlineUser, callback) => {
    let allPromises = [];
    data.forEach((element) => {
      let isroom = element.is_room;
      let userId = element.user_id;
      var constring = "";
      let department = "";

      if (Array.isArray(element.user_departments)) {
        element?.user_departments?.forEach((element2) => {
          department += constring;
          department += element2.name;
          constring = ",";
        });
      } else {
        department = element.user_departments;
      }
      let p = new Promise((resolve, reject) => {
        ChatUsersQuieries.checkUserExsist(
          { userId, onlineUser, isroom },
          async (res) => {
            if (!res) {
              SQLiteDB().transaction((tx) => {
                tx.executeSql(
                  `INSERT INTO ${tableName} (
                  user_id,
                  avatar,
                  chat_meta_id,
                  chat_name,
                  connectycube_user_id,
                  is_room,
                  is_unread,
                  last_message,
                  last_message_status,
                  last_message_time,
                  last_message_type,
                  last_seen,
                  on_screen_chat_id,
                  online_status,
                  sender_id,
                  stories_count,
                  type,
                  unread_count,
                  user_departments,
                  user_name,
                  user_status,
                  online_user_id
                ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                  [
                    element.user_id,
                    element.avatar,
                    element.chat_meta_id,
                    element.chat_name,
                    element.connectycube_user_id || null,
                    element.is_room,
                    element.is_unread,
                    element.last_message,
                    element.last_message_status,
                    element.last_message_time,
                    element.last_message_type,
                    element.last_seen,
                    element.on_screen_chat_id,
                    element.online_status,
                    element.sender_id,
                    element.stories_count,
                    element.type,
                    element.unread_count,
                    department,
                    element.user_name,
                    element.user_status,
                    onlineUser,
                  ],
                  (tx, results) => {
                    resolve(res);
                  },
                  (error) => {
                    console.log("error on insert data " + error.message);
                  }
                );
              });
            } else {
              SQLiteDB().transaction((tx) => {
                tx.executeSql(
                  `UPDATE ${tableName} set
                  avatar=?,
                  chat_meta_id=? ,
                  chat_name=?,
                  is_room=?,
                  is_unread=?,
                  last_message=?,
                  last_message_status=?,
                  last_message_time=?,
                  last_message_type=?,
                  last_seen=?,
                  on_screen_chat_id=?,
                  online_status=?,
                  sender_id=?,
                  stories_count=?,
                  type=?,
                  unread_count=?,
                  user_departments=?,
                  user_name=?,
                  user_status=?
                  where user_id=${element.user_id} AND online_user_id=${onlineUser} AND is_room=${element.is_room}`,
                  [
                    element.avatar,
                    element.chat_meta_id,
                    element.chat_name,
                    element.is_room,
                    element.is_unread,
                    element.last_message,
                    element.last_message_status,
                    element.last_message_time,
                    element.last_message_type,
                    element.last_seen,
                    element.on_screen_chat_id,
                    element.online_status,
                    element.sender_id,
                    element.stories_count,
                    element.type,
                    element.unread_count,
                    element.user_departments,
                    element.user_name,
                    element.user_status,
                  ],
                  (tx, results) => {
                    resolve(res);
                  },
                  (error) => {
                    console.log("error on update data " + error.message);
                  }
                );
              });
            }
          }
        );
      });
      allPromises.push(p);
    });
    Promise.all(allPromises).then((res) => {
      callback(true);
    });
  },

  getAllUsersList: (offset, callback) => {
    SQLiteDB().transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM users_list_table Order by chat_name asc limit ${offset},100`,
        [],
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            var resultItemIdArr = new Array();
            for (let i = 0; i < results.rows.length; ++i) {
              resultItemIdArr.push(results.rows.item(i));
            }
          } else {
            var resultItemIdArr = null;
          }
          callback(resultItemIdArr);
        },
        (error) => {
          console.log("error on getAllUsersList " + error.message);
        }
      );
    });
  },

  insertAndUpdateUserList: (tableName, data, onlineUser) => {
    data.forEach((element) => {
      let userId = element.user_id;
      let isroom = element.is_room;
      ChatUsersQuieries.checkUserExsist(
        { userId, onlineUser, isroom },
        async (res) => {
          if (!res) {
            SQLiteDB().transaction((tx) => {
              tx.executeSql(
                `INSERT INTO ${tableName} (
                user_id,
                avatar,
                chat_meta_id,
                chat_name,
                is_room,
                is_unread,
                last_message,
                last_message_status,
                last_message_time,
                last_message_type,
                last_seen,
                on_screen_chat_id,
                online_status,
                sender_id,
                stories_count,
                type,
                unread_count,
                user_departments,
                user_name,
                user_status,
                online_user_id
              ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                [
                  element.user_id,
                  element.avatar,
                  element.chat_meta_id,
                  element.chat_name,
                  element.is_room,
                  element.is_unread,
                  element.last_message,
                  element.last_message_status,
                  element.last_message_time,
                  element.last_message_type,
                  element.last_seen,
                  element.on_screen_chat_id,
                  element.online_status,
                  element.sender_id,
                  element.stories_count,
                  element.type,
                  element.unread_count,
                  element.user_departments,
                  element.user_name,
                  element.user_status,
                  onlineUser,
                ],
                (tx, results) => {
                  callBack(true);
                },
                (error) => {
                  console.log("error on insert data " + error.message);
                }
              );
            });
          } else {
            SQLiteDB().transaction((tx) => {
              tx.executeSql(
                `UPDATE ${tableName} set
                avatar=?,
                chat_meta_id=? ,
                chat_name=?,
                is_room=?,
                is_unread=?,
                last_message=?,
                last_message_status=?,
                last_message_time=?,
                last_message_type=?,
                last_seen=?,
                on_screen_chat_id=?,
                online_status=?,
                sender_id=?,
                stories_count=?,
                type=?,
                unread_count=?,
                user_departments=?,
                user_name=?,
                user_status=?
                where user_id=${element.user_id} AND online_user_id=${onlineUser}`,
                [
                  element.avatar,
                  element.chat_meta_id,
                  element.chat_name,
                  element.is_room,
                  element.is_unread,
                  element.last_message,
                  element.last_message_status,
                  element.last_message_time,
                  element.last_message_type,
                  element.last_seen,
                  element.on_screen_chat_id,
                  element.online_status,
                  element.sender_id,
                  element.stories_count,
                  element.type,
                  element.unread_count,
                  element.user_departments,
                  element.user_name,
                  element.user_status,
                ],
                (tx, results) => {
                  callBack(true);
                },
                (error) => {
                  console.log("error on update data " + error.message);
                }
              );
            });
          }
        }
      );
    });
  },

  delete: (tableName, data) => {
    SQLiteDB().transaction((tx) => {
      tx.executeSql("Drop table users_list_table", [], (tx, results) => {});
    });
  },
};

export const MessagesQuieries = {
  create: (tableName) => {
    let fields = TableFields[tableName]();
    SQLiteDB().transaction(function (txn) {
      txn.executeSql(
        `CREATE TABLE ${tableName}(${fields})`,
        [],
        function (tx, res) {},
        (error) => {
          console.log("Table is Already Created " + error.message);
        }
      );
    });
  },

  selectDb: (params, callback) => {
    // console.log('paramss',params)
    let limit = 100;
    SQLiteDB().transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM messages_list_table where onlineUser=${params.onlineUserId} AND chatUser=${params.chatUserId} AND is_room = ${params.isroom} group by id Order by idx desc limit ${params.offset}, ${limit}`,
        [],
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            var resultItemIdArr = new Array();
            for (let i = 0; i < results.rows.length; ++i) {
              resultItemIdArr.push(results.rows.item(i));
            }
          } else {
            var resultItemIdArr = null;
          }
          callback(resultItemIdArr);
        }
      );
    });
  },

  selectDbSingleListmessage: (params, callback) => {
    SQLiteDB().transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM messages_list_table where onlineUser=${params.onlineUserId} AND chatUser=${params.chatUserId} AND my_star=${params.mystar}`,
        [],
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            var resultItemIdArr = new Array();
            for (let i = 0; i < results.rows.length; ++i) {
              resultItemIdArr.push(results.rows.item(i));
            }
          } else {
            var resultItemIdArr = null;
          }
          callback(resultItemIdArr);
        }
      );
    });
  },

  selectDbSingleListmessageReppondLater: (params, callback) => {
    SQLiteDB().transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM messages_list_table where onlineUser=${params.onlineUserId} AND chatUser=${params.chatUserId} AND is_reply_later=${params.respondLater}`,
        [],
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            var resultItemIdArr = new Array();
            for (let i = 0; i < results.rows.length; ++i) {
              resultItemIdArr.push(results.rows.item(i));
            }
          } else {
            var resultItemIdArr = null;
          }
          callback(resultItemIdArr);
        }
      );
    });
  },

  selectDbSingleListmessageackrequested: (params, callback) => {
    SQLiteDB().transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM messages_list_table where onlineUser=${params.onlineUserId} AND chatUser=${params.chatUserId} AND ack_required=${params.ackrequested}`,
        [],
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            var resultItemIdArr = new Array();
            for (let i = 0; i < results.rows.length; ++i) {
              resultItemIdArr.push(results.rows.item(i));
            }
          } else {
            var resultItemIdArr = null;
          }
          callback(resultItemIdArr);
        }
      );
    });
  },

  selectDbById: (params, callback) => {
    SQLiteDB().transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM messages_list_table where onlineUser=${params.onlineUserId} AND chatUser=${params.chatUserId} AND id=${params.id}`,
        [],
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            var resultItemIdArr = new Array();
            for (let i = 0; i < results.rows.length; ++i) {
              resultItemIdArr.push(results.rows.item(i));
            }
          } else {
            var resultItemIdArr = null;
          }
          callback(resultItemIdArr);
        }
      );
    });
  },

  searchMsgDb: (params, callback) => {
    SQLiteDB().transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM messages_list_table WHERE onlineUser=${params.onlineUser} AND chatUser=${params.chatUser} AND type=1 AND message LIKE '%${params.text}%'`,
        [],
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            var resultItemIdArr = new Array();
            for (let i = 0; i < results.rows.length; ++i) {
              resultItemIdArr.push(results.rows.item(i));
            }
          } else {
            var resultItemIdArr = null;
          }
          callback(resultItemIdArr);
        }
      );
    });
  },

  getSearchBasedMsgs: async (params, callback) => {
    SQLiteDB().transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM messages_list_table WHERE onlineUser=${params.onlineUserId} AND chatUser=${params.chatUserId} AND is_room = ${params.isroom} group by id order by time desc
        LIMIT ${params.offset} , 40
        `,
        [],
        (tx, results) => {
          tx;
          var len = results.rows.length;
          if (len > 0) {
            var resultItemIdArr = new Array();
            for (let i = 0; i < results.rows.length; ++i) {
              resultItemIdArr.push(results.rows.item(i));
            }
          } else {
            var resultItemIdArr = null;
          }
          callback(resultItemIdArr);
        },
        (error) => {
          console.log(
            "Error on getting search message list data: ",
            error.message
          );
        }
      );
    });
    // MessagesQuieries.getMessageOffset({ onlineUserId, chatUserId, isroom, msgId },
    //   async res => {
    //     res = res - 20;

    //   });
  },

  getMessageOffset: (params, callback) => {
    SQLiteDB().transaction((tx) => {
      tx.executeSql(
        `SELECT COUNT(id) FROM messages_list_table WHERE onlineUser=${params.onlineUserId} AND chatUser=${params.chatUserId} AND is_room = ${params.isroom} AND id >= ${params.msgId}  group by id`,
        [],
        (tx, results) => {
          callback(results.rows.length);
        },
        (error) => {
          console.log(
            "Error on getting offset message list data: ",
            error.message
          );
        }
      );
    });
  },

  searchMsgAndUserListDb: (params, callback) => {
    SQLiteDB().transaction((tx) => {
      tx.executeSql(
        // `SELECT * FROM users_list_table `,
        `SELECT * FROM users_list_table WHERE online_user_id=${params.onlineUser}  AND chat_name LIKE '%${params.text}%'  `,
        [],
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            var resultItemIdArr = new Array();
            for (let i = 0; i < results.rows.length; ++i) {
              resultItemIdArr.push(results.rows.item(i));
            }
          } else {
            var resultItemIdArr = [];
          }
          callback(resultItemIdArr);
        }
      );
    });
  },

  searchMsgListDb: (params, callback) => {
    SQLiteDB().transaction((tx) => {
      tx.executeSql(
        `SELECT messages_list_table._id, messages_list_table.message , messages_list_table.time , users_list_table.* FROM  messages_list_table , users_list_table  WHERE messages_list_table.onlineUser=${params.onlineUser} AND messages_list_table.type=1 AND users_list_table.user_id = messages_list_table.chatUser AND messages_list_table.is_room = users_list_table.is_room AND (${params.subQuery}) group by messages_list_table.id ORDER By messages_list_table.time desc LIMIT 100`,
        // `SELECT messages_list_table._id, messages_list_table.message , messages_list_table.time , users_list_table.* FROM  messages_list_table , users_list_table  WHERE onlineUser=${params.onlineUser} AND messages_list_table.type=1 AND users_list_table.user_id = chatUser AND message LIKE '%${params.text}%' group by users_list_table.user_id  Limit 10`,
        // `SELECT * FROM messages_list_table.`,
        [],
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            var resultItemIdArr = new Array();
            for (let i = 0; i < results.rows.length; ++i) {
              resultItemIdArr.push(results.rows.item(i));
            }
          } else {
            var resultItemIdArr = [];
          }
          callback(resultItemIdArr);
        },
        (error) => {
          console.log("error on search message data " + error.message);
        }
      );
    });
  },

  filterMsgDb: (params, callback) => {
    SQLiteDB().transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM messages_list_table WHERE onlineUser='${params.onlineUser}' AND chatUser='${params.chatUser}' AND time BETWEEN '${params.firstdate}' AND  '${params.seconddate}' order by id desc`,
        [],
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            var resultItemIdArr = new Array();
            for (let i = 0; i < results.rows.length; ++i) {
              resultItemIdArr.push(results.rows.item(i));
            }
          } else {
            var resultItemIdArr = null;
          }
          callback(resultItemIdArr);
        },
        (error) => {
          console.log("error on creating table " + error.message);
        }
      );
    });
  },

  getTableFields: (tableName) => {
    return SQLiteDB().transaction((txn) => {
      txn.executeSql(
        `PRAGMA table_info(${tableName});`,
        [],
        (sqlTxn, res) => {
          let len = res.rows.length;
          var resultItemIdArr = new Array();
          if (len > 0) {
            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i);
              resultItemIdArr.push(item);
            }
          }
        },
        (error) => {
          console.log("error on creating table " + error.message);
        }
      );
    });
  },

  checkMessageExsist: (params, callback) => {
    SQLiteDB().transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM messages_list_table where is_room=${params.isRoom} AND onlineUser=${params.onlineUserId} AND chatUser=${params.chatUserId} AND idx=${params.msgIdx}`,
        [],
        (tx, results) => {
          let len = results.rows.length;
          if (len > 0) {
            callback(true);
          } else {
            callback(false);
          }
        },
        (error) => {
          console.log("error on select data from table " + error.message);
        }
      );
    });
  },

  checkMessageExsistMessageScreen: (params, callback) => {
    SQLiteDB().transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM messages_list_table where is_room=${params.isRoom} AND onlineUser=${params.onlineUserId} AND chatUser=${params.chatUserId} AND id=${params.msgId}`,
        [],
        (tx, results) => {
          let len = results.rows.length;
          if (len > 0) {
            callback(true);
          } else {
            callback(false);
          }
        },
        (error) => {
          console.log("error on select data from table " + error.message);
        }
      );
    });
  },

  insertAndUpdateMessageList: (params, callback) => {
    let allPromises = [];
    params.resp.data.data.forEach((userList) => {
      let isRoom = userList.is_room;
      let chatUserId =
        userList.is_room === 0 ? userList.user_id : userList.room_id;
      let onlineUserId = params.onlineUserId;

      userList.chats.forEach((msgsList) => {
        let msgIdx = msgsList.idx;
        let p = new Promise((resolve, reject) => {
          MessagesQuieries.checkMessageExsist(
            { isRoom, chatUserId, onlineUserId, msgIdx },
            async (res) => {
              if (!res) {
                SQLiteDB().transaction((tx) => {
                  tx.executeSql(
                    `INSERT INTO ${params.tableName} (
                  ack_count,
                  ack_required,
                  avatar,
                  chat_type,
                  every,
                  first_name,
                  id,
                  idx,
                  is_edited,
                  is_expired,
                  is_read,
                  is_repeat,
                  is_reply_later,
                  is_set_remind,
                  last_name,
                  message,
                  my_star,
                  occurrence,
                  sender_id,
                  status,
                  task_content,
                  task_start_at,
                  task_type,
                  time,
                  type,
                  updated_at,
                  chatUser,
                  onlineUser,
                  is_room,
                  user_name,
                  _id
                ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                    [
                      msgsList.ack_count,
                      msgsList.ack_required,
                      msgsList.avatar,
                      msgsList.chat_type,
                      msgsList.every,
                      msgsList.first_name,
                      msgsList.id,
                      msgsList.idx,
                      msgsList.is_edited,
                      msgsList.is_expired,
                      msgsList.is_read,
                      msgsList.is_repeat,
                      msgsList.is_reply_later,
                      msgsList.is_set_remind,
                      msgsList.last_name,
                      msgsList.message,
                      msgsList.my_star,
                      msgsList.occurrence,
                      msgsList.sender_id,
                      msgsList.status,
                      msgsList.task_content,
                      msgsList.task_start_at,
                      msgsList.task_type,
                      msgsList.time,
                      msgsList.type,
                      msgsList.updated_at,
                      chatUserId,
                      onlineUserId,
                      isRoom,
                      msgsList.user_name,
                      msgsList.id,
                    ],
                    (tx, results) => {
                      resolve(res);
                    },
                    (error) => {
                      console.log("error on insert data " + error.message);
                    }
                  );
                });
              } else {
                SQLiteDB().transaction((tx) => {
                  tx.executeSql(
                    `UPDATE ${params.tableName} set
                  ack_count=?,
                  ack_required=?,
                  avatar=?,
                  chat_type=?,
                  every=?,
                  first_name=?,
                  id=?,
                  is_edited=?,
                  is_expired=?,
                  is_read=?,
                  is_repeat=?,
                  is_reply_later=?,
                  is_set_remind=?,
                  last_name=?,
                  message=?,
                  my_star=?,
                  occurrence=?,
                  sender_id=?,
                  status=?,
                  task_content=?,
                  task_start_at=?,
                  task_type=?,
                  time=?,
                  type=?,
                  updated_at=?,
                  user_name=?,
                  _id=?
                  where is_room=${isRoom} AND onlineUser=${onlineUserId} AND chatUser=${chatUserId} AND idx=${msgIdx}`,
                    [
                      msgsList.ack_count,
                      msgsList.ack_required,
                      msgsList.avatar,
                      msgsList.chat_type,
                      msgsList.every,
                      msgsList.first_name,
                      msgsList.id,
                      msgsList.is_edited,
                      msgsList.is_expired,
                      msgsList.is_read,
                      msgsList.is_repeat,
                      msgsList.is_reply_later,
                      msgsList.is_set_remind,
                      msgsList.last_name,
                      msgsList.message,
                      msgsList.my_star,
                      msgsList.occurrence,
                      msgsList.sender_id,
                      msgsList.status,
                      msgsList.task_content,
                      msgsList.task_start_at,
                      msgsList.task_type,
                      msgsList.time,
                      msgsList.type,
                      msgsList.updated_at,
                      msgsList.user_name,
                      msgsList.id,
                    ],
                    (tx, results) => {
                      resolve(res);
                    },
                    (error) => {
                      console.log("error on update data " + error.message);
                    }
                  );
                });
              }
            }
          );
        });
        allPromises.push(p);
      });
    });
    Promise.all(allPromises).then((res) => {
      callback(true);
    });
  },

  randomIdUpdate: (params, callback) => {
    let allPromises = [];
    params.resp.data.data.forEach((userList) => {
      let isRoom = userList.is_room;
      let chatUserId =
        userList.is_room === 0 ? userList.user_id : userList.room_id;
      let onlineUserId = params.onlineUserId;

      userList.chats.forEach((msgsList) => {
        let msgIdx = msgsList.idx;

        let p = new Promise((resolve, reject) => {
          MessagesQuieries.checkMessageExsist(
            { isRoom, chatUserId, onlineUserId, msgIdx },
            async (res) => {
              if (!res) {
                SQLiteDB().transaction((tx) => {
                  tx.executeSql(
                    `INSERT INTO ${params.tableName} (
                  ack_count,
                  ack_required,
                  avatar,
                  chat_type,
                  every,
                  first_name,
                  id,
                  idx,
                  is_edited,
                  is_expired,
                  is_read,
                  is_repeat,
                  is_reply_later,
                  is_set_remind,
                  last_name,
                  message,
                  my_star,
                  occurrence,
                  sender_id,
                  status,
                  task_content,
                  task_start_at,
                  task_type,
                  time,
                  type,
                  updated_at,
                  chatUser,
                  onlineUser,
                  is_room,
                  user_name,
                  _id
                ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                    [
                      msgsList.ack_count,
                      msgsList.ack_required,
                      msgsList.avatar,
                      msgsList.chat_type,
                      msgsList.every,
                      msgsList.first_name,
                      msgsList.id,
                      msgsList.idx,
                      msgsList.is_edited,
                      msgsList.is_expired,
                      msgsList.is_read,
                      msgsList.is_repeat,
                      msgsList.is_reply_later,
                      msgsList.is_set_remind,
                      msgsList.last_name,
                      msgsList.message,
                      msgsList.my_star,
                      msgsList.occurrence,
                      msgsList.sender_id,
                      msgsList.status,
                      msgsList.task_content,
                      msgsList.task_start_at,
                      msgsList.task_type,
                      msgsList.time,
                      msgsList.type,
                      msgsList.updated_at,
                      chatUserId,
                      onlineUserId,
                      isRoom,
                      msgsList.user_name,
                      msgsList.id,
                    ],
                    (tx, results) => {
                      resolve(res);
                    },
                    (error) => {
                      console.log("error on insert data " + error.message);
                    }
                  );
                });
              } else {
                SQLiteDB().transaction((tx) => {
                  tx.executeSql(
                    `UPDATE ${params.tableName} set
                  ack_count=?,
                  ack_required=?,
                  avatar=?,
                  chat_type=?,
                  every=?,
                  first_name=?,
                  id=?,
                  is_edited=?,
                  is_expired=?,
                  is_read=?,
                  is_repeat=?,
                  is_reply_later=?,
                  is_set_remind=?,
                  last_name=?,
                  message=?,
                  my_star=?,
                  occurrence=?,
                  sender_id=?,
                  status=?,
                  task_content=?,
                  task_start_at=?,
                  task_type=?,
                  time=?,
                  type=?,
                  updated_at=?,
                  user_name=?,
                  _id=?
                  where is_room=${isRoom} AND onlineUser=${onlineUserId} AND chatUser=${chatUserId} AND idx=${msgIdx} AND updated_at!=${JSON.stringify(
                      msgsList.updated_at
                    )}`,
                    [
                      msgsList.ack_count,
                      msgsList.ack_required,
                      msgsList.avatar,
                      msgsList.chat_type,
                      msgsList.every,
                      msgsList.first_name,
                      msgsList.id,
                      msgsList.is_edited,
                      msgsList.is_expired,
                      msgsList.is_read,
                      msgsList.is_repeat,
                      msgsList.is_reply_later,
                      msgsList.is_set_remind,
                      msgsList.last_name,
                      msgsList.message,
                      msgsList.my_star,
                      msgsList.occurrence,
                      msgsList.sender_id,
                      msgsList.status,
                      msgsList.task_content,
                      msgsList.task_start_at,
                      msgsList.task_type,
                      msgsList.time,
                      msgsList.type,
                      msgsList.updated_at,
                      msgsList.user_name,
                      msgsList.id,
                    ],
                    (tx, results) => {
                      resolve(res);
                    },
                    (error) => {
                      console.log("error on update data " + error.message);
                    }
                  );
                });
              }
            }
          );
        });
        allPromises.push(p);
      });
    });
    Promise.all(allPromises).then((res) => {
      callback(true);
    });
  },

  savedMessageUpdate: (params, callback) => {
    SQLiteDB().transaction((tx) => {
      tx.executeSql(
        `UPDATE ${params.tableName} set
      status=?,
      time=?,
      _id=?,
      id=?
      where id='${params.status.random_id}'`,
        [0, params.status.time, params.status.id, params.status.id],
        (tx, results) => {
          callback(true);
        },
        (error) => {
          console.log("error on update data " + error.message);
        }
      );
    });
  },

  updateDbAtcion: (params, callback) => {
    let allPromises = [];
    params.resp.data.data.forEach((userList) => {
      let isRoom = userList.is_room;
      let chatUserId =
        userList.is_room === 0 ? userList.user_id : userList.room_id;
      let onlineUserId = params.onlineUserId;

      userList.chats.forEach((msgsList) => {
        let msgIdx = msgsList.idx;

        let p = new Promise((resolve, reject) => {
          MessagesQuieries.checkMessageExsist(
            { isRoom, chatUserId, onlineUserId, msgIdx },
            async (res) => {
              if (!res) {
                null;
              } else {
                SQLiteDB().transaction((tx) => {
                  tx.executeSql(
                    `UPDATE ${params.tableName} set
                  ack_count=?,
                  ack_required=?,
                  avatar=?,
                  chat_type=?,
                  every=?,
                  first_name=?,
                  id=?,
                  is_edited=?,
                  is_expired=?,
                  is_read=?,
                  is_repeat=?,
                  is_reply_later=?,
                  is_set_remind=?,
                  last_name=?,
                  message=?,
                  my_star=?,
                  occurrence=?,
                  sender_id=?,
                  status=?,
                  task_content=?,
                  task_start_at=?,
                  task_type=?,
                  time=?,
                  type=?,
                  updated_at=?,
                  user_name=?,
                  _id=?
                  where is_room=${isRoom} AND onlineUser=${onlineUserId} AND chatUser=${chatUserId} AND idx=${msgIdx}`,
                    [
                      msgsList.ack_count,
                      msgsList.ack_required,
                      msgsList.avatar,
                      msgsList.chat_type,
                      msgsList.every,
                      msgsList.first_name,
                      msgsList.id,
                      msgsList.is_edited,
                      msgsList.is_expired,
                      msgsList.is_read,
                      msgsList.is_repeat,
                      msgsList.is_reply_later,
                      msgsList.is_set_remind,
                      msgsList.last_name,
                      msgsList.message,
                      msgsList.my_star,
                      msgsList.occurrence,
                      msgsList.sender_id,
                      msgsList.status,
                      msgsList.task_content,
                      msgsList.task_start_at,
                      msgsList.task_type,
                      msgsList.time,
                      msgsList.type,
                      msgsList.updated_at,
                      msgsList.user_name,
                      msgsList.id,
                    ],
                    (tx, results) => {
                      resolve(res);
                    },
                    (error) => {
                      console.log("error on update data " + error.message);
                    }
                  );
                });
              }
            }
          );
        });
        allPromises.push(p);
      });
    });
    Promise.all(allPromises).then((res) => {
      callback(true);
    });
  },

  updateMessageAction: (params, callBack) => {
    SQLiteDB().transaction((tx) => {
      tx.executeSql(
        `UPDATE messages_list_table set
        status=?
        where id=${params.deleteMeassgeId} AND onlineUser=${
          params.onlineUserId
        } AND chatUser=${JSON.parse(params.chatUserId)}`,
        [3],
        (tx, results) => {
          if (results.rowsAffected !== 0) {
            callBack(true);
          }
        },
        (error) => {
          console.log("error on update data " + error.message);
        }
      );
    });
  },

  updateMessageActionAsStar: (params, callBack) => {
    SQLiteDB().transaction((tx) => {
      tx.executeSql(
        `UPDATE messages_list_table set
        my_star=?
        where id=${params.messageId} AND onlineUser=${
          params.onlineUserId
        } AND chatUser=${JSON.parse(params.chatUserId)}`,
        [params.star],
        (tx, results) => {
          if (results.rowsAffected !== 0) {
            callBack(true);
          }
        },
        (error) => {
          console.log("error on update data " + error.message);
        }
      );
    });
  },

  updateMessageActionAsRespondLater: (params, callBack) => {
    SQLiteDB().transaction((tx) => {
      tx.executeSql(
        `UPDATE messages_list_table set
        is_reply_later=?
        where id=${params.messageId} AND onlineUser=${
          params.onlineUserId
        } AND chatUser=${JSON.parse(params.chatUserId)}`,
        [params.replyLater],
        (tx, results) => {
          if (results.rowsAffected !== 0) {
            callBack(true);
          }
        },
        (error) => {
          console.log("error on update data " + error.message);
        }
      );
    });
  },

  updateMessageActionAsRmindme: (params, callBack) => {
    SQLiteDB().transaction((tx) => {
      tx.executeSql(
        `UPDATE messages_list_table set
        is_set_remind=?
        where id=${params.messageId} AND onlineUser=${
          params.onlineUserId
        } AND chatUser=${JSON.parse(params.chatUserId)}`,
        [params.remindme],
        (tx, results) => {
          if (results.rowsAffected !== 0) {
            callBack(true);
          }
        },
        (error) => {
          console.log("error on update data " + error.message);
        }
      );
    });
  },

  delete: (tableName, data) => {
    SQLiteDB().transaction((tx) => {
      tx.executeSql("Drop table messages_list_table", [], (tx, results) => {
        if (results.rowsAffected > 0) {
          // Alert.alert(
          //   'Success',
          //   'User deleted successfully',
          //   [
          //     {
          //       text: 'Ok',
          //       onPress: () => that.props.navigation.navigate('HomeScreen'),
          //     },
          //   ],
          //   { cancelable: false },
          // );
        } else {
          // alert('Table is Deleted sucessfully');
        }
      });
    });
  },
};

export const LogoutQueries = {
  create: (tableName) => {
    let fields = TableFields[tableName]();
    SQLiteDB().transaction(function (txn) {
      txn.executeSql(
        `CREATE TABLE ${tableName}(${fields})`,
        [],
        function (tx, res) {},
        (error) => {
          console.log("Table is Already Created " + error.message);
        }
      );
    });
  },

  checkUserExsist: (params, callback) => {
    SQLiteDB().transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM logout_time_table where user_id=${params.userId}`,
        [],
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            callback(true);
          } else {
            callback(false);
          }
        }
      );
    });
  },

  insertAndUpdateLogoutList: (params, callback) => {
    let allPromises = [];
    let userId = params.userId;
    let logoutTime = params.logoutTime;
    let p = new Promise((resolve, reject) => {
      LogoutQueries.checkUserExsist({ userId }, (res) => {
        if (!res) {
          SQLiteDB().transaction((tx) => {
            tx.executeSql(
              `INSERT INTO ${params.tableName} (
                  user_id,
                  logout_time
                  ) VALUES (?,?)`,
              [userId, logoutTime],
              (tx, results) => {
                resolve(res);
              },
              (error) => {
                console.log("error on insert data " + error.message);
              }
            );
          });
        } else {
          SQLiteDB().transaction((tx) => {
            tx.executeSql(
              `UPDATE ${params.tableName} set
                user_id=?,
                logout_time=?
                    where user_id=${userId}`,
              [userId, logoutTime],
              (tx, results) => {
                resolve(res);
              },
              (error) => {
                console.log("error on update data " + error.message);
              }
            );
          });
        }
      });
    });
    allPromises.push(p);
    Promise.all(allPromises).then((res) => {
      callback(true);
    });
  },

  getLogoutTime: (params, callback) => {
    SQLiteDB().transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM logout_time_table where user_id=${params.userId}`,
        [],
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            var resultItemIdArr = new Array();
            for (let i = 0; i < results.rows.length; ++i) {
              resultItemIdArr.push(results.rows.item(i));
            }
          } else {
            var resultItemIdArr = null;
          }
          callback(resultItemIdArr);
        }
      );
    });
  },
};
