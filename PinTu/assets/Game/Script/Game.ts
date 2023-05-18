/*
 * @Author: 林武
 * @Date: 2023-04-22 09:14:13
 * @LastEditors: 林武
 * @LastEditTime: 2023-05-12 09:45:17
 * @FilePath: \PinTu\assets\Game\Script\Game.ts
 * @Description: 
 * 
 * Copyright (c) 2023 by 林武, All Rights Reserved. 
 */

import { STATE } from "./PuzzleConstants";
import { PuzzleBoard } from "./PuzzleBoard";
import { Timer } from "./Timer";
import HttpUnit from "../../NetWork/HttpUnit";
import MySoundMag from "../../MySoundMag";
import LevelListManager from "./LevelListManager";

const { ccclass, property } = cc._decorator;

@ccclass
export class PuzzleScene extends cc.Component {

    @property(cc.Label)
    private Title1: cc.Label = null;

    @property(cc.Label)
    private Title2: cc.Label = null;

    @property(PuzzleBoard)
    private board: PuzzleBoard = null;
    @property(Timer)
    private timer: Timer = null;
    @property(cc.Node)
    private winPanel: cc.Node = null;
    @property(cc.Node)
    private GameFail: cc.Node = null;

    @property(cc.Node)
    private PlayAgainBtn: cc.Node = null;

    @property(cc.Node)
    private NextBtn: cc.Node = null;

    @property(cc.Node)
    private FinishBtn: cc.Node = null;

    @property(cc.Node)
    private LevelListBtn: cc.Node = null;

    @property(cc.Prefab)
    private LevelList: cc.Prefab = null;

    @property(cc.Prefab)
    private GameEnd: cc.Prefab = null;

    @property(cc.Node)
    endEffect: cc.Node = null;

    @property(cc.Node)
    logPanel: cc.Node = null;

    @property(cc.Prefab)
    logLabelPrefab: cc.Prefab = null;

    private HorizontalNum: number = 3;
    private VerticalNum: number = 3;

    public state: STATE = STATE.NONE;

    onLoad() {
        cc.macro.ENABLE_MULTI_TOUCH = false;
    }

    start() {
        this.addListeners();
        this.startGame();

        cc.game.on("时间用完", this.TimeOver, this);
        cc.game.on("查看关卡", this.OnLookBtn, this);
        cc.game.on("再来一次", this.OnAgainBtn, this);
        cc.game.on("关卡列表", this.OnLevelListBtn, this);

    }

    showlabel(str: string, param?) {
        let logLable = cc.instantiate(this.logLabelPrefab);
        let labelString = str;
        if (param) {
            labelString += String(param);
        }
        logLable.getComponent(cc.Label).string += labelString;
        this.logPanel.addChild(logLable);
        this.logPanel.zIndex = 1000;
    }

    nolabel() {
        this.logPanel.removeAllChildren();
    }

    protected onDestroy(): void {
        cc.game.off("时间用完", this.TimeOver, this);
        cc.game.off("查看关卡", this.OnLookBtn, this);
        cc.game.off("再来一次", this.OnAgainBtn, this);
        cc.game.off("关卡列表", this.OnLevelListBtn, this);
    }

    OnLookBtn() {
        let callback = () => {
            this.overGame();
        }
        this.startGame(callback);
    }

    OnAgainBtn() {
        this.startGame();
    }

