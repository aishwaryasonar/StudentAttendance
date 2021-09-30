var app = angular.module('mainController', ['ngRoute', 'ngCookies', 'wt.responsive', 'ngTable']);

var url = "http://localhost/BEPROJECT/StudentAttendance/php/index.php?";


app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'login.html',
            controller: 'loginController'
        })
        .when('/attendance', {
            templateUrl: 'attendance.html',
            controller: 'attendanceController'
        })
        .when('/student', {
            templateUrl: 'student.html',
            controller: 'studentController'
        })
        .when('/portal', {
            templateUrl: 'portal.html',
            controller: 'portalController'
        })

    .otherwise({
        redirectTo: '/'
    });
}]);

app.config(['$httpProvider', function($httpProvider) {
    //initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
    }

    // Answer edited to include suggestions from comments
    // because previous version of code introduced browser-related errors

    //disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    // extra
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
}]);

app.controller('loginController', ['$scope', '$http', '$cookies', function($scope, $http, $cookies) {

    $cookies.remove('user_id');
    if (!$cookies.get('user_id')) {} else {

    }

    $scope.submit = function() {
        if (!($scope.user_email && $scope.user_pwd)) {
            bootbox.alert("Please enter email and password.");
        } else {
            $http({
                method: "POST",
                url: "" + url + "action=facultyLogin&uid=" + $scope.user_email + "&pass=" + $scope.user_pwd + "",
            }).then(function(response) {
                if (response.data.status_code == "0") {
                    bootbox.alert(response.data.status_message);
                    $cookies.put('user_id', response.data.uid);
                    $cookies.put('user_name', response.data.name);
                    $cookies.put('fid', response.data.ID);
                    window.location = '#attendance';
                } else {
                    bootbox.alert(response.data.status_message);
                    //$cookies.put('user_id',"");
                }
            });
        }
    }

}]);





