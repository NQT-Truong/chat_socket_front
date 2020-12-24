import rootAPI, {_rootPath} from "../rootAPI";

const path = {
    updateImage: `${_rootPath}/update-image`,
};

function getImage(data, callback) {
    rootAPI({withToken: false}).post(path.updateImage, {
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
    getImage
};