function toFirstPage() {
    $(document.body).empty();
    $(document.body).append(
        $(`
        <div id="QUESTS" style="float:left; width:100vw; height: 100vh">
        <table style="width:100vw;">
            <thead>
                <tr>
                    <th colspan="6">公開任務清單</th>
                </tr>
            </thead>
            <tbody>
                <tr align="center">
                    <td>任務難度</td>
                    <td>任務名稱</td>
                    <td>任務說明</td>
                    <td>任務獎勵</td>
                    <td></td>
                    <td>是否完成</td>
                </tr>
            </tbody>
        </table>
        </div>
        <div class="asideMenu">
        <button class="open"></button>
        <button class="close"></button>
            <div  id="SLIDEINFO" >
            <div class="title">功能表單</div>
            <div class="list">
            <div align="left" style="margin-top:10vh">
                <h2>登入畫面</h2>
                <br>
                <p style="font-size:20px;">帳號</p>
                <input style="width:200px;font-size:16px;" id="UNAME" type="text"/>
                <p style="font-size:20px;">密碼</p>
                <input type="password" style="width:200px;font-size:16px;" id="PASSWORD" type="text"/>
                <br><br>
                <input value="確認" type="submit" onclick="LOGIN()"/>
                <p id="wrongpw" style="color: red; display: none">Wrong password</p>
            </div>
            </div>
            </div>
            </div>
        </div>
        
        `)
    );
    $(function () {
        $(".open").click(function () {
            $(".asideMenu").toggleClass("active");
            $(".open").css("display", "none");
            $(".close").css("display", "block");
        });
        $(".close").click(function () {
            $(".asideMenu").toggleClass("active");
            $(".open").css("display", "block");
            $(".close").css("display", "none");
        });
    });
}

function loadQUESTS(QUESTS) {
    BEGIN = `
    <table style="width:100vw;">
        <thead>
            <tr>
                <th colspan="6">公開任務清單</th>
            </tr>
        </thead>
        <tbody>
        <tr align="center">
            <td style="color:yellow">任務類型</td>
            <td style="color:yellow">任務名稱</td>
            <td style="color:yellow">任務說明</td>
            <td style="color:yellow">任務獎勵</td>
            <td></td>
            <td style="color:yellow">是否完成</td>
        </tr>`;
    END = `</tbody></table>`;
    questCODE = "";
    questCODE += BEGIN;
    for (var q of QUESTS) {
        let color = "red",
            text = "未完成",
            btntxt = "";
        if (q.FINISHED) {
            btntxt = `arg1="已完成玩家" arg2="${q.PEOPLE.join("、")}" onclick="showMore(this)"`;
            color = "green";
            text = `由${q.FINISHEDBY}完成`;
        }
        questCODE += `
        <tr align="center">
            <td>${q.MTYPE}</td>
            <td>${q.QNAME}</td>
            <td arg1="${q.QNAME}" arg2="${q.LONGEXPLAIN}" onclick="showMore(this)">${q.EXPLAIN}...(點擊獲得更多資訊)</td>
            <td>${q.PRICE}</td>
            <td><button id="${q.QNAME}" style="background-color:green;color:white;" onclick="submitQuest(this)">繳交任務</button></td>
            <td ${btntxt} style="background-color:${color};">${text}</td>
        </tr>`;
    }
    questCODE += END;
    $("#QUESTS").empty();
    $("#QUESTS").append(questCODE);
}

function sessionLOGIN() {
    $("#SLIDEINFO").empty();
    $("#SLIDEINFO").append(`
    <div class="title">功能表單</div>
    <div class="list">
    <div align="left" style="margin-top:10vh">
        <table style="width:20vw;">
            <thead>
                <tr>
                    <th colspan="2">角色資訊</th>
                </tr>
            </thead>
            <tbody>
                <tr align="center">
                    <td style="width:8vw;">名稱</td>
                    <td style="width:12vw;">${UserINFO.CNAME}</td>
                </tr>
                <tr align="center">
                    <td>職業</td>
                    <td>${UserINFO.JOB}</td>
                </tr>
                <tr align="center">
                    <td>等級</td>
                    <td>${UserINFO.LVL}</td>
                </tr>
            </tbody>
        </table>
        
        <br>
        完成專屬任務：
        <input type="password" style="width:200px;font-size:12px;" id="CDKEY" />
        <br><br>
        <input value="輸入任務密鑰" type="submit" onclick="SendCDKEY()"/>
    </div>
    </div>
    `);
}
function FetchINFO() {
    axios.get("/FetchINFO").then((M) => {
        if (M.data.UNAME != undefined) {
            UserINFO = { UNAME: M.data.UNAME, CNAME: M.data.CNAME, JOB: M.data.JOB, LVL: M.data.LVL };
            sessionLOGIN();
        }
    });
}
function FetchQUESTS() {
    axios.get("/QUESTS").then((M) => {
        QuestINFO = M.data;
        loadQUESTS(QuestINFO);
    });
    socket = io("#");
    socket.on("BROADCAST", (msg) => {
        alert(msg);
        window.location.reload();
    });
    socket.on("CELEBRATION", (msg) => {
        alert(msg);
    });
}
function LOGIN() {
    let UNAME = $("#UNAME").val(),
        PW = $("#PASSWORD").val();
    axios
        .post("/", {
            TYPE: "LOGIN",
            UNAME: UNAME,
            PASSWORD: PW,
        })
        .then((response) => {
            var success = response.data;
            if (success) {
                window.location.reload();
            } else {
                $("#wrongpw").css("display", "block");
            }
        });
}

function submitQuest(item) {
    if (UserINFO.CNAME == undefined) {
        alert("請先登入");
    } else {
        let token = prompt("請輸入該任務的密鑰：");
        axios
            .post("/", {
                TYPE: "QUEST",
                QNAME: $(item).attr("id"),
                CDKEY: token,
                PLAYERNAME: UserINFO.CNAME,
            })
            .then((msg) => {
                if (msg.data.CDKEY != undefined) prompt(msg.data.msg, msg.data.CDKEY);
                else alert(msg.data.msg);
                window.location.reload();
            });
    }
}

function showMore(obj) {
    arg2 = $(obj).attr("arg2").split("。");
    arg2 = arg2.join("。\n");
    console.log(arg2);
    swal($(obj).attr("arg1"), arg2, "info");
}

function SendCDKEY() {
    axios
        .post("/", {
            TYPE: "ChangeJOB",
            JOB: UserINFO.JOB,
            CDKEY: $("#CDKEY").val(),
            PLAYERNAME: UserINFO.CNAME,
        })
        .then((msg) => {
            alert(msg.data.msg);
            window.location.reload();
        });
}
