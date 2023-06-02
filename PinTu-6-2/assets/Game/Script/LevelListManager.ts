import GameConfig from "../../NetWork/GameConfig";
import HttpUnit from "../../NetWork/HttpUnit";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LevelListManager {
    public static passLevels: number[] = [];

    public static initPassLevels() {
        for (let i = 0; i < GameConfig.levelData.length; i++) {
            this.passLevels[i] = 0;
        }
    }

    public static setPassLevel(levelId: number) {
        LevelListManager.passLevels[levelId] = 1;
    }
}
