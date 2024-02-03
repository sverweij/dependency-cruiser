export default `<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <title>dependency-cruiser output</title>
  <style media="screen">
    html {
      font-family: sans-serif;
      font-size: 10pt;
    }

    table {
      overflow: hidden;
    }

    table,
    td.controls {
      transition-duration: 0.3s;
    }

    table,
    th,
    td {
      border: solid black 1px;
      border-collapse: collapse;
      font-size: inherit;
    }

    td,
    th {
      position: relative;
    }

    th {
      text-align: start;
      vertical-align: bottom;
      max-width: 1em;
      max-height: 30em;
      height: 20em;
      font-weight: normal;
      white-space: nowrap;
      overflow: hidden;
    }

    th div {
      transform: rotateZ(-90deg);
      transform-origin: 0.5em;
      text-align: start;
      height: 1em;
      width: 30em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    td {
      text-align: center;
    }

    td.first-cell {
      text-align: left;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    td.top-left {
      border-top: solid 1px transparent;
      border-left: solid 1px transparent;
    }

    td.top-right {
      border-top: solid 1px transparent;
      border-right: solid 1px transparent;
    }

    td.bottom-left {
      border-bottom: solid 1px transparent;
      border-left: solid 1px transparent;
    }

    td.bottom-right {
      border-bottom: solid 1px transparent;
      border-right: solid 1px transparent;
    }

    tbody tr:hover {
      background-color: lightgrey;
    }

    td:hover::after,
    td:focus::after,
    th:hover::after,
    th:focus::after {
      background-color: #00000077;
      content: "";
      height: 5000px;
      left: 0;
      position: absolute;
      top: -2500px;
      width: 100%;
      z-index: -1;
    }

    #table-rotated:target {
      transform: rotateZ(45deg);
      transform-origin: bottom left;
    }

    #table-rotated:target #unrotate {
      opacity: 1;
    }

    #table-rotated:target #rotate {
      opacity: 0;
    }

    #unrotate {
      opacity: 0;
    }

    #rotate {
      opacity: 1;
    }

    .controls {
      opacity: 0.2;
      vertical-align: bottom;
      padding: 0.5em;
    }

    .controls:hover {
      opacity: 1;
    }

    .controls a {
      font-style: normal;
      text-decoration: none;
      background-color: #eee;
      padding: 0.2em 0.5em 0.2em 0.5em;
    }

    .cell-core-module {
      color: grey;
      font-style: italic;
    }

    .cell-unresolvable-module {
      color: red;
      font-style: italic;
    }

    .cell-true {
      background-color: black;
      opacity: 0.5;
    }

    .cell-false {
      background-color: white;
      opacity: 0.5;
    }

    .cell-error {
      background-color: red;
      opacity: 0.5;
    }

    .cell-warn {
      background-color: orange;
      opacity: 0.5;
    }

    .cell-info {
      background-color: blue;
      opacity: 0.5;
    }
  </style>
</head>

<body>
  {{table-here}}
</body>
</html>
`;
