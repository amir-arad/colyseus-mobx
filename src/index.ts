import { ArraySchema, MapSchema, Schema } from '@colyseus/schema';
import { observable, runInAction } from 'mobx';

function setValue<T, K extends keyof T>(getValue: () => T[K], shadowState: T, field: K) {
    const value = getValue();
    if (value instanceof Schema) {
        if (!shadowState[field]) {
            runInAction(() => {
                shadowState[field] = { ...value };
            });
            wireSchemaChanges(getValue as () => T[K] & Schema, shadowState[field]);
        }
    } else if (value instanceof ArraySchema) {
        if (!shadowState[field]) {
            runInAction(() => {
                shadowState[field] = ([...value] as unknown) as T[K];
            });
            wireArrayChanges(getValue as () => T[K] & ArraySchema, shadowState[field] as T[K] & Array<unknown>);
        }
        value.triggerAll(); // Do not miss the first element.
    } else if (value instanceof MapSchema) {
        if (!shadowState[field]) {
            runInAction(() => {
                shadowState[field] = { ...value };
            });
            wireMapChanges(getValue as () => T[K] & MapSchema, shadowState[field]);
        }
        value.triggerAll(); // Do not miss the first element.
    } else {
        //primitive value
        runInAction(() => {
            shadowState[field] = value;
        });
    }
}

function wireArrayChanges<T extends Array<unknown>>(getColyseusState: () => ArraySchema & T, shadowState: T) {
    const colyseusState = getColyseusState();
    colyseusState.onAdd = (_, k) => {
        setValue(() => getColyseusState()[k], shadowState, k);
    };
    colyseusState.onChange = (_, k) => {
        // maybe not an actual change in direct value? need to test with Schema value
        setValue(() => getColyseusState()[k], shadowState, k);
    };
    colyseusState.onRemove = (_, k) => {
        shadowState.splice(k, 1);
    };
}

function wireMapChanges<T>(getColyseusState: () => MapSchema & T, shadowState: T) {
    const colyseusState = getColyseusState();
    colyseusState.onAdd = (_, k) => {
        const key = k as keyof T;
        setValue(() => getColyseusState()[key], shadowState, key);
    };
    colyseusState.onChange = (_, k) => {
        // maybe not an actual change in direct value? need to test with Schema value
        const key = k as keyof T;
        setValue(() => getColyseusState()[key], shadowState, key);
    };
    colyseusState.onRemove = (_, k) => {
        const key = k as keyof T;
        delete shadowState[key];
    };
}

const schemaKeys: string[] = Object.keys(new (class extends Schema {})()).concat(['onChange']); // keys that exist on any schema object - are not data fields

function wireSchemaChanges<T>(getColyseusState: () => Schema & T, shadowState: T) {
    const colyseusState = getColyseusState();
    colyseusState.onChange = (changes) => {
        for (const change of changes) {
            const field = change.field as keyof T;
            if (field in getColyseusState()) {
                setValue(() => getColyseusState()[field], shadowState, field);
            } else {
                delete shadowState[field];
            }
        }
    };
    // colyseusState.triggerAll();
    for (const f in colyseusState) {
        if (!schemaKeys.includes(f) && Object.prototype.hasOwnProperty.call(colyseusState, f)) {
            const field = f as keyof T;
            setValue(() => getColyseusState()[field], shadowState, field);
        }
    }
}

/**
 * provide a mobx object that reflects the state of the game, and gets updated whenever colyseus updates.
 * Notice: this method registers callbacks to the colyseus state. if they are replaced, the mobx state may stop updating.
 * Changes to the mobx state will not be reflected in the game state
 * @param colyseusState the colyseus game state
 */
export function getMobxView<T>(colyseusState: Schema & T): T {
    const mobxState = observable({} as T);
    wireSchemaChanges(() => colyseusState, mobxState);
    return mobxState;
}
