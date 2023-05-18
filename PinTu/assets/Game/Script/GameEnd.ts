// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import HttpUnit from "../../NetWork/HttpUnit";
import MySoundMag from "../../MySoundMag";
import HttpRequest from "../../NetWork/HttpRequest";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameEnd extends cc.Component {

    @property(cc.Node)
    finishedBg: cc.Node = null;

    @property(cc.Node)
    logPanel: cc.Node = null;

    @property(cc.Prefab)
    logLabelPrefab: cc.Prefab = null;


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.game.on("查看关卡", this.PlayGame, this);
        cc.game.on("再来一次", this.PlayGame, this);
    }

    onDestroy() {
        cc.game.off("查看关卡", this.PlayGame, this);
        cc.game.off("再来一次", this.PlayGame, this);
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

    start() {
        console.log(HttpUnit.finishedImage);
        console.log(this.finishedBg.getComponent(cc.Sprite).spriteFrame);
        if (HttpUnit.finishedImage) {
            this.finishedBg.getComponent(cc.Sprite).spriteFrame = HttpUnit.finishedImage;
            this.finishedBg.setContentSize(600, 775);
        }
        console.log(this.finishedBg);
    }

    OnLevelListBtn() {
        MySoundMag.playSound("Btn");
        cc.game.emit("关卡列表");
    }

    OnBackBtn() {
        MySoundMag.playSound("Btn");
        cc.director.loadScene("Home");
    }

    OnNextBtn() {
        MySoundMag.playSound("Btn");
        cc.director.loadScene("Game");
    }

    isClicked: boolean = false;
    OnFinishBtn() {
        if (this.isClicked) {
            return;
        }
        this.isClicked = true;
        this.scheduleOnce(() => {
            this.isClicked = false;
        }, 1);
        let self = this;
        if (HttpUnit.IsNormal) {
            this.OnBackBtn();
        } else {
            // let url = "https://seasaasapi.kreakin.com/api/exam/game/activity/pushCardResult";
            let url = "https://hxgsaasapi.vr203.com/api/exam/game/activity/pushCardResult";
            let data: object = {
                questionCode: "",
                score: 100,
                checkPointParams: [],
                token: HttpUnit.token
            }
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    self.closeWindow();
                }
            };

            xhr.onerror = function (e) {
                self.isClicked = false;
            };

            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.send(JSON.stringify(data));
        }
    }

    closeWindow() {
        this.isClicked = false;
        if (window['wx']) {
            window['wx'].miniProgram.navigateBack();
        }
    }

    PlayGame() {
        this.node.destroy();
    }

    // update (dt) {}
}
