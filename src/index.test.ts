import tape from 'tape';
import { hello } from './index';

tape('happy flow', (t) => {
    t.plan(1);
    t.deepEqual(hello('world'), { message: 'hello world' });
});
