import { ArraySchema, MapSchema, Schema } from '@colyseus/schema';
import { observable, runInAction } from 'mobx';

// function setValue<T, K extends keyof T>(getValue: () => T[K], shadowState: T, field: K) {
//     const value = getValue();
//     if (value instanceof Schema) {
//         // TODO make more robust guard
//         if (!shadowState[field]) {
//             runInAction(() => {
//                 shadowState[field] = { ...value };
//             });
//             wireSchemaChanges(getValue as any, shadowState[field]);
//         }
//     } else if (value instanceof MapSchema || value instanceof ArraySchema) {
//         if (!shadowState[field]) {
//             runInAction(() => {
//                 if (value instanceof ArraySchema) {
//                     shadowState[field] = [...value] as any; // TODO Type
//                 } else {
//                     shadowState[field] = { ...value };
//                 }
//             });
//             wireCollectionChanges(getValue as any, shadowState[field]);
//         }
//         value.triggerAll(); // Do not miss the first element.
//         // TODO Test having Schema/ArraySchema/MapSchema within ArraySchema and MapSchema.
//     } else {
//         // Set a primitive value.
//         runInAction(() => {
//             shadowState[field] = value;
//         });
//     }
// }

// function wireCollectionChanges<T>(getColyseusState: () => (MapSchema | ArraySchema) & T, shadowState: T) {
//     const colyseusState = getColyseusState();
//     colyseusState.onAdd = (_: any, k: string | number) => {
//         const key = k as keyof T;
//         setValue(() => getColyseusState()[key], shadowState, key);
//     };
//     colyseusState.onChange = (_: any, k: string | number) => {
//         // TODO maybe not an actual change in direct value? need to test with Schema value
//         const key = k as keyof T;
//         setValue(() => getColyseusState()[key], shadowState, key);
//     };
//     colyseusState.onRemove = (_: any, k: string | number) => {
//         const key = k as keyof T;
//         if (colyseusState instanceof ArraySchema) {
//             // TODO Fix type to allow ArraySchema.splice().
//             // @ts-ignore: Property 'splice' does not exist on type 'T'.ts(2339)
//             shadowState.splice(key, 1);
//         } else {
//             delete shadowState[key];
//         }
//     };
// }

// function wireSchemaChanges<T>(getColyseusState: () => Schema & T, shadowState: T) {
//     const colyseusState = getColyseusState();
//     colyseusState.onChange = (changes) => {
//         for (const change of changes) {
//             const field = change.field as keyof T;
//             if (getColyseusState()[field] === undefined) {
//                 delete shadowState[field];
//             } else {
//                 setValue(() => getColyseusState()[field], shadowState, field);
//             }
//         }
//     };
//     colyseusState.triggerAll();
// }

function setValue<T, K extends keyof T>(getValue: () => T[K], shadowState: T, field: K) {
    const value = getValue();
    if (value instanceof Schema) {
        // TODO make more robust guard
        if (!shadowState[field]) {
            runInAction(() => {
                shadowState[field] = { ...value };
            });
            wireSchemaChanges(getValue as () => T[K] & Schema, shadowState[field]);
        }
    } else if (value instanceof ArraySchema) {
        // TODO The onAdd and onRemove functions are the same as for MapSchema
        //  but shadowState[field] must be [].
        // TODO Test having Schema/ArraySchema/MapSchema within ArraySchema.
    } else if (value instanceof MapSchema) {
        if (!shadowState[field]) {
            runInAction(() => {
                shadowState[field] = { ...value };
            });
            wireMapChanges(getValue as () => T[K] & MapSchema, shadowState[field]);
        }
        value.triggerAll(); // Do not miss the first element.
        // TODO Test having Schema/ArraySchema/MapSchema within MapSchema.
    } else {
        //primitive value
        runInAction(() => {
            shadowState[field] = value;
        });
    }
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

function wireSchemaChanges<T>(getColyseusState: () => Schema & T, shadowState: T) {
    const colyseusState = getColyseusState();
    colyseusState.onChange = (changes) => {
        for (const change of changes) {
            const field = change.field as keyof T;
            if (getColyseusState()[field] === undefined) {
                delete shadowState[field];
            } else {
                setValue(() => getColyseusState()[field], shadowState, field);
            }
        }
    };
    colyseusState.triggerAll();
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
