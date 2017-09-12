'use strict';
var ApplicationConfiguration = (function () {
    var applicationModuleName = 'angularjsapp';
    var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ngSanitize', 'ui.router', 'ui.bootstrap', 'ngDialog', 'djds4rce.angular-socialshare','timer','ui.rCalendar'];
    var registerModule = function (moduleName) {
        angular
                .module(moduleName, []);
        angular
                .module(applicationModuleName)
                .requires
                .push(moduleName);
    };
    return {
        applicationModuleName: applicationModuleName,
        applicationModuleVendorDependencies: applicationModuleVendorDependencies,
        registerModule: registerModule
    };
})();
'use strict';
angular
        .module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);
angular
        .module(ApplicationConfiguration.applicationModuleName)
        .config(['$locationProvider',
            function ($locationProvider) {
                $locationProvider.hashPrefix('!');
            }
        ])
        .run(function ($FB) {
            $FB.init(fbAppId);
        });
angular
        .element(document)
        .ready(function () {
            if (window.location.hash === '#_=_') {
                window.location.hash = '#!';
            }
            angular
                    .bootstrap(document,
                            [ApplicationConfiguration.applicationModuleName]);
        });
'use strict';
ApplicationConfiguration.registerModule('eventDetails');

'use strict';
angular
        .module('eventDetails')
        .config(['$stateProvider',
            '$urlRouterProvider',
            function ($stateProvider, $urlRouterProvider) {
                $urlRouterProvider.otherwise('/');
                $stateProvider
                        .state('home', {
                            url: '/',
                            templateUrl: baseURL + '/' + version +'/ui/eventDetail/modules/views/eventDetails.html',
                            controller: 'eventDetailsController'
                        });
            }
        ]);

'use strict';
angular
        .module('eventDetails')
        .factory('eventDetails',
                function ($resource, $http) {
                    return {
                        getCouponCode: function (customerId, postId, contact, callback, $scope) {
                            $http.post(baseURL + '/rest/app/activateOffer/' + customerId + '/' + postId + '/' + uniqueId + '?contact=' + contact).
                                    success(function (response) {
                                        callback(response);
                                    }).
                                    error(function (error) {
                                        $scope.alert(error.errorMessage);
                                    });
                        },
                        getLink: function (customerId, link, callback, $scope) {
                            $http.post(baseURL + '/content/' + customerId + '/linkUrl', link).
                                    success(function (response) {
                                        callback(response);
                                    }).
                                    error(function (error) {
                                     //   $scope.alert(error.errorMessage);
                                    });
                        },
                        sendPromoCode: function (obj, data, callback, $scope) {
                            //   http://localhost:8080/ES/rest/app/sendpromocode/{customer}?offerTitle=""&instruction=""&promoCode=""&messageId=""&email=""&expiredDate=
                            $http.post(baseURL + '/rest/app/sendpromocode/' + obj.customerId + '?promoCode=' + obj.promoCode + '&messageId=' + obj.messageId + '&offerId=' + obj.offerId + '&email=' + obj.email, '').
                                    success(function (response) {
                                        callback(response);
                                    }).
                                    error(function (error) {
                                        $scope.alert(error.errorMessage);
                                    });
                        },
                        getEvents: function (since, until, callback, $scope) {
//                            rest/app/activities/{customerId}/{type}?requestFrom=&since=since 
                            $http.get(BaseURL + 'rest/app/activities/' + customerId + '/EVENT?requestFrom=&since=' + since + '&until='+ until).
                                    success(function (response, status, headers, config) {
                                        if (typeof response === 'string') {
                                            if (response.indexOf('id="login-error"') != -1) {
                                                top.postMessage('sessionTimeout', $scope.localOrigin);
                                                return;
                                            }
                                        }
                                        callback(response);
                                    }).
                                    error(function (error, status, headers, config) {
                                        $scope.alert(error.errorMessage);
                                    });
                        }
                    };

                });
'use strict';
angular
        .module('eventDetails').directive('resize', function ($window) {
    return function ($scope, element, attr) {

        var w = angular.element($window);
        $scope.$watch(function () {
            return {
                'h': w.height(),
                'w': w.width()
            };
        }, function (newValue, oldValue) {
            if (element[0].offsetParent) {
                $("#slides_control>div").height(315);
                $(".carousel-inner>.item").height(315);
                if (element[0].clientHeight > 100) {
                    $("#slides_control>div").height(element[0].clientHeight);
                    $(".carousel-inner>.item").height(element[0].clientHeight);
                }
            }
        }, true);
        w.bind('resize', function () {
            $scope.$apply();
        });
    }
});

'use strict';
angular
        .module('eventDetails')
.directive('loading', function () {
      return {
        restrict: 'E',
        replace:true,
         template: '<div class="loaderDiv"><img src= "'+baseURL + '/'+version + '/ui/reviewsForm/img/loader.gif" class="loaderImg" /></div>',
        link: function (scope, element, attr) {
              scope.$watch('loading', function (val) {
                  if (val)
                      $(element).show();
                  else
                      $(element).hide();
              });
        }
      }
  });
  
