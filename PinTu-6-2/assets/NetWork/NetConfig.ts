/*
 * @Author: 林武
 * @Date: 2022-11-04 11:00:53
 * @LastEditors: 林武
 * @LastEditTime: 2023-04-27 09:11:06
 * @FilePath: \PinTu\assets\NetWork\NetConfig.ts
 * @Description: 
 * 
 * Copyright (c) 2022 by 林武/长沙游品, All Rights Reserved. 
 */

/**
 * 网络的相关接口配置
 */
export default class NetConfig {
    // public static readonly RootPath = "https://puzzle-game.sxycykj.net/api/app/clientAPI";
    public static readonly RootPath = "https://pintugame.vr203.cn/api/app/clientAPI/"

    /** 获取用户信息 */
    public static readonly userLogin = "/userLogin";
    /** 获取某个活动及其包含的所有关卡信息 */
    public static readonly getActivityList = "/getActivityList";
    /** 获取某个关卡信息 */
    public static readonly getLevelInfo = "/getLevelInfo";
    /** 修改用户某个活动的关卡进度 */
    public static readonly updateUserLevel = "/updateUserLevel";
    /** 获取主页信息 */
    public static readonly getHomeInfo = "/getHomeInfo";
}