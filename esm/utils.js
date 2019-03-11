export const asDPF = node => (isDPF(node) ? node.valueOf() : node);

// This is fully based on window/global patching side effect.
// Do not import DocumentPersistentFragment upfront or shenanigans happen.
export const isDPF = node => node instanceof DocumentPersistentFragment;
