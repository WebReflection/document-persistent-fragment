import poly from './poly.js';

const {freeze, setPrototypeOf} = Object;
const childNodes = new WeakMap;
const getText = node => node.textContent;
const isElement = node => node instanceof Element;
const isLive = node => node.isConnected;
const isVisible = node => {
  switch (node.nodeType) {
    case Node.ELEMENT_NODE:
    case Node.TEXT_NODE:
    case Node.DOCUMENT_FRAGMENT_NODE:
    case Node.DOCUMENT_PERSISTENT_FRAGMENT_NODE:
      return true;
  }
  return false;
};

class Bug extends DocumentFragment {}
const shenanigans = !(new Bug instanceof Bug);

export default class DocumentPersistentFragment extends DocumentFragment {

  // DocumentFragment overrides
  constructor() {
    super();
    childNodes.set(this, []);
    if (shenanigans)
      return setPrototypeOf(this, DocumentPersistentFragment.prototype);
  }
  get children() {
    return childNodes.get(this).filter(isElement);
  }
  get firstElementChild() {
    const {children} = this;
    const {length} = children;
    return length < 1 ? null : children[0];
  }
  get lastElementChild() {
    const {children} = this;
    const {length} = children;
    return length < 1 ? null : children[length - 1];
  }
  get childElementCount() {
    return this.children.length;
  }
  prepend(...nodes) {
    nodes.forEach(removeChild, this);
    childNodes.get(this).unshift(...nodes);
    return super.prepend(...nodes);
  }
  append(...nodes) {
    nodes.forEach(appendChild, this);
    return super.append(...nodes);
  }
  getElementById(id) {
    return this.querySelector(`#${id}`);
  }
  querySelector(css) {
    return this.isConnected ?
      this.parentNode.querySelector(css) :
      super.querySelector(css);
  }
  querySelectorAll(css) {
    return this.isConnected ?
      this.parentNode.querySelectorAll(css) :
      super.querySelectorAll(css);
  }

  // Node overrides
  get nodeType() {
    return Node.DOCUMENT_PERSISTENT_FRAGMENT_NODE;
  }
  get nodeName() {
    return "#document-persistent-fragment";
  }
  get isConnected() {
    return childNodes.get(this).some(isLive);
  }
  get parentNode() {
    const node = childNodes.get(this).find(isLive);
    return node.parentNode;
  }
  get parentElement() {
    return this.parentNode;
  }
  get childNodes() {
    return freeze(childNodes.get(this).slice(0));
  }
  get firstChild() {
    const nodes = childNodes.get(this);
    const {length} = nodes;
    return length < 1 ? null : nodes[0];
  }
  get lastChild() {
    const nodes = childNodes.get(this);
    const {length} = nodes;
    return length < 1 ? null : nodes[length - 1];
  }
  get previousSibling() {
    const {firstChild} = this;
    return firstChild && firstChild.previousSibling;
  }
  get nextSibling() {
    const {lastChild} = this;
    return lastChild && lastChild.nextSibling;
  }
  get textContent() {
    return childNodes.get(this).filter(isVisible).map(getText).join('');
  }
  hasChildNodes() {
    return 0 < childNodes.get(this).length;
  }
  cloneNode(...args) {
    const pf = new DocumentPersistentFragment;
    pf.append(...childNodes.get(this).map(getClone, args));
    return pf;
  }
  compareDocumentPosition(node) {
    const {firstChild} = this;
    return firstChild ?
            firstChild.compareDocumentPosition(node) :
            super.compareDocumentPosition(node);
  }
  contains(node) {
    return childNodes.get(this).includes(node);
  }
  insertBefore(before, node) {
    const nodes = childNodes.get(this);
    const i = nodes.indexOf(node);
    if (-1 < i)
      nodes.splice(i, 0, before);
    return super.insertBefore(before, node);
  }
  appendChild(node) {
    if (this.isConnected)
      this.parentNode.insertBefore(node, this.nextSibling);
    else
      super.appendChild(node);
    appendChild.call(this, node);
    return node;
  }
  replaceChild(replace, node) {
    const nodes = childNodes.get(this);
    const i = nodes.indexOf(node);
    if (-1 < i)
      nodes[i] = replace;
    return this.isConnected ?
      this.parentNode.replaceChild(replace, node) :
      super.replaceChild(replace, node);
  }
  removeChild(node) {
    removeChild.call(this, node);
    return this.isConnected ?
      this.parentNode.removeChild(node) :
      super.removeChild(node);
  }
  remove() {
    this.append(...childNodes.get(this));
  }
  valueOf() {
    this.remove();
    return this;
  }
}

if (poly)
  window.DocumentPersistentFragment = DocumentPersistentFragment;

function getClone(node) {
  return node.cloneNode(...this);
}

function appendChild(node) {
  removeChild.call(this, node);
  childNodes.get(this).push(node);
}

function removeChild(node) {
  const nodes = childNodes.get(this);
  const i = nodes.indexOf(node);
  if (-1 < i)
    nodes.splice(i, 1);
}