app.controller('attendanceController', ['$scope', '$http', '$cookies', 'NgTableParams', function($scope, $http, $cookies, NgTableParams) {


    if (!$cookies.get('user_id')) {
        window.location = '#';
    } else {

        function getSubjects() {
            $scope.loading = true;
            $http({
                method: "POST",
                url: "" + url + "action=getSubjects",

            }).then(function(response) {
                $scope.loading = false;
                $scope.arrayData = response.data.subjectData;
                $scope.subjects = "-";

                $scope.arrayData22 = response.data.subjectData;
                $scope.subjects22 = "-";

                $scope.arrayData2 = response.data.classData;
                $scope.classList = "-";

                $scope.arrayData33 = response.data.classData;
                $scope.classList33 = "-";

            });
        }

        getSubjects();
        var idSelected = -1;
        $scope.studentSelected = function(ID, NAME, CONTACT, EMAIL, CLASS) {
            idSelected = ID;
            $scope.name = NAME;
            $scope.contact = CONTACT;
            $scope.email = EMAIL;
            $scope.class = CLASS;

        }

        $scope.save = function() {

                if (!($scope.subjects && $scope.classList)) {
                    bootbox.alert("Please enter mandatory fields.");
                } else {

                    var obj = JSON.parse($scope.studentList);
                    // console.log(obj.name + " / " + obj.ID);
                    var fd = new FormData();
                    fd.append('subject', $scope.subjects);
                    fd.append('class', $scope.classList);
                    fd.append('rollno', obj.rollno);
                    fd.append('studname', obj.name);
                    fd.append('studID', obj.ID);
                    fd.append('facultyUID', $cookies.get('user_id'));
                    fd.append('facultyName', $cookies.get('user_name'));
                    fd.append('attendanceStatus', $scope.optradio);
                    fd.append('attendanceType', $scope.optradio2);
                    $http({
                        method: "POST",
                        url: "" + url + "action=markAttendance",
                        data: fd,
                        headers: {
                            'Content-Type': undefined
                        },
                    }).then(function(response) {
                        if (response.data.status_code == "0") {
                            bootbox.alert(response.data.status_message);

                        } else {
                            bootbox.alert(response.data.status_message);
                        }
                    });
                }
            }
            // $scope.update = function() {
            //     if (!($scope.name && $scope.contact && $scope.email && $scope.password && $scope.class && idSelected != -1)) {
            //         bootbox.alert("Please enter mandatory fields.");
            //     } else {


        //         var fd = new FormData();
        //         fd.append('ID', idSelected);
        //         fd.append('name', $scope.name);
        //         fd.append('contact', $scope.contact);
        //         fd.append('email', $scope.email);
        //         fd.append('password', $scope.password);
        //         fd.append('class', $scope.class);

        //         $http({
        //             method: "POST",
        //             url: "" + url + "action=updateFaculty",
        //             data: fd,
        //             headers: {
        //                 'Content-Type': undefined
        //             },
        //         }).then(function(response) {

        //             if (response.data.status_code == "0") {
        //                 bootbox.alert(response.data.status_message);
        //                 idSelected = -1;
        //                 $scope.name = $scope.contact = $scope.email = $scope.password = $scope.class = "";
        //                 viewfaculty();
        //             } else {
        //                 bootbox.alert(response.data.status_message);
        //             }
        //         });
        //     }
        // }
        $scope.optradio = 1;
        $scope.optradio2 = 0;
        $scope.optradio3 = 0;
        $scope.loadStudents = function() {


            $http({
                method: "POST",
                url: "" + url + "action=getClassStudent&class=" + $scope.classList,
                headers: {
                    'Content-Type': undefined
                },
            }).then(function(response) {
                if (response.data.status_code == "0") {
                    $scope.arrayData3 = response.data.arrayData;
                    $scope.studentList = "-";
                } else {
                    bootbox.alert(response.data.status_message);
                }
            });
        }

        $scope.viewRecords = function() {


            $http({
                method: "POST",
                url: "" + url + "action=getAttendanceFilter&class=" + $scope.classList33 + "&subject=" + $scope.subjects22 
                + "&dt1=" + $scope.dt1 + "&dt2=" + $scope.dt2+"&attendanceType="+$scope.optradio3,
                headers: {
                    'Content-Type': undefined
                },
            }).then(function(response) {
                if (response.data.status_code == "0") {
                    $scope.attendanceData = response.data.arrayData;

                } else {
                    bootbox.alert(response.data.status_message);
                }
            });
        }
    }
}]);


