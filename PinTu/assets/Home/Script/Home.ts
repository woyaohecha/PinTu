/*
 * @Author: 林武
 * @Date: 2023-04-22 10:42:44
 * @LastEditors: 林武
 * @LastEditTime: 2023-05-12 09:59:22
 * @FilePath: \PinTu\assets\Home\Script\Home.ts
 * @Description: 
 * 
 * Copyright (c) 2023 by 林武, All Rights Reserved. 
 */

import HttpUnit from "../../NetWork/HttpUnit";
import MySoundMag from "../../MySoundMag";
import LevelListManager from "../../Game/Script/LevelListManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Home extends cc.Component {

    @property(cc.Prefab)
    Rules: cc.Prefab = null;

    @property(cc.Sprite)
    Bg: cc.Sprite = null;

    @property(cc.Node)
    logPanel: cc.Node = null;

    @property(cc.Prefab)
    logLabelPrefab: cc.Prefab = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // this.InitData();
        // return;
        cc.macro.ENABLE_MULTI_TOUCH = false;

        cc.assetManager.loadBundle("Gamebase", null, (err: Error, bundle: cc.AssetManager.Bundle) => {
            MySoundMag.playBGM("BGM");
        })

        let token = this.getBrowserValue("token");
        let activity_id = this.getBrowserValue("activity_id");

        HttpUnit.token = token ? token : HttpUnit.token;
        HttpUnit.activity_id = Number(activity_id) ? Number(activity_id) : HttpUnit.activity_id;
        this.InitData();

        // this.showlabel("当前链接是：", window.location.href);
        // this.showlabel("当前模式是普通模式吗：", HttpUnit.IsNormal ? "是的" : "不是");
        // this.showlabel("链接获取token：", token);
        // this.showlabel("链接获取activity_id：", activity_id);
        // this.showlabel("使用的token：", HttpUnit.token);
        // this.showlabel("使用的activity_id：", HttpUnit.activity_id);

    }

    showlabel(str: string, param?) {
        let logLable = cc.instantiate(this.logLabelPrefab);
        let labelString = str;
        if (param) {
            labelString += String(param);
        }
        logLable.getComponent(cc.Label).string += labelString;
        this.logPanel.addChild(logLable);
    }

    /**
     * 获取浏览器链接上拼接的数据 例如www.baidu.com?data=123&data2=321, getBrowserValue(data)返回123。
     * @param value 数据名
     * @returns 返回数据
     */
    private getBrowserValue(value) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == value) {
                return pair[1];
            }
        }
        return null;
    }

    InitData() {
        // HttpUnit.userLogin();
        HttpUnit.getHomeInfo(HttpUnit.activity_id, 1, (data) => {
            let home_img = data.home_img;
            var self = this;
            cc.loader.load({ url: home_img, type: "jpeg" }, function (err, texture) {
                if (err) {
                    console.log("-------------------filePath err:", err);
                }
                if (texture) {
                    var Frame = new cc.SpriteFrame(texture);
                    if (self.Bg) {
                        self.Bg.spriteFrame = Frame;
                    }
                }
            })
        });
        HttpUnit.getActivityList(HttpUnit.activity_id, (data) => {
            if (data.activityInfo.length > 0) {
                HttpUnit.ruleDes = data.activityInfo[0].rule;
                let finishedImageUrl = data.activityInfo[0].bg_url;
                cc.loader.load({ url: finishedImageUrl, type: "jpg" }, function (err, texture) {
                    if (err) {
                        console.log("-------------------filePath err:", err);
                    }
                    if (texture) {
                        var Frame = new cc.SpriteFrame(texture);
                        HttpUnit.finishedImage = Frame;
                    }
                })

                // this.showlabel("接口获取activityInfo：", JSON.stringify(data.activityInfo));
                // this.showlabel("接口获取levelList：", JSON.stringify(data.levelList));
            }
        })
    }

    OnStartGameBtn() {
        MySoundMag.playSound("Btn");
        HttpUnit.getActivityList(HttpUnit.activity_id, (data) => {
            if (data.levelList.length > 0) {
                // 用于考试模式获取服务器进度 从当前进度开始游戏
                if (HttpUnit.LevelNum >= data.levelList.length) {
                    HttpUnit.LevelNum = data.levelList.length - 1;
                }
                HttpUnit.LevelInfo = data.levelList;
                if (LevelListManager.passLevels.length == 0) {
                    LevelListManager.initPassLevels();
                }
                cc.director.loadScene("Game");
            }
        })
    }

    onRulesBtn() {
        MySoundMag.playSound("Btn");
        let Rules = cc.instantiate(this.Rules);
        this.node.addChild(Rules);
    }

    // update (dt) {}
}
