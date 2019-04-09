
$(document).ready(function () {

    try {
        loadPage();
    } catch (error) {
        console.log(error);
    }

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
    }

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

    function loadPage() {
        // validate jwt to verify access
        var jwt = getCookie('jwt');
        var data = JSON.stringify({
            "status": 200,
            "jwt": jwt
        });
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                try {
                    result = $.parseJSON(this.responseText)
                    if (result) {
                        console.log(result);
                        setResultToPage(result);
                        try {
                            setPosts(result);
                        } catch (error) {
                            console.log(error);
                        }

                        if (result['profile_pic'] != null) {
                            setProfilePic(result);
                        }

                        if (result['msg'] != false){
                            SetMsgs(result['msg']);
                        }
                        SetNotification(result['nutf']);

                        // ShowAccountUpdateForm();
                    } else {
                        // on error/fail, tell the user he needs to login to show the account page
                        window.location.href = "?login";
                    }
                }
                catch (err) {
                    // on error/fail, tell the user he needs to login to show the account page
                    window.location.href = "?login";
                }
            }
        });
        xhr.open("POST", "/api/index.php/home/");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.send(data);


    }

    function setResultToPage(result) {
        // document.getElementById("username").innerHTML = result['username'];

        $("#fname").html(result['personal']['fname']);

        $("#name").html(result['personal']['fname'] + ' ' + result['personal']['lname']);

        $("#accType").html(result['accType']);
        if (result['accType'] === "idea-maker") {
            $('#Post_button').html('<li><a class="post_project" href="#" title="">Post a Project</a></li>');
        }





        // document.getElementById("phone").value = result['personal']['contact']['phone'];
        // document.getElementById("email").value = result['personal']['contact']['email'];
        // document.getElementById("country").value = result['personal']['country'];
        // document.getElementById("town").value = result['personal']['town'];
        // document.getElementById("gender").value = result['personal']['gender'];
        // document.getElementById("summary1").value = result['personal']['summary'];
        // document.getElementById("date").value = result['personal']['date'];

        // if (result['work'] != 'false') {
        //     document.getElementById("work_name").value = result['work']['work_name'];
        //     document.getElementById("position").value = result['work']['position'];
        //     document.getElementById("exp_year").value = result['work']['exp_Years'];
        //     document.getElementById("start_work").value = result['work']['started_date'];
        //     document.getElementById("end_work").value = result['work']['end_date'];
        //     document.getElementById("summary2").value = result['work']['summary'];
        // }

        // if (result['University'] != 'false') {
        //     document.getElementById("university_name").value = result['University']['uni_name'];
        //     document.getElementById("college_degree").value = result['University']['study_field'];
        //     document.getElementById("year").value = result['University']['year'];
        //     document.getElementById("start_study").value = result['University']['startDate'];
        //     document.getElementById("end_study").value = result['University']['endDate'];
        //     document.getElementById("summary3").value = result['University']['summary'];
        // }


    }

    function setProfilePic(result) {
        if (result['profile_pic'] != null) {
            $("#usr-pic-main").attr('src', result['profile_pic'].slice(1))
            $("#usr-pic-post").attr('src', result['profile_pic'].slice(1))
            $("#usr-pic-nav").attr('src', result['profile_pic'].slice(1))

        }
    }

    function setPosts(result) {
        if (result['posts'] != null) {

            for (i in result['posts']) {
                owner = result['posts'][i]['user_id'];

                if (owner === result['user_id']) {

                    SetMyPosts(i, result);
                }
                else {

                    SetOtherPost(i, result)
                }
            }
        }
    }

    function SetMyPosts(i, result) { 
        var owner = result['posts'][i]['user_id'];
        var postID = result['posts'][i]['post_id'];
        var title = result['posts'][i]['title'];
        var body = result['posts'][i]['caption'];
        var date_created = result['posts'][i]['date_created'];
        var status = result['posts'][i]['p_status'];
        var skills = result['posts'][i]['skills'];
        var skillsHTML = ``;
        for (x in $.parseJSON(skills)) {
            skillsHTML += '<li><a href="#" title="">' + $.parseJSON(skills)[x] + '</a></li>';
        }

        var name = result['personal']['fname'] + ' ' + result['personal']['lname'];

        html = `
    <div class="post-bar" id="post_`+ postID +`">
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
                <input type="hidden"  name="post_id" value="`+ postID + `"> 
                 <li><a href="#" class="Delete-Post" title="">DELETE</a></li> 
            </ul>
        </div>
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
                <form id="LikeForm">
                <input type="hidden"  name="post_id" value="`+ postID + `"> 
                <input type="hidden" id="`+ postID + `50S50"  name="action" value="2"> 
                <button type="submit" name="like" value="1" id="`+ postID + `"><i class="la la-heart"></i><div id="` + postID + `like">Like</div></button> 
                </form>
                
                
            </li> 
            <li>
            <form id="GetComments">
            <input type="hidden"  name="post_id" value="`+ postID + `"> 
            <button type="submit" name="comment"  id="`+ postID + `comm"><i title="" class="com"><img src="images/com.png"> </i> <div> Comment </div> </button> 
            </form>
            </li> 

        </ul>
       <!-- <a><i class="la la-eye"></i>Views 50</a> -->

    </div>
    <div class="comment-section" id="`+ postID + `commentSec"  style="visibility: hidden;">
<div class="plus-ic">
</div>

<div class="post-comment">
<div id="`+ postID + `comment"> </div>

<div class="cm_img">
    <img style="width: 40px;
    height: 40px;"  src=" `+ ((result['profile_pic'] != null) ? result['profile_pic'].slice(1) : 'images/profile/unkown.jpeg') + `" alt="">
</div>

<div class="comment_box">
    <form id="CommentsForm">
        <input type="text" name="form" placeholder="Post a comment"  required="" >
        <input type="hidden"  name="post_id" value="`+ postID + `">
        <button type="submit">Send</button>
    </form>
</div>
</div>    
<!--post-comment end-->
</div>
</div><!--post-bar end-->
    `;


        $('#Posts_list').append(html);
        if (result['likes'] != 'false') {
            for (w in result['likes']) {
                $("#" + result['likes'][w]['post_id'] + "50S50").val(150);
                $("#" + result['likes'][w]['post_id'] + "like").html("Un Like");

            }
        }
        return false;
    }


    function SetOtherPost(i, result) {
        var owner = result['posts'][i]['user_id'];
        var postID = result['posts'][i]['post_id'];
        var title = result['posts'][i]['title'];
        var body = result['posts'][i]['caption'];
        var date_created = result['posts'][i]['date_created'];
        var status = result['posts'][i]['p_status'];
        var skills = result['posts'][i]['skills'];
        var skillsHTML = ``;
        for (x in $.parseJSON(skills)) {
            skillsHTML += '<li><a href="#" title="">' + $.parseJSON(skills)[x] + '</a></li>';
        }


        var jwt = getCookie('jwt');
        var form_data = JSON.stringify({
            "option": 300,
            "jwt": jwt,
            "user_id": owner
        });

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                var rrresult = $.parseJSON(this.responseText);
                try {
                    if (rrresult['status'] === 200) {

                        var name = rrresult['name']['fname'] + ' ' + rrresult['name']['lname'];
                        var profile_pic = ((rrresult['name']['profile_picture_url'] != null) ? rrresult['name']['profile_picture_url'].slice(1) : 'images/profile/unkown.jpeg');





                        html = `
        <div class="post-bar">
        <div class="post_topbar">
            <div class="usy-dt">
                <img style="width: 60px;
                height: 60px;" src="`+ profile_pic + `" alt="">
                <div class="usy-name">
                    <h3> <a href="profile.html?id=`+ owner +`&username=`+ rresult['name']['username'] + `">` + name + `</a></h3>
                    <span><img src="images/clock.png" alt="">`+ date_created + `</span>
                </div>
            </div>
            <div class="ed-opts">
                <a href="#" title="" class="ed-opts-open"><i class="la la-ellipsis-v"></i></a>
                <ul class="ed-options">
                    <!-- <li><a href="#" title="">Edit Post</a></li> -->
                </ul>
            </div>
        </div>

        <script>
        function openForm() {
            document.getElementById("`+postID+`msg").style.display = "block";
            document.getElementById("OpenMsgBut`+postID+`").style.display = "none";

        }
          
        function closeForm() {
            document.getElementById("`+postID+`msg").style.display = "none";
            document.getElementById("OpenMsgBut`+postID+`").style.display = "block";

        } 
        </script>

        <div class="epi-sec">					
            <ul class="bk-links">
            <button id="OpenMsgBut`+postID+`" onclick="openForm()">Send a Message</button>
            <div id="`+postID+`msg" style="display: none; border: 3px solid #f1f1f1; z-index: 9;">	
            <button id="CloseMsgBut`+postID+`" onclick="closeForm()">Close</button>
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
                    <form id="LikeForm">
                    <input type="hidden"  name="post_id" value="`+ postID + `"> 
                    <input type="hidden" id="`+ postID + `50S50"  name="action" value="2"> 
                    <button type="submit" name="like" value="1" id="`+ postID + `"><i class="la la-heart"></i><div id="` + postID + `like">Like</div></button> 
                    </form>
                    
                    
                </li> 
                <li>
                <form id="GetComments">
                <input type="hidden"  name="post_id" value="`+ postID + `"> 
                <button type="submit" name="comment"  id="`+ postID + `comm"><i title="" class="com"><img src="images/com.png"> </i> <div> Comment </div> </button> 
                </form>
                </li> 

            </ul>
           <!-- <a><i class="la la-eye"></i>Views 50</a> -->

        </div>
        <div class="comment-section" id="`+ postID + `commentSec"  style="visibility: hidden;">
<div class="plus-ic">
</div>

<div class="post-comment">
<div id="`+ postID + `comment"> </div>

    <div class="cm_img">
        <img style="width: 40px;
        height: 40px;"  src=" `+ ((result['profile_pic'] != null) ? result['profile_pic'].slice(1) : 'images/profile/unkown.jpeg') + `" alt="">
    </div>

    <div class="comment_box">
        <form id="CommentsForm">
            <input type="text" name="form" placeholder="Post a comment"  required="" >
            <input type="hidden"  name="post_id" value="`+ postID + `">
            <button type="submit">Send</button>
        </form>
    </div>
</div>    
<!--post-comment end-->
</div>
    </div><!--post-bar end-->
        `;


                        $('#Posts_list').append(html);
                        if (result['likes'] != null) {
                            for (w in result['likes']) {
                                $("#" + result['likes'][w]['post_id'] + "50S50").val(150);
                                $("#" + result['likes'][w]['post_id'] + "like").html("Un Like");

                            }
                        }
                        // $('#Post_Form').html("<div class='alert alert-success'>Posted Succsefully.</div>");
                    } else {
                        // on error/fail, tell the user he needs to login to show the account page
                        // $('#post_RS').html("<div class='alert alert-danger'>Internal Server Error.</div>");
                        // window.location.href = "?login";
                    }
                }
                catch (err) {
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

    function setComments(Comment, update_account_form_obj) {
        jwt = getCookie('jwt');
        var body = Comment['content'];
        var time = Comment['date_created'];
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

                        var commentHTML = `
                <div class="comment-sec">
                <ul>
                    <li>
                        <div class="comment-list">
                            <div class="bg-img">
                                <img style="width: 40px;
                                height: 40px;" src="`+ profile_pic + `" alt="">
                            </div>
                            <div class="comment">
                                <h3> <a href="profile.html?id=`+ Comment['user_id'] +`&username=`+ rresult['name']['username'] + `">` + name + `</a></h3>
                                <span><img src="images/clock.png" alt=""> `+ time + ` </span>
                                <p>`+ body + ` </p>
                                
                            </div>
                        </div>
                    </li>
                </ul>
            </div>                
        `;

                        $("#" + update_account_form_obj['post_id'] + "comment").append(commentHTML);


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

    function SetMsgs(msgs){
        
        $("#navMsgs").html("");

        var msgsUsersUsed = [];
        // msgsUsersUsed.push("n506070");

        if (msgs['user_id_from']){
            AddMsgs(msgs[i]);
            msgsUsersUsed.push(msgs[i]['user_id_from']);
        } else {

            for (i in msgs){
                if (SortMsgs(msgs, i, msgsUsersUsed) != false ){
                    var msgDataHtml = `                                
                    <p>`+ msgs[i]['content'] +`</p>
                    `;
                    
                    var id = "#msgBody" + msgs[i]['user_id_from'] + "" ;
                    setTimeout(function(){ $(id).append(msgDataHtml); }, 1000);

                } else {
                    AddMsgs(msgs[i]);
                    msgsUsersUsed.push(msgs[i]['user_id_from']);
                }
                
                
                
            }
        }
    }

    function SortMsgs(msgsX, n, msgsUsersUsed){
        for (x in msgsUsersUsed){
            if (msgsX[n]['user_id_from'] === msgsUsersUsed[x]){
                return true; 
            } 
        }
        return false;
    }

    function AddMsgs(MsgData){
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
                            <img src="`+ profile_pic +`" alt="">
                        </div>
                        <div class="notification-info">
                            <h3><a href="messages.html?user=`+ MsgData['user_id_from'] +`" title="">`+ name +`</a> </h3>
                            

                                <p>`+ MsgData['content'] +`</p>
                                <span>`+ MsgData['date_created'] +`</span>
                                <div id="msgBody`+ MsgData['user_id_from'] +`"> </div>

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
    }

    function SetNotification(NotificationData){
        var nutification = [];
        if (NotificationData['likes'] != false){

            if (NotificationData['likes'].length > 1 ){
                for (i in NotificationData['likes']){
                    AppendLikeNutfication(NotificationData['likes'][i]);
                }
            } else {
                AppendLikeNutfication(NotificationData['likes'][0]);
            }
        }
        if (NotificationData['comments'] != false){
            if (NotificationData['comments'].length > 1 ){
                for (i in NotificationData['comments']){
                    AppendCommentNutfication(NotificationData['comments'][i]);
                }
            } else {
                AppendCommentNutfication(NotificationData['comments'][0]);
            }
        }

    }

    function AppendCommentNutfication(comment){
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
                        <div class="notfication-details">
                        <div class="noty-user-img">
                            <img src="`+ profile_pic +`" alt="">
                        </div>
                        <div class="notification-info">
                            <h3><a href="profile.html?user_id=`+ comment['user_id'] +`&username=`+ rresult['name']['username'] +`" title="">`+ name +`</a> Comment on your project.
                            <p> `+ comment['content'] +` </p>
                            </h3><br/>
                            <span>`+ comment['date_created'] +`</span>
                        </div>
                        <!--notification-info -->
                    
                    
                    
                    </div>

        `;



                        $("#NutfList").append(CommentHtml);

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

    function AppendLikeNutfication(like){
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
                        <div class="notfication-details">
                        <div class="noty-user-img">
                            <img src="`+ profile_pic +`" alt="">
                        </div>
                        <div class="notification-info">
                            <h3><a href="profile.html?user_id=`+ like['user_id'] +`&username=`+ rresult['name']['username'] +`" title="">`+ name +`</a> Liked your project. .
                            </h3>
                            <span>`+ like['date_created'] +`</span>
                        </div>
                        <!--notification-info -->
                    
                    
                    
                    </div>

        `;



                        $("#NutfList").append(LikeHtml);

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

    function custom_sort(a, b) {
        return new Date(a.date_created).getTime() - new Date(b.date_created).getTime();
    }
    

    $(document).on('submit', '#Post_Form', function () {
        var update_account_form = $(this);
        var jwt = getCookie('jwt');
        var update_account_form_obj = update_account_form.serializeObject()
        // add jwt on the object
        update_account_form_obj.jwt = jwt;
        // convert object to json string
        var form_data = JSON.stringify({
            "option": 50,
            "jwt": update_account_form_obj.jwt,
            "data": update_account_form_obj
        });
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                result = $.parseJSON(this.responseText);
                console.log(result);
                try {
                    if (result['status'] === 200) {
                        $('#Post_Form').html("<div class='alert alert-success'>Posted Succsefully.</div>");
                        location.reload(); 

                    } else {
                        // on error/fail, tell the user he needs to login to show the account page
                        $('#post_RS').html("<div class='alert alert-danger'>Internal Server Error.</div>");
                        // window.location.href = "?login";
                    }
                }
                catch (err) {
                    // on error/fail, tell the user he needs to login to show the account page
                    $('#post_RS').html("<div class='alert alert-danger'>Internal Server Error.</div>");
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

    $(document).on('submit', '#LikeForm', function () {
        var update_account_form = $(this);
        var jwt = getCookie('jwt');
        var update_account_form_obj = update_account_form.serializeObject()
        // add jwt on the object
        update_account_form_obj.jwt = jwt;
        // convert object to json string


        var form_data = JSON.stringify({
            "option": update_account_form_obj['action'],
            "jwt": update_account_form_obj.jwt,
            "data": update_account_form_obj
        });
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                result = $.parseJSON(this.responseText);
                console.log(result);
                try {
                    if (result['status'] === 200) {
                        if (update_account_form_obj['action'] == 2) {
                            // $("#"+ update_account_form_obj['post_id'] +"").attr("disabled", true);
                            $("#" + update_account_form_obj['post_id'] + "50S50").val(150);
                            $("#" + update_account_form_obj['post_id'] + "like").html("Un Like");


                        } else {
                            $("#" + update_account_form_obj['post_id'] + "50S50").val(2);
                            $("#" + update_account_form_obj['post_id'] + "like").html("Like");

                        }

                        // $('#Post_Form').html("<div class='alert alert-success'>Posted Succsefully.</div>");

                    } else {
                        // on error/fail, tell the user he needs to login to show the account page
                        // $('#post_RS').html("<div class='alert alert-danger'>Internal Server Error.</div>");
                        // window.location.href = "?login";
                    }
                }
                catch (err) {
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

    $(document).on('submit', '#CommentsForm', function () {
        var update_account_form = $(this);
        var jwt = getCookie('jwt');
        var update_account_form_obj = update_account_form.serializeObject()
        update_account_form[0][0].value = "" ;
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
                                    height: 40px;" src="`+ ((result['profile_pic'] != null) ? result['profile_pic'].slice(1) : 'images/profile/unkown.jpeg') + `" alt="">
                                </div>
                                <div class="comment">
                                    <h3>`+ result['personal']['fname'] + ' ' + result['personal']['lname'] + `</h3>
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

    $(document).on('submit', '#GetComments', function () {
        var update_account_form = $(this);
        var jwt = getCookie('jwt');
        var update_account_form_obj = update_account_form.serializeObject()
        // add jwt on the object
        update_account_form_obj.jwt = jwt;
        // convert object to json string
        var form_data = JSON.stringify({
            "option": 250,
            "jwt": update_account_form_obj.jwt,
            "data": update_account_form_obj
        });
        $("#" + update_account_form_obj['post_id'] + "comm").attr("disabled", true);
        $("#" + update_account_form_obj['post_id'] + "commentSec").css("visibility", "visible");


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
                            setComments(Comment, update_account_form_obj);
                        }




                    } else {
                        // on error/fail, tell the user he needs to login to show the account page
                        // window.location.href = "?login";
                    }
                }
                catch (err) {
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


    /// Post A Project Pop-Up ////
    $(document).on('click', '.post_project', function (){
        $(".post-popup.pst-pj").addClass("active");
        $(".wrapper").addClass("overlay");
        return false;
    });

    $(document).on('click', '.post-project > a', function (){
        
        $(".post-popup.pst-pj").removeClass("active");
        $(".wrapper").removeClass("overlay");
        return false;
    });

    $(document).on('click', '.CanslePost', function (){
        
        $(".post-popup.pst-pj").removeClass("active");
        $(".wrapper").removeClass("overlay");
        return false;
    });

    //////////////////////////////////



    ///// POST LayOut

    $(document).on('click', '.ed-opts-open', function (){
        $(this).next(".ed-options").toggleClass("active");
        return false;
    });


    $(document).on('click', '.Delete-Post', function (){
        
        var post_id = $(this)[0].offsetParent.childNodes[1]["value"];
        console.log(post_id);
        DeletePost(post_id);
        return false;
    });

    function DeletePost(id){
        jwt = getCookie('jwt');

        var form_data = JSON.stringify({
            "option": 100,
            "jwt": jwt,
            "post_id": id
        });

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                var rresult = $.parseJSON(this.responseText);
                try {
                    if (rresult) {
                        console.log(rresult);
                        $("#post_"+id).remove();
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
    }

    //////// *******








});
