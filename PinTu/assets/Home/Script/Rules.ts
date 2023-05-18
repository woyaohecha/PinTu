import HttpUnit from "../../NetWork/HttpUnit";
import MySoundMag from "../../MySoundMag";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Rules extends cc.Component {

    @property(cc.Label)
    ruleDes: cc.Label = null;


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        if (HttpUnit.ruleDes != "") {
            this.ruleDes.string = HttpUnit.ruleDes;
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
