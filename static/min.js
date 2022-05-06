function toFirstPage() {
    $(document.body).empty(),
        $(document.body).append(
            $(
                '\n        <div id="QUESTS" style="float:left; width:100vw; height: 100vh">\n        <table style="width:100vw;">\n            <thead>\n                <tr>\n                    <th colspan="6">公開任務清單</th>\n                </tr>\n            </thead>\n            <tbody>\n                <tr align="center">\n                    <td>任務難度</td>\n                    <td>任務名稱</td>\n                    <td>任務說明</td>\n                    <td>任務獎勵</td>\n                    <td></td>\n                    <td>是否完成</td>\n                </tr>\n            </tbody>\n        </table>\n        </div>\n        <div id="SLIDEINFO" class="asideMenu">\n            <button class="btn"><i class="fas fa-chevron-right fa-2x"></i></button>\n            <div class="title">功能表單</div>\n            <div class="list">\n            <div align="left" style="margin-top:10vh">\n                <h2>登入畫面</h2>\n                <br>\n                <p style="font-size:20px;">帳號</p>\n                <input style="width:200px;font-size:16px;" id="UNAME" type="text"/>\n                <p style="font-size:20px;">密碼</p>\n                <input style="width:200px;font-size:16px;" id="PASSWORD" type="text"/>\n                <br><br>\n                <input value="確認" type="submit" onclick="LOGIN()"/>\n                <p id="wrongpw" style="color: red; display: none">Wrong password</p>\n            </div>\n            </div>\n            </div>\n        </div>\n        \n        '
            )
        ),
        $(function () {
            $(".btn").click(function () {
                $(".asideMenu").toggleClass("active"), $(".fa-chevron-right").toggleClass("rotate");
            });
        });
}
function loadQUESTS(t) {
    for (var n of ((BEGIN =
        '\n    <table style="width:100vw;">\n        <thead>\n            <tr>\n                <th colspan="6">公開任務清單</th>\n            </tr>\n        </thead>\n        <tbody>\n        <tr align="center">\n            <td>任務難度</td>\n            <td>任務名稱</td>\n            <td>任務說明</td>\n            <td>任務獎勵</td>\n            <td></td>\n            <td>是否完成</td>\n        </tr>'),
    (END = "</tbody></table>"),
    (questCODE = ""),
    (questCODE += BEGIN),
    t)) {
        let t = "red",
            e = "未完成";
        n.FINISHED && ((t = "green"), (e = `由${n.FINISHEDBY}完成`)),
            (questCODE += `\n        <tr align="center">\n            <td>${n.STARS}</td>\n            <td>${n.NAME}</td>\n            <td arg1="${n.NAME}" arg2="${n.LONGEXPLAIN}" onclick="showMore(this)">${n.EXPLAIN}...(點擊獲得更多資訊)</td>\n            <td>${n.PRICE}</td>\n            <td><button id="${n.QUESTID}" value='${n.NAME}' style="background-color:green;color:white;" onclick="submitQuest(this)">繳交任務</button></td>\n            <td style="background-color:${t};">${e}</td>\n        </tr>`);
    }
    (questCODE += END), $("#QUESTS").empty(), $("#QUESTS").append(questCODE);
}
function sessionLOGIN() {
    $("#SLIDEINFO").empty(),
        $("#SLIDEINFO").append(
            `\n    <button class="btn"><i class="fas fa-chevron-right fa-2x"></i></button>\n    <div class="title">功能表單</div>\n    <div class="list">\n    <div align="left" style="margin-top:10vh">\n        <h2>${UserINFO.CNAME}的隱藏任務</h2>\n        <br><br>\n        輸入CDKEY：\n        <input style="width:200px;font-size:12px;" id="CDKEY" type="text"/>\n        <br><br>\n        <input value="輸入CDKEY" type="submit" onclick="SendCDKEY()"/>\n    </div>\n    </div>\n    `
        );
}
function LOGIN() {
    let t = $("#UNAME").val(),
        n = $("#PASSWORD").val();
    axios.post("/", { TYPE: "LOGIN", UNAME: t, PASSWORD: n }).then((t) => {
        t.data ? window.location.reload() : $("#wrongpw").css("display", "block");
    });
}
function submitQuest(t) {
    if (null == UserINFO.CNAME) alert("請先登入");
    else {
        let n = prompt("請輸入該任務的密鑰：");
        axios.post("/", { TYPE: "QUEST", ID: $(t).attr("id"), CDKEY: n, PLAYERNAME: UserINFO.CNAME }).then((t) => {
            alert(t.data.msg), window.location.reload();
        });
    }
}
function showMore(t) {
    swal($(t).attr("arg1"), $(t).attr("arg2"), "info");
}
function SendCDKEY() {
    alert("尚未支援該功能");
}
