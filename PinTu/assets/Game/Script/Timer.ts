import HttpUnit from "../../NetWork/HttpUnit";

/*
 * @Author: 林武
 * @Date: 2023-04-22 09:14:13
 * @LastEditors: 林武
 * @LastEditTime: 2023-04-27 09:50:14
 * @FilePath: \PinTu\assets\Game\Script\Timer.ts
 * @Description: 
 * 
 * Copyright (c) 2023 by 林武, All Rights Reserved. 
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class Timer extends cc.Component {

    @property(cc.Label)
    private timerLabel: cc.Label = null;

    public time: number = null;

    public run() {
        this.time = HttpUnit.GetNowLevelInfo().level_time;
        this.schedule(this.tick, 1);
    }

    private tick() {
        this.time -= 1;
        if (this.time < 0) {
            this.unschedule(this.tick);
            cc.game.emit("时间用完");
            return;
        }
        this.timerLabel.string = this.formatTime(this.time);
    }

    public stop() {
        this.unschedule(this.tick);
    }

    public reset() {
        this.time = HttpUnit.GetNowLevelInfo().level_time;
        this.timerLabel.string = this.formatTime(this.time);
    }

    private formatTime(seconds: number): string {
        const minutes: number = Math.floor(seconds / 60);
        const remainingSeconds: number = seconds % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }
}