export default function extractStats(pAST) {
  return {
    topLevelStatementCount: pAST?.body?.length || 0,
    size: pAST?.end || 0,
  };
}
