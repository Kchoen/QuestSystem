function toFirstPage() {
    $(document.body).empty();
    $(document.body).append(
        $(`
        <div id="QUESTS" style="float:left; width:100vw; height: 100vh; margin-right:1%;">
        <table style="width:99vw;">
            <thead>
                <tr>
                    <th colspan="2">歡迎各位雲夢小夥伴~~~<br>
                    這裡是我們本次活動使用的任務網站~~~<br></th>
                </tr>
            </thead>
            <tbody>
                
                
               
                <tr align="center">
                    <td>活動名稱 </td>
                    <td>冒險島任務日誌</td>
                </tr>
                <tr align="center">
                    <td>活動說明 </td>
                    <td>在任務系統中，有許多任務等著你完成
                        <img src="https://i.imgur.com/GVWmReB.png" width="80" height="80"><br>
                        我們有主線任務，讓攻略玩家升級自己，最後完成終極任務<br>
                        我們也有支線任務，讓休閒玩家享受自在，不必被升級轉職綑綁<br>
                        每個任務都有豐厚獎勵。<br>但我們還是期待大家盡力完成終極任務！<br>這一串任務線，我們耗費了不少心力與時間完成。<br>
                        <img src="https://i.imgur.com/BpzuVHC.jpg" width="250" height="160"><br>
                        <br><br>
                        在右側的選單中，能夠登入大家的帳號密碼。<br>
                        進入登入畫面後，右側選單將會顯示大家的名稱...等等資料。<br>
                        不少主線任務都會有職業、等級限制<br>
                        未達到限制前，任務將不會出現在各位的任務系統中。<br>
                        第一名完成任務者，將會在任務系統中廣播。<br>
                        也會有"神秘任務"，會在廣播後出現，還請各位留意~<br>
                        (小提示：完成試煉任務以後，將會讓主線任務為各位完全開啟！<br>
                            以及支線任務中的神權任務，第一個獲得所有神權的人，得以開啟該神權的試煉！<br>
                            在黑風的同意下，完成試煉可直接通過部分關卡！(向黑風詢問詳情))<br>
                        <img src="https://i.imgur.com/I3dcSPq.jpg" width="250" height="160"><br>_
                    </td>
                </tr>
                <tr align="center">
                    <td>製作人的話 </td>
                    <td>這次的活動規劃，大概從四月底開始製作<br>
                        原本想要弄一個酷一點的東東
                        <img src="https://i.imgur.com/E5HSp3p.jpg" width="100" height="70"><br>
                        期間黑風因為臨時被搞，活動日期提前<br>
                        讓本次活動籌畫真的很緊張<br>
                        如果網站或是活動有任何BUG<br>
                        請各位趕快跟黑風或是墨易講<br>
                        還請各位多多包涵(也不要用BUG刷獎勵!!XD)
                        <img src="https://i.imgur.com/xAqIFYm.jpg" width="100" height="70"><br>
                        在最後，(能看到最後的真的謝謝你們!!!! 都是手打的!)<br>
                        也祝各位玩得開心，開心最重要！！<img src="https://i.imgur.com/kvj5Nux.jpg" width="100" height="70"><br>
                        也期待各位在活動之後能夠分享心得，讓我們能夠為下次活動做改善！<br><br>
                        怎麼樣 我這圖片 有像puppy嗎 :)
                    </td>
                </tr>
                
            </tbody>
        </table>
        <br>
        </div>
        <div id="Menu" class="asideMenu">
        <button class="open"></button>
        <button class="close"></button>
            <div  id="SLIDEINFO" >
            <div class="title">功能表單</div>
            <div class="list">
            <div align="left" style="margin-top:10vh">
                <h2 style="font-size:30px;font-weight:800">登入畫面</h2>
                <br>
                <p style="font-size:20px;">帳號</p>
                <input style="width:200px;font-size:16px;" id="UNAME" type="text"/>
                <p style="font-size:20px;">密碼</p>
                <input type="password" style="width:200px;font-size:16px;" id="PASSWORD" type="text"/>
                <br><br>
                <input class="button-62" value="確認" type="submit" onclick="LOGIN()"/>
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
    <table style="width:99vw;">
        <thead>
            <tr>
                <th colspan="6">公開任務清單</th>
            </tr>
        </thead>
        <tbody id="qTable">
        <tr align="left">
            <td colspan="6">
            <button class="button-85" style="color:white;font-weight:600" onclick="filterQuest('全任務')">全部任務</button>
            <button class="button-85" style="color:white;font-weight:600" onclick="filterQuest('主線任務')">主線任務</button>
            <button class="button-85" style="color:white;font-weight:600" onclick="filterQuest('支線任務')">支線任務</button>
            <button class="button-85" style="color:white;font-weight:600" onclick="filterQuest('答題任務')">答題任務</button>
            <button class="button-85" style="color:white;font-weight:600" onclick="filterQuest('隱藏任務')">隱藏任務</button>
            </td>
            
            
        </tr>
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
    UNFINISHED = [];
    for (var q of QUESTS) {
        let color = "green",
            text = "未完成",
            btntxt = "";
        if (!q.PEOPLE.includes(UserINFO.CNAME)) {
            UNFINISHED.push(q);
            continue;
        }
        if (q.FINISHED) {
            btntxt = `arg1="已完成玩家" arg2="${q.PEOPLE.join("、")}" onclick="showMore(this)"`;
            text = `由${q.FINISHEDBY}完成`;
        }
        questCODE += `
        <tr align="center">
            <td>${q.MTYPE}</td>
            <td>${q.QNAME}</td>
            <td><button arg1="${q.QNAME}" arg2="${q.LONGEXPLAIN}" onclick="showMore(this)" style="cursor: pointer;color:rgba(213, 235, 255, 0.932);font-weight:800;">${q.EXPLAIN}...(點擊獲得更多資訊)</button></td>
            <td><button arg1="任務獎勵" arg2="${q.PRICE}" onclick="showMore(this)" style="cursor: pointer;color:rgba(213, 235, 255, 0.932);font-weight:800;">${q.PRICE.split("幣").length > 1 ? q.PRICE.split("幣")[0] + "幣" : "黑風"}...</button></td>
            <td class="postBTN" id="${q.QNAME}" style="background-color:green;color:white;" onclick="submitQuest(this)">繳交任務</td>
            <td ${btntxt} style="cursor: pointer;background-color:${color};">${text}</td>
        </tr>`;
    }
    for (var q of UNFINISHED) {
        let color = "red",
            text = "未完成",
            btntxt = "";
        if (q.FINISHED) {
            btntxt = `arg1="已完成玩家" arg2="${q.PEOPLE.join("、")}" onclick="showMore(this)"`;
            text = `由${q.FINISHEDBY}完成`;
        }
        questCODE += `
        <tr align="center">
            <td>${q.MTYPE}</td>
            <td>${q.QNAME}</td>
            <td><button arg1="${q.QNAME}" arg2="${q.LONGEXPLAIN}" onclick="showMore(this)" style="cursor: pointer;color:rgba(213, 235, 255, 0.932);font-weight:800;">${q.EXPLAIN}...(點擊獲得更多資訊)</button></td>
            <td><button arg1="任務獎勵" arg2="${q.PRICE}" onclick="showMore(this)" style="cursor: pointer;color:rgba(213, 235, 255, 0.932);font-weight:800;">${q.PRICE.split("幣").length > 1 ? q.PRICE.split("幣")[0] + "幣" : "黑風"}...</button></td>
            <td class="postBTN" id="${q.QNAME}" style="background-color:green;color:white;" onclick="submitQuest(this)">繳交任務</td>
            <td ${btntxt} style="cursor: pointer;background-color:${color};">${text}</td>
        </tr>`;
    }
    questCODE += END;
    $("#QUESTS").empty();
    $("#QUESTS").append(questCODE);
}

function sessionLOGIN() {
    if (UserINFO.JOB == "GM") {
        text = "text";
        value = { 1: "指令輸入區", 2: "輸入指令" };
    } else {
        text = "password";
        value = { 1: "完成專屬任務：", 2: "輸入任務密鑰" };
    }
    $("#SLIDEINFO").empty();
    $("#SLIDEINFO").append(`
    <div class="title">功能表單</div>
    <div class="list" style="margin-top:20px">
    <div align="left">
        <table style="float:left;width:15vw;">
            
            <tbody>
                <tr>
                    <th colspan="2">角色資訊</th>
                </tr>
                <tr align="center">
                    <td style="width:5vw;">名稱</td>
                    <td style="width:10vw;">${UserINFO.CNAME}</td>
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
        
        <h3 style="float:left;font-weight:800;font-size:20px"><br>${value["1"]}</h3>
        <input type="${text}" style="width:200px;font-size:18px;" id="CDKEY" />
        <br><br>
        <input class="button-62" value="${value["2"]}" type="submit" onclick="SendCDKEY()"/>
        <br><br>
        <input class="button-62" value="登出" type="submit" style="margin-top:40px;width:70px;font-size:13px;" onclick="logout()"/>
    </div>
    </div>
    `);
}
function init() {
    axios.get("/FetchINFO").then((M) => {
        if (M.data.UNAME != undefined) {
            UserINFO = { UNAME: M.data.UNAME, CNAME: M.data.CNAME, JOB: M.data.JOB, LVL: M.data.LVL };
            sessionLOGIN();
            FetchQUESTS();
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
        Swal.fire({
            title: "公告",
            html: "<pre style='font-weight:800;'>" + msg + "</pre>",
            customClass: {
                popup: "format-pre",
            },
            width: 600,
            padding: "3em",
            color: "#716add",
            backdrop: `
            rgba(0,0,123,0.4)
            url("/images/boss.gif")
            left
            no-repeat
          `,
        }).then((result) => {
            window.location.reload();
        });
    });
    socket.on("CELEBRATION", (msg) => {
        Swal.fire({
            title: "恭喜",
            //input: "text",
            html: "<pre style='font-weight:800;'>" + msg + "</pre>",
            customClass: {
                popup: "format-pre",
            },
            width: 600,
            padding: "3em",
            color: "#716add",
            backdrop: `
            rgba(0,0,123,0.4)
            url("/images/green.gif")
            left
            no-repeat
          `,
        });
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
    text = "請輸入該任務的密鑰：";
    if ($(item).attr("id").slice(0, 4) == "快問快答") {
        text = "請輸入問題的答案：";
    }
    Swal.fire({
        title: text,
        input: "text",
        inputAttributes: {
            autocapitalize: "off",
        },
        showCancelButton: true,
        confirmButtonText: "提交",
        showLoaderOnConfirm: true,
    }).then((result) => {
        let token = result.value;
        if (token != null) {
            axios
                .post("/", {
                    TYPE: "QUEST",
                    QNAME: $(item).attr("id"),
                    CDKEY: token,
                    PLAYERNAME: UserINFO.CNAME,
                })
                .then((msg) => {
                    if (msg.data.CDKEY != undefined) {
                        Swal.fire({
                            title: "通知",
                            html: "<pre style='font-weight:800;'>" + `${msg.data.msg}\n\n${msg.data.CDKEY}` + "</pre>",
                            customClass: {
                                popup: "format-pre",
                            },
                            //input: "text",
                            width: 600,
                            padding: "3em",
                            color: "#716add",
                            backdrop: `
                    rgba(0,0,123,0.4)
                    url("/images/mushroom.gif")
                    left
                    no-repeat
                    `,
                        }).then((result) => {
                            window.location.reload();
                        });
                    } //prompt(msg.data.msg, msg.data.CDKEY);
                    else {
                        Swal.fire({
                            title: "通知",
                            //input: "text",
                            html: "<pre style='font-weight:800;'>" + msg.data.msg + "</pre>",
                            customClass: {
                                popup: "format-pre",
                            },
                            width: 600,
                            padding: "3em",
                            color: "#716add",
                            backdrop: `
                    rgba(0,0,123,0.4)
                    url("/images/green.gif")
                    left
                    no-repeat
                    `,
                        }).then((result) => {
                            window.location.reload();
                        });
                    }
                });
        }
        return;
    });
}

function showMore(obj) {
    Swal.fire({
        title: $(obj).attr("arg1"),
        width: 600,
        padding: "3em",
        html: "<pre style='text-align:left;font-size:16px;font-weight:800;'>" + $(obj).attr("arg2") + "</pre>",
        customClass: {
            popup: "format-pre",
        },
    });
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
            Swal.fire({
                title: "通知",
                html: "<pre style='font-weight:800;'>" + msg.data.msg + "</pre>",
                customClass: {
                    popup: "format-pre",
                },
                width: 600,
                padding: "3em",
                color: "#716add",
                backdrop: `
                rgba(0,0,123,0.4)
                url("/images/mushroom.gif")
                left
                no-repeat
              `,
            }).then((result) => {
                window.location.reload();
            });
        });
}
function logout() {
    axios
        .post("/", {
            TYPE: "LOGOUT",
        })
        .then(() => {
            window.location.reload();
        });
}
function filterQuest(TYPE) {
    QUESTS = QuestINFO;
    BEGIN = `
        <tr align="left">
        <td colspan="6">
            <button class="button-85" style="color:white;font-weight:600" onclick="filterQuest('全任務')">全部任務</button>
            <button class="button-85" style="color:white;font-weight:600" onclick="filterQuest('主線任務')">主線任務</button>
            <button class="button-85" style="color:white;font-weight:600" onclick="filterQuest('支線任務')">支線任務</button>
            <button class="button-85" style="color:white;font-weight:600" onclick="filterQuest('答題任務')">答題任務</button>
            <button class="button-85" style="color:white;font-weight:600" onclick="filterQuest('隱藏任務')">隱藏任務</button>
            
            </td>
            
        </tr>
        <tr align="center">
            <td style="color:yellow">任務類型</td>
            <td style="color:yellow">任務名稱</td>
            <td style="color:yellow">任務說明</td>
            <td style="color:yellow">任務獎勵</td>
            <td></td>
            <td style="color:yellow">是否完成</td>
        </tr>`;
    END = "</table>";
    questCODE = "";
    questCODE += BEGIN;
    UNFINISHED = [];
    for (var q of QUESTS) {
        if (TYPE != "全任務") {
            if (TYPE == "主線任務") {
                if (!["終極任務", "主線任務", "轉職任務", "職業任務", "試煉任務"].includes(q.MTYPE)) {
                    continue;
                }
            } else if (q.MTYPE != TYPE) {
                continue;
            }
        }
        let color = "green",
            text = "未完成",
            btntxt = "";
        if (!q.PEOPLE.includes(UserINFO.CNAME)) {
            UNFINISHED.push(q);
            continue;
        }
        if (q.FINISHED) {
            btntxt = `arg1="已完成玩家" arg2="${q.PEOPLE.join("、")}" onclick="showMore(this)"`;
            text = `由${q.FINISHEDBY}完成`;
        }
        questCODE += `
        <tr align="center">
            <td>${q.MTYPE}</td>
            <td>${q.QNAME}</td>
            <td><button arg1="${q.QNAME}" arg2="${q.LONGEXPLAIN}" onclick="showMore(this)" style="cursor: pointer;color:rgba(213, 235, 255, 0.932);font-weight:800;">${q.EXPLAIN}...(點擊獲得更多資訊)</button></td>
            <td><button arg1="任務獎勵" arg2="${q.PRICE}" onclick="showMore(this)" style="cursor: pointer;color:rgba(213, 235, 255, 0.932);font-weight:800;">${q.PRICE.split("幣").length > 1 ? q.PRICE.split("幣")[0] + "幣" : "黑風"}...</button></td>
            <td class="postBTN" id="${q.QNAME}" style="background-color:green;color:white;" onclick="submitQuest(this)">繳交任務</td>
            <td ${btntxt} style="cursor: pointer;background-color:${color};">${text}</td>
        </tr>`;
    }
    for (var q of UNFINISHED) {
        let color = "red",
            text = "未完成",
            btntxt = "";
        if (q.FINISHED) {
            btntxt = `arg1="已完成玩家" arg2="${q.PEOPLE.join("、")}" onclick="showMore(this)"`;
            text = `由${q.FINISHEDBY}完成`;
        }
        questCODE += `
        <tr align="center">
            <td>${q.MTYPE}</td>
            <td>${q.QNAME}</td>
            <td><button arg1="${q.QNAME}" arg2="${q.LONGEXPLAIN}" onclick="showMore(this)" style="cursor: pointer;color:rgba(213, 235, 255, 0.932);font-weight:800;">${q.EXPLAIN}...(點擊獲得更多資訊)</button></td>
            <td><button arg1="任務獎勵" arg2="${q.PRICE}" onclick="showMore(this)" style="cursor: pointer;color:rgba(213, 235, 255, 0.932);font-weight:800;">${
            q.PRICE.split("幣").length > 1 ? q.PRICE.split("幣")[0] + "幣" : "黑風"
        }......(點擊獲得更多資訊)</button></td>
            <td class="postBTN" id="${q.QNAME}" style="background-color:green;color:white;" onclick="submitQuest(this)">繳交任務</td>
            <td ${btntxt} style="cursor: pointer;background-color:${color};">${text}</td>
        </tr>`;
    }
    questCODE += END;
    $("#qTable").empty();
    $("#qTable").append(questCODE);
}
