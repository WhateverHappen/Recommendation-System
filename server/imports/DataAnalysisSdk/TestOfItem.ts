/**
 * Created by 嘲讽脸 on 2017/4/4.
 */

import {
    UserCollection, ArtistCollection,
    ExperimentalDataCollection, TagsCollection, TestDataCollection
} from "../../../both/collections/demo.collection";
import {Matrix} from "sylvester";

export class TestOfItem {
    ///用于测试的10个user_tagMatrix
    public user_tagMatrixForTest=[];

    ///用于测试的10个tag_artistMatrix
    public tag_artistMatrixForTest=[];

    ///用于训练的10个user_tagMatrix
    public user_tagMatrixForTraining=[];

    ///用于训练的10个tag_artistMatrix
    public tag_artistMatrixForTraining=[];

    ///10个用于训练的分组数据数组
    private dataListForTraining=[];

    ///10个用于测试的分组数据数组
    private dataListForTest=[];

    public yang_matrix = [];
    public userList = [];                  ///存放所有userID
    public tagList = [];                   ///存放所有tagID
    public artistList = [];                ///存放所有artistID
    private allDataList = [];               ///存放根据artist提取出来正式使用的数据
    private dataList = [];                   ///存放所有数据
    private tempAllDataList = [];

    private numOfOneData = 0;                           ///一个分组的数据量
    public sourceNum = 65;                              ///要提取的数据量

    constructor() {
        this.initData();
        this.initAllMatrix();
        this.setAllMatrix();
        // this.inituserip(this.allDataList);
    }

    ///初始化所有矩阵
    private initAllMatrix() {
        ///测试矩阵
        for(let i=0;i<10;i++){
            this.initMatrix(this.user_tagMatrixForTest,i,this.tag_artistMatrixForTest);
            this.initMatrix(this.user_tagMatrixForTraining,i,this.tag_artistMatrixForTraining)
        }
    }

    ///用于初始化user_tagMatrix和tag_artistMatrix
    private initMatrix(user_tagMatrix,k,tag_artistMatrix){
        ///建立user_tagMatrix
        user_tagMatrix[k] = Matrix.Zero(this.userList.length+1,this.tagList.length+1);
        let tempTagArray = [];
        for (let i = 1; i <= this.tagList.length; i++) {        ///将所有tagID存入一个数组中
            tempTagArray[i] = this.tagList[i - 1];
        }
        user_tagMatrix[k].elements[0] = tempTagArray;               ///将tag存入矩阵的第一行
        for (let j = 1; j <= this.userList.length; j++) {                ///存入userID
            user_tagMatrix[k].elements[j][0] = this.userList[j - 1];
        }
        ///建立tag_artistMatrix
        tag_artistMatrix[k] = Matrix.Zero(this.tagList.length+1,this.artistList.length+1);
        let tempArtistArray = [];
        for (let i = 1; i <= this.artistList.length; i++) {     ///将所有artistID存入一个数组中
            tempArtistArray[i] = this.artistList[i - 1];
        }
        tag_artistMatrix[k].elements[0] = tempArtistArray;              ///将artist存入矩阵的第一行
        for (let j = 1; j <= this.tagList.length; j++) {                ///存入TagID
            tag_artistMatrix[k].elements[j][0] = this.tagList[j - 1];
        }
    }

    ///根据所取数据计算20个user_tagMatrix和20个tag_artistMatrix中每项的值
    private setAllMatrix() {
        ///测试矩阵
        for(let i=0;i<10;i++){
            this.setMatrix(this.dataListForTest[i],this.user_tagMatrixForTest[i],this.tag_artistMatrixForTest[i]);
            this.setMatrix(this.dataListForTraining[i],this.user_tagMatrixForTraining[i], this.tag_artistMatrixForTraining[i]);
        }
    }

