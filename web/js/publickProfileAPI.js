$(document).ready(function () {


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

    // function to make form values to json format
    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };

    var getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };

    window.jwt = getCookie('jwt');


    function setResultToPage(result) {
        // document.getElementById("username").innerHTML = result['username'];

        // $("#fname").html(result['personal']['fname']);

        $("#name").html(result['personal']['fname'] + ' ' + result['personal']['lname']);
        $('#titleName').html(result['personal']['fname'] + ' ' + result['personal']['lname']);
        $("#accType").html(result['accType']);
        $("#summary").html(result['personal']['summary']);
        $("#country").html(result['personal']['country']);
        $("#town").html(result['personal']['town']);
        if (result['skills'] != null) {
            for (i in $.parseJSON(result['skills'])) {
                $('#skills_list').append(`<li><a href="#" title="">` + $.parseJSON(result['skills'])[i] + `</a></li>`);
            }
        }

        if (result['profile_pic'] != null) {
            setProfilePic(result);
        }
        if (result['accType'] != 'idea-maker') {
            $('#info-dd').show()
        } else {
            setPosts(result)
            $('#feedTab').show();
            $('#MainTab').show();
            $('#feed-dd').show();
        }


        setWorkForm(result);
        setEducation(result);



    }

    function setEducation(data) {
        if (data['University'] != 'false') {


            var eduHTML = `
            <h3>Education</h3>
            <h4 id="college_degree">`+ data['University']['study_field'] + `</h4>
            <h5 id="university_name">`+ data['University']['uni_name'] + `</h5>
            <span id="uni_date">`+ data['University']['startDate'] + ` - ` + data['University']['endDate'] + `</span>
            <p id="uniSummary">`+ data['University']['summary'] + `</p>
            <input type="hidden" name="UniID" value="1">
            `;
            $('#edu').append(eduHTML);

        } else {
            return false;
        }

    }

    function setWorkForm(data) {
        if (data['work'] != 'false') {

            html = `	
            <h3>Experience</h3>
            <h4>`+ data['work']['position'] + `</h4>
            <h5 >at `+ data['work']['work_name'] + `</h5>
            <span>`+ data['work']['started_date'] + ` - ` + data['work']['end_date'] + `</span>
            <p> `+ data['work']['summary'] + ` </p>
            `;


            // document.getElementById("exp_year").value = result['work']['work_id_user_id'];
            $('#work').append(html);
            $('#title').html(data['work']['position'] + " @ " + data['work']['work_name']);
        }
    }

    function setProfilePic(result) {
        if (result['profile_pic'] != null) {
            $("#usr-pic-main").attr('src', result['profile_pic'].slice(1))
            var token = parseJwt(jwt);
            $("#usr-pic-nav").attr('src', (( token["data"]['ProfilePicUrl'] != null )? token["data"]['ProfilePicUrl'].slice(1) : " images/profile/unkown.jpeg" ));
        }
        if (result['cover_pic'] != null) {
            $("#MyCoverPic").attr('src', result['cover_pic']);
        }
    }

    function SetMyPosts(i, result) {
        var owner = result['posts'][i]['user_id'];
        var postID = result['posts'][i]['post_id'];
        var title = result['posts'][i]['title'];
        var body = result['posts'][i]['caption'];
        var date_created = result['posts'][i]['date_created'];
        date_created = timeSince(new Date(date_created));
        var status = result['posts'][i]['p_status'];
        var skills = result['posts'][i]['skills'];
        var skillsHTML = ``;
        for (x in $.parseJSON(skills)) {
            skillsHTML += '<li><a href="#" title="">' + $.parseJSON(skills)[x] + '</a></li>';
        }

        var name = result['personal']['fname'] + ' ' + result['personal']['lname'];

        html = `
            <div class="post-bar" id="post_`+ postID + `">
            <div class="post_topbar">
            <div class="usy-dt">
                <img style="width: 60px;
                height: 60px;" src="`+ ((result['profile_pic'] != null) ? result['profile_pic'].slice(1) : 'images/profile/unkown.jpeg') + `" alt="">
                <div class="usy-name">
                    <h3>`+ name + `</h3>
                    <span><img src="images/clock.png" alt="">`+ date_created + `</span>
                </div>
            </div>
            <div class="ed-opts">
                <a href="#" title="" class="ed-opts-open"><i class="la la-ellipsis-v"></i></a>
                <ul class="ed-options">
                </ul>
            </div>
            </div>

            <script>
            function openForm`+ postID + `() {
                document.getElementById("`+ postID + `msg").style.display = "block";
                document.getElementById("OpenMsgBut`+ postID + `").style.display = "none";

            }
            
            function closeForm`+ postID + `() {
                document.getElementById("`+ postID + `msg").style.display = "none";
                document.getElementById("OpenMsgBut`+ postID + `").style.display = "contents";

            } 
            </script>

            <div class="epi-sec">					
                <ul class="bk-links">
                <button  style="background-color: rgb(255, 255, 255); display: contents;"  id="OpenMsgBut`+ postID + `" onclick="openForm`+ postID + `()"><li><i class="la la-envelope"></i></li></button>
                <div id="`+ postID + `msg" style="display: none; border: 3px solid #f1f1f1; z-index: 9;">	
                <button id="CloseMsgBut`+ postID + `" onclick="closeForm`+ postID + `()">Close</button>
                <form id="message">
                    <input type="hidden"  name="post_id" value="`+ postID + `">
                    <input type="hidden"  name="target_id" value="`+ owner + `">
                    <textarea placeholder="Type a message here" name="msg"></textarea>
                    <button type="submit"  class="la la-envelope"> </button> 
                </form>
                </ul>
            </div>



            <div class="job_descp">
            <h3>`+ title + `</h3>
            <ul class="job-dt">
                <li><a href="#" title="">`+ status + `</a></li>
            <!-- <li><span>$30 / hr</span></li> -->
            </ul>
            <p>`+ body + `</p>
            <ul class="skill-tags">
            `+ skillsHTML + `
            </ul>
            </div>
            <div class="job-status-bar">
            <ul class="like-com">

            

            <li>
                <a id="`+ postID + `" class="like" href="#" data-text-swap="Unlike" ><i class="la la-heart"></i> Like</a>
            </li>


            <li class="CommentButton_`+ postID + `">
                <a id="`+ postID + `" href="#" title="" class="com"><img src="images/com.png" alt=""> Comment </a></li>
            <li>



        </ul>
       <!-- <a><i class="la la-eye"></i>Views 50</a> -->

    </div>
    <div class="comment-section">


    
    <div  id="comment_box`+ postID + `">


        <div class="post-comment">
        <div class="plus-ic" id="`+ postID + `commentSec" style="display: none;" > 
        <div id="`+ postID + `comment"> </div>
        </div>

        <div class="cm_img">
            <img style="width: 40px;
            height: 40px;"  src=" `+ ((parseJwt(jwt)['data']['ProfilePicUrl'] != null) ? parseJwt(jwt)['data']['ProfilePicUrl'].slice(1) : 'images/profile/unkown.jpeg') + `" alt="">
        </div>

        <div class="comment_box">
            <form id="CommentsForm">
                <input type="text" name="form" placeholder="Post a comment"  required="" >
                <input type="hidden"  name="post_id" value="`+ postID + `">
                <button type="submit">Send</button>
            </form>
        </div>
        </div> 
    </div>    

        <!--post-comment end-->
        </div>
        </div><!--post-bar end-->
            `;


        $('#feed-dd').append(html);

        if (status != "Discussions") {
            $("#comment_box" + postID).remove();
            $(".CommentButton_" + postID).html("");
            switch (status) {
                case "Develop":

                    ((parseJwt(jwt)['data']['accType'] === "developer") ? $(".CommentButton_" + postID).html('<a id="'+postID+'" class="devolop  buttoWhilePostID_' +postID+ '" href="#" data-text-swap="Devolop Request Sent"><i class="la la-code-fork"></i> Devolop</a>') : console.log("NotAllowdToDevolop"));
                    break;
                case "Invest":
                    ((parseJwt(jwt)['data']['accType'] === "investor") ? $(".CommentButton_" + postID).html('<a id="'+postID+'" class="invest buttoWhilePostID_' +postID+ '" href="#" data-text-swap="Invest Request Sent"><i class="la la-bank"></i> Invest</a>') : console.log("NotAllowdToInvest"));
                    break;
                default:
                    ((parseJwt(jwt)['data']['accType'] === "developer") ? $(".CommentButton_" + postID).html('<a id="'+postID+'" class="devolop  buttoWhilePostID_' +postID+ '" href="#" data-text-swap="Devolop Request Sent"><i class="la la-code-fork"></i> Devolop</a>') : console.log("NotAllowdToDevolop"));
                    ((parseJwt(jwt)['data']['accType'] === "investor") ? $(".CommentButton_" + postID).html('<a id="'+postID+'" class="invest  buttoWhilePostID_' +postID+ '" href="#" data-text-swap="Invest Request Sent"><i class="la la-bank"></i> Invest</a>') : console.log("NotAllowdToInvest"));
            }
        }

        if (result['requests'] != false ) {
            for (var w in result['requests']) {
                
                if (result['requests'][w]['post_id'] === postID && parseJwt(jwt)['data']['id'] === result['requests'][w]['user_id'] ) {
                    $('.buttoWhilePostID_' +postID).addClass('invested').click(false);
                }
            }
        }



        if (result['likes'] != 'false') {
            for (w in result['likes']) {
                if (parseJwt(jwt)['data']['id'] === result['likes'][w]['user_id'] && postID === result['likes'][w]['post_id']) {
                    $("#" + result['likes'][w]['post_id']).html('<i class="la la-heart"></i>' + $("#" + result['likes'][w]['post_id'])[0].dataset.textSwap);
                    $("#" + result['likes'][w]['post_id']).removeClass("like").addClass("unlike");
                    $("#" + result['likes'][w]['post_id'])[0].dataset.textSwap = "like";
                }

            }
        }

        return false;
    }

    function setPosts(result) {
        if (result['posts'] != 'false') {


            for (i in result['posts']) {
                SetMyPosts(i, result)

            }
        }
    }

    function custom_sort(a, b) {
        return new Date(a.date_created).getTime() - new Date(b.date_created).getTime();
    }

    function parseJwt(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(window.atob(base64));
    };

    function setComments(Comment, post_id) {
        jwt = getCookie('jwt');
        var body = Comment['content'];
        var time = Comment['date_created'];
        time = timeSince(new Date(time));

        var form_data = JSON.stringify({
            "option": 300,
            "jwt": jwt,
            "user_id": Comment['user_id']
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
                        var DeleteComment = "none";
                        if (Comment['user_id'] === parseJwt(jwt)['data']['id']) {
                            DeleteComment = "block";
                        }


                        var commentHTML = `
                <div id="`+ Comment['comment_id'] + `" class="comment-sec">
                <ul>
                    <li>     
                
                <div class="ed-opts" style="display: `+ DeleteComment + `;" >
                    <a href="#" title="" class="ed-opts-open"><i class="la la-ellipsis-v"></i></a>
                    <ul class="ed-options" style="width: 75px;padding-left: 10px;padding-right: 10px;">
                        <li><a id="delete_Comment" data-comment_id="`+ Comment['comment_id'] + `"  href="#" title="">Delete</a></li>
                    </ul>
                </div>

                        <div class="comment-list">
                        
                            <div class="bg-img">
                                <img style="width: 40px;
                                height: 40px;" src="`+ profile_pic + `" alt="">
                            </div>
                            <div class="comment">

                                                    

                                <h3> <a href="profile.html?user_id=`+ Comment['user_id'] + `&username=` + rresult['name']['username'] + `">` + name + `</a></h3>
                                <span><img src="images/clock.png" alt=""> `+ time + ` </span>
                                <p>`+ body + ` </p>
                                
                            </div>
                        </div>
                    </li>
                </ul>
            </div>                
        `;


                        $("#" + post_id + "comment").append(commentHTML);


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

    }

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



    var url = "/api/index.php/profile/" + getUrlParameter('user_id') + '/' + getUrlParameter('username');
    $.get(url, function (data) {
        var result = $.parseJSON(data);
        setResultToPage(result);
        console.table(result);

    });




    $(document).on('submit', '#CommentsForm', function () {
        var update_account_form = $(this);
        var jwt = getCookie('jwt');
        var update_account_form_obj = update_account_form.serializeObject()
        update_account_form[0][0].value = "";
        // add jwt on the object
        update_account_form_obj.jwt = jwt;
        // convert object to json string
        var form_data = JSON.stringify({
            "option": 10,
            "jwt": update_account_form_obj.jwt,
            "data": update_account_form_obj
        });
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {

                console.log(this.responseText);
                res = $.parseJSON(this.responseText);
                console.log(res);
                try {
                    if (res['status'] === 200) {


                        var commentHTML = `

                    <div class="comment-sec">
                    <ul>
                        <li>
                            <div class="comment-list">
                                <div class="bg-img">
                                    <img style="width: 40px;
                                    height: 40px;" src="`+ $('#usr-pic-nav')[0]['src'] + `" alt="">
                                </div>
                                <div class="comment">
                                    <h3>`+ parseJwt(jwt)['data']['fname'] + ' ' + parseJwt(jwt)['data']['lname'] + `</h3>
                                    <span><img src="images/clock.png" alt="">  now </span>
                                    <p>`+ update_account_form_obj['form'] + ` </p>
                                    
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>                
                        `;

                        $("#" + update_account_form_obj['post_id'] + "comment").append(commentHTML);


                    } else {
                        // on error/fail, tell the user he needs to login to show the account page
                        // window.location.href = "?login";
                    }
                }
                catch (err) {
                    console.log(err);
                    // on error/fail, tell the user he needs to login to show the account page
                    // window.location.href = "?login";
                }
            }
        });
        xhr.open("POST", "/api/index.php/home/");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.send(form_data);
        return false;
    });

    $(document).on('submit', '#messageForm', function () {

        var jwt = getCookie('jwt');
        // add jwt on the object
        // convert object to json string
        var msgForm = $(this);
        var msg = msgForm.serializeObject()

        var form_data = JSON.stringify({
            "option": 300,
            "jwt": jwt,
            "user_id": getUrlParameter('user_id'),
            "msg": msg['msg']

        });
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            
            if (this.readyState === 4) {

                try {
                    console.log(this.responseText);
                    result = $.parseJSON(this.responseText);
                    if (result['msges'] === true) {
                        $(".bbbnotify").toggleClass("CMVactive");
                        $("#notifyType").toggleClass("success");
                        $('#msg').val('');
                        setTimeout(function () {
                            $(".bbbnotify").removeClass("CMVactive");
                            $("#notifyType").removeClass("success");
                            $('#modal').hide();
                        }, 2000);
                    }
                }
                catch (err) {
                    console.log(err);
                    $(".bbbnotify").addClass("CMVactive");
                    $("#notifyType").addClass("failure");

                    setTimeout(function () {
                        $(".bbbnotify").removeClass("CMVactive");
                        $("#notifyType").removeClass("failure");
                    }, 5000);

                }
            }
        });
        xhr.open("POST", "/api/index.php/action");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.send(form_data);
        return false;

    });

    $(document).on('submit', '#message', function () {
        var update_account_form = $(this);
        var jwt = getCookie('jwt');
        var update_account_form_obj = update_account_form.serializeObject()
        // add jwt on the object
        update_account_form_obj.jwt = jwt;
        // convert object to json string


        var form_data = JSON.stringify({
            "option": 150,
            "jwt": update_account_form_obj.jwt,
            "post_id": update_account_form_obj['post_id'],
            "target": update_account_form_obj['target_id'],
            "msg": update_account_form_obj['msg']

        });
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                console.log(form_data);
                console.log(this.responseText);
                result = $.parseJSON(this.responseText);
                try {
                    if (result['status'] === 200) {
                        $("#" + update_account_form_obj['post_id'] + "msg").html("<div class='alert alert-success'>Succsefully Sent.</div>");



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
        xhr.open("POST", "/api/index.php/action");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.send(form_data);
        return false;
    });

    $(document).on('submit', '#SendMsg', function () {
        window.update_account_form = $(this);
        var jwt = getCookie('jwt');
        var update_account_form_obj = update_account_form.serializeObject()
        // add jwt on the object
        update_account_form_obj.jwt = jwt;
        // convert object to json string


        var form_data = JSON.stringify({
            "option": 300,
            "jwt": update_account_form_obj.jwt,
            "user_id": update_account_form_obj['target_id'],
            "msg": update_account_form_obj['message']

        });
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {

                try {
                    result = $.parseJSON(this.responseText);
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
    });

    $(document).on('click', '.ed-opts-open', function () {
        $(this).next(".ed-options").toggleClass("active");
        return false;
    });

    $(document).on('click', '#delete_Comment', function () {
        var jwt = getCookie('jwt');
        var object = $(this);

        var form_data = JSON.stringify({
            "option": 200,
            "jwt": jwt,
            "comment_id": object.data('comment_id')
        });

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                var rresult = $.parseJSON(this.responseText);
                try {
                    if (rresult) {
                        console.log(rresult);
                        $("#" + object.data('comment_id')).remove();

                    } else {
                    }
                }
                catch (err) {
                    console.log(err);
                }
            }
        });
        xhr.open("POST", "/api/index.php/home/");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.send(form_data);
        return false;
    });

    $(document).on('click', '.com', function () {
        var update_account_form = $(this);
        var post_id = parseInt(update_account_form[0].id);
        var jwt = getCookie('jwt');
        // add jwt on the object
        // convert object to json string
        var form_data = JSON.stringify({
            "option": 250,
            "jwt": jwt,
            "post_id": post_id
        });
        update_account_form.attr("disabled", true);
        $("#" + post_id + "commentSec").show();

        update_account_form.click(false);

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                resultx = $.parseJSON(this.responseText);
                console.log(resultx);
                try {
                    if (resultx['status'] === 200) {
                        var CommentData = resultx['data'].sort(custom_sort);

                        for (n in CommentData) {
                            var Comment = CommentData[n];
                            setComments(Comment, post_id);
                        }

                    } else {
                        // on error/fail, tell the user he needs to login to show the account page
                        // window.location.href = "?login";
                    }
                }
                catch (err) {
                    console.log(err);
                    // on error/fail, tell the user he needs to login to show the account page
                    // window.location.href = "?login";
                }
            }
        });
        xhr.open("POST", "/api/index.php/home/");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.send(form_data);
        return false;
    });

    $(document).on('click', '.like', function () {
        var object = $(this);
        var post_id = object[0].id;
        var jwt = getCookie('jwt');
        // add jwt on the object
        // convert object to json string


        var form_data = JSON.stringify({
            "option": 2,
            "jwt": jwt,
            "post_id": post_id
        });
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                result = $.parseJSON(this.responseText);
                console.log(result);
                try {
                    if (result['status'] === 200) {

                        object.html('<i class="la la-heart"></i>' + object[0].dataset.textSwap);

                        object.removeClass("like").addClass("unlike");
                        object[0].dataset.textSwap = "like";

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
    });

    $(document).on('click', '.unlike', function () {
        var object = $(this);
        var post_id = object[0].id;
        var jwt = getCookie('jwt');
        // add jwt on the object
        // convert object to json string


        var form_data = JSON.stringify({
            "option": 150,
            "jwt": jwt,
            "post_id": post_id
        });

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                result = $.parseJSON(this.responseText);
                console.log(result);
                try {
                    if (result['status'] === 200) {

                        object.html('<i class="la la-heart"></i>' + object[0].dataset.textSwap);
                        object.removeClass("unlike").addClass("like");
                        object[0].dataset.textSwap = "Unlike";



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
    });



    $(document).on('click', '.invest', function () {
        var object = $(this);
        var post_id = object[0].id;
        var jwt = getCookie('jwt');
        object.click(false);
        // object.removeClass("invest").addClass("invested");
        // object.html('<i class="la la-bank"></i>' + object[0].dataset.textSwap);
        $(".post-popup.invest-pj").addClass("active");
        $(".wrapper").addClass("overlay");
        $('#post_id_invest').val(post_id);

        return false
    });

    $(document).on('click', '.devolop', function () {
        var object = $(this);
        var post_id = object[0].id;
        // object.removeClass("invest").addClass("invested");
        // object.html('<i class="la la-code-fork"></i>' + object[0].dataset.textSwap);
        $(".post-popup.devolop-pj").addClass("active");
        $(".wrapper").addClass("overlay");
        $('#post_id_devolop').val(post_id);
    });

    $(document).on('submit', '#Invest_Form', function () {
        var update_account_form = $(this);
        var jwt = getCookie('jwt');
        var update_account_form_obj = update_account_form.serializeObject()
        // add jwt on the object
        update_account_form_obj.jwt = jwt;
        // convert object to json string
        var form_data = JSON.stringify({
            "option": 600,
            "jwt": update_account_form_obj.jwt,
            "data": update_account_form_obj
        });
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                console.log(this.response);

                result = $.parseJSON(this.responseText);
                try {
                    if (result['status'] === true) {
                        $('.buttoWhilePostID_' +update_account_form_obj['post_id']).addClass('invested').click(false);

                        $('#post_RS2').html("<div class='alert alert-success'>Request Sent Succsefully.</div>");
                        setTimeout(
                            function () {
                                $('#post_RS2').html('');
                                $(".post-popup").removeClass("active");
                                $(".wrapper").removeClass("overlay");
                            }, 2000);

                    } else {
                        $('#post_RS2').html("<div class='alert alert-danger'>Internal Server Error.</div>");
                    }
                }
                catch (err) {
                    $('#post_RS2').html("<div class='alert alert-danger'>Internal Server Error.</div>");
                }
            }
        });
        xhr.open("POST", "/api/index.php/home/");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.send(form_data);
        return false;
    });

    $(document).on('submit', '#Devolop_Form', function () {
        var update_account_form = $(this);
        var jwt = getCookie('jwt');
        var update_account_form_obj = update_account_form.serializeObject()
        // add jwt on the object
        update_account_form_obj.jwt = jwt;
        // convert object to json string
        var form_data = JSON.stringify({
            "option": 600,
            "jwt": update_account_form_obj.jwt,
            "data": update_account_form_obj
        });
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                console.log(this.response);

                result = $.parseJSON(this.responseText);
                try {
                    if (result['status'] === true) {
                        $('.buttoWhilePostID_' +update_account_form_obj['post_id']).addClass('invested').click(false);
                        $('#post_RS3').html("<div class='alert alert-success'>Request Sent Succsefully.</div>");
                        setTimeout(
                            function () {
                                $('#post_RS3').html('');
                                $(".post-popup").removeClass("active");
                                $(".wrapper").removeClass("overlay");
                            }, 2000);

                    } else {
                        $('#post_RS3').html("<div class='alert alert-danger'>Internal Server Error.</div>");
                    }
                }
                catch (err) {
                    $('#post_RS3').html("<div class='alert alert-danger'>Internal Server Error.</div>");
                }
            }
        });
        xhr.open("POST", "/api/index.php/home/");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.send(form_data);
        return false;
    });


    $(document).on('click', '.post-project > a', function () {

        $(".post-popup").removeClass("active");
        $(".wrapper").removeClass("overlay");
        return false;
    });

    $(document).on('click', '.CanslePost', function () {

        $(".post-popup").removeClass("active");
        $(".wrapper").removeClass("overlay");
        return false;
    });


});
