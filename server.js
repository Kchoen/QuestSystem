const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./util/database");
const quest = require("./models/Quest");
const user = require("./models/User");
const socket = require("socket.io");
var xlsx = require("node-xlsx");
var fs = require("fs");
var http = require("http");
var https = require("https");
var { checkCDKEY, checkJOB, JobQuestReply } = require("./util");
const session = require("express-session");
const app = express();
var curUsers = [];
var QUESTS = xlsx.parse(__dirname + "/任務表.xlsx")[0].data;
var USERS = xlsx.parse(__dirname + "/帳密表.xlsx")[0].data;
secret = "雲夢超讚by羊羊";
var credentials = {
    key: fs.readFileSync("server.key", "utf8"),
    cert: fs.readFileSync("server.crt", "utf8"),
};
const sess = {
    secret: "secretsecretsecret",
    cookie: { maxAge: 365 * 24 * 60 * 60 * 1000 },
    resave: false,
    saveUninitialized: false,
};
if (app.get("env") === "production") {
    app.set("trust proxy", 1);
    sess.cookie.secure = true;
}
app.use(session(sess));
app.use(express.static("static"));
app.use(bodyParser.json({ limit: "50mb", type: "application/json" }));

async function init(state) {
    sequelize.sync({ force: state }).then(() => {
        loadUsers(state);
        if (state) {
            setupQuests();
            setupUsers();
        }
    });
}
async function setupQuests() {
    for (var i = 1; i < QUESTS.length; i++) {
        if (QUESTS[i].length == 0) break;
        await quest.create({
            MTYPE: QUESTS[i][0],
            QNAME: QUESTS[i][1],
            EXPLAIN: QUESTS[i][2],
            LONGEXPLAIN: QUESTS[i][3],
            PRICE: QUESTS[i][4],
            REPLY: QUESTS[i][5],
            FOR: createFor(QUESTS[i][6], []),
            TYPE: QUESTS[i][6],
        });
    }
}
function setupUsers() {
    for (var i = 1; i < USERS.length; i++) {
        if (USERS[i].length == 0) break;
        user.create({
            UNAME: USERS[i][0],
            PASSWORD: USERS[i][1],
            CNAME: USERS[i][2],
            JOB: USERS[i][3],
        });
    }
}

