(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.config = {
    mobile: {
      size: 432
    },
    header: {
      scrollSpeed: 500
    },
    thumbnails: {
      borderSize: 0.015
    },
    mapOptions: {
      scrollwheel: false,
      zoom: 18,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
  };

  moment.tz.setDefault("Europe/Austria");

}).call(this);

(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.animate = {
    onAnimatedEnd: "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",
    onTransitonEnd: "transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"
  };

}).call(this);

(function() {
  $(function() {
    var blob, dateStr, day, days, idx, item, result, schedule, _i, _j, _len, _len1;
    if ($("section.program-schedule").length === 0) {
      return;
    }
    if (url("?export") && url("?export") === "csv") {
      days = [];
      $(".list-schedule " + " table.talks-list").each(function() {
        return days.push($(this));
      });
      schedule = [];
      for (idx = _i = 0, _len = days.length; _i < _len; idx = ++_i) {
        day = days[idx];
        dateStr = day.attr("date");
        day.schedule = [];
        day.find(".track").each(function() {
          var begin, description, diffMs, end, filtered, location, minutes, slot, speakers, subject;
          begin = dateInVienna(dateStr + " " + $(this).attr("time-start"));
          end = dateInVienna(dateStr + " " + $(this).attr("time-finish"));
          location = $(this).find("p.title span.room-name").text().trim().replace(/\s+/g, ' ');
          speakers = $(this).find("p.speakers").text().trim().replace(/\s+/g, ' ');
          subject = $(this).find("p.title span.title").text().trim().replace(/\s+/g, ' ');
          if ($(this).find("p.title a").hasClass("wip")) {
            description = "";
          }
          if ($(this).hasClass("break")) {
            subject = $(this).text().trim().replace(/\s+/g, ' ');
            description = "";
            location = "";
          }
          slot = {
            "topic": subject,
            "speakers": speakers,
            "room": location,
            "start": begin,
            "finish": end,
            "day": idx + 1
          };
          filtered = false;
          if (url("?room") && url("?room") !== slot.room) {
            filtered = true;
          }
          if (url("?day") && parseInt(url("?day")) !== slot.day) {
            filtered = true;
          }
          if (url("?duration")) {
            diffMs = slot.finish - slot.start;
            minutes = Math.floor((diffMs / 1000) / 60);
            if (url("?duration") === "short" && minutes >= 45) {
              filtered = true;
            }
            if (url("?duration") === "long" && minutes < 45) {
              filtered = true;
            }
          }
          if (!filtered) {
            day.schedule.push(slot);
            return schedule.push(slot);
          }
        });
      }
      result = "topic,speakers,room,start,finish,day\r\n";
      schedule.sort(function(a, b) {
        return a.start - b.start;
      });
      for (_j = 0, _len1 = schedule.length; _j < _len1; _j++) {
        item = schedule[_j];
        result += '"' + item.topic + '"' + "," + '"' + item.speakers + '"' + "," + item.room + "," + item.start + "," + item.finish + "," + item.day + "\r\n";
      }
      blob = new Blob([result], {
        type: "text/csv;charset=utf-8"
      });
      return saveAs(blob, "schedule.csv");
    }
  });

}).call(this);

(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  $(function() {
    var build, geocoder;
    if ($("section.events").lenght === 0) {
      return;
    }
    geocoder = new google.maps.Geocoder();
    build = function() {
      return $("div.map.event").each(function() {
        var ev;
        ev = $(this);
        return geocoder.geocode({
          'address': ev.attr("location")
        }, function(results, status) {
          var latLng, mapCanvas, marker, request, service;
          ev.lat = results[0].geometry.location.lat();
          ev.lng = results[0].geometry.location.lng();
          mapCanvas = ev[0];
          latLng = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
          ev.map = new google.maps.Map(mapCanvas, $.extend(root.config.mapOptions, {
            center: latLng
          }));
          if (ev.attr("placeId")) {
            service = new google.maps.places.PlacesService(ev.map);
            request = {
              placeId: ev.attr("placeId")
            };
            return service.getDetails(request, function(place, status) {
              var marker;
              if (status === google.maps.places.PlacesServiceStatus.OK) {
                marker = new google.maps.Marker({
                  map: ev.map,
                  position: place.geometry.location
                });
                return ev.map.setCenter(place.geometry.location);
              }
            });
          } else {
            return marker = new google.maps.Marker({
              position: latLng,
              map: ev.map
            });
          }
        });
      });
    };
    return google.maps.event.addDomListener(window, 'load', build);
  });

}).call(this);

(function() {
  var descriptionInClass, descriptionOutClass, root, slideInClass, slideOutClass;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  slideInClass = "fadeInLeftBig";

  slideOutClass = "fadeOutRightBig";

  descriptionInClass = "fadeInRightBig";

  descriptionOutClass = "fadeOutLeftBig";

  $(function() {
    var select;
    select = function(collection, menu, clicked, inClass, outClass) {
      var selected, slideIn;
      slideIn = function(selected, collection, inClass, outClass) {
        var exec;
        exec = function() {
          if (!menu.find("item[name='" + selected.attr('name') + "']").hasClass("selected")) {
            selected.removeClass("selected");
          }
          if (clicked.hasClass("selected")) {
            selected = collection.find("item[name='" + clicked.attr('name') + "']");
            selected.removeClass(outClass);
            selected.addClass("selected " + inClass);
            return selected.one(animate.onAnimatedEnd, function() {
              if (clicked.hasClass("selected")) {
                selected.find("div.cover").removeClass("fadeIn");
                return selected.find("div.cover").addClass("fadeOut");
              }
            });
          }
        };
        if (selected.hasClass("selected") && !menu.find("item[name='" + selected.attr('name') + "']").hasClass("selected")) {
          selected.addClass(outClass);
          selected.removeClass(inClass);
          selected.addClass(outClass);
          return selected.one(animate.onAnimatedEnd, exec);
        }
      };
      selected = collection.find("item.selected");
      if (selected.find("div.cover").hasClass("fadeOut")) {
        selected.find("div.cover").removeClass("fadeOut");
        selected.find("div.cover").addClass("fadeIn");
        return selected.one(animate.onAnimatedEnd, function() {
          return slideIn(selected, collection, slideInClass, slideOutClass);
        });
      } else {
        return slideIn(selected, collection, slideInClass, slideOutClass);
      }
    };
    return $("gallery").each(function() {
      var galery, menu, slides;
      galery = $(this);
      menu = galery.find("menu");
      slides = galery.find("slides");
      return menu.find("item").click(function() {
        var clicked, selected;
        clicked = $(this);
        selected = menu.find("item.selected");
        if (selected.is(clicked)) {
          return false;
        }
        selected.removeClass("selected");
        clicked.addClass("selected");
        return select(slides, menu, clicked, slideInClass, slideOutClass);
      });
    });
  });

}).call(this);

