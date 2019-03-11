import poly from './poly.js';
import {asDPF} from './utils.js';

const proto = Element.prototype;
const {
  after, before,
  append, prepend,
  insertAdjacentElement, replaceWith
} = proto;

if (poly) {
  Object.assign(
    proto,
    {
      after(...nodes) {
        return after.apply(this, nodes.map(asDPF));
      },
      before(...nodes) {
        return before.apply(this, nodes.map(asDPF));
      },
      insertAdjacentElement(position, node) {
        return insertAdjacentElement.call(this, position, asDPF(node));
      },
      append(...nodes) {
        return append.apply(this, nodes.map(asDPF));
      },
      prepend(...nodes) {
        return prepend.apply(this, nodes.map(asDPF));
      },
      replaceWith(node) {
        return replaceWith.call(this, asDPF(node));
      }
    }
  );
}
