export default function extractStats(pAST) {
  return {
    topLevelStatementCount: pAST?.statements?.length || 0,
    size: pAST?.end || 0,
  };
}
