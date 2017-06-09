/**
 * Created by 嘲讽脸 on 2017/3/21.
 */

import {TestOfItem} from"./TestOfItem"
import {Matrix} from "sylvester";
import {Vector} from "sylvester";

export class TT {
    private N = 5;

    private weightOfUser;
    private weightOfItem;

    constructor() {
    }

    public calWeight(){
        this.weightOfItem=1;
        this.weightOfUser=1-this.weightOfItem;
        var tempResult=[0,0,0];
        var index=0;

        for(let j=0;j<100;j++){
            var result = this.calKQuality();
            if((tempResult[0]+0.0005)<result[0]){
                tempResult=result;
                index=j;
            }
            this.weightOfItem-0.01;
            this.weightOfUser=1-this.weightOfItem;
            console.log("num:",j);
            console.log("result:",result);
        }
        console.log("result:", tempResult);
        console.log("index:",index);
    }

    private calKQuality() {
        var test = new TestOfItem();
        test.execute();

        var resultTemp = [];
        for (let i = 0; i < 10; i++) {
            resultTemp[i] = this.calResult(test.userList, test.artistList, test.dataListForTest[i],
                test.user_tagMatrixForTraining[i], test.tag_artistMatrixForTraining[i]);
        }

        var result = [];
        for (let i = 0; i < 3; i++) {
            let temp = 0;
            for (let j = 0; j < 10; j++) {
                temp += resultTemp[j][i];
                result[i] = temp / 10;
            }
        }
        return result;
    }

    private calResult(userList, artistList, dataListForTest,
                      user_tagMatrixForTraining, tag_artistMatrixForTraining) {
        var trainingMatrix = this.Recommend(user_tagMatrixForTraining, tag_artistMatrixForTraining);
        var result = this.calQuality(userList, artistList, dataListForTest, trainingMatrix);
        return result;
    }

    ///test不经过计算
    private calQuality(userList, artistList, dataListForTest, user_artistMatrixForTraining) {
        var precision;            ///准确率
        var recall;                 ///召回率
        var f_measure;
        var numOfRight = 0;           ///相等的个数。。
        var numOfR = 0;
        var numOfT = 0;
        var array = [];

//===================================混合推荐======================================================
        for (let i = 0; i < user_artistMatrixForTraining.elements.length; i++) {
            for (let j = 0; j < user_artistMatrixForTraining.elements[i].length; j++) {
                for (let k = 0; k < dataListForTest.length; k++) {
                    if ((userList[i] == dataListForTest[k].userId)     ///用户相同
                        && (dataListForTest[k].artistID == artistList[user_artistMatrixForTraining.elements[i][j] - 1])) {
                        numOfRight++;
                    }
                }
            }
        }

        numOfT = dataListForTest.length;

        numOfR = this.N * user_artistMatrixForTraining.elements.length;
//=====================================项目推荐================================================================
//         for (let i = 0; i < user_artistMatrixForTraining.length; i++) {
//             for (let j = 0; j < user_artistMatrixForTraining[i].length; j++) {
//                 for (let k = 0; k < dataListForTest.length; k++) {
//                     if ((userList[i] == dataListForTest[k].userId)     ///用户相同
//                         && (dataListForTest[k].artistID == artistList[user_artistMatrixForTraining[i][j] - 1])) {
//                         numOfRight++;
//                     }
//                 }
//             }
//         }
//
//         numOfT = dataListForTest.length;
//
//         numOfR = this.N * user_artistMatrixForTraining.length;
//====================================================================================================

        precision = numOfRight / numOfR;
        recall = numOfRight / numOfT;
        if (numOfRight == 0) {
            f_measure = 0;
        } else {
            f_measure = (2 * precision * recall) / (precision + recall);
        }
        array[0] = precision;
        array[1] = recall;
        array[2] = f_measure;
        return array;
    }

