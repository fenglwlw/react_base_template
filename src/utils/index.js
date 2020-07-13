/*
 * @Author: wangshuya
 * @Date:   2019-01-09 18:13:00
 * @Last Modified by:   wangshuya
 * @Last Modified time: 2019-05-24 11:39:04
 */
import strings from 'strings';
export function getQuery(search) { //?a=1b=2
    let _search = search.replace(/^\?/g, '').split('&');
    if (_search.length < 1) return {};
    let query = {};
    _search.forEach((item) => {
        query[item.split('=')[0]] = item.split('=')[1];
    })
    return query; //{a:1,b:2}
}
export function setQuery(data) {
    let str = '';
    for (let key in data) {
        str += (key + '=' + data[key]);
        str += '&';
    }
    // str += 'schcode=' + strings.SCHCODE + '&';
    return str.substring(0, str.length - 1);
}
export function urlParse(kk) {
    let url = window.location.search;
    let obj = {};
    let reg = /[?&][^?&]+=[^?&]+/g;
    let arr = url.match(reg);
    if (arr) {
        arr.forEach((item) => {
            let tempArr = item.substring(1).split('=');
            let key = decodeURIComponent(tempArr[0]);
            let val = decodeURIComponent(tempArr[1]);
            obj[key] = val;
        })
    }
    if (kk) {
        return obj[kk]
    }
    return obj;
}
export function hasClass(el, className) {
    let reg = new RegExp('(^|\\s*)' + className + '(\\s*|$)')
    return reg.test(el.className)
}

export function addClass(el, className) {
    if (hasClass(el, className)) {
        return
    }
    let newClass = el.className.split(' ')
    newClass.push(className)
    el.className = newClass.join(' ')
}
export function removeClass(ele, className) {
    if (hasClass(ele, className)) {
        let reg = new RegExp("(\\s|^)" + className + "(\\s|$)");
        ele.className = ele.className.replace(reg, " ");
    }
}
export function getData(el, name, val) {
    const prefix = 'data-'
    if (val) {
        return el.setAttribute(prefix + name, val)
    }
    return el.getAttribute(prefix + name)
}

export function formatFee(fee, suffix = '') {
    if (!fee) {
        return 0;
    }
    return Number(fee).toFixed(2) + suffix;
}

// 校验数字
export function isNumber(str) {
    let reg = /^[0-9]*$/g;
    return reg.test(str);
}


export function formateDate(date, type) {
    if (date) {
        if (date instanceof Date) {
            date = date.toString();
        }
        date = date.replace(/-/g, '/');
        switch (type) {
            case (1):
                {
                    let day = new Date(date).getDate();
                    let year = new Date(date).getFullYear();
                    let month = new Date(date).getMonth() + 1;
                    let hour = new Date(date).getHours();
                    let minutes = new Date(date).getMinutes();
                    let nowYear = new Date().getFullYear();
                    if (nowYear == year) {
                        return formateLength(month) + '-' + formateLength(day) + ' ' + formateLength(hour) + ':' + formateLength(minutes)
                    } else {
                        return year + '-' + formateLength(month) + '-' + formateLength(day) + ' ' + formateLength(hour) + ':' + formateLength(minutes)
                    }
                }
            case (2):
                {
                    let day = new Date(date).getDate();
                    let year = new Date(date).getFullYear();
                    let month = new Date(date).getMonth() + 1;
                    let hour = new Date(date).getHours();
                    let minutes = new Date(date).getMinutes();
                    let nowYear = new Date().getFullYear();
                    return year + '-' + formateLength(month) + '-' + formateLength(day) + ' ' + formateLength(hour) + ':' + formateLength(minutes)
                }
            case (3):
                {
                    let day = new Date(date).getDate();
                    let year = new Date(date).getFullYear();
                    let month = new Date(date).getMonth() + 1;
                    return year + '-' + formateLength(month) + '-' + formateLength(day)
                }
            case (4):
                {
                    let day = new Date(date).getDate();
                    let year = new Date(date).getFullYear();
                    let month = new Date(date).getMonth() + 1;
                    return year + '年' + formateLength(month) + '月'
                }
            default:
                {
                    let day = new Date(date).getDate();
                    let year = new Date(date).getFullYear();
                    let month = new Date(date).getMonth() + 1;
                    let hour = new Date(date).getHours();
                    let minutes = new Date(date).getMinutes();
                    let nowYear = new Date().getFullYear();
                    if (nowYear == year) {
                        return formateLength(month) + '-' + formateLength(day) + ' ' + formateLength(hour) + ':' + formateLength(minutes)
                    } else {
                        return year + '-' + formateLength(month) + '-' + formateLength(day) + ' ' + formateLength(hour) + ':' + formateLength(minutes)
                    }
                }
        }
    } else {
        return ''
    }

}


function formateLength(str) {
    if (JSON.stringify(str).length == 1) {
        return '0' + str;
    }
    return str;
}
export function closest(el, selector) {
    const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
    while (el) {
        if (matchesSelector.call(el, selector)) {
            return el;
        }
        el = el.parentElement;
    }
    return null;
}