import React from 'react';
const MyComponents = {
    DatePicker: function DatePicker(props) {
        return React.createElement("div", null,
            "Imagine a ",
            props.color,
            " datepicker here.");
    }
};
function BlueDatePicker() {
    return React.createElement(MyComponents.DatePicker, { color: "blue" });
}
