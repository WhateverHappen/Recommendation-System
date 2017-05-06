/**
 * Created by 嘲讽脸 on 2017/3/18.
 */

import {
    UserCollection, ArtistCollection,
    ExperimentalDataCollection, TagsCollection, TestDataCollection
} from "../../../both/collections/demo.collection";
import {templateVisitAll} from "@angular/compiler";

export class Test {
    ///用于测试的10个user_tagMatrix
    public user_tagMatrixForTest0 = [];
    public user_tagMatrixForTest1 = [];
    public user_tagMatrixForTest2 = [];
    public user_tagMatrixForTest3 = [];
    public user_tagMatrixForTest4 = [];
    public user_tagMatrixForTest5 = [];
    public user_tagMatrixForTest6 = [];
    public user_tagMatrixForTest7 = [];
    public user_tagMatrixForTest8 = [];
    public user_tagMatrixForTest9 = [];

    ///用于测试的10个tag_artistMatrix
    public tag_artistMatrixForTest0 = [];
    public tag_artistMatrixForTest1 = [];
    public tag_artistMatrixForTest2 = [];
    public tag_artistMatrixForTest3 = [];
    public tag_artistMatrixForTest4 = [];
    public tag_artistMatrixForTest5 = [];
    public tag_artistMatrixForTest6 = [];
    public tag_artistMatrixForTest7 = [];
    public tag_artistMatrixForTest8 = [];
    public tag_artistMatrixForTest9 = [];

    ///用于训练的10个user_tagMatrix
    public user_tagMatrixForTraining0 = [];
    public user_tagMatrixForTraining1 = [];
    public user_tagMatrixForTraining2 = [];
    public user_tagMatrixForTraining3 = [];
    public user_tagMatrixForTraining4 = [];
    public user_tagMatrixForTraining5 = [];
    public user_tagMatrixForTraining6 = [];
    public user_tagMatrixForTraining7 = [];
    public user_tagMatrixForTraining8 = [];
    public user_tagMatrixForTraining9 = [];

    ///用于训练的10个tag_artistMatrix
    public tag_artistMatrixForTraining0 = [];
    public tag_artistMatrixForTraining1 = [];
    public tag_artistMatrixForTraining2 = [];
    public tag_artistMatrixForTraining3 = [];
    public tag_artistMatrixForTraining4 = [];
    public tag_artistMatrixForTraining5 = [];
    public tag_artistMatrixForTraining6 = [];
    public tag_artistMatrixForTraining7 = [];
    public tag_artistMatrixForTraining8 = [];
    public tag_artistMatrixForTraining9 = [];

    ///用所有数据构建的User_TagMatrix和Tag_ArtistMatrix
    public allDataUser_TagMatrix = [];
    public allDataTag_ArtistMatrix = [];

    ///10个用于训练的分组数据数组
    private dataListForTraining0 = [];
    private dataListForTraining1 = [];
    private dataListForTraining2 = [];
    private dataListForTraining3 = [];
    private dataListForTraining4 = [];
    private dataListForTraining5 = [];
    private dataListForTraining6 = [];
    private dataListForTraining7 = [];
    private dataListForTraining8 = [];
    private dataListForTraining9 = [];

    ///10个用于测试的分组数据数组
    private dataListForTest0 = [];
    private dataListForTest1 = [];
    private dataListForTest2 = [];
    private dataListForTest3 = [];
    private dataListForTest4 = [];
    private dataListForTest5 = [];
    private dataListForTest6 = [];
    private dataListForTest7 = [];
    private dataListForTest8 = [];
    private dataListForTest9 = [];

    public userList = [];                  ///存放所有userID
    public tagList = [];                   ///存放所有tagID
    public artistList = [];                ///存放所有artistID
    public allDataList = [];               ///存放所有数据
    private tempAllDataList = [];

    private numOfOneData = 0;                           ///一个分组的数据量
    private dataNum = 30;                              ///要提取的数据量

    public densityOfUser_TagMatrix;                         ///用户-标签矩阵稀疏度
    public densityOfTag_ArtistMatrix;                       ///标签-资源矩阵稀疏度
    private zeroOfUser_TagMatrix = 0;                       ///User_TagMatrix中“0”项的个数
    private zeroOfTag_ArtistMatrix = 0;                     ///Tag_ArtistMatrix中“0”项的个数

