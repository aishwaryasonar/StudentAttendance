var app = angular.module('mainController', ['ngRoute', 'ngCookies', 'wt.responsive', 'ngTable']);


var url = "http://localhost/BEPROJECT/StudentAttendance/php/index.php?";


app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'login.html',
            controller: 'loginController'
        })
        .when('/signup', {
            templateUrl: 'signup.html',
            controller: 'signupController'
        })
        .when('/faculty', {
            templateUrl: 'faculty.html',
            controller: 'facultyController'
        })
        .when('/student', {
            templateUrl: 'student.html',
            controller: 'studentController'
        }).when('/mentor', {
            templateUrl: 'mentor.html',
            controller: 'mentorController'
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
                url: "" + url + "action=adminLogin&uid=" + $scope.user_email + "&pass=" + $scope.user_pwd + "",
            }).then(function(response) {
                if (response.data.status_code == "0") {
                    bootbox.alert(response.data.status_message);
                    $cookies.put('user_id', response.data.uid);
                    window.location = '#faculty';
                } else {
                    bootbox.alert(response.data.status_message);
                    //$cookies.put('user_id',"");
                }
            });
        }
    }

}]);



app.controller('facultyController', ['$scope', '$http', '$cookies', 'NgTableParams', function($scope, $http, $cookies, NgTableParams) {


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
             
                $scope.arrayData33 = response.data.classData;
                $scope.class = "-";

            });
        }

        getSubjects();

        function viewfaculty() {
            $scope.loading = true;
            $http({
                method: "POST",
                url: "" + url + "action=getFaculty",

            }).then(function(response) {
                $scope.loading = false;
                if (response.data.status_code == "0") {
                    $scope.arrayData = response.data.arrayData;


                } else {
                    bootbox.alert(response.data.status_message);
                }

            });
        }

        viewfaculty();
        var idSelected = -1;
        $scope.edit = function(ID, NAME, CONTACT, EMAIL, CLASS) {
            idSelected = ID;
            $scope.name = NAME;
            $scope.contact = CONTACT;
            $scope.email = EMAIL;
            $scope.class = CLASS;

        }

        $scope.save = function() {
            if (!($scope.name && $scope.contact && $scope.email && $scope.password && $scope.class)) {
                bootbox.alert("Please enter mandatory fields.");
            } else {


                var fd = new FormData();
                fd.append('name', $scope.name);
                fd.append('contact', $scope.contact);
                fd.append('email', $scope.email);
                fd.append('password', $scope.password);
                fd.append('class', $scope.class);

                $http({
                    method: "POST",
                    url: "" + url + "action=registerFaculty",
                    data: fd,
                    headers: {
                        'Content-Type': undefined
                    },
                }).then(function(response) {
                    if (response.data.status_code == "0") {
                        bootbox.alert(response.data.status_message);
                        viewfaculty();
                    } else {
                        bootbox.alert(response.data.status_message);
                    }
                });
            }
        }
        $scope.update = function() {
            if (!($scope.name && $scope.contact && $scope.email && $scope.password && $scope.class && idSelected != -1)) {
                bootbox.alert("Please enter mandatory fields.");
            } else {


                var fd = new FormData();
                fd.append('ID', idSelected);
                fd.append('name', $scope.name);
                fd.append('contact', $scope.contact);
                fd.append('email', $scope.email);
                fd.append('password', $scope.password);
                fd.append('class', $scope.class);

                $http({
                    method: "POST",
                    url: "" + url + "action=updateFaculty",
                    data: fd,
                    headers: {
                        'Content-Type': undefined
                    },
                }).then(function(response) {

                    if (response.data.status_code == "0") {
                        bootbox.alert(response.data.status_message);
                        idSelected = -1;
                        $scope.name = $scope.contact = $scope.email = $scope.password = $scope.class = "";
                        viewfaculty();
                    } else {
                        bootbox.alert(response.data.status_message);
                    }
                });
            }
        }

        $scope.delete = function(ID) {


            $http({
                method: "POST",
                url: "" + url + "action=deleteFaculty&ID=" + ID,
                headers: {
                    'Content-Type': undefined
                },
            }).then(function(response) {
                if (response.data.status_code == "0") {
                    bootbox.alert(response.data.status_message);
                    viewfaculty();
                } else {
                    bootbox.alert(response.data.status_message);
                }
            });
        }


    }
}]);



app.controller('mentorController', ['$scope', '$http', '$cookies', 'NgTableParams', function($scope, $http, $cookies, NgTableParams) {


    if (!$cookies.get('user_id')) {
        window.location = '#';
    } else {

       
        function viewfaculty() {
            $scope.loading = true;
            $http({
                method: "POST",
                url: "" + url + "action=getFaculty",

            }).then(function(response) {
                $scope.loading = false;
                if (response.data.status_code == "0") {
                    $scope.arrayData2 = response.data.arrayData;


                } else {
                    bootbox.alert(response.data.status_message);
                }

            });
        }

        viewfaculty();

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

        function viewMentor() {
            $scope.loading = true;
            $http({
                method: "POST",
                url: "" + url + "action=getMentor",

            }).then(function(response) {
                $scope.loading = false;
                if (response.data.status_code == "0") {
                    $scope.arrayData3 = response.data.arrayData;


                } else {
                    bootbox.alert(response.data.status_message);
                }

            });
        }

        viewMentor();
        $scope.studentList="-";
        $scope.facultyList="-";
        
       

        $scope.save = function() {
            if (!($scope.studentList && $scope.facultyList)) {
                bootbox.alert("Please enter mandatory fields.");
            } else {

                var obj = JSON.parse($scope.studentList);
                var obj2 = JSON.parse($scope.facultyList);

                var fd = new FormData();
                fd.append('studID', obj.ID);
                fd.append('fID', obj2.ID);
               

                $http({
                    method: "POST",
                    url: "" + url + "action=updateMentor",
                    data: fd,
                    headers: {
                        'Content-Type': undefined
                    },
                }).then(function(response) {
                    if (response.data.status_code == "0") {
                        bootbox.alert(response.data.status_message);
                        viewMentor();
                    } else {
                        bootbox.alert(response.data.status_message);
                    }
                });
            }
        }
      
    

    }
}]);

app.controller('studentController', ['$scope', '$http', '$cookies', 'NgTableParams', function($scope, $http, $cookies, NgTableParams) {


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
             
                $scope.arrayData33 = response.data.classData;
                $scope.class = "-";

            });
        }

        getSubjects();

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