import { Schema, type } from '@colyseus/schema';
import test from 'tape';
import { Fixture } from './helper.test';

export class DeepState extends Schema {
    @type('uint8') public counter: number | undefined;
    @type(DeepState) public child: DeepState | undefined;
}

test('DeepState add field', (t) => {
    t.plan(2);
    const fixture = new Fixture(DeepState);

    fixture.origin.child = new DeepState();
    fixture.updateAndAssert(t);

    fixture.origin.child.child = new DeepState();
    fixture.updateAndAssert(t);
});

test('DeepState change field deep', (t) => {
    t.plan(2);
    const fixture = new Fixture(DeepState);

    fixture.origin.child = new DeepState();
    fixture.updateColyseusState();
    fixture.origin.child.counter = 1;
    fixture.updateAndAssert(t);
    fixture.origin.child.counter = 2;
    fixture.updateAndAssert(t);
});

// colyseus trigger event with old value only
test.skip('DeepState change field with deep value', (t) => {
    t.plan(2);
    const fixture = new Fixture(DeepState);

    const child1 = new DeepState();
    child1.counter = 1;
    fixture.origin.child = child1;
    fixture.updateAndAssert(t);

    const child2 = new DeepState();
    child1.counter = 2;
    fixture.origin.child = child2;
    fixture.updateAndAssert(t);
});

// colyseus does not trigger events on delete
test.skip('DeepState delete field', (t) => {
    t.plan(3);
    const fixture = new Fixture(DeepState);

    fixture.origin.child = new DeepState();
    fixture.updateColyseusState();
    fixture.origin.child.counter = 1;
    fixture.updateAndAssert(t);

    delete fixture.origin.child.counter;
    fixture.updateAndAssert(t);

    delete fixture.origin.child;
    fixture.updateAndAssert(t);
});
