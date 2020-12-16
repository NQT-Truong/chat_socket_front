import * as types from "../constants";

const initialState = {
    "authToken": null,
    "expires": null,
    //
    "uuid": null,
    "fullName": null,
    "dateOfBirth": null,
    "username": null,
    "email": null,
    "avatar": null,
    "organization": null,
    "language": null,
    "plan": null,
    "phoneNumber": null,
    "gender": null,
    "groups": null,
    "activated": null,
    "modified": null,
    "created": null
};

export default function (state = initialState, action) {
    switch (action.type) {
        case types.USER_CHANGE:
            return {
                ...state,
                ...action.user
            };
        case types.USER_CLEAR:
            return initialState;
        default:
            return state;
    }
}
