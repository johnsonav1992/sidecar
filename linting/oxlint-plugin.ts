import { blankLineBeforeReturn } from './rules/blank-line-before-return.ts';
import { noBlankLinesBetweenJSXElements } from './rules/no-blank-lines-between-jsx-elements.ts';
import { onlyArrowFunctions } from './rules/only-arrow-functions.ts';
import { paddingAroundMultilineBlocks } from './rules/padding-around-multiline-blocks.ts';

export default {
  meta: { name: 'sidecar' },
  rules: {
    'blank-line-before-return': blankLineBeforeReturn,
    'no-blank-lines-between-jsx-elements': noBlankLinesBetweenJSXElements,
    'only-arrow-functions': onlyArrowFunctions,
    'padding-around-multiline-blocks': paddingAroundMultilineBlocks
  }
};

export {
  blankLineBeforeReturn,
  noBlankLinesBetweenJSXElements,
  onlyArrowFunctions,
  paddingAroundMultilineBlocks
};