    private startGame(callback?) {
        // this.showlabel("当前关卡信息level_sort:", HttpUnit.GetNowLevelInfo().level_sort);
        // this.showlabel("当前关卡信息level_name:", HttpUnit.GetNowLevelInfo().level_name);
        // this.showlabel("当前关卡信息:", JSON.stringify(HttpUnit.GetNowLevelInfo()));
        this.GameFail.active = false;
        // this.winPanel.active = false;
        this.PlayAgainBtn.active = false;
        this.NextBtn.active = false;
        this.FinishBtn.active = false;
        this.LevelListBtn.active = false;
        this.endEffect.active = false;
        let Title1: string = HttpUnit.GetNowLevelInfo().level_sort;
        let Title2: string = HttpUnit.GetNowLevelInfo().level_name;
        this.Title1.string = "拼图" + this.SwitchToChar(Title1);
        this.Title2.string = Title2;

        let puzzle_cell = HttpUnit.GetNowLevelInfo().puzzle_cell;
        let puzzle_cellString = puzzle_cell.split(",");

        this.HorizontalNum = Number(puzzle_cellString[0]);
        this.VerticalNum = Number(puzzle_cellString[1]);

        this.board.init(this);

        let level_img = HttpUnit.GetNowLevelInfo().level_img;

        // this.showlabel("当前关卡信息:", JSON.stringify(HttpUnit.GetNowLevelInfo()));

        var self = this;
        cc.loader.load({ url: level_img, type: "jpg" }, function (err, texture) {
            if (err) {
                console.log("-------------------filePath err:", err);
            }
            if (texture) {
                var Frame = new cc.SpriteFrame(texture);
                HttpUnit.level_texture = texture;
                if (self.winPanel) {
                    self.winPanel.getComponent(cc.Sprite).spriteFrame = Frame;
                    self.state = STATE.START;
                    self.board.reset(self.HorizontalNum, self.VerticalNum);
                    self.timer.reset();
                    self.timer.run();
                    self.winPanel.active = false;
                    if (callback) {
                        callback();
                    }
                }
            }
        })
    }

    private overGame() {
        this.winPanel.active = true;
        this.winPanel.parent.getComponent(cc.Animation).play("endImage");

        this.PlayAgainBtn.active = true;
        this.NextBtn.active = true;
        this.LevelListBtn.active = true;

        let IsLastLevel = HttpUnit.GetIsLastLevel();
        this.NextBtn.active = !IsLastLevel;
        this.FinishBtn.active = IsLastLevel;

        HttpUnit.updateUserLevel(HttpUnit.activity_id, HttpUnit.GetNowLevelInfo().level_sort);

        this.state = STATE.OVER;
        this.timer.stop();

        this.endEffect.active = true;
        this.endEffect.getComponent(cc.Animation).play("end");
    }

    private TimeOver() {
        this.GameFail.active = true;
    }

    public onBoardTouchStart(x: number, y: number) {
        if (this.state = STATE.START) {
            // let isMove = this.board.movePiece(x, y);
            // if (!isMove) {
            //     // G.gameRoot.showTip("不符合规则");
            // } else {
            //     if (this.board.judgeWin()) {
            //         this.overGame();
            //     }
            // }
        }
    }

    public judgeWin() {
        if (this.board.judgeWin()) {
            MySoundMag.playSound("Win");
            LevelListManager.setPassLevel(HttpUnit.LevelNum);
            this.overGame();
        }
    }

    OnReturn() {
        MySoundMag.playSound("Btn");
        cc.director.loadScene("Home");
    }

    onBtnRestart() {
        MySoundMag.playSound("Btn");
        this.startGame();
    }

    OnLevelListBtn() {
        MySoundMag.playSound("Btn");
        let LevelList = cc.instantiate(this.LevelList);
        this.node.addChild(LevelList);
    }

    OnNextBtn() {
        MySoundMag.playSound("Btn");
        HttpUnit.LevelNum += 1;
        this.startGame();
        cc.game.emit("noLabel");
    }

    OnFinishBtn() {
        MySoundMag.playSound("Btn");
        let GameEnd = cc.instantiate(this.GameEnd);
        this.node.addChild(GameEnd);
    }

    private addListeners() {

    }

    private removeListeners() {

    }

    SwitchToChar(num) {
        let newNum = Number(num);
        let char: string = "一";
        switch (newNum) {
            case 1:
                char = "一";
                break;
            case 2:
                char = "二";
                break;
            case 3:
                char = "三";
                break;
            case 4:
                char = "四";
                break;
            case 5:
                char = "五";
                break;
            case 6:
                char = "六";
                break;
            case 7:
                char = "七";
                break;
            case 8:
                char = "八";
                break;
            case 9:
                char = "九";
                break;
            case 10:
                char = "十";
                break;
            default:
                char = "零";
                break;
        }
        return char;
    }

}