app.controller('studentController', ['$scope', '$http', '$cookies', 'NgTableParams', function($scope, $http, $cookies, NgTableParams) {


    if (!$cookies.get('user_id')) {
        window.location = '#';
    } else {

        function viewStudent() {
            $scope.loading = true;
            $http({
                method: "POST",
                url: "" + url + "action=getStudent",

            }).then(function(response) {
                $scope.loading = false;
                if (response.data.status_code == "0") {
                    $scope.arrayData = response.data.arrayData;


                } else {
                    bootbox.alert(response.data.status_message);
                }

            });
        }

        viewStudent();

        var idSelected = -1;
        $scope.edit = function(ID, NAME, CLASS, ROLLNO) {
            idSelected = ID;
            $scope.name = NAME;
            $scope.class = CLASS;
            $scope.rollno = ROLLNO;


        }
        $scope.save = function() {
            if (!($scope.name && $scope.class && $scope.rollno)) {
                bootbox.alert("Please enter mandatory fields.");
            } else {


                var fd = new FormData();
                fd.append('name', $scope.name);
                fd.append('class', $scope.class);
                fd.append('rollno', $scope.rollno);


                $http({
                    method: "POST",
                    url: "" + url + "action=registerStudent",
                    data: fd,
                    headers: {
                        'Content-Type': undefined
                    },
                }).then(function(response) {
                    if (response.data.status_code == "0") {
                        bootbox.alert(response.data.status_message);
                        viewStudent();
                    } else {
                        bootbox.alert(response.data.status_message);
                    }
                });
            }
        }

        $scope.update = function() {
            if (!($scope.name && $scope.class && $scope.rollno && idSelected != -1)) {
                bootbox.alert("Please enter mandatory fields.");
            } else {


                var fd = new FormData();
                fd.append('ID', idSelected);
                fd.append('name', $scope.name);
                fd.append('class', $scope.class);
                fd.append('rollno', $scope.rollno);


                $http({
                    method: "POST",
                    url: "" + url + "action=updateStudent",
                    data: fd,
                    headers: {
                        'Content-Type': undefined
                    },
                }).then(function(response) {

                    if (response.data.status_code == "0") {
                        bootbox.alert(response.data.status_message);
                        idSelected = -1;
                        $scope.name = $scope.class = $scope.rollno = "";
                        viewStudent();
                    } else {
                        bootbox.alert(response.data.status_message);
                    }
                });
            }
        }

        $scope.delete = function(ID) {


            $http({
                method: "POST",
                url: "" + url + "action=deleteStudent&ID=" + ID,
                headers: {
                    'Content-Type': undefined
                },
            }).then(function(response) {
                if (response.data.status_code == "0") {
                    bootbox.alert(response.data.status_message);
                    viewStudent();
                } else {
                    bootbox.alert(response.data.status_message);
                }
            });
        }


    }
}]);

app.controller('portalController', ['$scope', '$http', '$cookies', 'NgTableParams', function($scope, $http, $cookies, NgTableParams) {


    if (!$cookies.get('user_id')) {
        window.location = '#';
    } else {

       

        function viewMyStudent() {
            $scope.loading = true;
            $http({
                method: "POST",
                url: "" + url + "action=getMentorStudents&fid="+$cookies.get('fid'),

            }).then(function(response) {
                $scope.loading = false;
                if (response.data.status_code == "0") {
                    $scope.arrayData22 = response.data.arrayData;
                    $scope.arrayData= response.data.arrayData;

                } else {
                    bootbox.alert(response.data.status_message);
                }

            });
        }

        viewMyStudent();
        $scope.student="-";
      $scope.mystudents="-";
        $scope.save = function() {
            if (!($scope.commskills && $scope.academic && $scope.practical)) {
                bootbox.alert("Please enter mandatory fields.");
            } else {

                var obj = JSON.parse($scope.student);
                var fd = new FormData();
                fd.append('name', obj.name);
                fd.append('studID', obj.ID);
                fd.append('commskills', $scope.commskills);
                fd.append('academic', $scope.academic);
                fd.append('practical', $scope.practical);
                fd.append('fiD', $cookies.get('fid'));
                $http({
                    method: "POST",
                    url: "" + url + "action=addPortal",
                    data: fd,
                    headers: {
                        'Content-Type': undefined
                    },
                }).then(function(response) {
                    if (response.data.status_code == "0") {
                        bootbox.alert(response.data.status_message);
                        viewStudent();
                    } else {
                        bootbox.alert(response.data.status_message);
                    }
                });
            }
        }

        $scope.viewRecords = function() {
            $scope.loading = true;
            var obj = JSON.parse($scope.mystudents);
            $http({
                method: "POST",
                url: "" + url + "action=getPortals&studID="+obj.ID+"&fid="+$cookies.get('fid'),

            }).then(function(response) {
                $scope.loading = false;
                if (response.data.status_code == "0") {
                    $scope.arrayData5 = response.data.arrayData;


                } else {
                    bootbox.alert(response.data.status_message);
                }

            });
        }


    }
}]);


app.config(['$httpProvider', function($httpProvider) {
    //initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
    }

    // Answer edited to include suggestions from comments
    // because previous version of code introduced browser-related errors

    //disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    // extra
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
}]);