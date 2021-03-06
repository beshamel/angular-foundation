/*
 * dropdownToggle - Provides dropdown menu functionality
 * @restrict class or attribute
 * @example:

   <a dropdown-toggle="#dropdown-menu">My Dropdown Menu</a>
   <ul id="dropdown-menu" class="f-dropdown">
     <li ng-repeat="choice in dropChoices">
       <a ng-href="{{choice.href}}">{{choice.text}}</a>
     </li>
   </ul>
 */
angular.module('mm.foundation.dropdownToggle', [ 'mm.foundation.position', 'mm.foundation.mediaQueries', 'mm.foundation.stylesheets' ])

.controller('DropdownToggleController', ['$scope', '$attrs', 'mediaQueries', function($scope, $attrs, mediaQueries) {
  this.small = function() {
    return mediaQueries.small() && !mediaQueries.medium();
  };
}])

.directive('dropdownToggle', ['$document', '$window', '$location', '$position', 'stylesheetFactory', function ($document, $window, $location, $position, stylesheetFactory) {
  var openElement = null,
    closeMenu = angular.noop;
  return {
    restrict: 'CA',
    scope: {
      dropdownToggle: '@'
    },
    controller: 'DropdownToggleController',
    link: function(scope, element, attrs, controller) {
      var parent = element.parent();
      var dropdown = angular.element($document[0].querySelector(scope.dropdownToggle));
      var sheet = stylesheetFactory();

      var parentHasDropdown = function() {
        return parent.hasClass('has-dropdown');
      };

      var onClick = function (event) {
        var windowWidth = $window.innerWidth;
        dropdown = angular.element($document[0].querySelector(scope.dropdownToggle));
        var elementWasOpen = (element === openElement);

        event.preventDefault();
        event.stopPropagation();

        if (!!openElement) {
          closeMenu();
        }

        if (!elementWasOpen && !element.hasClass('disabled') && !element.prop('disabled')) {
          dropdown.css('display', 'block'); // We display the element so that offsetParent is populated
          var offset = $position.offset(element);
          var parentOffset = $position.offset(angular.element(dropdown[0].offsetParent));
          var top = offset.top - parentOffset.top + offset.height;

          var css = {
            top: top + 'px'
          };

          if (controller.small()) {
            css.position = 'absolute';
            css.width = '95%';
            css['max-width'] = 'none';
          }
          else
          {
            css.width = '';
            css.position = '';
            css['max-width'] = '';
          }
          dropdown.css(css);
          var dropdownWidth = dropdown.prop('offsetWidth');
          var dropdownHeight = dropdown.prop('offsetHeight');

          var bottomThreshold = dropdown[0].offsetParent.offsetHeight - dropdownHeight - 8;
          if (top > bottomThreshold) {
            top = top - dropdownHeight - offset.height;
            dropdown.addClass('drop-top');
            css.top = top + 'px';
          }
          else
          {
            dropdown.removeClass('drop-top');
          }

          if (controller.small()) {
            css.left = Math.max((parentOffset.width - dropdownWidth) / 2, 8) + 'px';
          }
          else {
            var left = Math.round(offset.left - parentOffset.left);
            var rightThreshold = dropdown[0].offsetParent.offsetWidth - dropdownWidth - 8;
            if (left > rightThreshold) {
              left = rightThreshold;
              dropdown.removeClass('left').addClass('right');
            }
            css.left = left + 'px';
          }

          dropdown.css(css);

          var dropdownLeft = $position.offset(dropdown).left;
          var pipWidth = parseInt(
            getComputedStyle(dropdown[0], '::before').getPropertyValue('width'), 10
          );
          var pipLeft = offset.left - dropdownLeft + Math.round((offset.width - pipWidth) / 2);
          sheet
            .css('#' + dropdown[0].id + '::before', {
              left: pipLeft + 'px'
            })
            .css('#' + dropdown[0].id + '::after', {
              left: pipLeft - 1 + 'px'
            })
            .sync();

          if (parentHasDropdown()) {
            parent.addClass('hover');
          }

          openElement = element;

          var shouldUnbind = true;
          closeMenu = function (event) {
            if (event && event.type == 'resize' && event.target.innerWidth == windowWidth)
            {
              return;
            }

            if (shouldUnbind) {
              $document.off('click', closeMenu);
              angular.element($window).unbind('resize', closeMenu);
              dropdown.css('display', 'none');
              closeMenu = angular.noop;
              openElement = null;
              if (parent.hasClass('hover')) {
                parent.removeClass('hover');
              }
            }
            shouldUnbind = true;
          };

          $document.on('click', closeMenu);
          angular.element($window).bind('resize', closeMenu);
          
          if (dropdown.attr('show-on-click')) {
            dropdown.bind('click', function(evt) {
              shouldUnbind = false;
              dropdown.css('display', 'block');
            });
          }

          var closeButton = angular.element($document[0].querySelector('.close.button'));
          closeButton.bind('click', function(e) {
            shouldUnbind = true;
            dropdown.unbind('click');
            closeMenu();
          });

          var sendButton = angular.element($document[0].querySelector('.send.button'));
          sendButton.bind('click', function(e) {
            shouldUnbind = true;
            dropdown.unbind('click');
            closeMenu();
          });
        }
      };

      if (dropdown) {
        dropdown.css('display', 'none');
      }

      scope.$watch('$location.path', function() {
        shouldUnbind = true;
        closeMenu();
      });

      element.on('click', onClick);
      element.on('$destroy', function() {
        element.off('click', onClick);
      });
    }
  };
}]);
