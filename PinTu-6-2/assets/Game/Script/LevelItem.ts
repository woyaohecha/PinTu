import HttpUnit from "../../NetWork/HttpUnit";
import MySoundMag from "../../MySoundMag";
import GameConfig from "../../NetWork/GameConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LevelItem extends cc.Component {

    @property(cc.Sprite)
    PictureBg: cc.Sprite = null;

    @property(cc.Label)
    Title: cc.Label = null;

    @property(cc.Node)
    Bg2: cc.Node = null;

    @property(cc.Node)
    Unfinished: cc.Node = null;

    @property(cc.Node)
    Finished: cc.Node = null;

    @property(cc.Node)
    LookBtn: cc.Node = null;

    @property(cc.Node)
    AgainBtn: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:

    private LevelItemData = null;
    onLoad() {
        this.AgainBtn.active = false;
    }

    start() {

    }

    // setData(data) {
    //     this.LevelItemData = data;
    //     var self = this;
    //     self.Title.string = data.level_name;
    //     let level_img = data.level_img;
    //     cc.loader.load({ url: level_img, type: "jpeg" }, function (err, texture) {
    //         if (err) {
    //             console.log("-------------------filePath err:", err);
    //         }
    //         if (texture) {
    //             var Frame = new cc.SpriteFrame(texture);
    //             if (self.PictureBg) {
    //                 self.PictureBg.spriteFrame = Frame;
    //             }
    //         }
    //     })
    // }
    dataIndex: number = 0;
    setData(dataIndex) {
        this.dataIndex = dataIndex;
        this.LevelItemData = GameConfig.levelData[dataIndex]
        var self = this;
        self.Title.string = "拼图" + (dataIndex + 1) + ":" + this.LevelItemData.level_name;
        GameConfig.loadLevelImg(dataIndex, (texture) => {
            var Frame = new cc.SpriteFrame(texture);
            if (self.PictureBg) {
                self.PictureBg.spriteFrame = Frame;
            }
        })

    }

    OnLookBtn() {
        MySoundMag.playSound("Btn");
        GameConfig.currentLevelNum = this.dataIndex;
        cc.game.emit("查看关卡");
        console.log("--------------------- 点击 查看关卡:", this.dataIndex);
    }

    OnAgainBtn() {
        MySoundMag.playSound("Btn");
        GameConfig.currentLevelNum = this.dataIndex;
        cc.game.emit("再来一次");
        console.log("--------------------- 点击 再来一次:", this.dataIndex);
    }

    // update (dt) {}
}
