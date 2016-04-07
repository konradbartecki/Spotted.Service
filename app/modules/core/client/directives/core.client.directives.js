angular.module(ApplicationConfiguration.applicationModuleName)
    .directive("ngCompare", function() {
        return {
            require: "ngModel",
            scope: {
                otherModelValue: "=ngCompare"
            },
            link: function(scope, element, attributes, ngModel) {

                ngModel.$validators.ngCompare = function(modelValue) {
                    return modelValue == scope.otherModelValue;
                };

                scope.$watch("otherModelValue", function() {
                    ngModel.$validate();
                });
            }
        };
    })

    .directive('ngClickAnyWhere', function($document){
        return {
            restrict: 'A',
            link: function(scope, elem, attr, ctrl) {
                elem.bind('click', function(e) {
                    e.stopPropagation();
                });
                $document.bind('click', function() {
                    scope.$apply(attr.ngClickAnyWhere);
                })
            }
        }
    });
