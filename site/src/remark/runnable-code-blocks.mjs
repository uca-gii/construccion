import {visit} from 'unist-util-visit';

// Fenced code blocks (```java, ```scala, ...) in docs/implementacion get
// turned into <Runnable lang="..." code={...} /> at the AST level.
//
// This exists specifically to avoid a documented MDX/micromark quirk: a
// multi-line JS expression written literally as `code={`...`}` in the
// source gets up to 2 leading whitespace characters eaten from every
// continuation line (micromark-factory-mdx-expression hardcodes
// `indentSize = 2`, treating the expression as if it were nested in a
// 2-space markdown container). That silently strips the first indent level
// from every code example. Building the `code` attribute's value as an
// estree `Literal` here, from text captured by the *fenced code block*
// tokenizer (which preserves whitespace exactly), sidesteps that path
// entirely - MDX serializes `data.estree` as-is instead of re-tokenizing it.
const RUNNABLE_LANGS = new Set([
  'java',
  'csharp',
  'javascript',
  'python',
  'ruby',
  'scala',
  'cpp',
  'c',
  'eiffel',
]);

export default function remarkRunnableCodeBlocks() {
  return (tree) => {
    visit(tree, 'code', (node) => {
      if (!node.lang || !RUNNABLE_LANGS.has(node.lang)) {
        return;
      }

      const meta = (node.meta ?? '').split(/\s+/).filter(Boolean);
      const isStatic = meta.includes('static');
      const code = node.value;

      const attributes = [
        {type: 'mdxJsxAttribute', name: 'lang', value: node.lang},
        {
          type: 'mdxJsxAttribute',
          name: 'code',
          value: {
            type: 'mdxJsxAttributeValueExpression',
            value: JSON.stringify(code),
            data: {
              estree: {
                type: 'Program',
                sourceType: 'module',
                comments: [],
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {type: 'Literal', value: code},
                  },
                ],
              },
            },
          },
        },
      ];

      if (isStatic) {
        attributes.push({type: 'mdxJsxAttribute', name: 'static', value: null});
      }

      node.type = 'mdxJsxFlowElement';
      node.name = 'Runnable';
      node.attributes = attributes;
      node.children = [];
      node.data = {_mdxExplicitJsx: true};
      delete node.lang;
      delete node.meta;
      delete node.value;
    });
  };
}
