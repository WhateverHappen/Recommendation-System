import {
    TaCollection, TagCollection, IPCollection, UserCollection, Ent_ProductCollection
} from "../../../both/collections/demo.collection";
import {Matrix} from "sylvester";
import {provideLocationStrategy} from "@angular/router/src/router_module";

/**
 * Created by 嘲讽脸 on 2017/4/10.
 */

export class DataServiceForIP {
    public user_tagMatrix;               ///用户-标签矩阵
    public tag_ipMatrix;                 ///标签-ip矩阵

    ///user信息
    private userId;
    private user;
    private tagOfUser = [];                    ///用户使用过的标签

    ///存放内容为Object
    private taArray = [];
    private tagArray = [];
    private userArray = [];
    public ipArray = [];

    ///需要计算权重的几大标签分类，存放内容为标签名
    private allTagArray = [];                     ///存放所有标签，包括ta和tag
    private lifeStyleArray = [];
    private addressArray = [];
    private incomeArray = [];
    private sexArray = [];
    private roleArray = [];
    private ageArray = [];
    private careerArray = [];
    private propositionArray = [];                ///产品调性（ip主张）

    private competitive = [];           ///存储属于成功案例且对应产品是竞品的ip
    private non_competitive=[];           ///存储属于成功案例且对应产品是非竞品的ip

    ///权重
    private weightOfLifeStyle = 0.5 / 7;
    private weightOfAddress = 0.5 / 7;
    private weightOfIncome = 0.5 / 7;
    private weightOfSex = 0.5 / 7;
    private weightOfRole = 0.5 / 7;
    private weightOfAge = 0.5 / 7;
    private weightOfCareer = 0.5 / 7;
    private weightOfProposition = 0.5;

    private thresholdOfTA = 0.7;      ///判断TA以及调性的阈值
    ///构造函数
    constructor(userId: String) {
        this.userId = userId;
        this.initData();
        this.getUserInfo();
        this.initMatrix();
        this.setMatrix();
    }

    ///初始化数据
    private initData() {
        this.taArray = TaCollection.find().fetch();
        this.tagArray = TagCollection.find().fetch();
        this.tagArray.push("endorsement");      ///添加“成功案例”维度
        this.ipArray = IPCollection.find({}, {limit: 30}).fetch();
        this.userArray = UserCollection.find().fetch();

        ///存储ta中的几大分类
        this.storeDataOfTa(0, this.lifeStyleArray);
        this.storeDataOfTa(1, this.addressArray);
        this.storeDataOfTa(2, this.roleArray);
        this.storeDataOfTa(3, this.incomeArray);
        this.storeDataOfTa(4, this.careerArray);
        this.storeDataOfTa(5, this.sexArray);
        this.storeDataOfTa(6, this.ageArray);

    }

    ///用于存储ta中的几大分类
    private storeDataOfTa(num, array) {
        for (let i = 0; i < this.taArray[num].nodeList.length; i++) {
            array.push(this.taArray[num].nodeList[i].name);
        }
    }

    ///根据userId获取
    private getUserInfo() {
        let self = this;
        this.userArray.forEach(function (user) {            ///根据userId获取用户
            if (user._id == self.userId) {
                self.user = user;
            }
        });

        let workgroupList = this.user.profile.workgroupList;                ///获取user所属的workgroup

        for (let j = 0; j < workgroupList.length; j++) {            ///遍历用户所属的所有workgroup
            if (workgroupList[j].series != null) {              ///workgroup目标是系列(ip推荐不考虑产品)
                ///添加series中user使用过的ta中的标签
                for (let i = 0; i < workgroupList[j].series.taList.length; i++) {
                    for (let k = 0; k < workgroupList[j].series.taList[i].nodeList.length; k++) {
                        this.tagOfUser.push(workgroupList[j].series.taList[i].nodeList[k].name);
                    }
                }
                ///添加brand中user使用过的ta中的标签
                for (let i = 0; i < workgroupList[j].brand.taList.length; i++) {
                    for (let k = 0; k < workgroupList[j].brand.taList[i].nodeList.length; k++) {
                        this.tagOfUser.push(workgroupList[j].brand.taList[i].nodeList[k].name);
                    }
                }
                ///添加series中user使用过的tag中的标签
                for (let i = 0; i < workgroupList[j].series.propositionList.length; i++) {
                    this.tagOfUser.push(workgroupList[j].series.propositionList[i].name);
                }
                ///添加brand中user使用过的tag中的标签
                for (let i = 0; i < workgroupList[j].brand.propositionList.length; i++) {
                    this.tagOfUser.push(workgroupList[j].brand.propositionList[i].name);
                }
            } else if (workgroupList[j].brand != null) {              ///workgroup目标是品牌
                ///添加brand中user使用过的ta中的标签
                for (let i = 0; i < workgroupList[j].brand.taList.length; i++) {
                    for (let k = 0; k < workgroupList[j].brand.taList[i].nodeList.length; k++) {
                        this.tagOfUser.push(workgroupList[j].brand.taList[i].nodeList[k].name);
                    }
                }
                ///添加user使用过的tag中的标签
                for (let i = 0; i < workgroupList[j].brand.propositionList.length; i++) {
                    this.tagOfUser.push(workgroupList[j].brand.propositionList[i].name);
                }
            }
        }
    }

