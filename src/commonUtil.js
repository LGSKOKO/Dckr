import {Message, Notice} from "view-design";
//公共类
let commonUtil = {};

//判断数组是否为空
commonUtil.isArrayEmpty = function (arr) {
    return arr.length <= 0;
};
//判断字符串是否为空
commonUtil.isStrEmpty = function (str) {
    if (typeof str == null || str === "undefined" || str === "") {
        return true;
    }
    //检验字符串是否都为空
    let regex = "^[ ]+$";
    let re = new RegExp(regex);
    return re.test(str);
};

//判断字符串是否为可转数字
commonUtil.isNumber = function (str) {
    let reg = /^[0-9]*$/;
    return reg.test(str);
};

//深拷贝
commonUtil.deepClone = function (obj) {
    return JSON.parse(JSON.stringify(obj));
};

commonUtil.error = function (title) {
    Notice.error({
        title: title,
    });
};

commonUtil.success = function (title) {
    Notice.success({
        title: title,
    });
};

export default commonUtil;