'use strict';
angular
        .module('eventDetails').directive("phoneformat", function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, element, attr, ngModelCtrl) {
            var phoneParse = function (value) {
                var numbers = value && value.replace(/-/g, "");
                if (/^\d{10}$/.test(numbers)) {
                    return numbers;
                }

                return undefined;
            };
            var phoneFormat = function (value) {
                var numbers = value && value.replace(/-/g, "");
                var matches = numbers && numbers.match(/^(\d{3})(\d{3})(\d{4})$/);

                if (matches) {
                    return matches[1] + "-" + matches[2] + "-" + matches[3];
                }

                return undefined;
            };
            ngModelCtrl.$parsers.push(phoneParse);
            ngModelCtrl.$formatters.push(phoneFormat);

            element.bind("blur", function () {
                var value = phoneFormat(element.val());
                var isValid = !!value;
                if (!element.val()) {
                    isValid = true;
                }
                if (isValid) {
                    ngModelCtrl.$setViewValue(value);
                    ngModelCtrl.$render();
                }
                ngModelCtrl.$setValidity("telephone", isValid);
                scope.$apply();
            });

            element.bind("keyup", function () {
                var value = phoneFormat(element.val());
                var isValid = !!value;
                if (!element.val()) {
                    isValid = true;
                }
                if (isValid) {
                    ngModelCtrl.$setValidity("telephone", isValid);
                }
                scope.$apply();
            });

            element.bind("keypress", function () {
                var num = element.val();
                num = num.replace(/-/g, "");
                if (num.length > 3) {
                    num = num.slice(0, 3) + '-' + num.slice(3);
                }
                if (num.length > 7) {
                    num = num.slice(0, 7) + '-' + num.slice(7);
                }
                ngModelCtrl.$setViewValue(num);
                ngModelCtrl.$render();
                scope.$apply();
            });
        }
    };
});


'use strict';
angular
        .module('eventDetails').directive("emailformat", function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, element, attr, ngModelCtrl) {

            element.bind("blur", function () {
                var value = element.val();
                var emailFormate = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

                var isValid = emailFormate.test(value);
                if (!value) {
                    isValid = true;
                }
                ngModelCtrl.$setValidity("emailValidation", isValid);
                scope.$apply();
            });
            element.bind("keyup", function () {
                var value = element.val();
                var emailFormate = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

                var isValid = emailFormate.test(value);
                if (!value) {
                    isValid = true;
                }
                if (isValid) {
                    ngModelCtrl.$setValidity("emailValidation", isValid);
                }
                scope.$apply();
            });
        }
    };
});

'use strict';
angular
        .module('eventDetails').directive('elSize', ['$parse', function ($parse) {
        return function ($scope, elem, attrs) {
            var fn = $parse(attrs.elSize);
            $scope.$watch(function () {
                return {
                    width: elem.width(),
                    height: elem.height()
                };
            }, function (size) {
                if (elem[0].offsetParent) {
                    $("#slides_control>div").height(315);
                    $(".carousel-inner>.item").height(315);
                    if (elem[0].clientHeight > 100) {
                        $("#slides_control>div").height(elem[0].clientHeight);
                        $(".carousel-inner>.item").height(elem[0].clientHeight);
                    }
                }
                fn.assign($scope, size);
            }, true);
        }
    }]);

'use strict';
angular
        .module('eventDetails').directive("owlCarousel", function() {
	return {
		restrict: 'E',
		transclude: false,
		link: function (scope) {
			scope.initCarousel = function(element) {
				var customOptions = scope.$eval($(element).attr('data-options'));
                                // provide any default options you want
				var defaultOptions = {
				};
				// combine the two options objects
				for(var key in customOptions) {
					defaultOptions[key] = customOptions[key];
				}
				// init carousel
				$(element).owlCarousel(defaultOptions);
                                if(element.context && element.context.clientWidth) {
                                    if((element.context.children[0].classList[0]).indexOf("sponsors") != -1) {
                                     $("." +element.context.children[0].classList[0]).css({"width": element.context.clientWidth, "height":  element.context.clientWidth*2/3});
                                        $(element.children().children()[1]).css({"top": (((element.context.clientWidth * 2)/3)/ 2)- 15});
                                        $(element.children().children()[2]).css({"top": (((element.context.clientWidth * 2)/3)/ 2)- 15});
                                 } else {
                                     $("." +element.context.children[0].classList[0]).css({"width": element.context.clientWidth, "height":  element.context.clientWidth});
                                     $(element.children().children()[1]).css({"top": (element.context.clientWidth/ 2)- 10});
                                     $(element.children().children()[2]).css({"top": (element.context.clientWidth/ 2)- 10});
                                 }
                                }
			};
		}
	};
});

