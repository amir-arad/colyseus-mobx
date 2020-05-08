import { Schema, type } from '@colyseus/schema';
import { when } from 'mobx';
import test from 'tape';
import { Fixture } from './helper.test';

export class ShallowState extends Schema {
    @type('uint8') public counter: number | undefined;
}

test('ShallowState add field', (t) => {
    t.plan(1);
    const fixture = new Fixture(ShallowState);

    when(
        () => fixture.mobxState.counter == 1,
        () => t.pass('mobxState.counter == 1')
    );

    fixture.origin.counter = 1;
    fixture.updateColyseusState();
});

test('ShallowState change field', (t) => {
    t.plan(2);
    const fixture = new Fixture(ShallowState);

    when(
        () => fixture.mobxState.counter == 1,
        () => t.pass('mobxState.counter == 1')
    );
    when(
        () => fixture.mobxState.counter == 2,
        () => t.pass('mobxState.counter == 2')
    );

    fixture.origin.counter = 1;
    fixture.updateColyseusState();
    fixture.origin.counter = 2;
    fixture.updateColyseusState();
});

test('ShallowState delete field', (t) => {
    t.plan(2);
    const fixture = new Fixture(ShallowState);

    when(
        () => fixture.mobxState.counter == 1,
        () => t.pass('mobxState.counter == 1')
    );
    when(
        () => fixture.mobxState.counter == undefined,
        () => t.pass('mobxState.counter == undefined')
    );

    fixture.origin.counter = 1;
    fixture.updateColyseusState();
    delete fixture.origin.counter;
    fixture.updateColyseusState();
});