    public testUser_tagMatrixForTest0 = [];
    public testUser_tagMatrixForTest1 = [];
    public testUser_tagMatrixForTest2 = [];
    public testUser_tagMatrixForTest3 = [];
    public testUser_tagMatrixForTest4 = [];
    public testUser_tagMatrixForTest5 = [];
    public testUser_tagMatrixForTest6 = [];
    public testUser_tagMatrixForTest7 = [];
    public testUser_tagMatrixForTest8 = [];
    public testUser_tagMatrixForTest9 = [];
    public testTag_ArtistMatrixForTest0 = [];
    public testTag_ArtistMatrixForTest1 = [];
    public testTag_ArtistMatrixForTest2 = [];
    public testTag_ArtistMatrixForTest3 = [];
    public testTag_ArtistMatrixForTest4 = [];
    public testTag_ArtistMatrixForTest5 = [];
    public testTag_ArtistMatrixForTest6 = [];
    public testTag_ArtistMatrixForTest7 = [];
    public testTag_ArtistMatrixForTest8 = [];
    public testTag_ArtistMatrixForTest9 = [];
    public testUser_tagMatrixForTraining0 = [];
    public testUser_tagMatrixForTraining1 = [];
    public testUser_tagMatrixForTraining2 = [];
    public testUser_tagMatrixForTraining3 = [];
    public testUser_tagMatrixForTraining4 = [];
    public testUser_tagMatrixForTraining5 = [];
    public testUser_tagMatrixForTraining6 = [];
    public testUser_tagMatrixForTraining7 = [];
    public testUser_tagMatrixForTraining8 = [];
    public testUser_tagMatrixForTraining9 = [];
    public testTag_ArtistMatrixForTraining0 = [];
    public testTag_ArtistMatrixForTraining1 = [];
    public testTag_ArtistMatrixForTraining2 = [];
    public testTag_ArtistMatrixForTraining3 = [];
    public testTag_ArtistMatrixForTraining4 = [];
    public testTag_ArtistMatrixForTraining5 = [];
    public testTag_ArtistMatrixForTraining6 = [];
    public testTag_ArtistMatrixForTraining7 = [];
    public testTag_ArtistMatrixForTraining8 = [];
    public testTag_ArtistMatrixForTraining9 = [];

    constructor() {
        this.initData();
        this.initAllMatrix();
        this.setAllMatrix();
        // this.calculateDensity();
        // this.initTestMatrix();
    }

