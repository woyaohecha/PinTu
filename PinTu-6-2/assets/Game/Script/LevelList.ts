// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import HttpUnit from "../../NetWork/HttpUnit";
import LevelItem from "./LevelItem";
import MySoundMag from "../../MySoundMag";
import LevelListManager from "./LevelListManager";
import GameConfig from "../../NetWork/GameConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LevelList extends cc.Component {

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    LevelItem: cc.Prefab = null;

    onLoad() {
        let contentHeigth = 0;
        // for (var i = 0; i < HttpUnit.LevelInfo.length; i++) {
        for (var i = 0; i < GameConfig.levelData.length; i++) {
            let LevelItemNode = cc.instantiate(this.LevelItem);
            this.content.addChild(LevelItemNode);
            contentHeigth += LevelItemNode.height;
            LevelItemNode.getComponent(LevelItem).setData(i);
            if (LevelListManager.passLevels[i] == 0) {
                LevelItemNode.getChildByName("Unfinished").active = true;
                LevelItemNode.getChildByName("Finished").active = false;
                LevelItemNode.getChildByName("Bg2").active = false;
                LevelItemNode.getChildByName("AgainBtn").active = false;

                if (!GameConfig.isNormal) {
                    LevelItemNode.getChildByName("LookBtn").active = false;
                }
            } else {
                LevelItemNode.getChildByName("Unfinished").active = false;
                LevelItemNode.getChildByName("Finished").active = true;
                LevelItemNode.getChildByName("Bg2").active = true;
                LevelItemNode.getChildByName("AgainBtn").active = true;
            }
        }
        this.content.height = contentHeigth;

        cc.game.on("查看关卡", this.OnLookBtn, this);
        cc.game.on("再来一次", this.OnAgainBtn, this);
    }

    start() {

    }

    onDestroy() {
        cc.game.off("查看关卡", this.OnLookBtn, this);
        cc.game.off("再来一次", this.OnAgainBtn, this);
    }

    OnBackBtn() {
        MySoundMag.playSound("Btn");
        this.node.destroy();
    }

    OnLookBtn() {
        this.OnBackBtn();
    }

    OnAgainBtn() {
        this.OnBackBtn();
    }
    // update (dt) {}
}