    ///ip粗筛选，查找属于成功案例的ip
    private findProductWithSameTA() {
        let self = this;
        var products = Ent_ProductCollection.find().fetch();        ///获取产品列表
        ///查找TA以及调性达到阈值的产品，并回溯找到对应的ip
        products.forEach(function (product) {
            var count = 0;          ///用于统计标签相同的个数
            if (!product.series) {           ///有series字段
                for (let i = 0; i < self.tagOfUser.length; i++) {       ///统计series字段中相等的tag数
                    for (let j = 0; j < product.series.taList.length; j++) {
                        if (product.series.taList[j].name == self.tagOfUser[i]) {
                            count++;
                        }
                    }
                }
            }
            for (let i = 0; i < self.tagOfUser.length; i++) {           ///统计brand字段中相等的tag数
                for (let j = 0; j < product.brand.taList.length; j++) {
                    if (product.brand.taList[j].name == self.tagOfUser[i]) {
                        count++;
                    }
                }
            }
            if ((count / this.tagOfUser.length) > this.thresholdOfTA) {       ///达到阈值
                if(!product.series){        ///有series字段,需要通过判断type确定是否为竞品

                }
            }
        });
        ///去除对应产品属于竞品的ip
        for(let i=0;i<this.ipArray.length;i++){
            for(let j=0;j<this.competitive.length;j++){
                if(this.ipArray[i]==this.competitive[j]){
                    this.ipArray.splice(i,1);
                    i--;
                }
            }
        }
    }

    ///初始化矩阵
    private initMatrix() {
        ///构造user_tagMatrix
        var tempArray = [];             ///用于暂时存放标签名称
        tempArray[0] = 0;
        let self = this;

        ///存入ta标签名称
        this.taArray.forEach(function (ta) {
            for (let i = 0; i < ta.nodeList.length; i++) {
                tempArray.push(ta.nodeList[i].name);
            }
        });
        ///存入tag标签中的产品调性名称
        this.tagArray.forEach(function (tag) {
            if (tag.type == 'proposition') {
                tempArray.push(tag.name);
                self.propositionArray.push(tag.name);
            }
        });

        this.user_tagMatrix = Matrix.Zero(1, this.tagArray.length + 1);
        this.user_tagMatrix.elements[0] = tempArray;                 ///将一系列标签作为矩阵的第一行存入矩阵
        for (let j = 0; j < tempArray.length - 1; j++) {        ///将所有标签存入allTagArray中
            this.allTagArray[j] = tempArray[j + 1];
        }
        ///将userId存入矩阵，并为该行其余项赋0
        let array = [];
        array[0] = this.userId;
        for (let i = 1; i <= this.allTagArray.length; i++) {
            array[i] = 0;
        }
        this.user_tagMatrix.elements[1] = array;

        ///构造tag-ip矩阵
        let tempArray_ip = [];
        ///将ip作为矩阵的第一行存入矩阵
        for (let j = 1; j <= this.ipArray.length; j++) {
            tempArray_ip[j] = this.ipArray[j - 1].name;
        }
        this.tag_ipMatrix = Matrix.Zero(this.allTagArray.length + 1, this.ipArray.length + 1);
        this.tag_ipMatrix.elements[0] = tempArray_ip;
        for (let j = 1; j <= this.allTagArray.length; j++) {                ///向矩阵中存入所有的tag
            let array = [];
            array[0] = this.allTagArray[j - 1];
            for (let i = 1; i <= this.ipArray.length; i++) {         ///将该行除tagID外所有项初始化为0
                array[i] = 0;
            }
            this.tag_ipMatrix.elements[j] = array;
        }
    }