    private initTestMatrix() {
        this.testUser_tagMatrixForTest0 = [[35, 0, 31, 0, 21], [22, 21, 0, 45, 0], [21, 32, 21, 0, 64]];
        this.testUser_tagMatrixForTest1 = [[2, 3, 4], [3, 4, 5], [4, 5, 6]];
        this.testUser_tagMatrixForTest2 = [[3, 4, 5], [4, 5, 6], [5, 6, 7]];
        this.testUser_tagMatrixForTest3 = [[4, 5, 6], [5, 6, 7], [6, 7, 8]];
        this.testUser_tagMatrixForTest4 = [[5, 6, 7], [6, 7, 8], [7, 8, 9]];
        this.testUser_tagMatrixForTest5 = [[6, 7, 8], [7, 8, 9], [8, 9, 1]];
        this.testUser_tagMatrixForTest6 = [[7, 8, 9], [8, 9, 1], [9, 1, 2]];
        this.testUser_tagMatrixForTest7 = [[8, 9, 1], [9, 1, 2], [1, 2, 3]];
        this.testUser_tagMatrixForTest8 = [[9, 1, 2], [1, 2, 3], [2, 3, 4]];
        this.testUser_tagMatrixForTest9 = [[1, 2, 3], [2, 3, 4], [3, 4, 5]];
        this.testTag_ArtistMatrixForTest0 = [[34, 0, 0, 31, 0, 21], [0, 22, 34, 0, 24, 42], [26, 46, 24, 0, 32, 21], [0, 46, 0, 0, 21, 31], [42, 0, 21, 52, 0, 21]];
        this.testTag_ArtistMatrixForTest1 = [[2, 3, 4], [3, 4, 5], [4, 5, 6]];
        this.testTag_ArtistMatrixForTest2 = [[3, 4, 5], [4, 5, 6], [5, 6, 7]];
        this.testTag_ArtistMatrixForTest3 = [[4, 5, 6], [5, 6, 7], [6, 7, 8]];
        this.testTag_ArtistMatrixForTest4 = [[5, 6, 7], [6, 7, 8], [7, 8, 9]];
        this.testTag_ArtistMatrixForTest5 = [[6, 7, 8], [7, 8, 9], [8, 9, 10]];
        this.testTag_ArtistMatrixForTest6 = [[7, 8, 9], [8, 9, 10], [9, 10, 11]];
        this.testTag_ArtistMatrixForTest7 = [[8, 9, 10], [9, 10, 11], [10, 11, 12]];
        this.testTag_ArtistMatrixForTest8 = [[9, 10, 11], [10, 11, 12], [11, 12, 13]];
        this.testTag_ArtistMatrixForTest9 = [[10, 11, 12], [11, 12, 13], [12, 12, 14]];

        this.testUser_tagMatrixForTraining0 = [[57, 0, 34, 43, 24], [29, 33, 0, 42, 22], [28, 51, 0, 24, 64]];
        this.testUser_tagMatrixForTraining1 = [[8, 7, 6], [7, 6, 5], [6, 5, 4]];
        this.testUser_tagMatrixForTraining2 = [[7, 6, 5], [6, 5, 4], [5, 4, 3]];
        this.testUser_tagMatrixForTraining3 = [[6, 5, 4], [5, 4, 3], [4, 3, 2]];
        this.testUser_tagMatrixForTraining4 = [[5, 4, 3], [4, 3, 2], [3, 2, 1]];
        this.testUser_tagMatrixForTraining5 = [[4, 3, 2], [3, 2, 1], [2, 1, 9]];
        this.testUser_tagMatrixForTraining6 = [[3, 2, 1], [2, 1, 9], [1, 9, 8]];
        this.testUser_tagMatrixForTraining7 = [[2, 1, 9], [1, 9, 8], [9, 8, 7]];
        this.testUser_tagMatrixForTraining8 = [[1, 9, 8], [9, 8, 7], [8, 7, 6]];
        this.testUser_tagMatrixForTraining9 = [[9, 8, 7], [8, 7, 6], [7, 6, 5]];
        this.testTag_ArtistMatrixForTraining0 = [[34, 55, 41, 0, 37, 25], [32, 46, 26, 57, 0, 25], [27, 63, 26, 0, 71, 24], [36, 25, 0, 55, 26, 43], [34, 23, 0, 51, 27, 46]];
        this.testTag_ArtistMatrixForTraining1 = [[13, 12, 11], [12, 11, 10], [11, 10, 9]];
        this.testTag_ArtistMatrixForTraining2 = [[12, 11, 10], [11, 10, 9], [10, 9, 8]];
        this.testTag_ArtistMatrixForTraining3 = [[11, 10, 9], [10, 9, 8], [9, 8, 7]];
        this.testTag_ArtistMatrixForTraining4 = [[10, 9, 8], [9, 8, 7], [8, 7, 6]];
        this.testTag_ArtistMatrixForTraining5 = [[9, 8, 7], [8, 7, 6], [7, 6, 5]];
        this.testTag_ArtistMatrixForTraining6 = [[8, 7, 6], [7, 6, 5], [6, 5, 4]];
        this.testTag_ArtistMatrixForTraining7 = [[7, 6, 5], [6, 5, 4], [5, 4, 3]];
        this.testTag_ArtistMatrixForTraining8 = [[6, 5, 4], [5, 4, 3], [4, 3, 2]];
        this.testTag_ArtistMatrixForTraining9 = [[5, 4, 3], [4, 3, 2], [3, 2, 1]];
    }

