import DocumentPersistentFragment from './esm/index.js';

const dpf = new DocumentPersistentFragment;

addEventListener(
  'load',
  function () {
    // for live debugging purpose
    this.dpf = dpf;

    const id = 'test-id';
    const nodes = [
      document.createElement('p'),
      document.createTextNode(''),
      document.createElement('p'),
      document.createElement('div'),
      document.createElement('p')
    ];
    nodes.forEach((p, i) => p.textContent = (i + 1));
    nodes[2].id = id;

    const previous = document.createTextNode('P');
    const next = document.createTextNode('N');
    document.body.appendChild(previous);

    console.assert(dpf.nodeName === '#document-persistent-fragment', 'correct name');
    console.assert(dpf.nodeType === Node.DOCUMENT_PERSISTENT_FRAGMENT_NODE, 'correct type');
    console.assert(dpf.firstElementChild === null, 'no firstElementChild by default');
    console.assert(dpf.lastElementChild === null, 'no lastElementChild by default');
    console.assert(dpf.childElementCount === 0, 'childElementCount is 0 by default');
    console.assert(dpf.children.length === 0, 'no children by default');
    console.assert(dpf.childNodes.length === 0, 'no childNodes by default');
    console.assert(dpf.firstChild === null, 'no firstChild by default');
    console.assert(dpf.lastChild === null, 'no lastChild by default');
    console.assert(dpf.hasChildNodes() === false, 'no childNodes by default');
    console.assert(dpf.compareDocumentPosition(previous) === 37, 'correct compareDocumentPosition');
    console.assert(dpf.contains(nodes[0]) === false, 'no nodes contained');
    dpf.append(nodes[0]);
    console.assert(dpf.contains(nodes[0]) === true, 'some nodes contained');
    console.assert(dpf.hasChildNodes() === true, 'it has childNodes');
    console.assert(dpf.firstElementChild === nodes[0], 'nodes[0] as firstElementChild');
    console.assert(dpf.lastElementChild === nodes[0], 'nodes[0] as lastElementChild');
    console.assert(dpf.childElementCount === 1, '1 childElementCount');
    console.assert(dpf.children.length === 1, '1 children.length');
    console.assert(dpf.children.length === 1, '1 childNodes.length');
    console.assert(dpf.firstChild === dpf.lastChild, 'firstChild same as lastChild with 1 node');
    dpf.prepend(nodes[1]);
    console.assert(dpf.firstElementChild === nodes[0], 'nodes[0] still as firstElementChild');
    console.assert(dpf.lastElementChild === nodes[0], 'nodes[0] still as lastElementChild');
    console.assert(dpf.childElementCount === 1, '1 still as childElementCount');
    console.assert(dpf.childNodes.length === 2, '2 childNodes.length');
    console.assert(dpf.childNodes[0] === nodes[1], 'nodes[1] as childNodes[0]');
    console.assert(dpf.childNodes[0] === dpf.firstChild, 'nodes[1] as firstChild');
    console.assert(dpf.children[0] === dpf.lastChild, 'nodes[0] as lastChild');
    dpf.append(nodes[1]);
    console.assert(dpf.childNodes[0] === nodes[0], 'nodes[0] as childNodes[0]');
    console.assert(dpf.childNodes[1] === nodes[1], 'nodes[1] as childNodes[1]');
    console.assert(dpf.childNodes.length === 2, '2 still as childNodes.length');
    dpf.append(...nodes);
    console.assert(dpf.childElementCount === 4, '4 childElementCount');
    console.assert(dpf.childNodes.length === 5, '5 childNodes.length');
    console.assert(dpf.getElementById(id) === nodes[2], 'getElementById is OK');
    console.assert(dpf.getElementById('nope') === null, 'getElementById returns null if not found');
    console.assert(dpf.querySelector(`#${id}`) === nodes[2], 'querySelector is OK');
    console.assert(dpf.querySelectorAll(`p`).length === 3, 'querySelectorAll returns 3 <p>');
    console.assert(dpf.isConnected === false, 'not connected');
    console.assert(dpf.previousSibling === null, 'no previousSibling');
    console.assert(dpf.nextSibling === null, 'no nextSibling');
    // LIVE
    console.assert(document.body.appendChild(dpf) === dpf, 'Element can append a DPF');
    console.assert(dpf.isConnected === true, 'connected');
    console.assert(dpf.childElementCount === 4, '4 childElementCount');
    console.assert(dpf.childNodes.length === 5, '5 childNodes.length');
    console.assert(dpf.getElementById(id) === nodes[2], 'getElementById is OK');
    console.assert(dpf.getElementById('nope') === null, 'getElementById returns null if not found');
    console.assert(dpf.querySelector(`#${id}`) === nodes[2], 'querySelector is OK');
    console.assert(dpf.querySelectorAll(`p`).length === 3, 'querySelectorAll returns 3 <p>');
    console.assert(dpf.parentElement === document.body, 'correct parentElement/Node');
    console.assert(dpf.previousSibling === previous, 'correct previousSibling');
    document.body.appendChild(next);
    console.assert(dpf.compareDocumentPosition(previous) === 2, 'correct previous compareDocumentPosition');
    console.assert(dpf.compareDocumentPosition(next) === 4, 'correct next compareDocumentPosition');
    console.assert(dpf.nextSibling === next, 'correct nextSibling');
    console.assert(dpf.textContent === '12345', 'correct textContent');
    const clone = dpf.cloneNode(true);
    console.assert(clone.isConnected === false, 'clone not connected');
    console.assert(dpf.textContent === clone.textContent, 'clone textContent');
    document.body.insertBefore(clone, dpf.nextSibling);
    console.assert(clone.isConnected === true, 'clone is connected');
    console.assert(document.body.textContent.trim() === 'P1234512345N', 'correct doubled body text');
    clone.remove();
    console.assert(document.body.textContent.trim() === 'P12345N', 'correct body text');
    console.assert(clone.isConnected === false, 'clone is disconnected');
    dpf.removeChild(nodes[2]);
    dpf.removeChild(nodes[3]);
    console.assert(document.body.textContent.trim() === 'P125N', 'smaller body text');
    dpf.appendChild(nodes[2]);
    console.assert(document.body.textContent.trim() === 'P1253N', 'bigger body text');
    dpf.replaceChild(nodes[3], nodes[1]);
    console.assert(document.body.textContent.trim() === 'P1453N', 'different body text');
    document.body.removeChild(dpf);
    console.assert(document.body.textContent.trim() === 'PN', 'tiny body text');
    dpf.append(...nodes);
    console.assert(dpf.textContent === '12345', 'correct dpf text');
    dpf.removeChild(nodes[2]);
    dpf.removeChild(nodes[3]);
    console.assert(dpf.textContent === '125', 'smaller dpf text');
    dpf.appendChild(nodes[2]);
    console.assert(dpf.textContent === '1253', 'bigger dpf text');
    dpf.replaceChild(nodes[3], nodes[1]);
    console.assert(dpf.textContent === '1453', 'different dpf text');
    document.body.lastChild.replaceWith(dpf);
    console.assert(document.body.textContent.trim() === 'P1453', 'final body text');
    dpf.append(...nodes);
    document.body.textContent = 'OK';
  },
  {once: true}
);