(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  $(function() {
    return $(".ical-button").each(function() {
      var dateStr, day, days, filename, ical, icalButton, source, _i, _len;
      icalButton = $(this);
      ical = ics();
      source = icalButton.attr("source") ? icalButton.attr("source") : "";
      days = [];
      $(".list-schedule " + source + " table.talks-list").each(function() {
        return days.push($(this));
      });
      for (_i = 0, _len = days.length; _i < _len; _i++) {
        day = days[_i];
        dateStr = day.attr("date");
        filename = dateStr.replace("/", "-");
        day.find(".track").each(function() {
          var begin, description, end, location, speakers, subject;
          begin = dateInVienna(dateStr + " " + $(this).attr("time-start"));
          end = dateInVienna(dateStr + " " + $(this).attr("time-finish"));
          location = $(this).find("p.title span.room-name").text().trim().replace(/\s+/g, ' ');
          speakers = $(this).find("p.speakers").text().trim().replace(/\s+/g, ' ');
          subject = $(this).find("p.title span.title").text().trim().replace(/\s+/g, ' ');
          if (speakers) {
            subject = subject + " [" + speakers + "]";
          }
          description = window.location.host + $(this).find("p.title a").attr("href");
          if ($(this).find("p.title a").hasClass("wip")) {
            description = "";
          }
          if ($(this).hasClass("break")) {
            subject = $(this).text().trim().replace(/\s+/g, ' ');
            description = "";
            location = "";
          }
          return ical.addEvent(subject, description, location, begin, end);
        });
      }
      return icalButton.click(function() {
        if ($("html").hasClass("safari")) {
          $("popup.ical").addClass("active");
        } else {
          ical.download(icalButton.attr("filename"));
        }
        return false;
      });
    });
  });

}).call(this);

(function() {


}).call(this);

(function() {
  $(function() {
    if ($("#speakers-section").length > 0) {
      new Thumbnails("speakers-section", true, false);
    }
    if ($("#chairs-section").length > 0) {
      new Thumbnails("chairs-section", true, false);
    }
    if ($("#team-section").length > 0) {
      return new Thumbnails("team-section", true, false);
    }
  });

}).call(this);

(function() {
  $(function() {
    var setSponsorsSize;
    setSponsorsSize = function() {
      return $("section.sponsors item.sponsor").each(function() {
        var sponsor;
        sponsor = $(this);
        return sponsor.height(sponsor.width());
      });
    };
    $(window).resize(function() {
      return setSponsorsSize();
    });
    return setSponsorsSize();
  });

}).call(this);

(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  $(function() {
    var check, data, live, liveNow, section;
    section = $("section.stream-link");
    if (section.length === 0) {
      return;
    }
    data = section.find("div.stream-data");
    live = section.find(".announcement.live");
    check = section.find(".announcement.check");
    liveNow = false;
    data.find("span.day").each(function() {
      var finish, start, _ref;
      start = new Date($(this).attr("date-start"));
      finish = new Date($(this).attr("date-finish"));
      if ((start <= (_ref = new Date()) && _ref <= finish)) {
        return liveNow = true;
      }
    });
    if (liveNow) {
      live.addClass("block");
      return section.addClass("live");
    } else {
      check.addClass("block");
      return section.addClass("check");
    }
  });

}).call(this);

(function() {
  var LONG_INTERAL, SHORT_INTERVAL, animationType, effectIn, effectOut;

  effectIn = "flipInX";

  effectOut = "flipOutX";

  SHORT_INTERVAL = 450;

  LONG_INTERAL = 10000;

  animationType = "";

  $(function() {
    var sections;
    sections = [];
    return $(".testimonials").each(function() {
      var change, idxCurrent, next, pair, select, testimonials;
      testimonials = $(this).find(".testimonial").toArray();
      if ($(this).hasClass("domino")) {
        idxCurrent = 0;
        pair = 0;
        change = function() {
          var interval;
          interval = LONG_INTERAL;
          if (idxCurrent % 2 !== 0) {
            interval = SHORT_INTERVAL;
          }
          return setTimeout(select, interval);
        };
        next = function(idx, incBy) {
          idx += incBy;
          if (idx === testimonials.length) {
            return 0;
          }
          if (idx === testimonials.length + 1) {
            return 1;
          }
          return idx;
        };
        select = function() {
          var nextIdx, wasCurrent;
          if (pair === 2) {
            return change();
          }
          pair += 1;
          $(testimonials[idxCurrent]).removeClass(effectIn);
          $(testimonials[idxCurrent]).addClass(effectOut);
          wasCurrent = idxCurrent;
          nextIdx = next(idxCurrent, 2);
          idxCurrent = next(idxCurrent, 1);
          change();
          return $(testimonials[wasCurrent]).one(animate.onAnimatedEnd, function(data) {
            if (animationType === "") {
              animationType = data.type;
            } else if (animationType !== data.type) {
              return;
            }
            pair -= 1;
            $(testimonials[wasCurrent]).removeClass("selected");
            $(testimonials[nextIdx]).removeClass(effectOut);
            return $(testimonials[nextIdx]).addClass("selected " + effectIn);
          });
        };
        return change();
      }
      idxCurrent = 0;
      select = function() {
        $(testimonials[idxCurrent]).removeClass(effectIn);
        $(testimonials[idxCurrent]).addClass(effectOut);
        return $(testimonials[idxCurrent]).one(animate.onAnimatedEnd, function(data) {
          if (animationType === "") {
            animationType = data.type;
          } else if (animationType !== data.type) {
            return;
          }
          $(testimonials[idxCurrent]).removeClass("selected");
          idxCurrent = idxCurrent === testimonials.length - 1 ? idxCurrent = 0 : idxCurrent + 1;
          $(testimonials[idxCurrent]).removeClass(effectOut);
          $(testimonials[idxCurrent]).addClass("selected " + effectIn);
          return setTimeout(select, LONG_INTERAL);
        });
      };
      return select();
    });
  });

}).call(this);

(function() {
  $(function() {
    var thumbnails;
    if ($("#section-topics").length === 0) {
      return;
    }
    return thumbnails = new Thumbnails("section-topics", false, true, false);
  });

}).call(this);

(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  $(function() {
    var setSize;
    setSize = function(section) {
      return section.find("item .button-content").each(function() {
        var button_content, parent_size;
        button_content = $(this);
        parent_size = button_content.parent().height();
        button_content.height(parent_size);
        button_content.width(parent_size);
        return button_content.parent().hover(function() {
          var parent_size_hover;
          parent_size_hover = button_content.parent().height();
          button_content.height(parent_size_hover);
          return button_content.width(parent_size_hover);
        }, function() {
          button_content.height(parent_size);
          return button_content.width(parent_size);
        });
      });
    };
    return $(".links-buttons").each(function() {
      var section;
      section = $(this);
      new Thumbnails(section.attr('id'), false, true, false);
      setSize(section);
      return $(window).resize(function() {
        return setSize(section);
      });
    });
  });

}).call(this);