    ///用于设置user_tagMatrix和tag_artistMatrix中的值
    private setMatrix(dataList, user_tagMatrix, tag_artistMatrix) {
        ///user_tagMatrix
        for (let i = 0; i < dataList.length; i++) {
            for (let j = 1; j < user_tagMatrix.elements.length; j++) {          ///user
                for (let k = 1; k < user_tagMatrix.elements[j].length; k++) {           ///tag
                    if (dataList[i].tagID == user_tagMatrix.elements[0][k]
                        && dataList[i].userId == user_tagMatrix.elements[j][0]) {
                        user_tagMatrix.elements[j][k]++;
                    }
                }
            }
        }
        ///tag_artistMatrix
        for (let i = 0; i < dataList.length; i++) {
            for (let j = 1; j < tag_artistMatrix.elements.length; j++) {            ///tag
                for (let k = 1; k < tag_artistMatrix.elements[j].length; k++) {         ///artist
                    if (dataList[i].tagID == tag_artistMatrix.elements[j][0]
                        && dataList[i].artistID == tag_artistMatrix.elements[0][k]) {
                        tag_artistMatrix.elements[j][k]++;
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
        this.dataList = ExperimentalDataCollection.find().fetch();
        var tempArtistList = ArtistCollection.find({},{limit:this.sourceNum}).fetch();
        ///初始化allDataList
        this.dataList.forEach(function (item) {
            tempArtistList.forEach(function (artist) {
                if(artist.artistID==item.artistID){
                    self.allDataList.push(item);
                }
            });
        });
        ///初始化artistList
        tempArtistList.forEach(function (artist) {
            self.artistList.push(artist.artistID);
        });
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

        this.numOfOneData = this.allDataList.length / 10;

        ///建立一个临时数组以防止下面的操作修改this.allDataList
        for (let i = 0; i < this.allDataList.length; i++) {
            this.tempAllDataList.push(this.allDataList[i]);
        }

        //随机抽样初始化数组
        for(let i=0;i<10;i++){
            this.randomSampling(this.dataListForTraining,this.dataListForTest,i);
        }
    }

    ///随机抽样建立数据数组
    private randomSampling(arrForTraining, arrForTest,k) {
        ///利用随机函数建立Test数组
        var tempArrayForTest=[];
        for (let j = 0; j < Math.floor(this.allDataList.length / 10); j++) {
            var randomData = Math.floor(Math.random() * (this.tempAllDataList.length));
            tempArrayForTest.push(this.tempAllDataList[randomData]);
            this.tempAllDataList.splice(randomData, 1);          ///从randomData位置开始，删除一个元素
        }
        arrForTest[k]=tempArrayForTest;
        var tempArray = [];
        for (let i = 0; i < this.allDataList.length; i++) {
            tempArray.push(this.allDataList[i]);
        }
        ///祛除Test数组中的元素，将剩余的元素存入Training数组中
        for (let i = 0; i < this.allDataList.length; i++) {             ///祛除元素
            for (let j = 0; j < tempArrayForTest.length; j++) {
                if (tempArrayForTest[j] == tempArray[i]) {
                    tempArray.splice(i, 1);
                }
            }
        }
        arrForTraining[k] = tempArray;
    }

    //计算用户使用过哪些ip
    // public inituserip(dataList){
    //
    //     var user_artist = [];
    //     // for(var i =0; i<=this.userList.length;i++)  //用户数+1
    //     // {
    //     //     user_artist[i] = [];
    //     // }.
    //
    //     let tempUserArray = [];
    //     for (var i = 1; i <= this.artistList.length; i++) {        ///将所有userID存入一个数组中
    //         tempUserArray[i] = this.artistList[i - 1];
    //     }
    //     user_artist[0] = tempUserArray;               ///将user存入矩阵的第一行
    //
    //     for (var j = 1; j <= this.userList.length; j++) {                ///存入userID
    //         var array = [];
    //         array[0] = this.userList[j - 1];
    //         for (let i = 1; i <= this.artistList.length; i++) {              ///将该行除userID外所有项初始化为0
    //             array[i] = 0;
    //         }
    //         user_artist[j] = array;
    //     }
    //
    //     for(var i=0;i<dataList.length;i++)
    //     {
    //         var user =1,artist=1;
    //         while(dataList[i].userId!=user_artist[user][0])
    //         {
    //             //console.log(dataList[i].userID+" "+user_artist[user][0])。
    //             user++;
    //         }
    //         while(dataList[i].artistID!=user_artist[0][artist])
    //         {
    //             artist++;
    //         }
    //         if(user_artist[user][artist]==0)
    //         {
    //             user_artist[user][artist]=1;
    //         }
    //     }
    //     this.yang_matrix=user_artist;
    // }
}

