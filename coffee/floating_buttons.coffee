root = exports ? this # global

## fixes floating button positon

$ ->
  $(".floating-buttons").each ->
    section = $(@)
    new Thumbnails section.attr('id'), false, true, false
    section.find("item .button-content").each ->
        button_content = $(@)
        parent_size = button_content.parent().height()
        button_content.height parent_size
        button_content.width parent_size

        button_content.parent().hover(() ->
            parent_size = button_content.parent().height()
            button_content.height parent_size
            button_content.width parent_size
        , () ->
            parent_size = button_content.parent().height()
            button_content.height parent_size
            button_content.width parent_size
        )