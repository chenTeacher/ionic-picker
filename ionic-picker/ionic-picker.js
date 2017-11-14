/**
 * Created by ChenTeacher on 2017/11/9.
 *  离子选择器
 */
let PickerModule = angular.module('ionicPicker', []);
/**
 * ionicPicker  适合单项选择
 */
PickerModule.directive('ionicPicker', ['$ionicModal', '$timeout', '$ionicScrollDelegate', function ($ionicModal, $timeout, $ionicScrollDelegate) {
    function isBoolean(value) {
        return typeof value === 'boolean'
    }

    return {
        restrict: 'ECMA',
        replace: true,
        template: '<div class="button button-positive">{{vm.areaData}}</div>',
        scope: {
            options: '=options'
        },
        link: function (scope, element) {
            let vm = scope.vm = {}, so = scope.options, pickerModel = null;
            vm.uuid = Math.random().toString(36).substring(3, 8);
            vm.Handle = 'dhcc-' + vm.uuid;
            vm.backdrop = true;
            vm.step = so.step || 36; // 滚动步长 （li的高度）
            vm.AreaService = so.listData;
            if (angular.isDefined(so.defaultAreaData) && so.defaultAreaData.length > 1) {
                vm.defaultAreaData = so.defaultAreaData;
                vm.areaData = vm.defaultAreaData;
            } else {
                vm.defaultAreaData = new Date().getFullYear();
                vm.areaData = angular.isDefined(so.areaData) ? so.areaData.join(vm.tag) : new Date().getFullYear();
            }
            vm.returnOk = function () {
                console.log(vm.areaData);
                $timeout(function () {
                    pickerModel && pickerModel.hide();
                    so.buttonClicked && so.buttonClicked(vm.areaData);
                }, 50)
            };
            vm.returnCancel = function () {
                pickerModel && pickerModel.hide();
            };
            vm.clickToClose = function () {
                vm.backdropClickToClose && vm.returnCancel()
            };
            vm.getValue = function () {
                $timeout.cancel(vm.runing);
                let number = true, Handle = vm.Handle;
                let top = $ionicScrollDelegate.$getByHandle(Handle).getScrollPosition().top; // 当前滚动位置
                let step = Math.round(top / vm.step);
                if (top % vm.step !== 0) {
                    $ionicScrollDelegate.$getByHandle(Handle).scrollTo(0, step * vm.step, true);
                    return false
                }
                vm.runing = $timeout(function () {
                    number && (vm.areaData = vm.AreaService[step])
                })
            };
            //初始化数据
            vm.initAreaData = function (AreaData) {
                if (AreaData[0]) {
                    for (let i = 0; i < vm.AreaService.length; i++) {
                        if (AreaData[0] === vm.AreaService[i]) {
                            $ionicScrollDelegate.$getByHandle(vm.Handle).scrollTo(0, i * vm.step);
                            vm.number = vm.AreaService[i];
                            break
                        }
                    }
                }
            };
            //点击按钮弹出一个对话框
            element.on("click", function () {
                console.log("click");
                if (pickerModel) {
                    pickerModel.show();
                    return false
                }
                // vm.isCreated = true
                // $ionicModal.fromTemplateUrl('D:\workhome\NMGIntegrated\assets\www\scripts\lib\ionic-picker\ionic-picker.html', {
                $ionicModal.fromTemplateUrl('scripts/lib/ionic-picker/ionic-picker.html', {
                    scope: scope,
                    animation: 'slide-in-up',
                    backdropClickToClose: false,
                    hardwareBackButtonClose: false,
                }).then(function (modal) {
                    pickerModel = modal;
                    $timeout(function () {
                        pickerModel.show();
                        vm.initAreaData(vm.defaultAreaData);
                    }, 50)
                })
            })
        }
    };
}]);
/**
 * 时间选择器
 *
 */
