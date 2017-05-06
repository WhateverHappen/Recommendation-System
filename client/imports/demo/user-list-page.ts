import {Component, OnInit} from "@angular/core";
import template from "./user-list.page.html";
import {MeteorObservable} from "meteor-rxjs";
import {UserCollection} from "../../../both/collections/demo.collection";

@Component({
    selector:"eqmen-user-list-page",
    template: template
})
export class UserListPage implements OnInit{

    users;
    selectUser;

    constructor(){}

    ngOnInit(){
        MeteorObservable.subscribe("users").subscribe(()=>{
            console.log("fetch user data sucess");
            this.users = UserCollection.find().fetch();
            this.users && this.users[0] &&　(this.selectUser=this.users[0]);
        });
    }

    viewAnalysisResult(user){
        user &&　(this.selectUser = user);
    }
}