    ///填充矩阵
    private setMatrix() {
        ///填充tag_ipMatrix矩阵
        for (let i = 1; i < this.tag_ipMatrix.elements[0].length; i++) {         ///ip
            if (!this.ipArray[i - 1].taList) {
                this.ipArray[i - 1].taList = [];
            }
            var taOfIp = this.ipArray[i - 1].taList;                 ///获取该ip的受众链表
            var propositionOfIp = this.ipArray[i - 1].propositionList;      ///获取该ip的proposition类别标签链表
            for (let j = 1; j < this.tag_ipMatrix.elements.length; j++) {        ///tag
                if (taOfIp.length == 0 || taOfIp == undefined) {       ///受众该类没有填，表示适用该类别下所有要求

                    ///遍历propositionArray，如果不属于该类，则使用次数++，否则跳转下一次循环
                    let flag = false;         ///用于判断该标签是否为proposition类标签
                    for (let x = 0; x < this.propositionArray.length; x++) {
                        if (this.tag_ipMatrix.elements[j][0] == this.propositionArray[x]) {
                            flag = true;
                            break;
                        }
                    }
                    if (!flag) {                      ///不是proposition类标签
                        this.tag_ipMatrix.elements[j][i]++;
                    }
                } else {                 ///受众该类有具体要求
                    for (let k = 0; k < taOfIp.length; k++) {               ///遍历ip的受众链表
                        for (let x = 0; x < taOfIp[k].nodeList.length; x++) {
                            if (taOfIp[k].nodeList[x].name == this.tag_ipMatrix.elements[j][0]) {        ///纵向比较一个ip使用了哪个标签
                                this.tag_ipMatrix.elements[j][i]++;
                            }
                        }
                    }
                }
                ///该ip有proposition类标签
                if (propositionOfIp != undefined) {
                    for (let k = 0; k < propositionOfIp.length; k++) {
                        if (this.tag_ipMatrix.elements[j][0] == propositionOfIp[k].name) {   ///遍历proposition标签，判断ip有无使用该类标签
                            this.tag_ipMatrix.elements[j][i]++;
                        }
                    }
                }
            }
        }
        ///填充user_tagMatrix矩阵
        for (let i = 0; i < this.tagOfUser.length; i++) {           ///tag
            for (let j = 1; j < this.user_tagMatrix.elements[1].length; j++) {             ///遍历所有标签
                if (this.tagOfUser[i] == this.user_tagMatrix.elements[0][j]) {       ///用户使用了该标签
                    this.user_tagMatrix.elements[1][j]++;
                }
            }
        }
        this.addWeightOfUser_TagMatrix();       ///添加权重因素
    }

    ///添加权重计算
    private addWeightOfUser_TagMatrix() {
        for (let i = 1; i < this.user_tagMatrix.elements[0].length; i++) {           ///遍历user_tagMatrix，根据类别添加权重因素
            this.addWeight(this.lifeStyleArray, this.weightOfLifeStyle, i);
            this.addWeight(this.addressArray, this.weightOfAddress, i);
            this.addWeight(this.incomeArray, this.weightOfIncome, i);
            this.addWeight(this.sexArray, this.weightOfSex, i);
            this.addWeight(this.roleArray, this.weightOfRole, i);
            this.addWeight(this.ageArray, this.weightOfAge, i);
            this.addWeight(this.careerArray, this.weightOfCareer, i);
            this.addWeight(this.propositionArray, this.weightOfProposition, i);
        }
    }

    ///为传入的array添加权重因素
    private addWeight(array, weight, i) {
        for (let j = 0; j < array.length; j++) {
            if (this.user_tagMatrix.elements[0][i] == array[j]) {
                this.user_tagMatrix.elements[1][i] *= weight;
            }
        }
    }

}