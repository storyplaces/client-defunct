import {AbstractConnector} from "./AbstractConnector";
import {inject, NewInstance} from "aurelia-framework";
import {StoryPlacesAPI} from "./StoryplacesAPI";
import {LogEvent} from "../models/LogEvent";
import {LocalStore} from "./LocalStore";
import moment = require('moment');
/**
 * Created by andy on 09/12/16.
 */

@inject(NewInstance.of(StoryPlacesAPI), LocalStore)
export class LogEventConnector {

    private toBeSaved: Array<LogEvent>;

    constructor(private storyplacesAPI: StoryPlacesAPI, private localStore: LocalStore) {
        this.storyplacesAPI.path = "/logevent/";
        this.toBeSaved = [];
    }

    get all(): Array<LogEvent> {
        return this.toBeSaved;
    }

    save(object: LogEvent): Promise<null> {
        this.toBeSaved.push(object);
        let sequence = Promise.resolve();
        this.toBeSaved.forEach((logEvent) => {
            sequence = sequence.then(() => {
                this.storyplacesAPI.save(logEvent).then(response => {
                    this.removeFromToBeSaved(logEvent);
                });
            });
        });
        return sequence;
    }

    removeFromToBeSaved(object: LogEvent) {
        this.toBeSaved = this.toBeSaved.filter(logEvent => logEvent !== object);
    }

}