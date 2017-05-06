import {Component, OnInit} from "@angular/core";
import template from "./demo.component.html";
import {MeteorObservable} from "meteor-rxjs";

@Component({
    selector: "demo",
    template: template
})
export class DemoComponent implements OnInit {
    result: any;

    constructor() {
    }

    ngOnInit() {
    }

    excuteAnylysis1() {
        console.log("hello");
        MeteorObservable.call("analysis1").subscribe((response)=> {
            console.log("Call method success,response: ", response);
            this.result = response;
        }, (error)=> {
            console.log(error);
        })
    }
}
