import _ from "lodash";

import DateTime from "./DateTime/DateTime";

export function isEmpty(value) {

    if (_.isObject(value)) {
        if (Object.keys(value).length === 0) return true;
    }

    if (_.isArray(value)) {
        if (value.length === 0) return true;
    }

    if (value === "") {
        return true;
    }

    return (
        // _.isEmpty(value) ||
        _.isNull(value) ||
        _.isUndefined(value)
    )
}

export function deepCompareObj(x, y) {
    return JSON.stringify(x) === JSON.stringify(y)
}

export function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

export function copyValue(obj = {}) {
    return JSON.parse(JSON.stringify(obj))
}

function checkShouldComponentUpdate(checkList = {}, thisState = {}, nextState = {}, thisProps = {}, nextProps = {}) {
    if (checkList.props) {
        for (let i = 0; i < checkList.props.length; i++) {
            if (thisProps[checkList.props[i]] !== nextProps[checkList.props[i]]) {
                return true;
            }
        }
    }
    if (checkList.state) {
        for (let i = 0; i < checkList.state.length; i++) {
            if (thisState[checkList.state[i]] !== nextState[checkList.state[i]]) {
                return true;
            }
        }
    }
    if (checkList.deepCompare) {
        if (checkList.deepCompare.props) {
            for (let i = 0; i < checkList.deepCompare.props.length; i++) {
                if (!deepCompareObj(thisProps[checkList.deepCompare.props[i]], nextProps[checkList.deepCompare.props[i]])) {
                    return true;
                }
            }
        }
        if (checkList.deepCompare.state) {
            for (let i = 0; i < checkList.state.length; i++) {
                if (!deepCompareObj(thisState[checkList.deepCompare.state[i]], thisState[checkList.deepCompare.state[i]])) {
                    return true;
                }
            }
        }
    }
}


function randomId() {
    return 'xxxxxxxx-xxxxxxxx'.replace(/[xy]/g, function (c) {
        // eslint-disable-next-line no-mixed-operators,eqeqeq
        let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function sortByKey(obj) {
    let ordered = {};
    Object.keys(obj).sort().forEach(function (key) {
        ordered[key] = obj[key];
    });
    console.log(JSON.stringify(ordered));
}

export default {
    isEmpty,
    deepCompareObj,
    DateTime,
    isMobileDevice,
    copyValue,
    checkShouldComponentUpdate,
    randomId,
    sortByKey
}


