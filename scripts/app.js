var app = angular.module("notifyApp", ['angular-web-notification', 'ipCookie']);

app.directive('notification', ['webNotification', 'ipCookie', function (webNotification, ipCookie) {
return {
    restrict: 'E',
    link: function (scope) {
        var cookieKey = 'sf_notify';
        var isEnabled = webNotification.permissionGranted && ipCookie(cookieKey);

        if (isEnabled)
            showNotification();

        setScope();
        
        scope.toggle = function () {
            changeNotificationState(webNotification.permissionGranted);
        }
               
        function setScope() {
            scope.isEnabled = isEnabled;
            
            console.log(webNotification);
            console.log(webNotification.allowRequest);
            console.log(webNotification.permissionGranted);
        }
        
        function changeNotificationState(allow) {
            if (allow) {
                if (isEnabled) {
                    isEnabled = false;
                    setScope();
                    ipCookie(cookieKey, 'false', { expires: 30 });
                    console.log("set disable");
                }else{
                    isEnabled = true;
                    setScope();
                    showNotification();
                    ipCookie(cookieKey, 'true', { expires: 60 });
                    console.log("set enable");
                }
            }else{
                //show popup
                //alert("show popup");
                scope.hint = true;
                console.log(scope.hint);
            }    
        }

        function showNotification() {
            setInterval(function () {
                if(isEnabled)
                webNotification.showNotification('Example Notification', {
                    body: 'Notification Text...',
                    icon: 'my-icon.ico',
                    onClick: function onNotificationClicked() {
                        console.log('Notification clicked.');
                    },
                    autoClose: 4000 //auto close the notification after 4 seconds (you can manually close it via hide function)
                }, function onShow(error, hide) {
                    if (error) {
                        window.alert('Unable to show notification: ' + error.message);
                    } else {
                        console.log('Notification Shown.');

                        setTimeout(function hideNotification() {
                            console.log('Hiding notification....');
                            hide(); //manually close the notification (you can skip this if you use the autoClose option)
                        }, 5000);
                    }
                });
            }, 60000);

        };
    },
    template: "<div class='notification' ng-click='toggle()'> <span ng-show='isEnabled' class='notify-on' title='notify off'></span> <span ng-show='!isEnabled' class='notify-off' title='notify off'></span> <notify-hint hint='hint'></notify-hint></div>"
};
}]);

app.directive('notifyHint', [function () {
    return {
    restrict: 'E',
    scope: {
        hint: '='
    },
    link: function (scope, element) {
        
        element.on('click', function onClick() {
            console.log('hide');
            scope.hint = false; 
            console.log(scope.hint);            
        });

    },
    template: "<div class='popup-hint' ng-show='hint' ><span ng-click='hideHint()' class='glyphicon glyphicon-remove-circle hint-close'></span><h4>Allow send notification</h4></div>"
};
}]);