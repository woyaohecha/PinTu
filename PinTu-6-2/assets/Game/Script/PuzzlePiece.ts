import GameConfig from "../../NetWork/GameConfig";
import HttpUnit from "../../NetWork/HttpUnit";

/*
 * @Author: 林武
 * @Date: 2023-04-22 09:14:13
 * @LastEditors: 林武
 * @LastEditTime: 2023-05-12 09:13:11
 * @FilePath: \PinTu\assets\Game\Script\PuzzlePiece.ts
 * @Description: 
 * 
 * Copyright (c) 2023 by 林武, All Rights Reserved. 
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class Piece extends cc.Component {

    @property(cc.Node)
    private finished: cc.Node = null;

    @property({
        type: cc.Texture2D
    })
    private texture: cc.Texture2D = null;

    public oriCol: number;
    public oriRow: number;
    public curCol: number;
    public curRow: number;
    public isBlank: boolean;
    public isMove: boolean;
    public get isRight() {
        let isRight = this.curCol === this.oriCol && this.curRow === this.oriRow;
        this.finished.active = isRight;
        return isRight;
    }

    public IsShuffle: boolean = false;

    public set Shuffle(Shuffle) {
        this.IsShuffle = Shuffle;
    }

    public get Shuffle() {
        return this.IsShuffle;
    }

    public set Move(Move) {
        this.isMove = Move;
    }

    public get Move() {
        return this.isMove;
    }

    onLoad() {
        // this.texture = HttpUnit.level_texture;
        this.texture = GameConfig.levelImgTexture[GameConfig.currentLevelNum];
    }

    public init(col: number, row: number, HorizontalNum: number, VerticalNum: number, colWidth: number, colHeight: number) {
        this.oriCol = col;
        this.oriRow = row;
        this.curCol = col;
        this.curRow = row;

        let sprite = this.node.addComponent(cc.Sprite);
        // 升级2.0后setRect失效
        // sprite.spriteFrame = new cc.SpriteFrame(this.texture);
        // let rect = sprite.spriteFrame.getRect();
        let rect = cc.rect(0, 0, this.texture.width, this.texture.height);
        let newRectWidth = rect.width / VerticalNum;
        let newRectHeight = rect.height / HorizontalNum;
        let newRectX = col * newRectWidth;
        let newRectY = (HorizontalNum - row - 1) * newRectHeight;
        let newRect = cc.rect(newRectX, newRectY, newRectWidth, newRectHeight);
        // sprite.spriteFrame.setRect(newRect);
        sprite.spriteFrame = new cc.SpriteFrame(this.texture, newRect);

        this.node.width = colWidth;
        this.node.height = colHeight;

        this.isBlank = this.oriCol === 0 && this.oriRow === 0;
        if (this.isBlank) {
            // this.node.active = false;
        }
    }

}