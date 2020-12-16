import rootAPI, {_rootPath} from "../rootAPI";

const path = {
    auth: {
        login: `${_rootPath}/login`,
        register: `${_rootPath}/register`,
    }
};

function login(data, callback) {
    rootAPI().post(path.auth.login, data)
        .then(res => {
            return callback(null, res.data);
        })
        .catch(error => {
            return callback(error);
        });
}


function register(data, callback) {
    rootAPI({withToken: false}).post(path.auth.register, data)
        .then(res => {
            return callback(null, res.data);
        })
        .catch(error => {
            return callback(error);
        });
}

export default {
    login,
    register
};