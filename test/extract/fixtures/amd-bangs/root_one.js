require(
    ["fs",
     "../../../node_modules/commander/index",
     "./shared",
     "./excitingpolyfill.js!./sub/dir",
     "./one_only_one",
     "json!./somedata.json'"
    ],
    function(fs,
        cmdr,
        shared,
        subdir,
        one_only_one,
        three){
    // do stuff
    }
);
