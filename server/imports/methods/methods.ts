import {DataAnalysisSdk} from "../DataAnalysisSdk/DataAnalysisSdk";
Meteor.methods({
    analysis1: function () {
        return DataAnalysisSdk.analysis1();
    },
    analysis2: function () {
        console.log("Call method success,response ");
        return "server response";
    }
});