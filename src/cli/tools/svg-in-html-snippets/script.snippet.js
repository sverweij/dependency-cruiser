/**
 * @param {SVGGelement[]} edges
 * @param {SVGGElement[]} nodes
 * @return {{get: (pTitleText:string) => SVGGElement[]}}
 */
class Graph {
  constructor(nodes, edges) {
    this.nodeMap = new Map();
    this.edgeMap = new Map();
    this.addNodes(nodes);
    this.addEdges(edges);
  }

  createNode(element) {
    return {
      key: getTitleText(element),
      element,
      inEdges: new Map(),
      outEdges: new Map(),
    };
  }

  createEdge(element, source, target) {
    const edge = {
      key: getTitleText(element),
      element,
      source,
      target,
    };

    source.outEdges.set(target.key, edge);
    target.inEdges.set(source.key, edge);

    return edge;
  }

  addNodes(nodes) {
    nodes.forEach((element) => {
      const node = this.createNode(element);
      this.nodeMap.set(node.key, node);
    });
  }

  addEdges(edges) {
    edges.forEach((element) => {
      const link = this.parseLinkFromTitle(getTitleText(element));
      const source = this.nodeMap.get(link.source);
      const target = this.nodeMap.get(link.target);
      if (!source || !target) return;
      const edge = this.createEdge(element, source, target);
      this.edgeMap.set(edge.key, edge);
    });
  }

  /**
   *
   * @param {string} title
   * @return {{ source?: string; target?: string }}
   */
  parseLinkFromTitle(title) {
    const [source, target] = title.split(/\s*->\s*/);

    return {
      source,
      target,
    };
  }

  /**
   *
   * @param {string} title
   * @return {{ node?: Node; edge?: Edge }}
   */
  getObject(title) {
    const node = this.nodeMap.get(title);
    const edge = this.edgeMap.get(title);
    return {
      node,
      edge,
    };
  }
}

/**
 * @param {SVGGElement} pGElement
 * @return {string?}
 */
function getTitleText(pGElement) {
  /** @type {SVGTitleElement} */
  const title = pGElement && pGElement.querySelector("title");
  /** @type {string} */
  let titleText = title && title.textContent;

  if (titleText) {
    titleText = titleText.trim();
  }
  return titleText;
}

/**
 * @param {SVGGElement} element
 */
function removeHighlight(element) {
  if (element && element.classList) {
    element.classList.remove("highlight");
    element.classList.remove("highlight-in");
    element.classList.remove("highlight-out");
  }
}

function addNodeHighlight(node) {
  if (!node) return;
  node.element.classList.add("highlight");
  node.inEdges.forEach(({ element }) => element.classList.add("highlight-in"));
  node.outEdges.forEach(({ element }) =>
    element.classList.add("highlight-out")
  );
}

function addEdgeHighlight(edge) {
  if (!edge) return;
  edge.element.classList.add("highlight");
  edge.source.element.classList.add("highlight-in");
  edge.target.element.classList.add("highlight-out");
}

function removeNodeHighlight(node) {
  if (!node) return;
  removeHighlight(node.element);
  node.inEdges.forEach(({ element }) => removeHighlight(element));
  node.outEdges.forEach(({ element }) => removeHighlight(element));
}

function removeEdgeHighlight(edge) {
  if (!edge) return;
  removeHighlight(edge.element);
  removeHighlight(edge.source.element);
  removeHighlight(edge.target.element);
}

function getHighlightHandler() {
  /** @type {string} */
  let highlightedTitle;

  /** @type {NodeListOf<SVGGElement>} */
  const nodes = document.querySelectorAll(".node");
  /** @type {NodeListOf<SVGGElement>} */
  const edges = document.querySelectorAll(".edge");

  const graph = new Graph([...nodes], [...edges]);

  /** @param {MouseEvent} pMouseEvent */
  return function highlightHandler(pMouseEvent) {
    const closestNodeOrEdge = pMouseEvent.target.closest(".edge, .node");
    const title = getTitleText(closestNodeOrEdge);
    if (title === highlightedTitle) return;
    const last = graph.getObject(highlightedTitle);
    removeNodeHighlight(last.node);
    removeEdgeHighlight(last.edge);
    const { node, edge } = graph.getObject(title);
    addNodeHighlight(node);
    addEdgeHighlight(edge);
    highlightedTitle = title;
  };
}

document.body.onmouseover = getHighlightHandler();

/** ************************************************ */
function initScale() {
  const container = document.body;
  const element = document.getElementById("root");

  const speed = 0.08;
  const pos = { x: 0, y: 0 };
  const delta = { x: 0, y: 0 };
  const pointer = { x: 0, y: 0 };
  let scale = 1;

  const scaleHandler = (event) => {
    event.preventDefault();

    /**
     * wheel with hold ctrl/command key to scale
     *
     * this will trigger by
     *  - use mouse wheel with hold Ctrl/Command key
     *  - or two-fingers pinch in trackpad
     */
    if (event.ctrlKey || event.metaKey) {
      pointer.x = event.pageX - container.offsetLeft;
      pointer.y = event.pageY - container.offsetTop;
      const originScale = scale;

      scale += -1 * Math.max(-1, Math.min(1, event.deltaY)) * speed * scale;

      const max_scale = 4;
      const min_scale = 0.01;
      scale = Math.max(min_scale, Math.min(max_scale, scale));

      const scaleDelta = scale - originScale;

      delta.x = ((pos.x - pointer.x) * scaleDelta) / originScale;
      delta.y = ((pos.y - pointer.y) * scaleDelta) / originScale;

      pos.x += delta.x;
      pos.y += delta.y;
    } else {
      pos.x -= event.deltaX * 2;
      pos.y -= event.deltaY * 2;
    }

    element.style.transform = `translate(${pos.x}px,${pos.y}px) scale(${scale},${scale})`;
  };

  window.addEventListener("wheel", scaleHandler, { passive: false });
}

initScale();
