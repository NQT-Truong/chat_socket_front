import * as types from "../constants";

export const userChange = user => ({
    type: types.USER_CHANGE,
    user
});

export const userClear = () => ({
    type: types.USER_CLEAR
});