(function() {
  $(function() {
    var maxShowingNumber, sponsorTimeout, thisSameDate, updateCredits, updateCreditsSize, updateSponsor, updateTalk;
    if ($("#section-lobby").length === 0) {
      return;
    }
    thisSameDate = function(date1, date2) {
      return date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
    };
    maxShowingNumber = 1;
    updateCreditsSize = function(slot) {
      if ($(".credits").length > 0 && slot) {
        return $(".credits").height(slot.parent().outerHeight());
      }
    };
    updateTalk = function() {
      var date, offset, room;
      date = new Date();
      if (url("?date") !== null) {
        date = new Date(decodeURIComponent(url("?date")));
      }
      offset = 0;
      if (url("?offset") !== null) {
        offset = parseInt(url("?offset"));
      }
      date.setMinutes(date.getMinutes() + offset);
      room = "all";
      if (url("?room")) {
        room = url("?room");
      }
      $("table").each(function() {
        var day, dayStr, slot, slots, toShow, _i, _len, _results;
        dayStr = $(this).attr("date");
        day = new Date(dayStr);
        if (thisSameDate(date, day)) {
          slots = [];
          $(this).find("div.track").each(function() {
            if (room === "all" || $(this).attr("room") === "all" || room === $(this).attr("room")) {
              return slots.push($(this));
            } else {
              return $(this).remove();
            }
          });
          slots.sort(function(a, b) {
            a.dateStart = new Date(dayStr + " " + a.attr("time-start"));
            a.dateEnd = new Date(dayStr + " " + a.attr("time-finish"));
            b.dateStart = new Date(dayStr + " " + b.attr("time-start"));
            b.dateEnd = new Date(dayStr + " " + b.attr("time-finish"));
            return a.dateStart - b.dateStart;
          });
          toShow = maxShowingNumber;
          _results = [];
          for (_i = 0, _len = slots.length; _i < _len; _i++) {
            slot = slots[_i];
            if ($(".show-current").length > 0) {
              if (slot.dateStart <= date && slot.dateEnd > date && toShow > 0) {
                slot.show();
                updateCreditsSize(slot);
                slot.addClass("selected");
                _results.push(toShow--);
              } else {
                slot.hide();
                _results.push(slot.removeClass("selected"));
              }
            } else {
              if (slot.dateStart >= date && toShow > 0) {
                slot.show();
                slot.addClass("selected");
                updateCreditsSize(slot);
                _results.push(toShow--);
              } else {
                slot.hide();
                _results.push(slot.removeClass("selected"));
              }
            }
          }
          return _results;
        } else {
          $(this).hide();
          return $(this).removeClass("selected");
        }
      });
      return setTimeout(updateTalk, 1000);
    };
    sponsorTimeout = 10000;
    updateSponsor = function() {
      var currentDay, date, day, days, selectNext, sponsor, sponsors, timeout, timout, _i, _j, _len, _len1;
      date = new Date();
      if (url("?date") !== null) {
        date = new Date(decodeURIComponent(url("?date")));
      }
      days = [];
      $(".sponsors-list .day").each(function() {
        var day;
        day = $(this);
        day.date = new Date(day.attr("date"));
        return days.push(day);
      });
      currentDay = null;
      for (_i = 0, _len = days.length; _i < _len; _i++) {
        day = days[_i];
        if (day.date.getDate() === date.getDate()) {
          currentDay = day.addClass("selected");
          day.height(day.width());
        } else {
          day.removeClass("selected");
        }
      }
      sponsors = [];
      currentDay.find(".sponsor-wrap").each(function() {
        return sponsors.push($(this));
      });
      selectNext = false;
      for (_j = 0, _len1 = sponsors.length; _j < _len1; _j++) {
        sponsor = sponsors[_j];
        if (sponsor.hasClass("selected")) {
          sponsor.removeClass("selected");
          selectNext = true;
        } else if (selectNext) {
          sponsor.addClass("selected");
          break;
        }
      }
      if (currentDay.find(".sponsor-wrap.selected").length === 0) {
        currentDay.find(".sponsor-wrap").first().addClass("selected");
      }
      timout = sponsorTimeout;
      if ($(".sponsor-wrap.selected").attr("duration")) {
        timeout = parseInt($(".sponsor-wrap.selected").attr("duration"));
      }
      return setTimeout(updateSponsor, timeout);
    };
    updateCredits = function() {
      if ($(".credits").hasClass("on")) {
        $(".credits").removeClass("on");
        $(".credits").hide();
        return setTimeout(updateCredits, parseInt($(".credits").attr("interval-off")));
      } else {
        $(".credits").addClass("on");
        $(".credits").show();
        return setTimeout(updateCredits, parseInt($(".credits").attr("interval-on")));
      }
    };
    if ($(".credits").length > 0) {
      if ($(".credits").attr("show-on-start") === "true") {
        updateCredits();
      } else {
        setTimeout(updateCredits, parseInt($(".credits").attr("interval-off")));
      }
    }
    updateTalk();
    return updateSponsor();
  });

}).call(this);

(function() {
  var disableWip, enableSections, root, scroll;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.scrollLocked = false;

  scroll = function(id, scrollTo) {
    var promise;
    root.scrollLocked = true;
    promise = $('html, body').animate({
      scrollTop: scrollTo
    }, config.header.scrollSpeed, function() {}).promise();
    return promise.done(function() {
      if (history.replaceState) {
        history.replaceState(null, null, "#" + id);
        return setTimeout(function() {
          return root.scrollLocked = false;
        }, 300);
      }
    });
  };

  root.scroll = scroll;

  enableSections = function() {
    var bottomEdge;
    if ($("content").length === $("content.visited").length) {
      return;
    }
    bottomEdge = $(window).scrollTop() + $(window).height();
    return $("section").each(function() {
      if ($(this).offset().top < bottomEdge) {
        return $(this).find("content, h2").addClass("visited");
      }
    });
  };

  $(window).load(function() {
    return root.scrollLocked = false;
  });

  disableWip = function() {
    return $("a.wip").click(function() {
      return false;
    });
  };

  $(function() {
    if (navigator.userAgent.match(/(iPad|iPhone|iPod)/g)) {
      $("html").addClass("ios");
    }
    if (navigator.userAgent.toLowerCase().indexOf("safari") > -1 && navigator.userAgent.toLowerCase().indexOf("chrome") === -1) {
      $("html").addClass("safari");
    }
    $(window).scroll(function() {
      enableSections();
      if (!root.scrollLocked && window.location.hash !== "") {
        if ($(window.location.hash).offset().top * 0.95 > $(window).scrollTop() || $(window.location.hash).offset().top * 1.05 < $(window).scrollTop()) {
          if (history.replaceState) {
            return history.replaceState(null, null, ' ');
          }
        }
      }
    });
    enableSections();
    return disableWip();
  });

  enableSections();

  root.disableWip = disableWip;

  root.dateInVienna = function(dateString) {
    var d, formattedDateString;
    moment.tz.setDefault("Europe/Vienna");
    formattedDateString = dateString.replace(/\//g, ' ');
    d = moment(formattedDateString, "YYYY MM DD HH:mm");
    return new Date(d.toString());
  };

}).call(this);

(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  $(function() {
    var checkStickyAndSelect, expanded, links, navigation, selectNavPosition, splash;
    $(document).keyup(function(e) {
      if (e.keyCode === 27) {
        return $(".navigation .expanded").each(function() {
          return $(this).removeClass("expanded");
        });
      }
    });
    navigation = $(".navigation");
    splash = $("section.splash-screen");
    links = $(".navigation a");
    links.each(function() {
      var hash;
      this.jQlink = $(this);
      hash = this.jQlink.attr("href") ? this.jQlink.attr("href").split("#")[1] : "";
      this.jQscrollTo = $("#" + hash);
      if (!hash || hash === "") {
        return this.jQsection = [];
      } else {
        return this.jQsection = $("section." + hash);
      }
    });
    expanded = $(".navigation a.expanded");
    $('html').click(function() {
      expanded = $(".navigation a.expanded");
      expanded.toggleClass("expanded");
      expanded.parent().toggleClass("expanded");
      return expanded = $(".navigation a.expanded");
    });
    links.each(function() {
      return this.jQlink.click(function(event) {
        var linkHref;
        event.stopPropagation();
        if (this.jQlink.hasClass("expandable") && !(this.jQlink.hasClass("disabled"))) {
          this.jQlink.toggleClass("expanded");
          this.jQlink.parent().toggleClass("expanded");
          if (expanded.length === 1 && expanded[0] !== this.jQlink[0]) {
            expanded.toggleClass("expanded");
            expanded.parent().toggleClass("expanded");
          }
          expanded = $(".navigation a.expanded");
          return false;
        }
        if (expanded.length === 1) {
          expanded.toggleClass("expanded");
          expanded.parent().toggleClass("expanded");
          expanded = $(".navigation a.expanded");
        }
        if (this.jQlink.hasClass("disabled")) {
          return false;
        }
        if (!(this.jQlink.attr("href"))) {
          return;
        }
        linkHref = this.jQlink.attr("href");
        if (linkHref.substring(0, 1) === "/") {
          return true;
        }
        root.scroll(this.jQscrollTo.attr("id"), this.jQscrollTo.offset().top);
        return false;
      });
    });
    selectNavPosition = function() {
      var linkToSelect;
      linkToSelect = null;
      links.each(function() {
        if (this.jQsection.length === 0) {
          return;
        }
        if ($(window).scrollTop() + navigation.height() >= -1 + this.jQsection.first().offset().top && $(window).scrollTop() + navigation.height() < this.jQsection.last().offset().top + this.jQsection.last().height()) {
          if (navigation.hasClass("sticky")) {
            return linkToSelect = this.jQlink;
          }
        }
      });
      navigation.find("item.selected").removeClass("selected");
      if (linkToSelect) {
        if (linkToSelect.hasClass("logo")) {
          linkToSelect.parent().parent().addClass("selected");
        }
        return linkToSelect.parent().addClass("selected");
      }
    };
    checkStickyAndSelect = function() {
      if (window.location.pathname === "/stream/") {
        return;
      }
      if ($(this).scrollTop() > splash.height()) {
        navigation.addClass("sticky");
      } else {
        navigation.removeClass("sticky");
      }
      if ($("sections.page").length > 0) {
        return;
      }
      return selectNavPosition();
    };
    $(window).scroll(function() {
      return checkStickyAndSelect();
    });
    return checkStickyAndSelect();
  });

}).call(this);

