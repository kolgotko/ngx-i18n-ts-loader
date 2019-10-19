import * as ts from 'typescript';
import { createDummyContext, isI18nCall, createId } from '@kolgotko/ngx-i18n-ts-common';

type TransformArgs = {
  sourceFile: ts.SourceFile,
  program: ts.Program,
  transUnitMap: object,
};

type Query = {
  transUnitMap: object,
  program: ts.Program,
  printer: ts.Printer,
};

function transform(args: TransformArgs): ts.SourceFile {
  const {
    sourceFile,
    program,
    transUnitMap,
  } = args;

  const checker = program.getTypeChecker();
  const context = createDummyContext(program);
  const visitor = (node: ts.Node) => {
    if (isI18nCall(node, checker)) {
      const id = createId(node as ts.CallExpression, checker);
      const transUnit = transUnitMap[id];
      const targetElement = transUnit.elements.find(element => element.name === 'target');
      const targetText = targetElement.elements[0].text;

      return ts.createIdentifier(targetText);
    }

    return ts.visitEachChild(node, visitor, context);
  };

  return ts.visitEachChild(sourceFile, visitor, context);
}

module.exports = function(content, map, meta) {
  const { transUnitMap, program, printer } = this.query as Query;
  const currentSourceFile = program.getSourceFile(this.resourcePath);

  if (!currentSourceFile || currentSourceFile.isDeclarationFile) {
    return content;
  }

  const newSourceFile = transform({
    sourceFile: currentSourceFile,
    transUnitMap,
    program,
  });

  if (newSourceFile !== currentSourceFile) {
    return printer.printFile(newSourceFile);
  }

  return content;
}
