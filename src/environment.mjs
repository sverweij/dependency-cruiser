import { release, platform, arch } from "node:os";
import meta from "#meta.cjs";
import {
  getAvailableTranspilers,
  allExtensions,
} from "#extract/transpile/meta.mjs";

export function getEnvironmentInfo() {
  return {
    version: meta.version,
    nodeVersionSupported: meta.engines.node,
    nodeVersionFound: process.version,
    osVersionFound: `${arch()} ${platform()}@${release()}`,
    transpilersFound: getAvailableTranspilers(),
    extensionsFound: allExtensions,
  };
}
