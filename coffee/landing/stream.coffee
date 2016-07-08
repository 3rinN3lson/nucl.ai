root = exports ? this # global

$ ->
  section = $("section.stream-link")
  
  if section.length == 0 then return
  
  data = section.find("div.stream-data")
  live = section.find(".announcement.live")
  check = section.find(".announcement.check")

  liveNow = false

  data.find("span.day").each ->
    start = new Date $(@).attr "date-start"
    finish = new Date $(@).attr "date-finish"
    if start <= new Date() <= finish then liveNow = true

  if liveNow 
    live.addClass("block") 
    section.addClass("live")
  else
    check.addClass("block")
    section.addClass("check")


  $(window).resize ->
    $(".yt-iframe").each ->
      iframe = $(this);
      refElem = iframe.parent().parent()
      refElem.css('max-width', '1200px');
      refElem.css('margin', 'auto');
      if refElem.width() > 600
        w = iframe.attr('width').split("%")[0];
        h = refElem.width() * (9 * w) / (16 * 100);
        iframe.height h;
        iframe.width w + "%";
        iframe.css('padding-bottom', '2em')
        iframe.parent().find(".chat-iframe").height h;
        iframe.parent().find(".chat-iframe").width String(100 - w) + "%";
      else
        iframe.width $(window).width();
        iframe.css('padding-bottom', '0em');
        iframe.parent().find(".chat-iframe").width $(window).width();
        h = $(window).width() * 9 / 16 ;
        iframe.height h;
        iframe.parent().find(".chat-iframe").height h;
        iframe.parent().find(".chat-iframe").width $(window).width();


  $(".yt-iframe").each ->
    iframe = $(this);
    refElem = iframe.parent().parent()
    refElem.css('max-width', '1200px');
    refElem.css('margin', 'auto');
    if refElem.width() > 600
      w = iframe.attr('width').split("%")[0];

      h = refElem.width() * (9 * w) / (16 * 100);
      iframe.height h;
      iframe.width w + "%";
      iframe.css('padding-bottom', '2em');
      iframe.parent().find(".chat-iframe").height h;
      iframe.parent().find(".chat-iframe").width String(100 - w) + "%";
    else
      iframe.width $(window).width();
      iframe.css('padding-bottom', '0em');
      iframe.parent().find(".chat-iframe").width $(window).width();
      h = $(window).width() * 9 / 16 ;
      iframe.height h;
      iframe.parent().find(".chat-iframe").height h;
      iframe.parent().find(".chat-iframe").width $(window).width();

