CREATE TABLE "peer" (
	"id" INTEGER PRIMARY KEY,
	"port" INTEGER NOT NULL,
	"ip_addr" TEXT NOT NULL
);
CREATE TABLE "em" (
	"id" INTEGER PRIMARY KEY,
	"interval" INTEGER NOT NULL,
	"remote_id" INTEGER NOT NULL,
	"peer_id" INTEGER NOT NULL
);
CREATE TABLE "sensor" (
	"id" INTEGER PRIMARY KEY,
	"interval" INTEGER NOT NULL,
	"remote_id" INTEGER NOT NULL,
	"peer_id" INTEGER NOT NULL
);
CREATE TABLE "pid" (
	"id" INTEGER PRIMARY KEY,
	"mode" INTEGER NOT NULL,
	"kp" REAL NOT NULL,
	"ki" REAL NOT NULL,
	"kd" REAL NOT NULL,
	"out_min" REAL NOT NULL,
	"out_max" REAL NOT NULL
);
CREATE TABLE "pos2" (
	"id" INTEGER PRIMARY KEY,
	"mode" INTEGER NOT NULL,
	"hys" REAL NOT NULL,
	"out_min" REAL NOT NULL,
	"out_max" REAL NOT NULL
);
CREATE TABLE "reg" (
	"id" INTEGER PRIMARY KEY,
	"method" INTEGER NOT NULL,
	"pid_id" INTEGER NOT NULL,
	"pos2_id" INTEGER NOT NULL
);
CREATE TABLE "step" (
	"id" INTEGER PRIMARY KEY,
	"goal" REAL NOT NULL,
	"reach_time" INTEGER NOT NULL,
	"hold_time" INTEGER NOT NULL,
	"next_id" INTEGER NOT NULL
);
CREATE TABLE "logger" (
	"id" INTEGER PRIMARY KEY,
	"interval" INTEGER NOT NULL,
	"max_rows" INTEGER NOT NULL
);
CREATE TABLE "em_out" (
	"id" INTEGER PRIMARY KEY,
	"out" REAL NOT NULL
);
CREATE TABLE "log" (
    "channel_id" INTEGER NOT NULL,
    "mark" INTEGER NOT NULL,
    "value" REAL NOT NULL
);
CREATE TABLE "channel" (
	"id" INTEGER PRIMARY KEY,
	"em_id" INTEGER NOT NULL,
	"eem_id" INTEGER NOT NULL, --emergency EM
	"eem_out_id" INTEGER NOT NULL,
	"bem_id" INTEGER NOT NULL, --busy EM
	"bem_out_id" INTEGER NOT NULL,
	"sensor_id" INTEGER NOT NULL,
	"step_id" INTEGER NOT NULL,
	"reg_id" INTEGER NOT NULL,
	"logger_id" INTEGER NOT NULL
);
CREATE TABLE "rchannel" (
	"id" INTEGER PRIMARY KEY
);

