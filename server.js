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

function init(state) {
    sequelize.sync({ force: state }).then(() => {
        loadUsers(state);
        if (state) {
            setupQuests();
            setupUsers();
        }
    });
}
function setupQuests() {
    for (var i = 1; i < QUESTS.length; i++) {
        if (QUESTS[i].length == 0) break;
        quest.create({
            MTYPE: QUESTS[i][0],
            QNAME: QUESTS[i][1],
            EXPLAIN: QUESTS[i][2],
            LONGEXPLAIN: QUESTS[i][3],
            PRICE: QUESTS[i][4],
            REPLY: QUESTS[i][5],
            FOR: createFor(QUESTS[i][6]),
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
function addQuests() {
    for (var i = 1; i < addQUESTS.length; i++) {
        if (addQUESTS[i].length == 0) break;
        quest.create({
            MTYPE: addQUESTS[i][0],
            QNAME: addQUESTS[i][1],
            EXPLAIN: addQUESTS[i][2],
            LONGEXPLAIN: addQUESTS[i][3],
            PRICE: addQUESTS[i][4],
            REPLY: addQUESTS[i][5],
            FOR: createFor(QUESTS[i][6]),
            TYPE: QUESTS[i][6],
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
        user.findAll({}).then((us) => {
            for (u of us) {
                curUsers.push({ CNAME: u.CNAME, JOB: u.JOB, LVL: u.LVL });
            }
            console.log(curUsers);
        });
    }

    //console.log(curUsers);
}
function createFor(TYPE) {
    let NameList = [];
    switch (TYPE) {
        case "一般":
            NameList = curUsers.map((elem) => elem["CNAME"]);
            break;
        default:
            const filterList = curUsers.filter((u) => u.JOB == TYPE || u.JOB == "GM");
            NameList = filterList.map((elem) => elem["CNAME"]);
            break;
    }
    return NameList;
}
function updateFor(CNAME, JOB) {
    for (var i = 1; i < curUsers.length; i++) {
        if (curUsers[i].CNAME == CNAME) {
            curUsers[i].JOB = JOB;
            break;
        }
    }
    quest.findAll({ attributes: ["id", "TYPE"] }).then((qList) => {
        for (q of qList) {
            quest.update({ FOR: createFor(q.TYPE) }, { where: { id: q.id } });
        }
    });
}
app.get("/", (req, res) => {
    res.sendFile("index.html", { root: __dirname + "/templates" });
});

app.post("/", (req, res) => {
    TYPE = req.body.TYPE;
    if (TYPE == "LOGIN") {
        UNAME = req.body.UNAME;
        PASSWORD = req.body.PASSWORD;
        user.findOne({ where: { UNAME: UNAME } })
            .then((u) => {
                if (u["PASSWORD"] == PASSWORD) {
                    req.session.UNAME = u["UNAME"];
                    req.session.CNAME = u["CNAME"];
                    req.session.JOB = u["JOB"];
                    req.session.LVL = u["LVL"];
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
        PLAYERNAME = req.body.PLAYERNAME;
        if (checkCDKEY(PLAYERNAME, QNAME, secret, CDKEY)) {
            quest.findOne({ where: { QNAME: QNAME } }).then((msg) => {
                reply = { text: msg.REPLY };
                if (msg.MTYPE == "轉職任務") {
                    reply = JobQuestReply(QNAME, PLAYERNAME, secret);
                }
                if (msg["FINISHED"]) {
                    if (msg["PEOPLE"].indexOf(PLAYERNAME) == -1) {
                        let P = msg["PEOPLE"];
                        P.push(PLAYERNAME);
                        quest.update({ PEOPLE: P }, { where: { QNAME: QNAME } });
                        res.send({ msg: `恭喜您！完成任務！\n\n提示：${reply.text}`, CDKEY: reply.CDKEY });
                    } else {
                        res.send({ msg: `您已經完成任務！` });
                    }
                } else {
                    quest.update({ FINISHED: true, FINISHEDBY: PLAYERNAME, PEOPLE: [PLAYERNAME] }, { where: { QNAME: QNAME } });
                    io.sockets.emit("CELEBRATION", `恭喜${PLAYERNAME}!!\n恭喜他第一個完成 ${QNAME} 任務！`);
                    res.send({ msg: `恭喜您！完成任務！\n 您是第一個完成任務的玩家！！\n\n提示：${reply.text}`, CDKEY: reply.CDKEY });
                }
            });
        } else {
            res.send({ msg: "您還沒完成任務！請找NPC確認。" });
        }
    } else if (TYPE == "ChangeJOB") {
        JOB = req.body.JOB;
        CDKEY = req.body.CDKEY;
        PLAYERNAME = req.body.PLAYERNAME;
        if (CDKEY == "開啟限時隱藏任務" && PLAYERNAME == "黑風") {
            console.log("限時任務開啟");
            io.sockets.emit("BROADCAST", "現在開啟限時隱藏任務!!");
            res.send({ msg: "已開啟" });
            return;
        }
        newJOB = checkJOB(PLAYERNAME, JOB, secret, CDKEY);
        if (newJOB) {
            user.update({ JOB: newJOB }, { where: { CNAME: PLAYERNAME } }).then(() => {
                req.session.JOB = newJOB;
                updateFor(PLAYERNAME, newJOB);
                io.sockets.emit("CELEBRATION", `恭喜${PLAYERNAME}!!\n恭喜他成功轉職成${newJOB}！`);
                res.send({ msg: `恭喜您！成功轉職成${newJOB}！` });
            });
        } else {
            res.send({ msg: "您還沒完成任務！請找NPC確認。" });
        }
    }
});
app.get("/FetchINFO", (req, res) => {
    if (req.session.UNAME != undefined) {
        res.send({ UNAME: req.session.UNAME, CNAME: req.session.CNAME, JOB: req.session.JOB, LVL: req.session.LVL });
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
