var protoclass = require("protoclass");

function PaperBinding (node, context, bindings, section, nodeFactory) {
  this.node        = node;
  this.context     = context;
  this.bindings    = bindings;
  this.section     = section;
  this.nodeFactory = nodeFactory;
}


protoclass(PaperBinding, {

  /**
   */

  render: function () {
    this.section.show();
    return this.section;
  },

  /**
   */

  remove: function () {
    this.section.hide();
    return this;
  },

  /**
   */

  dispose: function () {
    this.unbind();
    this.section.dispose();
    return this;
  },

  /**
   */

  bind: function () {
    this.bindings.bind(this.context);
  },

  /**
   */

  unbind: function () {
    this.bindings.unbind();
  },

  /**
   */

  toFragment: function () {
    return this.section.toFragment();
  },

  /**
   */

  toString: function () {

    if (this.nodeFactory.name === "string") {
      return this.section.toString();
    }

    var frag = this.section.toFragment();

    var div = document.createElement("div");
    div.appendChild(frag.cloneNode(true));
    return div.innerHTML;

  }
});

module.exports = PaperBinding;