    ///初始化所有矩阵
    private initAllMatrix() {
        ///测试
        this.initMatrix(this.user_tagMatrixForTest0, this.tag_artistMatrixForTest0);
        this.initMatrix(this.user_tagMatrixForTest1, this.tag_artistMatrixForTest1);
        this.initMatrix(this.user_tagMatrixForTest2, this.tag_artistMatrixForTest2);
        this.initMatrix(this.user_tagMatrixForTest3, this.tag_artistMatrixForTest3);
        this.initMatrix(this.user_tagMatrixForTest4, this.tag_artistMatrixForTest4);
        this.initMatrix(this.user_tagMatrixForTest5, this.tag_artistMatrixForTest5);
        this.initMatrix(this.user_tagMatrixForTest6, this.tag_artistMatrixForTest6);
        this.initMatrix(this.user_tagMatrixForTest7, this.tag_artistMatrixForTest7);
        this.initMatrix(this.user_tagMatrixForTest8, this.tag_artistMatrixForTest8);
        this.initMatrix(this.user_tagMatrixForTest9, this.tag_artistMatrixForTest9);
        ///训练
        this.initMatrix(this.user_tagMatrixForTraining0, this.tag_artistMatrixForTraining0);
        this.initMatrix(this.user_tagMatrixForTraining1, this.tag_artistMatrixForTraining1);
        this.initMatrix(this.user_tagMatrixForTraining2, this.tag_artistMatrixForTraining2);
        this.initMatrix(this.user_tagMatrixForTraining3, this.tag_artistMatrixForTraining3);
        this.initMatrix(this.user_tagMatrixForTraining4, this.tag_artistMatrixForTraining4);
        this.initMatrix(this.user_tagMatrixForTraining5, this.tag_artistMatrixForTraining5);
        this.initMatrix(this.user_tagMatrixForTraining6, this.tag_artistMatrixForTraining6);
        this.initMatrix(this.user_tagMatrixForTraining7, this.tag_artistMatrixForTraining7);
        this.initMatrix(this.user_tagMatrixForTraining8, this.tag_artistMatrixForTraining8);
        this.initMatrix(this.user_tagMatrixForTraining9, this.tag_artistMatrixForTraining9);

        this.initMatrix(this.allDataUser_TagMatrix, this.allDataTag_ArtistMatrix);
    }

    ///用于初始化user_tagMatrix和tag_artistMatrix
    private initMatrix(user_tagMatrix, tag_artistMatrix) {
        ///建立user_tagMatrix
        let tempTagArray = [];
        for (let i = 1; i <= this.tagList.length; i++) {        ///将所有tagID存入一个数组中
            tempTagArray[i] = this.tagList[i - 1];
        }
        user_tagMatrix[0] = tempTagArray;               ///将tag存入矩阵的第一行
        for (let j = 1; j <= this.userList.length; j++) {                ///存入userID
            let array = new Array(this.tagList.length);
            array[0] = this.userList[j - 1];
            for (let i = 1; i <= this.tagList.length; i++) {              ///将该行除userID外所有项初始化为0
                array[i] = 0;
            }
            user_tagMatrix[j] = array;
        }
        ///建立tag_artistMatrix
        let tempArtistArray = [];
        for (let i = 1; i <= this.artistList.length; i++) {     ///将所有artistID存入一个数组中
            tempArtistArray[i] = this.artistList[i - 1];
        }
        tag_artistMatrix[0] = tempArtistArray;              ///将artist存入矩阵的第一行
        for (let j = 1; j <= this.tagList.length; j++) {                ///存入TagID
            let array = new Array(this.artistList.length);
            array[0] = this.tagList[j - 1];
            for (let i = 1; i <= this.artistList.length; i++) {         ///将该行除tagID外所有项初始化为0
                array[i] = 0;
            }
            tag_artistMatrix[j] = array;
        }
    }

