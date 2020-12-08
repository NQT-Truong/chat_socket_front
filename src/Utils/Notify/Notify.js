import {notification} from "antd";

const success = (title = "", msg = "") => {
    openNotification('success', title, msg);
}

const info = (title = "", msg = "") => {
    openNotification('info', title, msg);
}

const warning = (title = "", msg = "") => {
    openNotification('warning', title, msg);
}

const error = (title = "", msg = "") => {
    openNotification('error', title, msg);
}

const openNotification = (type, title, msg) => {
    notification[type]({
        message: title,
        description: msg,
        duration: 2
    });
}

export default {
    success,
    info,
    warning,
    error
};
