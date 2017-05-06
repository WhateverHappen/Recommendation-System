/**
 * Created by 嘲讽脸 on 2017/3/21.
 */

import {DataServiceForIP} from "./DataServiceForIP";
import {Matrix} from "sylvester";
import {Vector} from "sylvester";

export class DataAnalysis {
    private N = 14;         ///推荐个数
    ///
    constructor() {

    }

    public recommendIpForUser(userId: String){
        var data = new DataServiceForIP(userId);
        var result = this.recommendIp(data.user_tagMatrix, data.tag_ipMatrix, data.ipArray);
        console.log("result:", result);
        return result;
    }

    ///推荐ip
    public recommendIp(user_tagMatrix, tag_ipMatrix, ipArray) {
        var user_tag = user_tagMatrix.minor(2,2,1,user_tagMatrix.elements[0].length-1);     ///去掉用户和标签的名称
        var numOfTag = user_tag.elements[0].length;        //标签数
        var numOfUser = user_tag.elements.length;      //用户数

        var Nut = Vector.Zero(numOfUser);         //用户u使用的标签数
        for (var i = 0; i < numOfUser; i++) {       //初始化Nut矩阵
            for (var j = 0; j < numOfTag; j++) {                               //时间：O(1)  空间:O(0)
                Nut.elements[i] += user_tag.elements[i][j];
            }
        }

        var Ft = Matrix.Zero(numOfUser, numOfTag);         //该二维数组表示用户使用标签的频度
        ///将Nut求逆矩阵后与user_tag相乘得出Ft
        var tempNut = 1 / Nut.elements[0];
        Ft = user_tag.multiply(tempNut);
//-----------------------------------------------------------------------------//
        var tag_ip = tag_ipMatrix.minor(2,2,tag_ipMatrix.elements.length-1,tag_ipMatrix.elements[0].length-1);
        var numOfIP = tag_ip.elements[0].length;       //IP数

        var Itji = Vector.Zero(numOfTag);       //被标签tj标记的IP数（单纯统计个数）
        for (var i = 0; i < numOfTag; i++) {                               //时间：O(1)  空间:O(0)
            for (var j = 0; j < numOfIP; j++) {
                if (tag_ip.elements[i][j] != 0){
                    Itji.elements[i]++;
                }
            }
        }

        var Iit = Vector.Zero(numOfTag);            //各标签标记的IP个数（一个IP多次标记同样计算在内）
        for (var i = 0; i < numOfTag; i++) {       //初始化Iit
            for (var j = 0; j < numOfIP; j++) {                               //时间：O(1)  空间:O(0)
                Iit.elements[i] += tag_ip.elements[i][j];
            }
        }

        var If = Matrix.Zero(numOfTag, numOfIP);       //标签tj标记该资源的频率
        for (var i = 0; i < numOfTag; i++) {                               //时间：O(1)  空间:O(0)
            for (var j = 0; j < numOfIP; j++) {
                if (Iit.elements[i] == 0) {
                    If.elements[i][j] = 0;
                }
                else {
                    If.elements[i][j] = tag_ip.elements[i][j] / Iit.elements[i];
                }
            }
        }

        var Ii =Vector.Zero(numOfTag);     //对于所有IP,标签tj的重要度
        for (var i = 0; i < numOfTag; i++) {                               //时间：O(1)  空间:O(0)
            if (Itji.elements[i] == 0) {
                Ii.elements[0][i] = 0;
            }
            else {
                Ii.elements[i] = Math.log(numOfIP / Itji.elements[i]) / Math.log(10);
            }
        }

        var Pit = Matrix.Zero(numOfTag, numOfIP);      //各标签对IP的重要程度
        for (var i = 0; i < numOfTag; i++) {                               //时间：O(1)  空间:O(0)
            for (var j = 0; j < numOfIP; j++) {
                Pit.elements[i][j] = If.elements[i][j] * Ii.elements[i]
            }
        }
//-----------------------------------------------------------------------------//
//Put.elements--用户_标签         Pit.elements--标签_IP
        var Pujik = Matrix.Zero(numOfUser, numOfIP);       //Pujik表示用户对标签的喜爱程度
        Pujik = Ft.multiply(Pit);
//-----------------------------------------------------------------------------//
        var ip_tag = tag_ip.transpose();//转置tag_ip矩阵

        ///计算ip的相似度矩阵
        var SimMat = Matrix.Zero(numOfIP, numOfIP);        //IP的相似度矩阵
        for (var i = 0; i < numOfIP; i++) {                    //求每个IP之间的相似度 时间：O(1)  空间:O(0)
            for (var j = 0; j < numOfIP; j++) {
                SimMat.elements[i][j] = this.sim(ip_tag.elements[i], ip_tag.elements[j]).toFixed(15);
            }
        }
//-----------------------------------------------------------------------------//
        var PPuij = Matrix.Zero(numOfUser, numOfIP);        //用户对每个IP的预测偏好值
        PPuij = Pujik.multiply(SimMat);

        PPuij = this.guiYi(PPuij.elements);                           //归一化

        for (var i = 0; i < numOfUser; i++) { //对预测偏好进行排序
            var sort = Matrix.Zero(numOfIP, 2);   //排序矩阵赋0        //[i][0] 存值 [i][1]存位置
            var result = Matrix.Zero(numOfUser, numOfIP);     //结果赋0
            var temp = new Array(1); //交换临时值
            temp[0] = new Array(1);
            temp[0][0] = 0;

            for (var i = 0; i < PPuij.elements.length; i++) {                //实现部分 时间：O(1)  空间:O(n) n等于IP数
                for (var j = 0; j < PPuij.elements[i].length; j++) {
                    temp[0][0] = PPuij.elements[i][j];
                    if (temp[0][0] >= sort.elements[numOfIP - 1][0]) {
                        sort.elements[numOfIP - 1][0] = temp[0][0];
                        sort.elements[numOfIP - 1][1] = j;
                        for (var k = 1; k < numOfIP; k++) {
                            var tempMatrix = Matrix.Zero(1,2);
                            if (sort.elements[numOfIP - k][0] >= sort.elements[numOfIP - k - 1][0]) {
                                tempMatrix.elements[0]=sort.elements[numOfIP - k-1];
                                sort.elements[numOfIP - k - 1] = sort.elements[numOfIP - k];
                                sort.elements[numOfIP - k] = tempMatrix.elements[0];
                            }
                        }
                    }
                }
                for (var s = 0; s < numOfIP; s++) {
                    if (sort.elements[s][0] != 0) {       //jia
                        result.elements[i][s] = sort.elements[s][1];
                    }
                }
                for (var a = 0; a < numOfIP; a++) {
                    for (var b = 0; b < 2; b++) {
                        sort.elements[a][b] = 0;
                    }
                }
            }

            var resultN = Matrix.Zero(numOfUser, this.N);        //返回前N个推荐结果 时间：O(1)  空间:O(0)
            for (var i = 0; i < numOfUser; i++) {
                for (var j = 0; j < this.N; j++) {
                    resultN.elements[i][j] = ipArray[result.elements[i][j]].name;
                }
            }
        }
        return resultN;
    }

    //相似度计算方法
    private sim(Ij, Ik) {                               //时间：O(1)  空间:O(1)
        var sum = 0;               //分子
        for (var i = 0; i < Ij.length; i++) {
            sum += Ij[i] * Ik[i];
        }
        var m1 = 0, m2 = 0;             //分母向量1的模和向量2的模的平方
        for (var i = 0; i < Ij.length; i++) {
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
        for (var i = 0; i < r.elements.length; i++)     //归一化
        {
            var sum = 0;
            for (var j = 0; j < r.elements[0].length; j++) {
                sum += arg[i][j];
            }
            for (var k = 0; k < r.elements[0].length; k++) {
                r.elements[i][k] = arg[i][k] / sum;
            }
        }
        return r;
    }
}