import rootAPI, {_rootPath} from "../rootAPI";

const path = {
    listUser: `${_rootPath}/list-user-room`,
};

function getListUser(data, callback) {
    rootAPI({withToken: false}).get(path.listUser, {
        params: data
    })
        .then(res => {
            return callback(null, res.data);
        })
        .catch(error => {
            console.log(error)
            return callback(error);
        });
}

export default {
    getListUser
};