    ///根据所取数据计算20个user_tagMatrix和20个tag_artistMatrix中每项的值
    private setAllMatrix() {
        ///测试矩阵
        this.setMatrix(this.dataListForTest0, this.user_tagMatrixForTest0, this.tag_artistMatrixForTest0);
        this.setMatrix(this.dataListForTest1, this.user_tagMatrixForTest1, this.tag_artistMatrixForTest1);
        this.setMatrix(this.dataListForTest2, this.user_tagMatrixForTest2, this.tag_artistMatrixForTest2);
        this.setMatrix(this.dataListForTest3, this.user_tagMatrixForTest3, this.tag_artistMatrixForTest3);
        this.setMatrix(this.dataListForTest4, this.user_tagMatrixForTest4, this.tag_artistMatrixForTest4);
        this.setMatrix(this.dataListForTest5, this.user_tagMatrixForTest5, this.tag_artistMatrixForTest5);
        this.setMatrix(this.dataListForTest6, this.user_tagMatrixForTest6, this.tag_artistMatrixForTest6);
        this.setMatrix(this.dataListForTest7, this.user_tagMatrixForTest7, this.tag_artistMatrixForTest7);
        this.setMatrix(this.dataListForTest8, this.user_tagMatrixForTest8, this.tag_artistMatrixForTest8);
        this.setMatrix(this.dataListForTest9, this.user_tagMatrixForTest9, this.tag_artistMatrixForTest9);
        ///训练矩阵
        this.setMatrix(this.dataListForTraining0, this.user_tagMatrixForTraining0, this.tag_artistMatrixForTraining0);
        this.setMatrix(this.dataListForTraining1, this.user_tagMatrixForTraining1, this.tag_artistMatrixForTraining1);
        this.setMatrix(this.dataListForTraining2, this.user_tagMatrixForTraining2, this.tag_artistMatrixForTraining2);
        this.setMatrix(this.dataListForTraining3, this.user_tagMatrixForTraining3, this.tag_artistMatrixForTraining3);
        this.setMatrix(this.dataListForTraining4, this.user_tagMatrixForTraining4, this.tag_artistMatrixForTraining4);
        this.setMatrix(this.dataListForTraining5, this.user_tagMatrixForTraining5, this.tag_artistMatrixForTraining5);
        this.setMatrix(this.dataListForTraining6, this.user_tagMatrixForTraining6, this.tag_artistMatrixForTraining6);
        this.setMatrix(this.dataListForTraining7, this.user_tagMatrixForTraining7, this.tag_artistMatrixForTraining7);
        this.setMatrix(this.dataListForTraining8, this.user_tagMatrixForTraining8, this.tag_artistMatrixForTraining8);
        this.setMatrix(this.dataListForTraining9, this.user_tagMatrixForTraining9, this.tag_artistMatrixForTraining9);
        ///包含全部数据的矩阵
        this.setMatrix(this.allDataList, this.allDataUser_TagMatrix, this.allDataTag_ArtistMatrix);

        // this.setTestMatrix(this.allDataUser_TagMatrix,this.allDataTag_ArtistMatrix);
        //
        // this.setTestMatrix(this.user_tagMatrixForTest0, this.tag_artistMatrixForTest0);
        // this.setTestMatrix(this.user_tagMatrixForTest1, this.tag_artistMatrixForTest1);
        // this.setTestMatrix(this.user_tagMatrixForTest2, this.tag_artistMatrixForTest2);
        // this.setTestMatrix(this.user_tagMatrixForTest3, this.tag_artistMatrixForTest3);
        // this.setTestMatrix(this.user_tagMatrixForTest4, this.tag_artistMatrixForTest4);
        // this.setTestMatrix(this.user_tagMatrixForTest5, this.tag_artistMatrixForTest5);
        // this.setTestMatrix(this.user_tagMatrixForTest6, this.tag_artistMatrixForTest6);
        // this.setTestMatrix(this.user_tagMatrixForTest7, this.tag_artistMatrixForTest7);
        // this.setTestMatrix(this.user_tagMatrixForTest8, this.tag_artistMatrixForTest8);
        // this.setTestMatrix(this.user_tagMatrixForTest9, this.tag_artistMatrixForTest9);
        //
        // this.setTestMatrix(this.user_tagMatrixForTraining0,this.tag_artistMatrixForTraining0);
        // this.setTestMatrix(this.user_tagMatrixForTraining1,this.tag_artistMatrixForTraining1);
        // this.setTestMatrix(this.user_tagMatrixForTraining2,this.tag_artistMatrixForTraining2);
        // this.setTestMatrix(this.user_tagMatrixForTraining3,this.tag_artistMatrixForTraining3);
        // this.setTestMatrix(this.user_tagMatrixForTraining4,this.tag_artistMatrixForTraining4);
        // this.setTestMatrix(this.user_tagMatrixForTraining5,this.tag_artistMatrixForTraining5);
        // this.setTestMatrix(this.user_tagMatrixForTraining6,this.tag_artistMatrixForTraining6);
        // this.setTestMatrix(this.user_tagMatrixForTraining7,this.tag_artistMatrixForTraining7);
        // this.setTestMatrix(this.user_tagMatrixForTraining8,this.tag_artistMatrixForTraining8);
        // this.setTestMatrix(this.user_tagMatrixForTraining9,this.tag_artistMatrixForTraining9);
    }