    public Recommend(user_tagMatrix, tag_ipMatrix) {

        var user_tag = user_tagMatrix.minor(2, 2, user_tagMatrix.elements.length - 1, user_tagMatrix.elements[0].length - 1);     ///去掉用户和标签的名称

        var numOfTag = user_tag.elements[0].length;        //标签数
        var numOfUser = user_tag.elements.length;      //用户数

        var Ntju = Vector.Zero(numOfTag);          //使用标签tj的用户数
        for (let i = 0; i < numOfTag; i++) {       //初始化Ntju矩阵
            for (let j = 0; j < numOfUser; j++) {
                if (user_tag.elements[j][i] != 0) {
                    Ntju.elements[i]++;
                }
            }
        }

        var Nut = Vector.Zero(numOfUser);         //用户u使用的标签数
        for (let i = 0; i < numOfUser; i++) {       //初始化Nut矩阵
            for (let j = 0; j < numOfTag; j++) {                               //时间：O(1)  空间:O(0)
                Nut.elements[i] += user_tag.elements[i][j];
            }
        }

        var Ft = Matrix.Zero(numOfUser, numOfTag);         //该二维数组表示用户使用标签的频度
        for (let i = 0; i < numOfUser; i++) {
            for (let j = 0; j < numOfTag; j++) {
                if (Nut.elements[i] == 0) {
                    Ft.elements[i][j] = 0;
                }
                else {
                    Ft.elements[i][j] = user_tag.elements[i][j] / Nut.elements[i];
                }
            }
        }

        var It = Vector.Zero(numOfTag);        //在用户所有标签中该标签的重要程度
        for (let i = 0; i < numOfTag; i++) {
            if (Ntju.elements[i] != 0) {
                let t = numOfUser / Ntju.elements[i];
                It.elements[i] = Math.log(t) / Math.log(10);
            }
        }

        var Put = Matrix.Zero(numOfUser, numOfTag);      //表示标签t对于用户u的重要程度
        Put = Ft.multiply(It);
//-----------------------------------------------------------------------------//
        var tag_ip = tag_ipMatrix.minor(2, 2, tag_ipMatrix.elements.length - 1, tag_ipMatrix.elements[0].length - 1);

        var numOfIP = tag_ip.elements[0].length;       //IP数

        var Itji = Vector.Zero(numOfTag);       //被标签tj标记的IP数
        for (let i = 0; i < numOfTag; i++) {                               //时间：O(1)  空间:O(0)
            for (let j = 0; j < numOfIP; j++) {
                if (tag_ip.elements[i][j] != 0) {
                    Itji.elements[i]++;
                }
            }
        }

        var Iit = Vector.Zero(numOfTag);            //标签标记的IP总数
        for (let i = 0; i < numOfTag; i++) {       //初始化Iit
            for (let j = 0; j < numOfIP; j++) {                               //时间：O(1)  空间:O(0)
                Iit.elements[i] += tag_ip.elements[i][j];
            }
        }

        var If = Matrix.Zero(numOfTag, numOfIP);       //标签tj标记该资源的频率
        for (let i = 0; i < numOfTag; i++) {                               //时间：O(1)  空间:O(0)
            for (let j = 0; j < numOfIP; j++) {
                if (Iit.elements[i] == 0) {
                    If.elements[i][j] = 0;
                }
                else {
                    If.elements[i][j] = tag_ip.elements[i][j] / Iit.elements[i];
                }
            }
        }
//==========================================================================================================//
        var Ii = Vector.Zero(numOfTag);     //对于所有IP,标签tj的重要度
        for (let i = 0; i < numOfTag; i++) {                               //时间：O(1)  空间:O(0)
            if (Itji.elements[i] == 0) {
                Ii.elements[0][i] = 0;
            }
            else {
                Ii.elements[i] = Math.log(numOfIP / Itji.elements[i]) / Math.log(10);
            }
        }

        var Pit = Matrix.Zero(numOfTag, numOfIP);      //各标签对IP的重要程度
        for (let i = 0; i < numOfTag; i++) {                               //时间：O(1)  空间:O(0)
            for (let j = 0; j < numOfIP; j++) {
                Pit.elements[i][j] = If.elements[i][j] * Ii.elements[i]
            }
        }
//-----------------------------------------------------------------------------//
//Put--用户_标签         Pit--标签_IP
        var Pujik = Matrix.Zero(numOfUser, numOfIP);       //Pujik表示用户对标签的喜爱程度
        Pujik = Ft.multiply(Pit);
//-----------------------------------------------------------------------------//
        var ip_tag = tag_ip.transpose();//转置tag_ip矩阵
        ///计算ip的相似度矩阵
        var SimMat = Matrix.Zero(numOfIP, numOfIP);        //IP的相似度矩阵
        for (let i = 0; i < numOfIP; i++) {                    //求每个IP之间的相似度 时间：O(1)  空间:O(0)
            for (let j = 0; j < numOfIP; j++) {
                SimMat.elements[i][j] = this.sim(ip_tag.elements[i], ip_tag.elements[j]).toFixed(15);
            }
        }

        var PPuij = Matrix.Zero(numOfUser, numOfIP);        //用户对每个IP的预测偏好值
        PPuij = Pujik.multiply(SimMat);
        PPuij = this.guiYi(PPuij.elements);                           //归一化
//-----------------------------------------------------------------------------//
        ///计算user的相似度矩阵
        var userSim = Matrix.Zero(numOfUser, numOfUser);
        for (let i = 0; i < numOfUser; i++) {
            for (let j = 0; j < numOfUser; j++) {
                userSim.elements[i][j] = this.sim(user_tag.elements[i], user_tag.elements[j]).toFixed(15);
            }
        }
        var PPuij2 = Matrix.Zero(numOfUser, numOfIP);
        PPuij2 = userSim.multiply(Pujik);
        PPuij2 = this.guiYi(PPuij2.elements);

        var sort = Matrix.Zero(numOfIP, 2);   //排序矩阵赋0        //[i][0] 存值 [i][1]存位置
        var resultOfItem = Matrix.Zero(numOfUser, numOfIP);     //结果赋0
        var resultOfUser = Matrix.Zero(numOfUser, numOfIP);     //结果赋0
        var temp = new Array(1); //交换临时值
        temp[0] = new Array(1);
        temp[0][0] = 0;

        ///计算基于资源相似的用户推荐
        for (let i = 0; i < PPuij.elements.length; i++) {
            for (let j = 0; j < PPuij.elements[i].length; j++) {
                temp[0][0] = PPuij.elements[i][j];
                if (temp[0][0] >= sort.elements[numOfIP - 1][0]) {
                    sort.elements[numOfIP - 1][0] = temp[0][0];
                    sort.elements[numOfIP - 1][1] = j;
                    for (let k = 1; k < numOfIP; k++) {
                        var tempMatrix = Matrix.Zero(1, 2);
                        if (sort.elements[numOfIP - k][0] >= sort.elements[numOfIP - k - 1][0]) {
                            tempMatrix.elements[0] = sort.elements[numOfIP - k - 1];
                            sort.elements[numOfIP - k - 1] = sort.elements[numOfIP - k];
                            sort.elements[numOfIP - k] = tempMatrix.elements[0];
                        }
                    }
                }
            }
            for (let s = 0; s < numOfIP; s++) {
                if (sort.elements[s][0] != 0) {       //jia
                    resultOfItem.elements[i][s] = sort.elements[s][1];
                }
            }
            for (let a = 0; a < numOfIP; a++) {
                for (let b = 0; b < 2; b++) {
                    sort.elements[a][b] = 0;
                }
            }
        }

        ///计算基于用户相似的用户推荐
        for (let i = 0; i < PPuij2.elements.length; i++) {
            for (let j = 0; j < PPuij2.elements[i].length; j++) {
                temp[0][0] = PPuij2.elements[i][j];
                if (temp[0][0] >= sort.elements[numOfIP - 1][0]) {
                    sort.elements[numOfIP - 1][0] = temp[0][0];
                    sort.elements[numOfIP - 1][1] = j;
                    for (let k = 1; k < numOfIP; k++) {
                        var tempMatrix = Matrix.Zero(1, 2);
                        if (sort.elements[numOfIP - k][0] >= sort.elements[numOfIP - k - 1][0]) {
                            tempMatrix.elements[0] = sort.elements[numOfIP - k - 1];
                            sort.elements[numOfIP - k - 1] = sort.elements[numOfIP - k];
                            sort.elements[numOfIP - k] = tempMatrix.elements[0];
                        }
                    }
                }
            }
            for (let s = 0; s < numOfIP; s++) {
                if (sort.elements[s][0] != 0) {       //jia
                    resultOfUser.elements[i][s] = sort.elements[s][1] + 1;
                }
            }
            for (let a = 0; a < numOfIP; a++) {
                for (let b = 0; b < 2; b++) {
                    sort.elements[a][b] = 0;
                }
            }
        }

//===================================混合推荐=============================================================
        var resultN = Matrix.Zero(numOfUser, this.N);
        for (let i = 0; i < numOfUser; i++) {       ///遍历用户
            var tempList = Matrix.Zero(2 * numOfIP, 2);      ///[j][0]处记录资源序号，[j][1]处记录用于再次排序的数值
            for (let j = 0; j < numOfIP; j++) {     ///先将资源相似的情况放入临时数组
                tempList.elements[j][0] = resultOfItem.elements[i][j];          ///记录资源序号
                tempList.elements[j][1] = (j + 1) * this.weightOfUser;         ///资源排名取半
            }
            var cursor = numOfIP;     ///指向用户相似情况存放的位置
            for (let j = 0; j < numOfIP; j++) {
                let flag = false;
                let count = 0;      ///记录相等情况在临时数组中出现的位置
                for (let k = 0; k < numOfIP; k++) {     ///判断是否有相等且不为0的情况
                    if ((resultOfUser.elements[i][j] == tempList.elements[k][0]) && (resultOfUser.elements[i][j] != 0)) {      ///推荐结果相同且不为0
                        flag = true;
                        count = k;
                    }
                }
                if (flag) {               ///有相等情况出现
                    tempList.elements[count][1] += (j + 1) * this.weightOfItem;           ///将推荐结果相等资源的排名取平均
                } else {                  ///不等
                    tempList.elements[cursor][0] = resultOfUser.elements[i][j];
                    tempList.elements[cursor][1] = (j + 1) * this.weightOfItem;
                    cursor++;
                }
            }

            ///对临时数组中的情况进行排序，完成推荐
            for (let j = 0; j < tempList.elements.length; j++) {
                for (let k = j + 1; k < tempList.elements.length; k++) {
                    if (tempList.elements[j][0] == 0) {         ///前一个数序号为0，一定交换
                        var tempItem = Matrix.Zero(1, 2);
                        tempItem.elements = tempList.elements[j];
                        tempList.elements[j] = tempList.elements[k];
                        tempList.elements[k] = tempItem.elements;
                    } else if (tempList.elements[k][0] == 0) {       ///后一个数序号为0，一定不换
                        continue;
                    } else if ((tempList.elements[j][1] > tempList.elements[k][1])) {        ///均不为0时，判断是否需要交换
                        var tempItem = Matrix.Zero(1, 2);
                        tempItem.elements = tempList.elements[j];
                        tempList.elements[j] = tempList.elements[k];
                        tempList.elements[k] = tempItem.elements;
                    }
                }
            }
            for (let j = 0; j < this.N; j++) {
                resultN.elements[i][j] = tempList.elements[j][0];
            }
        }
//==================================项目推荐==========================================================
//         var resultN = new Array(numOfUser);
//         for (let i = 0; i < numOfUser; i++) {
//             resultN[i] = new Array();
//             for (let k = 0; k < resultOfItem.elements[i].length; k++) {
//                 if (resultOfItem.elements[i][k] != 0) {
//                     resultN[i][k] = 0;
//                 } else {
//                     break;
//                 }
//             }
//         }
//         for (let i = 0; i < numOfUser; i++) {
//             for (let j = 0; j < resultN[i].length; j++) {
//                 resultN[i][j] = resultOfItem.elements[i][j];
//             }
//         }
//======================================================================================
        return resultN;
    }

