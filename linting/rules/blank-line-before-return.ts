import type { RuleTester } from 'oxlint/plugins-dev';

type OxlintRule = Parameters<RuleTester['run']>[1];
type RuleCreate = NonNullable<OxlintRule['create']>;
type RuleContext = Parameters<RuleCreate>[0];
type RuleVisitor = ReturnType<RuleCreate>;
type AnyNode = Parameters<NonNullable<RuleVisitor[string]>>[0];
type ProgramNode = Parameters<NonNullable<RuleVisitor['Program']>>[0];
type BlockStatementNode = Parameters<NonNullable<RuleVisitor['BlockStatement']>>[0];
type SwitchCaseNode = Parameters<NonNullable<RuleVisitor['SwitchCase']>>[0];
type ReturnStatementNode = Parameters<NonNullable<RuleVisitor['ReturnStatement']>>[0];
type IfStatementNode = Parameters<NonNullable<RuleVisitor['IfStatement']>>[0];

const getStatementSiblings = (node: AnyNode) => {
  const parent = node.parent;
  if (!parent) return null;

  let statements: AnyNode[] | undefined;
  if (parent.type === 'Program') statements = (parent as ProgramNode).body;
  if (parent.type === 'BlockStatement') statements = (parent as BlockStatementNode).body;
  if (parent.type === 'SwitchCase') statements = (parent as SwitchCaseNode).consequent;

  if (statements) {
    const index = statements.indexOf(node);
    if (index !== -1) return { statements, index };
  }

  return null;
};

const hasBlankLineBetween = (lines: string[], previousEndLine: number, nextStartLine: number) =>
  lines.slice(previousEndLine, nextStartLine - 1).some((line) => line.trim() === '');

export const blankLineBeforeReturn = {
  meta: {
    type: 'layout',
    fixable: 'whitespace',
    docs: { description: 'Require a blank line before return statements and early returns' },
    schema: [],
    messages: { blankLine: 'Add a blank line before this return statement.' }
  },
  create(context: RuleContext): RuleVisitor {
    const { sourceCode } = context;
    const lines = sourceCode.lines;
    const newline = sourceCode.text.includes('\r\n') ? '\r\n' : '\n';

    const checkBefore = (node: AnyNode) => {
      const siblings = getStatementSiblings(node);
      if (!siblings) return;

      const previous = siblings.statements[siblings.index - 1];
      if (!previous || hasBlankLineBetween(lines, previous.loc.end.line, node.loc.start.line))
        return;

      const lineStart = node.range[0] - node.loc.start.column;
      context.report({
        node,
        messageId: 'blankLine',
        fix: (fixer) => fixer.insertTextBeforeRange([lineStart, lineStart], newline)
      });
    };

    return {
      ReturnStatement(node: ReturnStatementNode) {
        const parent = node.parent;
        if (parent?.type === 'IfStatement') {
          checkBefore(parent as IfStatementNode);
          return;
        }

        checkBefore(node);
      }
    };
  }
};