    ///测试用矩阵,通过随机数建立内容随机的矩阵
    private setTestMatrix(allDataUser_TagMatrix, allDataTag_ArtistMatrix) {
        ///User_TagMatrix
        for (let i = 1; i <= this.userList.length; i++) {
            for (let j = 1; j <= this.tagList.length; j++) {
                allDataUser_TagMatrix[i][j] = Math.floor(Math.random() * 10);
            }
        }
        ///Tag_ArtistMatrix
        for (let i = 1; i <= this.tagList.length; i++) {
            for (let j = 1; j <= this.artistList.length; j++) {
                allDataTag_ArtistMatrix[i][j] = Math.floor(Math.random() * 10);
            }
        }
    }

    ///用于设置user_tagMatrix和tag_artistMatrix中的值
    private setMatrix(dataList, user_tagMatrix, tag_artistMatrix) {
        ///user_tagMatrix
        for (let i = 0; i < dataList.length; i++) {
            for (let j = 1; j < user_tagMatrix.length; j++) {          ///user
                for (let k = 1; k < user_tagMatrix[j].length; k++) {           ///tag
                    if (dataList[i].tagID == user_tagMatrix[0][k]
                        && dataList[i].userId == user_tagMatrix[j][0]) {
                        user_tagMatrix[j][k]++;
                    }
                }
            }
        }
        ///tag_artistMatrix
        for (let i = 0; i < dataList.length; i++) {
            for (let j = 1; j < tag_artistMatrix.length; j++) {            ///tag
                for (let k = 1; k < tag_artistMatrix[j].length; k++) {         ///artist
                    if (dataList[i].tagID == tag_artistMatrix[j][0]
                        && dataList[i].artistID == tag_artistMatrix[0][k]) {
                        tag_artistMatrix[j][k]++;
                    }
                }
            }
        }
    }