'use strict';
angular
        .module('eventDetails').directive('owlCarouselItem', [function() {
	return {
		restrict: 'A',
		transclude: false,
		link: function(scope, element) {
		  // wait for the last item in the ng-repeat then call init
			if(scope.$last) {
				scope.initCarousel(element.parent());
			}
		}
	};
}]);

'use strict';
angular
        .module('eventDetails').directive('couroselResize', ['$parse', function ($parse) {
        return function ($scope, element, attrs) {
            var fn = $parse(attrs.couroselResize);
            $scope.$watch(function () {
                return {
                    width: element.width(),
                    height: element.height()
                };
            }, function (size) {
                if (element.parent() && element.parent()[0].style.width) {
                    $(".speakerImgContainer").css({"width": element.parent()[0].style.width, "height": element.parent()[0].style.width});
                }
                fn.assign($scope, size);
            }, true);
        }
    }]);


'use strict';
angular
        .module('eventDetails').directive('setClassWhenAtTop', function ($window) {
    var $win = angular.element($window); // wrap window object as jQuery object

    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
//            function setup() {

//    }
            function scroll() {
                var topClass = attrs.setClassWhenAtTop, // get CSS class from directive's attribute value
                        offsetTop = element.offset().top - 15, // get element's top relative to the document
                        elemWidth = element.parent().width(),
                        elementHeight = window.innerHeight,
//                elementLeft = $(".stickyLeftContainer").width(),     
                        totalLeft = $(".stickyLeftContainer").width() + element.parent().parent().parent()[0].offsetLeft + 45, //digits are used only for padding's
                        parentHeight = element.parent().parent().height();
                setTimeout(function () {
                    parentHeight = element.parent().parent().height();
                }, 1000);
                if (offsetTop > 0 && $win.scrollTop() >= offsetTop && ($win.scrollTop() < parentHeight)) {
                    if ($win.scrollTop() <= (parentHeight - elementHeight + 45)) {
                        element.css({"width": elemWidth, "left": totalLeft, "position": "fixed", "background": "#fff", "height": elementHeight, "top": "0px"});
                    } else {
                        element.css({"width": elemWidth, "left": "", "position": "absolute", "bottom": 0, "background": "#fff", "height": elementHeight, "top": "auto"});
                    }
                } else {
                    element.css({"width": "", "left": "", "position": "", "height": "", "bottom": "", "top": ""});
                }
            }
            $win.on('scroll', function (e) {
                scroll();
            });
            $win.on('resize', function (e) {
                setTimeout(function () {
                    scroll();
                }, 1000);
            });
        }
    };
});
'use strict';
angular
        .module('eventDetails').directive("randomBackgroundcolor", function () {
    return {
        restrict: 'EA',
        replace: false,
        link: function (scope, element, attr) {

            //generate random color
            var color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16); 
            
            //Add random background class to selected element
            element.css('background-color', color);

        }
    }
});

'use strict';
angular
        .module('eventDetails').config(['ngDialogProvider', function (ngDialogProvider) {
        ngDialogProvider.setDefaults({
            className: 'ngdialog-theme-default',
            plain: false,
            showClose: true,
            closeByDocument: true,
            closeByEscape: true,
            appendTo: false,
            preCloseCallback: function () {
                //console.log('default pre-close callback');
            }
        });
    }]);