(function() {


}).call(this);

(function() {
  $(function() {
    var thumbnails;
    if ($("#section-tracks").length === 0) {
      return;
    }
    return thumbnails = new Thumbnails("section-tracks", true, true);
  });

}).call(this);

(function() {
  var cellMargin, disableEmptyIntervals, root, timelineIntervalRange;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  timelineIntervalRange = 15;

  disableEmptyIntervals = true;

  cellMargin = null;

  $(function() {
    var buildSchedule, speakers, tableDisplayed;
    speakers = $("section.program-schedule p.speakers");
    speakers.each(function() {
      var idx, studio, studios, _i, _len, _results;
      if ($(this).find(".studio").length > 1) {
        studios = [];
        $(this).find(".studio").each(function() {
          return studios.push($(this));
        });
        _results = [];
        for (idx = _i = 0, _len = studios.length; _i < _len; idx = ++_i) {
          studio = studios[idx];
          if (idx < studios.length - 1) {
            if (studio.html() === studios[idx + 1].html()) {
              _results.push(studio.remove());
            } else {
              _results.push(void 0);
            }
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    });
    buildSchedule = function() {
      return $("section.program-schedule grid").each(function() {
        var assignIntervals, available_rooms, day, dayIdx, days, duration, ellipsisBottom, emptyIntervals, finishTime, idx, interval, intervalDate, intervalHeight, intervalsCount, lastInterval, margin, markEmpty, maxHeightDurationRatio, minutes, offset, positionTop, room, schedule, startTime, talk, talkHoverEnd, talkHoverStart, talks, talksDuration, talksFinishTime, talksStartTime, talks_order, timeLineHeight, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _len6, _len7, _m, _n, _o, _p, _q, _ref, _ref1, _ref2, _ref3, _ref4, _results;
        schedule = $(this);
        days = [];
        schedule.find("table.talks-list").each(function() {
          return days.push($(this));
        });
        for (dayIdx = _i = 0, _len = days.length; _i < _len; dayIdx = ++_i) {
          day = days[dayIdx];
          day.addClass("not-initialized");
          day.addClass("not-positioned");
          talks = day.find("div.track");
          day.talks = [];
          if (talks.length <= 1) {
            return;
          }
          talks.sort(function() {
            return 0.5 - Math.random();
          });
          available_rooms = ['amphitheatre', 'masterclass', 'laboratories'];
          talks_order = {
            'amphitheatre': 0,
            'masterclass': 0,
            'laboratories': 0
          };
          talks.each(function() {
            if ($(this).attr("time-start") && $(this).attr("time-finish") && $(this).attr("time-start") !== "??:??") {
              return day.talks.push($(this));
            }
          });
          if (day.talks.length === 0) {
            continue;
          }
          _ref = day.talks;
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            talk = _ref[_j];
            startTime = talk.attr("time-start");
            finishTime = talk.attr("time-finish");
            talk.startDate = new Date(day.attr("date") + "  " + startTime);
            talk.finishDate = new Date(day.attr("date") + "  " + finishTime);
          }
          talksStartTime = day.talks[0].startDate;
          talksFinishTime = day.talks[0].finishDate;
          day.talks.sort(function(a, b) {
            if (talksStartTime === null || talksStartTime > a.startDate) {
              talksStartTime = a.startDate;
            }
            if (talksStartTime === null || talksStartTime > b.startDate) {
              talksStartTime = b.startDate;
            }
            if (talksFinishTime === null || talksFinishTime < a.finishDate) {
              talksFinishTime = a.finishDate;
            }
            if (talksFinishTime === null || talksFinishTime < b.finishDate) {
              talksFinishTime = b.finishDate;
            }
            return a.startDate - b.startDate;
          });
          _ref1 = day.talks;
          for (idx = _k = 0, _len2 = _ref1.length; _k < _len2; idx = ++_k) {
            talk = _ref1[idx];
            talk.attr("idx", idx);
            talk.attr("day", dayIdx);
            duration = (talk.finishDate.getHours() * 60 + talk.finishDate.getMinutes()) - (talk.startDate.getHours() * 60 + talk.startDate.getMinutes());
            talk.attr("duration", duration);
            offset = (talk.startDate.getHours() * 60 + talk.startDate.getMinutes()) - (talksStartTime.getHours() * 60 + talksStartTime.getMinutes());
            talk.attr("offset", offset);
            if (talk.finishDate.getHours() === talksFinishTime.getHours() && talk.finishDate.getMinutes() === talksFinishTime.getMinutes()) {
              talk.attr("last", "true");
            }
          }
          markEmpty = function(interval) {
            var _l, _len3, _ref2;
            interval.empty = false;
            _ref2 = day.talks;
            for (_l = 0, _len3 = _ref2.length; _l < _len3; _l++) {
              talk = _ref2[_l];
              if (talk.startDate <= interval.startDate && talk.finishDate >= interval.finishDate) {
                return;
              }
            }
            interval.empty = true;
            interval.attr("empty", true);
            return interval.addClass("empty");
          };
          if (schedule.hasClass("rooms-schedule")) {
            day.find("td.talks-list").remove();
            _ref2 = day.talks;
            for (_l = 0, _len3 = _ref2.length; _l < _len3; _l++) {
              talk = _ref2[_l];
              room = talk.attr("room");
              if (!room || room === "" || room === "all") {
                day.find("td.breaks").append(talk);
              } else {
                day.find("td." + room).append(talk);
              }
            }
            talksDuration = (talksFinishTime.getHours() * 60 + talksFinishTime.getMinutes()) - (talksStartTime.getHours() * 60 + talksStartTime.getMinutes());
            intervalsCount = talksDuration / timelineIntervalRange;
            day.intervals = [];
            lastInterval = null;
            day.find("td.timeline div.interval").each(function() {
              var interval;
              interval = $(this);
              if (!interval.hasClass("pattern") && !interval.hasClass("cover-empty")) {
                return interval.remove();
              }
            });
            for (idx = _m = 0; 0 <= intervalsCount ? _m < intervalsCount : _m > intervalsCount; idx = 0 <= intervalsCount ? ++_m : --_m) {
              interval = day.find("td.timeline div.interval.pattern").clone().removeClass("pattern");
              intervalDate = new Date(talksStartTime);
              intervalDate.setMinutes(intervalDate.getMinutes() + idx * timelineIntervalRange);
              interval.startDate = new Date(intervalDate);
              minutes = intervalDate.getMinutes() >= 10 ? intervalDate.getMinutes() : "0" + intervalDate.getMinutes();
              startTime = intervalDate.getHours() + ":" + minutes;
              interval.addClass(intervalDate.getHours() + "_" + minutes);
              intervalDate.setMinutes(intervalDate.getMinutes() + timelineIntervalRange);
              interval.finishDate = new Date(intervalDate);
              minutes = intervalDate.getMinutes() >= 10 ? intervalDate.getMinutes() : "0" + intervalDate.getMinutes();
              finishTime = intervalDate.getHours() + ":" + minutes;
              interval.find(".interval-time.start").text(startTime);
              if (idx === intervalsCount - 1) {
                interval.find(".interval-time.finish").text(finishTime);
              }
              if (disableEmptyIntervals) {
                markEmpty(interval);
                interval.displayed = true;
                if (lastInterval !== null && lastInterval.empty && interval.empty) {
                  interval.addClass("next-empty");
                  interval.displayed = false;
                }
                if (!interval.empty && lastInterval !== null && lastInterval.empty && !lastInterval.hasClass("next-empty")) {
                  lastInterval.addClass("orhpaned-empty");
                }
                lastInterval = interval;
              }
              day.find("td.timeline").append(interval);
              day.intervals.push(interval);
            }
          } else {
            day.find("td.talks-list").html("");
            day.append(day.talks);
            day.removeClass("not-positioned");
          }
          day.removeClass("not-initialized");
          root.disableWip();
        }
        if (!schedule.hasClass("rooms-schedule")) {
          return;
        }
        if ($("div.interval").length === 0) {
          return;
        }
        cellMargin = $("div.interval").first().css("padding-top").split("px")[0];
        maxHeightDurationRatio = 0;
        schedule.find("table.talks-list div.track").each(function() {
          var height, ratio;
          height = $(this).height();
          duration = $(this).attr("duration");
          ratio = height / duration;
          if (ratio > maxHeightDurationRatio) {
            return maxHeightDurationRatio = ratio;
          }
        });
        schedule.find("table.talks-list div.track").each(function() {
          var timelineAlignment;
          duration = $(this).attr("duration");
          timelineAlignment = ((duration / timelineIntervalRange) - 1) * cellMargin;
          return $(this).height((duration * maxHeightDurationRatio) + timelineAlignment);
        });
        intervalHeight = timelineIntervalRange * maxHeightDurationRatio;
        timeLineHeight = null;
        schedule.find("table.talks-list td.timeline div.interval:not(.cover-empty)").each(function() {
          return $(this).height(intervalHeight);
        });
        timeLineHeight = schedule.find("table.talks-list td.timeline div.interval:last-child .finish").height();
        schedule.find("table.talks-list td.timeline div.interval:last-child").each(function() {
          var currentHeight;
          currentHeight = $(this).height();
          return $(this).height(timeLineHeight + currentHeight);
        });
        schedule.find("div.track[last='true']").each(function() {
          var currentHeight;
          currentHeight = $(this).height();
          return $(this).height(currentHeight + timeLineHeight + parseInt(cellMargin));
        });
        ellipsisBottom = Math.floor((intervalHeight - timeLineHeight) / 2);
        schedule.find("table.talks-list td.timeline div.interval .ellipsis").each(function() {
          return $(this).css("bottom", ellipsisBottom);
        });
        for (_n = 0, _len4 = days.length; _n < _len4; _n++) {
          day = days[_n];
          emptyIntervals = function(talk) {
            var empty, _len5, _o, _ref3;
            empty = 0;
            _ref3 = day.intervals;
            for (_o = 0, _len5 = _ref3.length; _o < _len5; _o++) {
              interval = _ref3[_o];
              if (!interval.displayed && interval.startDate < talk.startDate) {
                empty++;
              }
              if (interval.startDate >= talk.startDate) {
                return empty;
              }
            }
            return empty;
          };
          _ref3 = day.talks;
          for (_o = 0, _len5 = _ref3.length; _o < _len5; _o++) {
            talk = _ref3[_o];
            offset = talk.attr("offset");
            positionTop = offset * maxHeightDurationRatio;
            margin = ((offset / timelineIntervalRange) + 1) * cellMargin;
            positionTop = positionTop + margin;
            positionTop = positionTop - emptyIntervals(talk) * intervalHeight;
            positionTop = positionTop - emptyIntervals(talk) * cellMargin;
            talk.css("top", positionTop + "px");
          }
        }
        assignIntervals = function(talk) {
          var _len6, _p, _ref4, _results;
          talk.intervals = [];
          _ref4 = day.intervals;
          _results = [];
          for (_p = 0, _len6 = _ref4.length; _p < _len6; _p++) {
            interval = _ref4[_p];
            if (interval.startDate.getHours() === talk.startDate.getHours() && interval.startDate.getMinutes() === talk.startDate.getMinutes() || interval.startDate.getHours() === talk.finishDate.getHours() && interval.startDate.getMinutes() === talk.finishDate.getMinutes()) {
              interval.addClass("edge");
            }
            if (interval.startDate >= talk.startDate && interval.finishDate <= talk.finishDate) {
              _results.push(talk.intervals.push(interval));
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        };
        talkHoverStart = function(evt) {
          var _len6, _p, _ref4;
          idx = $(this).attr("idx");
          day = $(this).attr("day");
          talk = days[day].talks[idx];
          _ref4 = talk.intervals;
          for (idx = _p = 0, _len6 = _ref4.length; _p < _len6; idx = ++_p) {
            interval = _ref4[idx];
            interval.addClass("hovered");
            if (idx === talk.intervals.length - 1) {
              interval.addClass("hovered-edge");
            }
          }
          return talk.addClass("hovered");
        };
        talkHoverEnd = function(evt) {
          var _len6, _p, _ref4;
          idx = $(this).attr("idx");
          day = $(this).attr("day");
          talk = days[day].talks[idx];
          _ref4 = talk.intervals;
          for (_p = 0, _len6 = _ref4.length; _p < _len6; _p++) {
            interval = _ref4[_p];
            interval.removeClass("hovered");
            interval.removeClass("hovered-edge");
          }
          return talk.removeClass("hovered");
        };
        _results = [];
        for (_p = 0, _len6 = days.length; _p < _len6; _p++) {
          day = days[_p];
          _ref4 = day.talks;
          for (_q = 0, _len7 = _ref4.length; _q < _len7; _q++) {
            talk = _ref4[_q];
            if (talk.find("a").hasClass("wip")) {
              continue;
            }
            assignIntervals(talk);
            talk.hover(talkHoverStart, talkHoverEnd);
          }
          _results.push(day.removeClass("not-positioned"));
        }
        return _results;
      });
    };
    buildSchedule();
    tableDisplayed = $("section grid.rooms-schedule").css("display");
    $(window).resize(function() {
      var displayed;
      if (tableDisplayed === "none") {
        displayed = $("section grid.rooms-schedule").css("display");
        if (displayed !== tableDisplayed) {
          tableDisplayed = displayed;
          return buildSchedule();
        }
      }
    });
    return $("section.program-schedule table").click(function() {
      var button, name, talksList;
      button = $(this).find(".button-expand");
      button.toggleClass("expanded");
      name = button.attr("name");
      talksList = $("table.talks-list[name='" + name + "']");
      talksList.removeClass("not-expanded");
      if (!button.hasClass("expanded")) {
        talksList.addClass("zoomOut");
      } else {
        talksList.removeClass("zoomOut");
      }
      return talksList.one(animate.onAnimatedEnd, function() {
        if (!button.hasClass("expanded")) {
          return talksList.addClass("not-expanded");
        }
      });
    });
  });

}).call(this);

(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  $(function() {
    if ($("sections.page section.stream").length === 0) {
      return;
    }
    return $("table.talks-list").each(function() {
      var dateStr, list;
      list = $(this);
      dateStr = list.attr("date");
      return list.find(".track").each(function() {
        var date, hoursStr, minutesStr, timeStartStr, track;
        track = $(this);
        if (track.attr("time-start")) {
          timeStartStr = track.attr("time-start");
          date = root.dateInVienna(dateStr + timeStartStr);
          hoursStr = date.getHours() < 10 ? "0" + date.getHours().toString() : date.getHours().toString();
          minutesStr = date.getMinutes() < 10 ? "0" + date.getMinutes().toString() : date.getMinutes().toString();
          return track.find(".time").html(hoursStr + ":" + minutesStr);
        }
      });
    });
  });

}).call(this);

(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  $(function() {
    var hoverIn, hoverOut, hoverToggle, scrollToEventbriteTickets;
    if ($("section.tickets").length === 0) {
      return;
    }
    hoverIn = function() {
      return hoverToggle("in", $(this));
    };
    hoverOut = function() {
      return hoverToggle("out", $(this));
    };
    hoverToggle = function(inOut, cell) {
      var wrap;
      wrap = cell.parent().parent();
      if (cell.parent().hasClass("invisible")) {
        return;
      }
      cell.parent().find(".centered-cell").each(function() {
        if (!$(this).parent().hasClass("titlerow") && !$(this).parent().hasClass("invisible")) {
          if (inOut === "in") {
            $(this).addClass("hovered");
          }
          if (inOut === "out") {
            return $(this).removeClass("hovered");
          }
        }
      });
      if (cell.hasClass("all-access")) {
        wrap.find(".all-access .centered-cell").each(function() {
          if (inOut === "in") {
            $(this).addClass("hovered");
          }
          if (inOut === "out") {
            return $(this).removeClass("hovered");
          }
        });
      }
      if (cell.hasClass("conference")) {
        wrap.find(".conference .centered-cell").each(function() {
          if (inOut === "in") {
            $(this).addClass("hovered");
          }
          if (inOut === "out") {
            return $(this).removeClass("hovered");
          }
        });
      }
      if (cell.hasClass("single-day")) {
        return wrap.find(".single-day .centered-cell").each(function() {
          if (inOut === "in") {
            $(this).addClass("hovered");
          }
          if (inOut === "out") {
            return $(this).removeClass("hovered");
          }
        });
      }
    };
    $("div.table").hover(hoverIn, hoverOut);
    scrollToEventbriteTickets = function() {
      if ($("#purchase").length === 0) {
        window.location = "/tickets/#purchase";
      }
      return root.scroll("purchase", $("#purchase").offset().top);
    };
    $(".buy-tickets-link").click(function() {
      scrollToEventbriteTickets();
      return false;
    });
    if ($(".tickets.prices, .tracks-content.tickets").length === 0) {
      return;
    }
    return $(".tickets.prices .centered-cell, .conference-good .centered-cell, .tracks-content.tickets .centered-cell").click(function() {
      if ($(this).parent().parent().hasClass("call")) {
        window.location = "/#call";
        return false;
      }
      if ($(this).parent().parent().attr("name") === "Access to the Main Amphitheatre") {
        window.location = "/program/overview/#main-amphitheatre";
        return false;
      }
      if ($(this).parent().parent().attr("name") === "Access to the Masterclass Room") {
        window.location = "/program/overview/#masterclass-room";
        return false;
      }
      if ($(this).parent().parent().attr("name") === "Access to the Open Laboratory") {
        window.location = "/program/overview/#open-laboratories";
        return false;
      }
      return scrollToEventbriteTickets();
    });
  });

}).call(this);

(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  $(function() {
    var thumbnails;
    if ($("#section-tracks-menu").length > 0) {
      thumbnails = new Thumbnails("section-tracks-menu", true, true);
    }
    if ($("#track-content").length > 0) {
      thumbnails = new Thumbnails("track-content", true, true);
    }
    if ($("#section-tracks-people").length > 0) {
      thumbnails = new Thumbnails("section-tracks-people", true, false);
    }
    $(".read-full-bio-link").click(function() {
      var id;
      id = $(this).attr("href").split("#")[1];
      if ($("#" + id).length > 0) {
        root.scroll(id, $("#" + id).offset().top);
        if (!$(".tracks-people #thumbnail-id-" + id).hasClass('selected')) {
          $(".tracks-people #thumbnail-id-" + id).click();
        }
      }
      return false;
    });
    return $("h3 a, li a.scrollable, .tracks-people .track-topic a, .talks-list a").click(function() {
      var id;
      id = $(this).attr("href").split("#")[1];
      if ($(this).hasClass("wip")) {
        return false;
      }
      if ($("#" + id).length > 0) {
        root.scroll(id, $("#" + id).offset().top);
        return false;
      }
    });
  });

}).call(this);

(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  $(function() {
    var initialize;
    if ($("section.venu").lenght === 0) {
      return;
    }
    initialize = function() {
      var latLng, map, mapCanvas, marker;
      mapCanvas = $('#venue-map-canvas')[0];
      if (mapCanvas === null) {
        return;
      }
      latLng = new google.maps.LatLng(48.217192, 16.353283);
      map = new google.maps.Map(mapCanvas, $.extend(root.config.mapOptions, {
        center: latLng
      }));
      return marker = new google.maps.Marker({
        position: latLng,
        map: map
      });
    };
    return google.maps.event.addDomListener(window, 'load', initialize);
  });

}).call(this);

