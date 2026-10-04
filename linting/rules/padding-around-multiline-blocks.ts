import type { RuleTester } from 'oxlint/plugins-dev';

type OxlintRule = Parameters<RuleTester['run']>[1];
type RuleCreate = NonNullable<OxlintRule['create']>;
type RuleContext = Parameters<RuleCreate>[0];
type RuleVisitor = ReturnType<RuleCreate>;
type AnyNode = Parameters<NonNullable<RuleVisitor[string]>>[0];
type ControlFlowNode =
  | Parameters<NonNullable<RuleVisitor['IfStatement']>>[0]
  | Parameters<NonNullable<RuleVisitor['ForStatement']>>[0]
  | Parameters<NonNullable<RuleVisitor['ForInStatement']>>[0]
  | Parameters<NonNullable<RuleVisitor['ForOfStatement']>>[0]
  | Parameters<NonNullable<RuleVisitor['WhileStatement']>>[0]
  | Parameters<NonNullable<RuleVisitor['DoWhileStatement']>>[0]
  | Parameters<NonNullable<RuleVisitor['SwitchStatement']>>[0]
  | Parameters<NonNullable<RuleVisitor['TryStatement']>>[0];
type ProgramNode = Parameters<NonNullable<RuleVisitor['Program']>>[0];
type BlockStatementNode = Parameters<NonNullable<RuleVisitor['BlockStatement']>>[0];
type SwitchCaseNode = Parameters<NonNullable<RuleVisitor['SwitchCase']>>[0];

const blockStatements = new Set([
  'IfStatement',
  'ForStatement',
  'ForInStatement',
  'ForOfStatement',
  'WhileStatement',
  'DoWhileStatement',
  'SwitchStatement',
  'TryStatement'
]);

const hasBlockBody = (node: ControlFlowNode) => {
  const isBlock = (body: unknown) =>
    typeof body === 'object' && body !== null && 'type' in body && body.type === 'BlockStatement';

  switch (node.type) {
    case 'IfStatement':
      return isBlock(node.consequent) || isBlock(node.alternate);
    case 'ForStatement':
    case 'ForInStatement':
    case 'ForOfStatement':
    case 'WhileStatement':
    case 'DoWhileStatement':
      return isBlock(node.body);
    case 'SwitchStatement':
    case 'TryStatement':
      return true;
    default:
      return false;
  }
};

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

export const paddingAroundMultilineBlocks = {
  meta: {
    type: 'layout',
    fixable: 'whitespace',
    docs: { description: 'Require blank lines around multiline control-flow blocks' },
    schema: [],
    messages: {
      before: 'Add a blank line before this multiline control-flow block.',
      after: 'Add a blank line after this multiline control-flow block.'
    }
  },
  create(context: RuleContext): RuleVisitor {
    const lines = context.sourceCode.lines;

    const checkPadding = (node: ControlFlowNode) => {
      if (!blockStatements.has(node.type) || !hasBlockBody(node)) return;
      if (node.loc.start.line === node.loc.end.line) return;

      const siblings = getStatementSiblings(node);
      if (!siblings) return;

      const previous = siblings.statements[siblings.index - 1];
      const next = siblings.statements[siblings.index + 1];

      if (previous && !hasBlankLineBetween(lines, previous.loc.end.line, node.loc.start.line)) {
        context.report({
          node,
          messageId: 'before',
          fix: (fixer) => fixer.insertTextAfter(previous, '\n')
        });
      }

      if (next && !hasBlankLineBetween(lines, node.loc.end.line, next.loc.start.line)) {
        context.report({
          node,
          messageId: 'after',
          fix: (fixer) => fixer.insertTextAfter(node, '\n')
        });
      }
    };

    return Object.fromEntries([...blockStatements].map((type) => [type, checkPadding]));
  }
};