    ///初始化一系列数据
    private initData() {
        let self = this;
        //let tempNum = 0;

        ///获取所有用户行为数据
        // this.allDataList = ExperimentalDataCollection.find({}, {limit: this.dataNum}).fetch();
        this.allDataList = TestDataCollection.find().fetch();
        this.numOfOneData = this.dataNum / 10;
        ///初始化userList
        this.allDataList.forEach(function (data) {
            let flag = false;
            self.userList.forEach(function (user) {
                if (user == data.userId) {
                    flag = true;                        ///userList中已包含有该userID
                }
            });
            if (flag == false) {                          ///如果userList中未存有该userID，则保存userID
                self.userList.push(data.userId);
            }
        });
        ///初始化tagList
        this.allDataList.forEach(function (data) {
            let flag = false;
            self.tagList.forEach(function (tag) {
                if (tag == data.tagID) {
                    flag = true;                        ///tagList中已包含有该tagID
                }
            });
            if (flag == false) {                          ///如果tagList中未存有该userID，则保存tagID
                self.tagList.push(data.tagID);
            }
        });
        ///初始化artistList
        this.allDataList.forEach(function (data) {
            let flag = false;
            self.artistList.forEach(function (artist) {
                if (artist == data.artistID) {
                    flag = true;                        ///artistList中已包含有该artistID
                }
            });
            if (flag == false) {                          ///如果artistList中未存有该artistID，则保存artistID
                self.artistList.push(data.artistID);
            }
        });

        ///建立一个临时数组以防止下面的操作修改this.allDataList
        for (let i = 0; i < this.allDataList.length; i++) {
            this.tempAllDataList.push(this.allDataList[i]);
        }

//======================================未用随机抽样初始化数组=============================================
        ///初始化用于测试的10个分组的数据
        // tempNum = self.initDataList(tempNum, this.dataListForTest0);
        // tempNum = self.initDataList(tempNum, this.dataListForTest1);
        // tempNum = self.initDataList(tempNum, this.dataListForTest2);
        // tempNum = self.initDataList(tempNum, this.dataListForTest3);
        // tempNum = self.initDataList(tempNum, this.dataListForTest4);
        // tempNum = self.initDataList(tempNum, this.dataListForTest5);
        // tempNum = self.initDataList(tempNum, this.dataListForTest6);
        // tempNum = self.initDataList(tempNum, this.dataListForTest7);
        // tempNum = self.initDataList(tempNum, this.dataListForTest8);
        // self.initDataList(tempNum, this.dataListForTest9);
        ///初始化用于训练的10个分组的数据
        // self.dataListForTraining0 = self.dataListForTest1.concat(self.dataListForTest2).concat(self.dataListForTest3)
        //     .concat(self.dataListForTest4).concat(self.dataListForTest5).concat(self.dataListForTest6)
        //     .concat(self.dataListForTest7).concat(self.dataListForTest8).concat(self.dataListForTest9);
        // self.dataListForTraining1 = self.dataListForTest2.concat(self.dataListForTest3).concat(self.dataListForTest4)
        //     .concat(self.dataListForTest5).concat(self.dataListForTest6).concat(self.dataListForTest7)
        //     .concat(self.dataListForTest8).concat(self.dataListForTest9).concat(self.dataListForTest0);
        // self.dataListForTraining2 = self.dataListForTest3.concat(self.dataListForTest4).concat(self.dataListForTest5)
        //     .concat(self.dataListForTest6).concat(self.dataListForTest7).concat(self.dataListForTest8)
        //     .concat(self.dataListForTest9).concat(self.dataListForTest0).concat(self.dataListForTest1);
        // self.dataListForTraining3 = self.dataListForTest4.concat(self.dataListForTest5).concat(self.dataListForTest6)
        //     .concat(self.dataListForTest7).concat(self.dataListForTest8).concat(self.dataListForTest9)
        //     .concat(self.dataListForTest0).concat(self.dataListForTest1).concat(self.dataListForTest2);
        // self.dataListForTraining4 = self.dataListForTest5.concat(self.dataListForTest6).concat(self.dataListForTest7)
        //     .concat(self.dataListForTest8).concat(self.dataListForTest9).concat(self.dataListForTest0)
        //     .concat(self.dataListForTest1).concat(self.dataListForTest2).concat(self.dataListForTest3);
        // self.dataListForTraining5 = self.dataListForTest6.concat(self.dataListForTest7).concat(self.dataListForTest8)
        //     .concat(self.dataListForTest9).concat(self.dataListForTest0).concat(self.dataListForTest1)
        //     .concat(self.dataListForTest2).concat(self.dataListForTest3).concat(self.dataListForTest4);
        // self.dataListForTraining6 = self.dataListForTest7.concat(self.dataListForTest8).concat(self.dataListForTest9)
        //     .concat(self.dataListForTest0).concat(self.dataListForTest1).concat(self.dataListForTest2)
        //     .concat(self.dataListForTest3).concat(self.dataListForTest4).concat(self.dataListForTest5);
        // self.dataListForTraining7 = self.dataListForTest8.concat(self.dataListForTest9).concat(self.dataListForTest0)
        //     .concat(self.dataListForTest1).concat(self.dataListForTest2).concat(self.dataListForTest3)
        //     .concat(self.dataListForTest4).concat(self.dataListForTest5).concat(self.dataListForTest6);
        // self.dataListForTraining8 = self.dataListForTest9.concat(self.dataListForTest0).concat(self.dataListForTest1)
        //     .concat(self.dataListForTest2).concat(self.dataListForTest3).concat(self.dataListForTest4)
        //     .concat(self.dataListForTest5).concat(self.dataListForTest6).concat(self.dataListForTest7);
        // self.dataListForTraining9 = self.dataListForTest0.concat(self.dataListForTest1).concat(self.dataListForTest2)
        //     .concat(self.dataListForTest3).concat(self.dataListForTest4).concat(self.dataListForTest5)
        //     .concat(self.dataListForTest6).concat(self.dataListForTest7).concat(self.dataListForTest8);

//==========================================随机抽样初始化数组===============================================
        this.randomSampling(this.dataListForTraining0, this.dataListForTest0);
        this.randomSampling(this.dataListForTraining1, this.dataListForTest1);
        this.randomSampling(this.dataListForTraining2, this.dataListForTest2);
        this.randomSampling(this.dataListForTraining3, this.dataListForTest3);
        this.randomSampling(this.dataListForTraining4, this.dataListForTest4);
        this.randomSampling(this.dataListForTraining5, this.dataListForTest5);
        this.randomSampling(this.dataListForTraining6, this.dataListForTest6);
        this.randomSampling(this.dataListForTraining7, this.dataListForTest7);
        this.randomSampling(this.dataListForTraining8, this.dataListForTest8);
        this.randomSampling(this.dataListForTraining9, this.dataListForTest9);

//======================================50条数据手动建立数组=========================================
        ///手动建立数据数组
        // this.setTestDataList(0,5,this.dataListForTest0,this.dataListForTraining0);
        // this.setTestDataList(5,12,this.dataListForTest1,this.dataListForTraining1);
        // this.setTestDataList(12,19,this.dataListForTest2,this.dataListForTraining2);
        // this.setTestDataList(19,22,this.dataListForTest3,this.dataListForTraining3);
        // this.setTestDataList(22,29,this.dataListForTest4,this.dataListForTraining4);
        // this.setTestDataList(29,32,this.dataListForTest5,this.dataListForTraining5);
        // this.setTestDataList(32,36,this.dataListForTest6,this.dataListForTraining6);
        // this.setTestDataList(36,40,this.dataListForTest7,this.dataListForTraining7);
        // this.setTestDataList(40,45,this.dataListForTest8,this.dataListForTraining8);
        // this.setTestDataList(45,50,this.dataListForTest9,this.dataListForTraining9);
    }

