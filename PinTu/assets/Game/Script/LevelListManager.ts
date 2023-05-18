import HttpUnit from "../../NetWork/HttpUnit";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LevelListManager {
    public static passLevels: number[] = [];

    public static initPassLevels() {
        for (let i = 0; i < HttpUnit.LevelInfo.length; i++) {
            this.passLevels[i] = 0;
            if(!HttpUnit.IsNormal && HttpUnit.LevelNum > i){
                this.passLevels[i] = 1;
            }
        }
    }

    public static setPassLevel(levelId: number) {
        LevelListManager.passLevels[levelId] = 1;
    }
}
