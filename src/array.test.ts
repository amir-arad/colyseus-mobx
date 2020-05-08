import { ArraySchema, Schema, type } from '@colyseus/schema';
import { when } from 'mobx';
import test from 'tape';
import { Fixture } from './helper.test';

export class ShallowArrayState extends Schema {
    @type(['uint8']) public numbersArray = new ArraySchema<number>();
}

test('ShallowArrayState add field', (t) => {
    t.plan(2);
    const fixture = new Fixture(ShallowArrayState);

    when(
        () => fixture.mobxState.numbersArray.length > 0 && fixture.mobxState.numbersArray[0] == 0,
        () => t.pass(`mobxState.numbersArray[0] == 0`)
    );
    when(
        () => fixture.mobxState.numbersArray.length > 1 && fixture.mobxState.numbersArray[1] == 1,
        () => t.pass(`mobxState.numbersArray[2] == 2`)
    );

    fixture.origin.numbersArray[0] = 0;
    fixture.updateColyseusState();
    fixture.origin.numbersArray[1] = 1;
    fixture.updateColyseusState();
});

test('ShallowArrayState change field', (t) => {
    t.plan(2);
    const fixture = new Fixture(ShallowArrayState);

    when(
        () => fixture.mobxState.numbersArray.length > 0 && fixture.mobxState.numbersArray[0] == 0,
        () => t.pass(`mobxState.numbersArray[0] == 0`)
    );
    when(
        () => fixture.mobxState.numbersArray.length > 0 && fixture.mobxState.numbersArray[0] == 1,
        () => t.pass(`mobxState.numbersArray[0] == 1`)
    );

    fixture.origin.numbersArray[0] = 0;
    fixture.updateColyseusState();
    fixture.origin.numbersArray[0] = 1;
    fixture.updateColyseusState();
});

test('ShallowArrayState remove field', (t) => {
    t.plan(2);
    const fixture = new Fixture(ShallowArrayState);
    fixture.origin.numbersArray[0] = 0;
    fixture.origin.numbersArray[1] = 1;

    when(
        () => fixture.mobxState.numbersArray.length > 0 && fixture.mobxState.numbersArray[0] == undefined,
        () => t.pass(`mobxState.mapNumbers[0] == undefined`)
    );
    when(
        () => fixture.mobxState.numbersArray.length > 1 && fixture.mobxState.numbersArray[1] == undefined,
        () => t.pass(`mobxState.mapNumbers[1] == undefined`)
    );

    fixture.origin.numbersArray.unshift();
    fixture.updateColyseusState();
    fixture.origin.numbersArray.unshift();
    fixture.updateColyseusState();
});
