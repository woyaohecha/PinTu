/*
 * @Author: 林武
 * @Date: 2023-04-22 09:14:13
 * @LastEditors: 林武
 * @LastEditTime: 2023-05-12 09:42:17
 * @FilePath: \PinTu\assets\Game\Script\PuzzleBoard.ts
 * @Description: 
 * 
 * Copyright (c) 2023 by 林武, All Rights Reserved. 
 */

import { PuzzleScene } from "./Game";
import { STATE } from "./PuzzleConstants";
import { Piece } from "./PuzzlePiece";
import MySoundMag from "../../MySoundMag";

const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass
// @executeInEditMode
export class PuzzleBoard extends cc.Component {

    @property(cc.Prefab)
    private piecePrefab: cc.Prefab = null;
    @property(cc.Integer)
    private colNum: number = 5;
    @property(cc.Integer)
    private colSpace: number = 5;
    @property(cc.Integer)
    private HorizontalNum: number = 3;
    @property(cc.Integer)
    private VerticalNum: number = 3;

    private colWidth: number = 0;
    private colHeigth: number = 0;
    private pieceMap: Array<Array<Piece>>;
    private blankPiece: Piece = null;

    private puzzleScene: PuzzleScene = null;

    onLoad() {
        cc.macro.ENABLE_MULTI_TOUCH = false;
    }

    init(puzzleScene: PuzzleScene) {
        this.puzzleScene = puzzleScene;
        this.addListeners();
    }

    public reset(HorizontalNum?: number, VerticalNum?: number) {
        if (this.Touch_Choose) {
            this.Touch_Choose.destroy();
            this.Touch_Choose = null;
        }

        this.HorizontalNum = HorizontalNum;
        this.VerticalNum = VerticalNum;

        let pieceNodeIndex = 1;

        this.colWidth = (this.node.width - this.colSpace * (this.VerticalNum + 1)) / this.VerticalNum;
        this.colHeigth = (this.node.height - this.colSpace * (this.HorizontalNum + 1)) / this.HorizontalNum;
        this.node.removeAllChildren();
        this.pieceMap = [];
        for (let x = 0; x < this.VerticalNum; x++) {
            this.pieceMap[x] = [];
            for (let y = 0; y < this.HorizontalNum; y++) {
                let List = [x, y];
                let pieceNode = cc.instantiate(this.piecePrefab);
                this.node.addChild(pieceNode);
                pieceNode.zIndex = pieceNodeIndex;
                pieceNodeIndex++;
                pieceNode.x = x * (this.colWidth + this.colSpace) + this.colSpace;
                pieceNode.y = y * (this.colHeigth + this.colSpace) + this.colSpace;
                this.pieceMap[x][y] = pieceNode.getComponent(Piece);
                this.pieceMap[x][y].init(x, y, this.HorizontalNum, this.VerticalNum, this.colWidth, this.colHeigth);
                if (this.pieceMap[x][y].isBlank) {
                    this.blankPiece = this.pieceMap[x][y];
                }
            }
        }
        this.shuffle();
    }

    private IsRightArr = [];
    private shuffle() {
        this.IsRightArr = [];
        let totalNum = this.HorizontalNum * this.VerticalNum;
        let PieceNum = 0;
        if (totalNum < 16) {
            PieceNum = 1;
        } else {
            PieceNum = 2;
        }

        this.IsRightArr = [];
        for (let i = 0; i < 50; i++) {
            let nearPieces = this.getNearPieces(this.blankPiece);
            let n = Math.floor(Math.random() * nearPieces.length);
            this.exchangeTwoPiece(this.blankPiece, nearPieces[n]);
        }

        for (let x = 0; x < this.VerticalNum; x++) {
            for (let y = 0; y < this.HorizontalNum; y++) {
                if (this.pieceMap[x][y].isRight && this.IsRightArr.indexOf(this.pieceMap[x][y]) == -1) {
                    this.IsRightArr.push(this.pieceMap[x][y]);
                }
            }
        }

        if (this.IsRightArr.length != PieceNum) {
            this.shuffle();
        } else {
            this.judgeWin();
        }
    }

    Touch_Piece = null;
    Touch_Choose: cc.Node = null;
    private onBoardTouchStart(event: cc.Event.EventTouch) {
        if (this.puzzleScene.state == STATE.START) {
            let worldPos = event.getLocation();
            let localPos = this.node.convertToNodeSpaceAR(worldPos);
            let x = Math.floor((localPos.x - this.colSpace) / (this.colWidth + this.colSpace));
            let y = Math.floor((localPos.y - this.colSpace) / (this.colHeigth + this.colSpace));
            this.puzzleScene.onBoardTouchStart(x, y);

            this.Touch_Piece = this.pieceMap[x][y];
            let pieceNode = this.Touch_Piece['node'] as cc.Node;

            if (!this.Touch_Piece.isRight) {
                MySoundMag.playSound("PickUp");

                let endPos = this.node.parent.convertToNodeSpaceAR(pieceNode.convertToWorldSpaceAR(cc.v2(0, 0)));

                this.Touch_Choose = cc.instantiate(pieceNode);
                this.Touch_Choose.anchorX = 0.5;
                this.Touch_Choose.anchorY = 0.5;
                pieceNode.active = false;
                this.node.parent.addChild(this.Touch_Choose);

                this.Touch_Choose.width = pieceNode.width;
                this.Touch_Choose.height = pieceNode.height;

                let pieceNodewidth = Number(pieceNode.width);
                let pieceNodeheight = Number(pieceNode.height);
                this.Touch_Choose.x = Math.floor(endPos.x) + Math.floor(pieceNodewidth / 2);
                this.Touch_Choose.y = Math.floor(endPos.y) + Math.floor(pieceNodeheight / 2);
                this.Touch_Choose.active = true;
            }
        }
    }

