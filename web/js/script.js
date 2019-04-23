$(window).on("load", function () {
    "use strict";

    $("#logout").on("click", function () {
        window.location.replace("/index.html?login")
    });

    $("#Clear-Nut").on("click", function () {
        SetRemovedToNutification();
    });




    //  ============= INFO SWITCH TAB FUNCTIONALITY =========

    $('.tab-feed ul li').on("click", function () {
        var tab_id = $(this).attr('data-tab');
        $('.tab-feed ul li').removeClass('active');
        $('.product-feed-tab').removeClass('current');
        $(this).addClass('active animated fadeIn');
        $("#" + tab_id).addClass('current animated fadeIn');
        return false;
    });



    //  ============= OVERVIEW EDIT FUNCTION =========

    $(".overview-open").on("click", function () {
        $("#overview-box").addClass("open");
        $(".wrapper").addClass("overlay");
        return false;
    });
    $(".close-box").on("click", function () {
        $("#overview-box").removeClass("open");
        $(".wrapper").removeClass("overlay");
        return false;
    });

    //  ============= EXPERIENCE EDIT FUNCTION =========

    $(".exp-bx-open").on("click", function () {
        $("#experience-box").addClass("open");
        $(".wrapper").addClass("overlay");
        return false;
    });
    $(".close-box").on("click", function () {
        $("#experience-box").removeClass("open");
        $(".wrapper").removeClass("overlay");
        return false;
    });

    //  ============= EDUCATION EDIT FUNCTION =========

    $(".ed-box-open").on("click", function () {
        $("#education-box").addClass("open");
        $(".wrapper").addClass("overlay");
        return false;
    });
    $(".close-box").on("click", function () {
        $("#education-box").removeClass("open");
        $(".wrapper").removeClass("overlay");
        return false;
    });

    //  ============= LOCATION EDIT FUNCTION =========

    $(".lct-box-open").on("click", function () {
        $("#location-box").addClass("open");
        $(".wrapper").addClass("overlay");
        return false;
    });
    $(".close-box").on("click", function () {
        $("#location-box").removeClass("open");
        $(".wrapper").removeClass("overlay");
        return false;
    });

    //  ============= SKILLS EDIT FUNCTION =========

    $(".skills-open").on("click", function () {
        $("#skills-box").addClass("open");
        $(".wrapper").addClass("overlay");
        return false;
    });
    $(".close-box").on("click", function () {
        $("#skills-box").removeClass("open");
        $(".wrapper").removeClass("overlay");
        return false;
    });





    //  ================== Edit Options Function =================


    // $(".ed-opts-open").on("click", function(){
    //     $(this).next(".ed-options").toggleClass("active");
    //     return false;
    // });


    // ============== Menu Script =============

    $(".menu-btn > a").on("click", function () {
        $("nav").toggleClass("active");
        return false;
    });


    //  ============ Notifications Open =============
    var ClickCounter = 0;
    $(".not-box-open").on("click", function () {
        $(this).next(".notification-box").toggleClass("active");
        if (ClickCounter % 2 === 0){
            $(".notificationCounter").hide();
            setCookie("notification-read-counter", parseInt($(".notificationCounter").html()), 1);
            SetRedToNutifcation();
        }
        ClickCounter = ClickCounter + 1 ;
    });



    //  ============ Messages Open =============

    $(".msg-box-open").on("click", function () {
        $(this).next(".notification-box").toggleClass("active");

    });

    // ============= User Account Setting Open ===========

    $(".user-info").on("click", function () {
        $(this).next(".user-account-settingss").toggleClass("active");
    });

    //  ============= FORUM LINKS MOBILE MENU FUNCTION =========

    $(".forum-links-btn > a").on("click", function () {
        $(".forum-links").toggleClass("active");
        return false;
    });
    $("html").on("click", function () {
        $(".forum-links").removeClass("active");
    });
    $(".forum-links-btn > a, .forum-links").on("click", function () {
        e.stopPropagation();
    });

    //  ============= PORTFOLIO SLIDER FUNCTION =========

    $('.profiles-slider').slick({
        slidesToShow: 3,
        slck: true,
        slidesToScroll: 1,
        prevArrow: '<span class="slick-previous"></span>',
        nextArrow: '<span class="slick-nexti"></span>',
        autoplay: true,
        dots: false,
        autoplaySpeed: 2000,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
            // You can unslick at a given breakpoint now by adding:
            // settings: "unslick"
            // instead of a settings object
        ]


    });


    function custom_sort(a, b) {
        return new Date(a.date_created).getTime() - new Date(b.date_created).getTime();
    };

    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }

            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    };

    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    };

    function timeSince(date) {

        var seconds = Math.floor((new Date() - date) / 1000);

        var interval = Math.floor(seconds / 31536000);

        if (interval > 1) {
            return interval + " years";
        }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
            return interval + " months";
        }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
            return interval + " days";
        }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
            return interval + " hours";
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
            return interval + " minutes";
        }
        return Math.floor(seconds) + " seconds";
    };

    function SetRedToNutifcation() {
        var form_data = JSON.stringify({
            "option": 650,
            "jwt": jwt
        });

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                console.log(this.responseText);
                var rresult = $.parseJSON(this.responseText);
                try {
                    if (rresult['status'] === true) {
                        $(".notificationCounter").hide();
                        $(".notificationCounter").html('0');
                    } else {
                    }
                }
                catch (err) {
                    console.log(err);
                }
            }
        });
        xhr.open("POST", "/api/index.php/action");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.send(form_data);
        return false;
    };

    function SetRemovedToNutification() {
        var form_data = JSON.stringify({
            "option": 600,
            "jwt": jwt
        });

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                console.log(this.responseText);
                var rresult = $.parseJSON(this.responseText);
                try {
                    if (rresult['status'] === true) {
                        $(".notificationCounter").hide();
                        $(".notificationCounter").html('0');
                        $("#NutfList").html("");

                    } else {
                    }
                }
                catch (err) {
                    console.log(err);
                }
            }
        });
        xhr.open("POST", "/api/index.php/action");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.send(form_data);
        return false;
    };

    window.jwt = getCookie("jwt");


    GetOldNutfication();
    Update();
    var PlaySound = false;
    setInterval(function () { Update(); }, 1000);


    function GetOldNutfication() {
        var form_data = JSON.stringify({
            "option": 700,
            "jwt": jwt
        });

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                try {
                    if (this.responseText.length > 1) {
                        var notification = $.parseJSON(this.responseText);
                        console.log(notification);
                        notification = notification.sort(custom_sort);
                        for (var xn = notification.length - 1; xn >= 0; xn--) {
                            if (notification[xn]['comment_id'] != null) {
                                AppendOldCommentNutfication(notification[xn]);
                            } else {
                                AppendOldLikeNutfication(notification[xn]);
                            }
                        }
                    }


                }
                catch (err) {
                    console.log(err);

                }
            }
        });
        xhr.open("POST", "/api/index.php/action");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.send(form_data);
        return false;
    };

    function Update() {
        var form_data = JSON.stringify({
            "option": 500,
            "jwt": jwt
        });

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                var rresult = $.parseJSON(this.responseText);
                try {
                    if (rresult) {

                        if (rresult['msgs'] != false) {
                            var curentmsgs = ($(".MessagesCounter").html() === " ") ? 0 : parseInt($(".MessagesCounter").html());
                            if (rresult['msgs'].length > curentmsgs) {
                                if (PlaySound != false){
                                    var x = document.getElementById("myAudio");
                                    x.play();
                                }


                                $(".MessagesCounter").html(rresult['msgs'].length);
                                $(".MessagesCounter").show();
                                SetMsgs(rresult['msgs']);
                            }

                        }


                        if (rresult['nutf']['likes'] != false || rresult['nutf']['comments'] != false) {
                            var commentsCounter = (rresult['nutf']['comments'] != false) ? rresult['nutf']['comments'].length : 0;
                            var LikesCounter = (rresult['nutf']['likes'] != false) ? rresult['nutf']['likes'].length : 0;

                            var curent = ($(".notificationCounter").html() === " ") ? 0 : parseInt($(".notificationCounter").html());

                            if ((commentsCounter + LikesCounter) > curent) {
                                // $("#NutfList").html("");
                                if (PlaySound != false){
                                    var y = document.getElementById("myAudioGlasyNtuf");
                                    y.play();       
                                }

                                SetNotification(rresult['nutf']);
                            }


                        }



                    } else {
                    }
                }
                catch (err) {
                    console.log(err);
                }
                PlaySound = true;
            }
        });
        xhr.open("POST", "/api/index.php/action");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.send(form_data);
        return false;
    };


    function parseJwt(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(window.atob(base64));
    };
    var token = parseJwt(jwt);

    var url = "/api/index.php/home/" + token['data']['id'] + '/' + token['data']['username'];
    $.get(url, function (data) {
        console.log(data);
        var result = $.parseJSON(data);
        $("#fname").html(result['personal']['fname']);
        if (result['profile_pic'] != null) {
            $("#usr-pic-nav").attr('src', result['profile_pic'].slice(1))
        }


    });


    function SetMsgs(msgs) {

        $("#navMsgs").html("");

        
        // msgsUsersUsed.push("n506070");
        var msgsUsersUsed = [];
        if (msgs['user_id_from']) {
            AddMsgs(msgs[i]);
            msgsUsersUsed.push(msgs[i]['user_id_from']);
        } else {

            for (var i in msgs) {
                if (SortMsgs(msgs, i, msgsUsersUsed) != false) {
                    var msgDataHtml = `                                
                    <p>`+ msgs[i]['content'] + `</p><span> `+ timeSince(new Date(msgs[i]['date_created'])) + ` </span>
                    `;
                    var id = "#msgBody" + msgs[i]['user_id_from'] ;
                    $(id).html(msgDataHtml);
                    
                } else {
                    AddMsgs(msgs[i]);
                    msgsUsersUsed.push(msgs[i]['user_id_from']);
                }



            }
        }
    };

    function SortMsgs(msgsX, n, msgsUsersUsed) {
        for (var x in msgsUsersUsed) {
            if (msgsX[n]['user_id_from'] === msgsUsersUsed[x]) {
                return true;
            }
        }
        return false;
    };

    function AddMsgs(MsgData) {
        jwt = getCookie('jwt');

        var form_data = JSON.stringify({
            "option": 300,
            "jwt": jwt,
            "user_id": MsgData['user_id_from']
        });

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                var rresult = $.parseJSON(this.responseText);
                try {
                    if (rresult['status'] === 200) {

                        var name = rresult['name']['fname'] + ' ' + rresult['name']['lname'];
                        var profile_pic = ((rresult['name']['profile_picture_url'] != null) ? rresult['name']['profile_picture_url'].slice(1) : 'images/profile/unkown.jpeg');

                        var msgHTML = `
                        <div class="notfication-details">
                        <div class="noty-user-img">
                            <img src="`+ profile_pic + `" alt="">
                        </div>
                        <div class="notification-info">
                            <h3><a href="messages.html?user=`+ MsgData['user_id_from'] + `" title="">` + name + `</a> </h3>
                            

                                <p>`+ MsgData['content'] + `</p>
                                <span>`+ timeSince(new Date(MsgData['date_created'])) + `</span>
                                <div id="msgBody`+ MsgData['user_id_from'] + `"> </div>

                        </div>
                        <!--notification-info -->
                    </div>

        `;



                        $("#navMsgs").append(msgHTML);

                        // $('#Post_Form').html("<div class='alert alert-success'>Posted Succsefully.</div>");
                    } else {
                        // on error/fail, tell the user he needs to login to show the account page
                        // $('#post_RS').html("<div class='alert alert-danger'>Internal Server Error.</div>");
                        // window.location.href = "?login";
                    }
                }
                catch (err) {
                    console.log(err);
                    // on error/fail, tell the user he needs to login to show the account page
                    // $('#post_RS').html("<div class='alert alert-danger'>Internal Server Error.</div>");
                    // window.location.href = "?login";
                }
            }
        });
        xhr.open("POST", "/api/index.php/home/");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.send(form_data);
        return false;
    };


    function SetNotification(NotificationData) {


        window.nutification = [];

        if (NotificationData['likes'] != false) {

            if (NotificationData['likes'].length > 1) {
                for (var i in NotificationData['likes']) {

                    // AppendLikeNutfication(NotificationData['likes'][i]);
                    nutification.push(NotificationData['likes'][i]);
                }
            } else {
                // AppendLikeNutfication(NotificationData['likes'][0]);
                nutification.push(NotificationData['likes'][0]);

            }

        }
        if (NotificationData['comments'] != false) {

            if (NotificationData['comments'].length > 1) {
                for (var x in NotificationData['comments']) {

                    // AppendCommentNutfication(NotificationData['comments'][x]);
                    nutification.push(NotificationData['comments'][x]);
                }
            } else {
                // AppendCommentNutfication(NotificationData['comments'][0], nutification);
                nutification.push(NotificationData['comments'][0]);
            }
        }

        var data = nutification.sort(custom_sort);
        $(".notificationCounter").show();
        $(".notificationCounter").html(data.length);
        $("#newNutfList").html('');
        for (var n = data.length - 1; n >= 0; n--) {

            if (data[n][4] != null) {
                AppendCommentNutfication(data[n]);
            } else {
                AppendLikeNutfication(data[n]);
            }

        }


        return false;
    };

    function AppendCommentNutfication(comment) {
        jwt = getCookie('jwt');

        var form_data = JSON.stringify({
            "option": 300,
            "jwt": jwt,
            "user_id": comment['user_id']
        });

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                var rresult = $.parseJSON(this.responseText);
                try {
                    if (rresult['status'] === 200) {

                        var name = rresult['name']['fname'] + ' ' + rresult['name']['lname'];
                        var profile_pic = ((rresult['name']['profile_picture_url'] != null) ? rresult['name']['profile_picture_url'].slice(1) : 'images/profile/unkown.jpeg');

                        var CommentHtml = `
                        <div style="background-color: #edf2fa;" class="notfication-details">
                        <div class="noty-user-img">
                            <img src="`+ profile_pic + `" alt="">
                        </div>
                        <div class="notification-info">
                            <h3><a href="profile.html?user_id=`+ comment['user_id'] + `&username=` + rresult['name']['username'] + `" title="">` + name + `</a> Comment on your project.
                            <p> `+ comment['content'] + ` </p>
                            </h3><br/>
                            <span>`+ timeSince(new Date(comment['date_created'])) + `</span>
                        </div>
                        <!--notification-info -->
                    
                    
                    
                    </div>

        `;



                        $("#newNutfList").append(CommentHtml);
                        // nutification.push({
                        //     "data" :  CommentHtml,
                        //     "date_created" : comment['date_created'] 
                        // });

                        // $('#Post_Form').html("<div class='alert alert-success'>Posted Succsefully.</div>");
                    } else {
                        // on error/fail, tell the user he needs to login to show the account page
                        // $('#post_RS').html("<div class='alert alert-danger'>Internal Server Error.</div>");
                        // window.location.href = "?login";
                    }
                }
                catch (err) {
                    console.log(err);
                    // on error/fail, tell the user he needs to login to show the account page
                    // $('#post_RS').html("<div class='alert alert-danger'>Internal Server Error.</div>");
                    // window.location.href = "?login";
                }
            }
        });
        xhr.open("POST", "/api/index.php/home/");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.send(form_data);
        return false;
    };

    function AppendOldLikeNutfication(like) {
        jwt = getCookie('jwt');

        var form_data = JSON.stringify({
            "option": 300,
            "jwt": jwt,
            "user_id": like['user_id']
        });

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                var rresult = $.parseJSON(this.responseText);
                try {
                    if (rresult['status'] === 200) {

                        var name = rresult['name']['fname'] + ' ' + rresult['name']['lname'];
                        var profile_pic = ((rresult['name']['profile_picture_url'] != null) ? rresult['name']['profile_picture_url'].slice(1) : 'images/profile/unkown.jpeg');

                        var LikeHtml = `
                        <div  class="notfication-details">
                        <div class="noty-user-img">
                            <img src="`+ profile_pic + `" alt="">
                        </div>
                        <div class="notification-info">
                            <h3><a href="profile.html?user_id=`+ like['user_id'] + `&username=` + rresult['name']['username'] + `" title="">` + name + `</a> Liked your project. .
                            </h3>
                            <span>`+ timeSince(new Date(like['date_created'])) + `</span>
                        </div>
                        <!--notification-info -->
                    
                    
                    
                    </div>

        `;



                        $("#NutfList").append(LikeHtml);
                        // nutification.push({
                        //     "data" :  LikeHtml,
                        //     "date_created" : like['date_created']
                        // });


                        // $('#Post_Form').html("<div class='alert alert-success'>Posted Succsefully.</div>");
                    } else {
                        // on error/fail, tell the user he needs to login to show the account page
                        // $('#post_RS').html("<div class='alert alert-danger'>Internal Server Error.</div>");
                        // window.location.href = "?login";
                    }
                }
                catch (err) {
                    console.log(err);
                    // on error/fail, tell the user he needs to login to show the account page
                    // $('#post_RS').html("<div class='alert alert-danger'>Internal Server Error.</div>");
                    // window.location.href = "?login";
                }
            }
        });
        xhr.open("POST", "/api/index.php/home/");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.send(form_data);
        return false;
    };

    function AppendOldCommentNutfication(comment) {
        jwt = getCookie('jwt');

        var form_data = JSON.stringify({
            "option": 300,
            "jwt": jwt,
            "user_id": comment['user_id']
        });

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                var rresult = $.parseJSON(this.responseText);
                try {
                    if (rresult['status'] === 200) {

                        var name = rresult['name']['fname'] + ' ' + rresult['name']['lname'];
                        var profile_pic = ((rresult['name']['profile_picture_url'] != null) ? rresult['name']['profile_picture_url'].slice(1) : 'images/profile/unkown.jpeg');

                        var CommentHtml = `
                        <div  class="notfication-details">
                        <div class="noty-user-img">
                            <img src="`+ profile_pic + `" alt="">
                        </div>
                        <div class="notification-info">
                            <h3><a href="profile.html?user_id=`+ comment['user_id'] + `&username=` + rresult['name']['username'] + `" title="">` + name + `</a> Comment on your project.
                            <p> `+ comment['content'] + ` </p>
                            </h3><br/>
                            <span>`+ timeSince(new Date(comment['date_created'])) + `</span>
                        </div>
                        <!--notification-info -->
                    
                    
                    
                    </div>

        `;



                        $("#NutfList").append(CommentHtml);
                        // nutification.push({
                        //     "data" :  CommentHtml,
                        //     "date_created" : comment['date_created'] 
                        // });

                        // $('#Post_Form').html("<div class='alert alert-success'>Posted Succsefully.</div>");
                    } else {
                        // on error/fail, tell the user he needs to login to show the account page
                        // $('#post_RS').html("<div class='alert alert-danger'>Internal Server Error.</div>");
                        // window.location.href = "?login";
                    }
                }
                catch (err) {
                    console.log(err);
                    // on error/fail, tell the user he needs to login to show the account page
                    // $('#post_RS').html("<div class='alert alert-danger'>Internal Server Error.</div>");
                    // window.location.href = "?login";
                }
            }
        });
        xhr.open("POST", "/api/index.php/home/");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.send(form_data);
        return false;
    };

    function AppendLikeNutfication(like) {
        jwt = getCookie('jwt');

        var form_data = JSON.stringify({
            "option": 300,
            "jwt": jwt,
            "user_id": like['user_id']
        });

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                var rresult = $.parseJSON(this.responseText);
                try {
                    if (rresult['status'] === 200) {

                        var name = rresult['name']['fname'] + ' ' + rresult['name']['lname'];
                        var profile_pic = ((rresult['name']['profile_picture_url'] != null) ? rresult['name']['profile_picture_url'].slice(1) : 'images/profile/unkown.jpeg');

                        var LikeHtml = `
                        <div style="background-color: #edf2fa;" class="notfication-details">
                        <div class="noty-user-img">
                            <img src="`+ profile_pic + `" alt="">
                        </div>
                        <div class="notification-info">
                            <h3><a href="profile.html?user_id=`+ like['user_id'] + `&username=` + rresult['name']['username'] + `" title="">` + name + `</a> Liked your project. .
                            </h3>
                            <span>`+ timeSince(new Date(like['date_created'])) + `</span>
                        </div>
                        <!--notification-info -->
                    
                    
                    
                    </div>

        `;



                        $("#newNutfList").append(LikeHtml);
                        // nutification.push({
                        //     "data" :  LikeHtml,
                        //     "date_created" : like['date_created']
                        // });


                        // $('#Post_Form').html("<div class='alert alert-success'>Posted Succsefully.</div>");
                    } else {
                        // on error/fail, tell the user he needs to login to show the account page
                        // $('#post_RS').html("<div class='alert alert-danger'>Internal Server Error.</div>");
                        // window.location.href = "?login";
                    }
                }
                catch (err) {
                    console.log(err);
                    // on error/fail, tell the user he needs to login to show the account page
                    // $('#post_RS').html("<div class='alert alert-danger'>Internal Server Error.</div>");
                    // window.location.href = "?login";
                }
            }
        });
        xhr.open("POST", "/api/index.php/home/");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.send(form_data);
        return false;
    };






});