    //相似度计算方法
    private sim(Ij, Ik) {                               //时间：O(1)  空间:O(1)
        var sum = 0;               //分子
        for (let i = 0; i < Ij.length; i++) {
            sum += Ij[i] * Ik[i];
        }
        var m1 = 0, m2 = 0;             //分母向量1的模和向量2的模的平方
        for (let i = 0; i < Ij.length; i++) {
            m1 += Ij[i] * Ij[i];
            m2 += Ik[i] * Ik[i];
        }
        m1 = Math.sqrt(m1);
        m2 = Math.sqrt(m2);
        if (m1 * m2 == 0) {
            var result = 0;
        }
        else {
            var result = sum / (m1 * m2);
        }
        return result
    }

    ///归一化
    private guiYi(arg) {                               //时间：O(1)  空间:O(1)
        var r = Matrix.Zero(arg.length, arg[0].length);
        for (let i = 0; i < r.elements.length; i++)     //归一化
        {
            var sum = 0;
            for (let j = 0; j < r.elements[0].length; j++) {
                sum += arg[i][j];
            }
            for (let k = 0; k < r.elements[0].length; k++) {
                if (sum == 0) {
                    r.elements[i][k] = 0;
                }
                else {
                    r.elements[i][k] = arg[i][k] / sum;
                }
            }
        }
        return r;
    }

