# {{view:{name:"ablah", source: "/source.js" }}}
# OR
# {{#view:{name"ablah"}}}
# blah
# {{/}}


class ViewDecor extends require("./base")
    
  ###
  ###

  bind: () ->
    super()
    @child.bind()

  ###
  ###

  dispose: () ->
    super()
    @child.dispose()

  ###
  ###

  load: (context, callback) ->
    tplName = "template.#{@clip.get("view.name") or @clip.get("view")}"
    wth = @clip.get("view.model") or undefined
    tpl = context.internal.get(tplName)
    return callback() if not tpl
    child = context.child().detachBuffer()

    onContentLoad = () =>
      child.set "content", child.buffer.join("")
      child.attachBuffer()
      @child = tpl.node.createContent()
      @child.load(@_childContext = child.child(wth), callback)

    if @node.content
      @node.content.load child, onContentLoad
    else 
      onContentLoad()

  ###
  ###

  _onChange: () ->
    @_childContext?.reset @clip.get "view.model"
  

module.exports = ViewDecor