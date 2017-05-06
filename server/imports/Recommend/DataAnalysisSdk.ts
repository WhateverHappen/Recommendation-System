import {DataAnalysis} from "./DataAnalysis";
import {Matrix} from "sylvester";
import {TestOfItem} from "../DataAnalysisSdk/TestOfItem";
import {TT}from "../DataAnalysisSdk/TT";

export class DataAnalysisSdk {

    static analysis1(userId) {

        // let data = new TT();

        // let data = new DataServiceForIP("xJ7FpQB9gt4Kjbkys");   ///老姚
        // userId = "xJ7FpQB9gt4Kjbkys";
        let data = new DataAnalysis().recommendIpForUser(userId);

        // let data = new TestOfItem();
        // console.log(data.user_tagMatrixForTraining0);
        return data;
    }

}