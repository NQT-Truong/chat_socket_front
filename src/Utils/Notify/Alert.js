const smalltalk = require('./Smalltalk');

const _default_title = "Chat New";

function alert(msg, title = _default_title) {
    smalltalk.alert(title, msg);
}

function confirm(msg, callback) {
    smalltalk.confirm(_default_title, msg, {className: 'slideInTop'})
        .then(() => {
            return callback(true);
        })
        .catch(() => {
            return callback(false);
        })
}

function prompt(inputLabel, value = "", callback) {
    smalltalk.prompt(_default_title, "", value, {inputLabel})
        .then((value) => {
            return callback(true, value);
        })
        .catch(() => {
            return callback(false);
        })
}

export default {
    alert,
    confirm,
    prompt
}

