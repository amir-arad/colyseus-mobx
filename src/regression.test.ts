import { ArraySchema, Schema, type } from '@colyseus/schema';
import test from 'tape';
import { Fixture } from './helper.test';

export class MatchSchema extends Schema {
    @type('string')
    public name!: string;
    @type(['string']) public userIds!: ArraySchema<string>;
}

test('MatchSchema use case 1', (t) => {
    t.plan(1);
    const fixture = new Fixture(MatchSchema);

    fixture.origin.name = 'The Grand Match';
    fixture.origin.userIds = new ArraySchema<string>();
    fixture.origin.userIds.push('qVJyU04gh');
    fixture.updateAndAssert(t);
});
