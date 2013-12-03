/*
 * jQuery File Upload Plugin Angular JS Example 1.2.1
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2013, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/*jslint nomen: true, regexp: true */
/*global window, angular */

(function () {
    'use strict';


    angular.module('demo', [
        'blueimp.fileupload'
    ])
        .config([
            '$httpProvider', 'fileUploadProvider',
            function ($httpProvider, fileUploadProvider) {
                delete $httpProvider.defaults.headers.common['X-Requested-With'];
                fileUploadProvider.defaults.redirect = window.location.href.replace(
                    /\/[^\/]*$/,
                    '/cors/result.html?%s'
                );
                // Demo settings:
                angular.extend(fileUploadProvider.defaults, {
                    // Enable image resizing, except for Android and Opera,
                    // which actually support image resizing, but fail to
                    // send Blob objects via XHR requests:
                    disableImageResize: /Android(?!.*Chrome)|Opera/
                        .test(window.navigator.userAgent),
                    maxFileSize: 5000000000,
                    acceptFileTypes: /(\.|\/)(gif|jpe?g|png|dmg)$/i

                    ,autoUpload:true
                });
            }
        ])

        .controller('DemoFileUploadController', [
            '$scope', '$http', '$filter', '$window',
            function ($scope, $http) {
                var url = 'http://localhost:8888';
                $scope.options = {
                    url: url
//                    ,done:function(e, data){
//                        debugger;
//                    }
                };

                $scope.loadingFiles = true;
                $http.get(url)
                    .then(
                        function (response) {
                            $scope.loadingFiles = false;
                            $scope.queue = response.data.files || [];
                        },
                        function () {
                            $scope.loadingFiles = false;
                        }
                    );


                $('#fileupload').bind('fileuploadadd',function(e,data){
                    $.each(data.files, function (index, file) {
                        file.formData = data.formData;
                    });
                });
        }])
        .controller('other_abc_ctrl',['$scope','$element',function($scope,$element){
            $element.find("#abc").bind('change', function (e) {
                $('#fileupload').fileupload('add', {
                    formData:$(this).parent("form").serializeArray(),
                    fileInput: $(this)
                });
            });
        }])
        .controller('other_xyz_ctrl',['$scope','$element',function($scope,$element){
            $element.find("#xyz").bind('change', function (e) {
                $('#fileupload').fileupload('add', {
                    formData:$(this).parent("form").serializeArray(),
                    fileInput: $(this)
                });
            });
        }])
        .controller('FileDestroyController', [
            '$scope', '$http',
            function ($scope, $http) {
                var file = $scope.file,
                    state;
                if (file.url) {
                    file.$state = function () {
                        return state;
                    };
                    file.$destroy = function () {
                        state = 'pending';
                        return $http({
                            url: file.deleteUrl,
                            method: file.deleteType
                        }).then(
                            function () {
                                state = 'resolved';
                                $scope.clear(file);
                            },
                            function () {
                                state = 'rejected';
                            }
                        );
                    };
                } else if (!file.$cancel && !file._index) {
                    file.$cancel = function () {
                        $scope.clear(file);
                    };
                }
            }
        ]);

}());
