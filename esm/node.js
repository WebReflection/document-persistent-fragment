import poly from './poly.js';
import {asDPF, isDPF} from './utils.js';

const proto = Node.prototype;
const {
  appendChild, removeChild,
  insertBefore, replaceChild
} = proto;

if (poly) {
  Node.DOCUMENT_PERSISTENT_FRAGMENT_NODE = 18;
  Object.assign(
    proto,
    {
      appendChild(node) {
        return appendChild.call(this, asDPF(node));
      },
      removeChild(node) {
        if (isDPF(node) && node.parentNode === this) {
          node.remove();
        } else {
          removeChild.call(this, node);
        }
        return node;
      },
      insertBefore(before, node) {
        return insertBefore.call(this, asDPF(before), node);
      },
      replaceChild(replace, node) {
        return replaceChild.call(this, asDPF(replace), node);
      }
    }
  );
}
