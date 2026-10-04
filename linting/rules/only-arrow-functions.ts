import type { RuleTester } from 'oxlint/plugins-dev';

type OxlintRule = Parameters<RuleTester['run']>[1];
type RuleCreate = NonNullable<OxlintRule['create']>;
type RuleContext = Parameters<RuleCreate>[0];
type RuleFixer = Parameters<NonNullable<Parameters<RuleContext['report']>[0]['fix']>>[0];
type RuleVisitor = ReturnType<RuleCreate>;
type FunctionDeclarationNode = Parameters<NonNullable<RuleVisitor['FunctionDeclaration']>>[0];
type FunctionExpressionNode = Parameters<NonNullable<RuleVisitor['FunctionExpression']>>[0];
type MethodDefinitionNode = Parameters<NonNullable<RuleVisitor['MethodDefinition']>>[0];
type PropertyNode = Extract<
  Parameters<NonNullable<RuleVisitor['Property']>>[0],
  { type: 'Property' }
>;

export const onlyArrowFunctions = {
  meta: {
    type: 'problem',
    fixable: 'code',
    docs: { description: 'Require arrow functions instead of traditional function syntax' },
    schema: [],
    messages: {
      function: 'Use an arrow function instead of traditional function syntax.',
      method: 'Use an arrow function property instead of method syntax.'
    }
  },
  create(context: RuleContext): RuleVisitor {
    const sourceCode = context.sourceCode;

    const canSafelyUseArrow = (node: FunctionExpressionNode) => {
      if (node.id || node.generator || !node.body) return false;

      const tokens = sourceCode.getTokens(node);
      if (tokens.some((token) => ['this', 'arguments', 'super', 'new'].includes(token.value))) {
        return false;
      }

      const functionToken = tokens.find((token) => token.value === 'function');
      if (!functionToken) return false;

      const header = sourceCode.text.slice(functionToken.range[1], node.body.range[0]);
      return !header.includes('//') && !header.includes('/*');
    };

    const functionExpressionFix = (node: FunctionExpressionNode, fixer: RuleFixer) => {
      if (!node.body) return null;

      const text = sourceCode.getText(node);
      const keywordOffset = text.indexOf('function');
      const bodyOffset = node.body.range[0] - node.range[0];
      const prefix = text.slice(0, keywordOffset);
      const header = text.slice(keywordOffset + 'function'.length, bodyOffset).trimEnd();
      const body = text.slice(bodyOffset);

      return fixer.replaceText(node, `${prefix}${header} => ${body}`);
    };

    const reportFunction = (node: FunctionDeclarationNode | FunctionExpressionNode) => {
      if (node.type === 'FunctionExpression') {
        const parent = node.parent;
        if (
          parent?.type === 'MethodDefinition' ||
          (parent?.type === 'Property' && 'method' in parent && parent.method)
        ) {
          return;
        }

        if (canSafelyUseArrow(node)) {
          context.report({
            node,
            messageId: 'function',
            fix: (fixer) => functionExpressionFix(node, fixer)
          });
          return;
        }
      }

      context.report({ node, messageId: 'function' });
    };

    return {
      FunctionDeclaration: reportFunction,
      FunctionExpression: reportFunction,
      MethodDefinition: (node: MethodDefinitionNode) => {
        if (node.kind !== 'constructor') context.report({ node, messageId: 'method' });
      },
      Property: (node: PropertyNode) => {
        if (node.method || node.kind !== 'init') {
          const value = node.value;
          if (
            node.method &&
            node.kind === 'init' &&
            value.type === 'FunctionExpression' &&
            value.body !== null &&
            !value.generator &&
            !context.sourceCode
              .getTokens(value)
              .some((token) => ['this', 'arguments', 'super', 'new'].includes(token.value))
          ) {
            const key = node.computed
              ? `[${sourceCode.getText(node.key)}]`
              : sourceCode.getText(node.key);
            const tailStart = node.key.range[1] - node.range[0];
            const bodyStart = value.body.range[0] - node.range[0];
            const text = sourceCode.getText(node);
            const paramsAndReturnType = text.slice(tailStart, bodyStart).trimEnd();

            if (!paramsAndReturnType.includes('//') && !paramsAndReturnType.includes('/*')) {
              context.report({
                node,
                messageId: 'method',
                fix: (fixer) =>
                  fixer.replaceText(
                    node,
                    `${key}: ${value.async ? 'async ' : ''}${paramsAndReturnType} => ${text.slice(bodyStart)}`
                  )
              });
              return;
            }
          }

          context.report({ node, messageId: 'method' });
        }
      }
    };
  }
};
