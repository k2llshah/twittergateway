'use strict';
var app = angular.module('tweetapp', []);

app.controller('tweetController', ['$scope', '$http', '$window', function($scope, $http) {

    $scope.content = '/login.html';
    //$scope.fname="Ketul Shah";

    $scope.loadTweets = function() {
        $http.get('/loadTweets')
            .success(function(data, status, headers, config) {

                var data = data["message"];

                data.forEach(function(entry) {
                    var likecount = entry.like.length;
                    var dislikecount = entry.dislike.length;
                    if (likecount > 3 || dislikecount > 3) {
                        $scope.postTwitter(entry.content);
                    }
                    entry.likecount = likecount;
                    entry.dislikecount = dislikecount;
                    var likearr = entry.like;
                    var dislikearr = entry.dislike;
                    var up, down = 0;
                    if (likearr.indexOf($scope.username) !== -1) {
                        up = 1;
                    } else if (dislikearr.indexOf($scope.username) !== -1) {
                        down = 1;
                    }
                    entry.up = up;
                    entry.down = down;
                })

                $scope.loadGroups();
                $scope.tweets = data;

                $scope.content = "/profile.html";
            })
            .error(function(data, status, headers, config) {
                $scope.content = "/login.html";
            });
    }


    $scope.postTwitter = function(tweet) {

        var data = {
            tweet: tweet
        };


        $http.post('/postTwitter', data).success(function(data, status) {



        }).error(function(data, status, headers, config) {

            $.notify(data.message, "alert");

        });



    }

    $scope.loadGroups = function() {
        var data = {
            username: $scope.username
        };
        $http.post('/loadGroups', data).success(function(data, status) {

            var data = data["message"];
            if (data.length > 0) {
                $scope.groupsin = true;
                $scope.useringroups = data;
            } else {
                $scope.groupsin = false;
            }

        }).error(function(data, status, headers, config) {

            //$.notify(data.message, "alert");

        });
    }
    $http.get('/checkSession')
        .success(function(data, status, headers, config) {
            data = data["message"];
            $scope.createGroup = false;
            $scope.firstname = data.firstname;
            $scope.lastname = data.lastname;
            $scope.username = data.user_name;
            if (data.role === "admin") {
                $scope.createGroup = true;
                $scope.getAllUsers();
            }
            $scope.loadTweets();
        })
        .error(function(data, status, headers, config) {
            $scope.content = "/login.html";
        });

    $scope.getAllUsers = function() {

        $http.get('/getAllUsers')
            .success(function(data, status, headers, config) {
                $scope.allusers = data['message'];
            })
            .error(function(data, status, headers, config) {
                $.notify(data.message, "Error");
            });


    }

    $scope.newGroup = function() {
        var gname = $("#gname").val();
        var gdesc = $("#gdesc").val();
        var groupusers = $("#groupusers").val();
        var groupArray = [];
        for (var i = 0; i < groupusers.length; i++)
            groupArray[i] = groupusers[i].trim();

        var data = {
            gname: gname,
            gdesc: gdesc,
            users: groupArray,
            admin: $scope.username,
            date: Date()
        }

        $http.post('/newGroup', data).success(function(data, status) {

            $("#modalclose").click();
            $.notify("Group Successfully Created", "success");

        }).error(function(data, status, headers, config) {

            //$.notify(data.message, "alert");

        });

    }



    $scope.login = function() {

        var data = {
            username: $("#email").val(),
            password: $("#password").val()
        };

        $http.post('/login', data).success(function(data, status) {

            //var data=JSON.parse(data);
            data = data["message"];

            $scope.firstname = data.firstname;
            $scope.lastname = data.lastname;
            $scope.username = data.user_name;
            $scope.createGroup = false;
            if (data.role === "admin") {
                $scope.createGroup = true;
                $scope.getAllUsers();
            }

            $scope.loadTweets();

        }).error(function(data, status, headers, config) {
            $.notify(data.message, "alert");
        });
    }

    $scope.likes = function(id) {
        var data = {
            postid: id,
            user: $scope.username
        }

        $http.post('/likePost', data).success(function(data, status) {

            $scope.loadTweets();

        }).error(function(data, status, headers, config) {

            $.notify(data.message, "alert");

        });

    }
    $scope.dislikes = function(id) {
        var data = {
            postid: id,
            user: $scope.username
        }

        $http.post('/disLikePost', data).success(function(data, status) {

            $scope.loadTweets();

        }).error(function(data, status, headers, config) {

            $.notify(data.message, "alert");

        });
    }


    $scope.register = function() {

        var data = {
            fname: $("#fname").val(),
            lname: $("#lname").val(),
            username: $("#email").val(),
            password: $("#password").val()
        };

        $http.post('/register', data).success(function(data, status) {

            $.notify(data.message, "success");

            $scope.content = "/login.html";

        }).error(function(data, status, headers, config) {

            $.notify(data.message, "alert");

        });
    }



    $scope.editProfile = function() {

        var data = {
            fname: $("#editfname").val(),
            lname: $("#editlname").val(),
            username: $scope.username,
        };

        $http.post('/editprofile', data).success(function(data, status) {

            $.notify(data.message, "success");

        }).error(function(data, status, headers, config) {

            $.notify(data.message, "alert");

        });
    }

    $scope.setContent = function(content) {

        $scope.content = content;
    }

    $scope.logout = function() {

        $http.get('/logout')
            .success(function(data, status, headers, config) {
                $scope.content = "/login.html";
            })
            .error(function(data, status, headers, config) {
                $.notify(data.message, "Error in Logoout");
            });

    }

    $scope.submitTweet = function() {

        var tweet = $("#tweet").val();
        var data = {
            "tweet": tweet,
            "user": $scope.username,
            "date": Date(),
            "approved": false,
            "like": [$scope.username],
            "dislike": []
        };


        $http.post('/tweet', data).success(function(data, status) {

            $.notify(data.message, "success");
            $("#tweet").val(" ");
            $scope.loadTweets();

        }).error(function(data, status, headers, config) {

            $.notify(data.message, "alert");

        });

    }

}]);