(function() {
  $(function() {
    return $("popup .close").click(function() {
      return $(this).parent().removeClass("active");
    });
  });

}).call(this);

(function() {
  $(function() {
    var children, rotator, rotator_size;
    $('logo-wrap').addClass("rotated");
    $('content').removeClass("opacity0");
    if ($("#splash-composed-background").length === 0) {
      return;
    }
    $("#splash-composed-background").children().height($("#splash-composed-background").parent().height());
    $(window).resize(function() {
      return $("#splash-composed-background").children().height($("#splash-composed-background").parent().height());
    });
    children = $("#splash-composed-background").find(".img").toArray();
    rotator_size = $("#splash-composed-background").find("div.enaled").length;
    rotator = function() {
      return setTimeout(function() {
        var child, enabled, _i, _j, _len, _len1;
        enabled = rotator_size;
        for (_i = 0, _len = children.length; _i < _len; _i++) {
          child = children[_i];
          if ($(child).hasClass("enabled")) {
            enabled--;
            $(child).removeClass("enabled");
            $(child).addClass("disabled");
          } else if (enabled < rotator_size) {
            $(child).addClass("enabled");
            $(child).removeClass("disabled");
            enabled++;
          }
        }
        if (enabled !== rotator_size) {
          for (_j = 0, _len1 = children.length; _j < _len1; _j++) {
            child = children[_j];
            if (enabled !== rotator_size) {
              if ($(child).hasClass("disabled")) {
                $(child).addClass("enabled");
                $(child).removeClass("disabled");
                enabled++;
              }
            }
          }
        }
        return rotator();
      }, 7500);
    };
    return rotator();
  });

}).call(this);

