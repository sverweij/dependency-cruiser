document.addEventListener("contextmenu", getSelectHandler(title2ElementMap));
document.addEventListener("mouseover", getHoverHandler(title2ElementMap));
document.addEventListener("keydown", resetHandler);

var gMode = new Mode();

var title2ElementMap = (function makeElementMap() {
  /** @type {NodeListOf<SVGGElement>} */
  var nodes = document.querySelectorAll(".node");
  /** @type {NodeListOf<SVGGElement>} */
  var edges = document.querySelectorAll(".edge");
  return new Title2ElementMap(edges, nodes);
})();

/** @param {KeyboardEvent} pKeyboardEvent */
function resetHandler(pKeyboardEvent) {
  if (pKeyboardEvent.key === "Escape") {
    resetNodesAndEdges();
    gMode.setToHover();
  }
}
function getHoverHandler() {
  /** @type {string} */
  var currentHighlightedTitle;

  /** @param {MouseEvent} pMouseEvent */
  return function hoverHighlightHandler(pMouseEvent) {
    var closestNodeOrEdge = pMouseEvent.target.closest(".edge, .node");
    var closestTitleText = getTitleText(closestNodeOrEdge);

    if (
      !(currentHighlightedTitle === closestTitleText) &&
      gMode.get() === gMode.HOVER
    ) {
      resetNodesAndEdges();
      addHighlight(closestNodeOrEdge);
      title2ElementMap.get(closestTitleText).forEach(addHighlight);
      currentHighlightedTitle = closestTitleText;
    }
  };
}

function getSelectHandler() {
  /** @type {string} */
  var currentHighlightedTitle;

  /** @param {MouseEvent} pMouseEvent */
  return function selectHighlightHandler(pMouseEvent) {
    pMouseEvent.preventDefault();

    var closestNodeOrEdge = pMouseEvent.target.closest(".edge, .node");
    var closestTitleText = getTitleText(closestNodeOrEdge);

    if (!!closestNodeOrEdge) {
      gMode.setToSelect();
    } else {
      gMode.setToHover();
    }
    if (!(currentHighlightedTitle === closestTitleText)) {
      resetNodesAndEdges();
      addHighlight(closestNodeOrEdge);
      title2ElementMap.get(closestTitleText).forEach(addHighlight);
      currentHighlightedTitle = closestTitleText;
    }
  };
}
function Mode() {
  var HOVER = 1;
  var SELECT = 2;

  function setToHover() {
    this._mode = HOVER;
  }
  function setToSelect() {
    this._mode = SELECT;
  }

  function get() {
    return this._mode || HOVER;
  }

  return {
    HOVER: HOVER,
    SELECT: SELECT,
    setToHover: setToHover,
    setToSelect: setToSelect,
    get: get,
  };
}

/**
 *
 * @param {SVGGelement[]} pEdges
 * @param {SVGGElement[]} pNodes
 * @return {{get: (pTitleText:string) => SVGGElement[]}}
 */
function Title2ElementMap(pEdges, pNodes) {
  /* {{[key: string]: SVGGElement[]}} */
  var elementMap = buildMap(pEdges, pNodes);

  /**
   * @param {NodeListOf<SVGGElement>} pEdges
   * @param {NodeListOf<SVGGElement>} pNodes
   * @return {{[key: string]: SVGGElement[]}}
   */
  function buildMap(pEdges, pNodes) {
    var title2NodeMap = buildTitle2NodeMap(pNodes);

    return nodeListToArray(pEdges).reduce(addEdgeToMap(title2NodeMap), {});
  }
  /**
   * @param {NodeListOf<SVGGElement>} pNodes
   * @return {{[key: string]: SVGGElement}}
   */
  function buildTitle2NodeMap(pNodes) {
    return nodeListToArray(pNodes).reduce(addNodeToMap, {});
  }

  function addNodeToMap(pMap, pNode) {
    var titleText = getTitleText(pNode);

    if (titleText) {
      pMap[titleText] = pNode;
    }
    return pMap;
  }

  function addEdgeToMap(pNodeMap) {
    return function (pEdgeMap, pEdge) {
      /** @type {string} */
      var titleText = getTitleText(pEdge);

      if (titleText) {
        var edge = pryEdgeFromTitle(titleText);

        pEdgeMap[titleText] = [pNodeMap[edge.from], pNodeMap[edge.to]];
        (pEdgeMap[edge.from] || (pEdgeMap[edge.from] = [])).push(pEdge);
        (pEdgeMap[edge.to] || (pEdgeMap[edge.to] = [])).push(pEdge);
      }
      return pEdgeMap;
    };
  }

  /**
   *
   * @param {string} pString
   * @return {{from?: string; to?:string;}}
   */
  function pryEdgeFromTitle(pString) {
    var nodeNames = pString.split(/\s*->\s*/);

    return {
      from: nodeNames.shift(),
      to: nodeNames.shift(),
    };
  }
  /**
   *
   * @param {string} pTitleText
   * @return {SVGGElement[]}
   */
  function get(pTitleText) {
    return (pTitleText && elementMap[pTitleText]) || [];
  }
  return {
    get: get,
  };
}

/**
 * @param {SVGGElement} pGElement
 * @return {string?}
 */
function getTitleText(pGElement) {
  /** @type {SVGTitleElement} */
  var title = pGElement && pGElement.querySelector("title");
  /** @type {string} */
  var titleText = title && title.textContent;

  if (titleText) {
    titleText = titleText.trim();
  }
  return titleText;
}

/**
 * @param {NodeListOf<Element>} pNodeList
 * @return {Element[]}
 */
function nodeListToArray(pNodeList) {
  var lReturnValue = [];

  pNodeList.forEach(function (pElement) {
    lReturnValue.push(pElement);
  });

  return lReturnValue;
}

function resetNodesAndEdges() {
  nodeListToArray(document.querySelectorAll(".current")).forEach(
    removeHighlight
  );
}

/**
 * @param {SVGGElement} pGElement
 */
function removeHighlight(pGElement) {
  if (pGElement && pGElement.classList) {
    pGElement.classList.remove("current");
  }
}

/**
 * @param {SVGGElement} pGroup
 */
function addHighlight(pGroup) {
  if (pGroup && pGroup.classList) {
    pGroup.classList.add("current");
  }
}
