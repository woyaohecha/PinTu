const { ccclass, property } = cc._decorator;


@ccclass
export default class GameConfig {

    private static readonly configRemoteUrl = "https://cloudcreategame.oss-cn-beijing.aliyuncs.com/pro/games/test/pintu-res/GameConfig.json";
    private static readonly configLocalUrl = "GameConfig";
    private static isLocal: boolean = false;


    public static isNormal: boolean = true;
    public static levelData: any[] = [];
    public static token: string = "1655913668332855296";
    public static currentLevelNum: number = 0;
    public static finishedImgUrl: string = null;
    public static finishedImg: cc.SpriteFrame = null;
    public static homeImgUrl: string = null;
    public static homeImg: cc.SpriteFrame = null;
    public static levelImgTexture: cc.Texture2D[] = [];
    public static rule: string = "";


    //加载游戏配置表
    public static loadGameConfig(callback: Function) {
        console.log("游戏模式:", this.isNormal ? "普通" : "考试");
        console.log("资源加载:", this.isLocal ? "本地" : "远程");
        if (this.levelData.length > 0) {
            if (this.homeImg) {
                callback(this.homeImg);
                return;
            } else {
                this.loadImg(this.homeImgUrl, callback);
            }
        } else if (this.isLocal) {
            console.log("---------------------------加载游戏配置表:", this.configLocalUrl);
            cc.resources.load(this.configLocalUrl, cc.JsonAsset, (e, asset: cc.JsonAsset) => {
                if (e) {
                    console.log(e);
                    return;
                }
                let config = this.isNormal ? asset.json.normal : asset.json.exam;
                console.log("---------------------------配置表:", config);
                this.levelData = config.levelData;
                this.rule = config.rule;
                this.homeImgUrl = "LevelImg/Home";
                this.finishedImgUrl = "LevelImg/Finished"
                this.loadImg(this.homeImgUrl, callback);
            })
        } else {
            console.log("---------------------------加载游戏配置表:", this.configRemoteUrl);
            cc.assetManager.loadRemote(this.configRemoteUrl, (e, asset: cc.JsonAsset) => {
                if (e) {
                    console.log(e);
                    return;
                }
                let config = this.isNormal ? asset.json.normal : asset.json.exam;
                console.log("---------------------------配置表:", config);
                this.levelData = config.levelData;
                this.rule = config.rule;
                this.homeImgUrl = config.homeImgUrl;
                this.finishedImgUrl = config.finishedImgUrl;
                this.loadImg(this.homeImgUrl, callback);
            })
        }
    }

    //加载图片
    public static loadImg(imgUrl: string, callback: Function) {
        console.log("加载图片:", imgUrl);
        if (this.isLocal) {
            cc.resources.load(imgUrl, cc.SpriteFrame, (e, asset: cc.SpriteFrame) => {
                if (e) {
                    console.log(e);
                    return;
                }
                console.log("图片:", asset);
                callback(asset);
            })
        } else {
            cc.assetManager.loadRemote(imgUrl, (e, asset: cc.Texture2D) => {
                if (e) {
                    console.log(e);
                    return;
                }
                console.log("图片:", asset);
                let sp = new cc.SpriteFrame(asset);
                callback(sp);
            })
        }
    }

    //加载关卡图片
    public static loadLevelImg(LevelNum: number, callback: Function) {
        if (this.levelImgTexture[LevelNum]) {
            callback(this.levelImgTexture[LevelNum]);
            return;
        }
        if (this.isLocal) {
            let imgUrl = "LevelImg/" + (LevelNum + 1);
            console.log("加载关卡图片:", imgUrl);
            cc.resources.load(imgUrl, cc.Texture2D, (e, asset: cc.Texture2D) => {
                if (e) {
                    console.log(e);
                    return;
                }
                console.log("关卡图片:", asset);
                this.levelImgTexture[LevelNum] = asset;
                callback(asset);
            })
        } else {
            let imgUrl = this.levelData[LevelNum].level_img;
            console.log("加载关卡图片:", imgUrl);
            cc.assetManager.loadRemote(imgUrl, (e, asset: cc.Texture2D) => {
                if (e) {
                    console.log(e);
                    return;
                }
                console.log("关卡图片:", asset);
                this.levelImgTexture[LevelNum] = asset;
                callback(asset);
            })
        }
    }
}
