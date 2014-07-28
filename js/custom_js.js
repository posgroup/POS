jQuery(function() {

  jQuery.fn.equalHeights = function() {
    var max_height = 0;
    jQuery(this).each(function() {
        if (jQuery(this).outerHeight() > max_height) {
            /*This(Adding 0.4) is a hack, we will fix it in better way.*/
            max_height = jQuery(this).outerHeight()+0.4;
        }
    });
    if (Number.prototype.pxToEm) {
        max_height = max_height.pxToEm();
    }
    jQuery(this).css('min-height', max_height);
    return this;
  };
  jQuery('.date').datepicker();
  jQuery('body').find('.info-tiles').each(function() {
      jQuery(this).children('li').equalHeights();
  });
  /* Use data-tooltip-content attribute for show text contents and data-tooltip-target attribute to show html contents */
  jQuery('body').on('mouseenter', '[data-tooltip-content], [data-tooltip-target]', function() {
      var scroll_offset = scrollOffset(jQuery(this)),
          window_height = jQuery(window).height(),
          window_width = jQuery(window).width(),
          direction_of_tooltip = (window_width > window_height) ? 'left-or-right' : 'top-or-bottom';
      if (jQuery(this).data('bs.popover') === undefined) {
          jQuery(this).popover({
              container : 'body',
              html : 'true',
              trigger: 'manual',
              title: jQuery(this).data('tooltip-title') || 'Information',
              content: jQuery(jQuery(this).data('tooltip-target')).html() || jQuery(this).data('tooltip-content')
          });
      }

      // fail safe code for cases when the tooltip is too close to the boundary of the viewport
      // change the direction of the tooltip in such cases
      jQuery(this).popover('show');
      if (direction_of_tooltip === 'left-or-right') {
          var half_tooltip_height = jQuery(this).data('bs.popover').$tip.height() / 2;
          if (scroll_offset.top < half_tooltip_height || (window_height - scroll_offset.top) < half_tooltip_height) {
              direction_of_tooltip = 'top-or-bottom';
          }
      } else {
          var half_tooltip_width = jQuery(this).data('bs.popover').$tip.width() / 2;
          if (scroll_offset.left < half_tooltip_width || (window_width - scroll_offset.left) < half_tooltip_width) {
              direction_of_tooltip = 'left-or-right';
          }
      }

      if (direction_of_tooltip === 'left-or-right') {
          if (scroll_offset.left > (window_width / 2)) {
              jQuery(this).data('bs.popover').options.placement = 'left'
          } else {
              jQuery(this).data('bs.popover').options.placement = 'right'
          }
      } else {
          if (scroll_offset.top > (window_height / 2)) {
              jQuery(this).data('bs.popover').options.placement = 'top'
          } else {
              jQuery(this).data('bs.popover').options.placement = 'bottom'
          }
      }
      jQuery(this).popover('show');
  });
  jQuery('body').on('mouseleave', '[data-tooltip-content], [data-tooltip-target]', function() {
      if (jQuery(this).data('bs.popover') !== undefined) {
          jQuery(this).popover('hide');
      }
  });
  jQuery('body').on('change click', '[data-toggle-display]', function(e) {
    var effect = jQuery(this).data('toggle-effect');
    if (jQuery(this).is(':checkbox, :radio:checked')) {
        toggleDisplay(jQuery(this).data('toggle-display'), jQuery(this).is(':checked'), effect);
    } else {
        e.preventDefault();
        jQuery(jQuery(this).data('toggle-display')).each(function() {
            toggleDisplay(jQuery(this), !jQuery(this).is(':visible'), effect);
        });
    }
  });

  jQuery('body').on('change click', '[data-toggle-hide]', function(e) {
      var effect = jQuery(this).data('toggle-effect');
      if (jQuery(this).is(':checkbox, :radio:checked')) {
          toggleDisplay(jQuery(this).data('toggle-hide'), !jQuery(this).is(':checked'), effect);
      } else {
          e.preventDefault();
          jQuery(jQuery(this).data('toggle-hide')).each(function() {
              toggleDisplay(jQuery(this), !jQuery(this).is(':visible'), effect);
          });
      }
  });
  jQuery('body').on('change click', '[data-toggle-attribute]', function(e) {
    var attributes = jQuery(this).data('toggle-attribute').split(' '),
        target = jQuery(jQuery(this).data('toggle-attribute-target')),
        value = jQuery(this).data('toggle-attribute-value');
    if (jQuery(this).is(':checkbox')) {
    toggleAttributes(target, attributes, value, jQuery(this).is(':checked'));
    } else {
    toggleAttributes(target, attributes, value, (target.attr(attributes[0]) === undefined));
    }
  });
  jQuery('body').on('click', '.delete-item', function(e) {
      jQuery(this).closest('tr').remove();
  });
  jQuery(jQuery('body')).find('.table-fixed').each(function() {
      var height = jQuery(this).outerHeight(),
          fixed_height = jQuery(this).data('fixed-height');
      if(height > fixed_height) {
          jQuery(this).fixedHeaderTable({height: fixed_height});
          jQuery(this).parent().css({'overflow-y':'auto'});
      }
  });
  /*
  jQuery('body').on('click', '[data-toggle="modal"]', function(e) {
    e.preventDefault();
    var url = $(this).attr('href');
    console.log(url);
    console.log(jQuery(this).data('target'));
    if (url === null)
      url = jQuery(this).data('target')
    console.log(url);
    if (url.charAt(0) === '#' || url.charAt(0) === '.') {
      jQuery ("add-customer").modal('open');
    } else {
        jQuery.get(url, function(data) {
            jQuery('<div class="modal hide fade">' + data + '</div>').modal();
        });
    }
  });*/
});
function scrollOffset(elt) {
  var valueT = 0,
      valueL = 0,
      element = jQuery(elt).get(0);
  if (element !== undefined) {
      do {
          valueT += element.offsetTop || 0;
          valueL += element.offsetLeft || 0;
          // Safari fix
          if (element.offsetParent == document.body && jQuery(element).css('position') == 'absolute') {
              break;
          }
      } while (element = element.offsetParent);

      element = jQuery(elt).get(0);
      do {
          if (!window.opera || element.tagName == 'BODY') {
              valueT -= element.scrollTop || 0;
              valueL -= element.scrollLeft || 0;
          }
      } while (element = element.parentNode);

      return {
          left: valueL,
          top: valueT
      };
  }
}
function toggleAttributes(target, attributes, value, toggle) {
  if (toggle) {
      for(var i=0; i<attributes.length; i++) {
          if(value !== undefined) {
              target.attr(attributes[i], value);
          } else {
              target.attr(attributes[i], attributes[i]);
          }
      }
  } else {
      for(var i=0; i<attributes.length; i++) {
          target.removeAttr(attributes[i]);
      }
  }
}
function toggleDisplay(target, state, effect) {
  if (jQuery(target) !== undefined) {
      if (state === true) {
          if (effect === 'slide') {
              jQuery(target).slideDown().removeClass('hide');
          } else if (effect === 'fade') {
              jQuery(target).fadeIn().removeClass('hide');
          } else {
              jQuery(target).show().removeClass('hide');
          }
      } else {
          if (effect === 'slide') {
              jQuery(target).slideUp();
          } else if (effect === 'fade') {
              jQuery(target).fadeOut();
          } else {
              jQuery(target).hide();
          }
      }
  }
}