    ///手动建立数据数组，测试算法用
    private setTestDataList(firstIndex, lastIndex, arrForTest, arrForTraining) {
        ///手动建立Test数组
        var tempDataList = [];
        for (let i = 0; i < this.allDataList.length; i++) {
            tempDataList[i] = this.allDataList[i];
        }
        for (let i = firstIndex; i < lastIndex; i++) {
            arrForTest[i - firstIndex] = this.allDataList[i];
        }
        ///祛除Test数组中的元素，将剩余的元素存入Training数组中
        for (let i = 0; i < 50; i++) {                  ///祛除元素
            for (let j = 0; j < arrForTest.length; j++) {
                if (arrForTest[j] == tempDataList[i]) {
                    tempDataList.splice(i, 1);
                }
            }
        }
        for (let i = 0; i < tempDataList.length; i++) {             ///赋值
            arrForTraining[i] = tempDataList[i];
        }
    }

    ///随机抽样建立数据数组
    private randomSampling(arrForTraining, arrForTest) {
        ///利用随机函数建立Test数组
        for (let j = 0; j < this.dataNum / 10; j++) {
            var randomData = Math.floor(Math.random() * (this.tempAllDataList.length));
            arrForTest.push(this.allDataList[randomData]);
            this.tempAllDataList.splice(randomData, 1);          ///从randomData位置开始，删除一个元素
        }
        ///tempArray存放所有数据，用于下面剔除Test中的元素
        var tempArray = [];
        for (let i = 0; i < this.allDataList.length; i++) {
            tempArray.push(this.allDataList[i]);
        }
        ///祛除Test数组中的元素，将剩余的元素存入Training数组中
        for (let i = 0; i < this.allDataList.length; i++) {             ///祛除元素
            for (let j = 0; j < arrForTest.length; j++) {
                if (arrForTest[j] == tempArray[i]) {
                    tempArray.splice(i, 1);
                }
            }
        }
        for (let i = 0; i < tempArray.length; i++) {            ///赋值
            arrForTraining[i] = tempArray[i];
        }
    }

    ///用于初始化存放数据条的多个数组，前版
    private initDataList(tempNum, list) {
        for (var i = tempNum; i < this.numOfOneData + tempNum; i++) {           ///从所有数据中抽取定量数据放入一个分组中
            list.push(this.allDataList[i]);
        }
        tempNum = i;
        return tempNum;
    }

    ///计算矩阵稀疏程度
    private calculateDensity() {
        let self = this;

        ///计算User_TagMatrix中0的个数
        this.allDataUser_TagMatrix.forEach(function (user) {            ///遍历User_TagMatrix
            user.forEach(function (tag) {
                if (tag == 0) {
                    self.zeroOfUser_TagMatrix++;                ///若值为0，则数量加1
                }
            });
        });
        ///计算Tag_ArtistMatrix中0的个数
        this.allDataTag_ArtistMatrix.forEach(function (tag) {           ///遍历Tag_ArtistMatrix
            tag.forEach(function (artist) {
                if (artist == 0) {
                    self.zeroOfTag_ArtistMatrix++;              ///若值为0，则数量加1
                }
            });
        });
        ///计算两个矩阵的稀疏度
        this.densityOfUser_TagMatrix = this.zeroOfUser_TagMatrix / (this.userList.length * this.tagList.length);
        this.densityOfTag_ArtistMatrix = this.zeroOfTag_ArtistMatrix / (this.tagList.length * this.artistList.length);
    }

}