function loadUsers(state) {
    if (state) {
        for (var i = 1; i < USERS.length; i++) {
            if (USERS[i].length == 0) break;
            curUsers.push({ CNAME: USERS[i][2], JOB: USERS[i][3], LVL: 10 });
        }
        console.log(curUsers);
    } else {
        curUsers = [];
        user.findAll({}).then((us) => {
            for (u of us) {
                curUsers.push({ CNAME: u.CNAME, JOB: u.JOB, LVL: parseInt(u.LVL) });
            }
            console.log(curUsers);
        });
    }

    //console.log(curUsers);
}
function createFor(TYPE, PEOPLE) {
    let NameList = [];
    T = TYPE.split(";")[0];
    LVL = TYPE.split(";")[1];
    switch (T) {
        case "一般":
            NameList = curUsers.map((elem) => {
                if (!(parseInt(LVL) > parseInt(elem.LVL)) || elem.JOB == "GM") {
                    return elem.CNAME;
                }
            });
            break;
        default:
            const filterList = curUsers.filter((u) => (u.JOB == T && !(parseInt(LVL) > parseInt(u.LVL))) || PEOPLE.includes(u.CNAME) || u.JOB == "GM");
            NameList = filterList.map((elem) => elem["CNAME"]);
            break;
    }
    return NameList;
}
function updateFor(CNAME, JOB, LVL) {
    for (var i = 1; i < curUsers.length; i++) {
        if (curUsers[i].CNAME == CNAME) {
            curUsers[i].JOB = JOB;
            curUsers[i].LVL = LVL;
            break;
        }
    }
    quest.findAll({ attributes: ["id", "TYPE", "PEOPLE"] }).then((qList) => {
        for (q of qList) {
            quest.update({ FOR: createFor(q.TYPE, q.PEOPLE) }, { where: { id: q.id } });
        }
    });
}
function updateSession(req) {
    UNAME = req.session.UNAME;
    user.findOne({ where: { UNAME: UNAME } }).then((u) => {
        req.session.CNAME = u.CNAME;
        req.session.JOB = u.JOB;
        req.session.LVL = u.LVL;
    });
}
app.get("/", (req, res) => {
    res.sendFile("index.html", { root: __dirname + "/templates" });
});
function showQuest() {
    quest.update({ FOR: createFor("一般", []), TYPE: "一般" }, { where: { MTYPE: "隱藏任務" } });
}
function hideQuest() {
    quest.update({ FOR: createFor("隱藏", []), TYPE: "隱藏" }, { where: { MTYPE: "隱藏任務" } });
}
app.post("/", (req, res) => {
    TYPE = req.body.TYPE;
    if (TYPE == "LOGIN") {
        UNAME = req.body.UNAME;
        PASSWORD = req.body.PASSWORD;
        user.findOne({ attributes: ["PASSWORD"], where: { UNAME: UNAME } })
            .then((u) => {
                if (u["PASSWORD"] == PASSWORD) {
                    req.session.UNAME = UNAME;
                    req.session.CNAME = u.CNAME;
                    req.session.JOB = u.JOB;
                    req.session.LVL = u.LVL;
                    res.send(true);
                } else {
                    res.send(false);
                }
            })
            .catch((e) => {
                res.send(false);
            });
    } else if (TYPE == "QUEST") {
        QNAME = req.body.QNAME;
        CDKEY = req.body.CDKEY;
        PLAYERNAME = req.session.CNAME;
        JOB = req.session.JOB;
        LVL = req.session.LVL;
        if (checkCDKEY(PLAYERNAME, QNAME, secret, CDKEY)) {
            quest.findOne({ where: { QNAME: QNAME } }).then((msg) => {
                reply = { text: msg.REPLY };
                if (msg.MTYPE == "轉職任務") {
                    reply = JobQuestReply(QNAME, PLAYERNAME, secret);
                }
                if (msg["FINISHED"]) {
                    if (msg["PEOPLE"].indexOf(PLAYERNAME) == -1) {
                        if (msg.MTYPE == "職業任務") {
                            updateFor(CNAME, req.session.JOB, LVL + 10);
                            user.update({ LVL: LVL + 10 }, { where: { CNAME: PLAYERNAME } }).then(() => {
                                updateSession(req);
                            });
                        } else if (msg.MTYPE == "試煉任務") {
                            updateFor(CNAME, req.session.JOB, LVL + 30);
                            user.update({ LVL: LVL + 30 }, { where: { CNAME: PLAYERNAME } }).then(() => {
                                updateSession(req);
                            });
                        }
                        let P = msg["PEOPLE"];
                        P.push(PLAYERNAME);
                        quest.update({ PEOPLE: P }, { where: { QNAME: QNAME } });
                        res.send({ msg: `恭喜您！完成任務！\n\n提示：${reply.text}`, CDKEY: reply.CDKEY });
                    } else {
                        res.send({ msg: `您已經完成任務！\n\n提示：${reply.text}`, CDKEY: reply.CDKEY });
                    }
                } else {
                    if (msg.MTYPE == "職業任務") {
                        updateFor(CNAME, req.session.JOB, LVL + 10);
                        user.update({ LVL: LVL + 10 }, { where: { CNAME: PLAYERNAME } }).then(() => {
                            updateSession(req);
                        });
                    } else if (msg.MTYPE == "試煉任務") {
                        updateFor(CNAME, req.session.JOB, LVL + 30);
                        user.update({ LVL: LVL + 30 }, { where: { CNAME: PLAYERNAME } }).then(() => {
                            updateSession(req);
                        });
                    }
                    quest.update({ FINISHED: true, FINISHEDBY: PLAYERNAME, PEOPLE: [PLAYERNAME] }, { where: { QNAME: QNAME } });
                    io.sockets.emit("CELEBRATION", `恭喜${PLAYERNAME}!!\n恭喜他第一個完成 ${QNAME} 任務！`);
                    res.send({ msg: `恭喜您！完成任務！\n 您是第一個完成任務的玩家！！\n\n提示：${reply.text}`, CDKEY: reply.CDKEY });
                }
            });
        } else {
            res.send({ msg: "您還沒完成任務！請找NPC確認。" });
        }
    } else if (TYPE == "ChangeJOB") {
        JOB = req.session.JOB;
        CDKEY = req.body.CDKEY;
        PLAYERNAME = req.session.CNAME;
        if (JOB == "GM") {
            if (CDKEY == "開啟任務") {
                console.log("限時任務開啟");
                showQuest();
                io.sockets.emit("BROADCAST", "現在開啟限時隱藏任務!!");
                res.send({ msg: "已開啟" });
            } else if (CDKEY == "關閉任務") {
                console.log("限時任務關閉");
                hideQuest();
                io.sockets.emit("BROADCAST", "限時隱藏任務已結束!!");
                res.send({ msg: "已關閉" });
            } else if (CDKEY.slice(0, 4) == "新增用戶") {
                param = CDKEY.slice(5).split(";");
                UNAME = param[0];
                PW = param[1];
                CNAME = param[2];
                user.create({
                    UNAME: UNAME,
                    PASSWORD: PW,
                    CNAME: CNAME,
                    JOB: "初心者",
                }).then(() => {
                    curUsers.push({ CNAME: CNAME, JOB: "初心者", LVL: 10 });
                    updateFor(CNAME, "初心者", 10);
                    res.send({ msg: "新增成功" });
                });
            } else {
                res.send({ msg: "目前功能:['開啟任務','關閉任務','新增用戶:帳號;密碼;用戶名']" });
            }
            return;
        }

        newJOB = checkJOB(PLAYERNAME, secret, CDKEY);
        if (newJOB) {
            user.update({ JOB: newJOB }, { where: { CNAME: PLAYERNAME } }).then(() => {
                updateFor(PLAYERNAME, newJOB, req.session.LVL);
                updateSession(req);
                io.sockets.emit("CELEBRATION", `恭喜${PLAYERNAME}!!\n恭喜他成功轉職成${newJOB}！`);
                res.send({ msg: `恭喜您！成功轉職成${newJOB}！` });
            });
        } else {
            res.send({ msg: "您還沒完成任務！請找NPC確認。" });
        }
    } else if (TYPE == "LOGOUT") {
        req.session.destroy((err) => {
            res.send("success");
        });
    }
});
app.get("/FetchINFO", (req, res) => {
    if (req.session.UNAME != undefined) {
        user.findOne({ where: { UNAME: req.session.UNAME } }).then((u) => {
            req.session.CNAME = u.CNAME;
            req.session.JOB = u.JOB;
            req.session.LVL = u.LVL;
            res.send({ UNAME: req.session.UNAME, CNAME: req.session.CNAME, JOB: req.session.JOB, LVL: req.session.LVL });
        });
    } else {
        res.send(false);
    }
});

app.get("/QUESTS", (req, res) => {
    let questLIST = [];
    CNAME = req.session.CNAME;
    quest
        .findAll({})
        .then((msgs) => {
            for (msg of msgs) {
                if (!msg.FOR.includes(CNAME)) continue;
                questLIST.push({
                    MTYPE: msg.MTYPE,
                    NAME: msg.NAME,
                    EXPLAIN: msg.EXPLAIN,
                    LONGEXPLAIN: msg.LONGEXPLAIN,
                    PRICE: msg.PRICE,
                    QNAME: msg.QNAME,
                    FINISHED: msg.FINISHED,
                    FINISHEDBY: msg.FINISHEDBY,
                    PEOPLE: msg.PEOPLE,
                });
            }
            res.send(questLIST);
        })
        .catch((e) => {
            console.log("QUESTS ERROR");
            res.send([]);
        });
});

app.get("/favicon.ico", (req, res) => {
    res.sendFile("ricardo.ico", { root: __dirname + "/static" });
});

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);
init(true);
const io = socket(httpsServer);
httpServer.listen(80);
httpsServer.listen(443);
