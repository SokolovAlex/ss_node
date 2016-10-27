/**
 * Created by Pavel Akulov on 24.11.2015.
 * Email: akulov@magora-systems.ru
 * Company: Magora Systems LLC
 * Website: http://magora-systems.com
 */

(function(angular) {
    'use strict';

    angular
        .module('directive.social', [])
        .directive('social', social);

    function social() {
        return {
            replace: true,
            scope: {
                url: '@',
                title: '@',
                description: '@',
                image: '@'
            },
            restrict: 'E',
            templateUrl: 'directive/social/social.html',
            controllerAs: 'socialCtrl',
            bindToController: true,
            controller: SocialCtrl,
            link: function($scope, $element) {
                $scope.socialCtrl.$element = $element;
            }
        }
    }

    function SocialCtrl(){
        var socialCtrl = this;

        var options = {
            contenturl: socialCtrl.url,
            clientid: '294756158747-ncbid52s6prq8u3q2eouu1utvu2cbmjj.apps.googleusercontent.com',
            cookiepolicy: 'single_host_origin',
            prefilltext: socialCtrl.title,
            calltoactionurl: socialCtrl.url
        };

        socialCtrl.url = encodeURIComponent(socialCtrl.url || '');
        socialCtrl.title = encodeURIComponent(socialCtrl.title || '');
        socialCtrl.description = socialCtrl.description || '';
        socialCtrl.image = socialCtrl.image || '';

        // Call the render method when appropriate within your app to display
        // the button.
        gapi.interactivepost.render('gplus-share', options);

        socialCtrl.popup = function(type) {
            document.activeElement.blur();

            function popup(url){
                window.open(url,'','toolbar=0,status=0,width=626,height=436');
            }

            switch(type) {
                case 'vk':
                    popup('http://vk.com/share.php?noparse=true&url=' + socialCtrl.url + '&title=' + socialCtrl.title + '&description=' + socialCtrl.description + '&image=' + socialCtrl.image);
                    break;
                case 'fb':
                    var obj = {
                        method: 'feed',
                        link: socialCtrl.url,
                        description: socialCtrl.description,
                        picture: socialCtrl.image,
                        name: socialCtrl.title
                    };
                    FB.ui(obj);
                    break;
                case 'twitter':
                    popup('https://twitter.com/intent/tweet?url=' + socialCtrl.url + '&text=' + socialCtrl.title);
                    break;
                case 'gplus':
                    break;
            }
        }
    }
})(angular);