import HttpUnit from "../../NetWork/HttpUnit";
import MySoundMag from "../../MySoundMag";
import GameConfig from "../../NetWork/GameConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Rules extends cc.Component {

    @property(cc.Label)
    ruleDes: cc.Label = null;


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        if (GameConfig.rule != "") {
            this.ruleDes.string = GameConfig.rule;
        }
    }

    start() {

    }

    onCloseBtn() {
        MySoundMag.playSound("Btn");
        this.node.destroy();
    }

    // update (dt) {}
}
