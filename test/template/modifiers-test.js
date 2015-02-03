var pc   = require("../.."),
expect   = require("expect.js"),
BindableObject = require("bindable-object"),
stringifyView = require("../utils/stringifyView");

describe(__filename + "#", function () {


  
  it("can call uppercase()", function () {
    expect(pc.template("{{name|uppercase()}}").view({name:"abc"}).toString()).to.be("ABC");
  });

  it("can call lowercase()", function () {
    expect(pc.template("{{name|lowercase()}}").view({name:"ABC"}).toString()).to.be("abc");
  });

  it("can call titlecase()", function () {
    expect(pc.template("{{name|titlecase()}}").view({name:"abc"}).toString()).to.be("Abc");
  });

  it("can call json()", function () {

    var v = pc.template("{{a|json()}}").view({a:{b:1,c:2}});

    if (process.browser) {
      expect(stringifyView(v)).to.be('{"b":1,"c":2}');
    } else {
      expect(stringifyView(v)).to.be("{&#x22;b&#x22;:1,&#x22;c&#x22;:2}");
    }
  });

  it("can call multiple modifiers on one expression", function () {
    expect(pc.template("{{name|lowercase()|titlecase()}}").view({name:"ABC"}).toString()).to.be("Abc");
  });

  it("modifies the last expression only", function () {
    expect(pc.template("{{a+b|uppercase()}}").view({a:"a",b:"b"}).toString()).to.be("aB");
  });

  it("respects grouped expressions", function () {
    expect(pc.template("{{(a+b)|uppercase()}}").view({a:"a",b:"b"}).toString()).to.be("AB");
  });

  it("can register a custom modifer", function () {

    var tpl = pc.template("{{a|concat('b')}}");
    tpl.modifiers.concat = function (name, value) {
      return name + value;
    };
    
    expect(tpl.view({a:"a"}).toString()).to.be("ab")
  });

  it("recalls the modifier if a value changes", function () {
    var c = new BindableObject({
      a: "a"
    });

    var v = pc.template("{{a|uppercase()}}").view(c);
    expect(stringifyView(v)).to.be("A");
    c.set("a", "b");
    // v.runner.update();
    expect(stringifyView(v)).to.be("B");
  })


  // TODO - make this work!
  xit("can bind to a model", function () {
    

    var context = new BindableObject({
      firstName: "a",
      lastName: "b"
    });

    var tpl = pc.template("{{ ctx | fullName() }}");

    tpl.modifiers.fullName = function (v) {
      console.log(this);
      // if (v) this.bindings.push(v.on("change", v.update));
      return [v.get("firstName"), v.get("lastName")].join(" ");
    };

    var v = tpl.view({ ctx: context });

    expect(stringifyView(v)).to.be("a b");
    context.set("lastName", "c");
    expect(stringifyView(v)).to.be("a c");
    context.set("firstName", "b");
    expect(stringifyView(v)).to.be("b c");
  });

  xit("properly unwatches a bindable object if set to undefined", function () {

    var b = new BindableObject({
      a: "a"
    });

    var context = new BindableObject({
      b: b
    });

    var t = pc.template("{{b|json()}}").view(context);
    expect(t.bindings.script._bindings.length).to.be(2);
    expect(t.toString()).to.be("{&#x22;a&#x22;:&#x22;a&#x22;,&#x22;_events&#x22;:{}}");
    context.set("b", undefined);
    // v.runner.update();
    expect(t.bindings.script._bindings.length).to.be(1);
    expect(t.toString()).to.be("");
    context.set("b", b);
    // v.runner.update();
    expect(t.bindings.script._bindings.length).to.be(2);
    expect(t.toString()).to.be("{&#x22;a&#x22;:&#x22;a&#x22;,&#x22;_events&#x22;:{}}");
  });

  it("can be nested", function () {

    var tpl = pc.template("{{a|concat('b'|uppercase())}}");
    tpl.modifiers.concat = function (name, value) {
      return name + value;
    };
    expect(tpl.view({a:"a"}).toString()).to.be("aB");
  });
});
