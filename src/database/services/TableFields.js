export const TableFields = {
  users_list_table: () => {
    var fields = [
      'user_id                  INT(10)',
      'avatar                   VARCHAR(20)',
      'chat_meta_id             INT(10)',
      'chat_name                VARCHAR(20)',
      'is_room                  INT(10)',
      'is_unread                INT(10)',
      'last_message             VARCHAR(20)',
      'last_message_status      INT(10)',
      'last_message_time        VARCHAR(20)',
      'last_message_type        INT(10)',
      'last_seen                VARCHAR(20)',
      'on_screen_chat_id        INT(10)',
      'online_status            INT(10)',
      'sender_id                INT(10)',
      'stories_count            INT(10)',
      'type                     INT(10)',
      'unread_count             INT(10)',
      'user_departments         VARCHAR(20)',
      'user_name                VARCHAR(20)',
      'user_status              INT(10)',
      'online_user_id           INT(10)',
    ];
    return fields;
  },

  messages_list_table: () => {
    var fields = [
      'ack_count                  INT(10)',
      'ack_required               INT(10)',
      'avatar                     VARCHAR(20)',
      'chat_type                  VARCHAR(20)',
      'every                      VARCHAR(20)',
      'first_name                 VARCHAR(20)',
      'id                         INT(10)',
      'idx                        INT(10)',
      'is_edited                  INT(10)',
      'is_expired                 VARCHAR(20)',
      'is_read                    INT(10)',
      'is_repeat                  VARCHAR(20)',
      'is_reply_later             INT(10)',
      'is_set_remind              INT(10)',
      'last_name                  VARCHAR(20)',
      'message                    VARCHAR(20)',
      'my_star                    INT(10)',
      'occurrence                 VARCHAR(20)',
      'sender_id                  INT(10)',
      'status                     INT(10)',
      'task_content               VARCHAR(20)',
      'task_start_at              VARCHAR(20)',
      'task_type                  VARCHAR(20)',
      'time                       VARCHAR(20)',
      'type                       INT(10)',
      'updated_at                 VARCHAR(20)',
      'chatUser                   INT(10)',
      'onlineUser                 INT(10)',
      'is_room                    INT(10)',
      'user_name                  VARCHAR(20)',
      '_id                        INT(10)',
    ];
    return fields;
  },
  
  logout_time_table: () => {
    var fields = [
      'user_id                         INT(10)',
      'logout_time                     VARCHAR(20)',
    ];
    return fields;
  },
};
