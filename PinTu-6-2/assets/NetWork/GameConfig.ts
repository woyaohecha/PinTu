const { ccclass, property } = cc._decorator;


@ccclass
export default class GameConfig {

    private static readonly configRemoteUrl = "http://www.cloud.com/GameConfig.json";
    private static readonly configLocalUrl = "GameConfig";
    private static isLocal: boolean = true;


    public static isNormal: boolean = false;
    public static levelData: any[] = [];
    public static token: string = "1655913668332855296";
    public static currentLevelNum: number = 0;
    public static finishedImg: cc.SpriteFrame = null;
    public static homeImg: cc.SpriteFrame = null;
    public static levelImgTexture: cc.Texture2D[] = [];
    public static rule: string = "";


    //加载游戏配置表
    public static loadGameConfig(callback: Function) {
        if (this.levelData.length > 0) {
            if (this.homeImg) {
                callback(this.homeImg);
                return;
            } else {
                let homeImgUrl = "LevelImg/Home";
                this.loadImg(homeImgUrl, callback);
            }
        } else if (this.isLocal) {
            console.log("当前是本地模式:加载游戏配置");
            cc.resources.load(this.configLocalUrl, cc.JsonAsset, (e, asset: cc.JsonAsset) => {
                if (e) {
                    console.log(e);
                    return;
                }
                this.levelData = asset.json.levelData;
                this.rule = asset.json.rule;
                console.log("levelData:", this.levelData);

                let homeImgUrl = "LevelImg/Home";
                this.loadImg(homeImgUrl, callback);
            })
        } else {
            cc.assetManager.loadRemote(this.configRemoteUrl, (e, asset: cc.JsonAsset) => {
                if (e) {
                    if (e) {
                        console.log(e);
                        return;
                    }
                    this.levelData = asset.json.levelData;
                    let homeImgUrl = asset.json.homeImgUrl;
                    this.loadImg(homeImgUrl, callback);
                }
            })
        }
    }

    //加载图片
    public static loadImg(imgUrl: string, callback: Function) {
        console.log("当前是本地模式:加载图片");
        if (this.isLocal) {
            console.log("当前是本地模式:加载图片");
            cc.resources.load(imgUrl, cc.SpriteFrame, (e, asset: cc.SpriteFrame) => {
                if (e) {
                    console.log(e);
                    return;
                }
                console.log("loadImg-asset:",);
                callback(asset);
            })
        } else {
            cc.assetManager.loadRemote(imgUrl, (e, asset: cc.Texture2D) => {
                if (e) {
                    console.log(e);
                    return;
                }
                let sp = new cc.SpriteFrame(asset);
                callback(sp);
            })
        }
    }

    //加载图片
    public static loadLevelImg(LevelNum: number, callback: Function) {
        if (this.levelImgTexture[LevelNum]) {
            callback(this.levelImgTexture[LevelNum]);
            return;
        }
        console.log("当前是本地模式:加载图片");
        if (this.isLocal) {
            console.log("当前是本地模式:加载图片");
            cc.resources.load("LevelImg/" + (LevelNum + 1), cc.Texture2D, (e, asset: cc.Texture2D) => {
                if (e) {
                    console.log(e);
                    return;
                }
                console.log("loadImg-asset:", asset);
                this.levelImgTexture[LevelNum] = asset;
                callback(asset);
            })
        } else {
            let imgUrl = this.levelData[LevelNum].level_img;
            cc.assetManager.loadRemote(imgUrl, (e, asset: cc.Texture2D) => {
                if (e) {
                    console.log(e);
                    return;
                }
                this.levelImgTexture[LevelNum] = asset;
                callback(sp);
            })
        }
    }
}
