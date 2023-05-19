/*
 * @Author: 林武
 * @Date: 2022-11-04 11:00:53
 * @LastEditors: 林武
 * @LastEditTime: 2023-05-12 10:00:02
 * @FilePath: \PinTu\assets\NetWork\HttpUnit.ts
 * @Description: 
 * 
 * Copyright (c) 2022 by 林武/长沙游品, All Rights Reserved. 
 */

import HttpRequest from "./HttpRequest";
import NetConfig from "./NetConfig";

export default class HttpUnit {

    public static token = "1655913668332855296";

    public static uid = "";

    public static LevelInfo = null;

    public static LevelNum = 0;

    public static level_texture = null;

    public static ruleDes = "";

    public static finishedImage = null;

    public static activity_id = 1001;

    /** 是否是普通模式 */
    public static IsNormal: boolean = true;

    public static Requset(url: string, data: any, caller: any, completed: Function, error: (...args) => void, method: string, responseType: string = "json", headers: [] = null): void {
        let xhr: HttpRequest = new HttpRequest();
        xhr.once(HttpRequest.COMPLETE, (data) => {
            if (typeof (data) == "string") {
                data = JSON.parse(data);
                console.error("----------------------- data:", typeof (data))
            }

            if (data.code != 1000) {
                this.Error(xhr, data);
                error && error.call(data);
                return;
            }
            completed && completed.call(caller, data);
        }, null);
        xhr.once(HttpRequest.ERROR, error, caller);
        xhr.once(HttpRequest.ERROR, this.Error, HttpUnit);
        xhr.send(url, data, method, responseType, headers);
    }

    public static Post(url: string, data: any, caller: any, completed: Function, error: (...args) => void, responseType: string = "json", headers: [] = null): void {
        this.Requset(url, data, caller, completed, error, "post", responseType, headers);
    }

    public static Get(url: string, data: any, caller: any, completed: Function, error: (...args) => void, responseType: string = "json", headers: [] = null): void {
        this.Requset(url, data, caller, completed, error, "get", responseType, headers);
    }

    public static PostJson(url: string, data: any, caller: any, completed: Function, error: (...args) => void) {
        this.Post(url, data, caller, completed, error, "json");
    }

    private static Error(xhr: HttpRequest, message: any): void {
        console.log("Requset Error, Url:" + xhr.url + ", Error Message:" + JSON.stringify(message));
        if (message) {
            console.log("----------------------- message:", message)
            console.log("----------------------- message:", typeof (message))
            // Utils.showTips(message.errmsg);
        }
    }

    public static JsonToKeyValue(param: any): string {
        let res = [];
        for (var key in param) {
            res.push(key + '=' + param[key]);
        }
        let KeyValue: any = res;
        if (res.length > 1) {
            KeyValue = res.join('&&');
        }
        return KeyValue;
    }

    public static userLogin(callBack?) {
        var url = NetConfig.RootPath + NetConfig.userLogin;
        let paramsObj: any = {};
        paramsObj.token = HttpUnit.token;
        let KeyValue = HttpUnit.JsonToKeyValue(paramsObj);

        url = url + "?" + KeyValue;
        HttpUnit.Get(url, null, this, (res) => {
            console.log("------------------------ HttpUnit 加载用户信息 res:", res);
            if (res.data) {
                if (callBack) {
                    callBack(res);
                }
                HttpUnit.uid = res.data.uid;
                console.log("---------------------- res.data.level:", JSON.parse(res.data.level))
                let level = JSON.parse(res.data.level);
                // if (!HttpUnit.IsNormal) {
                //     HttpUnit.LevelNum = Number(level[HttpUnit.activity_id]) ? Number(level[HttpUnit.activity_id]) : 0;
                //     console.log("---------------------- HttpUnit.LevelNum:", HttpUnit.LevelNum)
                // }
                HttpUnit.LevelNum = 0;
            }
        }, null);
    }

    public static getActivityList(activity_id: number, callBack?) {
        var url = NetConfig.RootPath + NetConfig.getActivityList;
        let paramsObj: any = {};
        paramsObj.activity_id = activity_id;

        let KeyValue = HttpUnit.JsonToKeyValue(paramsObj);

        url = url + "?" + KeyValue;

        HttpUnit.Get(url, null, this, (res) => {
            console.log("------------------------ HttpUnit 获取某个活动及其包含的所有关卡信息 res:", res);
            if (res.data) {
                if (callBack) {
                    callBack(res.data);
                }
            }
        }, null);
    }

    public static getLevelInfo(activity_id: number, level_sort: number, callBack?) {
        var url = NetConfig.RootPath + NetConfig.getLevelInfo;
        let paramsObj: any = {};
        paramsObj.activity_id = activity_id;
        paramsObj.level_sort = level_sort;

        let KeyValue = HttpUnit.JsonToKeyValue(paramsObj);

        url = url + "?" + KeyValue;

        HttpUnit.Get(url, null, this, (res) => {
            console.log("------------------------ HttpUnit 获取某个关卡信息 res:", res);
            if (res.data) {
                if (callBack) {
                    callBack(res.data);
                }
            }
        }, null);
    }

    public static updateUserLevel(activity_id: number, level_sort: number, callBack?) {
        var url = NetConfig.RootPath + NetConfig.updateUserLevel;
        let paramsObj: any = {};
        paramsObj.activity_id = activity_id;
        paramsObj.level_sort = level_sort;
        paramsObj.uid = HttpUnit.uid;

        let KeyValue = HttpUnit.JsonToKeyValue(paramsObj);

        url = url + "?" + KeyValue;

        HttpUnit.Get(url, null, this, (res) => {
            console.log("------------------------ HttpUnit 修改用户某个活动的关卡进度 res:", res);
            if (res.data) {

            }
        }, null);
    }

    public static getHomeInfo(activity_id: number, level_sort: number, callBack?) {
        var url = NetConfig.RootPath + NetConfig.getHomeInfo;
        let paramsObj: any = {};
        paramsObj.activity_id = activity_id;
        paramsObj.level_sort = level_sort;
        paramsObj.uid = HttpUnit.uid;

        let KeyValue = HttpUnit.JsonToKeyValue(paramsObj);

        url = url + "?" + KeyValue;

        HttpUnit.Get(url, null, this, (res) => {
            console.log("------------------------ HttpUnit 获取主页信息 res:", res);
            if (res.data) {
                if (callBack) {
                    callBack(res.data);
                }
            }
        }, null);
    }

    public static GetNowLevelInfo() {
        return HttpUnit.LevelInfo[HttpUnit.LevelNum];
    }

    public static GetIsLastLevel() {
        let IsLastLevel: boolean = false;
        if ((HttpUnit.LevelNum + 1) >= HttpUnit.LevelInfo.length) {
            IsLastLevel = true;
        }
        return IsLastLevel;
    }

    private static GetParamsMsgForObj(paramsObj: any): string {
        let res = [];
        for (var key in paramsObj) {
            res.push(key + '=' + paramsObj[key]);
        }
        return res.join('&');
    }
}