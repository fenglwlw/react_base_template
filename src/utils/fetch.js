/*
 * @Author: wangshuya
 * @Date:   2018-12-07 13:53:16
 * @Last Modified by:   wangshuya
 * @Last Modified time: 2019-01-11 09:34:20
 */
import strings from 'strings';
import { getQuery } from 'utils';
import 'isomorphic-fetch';
require('es6-promise').polyfill();
import { _fetch } from 'redux/reduxHelper';
export function post(url, data) {
    return new Promise((resolve, reject) => {
        fetch(url, {
                method: 'post',
                body: JSON.stringify(data),
                headers: {　　　　
                    'Accept': 'application/json',
                    　　　　'Content-Type': 'application/json',
                }
            })
            .then((response) => response.json())
            .then((json) => {
                if (!isNaN(json.errcode) && json.errcode !== 0) {
                    reject(json.errmsg);
                } else if (json.data) {
                    resolve(json);
                } else if (json.error) {
                    reject(json.error);
                } else {
                    if (json.errmsg) {
                        reject(json.errmsg);
                    }
                    reject(strings.NET_ERROR);
                }
            })
            .catch((err) => {
                reject(err);
            });
    })
}
export function get(url, data) {
    return new Promise((resolve, reject) => {
        _fetch(url + getQuery(data), 4000)
            .then((response) => response.json())
            .then((json) => {
                if (!isNaN(json.errcode) && json.errcode !== 0) {
                    reject(json.errmsg);
                } else if (json.data) {
                    resolve(json);
                } else if (json.error) {
                    reject(json.error);
                } else {
                    if (json.errmsg) {
                        reject(json.errmsg);
                    }
                    reject(strings.NET_ERROR);
                }
            })
            .catch((err) => {
                reject(err);
            });
    })
}