var BaseExpression = require("./base"),
_ = require("underscore");

function ScriptExpression (value) {
  this.value = value;
}

BaseExpression.extend(ScriptExpression, {
  type: "script",
  toJavaScript: function () {

    if(false)
    var refs = this.filterAllChildren(function (child) {
      return child.type === "reference";
    }).filter(function (reference) {
      return !reference.unbound && reference.path;
    }).map(function (reference) {
      return reference.path;
    });

    var refs = [];

    // remove duplicate references
    refs = _.uniq(refs.map(function (ref) {
      return ref.join(".")
    })).map(function (ref) {
      return ref.split(".");
    })

    var buffer = "{";

    buffer += "run: function () { return " + this.value.toJavaScript() + "; }";

    buffer += ", refs: " + JSON.stringify(refs)

    return buffer + "}";
  }
});

module.exports = ScriptExpression;