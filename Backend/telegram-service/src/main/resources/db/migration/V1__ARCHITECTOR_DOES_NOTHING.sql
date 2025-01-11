CREATE TABLE chats
(
    tg_chat_id            BIGINT      NOT NULL,
    tg_channel_id         BIGINT      NOT NULL,
    store_id              VARCHAR(24) NOT NULL,
    blogger_id            UUID        NOT NULL,
    fanfcoins_per_comment INTEGER     NOT NULL,
    fanfcoins_per_boost   INTEGER     NOT NULL,
    comment_time_wait     INTEGER     NOT NULL,
    boost_time_wait       INTEGER     NOT NULL,
    CONSTRAINT pk_chats PRIMARY KEY (store_id)
);

CREATE TABLE clients
(
    user_id    UUID    NOT NULL,
    balance    INTEGER NOT NULL,
    tg_chat_id BIGINT  NOT NULL,
    tg_user_id BIGINT  NOT NULL,
    tg_channel_id BIGINT NOT NULL,
    CONSTRAINT pk_clients PRIMARY KEY (tg_chat_id, tg_user_id, tg_channel_id)
);

CREATE TABLE pending_boosts
(
    time       TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    tg_user_id BIGINT                      NOT NULL,
    tg_channel_id BIGINT                      NOT NULL,
    boost_id   VARCHAR(255)                NOT NULL,
    CONSTRAINT pk_pending_boosts PRIMARY KEY (tg_user_id, tg_channel_id, boost_id)
);

CREATE TABLE pending_comments
(
    time       TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    tg_user_id BIGINT                      NOT NULL,
    tg_chat_id BIGINT                      NOT NULL,
    tg_post_id BIGINT                      NOT NULL,
    CONSTRAINT pk_pending_comments PRIMARY KEY (tg_user_id, tg_chat_id, tg_post_id)
);

ALTER TABLE pending_comments
    ADD CONSTRAINT uc_0351f8c6c7310f03efe373072 UNIQUE (tg_user_id, tg_chat_id, tg_post_id);

ALTER TABLE clients
    ADD CONSTRAINT uc_57500e2f258efbe7486c9fb47 UNIQUE (tg_user_id, tg_chat_id);

ALTER TABLE clients
    ADD CONSTRAINT uc_clients_chat_info UNIQUE (tg_user_id, tg_channel_id);

ALTER TABLE chats
    ADD CONSTRAINT uc_chats_store UNIQUE (tg_chat_id);

ALTER TABLE chats
    ADD CONSTRAINT uc_chats_channel UNIQUE (tg_channel_id);

ALTER TABLE chats
    ADD CONSTRAINT uc_chats_info UNIQUE (tg_channel_id, tg_chat_id);

ALTER TABLE clients
    ADD CONSTRAINT FK_CLIENTS_ON_TG_CHAT FOREIGN KEY (tg_chat_id, tg_channel_id) REFERENCES chats (tg_chat_id, tg_channel_id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE pending_boosts
    ADD CONSTRAINT FK_PENDING_BOOSTS_ON_TGCHIDTGUSID FOREIGN KEY (tg_channel_id, tg_user_id) REFERENCES clients (tg_channel_id, tg_user_id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE pending_comments
    ADD CONSTRAINT FK_PENDING_COMMENTS_ON_TGCHIDTGUSID FOREIGN KEY (tg_chat_id, tg_user_id) REFERENCES clients (tg_chat_id, tg_user_id) ON DELETE CASCADE ON UPDATE CASCADE;