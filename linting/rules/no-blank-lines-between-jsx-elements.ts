import type { RuleTester } from 'oxlint/plugins-dev';

type OxlintRule = Parameters<RuleTester['run']>[1];
type RuleCreate = NonNullable<OxlintRule['create']>;
type RuleContext = Parameters<RuleCreate>[0];
type RuleVisitor = ReturnType<RuleCreate>;
type JSXElementNode = Parameters<NonNullable<RuleVisitor['JSXElement']>>[0];
type JSXFragmentNode = Parameters<NonNullable<RuleVisitor['JSXFragment']>>[0];
type JSXTextNode = Parameters<NonNullable<RuleVisitor['JSXText']>>[0];
type JSXChildNode = JSXElementNode['children'][number] | JSXFragmentNode['children'][number];
type JSXParentNode = JSXElementNode | JSXFragmentNode;

const isElement = (node: JSXChildNode | undefined): node is JSXElementNode | JSXFragmentNode =>
  node?.type === 'JSXElement' || node?.type === 'JSXFragment';

const isJSXParent = (node: unknown): node is JSXParentNode =>
  typeof node === 'object' &&
  node !== null &&
  'type' in node &&
  (node.type === 'JSXElement' || node.type === 'JSXFragment');

export const noBlankLinesBetweenJSXElements = {
  meta: {
    type: 'layout',
    fixable: 'whitespace',
    docs: { description: 'Disallow blank lines adjacent to JSX elements' },
    schema: [],
    messages: { blankLine: 'Remove the blank line adjacent to this JSX element.' }
  },
  create(context: RuleContext): RuleVisitor {
    const { sourceCode } = context;
    const newline = sourceCode.text.includes('\r\n') ? '\r\n' : '\n';
    const blankLinePattern = /(?:\r?\n[ \t]*){2,}/;

    return {
      JSXText(node: JSXTextNode) {
        if (node.value.trim() !== '') return;

        const parent = node.parent;
        if (!isJSXParent(parent)) return;

        const children = parent.children;
        const index = children.indexOf(node);
        if (index < 0) return;

        const previous = children[index - 1];
        const next = children[index + 1];
        const hasElement = children.some(isElement);
        const isAtElementBoundary =
          isElement(previous) ||
          isElement(next) ||
          (index === 0 && hasElement) ||
          (index === children.length - 1 && hasElement);
        if (!isAtElementBoundary) return;

        const text = sourceCode.getText(node);
        if (!blankLinePattern.test(text)) return;

        context.report({
          node,
          messageId: 'blankLine',
          fix: (fixer) =>
            fixer.replaceText(
              node,
              text.replace(/(?:\r?\n[ \t]*){2,}/g, (sequence) => {
                const indent = sequence.match(/[ \t]*$/)?.[0] ?? '';
                return `${newline}${indent}`;
              })
            )
        });
      }
    };
  }
};
