import { MapSchema, Schema, type } from '@colyseus/schema';
import { when } from 'mobx';
import test from 'tape';
import { Fixture } from './helper.test';

export class ShallowMapState extends Schema {
    @type({ map: 'uint8' }) public mapNumbers = new MapSchema<number>();
}

test('ShallowMapState add field', (t) => {
    t.plan(2);
    const fixture = new Fixture(ShallowMapState);

    when(
        () => fixture.mobxState.mapNumbers['1'] == 1,
        () => t.pass(`mobxState.mapNumbers['1'] == 1`)
    );
    when(
        () => fixture.mobxState.mapNumbers['2'] == 2,
        () => t.pass(`mobxState.mapNumbers['2'] == 2`)
    );

    fixture.origin.mapNumbers['1'] = 1;
    fixture.updateColyseusState();
    fixture.origin.mapNumbers['2'] = 2;
    fixture.updateColyseusState();
});

test('ShallowMapState change field', (t) => {
    t.plan(2);
    const fixture = new Fixture(ShallowMapState);

    when(
        () => fixture.mobxState.mapNumbers['1'] == 1,
        () => t.pass(`mobxState.mapNumbers['1'] == 1`)
    );
    when(
        () => fixture.mobxState.mapNumbers['1'] == 2,
        () => t.pass(`mobxState.mapNumbers['1'] == 2`)
    );

    fixture.origin.mapNumbers['1'] = 1;
    fixture.updateColyseusState();
    fixture.origin.mapNumbers['1'] = 2;
    fixture.updateColyseusState();
});

test('ShallowMapState remove field', (t) => {
    t.plan(2);
    const fixture = new Fixture(ShallowMapState);
    fixture.origin.mapNumbers['1'] = 1;
    fixture.origin.mapNumbers['2'] = 2;

    when(
        () => fixture.mobxState.mapNumbers['1'] == undefined,
        () => t.pass(`mobxState.mapNumbers['1'] == undefined`)
    );
    when(
        () => fixture.mobxState.mapNumbers['2'] == undefined,
        () => t.pass(`mobxState.mapNumbers['2'] == undefined`)
    );

    delete fixture.origin.mapNumbers['1'];
    fixture.updateColyseusState();
    delete fixture.origin.mapNumbers['2'];
    fixture.updateColyseusState();
});