    private onBoardTouchMove(event: cc.Event.EventTouch) {
        let endPos = this.node.parent.convertToNodeSpaceAR(cc.v2(event.getLocationX(), event.getLocationY()));
        if (this.Touch_Choose) {
            this.Touch_Choose.x = endPos.x;
            this.Touch_Choose.y = endPos.y;
            return;
        }
    }

    private onBoardTouchEnd(event: cc.Event.EventTouch) {
        if (this.Touch_Choose) {
            let CheckInRect = null;
            CheckInRect = this.CheckInRect();
            this.Touch_Piece['node'].active = true;
            if (CheckInRect) {
                let worldPos = event.getLocation();
                let localPos = this.node.convertToNodeSpaceAR(worldPos);
                let x = Math.floor((localPos.x - this.colSpace) / (this.colWidth + this.colSpace));
                let y = Math.floor((localPos.y - this.colSpace) / (this.colHeigth + this.colSpace));
                let piece = this.pieceMap[x][y];
                if (!piece.isRight) {
                    MySoundMag.playSound("Exchange");
                    this.exchangeTwoPiece(this.Touch_Piece, piece);
                }
            }
            this.Touch_Choose.destroy();
            this.Touch_Choose = null;

            this.puzzleScene.judgeWin();
        }
    }

    /** 判断下这个点是否在这个矩形里*/
    protected CheckInRect() {
        let CheckInRect = null;
        for (var i = 0; i < this.node.childrenCount; i++) {
            let pieceNode = this.node.children[i] as cc.Node;
            let endPos = this.node.parent.convertToNodeSpaceAR(pieceNode.convertToWorldSpaceAR(cc.v2(0, 0)));
            let LeftPos = endPos.x;
            let RightPos = endPos.x + pieceNode.width;
            let TopPos = endPos.y + pieceNode.height;
            let BootomPos = endPos.y;
            if (this.Touch_Choose.x >= LeftPos && this.Touch_Choose.x <= RightPos && this.Touch_Choose.y <= TopPos && this.Touch_Choose.y >= BootomPos && pieceNode.active) {
                CheckInRect = pieceNode;
            }
        }
        return CheckInRect;
    }

    public movePiece(x, y): boolean {
        let piece = this.pieceMap[x][y];
        let nearPieces = this.getNearPieces(piece);

        for (let nearPiece of nearPieces) {
            if (nearPiece.isBlank) {
                this.exchangeTwoPiece(piece, nearPiece);
                return true;
            }
        }
        return false;
    }

    public judgeWin(): boolean {
        for (let x = 0; x < this.VerticalNum; x++) {
            for (let y = 0; y < this.HorizontalNum; y++) {
                if (!this.pieceMap[x][y].isRight) {
                }
            }
        }

        for (let x = 0; x < this.VerticalNum; x++) {
            for (let y = 0; y < this.HorizontalNum; y++) {
                if (!this.pieceMap[x][y].isRight) {
                    return false;
                }
            }
        }
        // this.blankPiece.node.active = true;
        console.error("----------------------------- 游戏胜利")
        return true;
    }

    private getNearPieces(piece: Piece): Array<Piece> {
        let nearPieces = [];
        if (piece.curCol > 0) { // left
            nearPieces.push(this.pieceMap[piece.curCol - 1][piece.curRow]);
        }
        if (piece.curCol < this.VerticalNum - 1) { // right
            nearPieces.push(this.pieceMap[piece.curCol + 1][piece.curRow]);
        }
        if (piece.curRow > 0) { // bottom
            nearPieces.push(this.pieceMap[piece.curCol][piece.curRow - 1]);
        }
        if (piece.curRow < this.HorizontalNum - 1) { // top
            nearPieces.push(this.pieceMap[piece.curCol][piece.curRow + 1]);
        }
        return nearPieces;
    }

    public exchangeTwoPiece(piece1: Piece, piece2: Piece) {
        if (this.pieceMap[piece2.curCol][piece2.curRow].IsShuffle || this.pieceMap[piece1.curCol][piece1.curRow].IsShuffle) {
            return;
        }
        this.pieceMap[piece2.curCol][piece2.curRow] = piece1;
        this.pieceMap[piece1.curCol][piece1.curRow] = piece2;

        [piece1.curCol, piece2.curCol] = [piece2.curCol, piece1.curCol];
        [piece1.curRow, piece2.curRow] = [piece2.curRow, piece1.curRow];

        [piece1.node.position, piece2.node.position] = [piece2.node.position, piece1.node.position];
    }

    private addListeners() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onBoardTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onBoardTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onBoardTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onBoardTouchEnd, this);
    }

    private removeListeners() {

    }

}