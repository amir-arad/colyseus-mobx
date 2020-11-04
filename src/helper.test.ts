import { Schema } from '@colyseus/schema';
import { getMobxView } from '.';
import { Test } from 'tape';
import { json } from 'json-mobx';

/**
 * manage the state we need for a simple test
 * simulate the wiring that colyseus is suppoed to do in a real environment
 */
export class Fixture<T> {
    /**
     * represents the state of the server room
     */
    origin: T & Schema;
    /**
     * represents the colyseus state of the client
     */
    private state: T & Schema;
    /**
     * the mobx state of the client (result of getMobxView())
     */
    mobxState: T;

    constructor(constructor: new () => T & Schema) {
        this.origin = new constructor();
        this.state = new constructor();
        this.state.decode(this.origin.encodeAll());
        this.mobxState = getMobxView(this.state);
    }

    /**
     * update the client after changes are made to the server state
     */
    updateColyseusState() {
        this.state.decode(this.origin.encode()); // move changes from origin to state
    }

    /**
     * update the client and assert that mobx state changed accordingly
     */
    updateAndAssert(t: Test) {
        this.updateColyseusState();
        const mobxJson = JSON.parse(JSON.stringify(json.save(this.mobxState)));
        const originJson = this.origin.toJSON();
        t.deepLooseEqual(mobxJson, originJson); // assert that state and mobx are the same
    }
}