(function() {
  var Thumbnails, root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  Thumbnails = (function() {
    function Thumbnails(sectionId, animated, justSize, drawSvg) {
      var selectedId, that;
      this.animated = animated;
      this.justSize = justSize;
      this.drawSvg = drawSvg;
      that = this;
      this.section = $("#" + sectionId);
      if (this.section.length !== 1) {
        console.warn("Can't discover section " + section_selector);
        return;
      }
      this.paper = Raphael(sectionId, "100%", "100%");
      this.svg = this.section.find("svg");
      this.wraps = this.section.find("thumbnail-wrap");
      this.shortBios = this.section.find("div.short-bio-wrap");
      this.thumbnails = this.section.find("a.thumbnail");
      this.checkBckgImg();
      $(window).resize(function() {
        that.setThumbnailSize();
        if (that.svg && that.svg.find("path").length > 0) {
          that.clearLine();
          return that.drawLine();
        }
      });
      this.thumbnails.each(function() {
        var t;
        this.jQthumbnail = $(this);
        this.jQdescription = that.section.find(".description[name='" + $(this).attr('name') + "']");
        this.jQtitle = that.section.find("item.thumbnail .thumbnail-title[name='" + $(this).attr('name') + "']");
        t = this;
        return t.jQthumbnail.hover(function() {
          return t.jQtitle.addClass("hover");
        }, function() {
          return t.jQtitle.removeClass("hover");
        });
      });
      this.setThumbnailSize();
      if (this.justSize) {
        this.thumbnails.each(function() {
          if (this.jQthumbnail.hasClass("disabled")) {
            this.jQthumbnail.click(function() {
              return false;
            });
          }
          if (this.jQthumbnail.hasClass("scrollable")) {
            return this.jQthumbnail.click(function() {
              var id;
              id = $(this).attr("href").split("#")[1];
              root.scroll(id, $(".tracks-people #" + id).offset().top).done(function() {
                if (!$(".tracks-people #thumbnail-id-" + id).hasClass("selected")) {
                  return $(".tracks-people #thumbnail-id-" + id).click();
                }
              });
              return false;
            });
          }
        });
        return;
      }
      this.selected = this.thumbnails.filter(".selected");
      if (this.selected.length === 0) {
        this.selected = null;
      }
      animated = this.animated;
      if (!this.animated) {
        this.thumbnailsNotAnimated();
      }
      if (this.animated) {
        this.thumbnailsAnimated();
      }
      if (window.location.hash !== "") {
        selectedId = window.location.hash.substring(1);
        if ($("#thumbnail-id-" + selectedId + ".selected").length === 0) {
          this.section.find("#thumbnail-id-" + selectedId).click();
        }
      }
    }

    Thumbnails.prototype.fadeOut = function(t) {
      t.jQdescription.removeClass("fadeInLeft");
      return t.jQdescription.addClass("fadeOutRight");
    };

    Thumbnails.prototype.fadeIn = function(t) {
      t.jQdescription.addClass("fadeInLeft");
      return t.jQdescription.removeClass("fadeOutRight");
    };

    Thumbnails.prototype.selectThumbnail = function(t) {
      t.jQthumbnail.addClass("selected");
      t.jQtitle.addClass("selected");
      if (!this.animated) {
        return t.jQdescription.addClass("selected");
      }
    };

    Thumbnails.prototype.deselectThumbnail = function(t) {
      t.jQthumbnail.removeClass("selected");
      t.jQtitle.removeClass("selected");
      if (!this.animated) {
        return t.jQdescription.removeClass("selected");
      }
    };

    Thumbnails.prototype.thumbnailsAnimated = function() {
      var that;
      that = this;
      return this.thumbnails.each(function() {
        var t;
        t = this;
        return t.jQthumbnail.click(function() {
          var wasSelected;
          if (that.selected) {
            if (t === that.selected) {
              that.deselectThumbnail(t);
              that.selected = null;
              that.clearLine();
              that.fadeOut(t);
              t.jQdescription.one(animate.onAnimatedEnd, function() {
                if (that.selected !== t) {
                  return t.jQdescription.removeClass("selected");
                }
              });
            } else {
              that.clearLine();
              that.deselectThumbnail(that.selected);
              that.selectThumbnail(t);
              wasSelected = that.selected;
              that.selected = t;
              if (wasSelected.jQdescription.hasClass("fadeInLeft")) {
                that.fadeOut(wasSelected);
                wasSelected.jQdescription.one(animate.onAnimatedEnd, function() {
                  if (that.selected !== wasSelected) {
                    wasSelected.jQdescription.removeClass("selected");
                    if (that.selected && that.selected.jQdescription.hasClass("fadeOutRight")) {
                      wasSelected = that.selected;
                      that.selected.jQdescription.addClass("selected");
                      that.fadeIn(that.selected);
                      return wasSelected.jQdescription.one(animate.onAnimatedEnd, function() {
                        if (that.selected === wasSelected && that.selected && that.selected.jQdescription.hasClass("fadeInLeft")) {
                          return that.drawLine();
                        }
                      });
                    }
                  }
                });
              } else {
                t.jQdescription.addClass("selected");
                that.fadeIn(t);
                that.selected = t;
                t.jQdescription.one(animate.onAnimatedEnd, function() {
                  if (that.selected === t) {
                    that.selected.jQdescription.addClass("selected");
                    return that.drawLine();
                  }
                });
              }
            }
          } else {
            that.clearLine();
            that.selectThumbnail(t);
            that.selected = t;
            if (that.section.find("item.description.selected").length === 0) {
              t.jQdescription.addClass("selected");
              that.fadeIn(t);
              t.jQdescription.one(animate.onAnimatedEnd, function() {
                if (that.selected === t && that.selected.jQdescription.hasClass("fadeInLeft")) {
                  that.selected.jQdescription.addClass("selected");
                  return that.drawLine();
                }
              });
            } else {
              that.section.find("item.description.selected").one(animate.onAnimatedEnd, function() {
                if (that.selected === t) {
                  that.fadeIn(t);
                  that.selected.jQdescription.addClass("selected");
                  return that.selected.jQdescription.one(animate.onAnimatedEnd, function() {
                    if (that.selected === t && that.selected.jQdescription.hasClass("fadeInLeft")) {
                      return that.drawLine();
                    }
                  });
                }
              });
            }
          }
          return false;
        });
      });
    };

    Thumbnails.prototype.thumbnailsNotAnimated = function() {
      var that;
      that = this;
      return this.thumbnails.each(function() {
        var t;
        t = this;
        return t.jQthumbnail.click(function() {
          if (that.selected) {
            if (t === that.selected) {
              that.deselectThumbnail(t);
              that.selected = null;
              return that.clearLine();
            } else {
              that.clearLine();
              that.deselectThumbnail(that.selected);
              that.selectThumbnail(t);
              that.selected = t;
              return that.drawLine();
            }
          } else {
            that.selectThumbnail(t);
            that.selected = t;
            return that.drawLine();
          }
        });
      });
    };

    Thumbnails.prototype.checkBckgImg = function() {
      return this.thumbnails.each(function() {
        var thumbnail, thumbnailBckgImg, thumbnailUrl;
        thumbnail = $(this);
        thumbnailBckgImg = thumbnail.css("background-image");
        thumbnailUrl = thumbnailBckgImg.substring(4, thumbnailBckgImg.length - 1);
        if (thumbnailUrl.charAt(0) === '"' || thumbnailUrl.charAt(0) === "'") {
          thumbnailUrl = thumbnailUrl.slice(1, -1);
        }
        return $('<img/>').attr('src', thumbnailUrl).load(function() {
          return $(this).remove();
        }).error(function() {
          $(this).remove();
          thumbnail.css("background-image", "");
          return thumbnail.addClass("logo");
        });
      });
    };

    Thumbnails.prototype.setThumbnailSize = function() {
      var fullSize, height;
      this.wraps.each(function() {
        var wrap;
        wrap = $(this);
        return wrap.height(wrap.width());
      });
      fullSize = this.wraps.first().width();
      this.thumbnails.each(function() {
        var borderWidth;
        borderWidth = fullSize * config.thumbnails.borderSize;
        if (borderWidth < 1) {
          borderWidth = 1;
        }
        this.jQthumbnail.css({
          "border-width": borderWidth
        });
        return this.jQthumbnail.css({
          "opacity": 1
        });
      });
      height = this.wraps.first().height();
      return this.shortBios.each(function() {
        return $(this).height(height);
      });
    };

    Thumbnails.prototype.clearLine = function() {
      if (!this.svg) {
        return;
      }
      return this.svg.find("path").remove();
    };

    Thumbnails.prototype.drawLine = function() {
      var endX, endY, line, originalEndY, startX, startY, thumbnail, title;
      if (!this.svg) {
        return;
      }
      thumbnail = this.selected;
      title = thumbnail.jQdescription.find(".thumbnail-title");
      thumbnail = thumbnail.jQthumbnail;
      startY = thumbnail.offset().top - this.section.offset().top + thumbnail.outerHeight();
      startX = thumbnail.offset().left + thumbnail.width() / 2;
      if (thumbnail.hasClass("column-first") && title.offset().left <= startX) {
        return;
      }
      if (thumbnail.hasClass("column-last") && title.offset().left >= startX) {
        return;
      }
      endY = title.offset().top + title.outerHeight() - this.section.offset().top;
      originalEndY = endY;
      if (thumbnail.hasClass("column-first")) {
        endX = title.offset().left + title.width();
      } else if (thumbnail.hasClass("column-last")) {
        endX = title.offset().left;
      } else {
        endY = endY - title.outerHeight();
      }
      if (thumbnail.hasClass("column-first") || thumbnail.hasClass("column-last") || thumbnail.hasClass("column-middle")) {
        line = this.paper.path("M" + startX + " " + startY + "L " + startX + " " + endY + " L " + endX + " " + endY);
      }
      if (!thumbnail.hasClass("column-first") && !thumbnail.hasClass("column-last")) {
        return this.paper.path("M " + title.offset().left + " " + originalEndY + "L " + (title.offset().left + title.width()) + " " + originalEndY);
      }
    };

    return Thumbnails;

  })();

  root.Thumbnails = Thumbnails;

}).call(this);

