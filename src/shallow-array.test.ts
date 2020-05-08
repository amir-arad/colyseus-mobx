import { ArraySchema, Schema, type } from '@colyseus/schema';
import test from 'tape';
import { Fixture } from './helper.test';

export class ShallowArrayState extends Schema {
    @type(['uint8']) public numbersArray = new ArraySchema<number>();
}

test('ShallowArrayState add field', (t) => {
    t.plan(2);
    const fixture = new Fixture(ShallowArrayState);

    fixture.origin.numbersArray[0] = 0;
    fixture.updateAndAssert(t);

    fixture.origin.numbersArray[1] = 1;
    fixture.updateAndAssert(t);
});

test('ShallowArrayState change field', (t) => {
    t.plan(2);
    const fixture = new Fixture(ShallowArrayState);

    fixture.origin.numbersArray[0] = 0;
    fixture.updateAndAssert(t);

    fixture.origin.numbersArray[0] = 1;
    fixture.updateAndAssert(t);
});

test('ShallowArrayState remove field', (t) => {
    t.plan(2);
    const fixture = new Fixture(ShallowArrayState);
    fixture.origin.numbersArray[0] = 0;
    fixture.origin.numbersArray[1] = 1;

    fixture.origin.numbersArray.unshift();
    fixture.updateAndAssert(t);

    fixture.origin.numbersArray.unshift();
    fixture.updateAndAssert(t);
});
