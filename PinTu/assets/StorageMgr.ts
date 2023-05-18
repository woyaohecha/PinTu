/*
 * @Author: 林武
 * @Date: 2023-04-22 09:14:13
 * @LastEditors: 林武
 * @LastEditTime: 2023-04-22 10:34:54
 * @FilePath: \PinTu\assets\StorageMgr.ts
 * @Description: 
 * 
 * Copyright (c) 2023 by 林武, All Rights Reserved. 
 */


export class StorageReq {
    public key: string = null;
    public data: any = {};
    public success: () => void = null;
    public fail: () => void = null;
    public complete: () => void = null;
}

/**
 * 数据本地持久化保存
 */
export default class StorageMgr {

    /**
     * 保存
     * @param req 
     */
    public static setStorage(req: StorageReq) {
        let dataStr: string = JSON.stringify(req.data);
        if (window["wx"]) {
            window["wx"].setStorage({
                key: req.key,
                data: dataStr,
                success: req.success,
                fail: req.fail,
                complete: req.complete
            });
        } else {
            cc.sys.localStorage.setItem(req.key, dataStr);
        }

    }

    /**
     * 获取
     * @param key 
     */
    public static getStorage(key, defaultValue): any {
        var value = null;
        if (window["wx"]) {
            try {
                value = window["wx"].getStorageSync(key);
            } catch (e) {
            }
        } else {
            value = cc.sys.localStorage.getItem(key);
        }
        if (!value) {
            return defaultValue;
        }
        return value;
    }

    //金币
    public static setUserGoldNum(UserGoldNum) {
        var req = new StorageReq();
        req.key = "UserGoldNum";
        req.data = UserGoldNum;
        this.setStorage(req);
    }

    public static getUserGoldNum() {
        var UserGoldNum = this.getStorage("UserGoldNum", 520);
        return Number(UserGoldNum);
    }

    //体力
    public static setUserPowerNum(UserPowerNum) {
        var req = new StorageReq();
        req.key = "UserPowerNum";
        req.data = UserPowerNum;
        this.setStorage(req);
    }

    public static getUserPowerNum() {
        var UserGoldNum = this.getStorage("UserPowerNum", 10);
        return Number(UserGoldNum);
    }

    //奶茶
    public static setMilkTeaNum(MilkTeaNum) {
        var req = new StorageReq();
        req.key = "MilkTeaNum";
        req.data = MilkTeaNum;
        this.setStorage(req);
    }

    public static getMilkTeaNum() {
        var MilkTeaNum = this.getStorage("MilkTeaNum", 0);
        return Number(MilkTeaNum);
    }

    //麻辣烫
    public static setMalatangNum(MalatangNum) {
        var req = new StorageReq();
        req.key = "MalatangNum";
        req.data = MalatangNum;
        this.setStorage(req);
    }

    public static getMalatangNum() {
        var MalatangNum = this.getStorage("MalatangNum", 0);
        return Number(MalatangNum);
    }

    //烤肉
    public static setBarbecueNum(BarbecueNum) {
        var req = new StorageReq();
        req.key = "BarbecueNum";
        req.data = BarbecueNum;
        this.setStorage(req);
    }

    public static getBarbecueNum() {
        var BarbecueNum = this.getStorage("BarbecueNum", 0);
        return Number(BarbecueNum);
    }

    //一顿饭
    public static setRiceNum(RiceNum) {
        var req = new StorageReq();
        req.key = "RiceNum";
        req.data = RiceNum;
        this.setStorage(req);
    }

    public static getRiceNum() {
        var RiceNum = this.getStorage("RiceNum", 0);
        return Number(RiceNum);
    }

    //纪梵希小熊宝宝香水
    public static setPerfumeNum(PerfumeNum) {
        var req = new StorageReq();
        req.key = "PerfumeNum";
        req.data = PerfumeNum;
        this.setStorage(req);
    }

    public static getPerfumeNum() {
        var PerfumeNum = this.getStorage("PerfumeNum", 0);
        return Number(PerfumeNum);
    }

    //任意衣服1件
    public static setClothesNum(ClothesNum) {
        var req = new StorageReq();
        req.key = "ClothesNum";
        req.data = ClothesNum;
        this.setStorage(req);
    }

    public static getClothesNum() {
        var ClothesNum = this.getStorage("ClothesNum", 0);
        return Number(ClothesNum);
    }

    //去重庆玩1次
    public static setChongQingNum(ChongQingNum) {
        var req = new StorageReq();
        req.key = "ChongQingNum";
        req.data = ChongQingNum;
        this.setStorage(req);
    }

    public static getChongQingNum() {
        var ChongQingNum = this.getStorage("ChongQingNum", 0);
        return Number(ChongQingNum);
    }

    //去上海玩1次
    public static setShanghaiNum(ShanghaiNum) {
        var req = new StorageReq();
        req.key = "ShanghaiNum";
        req.data = ShanghaiNum;
        this.setStorage(req);
    }

    public static getShanghaiNum() {
        var ShanghaiNum = this.getStorage("ShanghaiNum", 0);
        return Number(ShanghaiNum);
    }

    //任意海边玩一次
    public static setSeaNum(SeaNum) {
        var req = new StorageReq();
        req.key = "SeaNum";
        req.data = SeaNum;
        this.setStorage(req);
    }

    public static getSeaNum() {
        var SeaNum = this.getStorage("SeaNum", 0);
        return Number(SeaNum);
    }

    //散粉
    public static setLoosePowderNum(LoosePowderNum) {
        var req = new StorageReq();
        req.key = "LoosePowderNum";
        req.data = LoosePowderNum;
        this.setStorage(req);
    }

    public static getLoosePowderNum() {
        var LoosePowderNum = this.getStorage("LoosePowderNum", 0);
        return Number(LoosePowderNum);
    }

    public static setMonthDate(MonthDate) {
        var req = new StorageReq();
        req.key = "MonthDate";
        req.data = MonthDate;
        this.setStorage(req);
    }

    public static getMonthDate() {
        var MonthDate = this.getStorage("MonthDate", 0);
        return (MonthDate).replace("\"", "").replace("\"", "");
    }

    public static setIsAddPower(IsAddPower) {
        var req = new StorageReq();
        req.key = "IsAddPower";
        req.data = IsAddPower;
        this.setStorage(req);
    }

    public static getIsAddPower() {
        var IsAddPower = false;
        var AddPower = Number(this.getStorage("IsAddPower", 0));
        if (AddPower == 1) {
            IsAddPower = true;
        }
        return Boolean(IsAddPower);
    }

    //     console.log("------------------------------ Date():", new Date().getMonth());
    // console.log("------------------------------ Date()11:", new Date().getFullYear());
    // console.log("------------------------------ Date()22:", new Date().getDate());
}