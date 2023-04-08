import compare from "./compare.mjs";

export default function detectPreCompilationNess(
  pTSDependencies,
  pJSDependencies
) {
  return pTSDependencies.map((pTSDependency) =>
    pJSDependencies.some(compare.dependenciesEqual(pTSDependency))
      ? { ...pTSDependency, preCompilationOnly: false }
      : { ...pTSDependency, preCompilationOnly: true }
  );
}
