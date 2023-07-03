// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MySoundMag from "../../MySoundMag";
import GameConfig from "../../NetWork/GameConfig";
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
        if (GameConfig.finishedImg) {
            this.finishedBg.getComponent(cc.Sprite).spriteFrame = GameConfig.finishedImg;
            this.setSize();
        } else {
            GameConfig.loadImg(GameConfig.finishedImgUrl, (img) => {
                GameConfig.finishedImg = img;
                this.finishedBg.getComponent(cc.Sprite).spriteFrame = GameConfig.finishedImg;
                this.setSize();
            })
        }
    }

    adaptiveNoteLayout() {
        let winSize = cc.winSize;//获取当前游戏窗口大小
        cc.log("--当前游戏窗口大小  w:" + winSize.width + "   h:" + winSize.height);

        let viewSize = cc.view.getFrameSize();
        cc.log("--视图边框尺寸：w:" + viewSize.width + "  h:" + viewSize.height);

        let canvasSize = cc.view.getCanvasSize();//视图中canvas尺寸
        cc.log("--视图中canvas尺寸  w:" + canvasSize.width + "  H:" + canvasSize.height);

        let visibleSize = cc.view.getVisibleSize();
        cc.log("--视图中窗口可见区域的尺寸 w:" + visibleSize.width + "   h:" + visibleSize.height);

        let designSize = cc.view.getDesignResolutionSize();
        cc.log("--设计分辨率：" + designSize.width + "    h: " + designSize.height);

        cc.log("--当前节点的尺寸 w:" + this.node.width + "   h:" + this.node.height);
    }

    setSize() {
        let canvasSize = cc.view.getCanvasSize();//视图中canvas尺寸
        cc.log("--视图中canvas尺寸  w:" + canvasSize.width + "  H:" + canvasSize.height);
        let nodeSize = this.finishedBg.getContentSize();
        let canvasTemp = canvasSize.height / canvasSize.width;
        let nodeTemp = nodeSize.height / nodeSize.width;
        if (canvasTemp > nodeTemp) {
            this.finishedBg.height = this.finishedBg.width * canvasTemp;
        } else {
            this.finishedBg.width = this.finishedBg.height / canvasTemp;
        }
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
        if (GameConfig.isNormal) {
            this.OnBackBtn();
        } else {
            // let url = "https://seasaasapi.kreakin.com/api/exam/game/activity/pushCardResult";
            let url = "https://hxgsaasapi.vr203.com/api/exam/game/activity/pushCardResult";
            let data: object = {
                questionCode: "",
                score: 100,
                checkPointParams: [],
                token: GameConfig.token
            }
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    console.log("游戏结束调用上报接口成功", url);
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
