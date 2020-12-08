import Notify from "./Notify";

const _errorMessage = {
    // AUTH
    AUTH3000: "Lỗi xác thực người dùng, vui lòng đăng nhập lại",
    AUTH3001: "Lỗi mã token xác thực, vui lòng đăng nhập lại",
    AUTH3002: "Hết hạn phiên đăng nhập, vui lòng đăng nhập lại",
    AUTH4001: "Tài khoản không còn hiệu lực",
    // LO
    LO011V: "Số mẻ trong lô phải trong khoảng từ 1-8",
    LO031V: "Số thứ tự lô không liên tục",
    LO032V: "Số thứ tự mẻ không liên tục",
    // NAU
    NAU011S: "Trường này không thuộc quyền sửa của bạn",
    NAU012P: "Bạn không đủ quyền hạn để thực hiện hành động này",
    NAU021A: "ID của lô không được trống",
    NAU041A: "Trường nhập đã có dữ liệu",
    NAU041P: "Tài khoản không trong ca nhập",
    NAU051P: "Tài khoản không đủ quyền hạn",
    NAU071P: "Bạn không làm việc ở cơ sở này",
    NAU081A: "Đang trong ca nhập của người dùng khác",
    NAU082A: "Điền đầy đủ dữ liệu các ô còn trống trước khi kết thúc ca 2",
    NAU083A: "Mẻ đã kết thúc nhập nấu",
    NAU084A: "Nhập dữ liệu cho 1 trường nào đó trước khi rời ca",
    NAU1011: "Trường này đã có dữ liệu, không thể thêm vào",
    NAU1020: "Phương thức này không được hỗ trợ",
    NAU1040: "Phương thức này không được hỗ trợ",
    NAU1071: "Mẻ trong lô đã được tạo đủ",
    // USER
    USER2011: "Sai tài khoản hoặc mật khẩu",
    PERM011: "Tài khoản không đủ quyển hạn",
    // OTHER
    incorrect_type: "Dữ liệu không hợp lệ",
    invalid: "Dữ liệu không hợp lệ",
    throttled: "Tài khoản vượt quá số lần gửi request",
    unique: "Số điện thoại đã được sử dụng"
};

const _listKey = Object.keys(_errorMessage);

function findSameKey(key) {
    if (key) {
        let findKey = _listKey.find(dt => dt === key);
        if (findKey === undefined) {
            findKey = _listKey.find(dt => dt.includes(key));
        }
        return findKey;
    }

    return null;
}

export default function displayError(error, options = {}) {
    if (error.message === "Network Error") {
        return Notify.error("Lỗi mạng", "Kiểm tra lại kết nối mạng");
    }
    if (error.response) {
        if (error.response.data.error_code === "src.base.exceptions.ValidatorInvalid") {
            return Notify.error("Sai kiểu dữ liệu", "Kiểm tra lại kiểu dữ liệu ô đang nhập");
        }
        if (error.response.data.error_code) {
            let key = findSameKey(error.response.data.error_code.split(".")[0]);
            let message = "";
            if (key) {
                message = _errorMessage[key];
            } else {
                message = error.response.data.error_code;
            }
            Notify.error(message);
        } else {
            let message = error.response.data.toString();
            Notify.error(message);
        }
    } else {
        if (error) {
            Notify.error(error.toString());
        } else {
            Notify.error("Somethings is wrong!");
        }
    }
}
