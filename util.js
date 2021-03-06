const crypto = require("crypto");
exports.checkCDKEY = checkCDKEY;
exports.checkJOB = checkJOB;
exports.JobQuestReply = JobQuestReply;
let JobList1 = ["劍士", "弓箭手", "魔法師", "盜賊", "海盜"];
let JobList2 = ["槍騎兵", "獵人", "僧侶", "刺客", "打手"];
let JobList3 = ["黑騎士", "箭神", "主教", "夜使者", "拳霸"];
function checkCDKEY(CNAME, QuestID, secret, CDKEY) {
    let TOKEN = CNAME + QuestID + secret;
    hashCDKEY = crypto.createHash("MD5").update(TOKEN).digest("hex");
    return hashCDKEY == CDKEY;
}
function checkJOB(CNAME, secret, CDKEY, JOB) {
    if (JOB == "初心者") {
        for (let j of JobList1) {
            let TOKEN = CNAME + j + secret;
            hashCDKEY = crypto.createHash("MD5").update(TOKEN).digest("hex");
            if (hashCDKEY == CDKEY) {
                return j;
            }
        }
    } else if (JobList1.includes(JOB)) {
        for (let j of JobList2) {
            let TOKEN = CNAME + j + secret;
            hashCDKEY = crypto.createHash("MD5").update(TOKEN).digest("hex");
            if (hashCDKEY == CDKEY) {
                return j;
            }
        }
    } else if (JobList2.includes(JOB)) {
        for (let j of JobList3) {
            let TOKEN = CNAME + j + secret;
            hashCDKEY = crypto.createHash("MD5").update(TOKEN).digest("hex");
            if (hashCDKEY == CDKEY) {
                return j;
            }
        }
    }

    return false;
}
function JobQuestReply(ID, CNAME, secret) {
    JOB = ID.slice(0, ID.length - 2);

    let TOKEN = CNAME + JOB + secret;
    hashCDKEY = crypto.createHash("MD5").update(TOKEN).digest("hex");
    reply = { text: `在專屬任務中，輸入您的轉職序號即可轉職成功，\n還請不要外流您的轉職序號，也請您保存好！\n下列是您的轉職序號\n`, CDKEY: hashCDKEY };

    return reply;
}
