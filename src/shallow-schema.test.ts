import { Schema, type } from '@colyseus/schema';
import test from 'tape';
import { Fixture } from './helper.test';

export class ShallowState extends Schema {
    @type('uint8') public counter: number | undefined;
}

test('ShallowState add field', (t) => {
    t.plan(1);
    const fixture = new Fixture(ShallowState);

    fixture.origin.counter = 1;
    fixture.updateAndAssert(t);
});

test('ShallowState change field', (t) => {
    t.plan(2);
    const fixture = new Fixture(ShallowState);

    fixture.origin.counter = 1;
    fixture.updateAndAssert(t);
    fixture.origin.counter = 2;
    fixture.updateAndAssert(t);
});

// colyseus does not trigger event on delete
test.skip('ShallowState delete field', (t) => {
    t.plan(2);
    const fixture = new Fixture(ShallowState);

    fixture.origin.counter = 1;
    fixture.updateAndAssert(t);

    delete fixture.origin.counter;
    fixture.updateAndAssert(t);
});