(function() {
  var defaultOptions, mobileOptions, root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  defaultOptions = {
    scaleColor: false,
    trackColor: 'rgba(255,255,255,0.3)',
    barColor: '#E7F7F5',
    lineWidth: 8,
    lineCap: 'butt',
    size: 105,
    animate: {
      duration: 1000,
      enabled: true
    }
  };

  mobileOptions = {
    lineWidth: 4,
    size: 50
  };

  $(function() {
    var activateTimer, getScale, update;
    getScale = function(clock) {
      if (clock.hasClass("days")) {
        return 31;
      }
      if (clock.hasClass("hours")) {
        return 24;
      }
      return 60;
    };
    update = function(clocks) {
      var clock, percents, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = clocks.length; _i < _len; _i++) {
        clock = clocks[_i];
        percents = clock.find(".value").html() * 100 / getScale(clock);
        clock.data('easyPieChart').update(percents);
        _results.push(setTimeout(function() {}));
      }
      return _results;
    };
    activateTimer = function(name) {
      return $("timer-dashboard").each(function() {
        var clocks, options, tCountTo, tOff, timer;
        timer = $(this);
        clocks = [];
        options = timer.parent().parent().hasClass("mobile") ? $.extend({}, defaultOptions, mobileOptions) : defaultOptions;
        timer.find("clock").each(function() {
          return clocks.push($(this).easyPieChart(options));
        });
        if (timer.attr("name") === name) {
          timer.parent().show();
          tCountTo = dateInVienna(timer.attr("count-to"));
          timer.countdown(tCountTo, function(event) {
            if (event.type === "finish" && timer.attr("on-finish") && event.finalDate.getHours() === tCountTo.getHours() && event.finalDate.getMinutes() === tCountTo.getMinutes()) {
              if (timer.attr("on-finish")) {
                eval(timer.attr("on-finish"));
              }
            }
            if (event.strftime('%S') !== timer.find(".seconds").find(".value").html()) {
              timer.find(".days").find(".value").html(event.strftime('%D'));
              timer.find(".hours").find(".value").html(event.strftime('%H'));
              timer.find(".minutes").find(".value").html(event.strftime('%M'));
              timer.find(".seconds").find(".value").html(event.strftime('%S'));
              return update(clocks);
            }
          });
          if (timer.attr("off")) {
            tOff = dateInVienna(timer.attr("off"));
            return timer.parent().countdown(tOff, function(event) {
              if (event.type === "finish" && timer.attr("on-off") && event.finalDate.getHours() === tOff.getHours() && event.finalDate.getMinutes() === tOff.getMinutes()) {
                return eval(timer.attr("on-off"));
              }
            });
          }
        }
      });
    };
    return activateTimer($("timer-dashboard").first().attr("name"));
  });

}).call(this);
