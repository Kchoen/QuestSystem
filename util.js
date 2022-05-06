const crypto = require("crypto");
exports.checkCDKEY = checkCDKEY;
exports.checkJOB = checkJOB;
exports.JobQuestReply = JobQuestReply;

function checkCDKEY(CNAME, QuestID, secret, CDKEY) {
    let TOKEN = CNAME + QuestID + secret;
    hashCDKEY = crypto.createHash("MD5").update(TOKEN).digest("hex");
    return hashCDKEY == CDKEY;
}
function checkJOB(CNAME, JOB, secret, CDKEY) {
    if (JOB == "初心者") {
        JobList = ["劍士", "弓箭手", "魔法師", "盜賊", "海盜"];
        for (let j of JobList) {
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
    reply = { text: `在專屬任務中，輸入您的轉職序號即可轉職成功，還請不要外流您的轉職序號，也請你保存好，序號並不會再次發放！\n下列是您的轉職序號\n\n再次恭喜！`, CDKEY: hashCDKEY };

    return reply;
}