'use strict';
angular
        .module('eventDetails')
        .controller('eventDetailsController', ['$scope', 'eventDetails', 'ngDialog', '$window', '$q',
            function ($scope, eventDetailsService, ngDialog, $window, $q) {
                eventObj = $scope;
                $scope.socialShareView = baseURL + '/' + version +'/ui/socialShare/socialshare.html';
                $scope.isShowPopup = false;
                $scope.isClicked = false;
                $scope.email = '';
                $scope.loading = false;
                $scope.promoOptions = false;
                $scope.submitForm = false;
                $scope.theme = theme;
                $scope.colorCodeArray = [
                    "#339E42",
                    "#039BE5",
                    "#EF6C00",
                    "#A1887F",
                    "#607D8B",
                    "#039BE5",
                    "#009688"
                ];
                $scope.events = {
                };
                $scope.isEmptyeventDetails = false;
                $scope.carouselInrerval = 3000;
                $scope.showPreviewOfPromoImage = function (image) {
                    image.active = true;
                };
                
                $scope.printOverallReport = function () {
                    ngDialog.closeAll();
                    var divToPrint = document.getElementById('printArea');
                    var newWin = window.open();
                    newWin.document.write(divToPrint.innerHTML);
                    newWin.document.close();
                    newWin.print();
                    newWin.close();
                };

                $scope.downloadOfferCode = function () {
                    var doc = new jsPDF();
                    var specialElementHandlers = {
                        '#editor': function (element, renderer) {
                            return true;
                        }
                    };
                    doc.fromHTML($('#downloadArea').html(), 10, 10, {
                        'width': 180,
                        'elementHandlers': specialElementHandlers
                    });
                    doc.save($scope.title + '.pdf');
                    ngDialog.closeAll();
                };

                $scope.sendEmail = function () {
                    if (uniqueId && uniqueId !== 'null') {
                        $scope.sendPromoCode();
                    } else {
                         ngDialog.open({
                                            template: baseURL + '/' + version + '/ui/eventDetail/modules/views/emailpopup.html',
                                            scope: $scope,
                                            closeByDocument: false,
                                            className: 'ngdialog-theme-plain'
                                        });
                    }
                };
               $scope.isValidEmail = function (email){
                    return ( /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/.test(email));
                };
                
                
                $scope.sendPromoCode = function (temp) {
                    var endDates = '';
                    var messageId = null;
                     if (uniqueId && uniqueId !== 'null') {
                         messageId = uniqueId;
                         $scope.submitForm = true;
                     }
                    if (!temp) {
                        temp = null;
                    }
                    if (eventDetails.endDate) {
                        endDates = eventDetails.endDate;
                    }
                    var obj = {
                        customerId: eventDetails.fromProfile.customer,
                        promoCode: $scope.events.couponCode,
                        messageId: messageId,
                        email: temp,
                        eventId: eventDetails.postId
                    }
                    if(obj.messageId || obj.email){
                         $scope.submitForm = true;
                    }
                    if(obj.email){
                        if(!$scope.isValidEmail(obj.email)){
                           $scope.submitForm = true;
                        }
                    }
                    //var data = $scope.events.redemptionInstructions;
                    if ((obj.messageId || obj.email) && $scope.submitForm) {
                       $scope.loading = true;
                        eventDetailsService.sendPromoCode(obj,'',function (responce) {
                            $scope.loading = false;
                            ngDialog.closeAll();
                        }, $scope);
                    }
                };

                $scope.getLocationInGoogleMap = function () {
                    if (google && $scope.events.isShowGoogleMap) {
                        var geocoder = new google.maps.Geocoder();
                        var address = '';
                        if ($scope.events.addressObj.street) {
                            address = $scope.events.addressObj.street;
                        }
                        if ($scope.events.addressObj.substreet) {
                            if (address) {
                                address += ', ';
                            }
                            address += $scope.events.addressObj.substreet;
                        }
                        if ($scope.events.addressObj.city) {
                            if (address) {
                                address += ', ';
                            }
                            address += $scope.events.addressObj.city;
                        }
                        if ($scope.events.addressObj.state) {
                            if (address) {
                                address += ', ';
                            }
                            address += $scope.events.addressObj.state;
                        }
                        if ($scope.events.addressObj.country) {
                            if (address) {
                                address += ', ';
                            }
                            address += $scope.events.addressObj.country;
                        }
                        if ($scope.events.addressObj.zipcode) {
                            if (address) {
                                address += ', ';
                            }
                            address += $scope.events.addressObj.zipcode;
                        }

                        geocoder.geocode({'address': address}, function (results, status) {
                            var myLatlng = new google.maps.LatLng(37.255745, -121.004875);
                            var mapOption = {
                                center: myLatlng,
                                zoom: 5,
                                mapTypeId: google.maps.MapTypeId.ROADMAP
                            };
                            if (status == google.maps.GeocoderStatus.OK && results && results.length != 0) {
                                /* var latitude = '', longitude = '';
                                 for (var key in results[0].geometry.location) {
                                 if (!latitude) {
                                 latitude = results[0].geometry.location[key];
                                 }
                                 else if (!longitude) {
                                 longitude = results[0].geometry.location[key];
                                 }
                                 }*/
                                var latitude = results[0].geometry.location.lat();
                                var longitude = results[0].geometry.location.lng();
                                myLatlng = new google.maps.LatLng(latitude, longitude);
                                mapOption = {
                                    center: myLatlng,
                                    zoom: 15,
                                    mapTypeId: google.maps.MapTypeId.ROADMAP
                                };
                            }
                            if (!$scope.map) {
                                $scope.map = new google.maps.Map(document.getElementById("googleMap"), mapOption);
                            } else {
                                $scope.map.setCenter(myLatlng)
                            }
                            if ($scope.marker) {
                                $scope.marker.setMap(null);
                            }
                            $scope.marker = new google.maps.Marker({
                                position: myLatlng,
                                map: $scope.map,
                                title: address
                            });
                            if (!$scope.mapmobile) {
                                $scope.mapmobile = new google.maps.Map(document.getElementById("googleMapMobile"), mapOption);
                            } else {
                                $scope.mapmobile.setCenter(myLatlng)
                            }
                            if ($scope.markermobile) {
                                $scope.markermobile.setMap(null);
                            }
                            $scope.markermobile = new google.maps.Marker({
                                position: myLatlng,
                                map: $scope.mapmobile,
                                title: address
                            });
                        });
                    }
                };
                $scope.updateCompanyAddressForOffers = function (address) {
                    $scope.events.address = "";
                    if (address.street) {
                        $scope.events.address = address.street;
                        $scope.events.addressObj.street = address.street;
                    }

                    if (address.substreet) {
                        if ($scope.events.address) {
                            $scope.events.address += ", ";
                        }
                        $scope.events.address += address.substreet;
                        $scope.events.addressObj.substreet = address.substreet;
                    }

                    if (address.city) {
                        if ($scope.events.address) {
                            $scope.events.address += "<br>";
                        }
                        $scope.events.address += address.city;
                        $scope.events.addressObj.city = address.city;
                    }

                    if (address.state) {
                        if (!address.city && $scope.events.address) {
                            $scope.events.address += "<br>";
                        } else if ($scope.events.address) {
                            $scope.events.address += ", ";
                        }
                        $scope.events.address += address.state;
                        $scope.events.addressObj.state = address.state;
                    }

                    if (address.country) {
                        /*if ($scope.events.address) {
                         $scope.events.address += ", ";
                         }
                         $scope.events.address += address.country;*/
                        $scope.events.addressObj.country = address.country;
                    }

                    if (address.zipcode) {
                        if (!address.state && !address.city && $scope.events.address) {
                            $scope.events.address += "<br>";
                        } else if ($scope.events.address) {
                            $scope.events.address += ", ";
                        }
                        $scope.events.address += address.zipcode;
                        $scope.events.addressObj.zipcode = address.zipcode;
                    }
                    if (address.url) {
                        $scope.events.addressObj.url = address.url;
                        $scope.events.companyWebSiteUrl = (address.url.indexOf('https://') != -1 || address.url.indexOf('http://') != -1) ? address.url : 'http://' + address.url;
                    }
                    $scope.getLocationInGoogleMap();
                };
                $scope.showEventAddress = function (addressObj) {
                    var address = "";

                    if (addressObj) {
                        if (addressObj.street) {
                            address += addressObj.street;
                        }

                        if (addressObj.substreet) {
                            if (addressObj.street) {
                                address += ", ";
                            }
                            address += addressObj.substreet;
                        }

                        if (addressObj.city) {
                            if (addressObj.street || addressObj.substreet) {
                                address += ", ";
                            }
                            address += addressObj.city;
                        }

                        if (addressObj.state) {
                            if (addressObj.city) {
                                address += ", ";
                            }
                            address += addressObj.state;
                        }

                        if (addressObj.country) {
                            if (addressObj.state) {
                                address += ", ";
                            }
                            address += addressObj.country
                        }

                        if (addressObj.zipcode) {
                            if (addressObj.state || addressObj.city || addressObj.country) {
                                address += "<br>";
                            }
                            address += addressObj.zipcode + ".";
                        }
                        return address;
                    }
                };
                if (!eventDetails) {
                    $scope.isEmptyeventDetails = true;
                }
                if (eventDetails) {
                    eventDetailsService.getLink(eventDetails.fromProfile.customer, eventDetails.postUrl, function (responce) {
                        $scope.offerDateMessage = "";
                        $scope.OfferDate = "";
                        $scope.url = responce;
                        $scope.image = (eventDetails.socialShareMetadata && eventDetails.socialShareMetadata.image) ? eventDetails.socialShareMetadata.image : '';
                        $scope.text = (eventDetails.socialShareMetadata && eventDetails.socialShareMetadata.description) ? $(eventDetails.socialShareMetadata.description).text() : '';
                        $scope.title = (eventDetails.socialShareMetadata && eventDetails.socialShareMetadata.title) ? eventDetails.socialShareMetadata.title : eventDetails.title;
                    }, $scope);
                    var validFrom = new Date(parseInt(eventDetails.validFrom));
                    var validTo;
                    var endDate;
                    $scope.title = eventDetails.title;
                    if (eventDetails.endDate) {
                        endDate = new Date(parseInt(eventDetails.endDate));
                        //endDate = new Date(endDate.setHours(0, 0, 0, 0));
                    } else{
                        endDate = null;
                    }
                    if(eventDetails.validTo){
                         validTo = new Date(parseInt(eventDetails.validTo));
                    } else{
                        validTo = null;
                    }
//                    var validTo;
//                    if (eventDetails.validTo) {
//                        validTo = new Date(parseInt(eventDetails.validTo));
//                    }
                    var currentDate = new Date();
                    //currentDate = new Date(currentDate.setHours(0, 0, 0, 0));
                    //validFrom = new Date(validFrom.setHours(0, 0, 0, 0));

                    //validTo = new Date(validTo.setDate(validTo.getDate()+1));
                    //validTo = new Date(validTo.setHours(0, 0, 0, 0));
                    if (eventDetails.limitTo != 0) {
                        if (uniqueId && uniqueId != 'null') {
                            if (validTo) {
                                if (currentDate.getTime() <= validTo.getTime()) {
                                    $scope.offerDateMessage = "Available until";
                                } else {
                                    $scope.offerDateMessage = "offer not available online";
                                }
                                $scope.OfferDate = validTo;
                            }
                        } else {
                            if (validTo) {
                                if (currentDate.getTime() <= validTo.getTime()) {
                                    $scope.offerDateMessage = "Available until";
                                } else {
                                    $scope.offerDateMessage = "offer not available online";
                                }
                                $scope.OfferDate = validTo;
                            } else {
                                if(endDate){
                                if (currentDate.getTime() <= endDate.getTime()) {
                                    $scope.offerDateMessage = "Expiration Date";
                                } else {
                                    $scope.offerDateMessage = "offer not available online";
                                }
                                $scope.OfferDate = endDate;
                            }
                          }
                        }
                    } else {
                        $scope.offerDateMessage = "Sold Out";
                        $scope.OfferDate = "";
                    }
                    $scope.events = {
                        bgColor: eventDetails.theme && eventDetails.theme.backGroundColor ? eventDetails.theme.backGroundColor : '#fff',
                        textColor: eventDetails.theme && eventDetails.theme.textColor ? eventDetails.theme.textColor : '#4a4c54',
                        buttonColor: eventDetails.theme && eventDetails.theme.buttonColor ? eventDetails.theme.buttonColor : '#0090ef', 
                        buttonTextColor: eventDetails.theme && eventDetails.theme.buttonTextColor ? eventDetails.theme.buttonTextColor : '#fff', 
                        fontFamily: eventDetails.theme && eventDetails.theme.fontFamily ? eventDetails.theme.fontFamily : 'proxima-nova, sans-serif',
                        titleColor: eventDetails.theme && eventDetails.theme.titleColor ? eventDetails.theme.titleColor : '#4a4c54',
                        isBorder: eventDetails.theme && eventDetails.theme.showBorder ? eventDetails.theme.showBorder : false,
                        borderWidth: eventDetails.theme && eventDetails.theme.borderWidth ? eventDetails.theme.borderWidth : 'thin',
                        getCouponCode: eventDetails.cta_Label,
                        expiredMsg: "",
                        contact: '',
                        isClickPromoBtn: false,
                        isAlive: eventDetails.isAlive,
                        headline: eventDetails.title ? eventDetails.title : eventDetails.fromProfile.displayName,
                        promoImages: [],
                        previewImage: '',
                        id: eventDetails.id,
                        offerDateMessage: $scope.offerDateMessage,
//                        OfferDate: $scope.OfferDate,
//                        expirationDate: eventDetails.endDate ? eventDetails.endDate : '',
                        highlights: eventDetails.description,
                        eventDetails: eventDetails.eventDetails,
                        about: eventDetails.about,
                        onlineFrom: eventDetails.validFrom ? eventDetails.validFrom : '',
                        onlineTo: eventDetails.validTo ? eventDetails.validTo : '',
                        activationLimit: eventDetails.limitTo,
                        activated: eventDetails.activated,
                        promoCode: eventDetails.promoCode,
                        codeType: eventDetails.offerCodeType,
                        offerActivate: eventDetails.contactInfoRequired,
                        isShowActivatedOrRemainingCount: eventDetails.isShowActivatedOrRemainingCount,
                        isShowGoogleMap: eventDetails.showGoogleMap,
                        offerType: eventDetails.offerType,
                        discount: eventDetails.percentage ? eventDetails.value : '',
                        cashSavings: eventDetails.percentage ? '' : eventDetails.value,
                        companyName: eventDetails.companyName,
                        logo: eventDetails.companyLogo,
                        offercta_Label: eventDetails.cta_Label,
                        offercta_Url: eventDetails.cta_Url,
                        redemptionInstructions: eventDetails.redemptionInstructions,
                        isPromo: eventDetails.isPromo,
                        contactUsObj: eventDetails.contactUs,
                        isUpdateCompanyInfo: false,
                        addressObj: eventDetails.address,
                        address: '',
                        companyWebSiteUrl: eventDetails.companyUrl ? ((eventDetails.companyUrl.indexOf('https://') != -1 || eventDetails.companyUrl.indexOf('http://') != -1) ? eventDetails.companyUrl : 'http://' + eventDetails.companyUrl) : '',
                        cta_Label: cta_Label,
                        bannerTitle: bannerTitle,
                        cta_Url: cta_Url,
                        bannerCompanyName: bannerCompanyName ? bannerCompanyName : '',
                        bannerCompanyLogo: bannerCompanyLogo ? bannerCompanyLogo : '',
                        couponCode:'',
                        showLogo:eventDetails.showCompanyLogo,
                        showName:eventDetails.showCompanyName,
                        isShare:eventDetails.shareToSocial,
                        eventStartDate: eventDetails.eventStartDate,
                        eventEndDate: eventDetails.eventEndDate,
                        eventType: eventDetails.eventType,
                        bannerText: eventDetails.bannerText,
                        preview: preview,
                        PreviewClass: 'desktopPreview',
                        booths: eventDetails.booths,
                        speakers: eventDetails.speakers,
                        sponsors: eventDetails.sponsors,
                        partners: eventDetails.partners,
                        venues: eventDetails.venues,
                        participants: eventDetails.participants,
                        organizers: eventDetails.organizers,
                        schedule: eventDetails.schedule,
                        sessions: eventDetails.sessions,
                        inviteesList: eventDetails.inviteesList,
                        promotersList: eventDetails.promotersList,
                        signupOption: eventDetails.signupOption,
                        rsvpType: eventDetails.rsvpType,
                        recurringInfo: eventDetails.recurringInfo,
                        showRsvp: false
                    };
                    if ($scope.events.rsvpType) {
                        for (var key in $scope.events.rsvpType) {
                            if (key === 'embed_code') {
                                $scope.events.embedCode = $scope.events.rsvpType[key];
                            } else if (key === 'external_link') {
                                $scope.events.external_link = $scope.events.rsvpType[key];
                            } else {
                               $scope.events.showRsvp = true; 
                            }
                        }
                    }
                    $scope.events.borderColor = eventDetails.theme && eventDetails.theme.showBorder === true ? eventDetails.theme.borderColor : 'none';
                    $scope.events.borderStyle = eventDetails.theme && eventDetails.theme.showBorder === true && eventDetails.theme.borderWidth ? 'solid' : 'none';
                    if (!eventDetails.isAlive) {
                        $scope.offerResponceMessage = "Offer Inactivated";
                    }
                    if (eventDetails.promos) {
                        for (var i = 0; i < eventDetails.promos.length; i++) {
                            if ($scope.events.promoImages.length === 0) {
                                $scope.events.previewImage = {
                                    url: eventDetails.promos[i],
                                    fileName: '',
                                    type: 'image'
                                };
                            }
                            $scope.events.promoImages.push({
                                url: eventDetails.promos[i],
                                fileName: '',
                                type: 'image'
                            });
                        }
                    }

                    $scope.updateCompanyAddressForOffers($scope.events.addressObj);
                }

                $scope.isShowErrorMessage = function () {
                    return $scope.events.offerDateMessage != "Expiration Date";
                };

                $scope.alert = function (message) {
                    if (message) {
                        $scope.events.isClickPromoBtn = false;
                        ngDialog.closeAll();
                        ngDialog.open({
                            template: baseURL + '/' + version + '/ui/content/modules/createPost/views/alert.html',
                            className: 'ngdialog-theme-plain',
                            data: {
                                message: message
                            }
                        });
                        //  bootbox.alert(message);
                    }
                };
                $scope.getCalenderEvents = function(change, month, year) {
                    var date = new Date();
                    if (change) {
                        date.setYear(year);
                        date.setMonth(month);
                    }
                    var y = date.getFullYear();
                    var m = date.getMonth();
                    var firstDay = new Date(y, m, 1);
                    var lastDay = new Date(y, m + 1, 0);
                    var since = firstDay.setHours(0,0,0,0);
                    var until = lastDay.setHours(23,59,59,999);
                    $scope.eventSource = [];
                    eventDetailsService.getEvents(since,until,function(responce){
                        if (responce && responce.length >0) {
                            for (var i=0; i< responce.length; i++) {
                                var data = {};
                                data.title = responce[i].title;
                                data.startTime = responce[i].eventStartDate;
                                data.endTime = responce[i].eventEndDate;
                                data.allDay = false;
                                $scope.eventSource.push(data);
                            }
                            
                        }
                    $scope.$broadcast('eventSourceChanged',$scope.eventSource);
                    },$scope);
                };
                $scope.getCalenderEvents();
                $scope.getCouponCode = function (isModel) {
                    if ($scope.events.isPromo) {
                        if ($scope.events.offerActivate && isModel != true && uniqueId === 'null') {
                            if (($scope.events.offerDateMessage === 'Available until' || $scope.events.offerDateMessage === '' || $scope.events.offerDateMessage === undefined) &&  (!$scope.offerResponceMessage || $scope.offerResponceMessage === undefined)) {
                                
                                $scope.events.contactEmail = "";
                                $scope.events.contactNumber = "";
                                $scope.events.isValidForm = false;
                                ngDialog.closeAll();
                                ngDialog.open({
                                    template: baseURL + '/' + version + '/ui/eventDetail/modules/views/contactDetailsForm.html',
                                    scope: $scope,
                                    closeByDocument: false,
                                    className: 'ngdialog-theme-plain'
                                });
//                            $('#contact-details-model').modal({
//                                show: true
//                            });
                            } else if ($scope.events.offerDateMessage === 'Expired' && $scope.offerResponceMessage != 'Offer Inactivated') {
                                $scope.events.expiredMsg = "Sorry but this promotional offer has expired.";
                            }
                        } else if (!$scope.events.isClickPromoBtn) {
                            var contact = '';
                            if ($scope.events.contactEmail) {
                                contact = $scope.events.contactEmail.trim();
                            }
                            if (!contact && $scope.events.contactNumber) {
                                contact = $scope.events.contactNumber.trim();
                            }

                            if (!contact && isModel) {
                                $scope.events.isValidForm = true;
                                //  $scope.getCouponCode();
                                return;
                            }
                            if (($scope.events.offerDateMessage === 'Available until' || $scope.events.offerDateMessage === 'Expiration Date' || $scope.events.offerDateMessage === '' || $scope.events.offerDateMessage === undefined) && !$scope.offerResponceMessage) {
                              
                                $scope.events.isClickPromoBtn = true;
                                ngDialog.closeAll();
                                //$("#contact-details-model").modal("hide");
                                eventDetailsService.getCouponCode(eventDetails.fromProfile.customer, eventDetails.postId, contact, function (responce) {
                                    $scope.events.isClickPromoBtn = false;
                                    $scope.promoOptions = true;
                                    $scope.events.contactEmail = "";
                                    $scope.events.contactNumber = "";
                                    $scope.events.activated = responce.activited;
                                    $scope.events.activationLimit = responce.limit;
                                    if (responce.promocode != "Offer Inactivated" && responce.promocode != "Sold Out" && responce.promocode != "Offer Expired") {
                                        $scope.events.couponCode = responce.promocode;
                                        $scope.events.offerDateMessage = "Expiration Date";
                                       // $scope.originalContents = document.body.innerHTML;
                                        ngDialog.closeAll();
                                        ngDialog.open({
                                            template: baseURL + '/' + version + '/ui/eventDetail/modules/views/redemptionpopup.html',
                                            scope: $scope,
                                            closeByDocument: false,
                                            className: 'ngdialog-theme-plain'
                                        });
//                                    $scope.isShowPopup = true;
                                        if (eventDetails.limitTo != 0) {
                                            if (endDate) {
                                                if (currentDate.getTime() <= endDate.getTime()) {
                                                    $scope.offerDateMessage = "Expiration Date";
                                                } else {
                                                    $scope.offerDateMessage = "offer not available online";
                                                }
                                                $scope.events.OfferDate = endDate;
                                            } else {
                                                $scope.events.OfferDate = null;
                                            }
                                        }
                                        if ($scope.events.activationLimit === 0) {
                                            $scope.offerDateMessage = "Sold Out";
                                            $scope.OfferDate = "";
                                        }
                                    } else {
                                        $scope.offerResponceMessage = responce.promocode;
                                    }
                                }, $scope);
                            } else if ($scope.events.offerDateMessage === 'Expired' && $scope.offerResponceMessage != 'Offer Inactivated') {
                                $scope.events.expiredMsg = "Sorry but this promotional offer has expired.";
                            }
                        }
                    } else {
                        $scope.events.offercta_Url = ($scope.events.offercta_Url.indexOf('https://') != -1 || $scope.events.offercta_Url.indexOf('http://') != -1) ? $scope.events.offercta_Url : 'https://' + $scope.events.offercta_Url;
                        window.open($scope.events.offercta_Url);
                    }
                };
                $scope.eventRsvpForm = function() {
                    $scope.formIframeUrl = "";
                    if($scope.events.signupOption === 'rsvp' ) {
                        $scope.formIframeUrl = baseURL + "form/rsvpform?customerId= " + customerId +"&type=rsvp&preview=false&postId=" + $scope.events.id;
                        
                    } else if($scope.events.signupOption === 'contactus') {
                        $scope.formIframeUrl = baseURL + "form/rsvpform?customerId= " + customerId +"&type=contactus&preview=false&postId=" + $scope.events.id;
                    }
                    ngDialog.open({
                        template: baseURL + '' + version + '/ui/eventDetail/modules/views/rsvpForm.html',
                        scope: $scope,
                        closeByDocument: false,
                        className: 'ngdialog-theme-plain rsvpForm'
                    });
                };
                $scope.closeBanner = function () {
                    $scope.events.cta_Url = false;
                };
                $scope.previewMode = function (previewDeviceType) {
                    if(previewDeviceType === 'desktop'){
                       $scope.events.PreviewClass = 'desktopPreview';
                    }else if(previewDeviceType === 'mobile') {
                        $scope.events.PreviewClass = 'mobilePreview';
                    }else if(previewDeviceType === 'ipad') {
                        $scope.events.PreviewClass = 'ipadPreview';
                    }
                   
                };
                $scope.eventStarted = function () {
                    var currentDate = new Date();
                    var started  = false;
                    currentDate.getTime();
                    if ($scope.events.eventStartDate ) {
                        if ($scope.events.eventStartDate < currentDate ) {
                            started = true;
                        }
                    }
                    return started;
                };
                $scope.eventCompleted = function() {
                    var eventCompleted  = false;
                    var currentDate = new Date();
                    currentDate.getTime();
                    if ($scope.events.eventEndDate ) {
                        if ($scope.events.eventEndDate < currentDate ) {
                            eventCompleted = true;
                        }
                    }
                    return eventCompleted;
                };
            }
        ]);

'use strict';
angular
        .module('eventDetails').config(
        ['$animateProvider',
            function ($animateProvider) {
                $animateProvider.classNameFilter(/carousel/);
            }]);
function getCalenderEventsOnChange(change,month,year) {
    eventObj.getCalenderEvents(change,month,year); 
}
