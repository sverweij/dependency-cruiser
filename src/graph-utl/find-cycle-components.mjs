/**
 * Groups the modules that are on a cycle, so callers can quickly tell whether
 * a dependency could be part of one.
 *
 * Two modules end up in the same group when each one can reach the other by
 * following dependencies. So a dependency from a to b can only be part of a
 * cycle when a and b are in the same group. Modules that aren't on any cycle
 * don't get a group.
 *
 * Uses Tarjan's algorithm for strongly connected components.
 *
 * @param {Map<string, string[]>} pGraph module name => names of the modules it depends on
 * @returns {Map<string, number>} module name => group number
 */
export default function findCycleComponents(pGraph) {
  /** @type {Map<string, number>} */
  const lIndexOf = new Map();
  /** @type {Map<string, number>} */
  const lLowLinkOf = new Map();
  /** @type {string[]} */
  const lComponentStack = [];
  const lOnComponentStack = new Set();
  /** @type {Map<string, number>} */
  const lReturnValue = new Map();
  let lNextIndex = 0;
  let lNextComponent = 0;

  /**
   * A module, the modules it depends on, and the index of the next one to follow
   * @typedef {{name: string, successors: string[], nextEdge: number}} IFrame
   */

  /** @returns {IFrame} */
  function visit(pName) {
    lIndexOf.set(pName, lNextIndex);
    lLowLinkOf.set(pName, lNextIndex);
    lNextIndex += 1;
    lComponentStack.push(pName);
    lOnComponentStack.add(pName);

    return { name: pName, successors: pGraph.get(pName), nextEdge: 0 };
  }

  function lowerLowLink(pName, pCandidate) {
    lLowLinkOf.set(pName, Math.min(lLowLinkOf.get(pName), pCandidate));
  }

  /** @param {IFrame} pRoot */
  function closeComponent(pRoot) {
    const lMembers = [];
    let lMember;

    do {
      lMember = lComponentStack.pop();
      lOnComponentStack.delete(lMember);
      lMembers.push(lMember);
    } while (lMember !== pRoot.name);

    if (lMembers.length > 1 || pRoot.successors.includes(pRoot.name)) {
      for (const lName of lMembers) {
        lReturnValue.set(lName, lNextComponent);
      }
      lNextComponent += 1;
    }
  }

  /**
   * Follows the next edge of the frame on top of the stack: visits the
   * successor when it's new, or takes its index into account when it's on
   * the component stack.
   *
   * @param {IFrame[]} pFrames
   */
  function followNextEdge(pFrames) {
    const lFrame = pFrames.at(-1);
    const lSuccessor = lFrame.successors[lFrame.nextEdge];

    lFrame.nextEdge += 1;
    if (!pGraph.has(lSuccessor)) {
      return;
    }
    if (!lIndexOf.has(lSuccessor)) {
      pFrames.push(visit(lSuccessor));
    } else if (lOnComponentStack.has(lSuccessor)) {
      lowerLowLink(lFrame.name, lIndexOf.get(lSuccessor));
    }
  }

  /**
   * Pops the frame on top of the stack once all its edges are followed,
   * passes its low link on to its parent and closes the component when
   * it's the component's root.
   *
   * @param {IFrame[]} pFrames
   */
  function finishFrame(pFrames) {
    const lFrame = pFrames.pop();

    if (pFrames.length > 0) {
      lowerLowLink(pFrames.at(-1).name, lLowLinkOf.get(lFrame.name));
    }
    if (lLowLinkOf.get(lFrame.name) === lIndexOf.get(lFrame.name)) {
      closeComponent(lFrame);
    }
  }

  /**
   * Runs the depth-first search from pStart, with an explicit stack instead
   * of recursion so deep graphs don't exhaust the call stack.
   *
   * @param {string} pStart
   */
  function strongConnect(pStart) {
    const lFrames = [visit(pStart)];

    while (lFrames.length > 0) {
      const lFrame = lFrames.at(-1);

      if (lFrame.nextEdge < lFrame.successors.length) {
        followNextEdge(lFrames);
      } else {
        finishFrame(lFrames);
      }
    }
  }

  for (const lStart of pGraph.keys()) {
    if (!lIndexOf.has(lStart)) {
      strongConnect(lStart);
    }
  }
  return lReturnValue;
}
