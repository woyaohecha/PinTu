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
import GameConfig from "../../NetWork/GameConfig";


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
        cc.macro.ENABLE_MULTI_TOUCH = false;
        cc.assetManager.loadBundle("Gamebase", null, (err: Error, bundle: cc.AssetManager.Bundle) => {
            MySoundMag.playBGM("BGM");
        })

        let token = this.getBrowserValue("token");
        GameConfig.token = token ? token : GameConfig.token;
        this.initHome();
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


    initHome() {
        let self = this;
        GameConfig.loadGameConfig((img) => {
            GameConfig.homeImg = img;
            self.Bg.spriteFrame = img;
        })
    }

    OnStartGameBtn() {
        MySoundMag.playSound("Btn");
        if (GameConfig.levelData.length > 0) {
            LevelListManager.initPassLevels();
            cc.director.loadScene("Game");
        }
    }

    onRulesBtn() {
        MySoundMag.playSound("Btn");
        let Rules = cc.instantiate(this.Rules);
        this.node.addChild(Rules);
    }
}