    /*public calQuality(user_artistMatrixForTest, user_artistMatrixForTraining) {
     var precision;            ///准确率
     var recall;                 ///召回率
     var f_measure;
     var numOfRight = 0;           ///相等的个数。。
     var numOfR = 0;
     var numOfT = 0;
     var array = [];

     //===================================混合推荐======================================================
     //         for (let i = 0; i < user_artistMatrixForTest.elements.length; i++) {
     //             for (let j = 0; j < this.N; j++) {          ///用户i的推荐结果
     //                 for (let k = 0; k < user_artistMatrixForTest.elements[i].length; k++) {          ///用户i的测试结果
     //                     if ((user_artistMatrixForTest.elements[i][k] == user_artistMatrixForTraining.elements[i][j]) &&
     //                         (user_artistMatrixForTest.elements[i][j] != 0)) {   ///测试和训练有一样的推荐结果
     //                         numOfRight++;
     //                     }
     //                 }
     //             }
     //         }
     //
     //         for (let i = 0; i < user_artistMatrixForTest.elements.length; i++) {
     //             for (let j = 0; j < user_artistMatrixForTest.elements[i].length; j++) {
     //                 if (user_artistMatrixForTest.elements[i][j] != 0) {
     //                     numOfT++;
     //                 }
     //             }
     //         }
     //
     //         numOfR = this.N * user_artistMatrixForTraining.elements.length;
     //=====================================项目推荐================================================================
     for (let i = 0; i < user_artistMatrixForTest.length; i++) {
     for (let j = 0; j < this.N; j++) {          ///用户i的推荐结果
     for (let k = 0; k < user_artistMatrixForTest[i].length; k++) {          ///用户i的测试结果
     if ((user_artistMatrixForTest[i][k] == user_artistMatrixForTraining[i][j]) &&
     (user_artistMatrixForTest[i][j] != 0)) {   ///测试和训练有一样的推荐结果
     numOfRight++;
     }
     }
     }
     }

     for (let i = 0; i < user_artistMatrixForTest.length; i++) {
     numOfT += user_artistMatrixForTest[i].length;
     }

     numOfR = this.N * user_artistMatrixForTraining.length;
     //====================================================================================================

     precision = numOfRight / numOfR;
     recall = numOfRight / numOfT;
     if (numOfRight == 0) {
     f_measure = 0;
     } else {
     f_measure = (2 * precision * recall) / (precision + recall);
     }
     array[0] = precision;
     array[1] = recall;
     array[2] = f_measure;
     return array;
     }*/
}

