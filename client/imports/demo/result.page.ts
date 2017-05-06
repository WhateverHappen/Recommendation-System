import {Component, Input, OnInit} from "@angular/core";
import template from "./result.page.html";
import {MeteorObservable} from "meteor-rxjs";

@Component({
    selector:"eqmen-result-page",
    template:template
})
export class ResultPage implements OnInit{

    result;
    private _user;

    @Input()
    get user(){
        return this._user;
    }
    set user(newUser){
        this._user = newUser;
        newUser && newUser._id && this.excuteAnalysis(newUser._id);
    }

    constructor(){}

    ngOnInit(){

    }

    excuteAnalysis(userId){
        MeteorObservable.call("analysis1",userId).subscribe((response)=> {
            console.log("Call method success,response: ", response);
            this.result = response;
        }, (error)=> {
            console.log(error);
        })
    }
}