
/**
 * 声音管理
 */
export default class MySoundMag {
    private constructor() { }
    private static soundmag: MySoundMag = new MySoundMag();
    public static get instance() {

        return this.soundmag
    }

    private static maxtime: number = 0;
    private static nowsoundid: number = 0;
    private static nowurl: string = ""
    private static nowboundlename: string = ""
    private static looptimeid: number = 0;

    private static _closeMusic: boolean = false
    private static _closeSound: boolean = false

    public static set closeMusic(closeMusic: boolean) {
        this._closeMusic = closeMusic
        if (closeMusic) {
            this.stopBGM();
        }
    }
    public static get closeMusic() {
        return this._closeMusic
    }

    public static set closeSound(closeSound: boolean) {
        this._closeSound = closeSound
    }
    public static get closeSound() {
        return this._closeSound
    }

    /**
     * 播放bgm
     * @param url 
     * @param iscontinue 
     */
    public static playBGM(url: string, boundlename: string = "Gamebase", isloop: boolean = false): void {
        if (this._closeMusic) return;
        if (this.isstop) return;
        url = "Sound/" + url;
        this.nowurl = url;
        this.nowboundlename = boundlename;
        let bound = cc.assetManager.getBundle(boundlename);
        if (bound) {
            let audio: cc.AudioClip = bound.get(url, cc.AudioClip) as cc.AudioClip
            if (audio == null) {
                console.log("加载音乐", url);
                bound.load(url, cc.AudioClip, ((error: Error, res: cc.AudioClip) => {
                    audio = res
                    if (audio) {
                        this.maxtime = audio.duration * 1000;
                        this.nowsoundid = cc.audioEngine.playMusic(audio, isloop);
                        console.log("音乐id", this.nowsoundid);
                    }
                }))
            } else {
                this.maxtime = audio.duration * 1000;
                this.nowsoundid = cc.audioEngine.playMusic(audio, isloop);
                console.log("音乐id", this.nowsoundid);
            }
        } else {
            cc.assetManager.loadBundle(boundlename, null, (err: Error, bundle: cc.AssetManager.Bundle) => {

            })
        }
    }

    public static get getBgmMaxTime() {
        return this.maxtime;
    }


    public static get getBgmNowPlayTime() {
        return cc.audioEngine.getCurrentTime(this.nowsoundid);
    }

    public static get getBgmState() {
        return cc.audioEngine.getState(this.nowsoundid);
    }

    public static jinyinMusic(value: number) {
        cc.audioEngine.setVolume(this.nowsoundid, value)
    }

    public static puaseMusic() {
        cc.audioEngine.pause(this.nowsoundid);
    }

    public static huifuMusic() {
        cc.audioEngine.resume(this.nowsoundid);
    }

    public static stopBGM(): void {
        console.log("停止音频")
        cc.audioEngine.stop(this.nowsoundid);
    }

    public static audioId: number = -1;
    public static endUrl: string = ""
    public static playIng: any = {};
    public static playSound(url: string, boundlename: string = "Gamebase", success?: Function, loop = false): void {
        if (this._closeSound) return;
        if (this.isstop) return;

        url = "Sound/" + url;
        let bound = cc.assetManager.getBundle(boundlename);
        if (bound) {
            let audio: cc.AudioClip = bound.get(url, cc.AudioClip) as cc.AudioClip;
            let nowAudioId: number = 0;
            if (audio == null) {
                console.log("加载音效", url);
                bound.load(url, cc.AudioClip, ((error: Error, res: cc.AudioClip) => {
                    audio = res;
                    if (audio) {
                        nowAudioId = cc.audioEngine.playEffect(audio, loop);
                        if (this.endUrl == url) {
                            this.stopSound();
                        }
                        this.endUrl = url;
                        this.audioId = nowAudioId;
                        this.playIng[url] = this.audioId;
                    }
                }))
            } else {
                nowAudioId = cc.audioEngine.playEffect(audio, loop);
                if (this.endUrl == url) {
                    this.stopSound();
                }
                this.endUrl = url
                this.audioId = nowAudioId
                this.playIng[url] = this.audioId
                if (success)
                    success(cc.audioEngine.getCurrentTime(nowAudioId))
            }
        } else {
            cc.assetManager.loadBundle(boundlename, null, (err: Error, bundle: cc.AssetManager.Bundle) => {

            })
        }
    }

    public static stopSound(): void {
        if (this.audioId >= 0) {
            cc.audioEngine.stopEffect(this.audioId);
        }
    }

    public static stopNameSound(url: string) {
        if (this.playIng[url]) {
            cc.audioEngine.stopEffect(this.playIng[url]);
            delete this.playIng[url]
        }
    }

    public static stopAll() {
        cc.audioEngine.stopAllEffects();
    }

    public static shifangSound(boundlename: string) {
        let levelName = boundlename

        let bound = cc.assetManager.getBundle(boundlename);
        let res: Array<Record<string, string>> = bound.getDirWithPath(levelName + "/sound")
        //释放当前关卡所有音频
        res.forEach(element => {
            console.log("资源路径", element.path);
            bound.release(element.path)
        });
    }

    public static isstop: boolean = false;
    public static anjinSound() {
        if (this.isstop) {
            this.isstop = false;
            this.huifuMusic();
        } else {
            this.isstop = true;
            this.stopSound();
            this.puaseMusic();
        }
    }

}