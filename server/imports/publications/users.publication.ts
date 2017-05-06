import {UserCollection} from "../../../both/collections/demo.collection";

Meteor.publish("users",function () {
    return UserCollection.find();
})