PickerModule.directive('ionicTimePicker', ['$ionicModal', '$timeout', '$ionicScrollDelegate', function ($ionicModal, $timeout, $ionicScrollDelegate) {
    function isBoolean(value) {
        return typeof value === 'boolean'
    }

    return {
        restrict: 'ECMA',
        replace: true,
        template: '<div class="button button-small button-light icon-left ion-android-calendar" style="padding: 5px;float: left;align-content: center;border-color: #9E9E9E;width: 100%;height:32px;font-size: 1em;color: #0C60EE;"><p>{{vm.year}}{{vm.month}}{{vm.day}}</p></div>',
        scope: {
            options: '=options',
            year:'=year',
            month:'=month',
            day:'=day'
        },
        link: function (scope, element) {
            let vm = scope.vm = {}, so = scope.options, pickerModel = null;
            vm.uuid = Math.random().toString(36).substring(3, 8);
            vm.yearHandle = 'year-' + vm.uuid;
            vm.monthHandle = 'month-' + vm.uuid;
            vm.dayHandle = 'day-' + vm.uuid;
            vm.backdrop = true;
            vm.tag = so.tag || "-";
            vm.step = so.step || 36; // 滚动步长 （li的高度）
            vm.year =so.year||new Date().getFullYear();
            vm.month =so.month||new Date().getMonth()>9?new Date().getMonth()+1:'0'+(new Date().getMonth()+1);
            vm.day =so.day||new Date().getDate();
            vm.yearArray = so.yearArray || [];
            vm.monthArray = so.monthArray || [];
            vm.dayArray = so.dayArray || [];
            //对选择年，月，日进行判断是否显示列表
            vm.hasYear = so.hasYear || false;
            vm.hasMonth = so.hasMonth || false;
            vm.hasDay = so.hasDay || false;
            //判断默认年份
            if (angular.isDefined(so.yearDefaultData) && so.yearDefaultData.length > 1) {
                vm.year = vm.yearDefaultData = so.yearDefaultData;
            } else {
                vm.year = vm.yearDefaultData = new Date().getFullYear();
            }
            //判断默认月份
            if (angular.isDefined(so.monthDefaultData) && so.monthDefaultData.length > 1) {
               vm.month =  vm.monthDefaultData = so.monthDefaultData;
            } else {
                vm.month = vm.monthDefaultData = "01";
            }
            //判断默认日期
            if (angular.isDefined(so.dayDefaultData) && so.dayDefaultData.length > 1) {
                vm.day = vm.dayDefaultData = so.dayDefaultData;
            } else {
                vm.day =vm.dayDefaultData = "01";
            }
            vm.returnOk = function () {
                console.log(vm.year, vm.month, vm.day);
                $timeout(function () {
                    pickerModel && pickerModel.hide();
                    so.buttonClicked && so.buttonClicked(vm.year, vm.month, vm.day);
                }, 50)
            };
            vm.returnCancel = function () {
                pickerModel && pickerModel.hide();
            };
            vm.clickToClose = function () {
                vm.backdropClickToClose && vm.returnCancel()
            };
            vm.getValue = function (name) {
                $timeout.cancel(vm.runing);
                let year = false;
                let month = false;
                let day = false;
                let Handle = "";
                switch (name) {
                    case 'year':
                        year = true, Handle = vm.yearHandle;
                        break
                    case 'month':
                        month = true, Handle = vm.monthHandle;
                        break
                    case 'day':
                        day = true, Handle = vm.dayHandle
                        break
                }
                let top = $ionicScrollDelegate.$getByHandle(Handle).getScrollPosition().top; // 当前滚动位置
                let step = Math.round(top / vm.step);
                if (top % vm.step !== 0) {
                    $ionicScrollDelegate.$getByHandle(Handle).scrollTo(0, step * vm.step, true);
                    return false
                }
                vm.runing = $timeout(function () {
                    vm.hasYear && year && (vm.year = vm.yearArray[step]);
                    vm.hasMonth && month && (vm.month = vm.monthArray[step]);
                    vm.hasDay && day && (vm.day = vm.dayArray[step]);
                })
            };
            //初始化数据
            vm.initAreaData = function (Y, M, D) {
                if (Y) {
                    for (let i = 0; i < vm.yearArray.length; i++) {
                        if (Y == vm.yearArray[i]) {
                            $ionicScrollDelegate.$getByHandle(vm.yearHandle).scrollTo(0, i * vm.step);
                            vm.year = vm.yearArray[i];
                            break
                        }
                    }
                }
                if (M) {
                    for (let i = 0; i < vm.monthArray.length; i++) {
                        if (M == vm.monthArray[i]) {
                            $ionicScrollDelegate.$getByHandle(vm.monthHandle).scrollTo(0, i * vm.step);
                            vm.month = vm.monthArray[i];
                            break
                        }
                    }
                }
                if (D) {
                    for (let i = 0; i < vm.dayArray.length; i++) {
                        if (D == vm.dayArray[i]) {
                            $ionicScrollDelegate.$getByHandle(vm.dayHandle).scrollTo(0, i * vm.step);
                            vm.day = vm.dayArray[i];
                            break
                        }
                    }
                }
            };
            scope.$watch('year',function (newValue,oldValue) {
                console.log(newValue,oldValue);
                vm.year = newValue;
                vm.initAreaData(newValue,vm.month,vm.day);
            })
            scope.$watch('month',function (newValue,oldValue) {
                console.log(newValue,oldValue);
                vm.month = newValue;
                vm.initAreaData(vm.year,newValue,vm.day);
            })
            scope.$watch('day',function (newValue,oldValue) {
                console.log(newValue,oldValue);
                vm.day = newValue;
                vm.initAreaData(vm.year,vm.month,newValue);
            })
            //点击按钮弹出一个对话框
            element.on("click", function () {
                console.log("click");
                if (pickerModel) {
                    pickerModel.show();
                    return false
                }
                // vm.isCreated = true
                // $ionicModal.fromTemplateUrl('D:\workhome\NMGIntegrated\assets\www\scripts\lib\ionic-picker\ionic-picker.html', {
                $ionicModal.fromTemplateUrl('scripts/lib/ionic-picker/ionic-time-picker.html', {
                    scope: scope,
                    animation: 'slide-in-up',
                    backdropClickToClose: false,
                    hardwareBackButtonClose: false,
                }).then(function (modal) {
                    pickerModel = modal;
                    // $timeout(function () {
                        pickerModel.show();
                        vm.initAreaData(vm.year, vm.month, vm.day);
                    // }, 50)
                })
            })
        }
    };
}]);
PickerModule.directive('ionScrollMinh', [
    '$timeout',
    '$controller',
    '$ionicBind',
    '$ionicConfig',
    function ($timeout, $controller, $ionicBind, $ionicConfig) {
        return {
            restrict: 'E',
            scope: true,
            controller: function () {
            },
            compile: function (element, attr) {
                let scrollCtrl;
                element.addClass('scroll-view ionic-scroll');
                let innerElement = angular.element('<div class="scroll"></div>');
                innerElement.append(element.contents());
                element.append(innerElement);

                let nativeScrolling = attr.overflowScroll !== "false" && (attr.overflowScroll === "true" || !$ionicConfig.scrolling.jsScrolling());

                return {pre: prelink};
                function prelink($scope, $element, $attr) {
                    $ionicBind($scope, $attr, {
                        direction: '@',
                        paging: '@',
                        $onScroll: '&onScroll',
                        $onScrollComplete: '&onScrollComplete',
                        scroll: '@',
                        scrollbarX: '@',
                        scrollbarY: '@',
                        zooming: '@',
                        minZoom: '@',
                        maxZoom: '@'
                    });
                    $scope.direction = $scope.direction || 'y';

                    if (angular.isDefined($attr.padding)) {
                        $scope.$watch($attr.padding, function (newVal) {
                            innerElement.toggleClass('padding', !!newVal);
                        });
                    }
                    if ($scope.$eval($scope.paging) === true) {
                        innerElement.addClass('scroll-paging');
                    }

                    if (!$scope.direction) {
                        $scope.direction = 'y';
                    }
                    let isPaging = $scope.$eval($scope.paging) === true;

                    if (nativeScrolling) {
                        $element.addClass('overflow-scroll');
                    }

                    $element.addClass('scroll-' + $scope.direction);

                    let scrollViewOptions = {
                        el: $element[0],
                        delegateHandle: $attr.delegateHandle,
                        locking: ($attr.locking || 'true') === 'true',
                        bouncing: $scope.$eval($attr.hasBouncing),
                        paging: isPaging,
                        scrollbarX: $scope.$eval($scope.scrollbarX) !== false,
                        scrollbarY: $scope.$eval($scope.scrollbarY) !== false,
                        scrollingX: $scope.direction.indexOf('x') >= 0,
                        scrollingY: $scope.direction.indexOf('y') >= 0,
                        zooming: $scope.$eval($scope.zooming) === true,
                        maxZoom: $scope.$eval($scope.maxZoom) || 3,
                        minZoom: $scope.$eval($scope.minZoom) || 0.5,
                        preventDefault: true,
                        nativeScrolling: nativeScrolling,
                        scrollingComplete: onScrollComplete
                    };

                    if (isPaging) {
                        scrollViewOptions.speedMultiplier = 0.8;
                        scrollViewOptions.bouncing = false;
                    }
                    scrollCtrl = $controller('$ionicScroll', {
                        $scope: $scope,
                        scrollViewOptions: scrollViewOptions
                    });

                    function onScrollComplete() {
                        $scope.$onScrollComplete({
                            scrollTop: scrollCtrl.scrollView.__scrollTop,
                            scrollLeft: scrollCtrl.scrollView.__scrollLeft
                        });
                    }


                }
            }
        };
    }]);