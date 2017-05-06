import {DataAnalysisSdk} from "../Recommend/DataAnalysisSdk";
Meteor.methods({
    analysis1: function (userId) {
        return DataAnalysisSdk.analysis1(userId);
    },
    analysis2: function () {
        console.log("Call method success,response ");
        return "server response";
    }
});