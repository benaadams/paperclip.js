var pc    = require(".."),
expect    = require("expect.js"),
utils     = require("./utils");

describe("node", function() {

  describe("attribute", function() {

    describe("text binding", function() {

      it("can create a node without any bindings", function() {
        var v = pc.template("<div id='container' />").bind();
        expect(String(v)).to.be("<div id=\"container\"></div>");
      })

      it("can be bound to any value", function() {
        var v = pc.template("<input value=\"a{{ value }}\" />").
        bind({
          value: "blah"
        });

        expect(String(v)).to.be("<input value=\"ablah\"></input>");
        v.context.set("value", "h");
        expect(String(v)).to.be("<input value=\"ah\"></input>");
      });

      it("can be bound to multiple values", function() {
        var v = pc.template("<input value=\"{{value}}\" name=\"{{name}}\"></input>").
        bind({
          name: "a",
          value: "b"
        });

        expect(String(v)).to.be("<input value=\"b\" name=\"a\"></input>");
        v.context.set("name", "c");
        expect(String(v)).to.be("<input value=\"b\" name=\"c\"></input>");
        v.context.set("value", "d");
        expect(String(v)).to.be("<input value=\"d\" name=\"c\"></input>");
      });

      it("removes the attribute if the value is undefined", function() {

        var v = pc.template("<input value=\"{{value}}\"></input>").
        bind({
          value: "b"
        });

        expect(String(v)).to.be("<input value=\"b\"></input>");
        v.context.set("value", undefined);
        expect(String(v)).to.be("<input></input>");
      });
    });
  

    describe("data-bind", function() {
      describe("show", function() {
        it("can be used", function() {
          var v = pc.template("<div data-bind=\"{{show:true}}\"></div>").bind();

          expect(String(v)).to.be("<div></div>")
        }); 

        it("respects original display style", function() {
          var v = pc.template("<div style=\"display:inline-block;\" data-bind=\"{{show:show}}\"></div>").bind({
            show: true
          });

          expect(String(v)).to.be("<div style=\"display:inline-block;\"></div>");
          v.context.set("show", false);
          expect(String(v)).to.be("<div style=\"display:none;\"></div>");
        });

      });

      describe("css", function() {

        it("can add a css class", function() {
          var v = pc.template("<div data-bind=\"{{ \
            css: { \
              'container': useContainer, \
              'blue': useBlue, \
              'red': useRed \
            }\
          }}\"></div>").bind({
            useContainer: true,
            useRed: true,
            useBlue: false
          });

          expect(String(v)).to.be('<div class="container red"></div>');

          v.context.set("useBlue", true);
          v.context.set("useContainer", false);

          expect(String(v)).to.be('<div class="red blue"></div>');
        })
      });

      describe("style", function() {
        
      });

      describe("disable", function() {

      });

      describe("model", function() {

      });

    });
  });

});