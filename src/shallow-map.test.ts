import { MapSchema, Schema, type } from '@colyseus/schema';
import test from 'tape';
import { Fixture } from './helper.test';

export class ShallowMapState extends Schema {
    @type({ map: 'uint8' }) public mapNumbers = new MapSchema<number>();
}

test('ShallowMapState add field', (t) => {
    t.plan(2);
    const fixture = new Fixture(ShallowMapState);

    fixture.origin.mapNumbers['1'] = 1;
    fixture.updateAndAssert(t);

    fixture.origin.mapNumbers['2'] = 2;
    fixture.updateAndAssert(t);
});

test('ShallowMapState change field', (t) => {
    t.plan(2);
    const fixture = new Fixture(ShallowMapState);

    fixture.origin.mapNumbers['1'] = 1;
    fixture.updateAndAssert(t);

    fixture.origin.mapNumbers['1'] = 2;
    fixture.updateAndAssert(t);
});

test('ShallowMapState remove field', (t) => {
    t.plan(2);
    const fixture = new Fixture(ShallowMapState);
    fixture.origin.mapNumbers['1'] = 1;
    fixture.origin.mapNumbers['2'] = 2;

    delete fixture.origin.mapNumbers['1'];
    fixture.updateAndAssert(t);

    delete fixture.origin.mapNumbers['2'];
    fixture.updateAndAssert(t);
});
