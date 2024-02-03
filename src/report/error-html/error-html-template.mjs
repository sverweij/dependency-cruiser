export default `<!DOCTYPE html>
<html lang="en">
<head>
  <title>dependency-cruiser - results</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <style type="text/css">
    body {
      font-family: sans-serif;
      margin: 0 auto;
      max-width: 90%;
      line-height: 1.6;
      font-size: 14px;
      color: #444;
      padding: 0 10px;
      background-color: #fff;
    }

    footer {
      color: gray;
      margin-top: 1.4em;
      border-top: solid 1px currentColor
    }

    a {
      text-decoration: none
    }

    a.noiseless {
      color: currentColor
    }

    h1,
    h2,
    h3 {
      line-height: 1.2
    }

    table {
      border-collapse: collapse;
      width: 100%;
    }

    th,
    td {
      text-align: left;
      padding: 4px;
    }

    tbody tr:nth-child(odd) {
      background-color: rgba(128, 128, 128, 0.2);
    }

    .error {
      color: red;
    }

    .warn {
      color: orange;
    }

    .info {
      color: blue;
    }

    .ignore {
      color:gray;
    }

    .ok {
      color: limegreen;
    }

    td.nowrap {
      white-space: nowrap
    }

    svg {
      fill: currentColor
    }

    #show-unviolated {
      display: block
    }

    #hide-unviolated {
      display: none
    }

    #show-all-the-rules:target #show-unviolated {
      display: none
    }

    #show-all-the-rules:target #hide-unviolated {
      display: block
    }

    tr.unviolated {
      display: none
    }

    #show-all-the-rules:target tr.unviolated {
      display: table-row;
      color: gray;
    }

    #show-ignored {
      display: block
    }

    #hide-ignored {
      display: none
    }

    #show-ignored-violations:target #show-ignored {
      display: none
    }

    #show-ignored-violations:target #hide-ignored {
      display: block
    }

    tr.ignored {
      display: none
    }

    #show-ignored-violations:target tr.ignored {
      display: table-row;
      color: gray;
    }

    .p__svg--inline {
      vertical-align: top;
      width: 1.2em;
      height: 1.2em
    }

    .controls {
      background-color: #fff;
      vertical-align: bottom;
      text-align: center
    }

    .controls:hover {
      opacity: 1;
    }

    .controls a {
      text-decoration: none;
      color: gray;
    }

    .controls a:hover {
      text-decoration: underline;
      color: blue;
    }

    .extra {
      color: gray;
    }
  </style>
  <style type="text/css" media="print">
    th,
    td {
      border: 1px solid #444;
    }

    .controls {
      display: none
    }
  </style>
</head>

<body>
  <h1>Forbidden dependency check - results</h1>
  <span id="show-all-the-rules">
  <h2><svg class="p__svg--inline" viewBox="0 0 14 16" version="1.1" aria-hidden="true">
      <path fill-rule="evenodd"
        d="M11.5 8L8.8 5.4 6.6 8.5 5.5 1.6 2.38 8H0v2h3.6l.9-1.8.9 5.4L9 8.5l1.6 1.5H14V8h-2.5z"></path>
    </svg> Summary</h2>
  <p>
    <div style="float:left;padding-right:20px">
      <strong>{{totalCruised}}</strong> modules
    </div>
    <div style="float:left;padding-right:20px">
      <strong>{{totalDependenciesCruised}}</strong> dependencies
    </div>
    <div style="float:left;padding-right:20px">
      <strong>{{error}}</strong> errors
    </div>
    <div style="float:left;padding-right:20px">
      <strong>{{warn}}</strong> warnings
    </div>
    <div style="float:left;padding-right:20px">
      <strong>{{info}}</strong> informational
    </div>
    <div style="float:left;padding-right:20px" class="ignore">
      <strong>{{ignore}}</strong> ignored
    </div>
    &nbsp;
  </p>
  {{violatedRulesTable}}
  </span>

  {{violationsList}}
  <footer>
    <p><a href="https://github.com/sverweij/dependency-cruiser">{{depcruiseVersion}}</a> /
      {{runDate}}</p>
  </footer>
</body>
</html>
`;
