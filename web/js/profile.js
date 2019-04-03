
$(document).ready(function () {

    // }); 
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
                    window.result = $.parseJSON(this.responseText)
                    if (result) {
                        console.log(result);
                        setResultToPage(result);
                        setPosts(result);
                        // ShowAccountUpdateForm();
                    } else {
                        // on error/fail, tell the user he needs to login to show the account page
                        // window.location.href = "https://" + window.location.hostname + "?login";
                    }
                }
                catch (err) {
                    // on error/fail, tell the user he needs to login to show the account page
                    // window.location.href = "https://" + window.location.hostname + "?login";
                }
            }
        });
        xhr.open("POST", "https://" + window.location.hostname + "/api/index.php/profile/");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.send(data);


    }

    function setResultToPage(result) {
        // document.getElementById("username").innerHTML = result['username'];

        $("#fname").html(result['personal']['fname']);

        $("#name").html(result['personal']['fname'] + ' ' + result['personal']['lname']);
        $("#summary").html(result['personal']['summary']);
        $("#country").html(result['personal']['country']);
        $("#town").html(result['personal']['town']);
        if (result['skills'] != null) {
            for (i in $.parseJSON(result['skills'])) {
                $('#skills_list').append(`
            <li><a href="#" title="">`+ $.parseJSON(result['skills'])[i] + `</a></li>

            `);
            }
        }

        setProfilePic(result);
        setWorkForm(result);
        setEducation(result);


    }

    function setEducation(data) {
        if (data['University'] != 'false') {
            $("#college_degree").html(data['University']['study_field']);
            $("#university_name").html(data['University']['uni_name']);
            $("#uni_date").html(data['University']['startDate'] + " - " + data['University']['endDate']);
            $("#uniSummary").html(data['University']['summary']);

            // document.getElementById("university_name").value = result['University']['uni_name'];
            // document.getElementById("college_degree").value = result['University']['study_field'];
            // document.getElementById("year").value = result['University']['year'];
            // document.getElementById("start_study").value = result['University']['startDate'];
            // document.getElementById("end_study").value = result['University']['endDate'];
            // document.getElementById("summary3").value = result['University']['summary'];
        } else {
            return false;
        }

    }

    function setWorkForm(data) {
        if (data['work'] != 'false') {
            html = `											
        <h4>`+ data['work']['position'] + `<a href="#" title=""><i class="fa fa-pencil"></i></a></h4>
        <h5 >at `+ data['work']['work_name'] + `</h5>
        <span>`+ data['work']['started_date'] + ` - ` + data['work']['end_date'] + `</span>

        <p> `+ data['work']['summary'] + ` </p>

        <input type="hidden" name="workID" value="`+ data['work']['work_id'] + `">
`;
            // document.getElementById("exp_year").value = result['work']['work_id_user_id'];
            $('#work').append(html);
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
    <div class="post-bar">
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
                 <li><a href="#" title="">Edit Post</a></li> 
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


        $('#feed-dd').append(html);
        if (result['likes'] != null) {
            for (w in result['likes']) {
                $("#" + result['likes'][w]['post_id'] + "50S50").val(150);
                $("#" + result['likes'][w]['post_id'] + "like").html("Un Like");

            }
        }

    }

    function setPosts(result) {
        if (result['posts'] != 'false') {


            for (i in result['posts']) {
                SetMyPosts(i, result)

            }
        }
    }


    function setProfilePic(result) {
        if (result['profile_pic'] != null) {
            $("#usr-pic-main").attr('src', result['profile_pic'].slice(1))
            $("#usr-pic-post").attr('src', result['profile_pic'].slice(1))
            $("#usr-pic-nav").attr('src', result['profile_pic'].slice(1))

        }
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
                                <img style="width: 60px;
                                height: 60px;" src="`+ profile_pic + `" alt="">
                            </div>
                            <div class="comment">
                                <h3> <a href="profile.html?id=`+ Comment['user_id'] + `">` + name + `</a></h3>
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
                        // window.location.href = "https://" + window.location.hostname + "?login";
                    }
                }
                catch (err) {
                    console.log(err);
                    // on error/fail, tell the user he needs to login to show the account page
                    // $('#post_RS').html("<div class='alert alert-danger'>Internal Server Error.</div>");
                    // window.location.href = "https://" + window.location.hostname + "?login";
                }
            }
        });
        xhr.open("POST", "https://" + window.location.hostname + "/api/index.php/home/");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.send(form_data);

        return false;

    }

    $(document).on('submit', '#registrationForm', function () {
        var update_account_form = $(this);
        var jwt = getCookie('jwt');
        var update_account_form_obj = update_account_form.serializeObject()
        // add jwt on the object
        update_account_form_obj.jwt = jwt;
        // convert object to json string
        var form_data = JSON.stringify({
            "status": 300,
            "jwt": update_account_form_obj.jwt,
            "data": update_account_form_obj
        });

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                try {
                    result = $.parseJSON(this.responseText)
                    if (result) {
                        $('#response').append("<div class='alert alert-success'>Account Updated Succsefully.</div>");

                    } else {
                        // on error/fail, tell the user he needs to login to show the account page
                        $('#response').html("<div class='alert alert-danger'>Please login to access the account page.</div>");
                        // window.location.href = "https://" + window.location.hostname + "?login";
                    }
                }
                catch (err) {
                    // on error/fail, tell the user he needs to login to show the account page
                    $('#response').html("<div class='alert alert-danger'>Please login to access the account page.</div>");
                    // window.location.href = "https://" + window.location.hostname + "?login";
                }
            }
        });
        xhr.open("POST", "https://" + window.location.hostname + "/api/index.php/profile/");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.send(form_data);
        return false;
    });

    $(document).on('submit', '#workForm', function () {
        var update_account_form = $(this);
        var jwt = getCookie('jwt');
        var update_account_form_obj = update_account_form.serializeObject()
        // add jwt on the object
        update_account_form_obj.jwt = jwt;
        // convert object to json string
        var form_data = JSON.stringify({
            "status": 320,
            "jwt": update_account_form_obj.jwt,
            "data": update_account_form_obj
        });

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                try {
                    console.log(this.responseText);
                    result = $.parseJSON(this.responseText);
                    if (result) {
                        $('#workForm').html("<div class='alert alert-success'>Account Updated Succsefully.</div>");
                        html = `											
        <h4>`+ update_account_form_obj['position'] + `<a href="#" title=""><i class="fa fa-pencil"></i></a></h4>
        <h5 >at `+ update_account_form_obj['organization'] + `</h5>
        <span>`+ update_account_form_obj['sDate'] + ` - ` + update_account_form_obj['eDate'] + `</span>

        <p> `+ update_account_form_obj['summary'] + ` </p>

        <input type="hidden" name="workID" value="1">
`;
                        // document.getElementById("exp_year").value = result['work']['work_id_user_id'];
                        $('#work').html(html);



                    } else {
                        // on error/fail, tell the user he needs to login to show the account page
                        $('#work_responce').html("<div class='alert alert-danger'>INTERNAL?EXTERNAL SERVER ERROR.</div>");
                        // window.location.href = "https://" + window.location.hostname + "?login";
                    }
                }
                catch (err) {
                    // on error/fail, tell the user he needs to login to show the account page
                    $('#work_responce').html("<div class='alert alert-danger'>INTERNAL SERVER ERROR.</div>");
                    // window.location.href = "https://" + window.location.hostname + "?login";
                }
            }
        });
        xhr.open("POST", "https://" + window.location.hostname + "/api/index.php/profile/");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.send(form_data);
        return false;
    });


    $(document).on('submit', '#ProfileSummaryForm', function () {
        var update_account_form = $(this);
        var jwt = getCookie('jwt');
        var update_account_form_obj = update_account_form.serializeObject()
        // add jwt on the object
        update_account_form_obj.jwt = jwt;
        // convert object to json string
        var form_data = JSON.stringify({
            "status": 777,
            "jwt": update_account_form_obj.jwt,
            "data": update_account_form_obj
        });
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                resul = this.responseText;
                console.log(resul);
                try {
                    if (this.responseText > 0) {
                        $('#ProfileSummaryForm').html("<div class='alert alert-success'>Account Updated Succsefully.</div>");
                        $('#summary').html(update_account_form_obj['summary']);


                    } else {
                        // on error/fail, tell the user he needs to login to show the account page
                        $('#summaryResponce').html("<div class='alert alert-danger'>Internal Server Error.</div>");
                        // window.location.href = "https://" + window.location.hostname + "?login";
                    }
                }
                catch (err) {
                    // on error/fail, tell the user he needs to login to show the account page
                    $('#summaryResponce').html("<div class='alert alert-danger'>Internal Server Error.</div>");
                    // window.location.href = "https://" + window.location.hostname + "?login";
                }
            }
        });
        xhr.open("POST", "https://" + window.location.hostname + "/api/index.php/profile/");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.send(form_data);
        return false;
    });


    $(document).on('submit', '#universityForm', function () {
        var update_account_form = $(this);
        var jwt = getCookie('jwt');
        var update_account_form_obj = update_account_form.serializeObject()
        // add jwt on the object
        update_account_form_obj.jwt = jwt;
        // convert object to json string
        var form_data = JSON.stringify({
            "status": 340,
            "jwt": update_account_form_obj.jwt,
            "data": update_account_form_obj
        });
        // console.log(form_data);

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                try {
                    console.log(this.responseText);
                    result = $.parseJSON(this.responseText);
                    if (result) {
                        $('#universityForm').html("<div class='alert alert-success'>Account Updated Succsefully.</div>")
                        $("#college_degree").html(update_account_form_obj['college_degree']);
                        $("#university_name").html(update_account_form_obj['university_name']);
                        $("#uni_date").html(update_account_form_obj['start_study'] + " - " + update_account_form_obj['end_study']);
                        $("#uniSummary").html(update_account_form_obj['summary']);

                    } else {
                        // on error/fail, tell the user he needs to login to show the account page
                        $('#edu_responce').html("<div class='alert alert-danger'>INTERNAL?EXTERNAL SERVER ERROR.</div>");
                        // window.location.href = "https://" + window.location.hostname + "?login";
                    }
                }
                catch (err) {
                    // on error/fail, tell the user he needs to login to show the account page
                    $('#edu_responce').html("<div class='alert alert-danger'>INTERNAL SERVER ERROR.</div>");
                    // window.location.href = "https://" + window.location.hostname + "?login";
                }
            }
        });
        xhr.open("POST", "https://" + window.location.hostname + "/api/index.php/profile/");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.send(form_data);
        return false;
    });

    $(document).on('submit', '#LocationForm', function () {
        var update_account_form = $(this);
        var jwt = getCookie('jwt');
        var update_account_form_obj = update_account_form.serializeObject()
        // add jwt on the object
        update_account_form_obj.jwt = jwt;
        // convert object to json string
        var form_data = JSON.stringify({
            "status": 111,
            "jwt": update_account_form_obj.jwt,
            "data": update_account_form_obj
        });
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                resul = this.responseText;
                console.log(resul);
                try {
                    if (this.responseText > 0) {
                        $('#LocationForm').html("<div class='alert alert-success'>Account Updated Succsefully.</div>");
                        $("#country").html(update_account_form_obj['country']);
                        $("#town").html(update_account_form_obj['town']);

                    } else {
                        // on error/fail, tell the user he needs to login to show the account page
                        $('#LocationFormResponce').html("<div class='alert alert-danger'>Internal Server Error.</div>");
                        // window.location.href = "https://" + window.location.hostname + "?login";
                    }
                }
                catch (err) {
                    // on error/fail, tell the user he needs to login to show the account page
                    $('#LocationFormResponce').html("<div class='alert alert-danger'>Internal Server Error.</div>");
                    // window.location.href = "https://" + window.location.hostname + "?login";
                }
            }
        });
        xhr.open("POST", "https://" + window.location.hostname + "/api/index.php/profile/");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.send(form_data);
        return false;
    });

    $(document).on('submit', '#SkillsForm', function () {
        var update_account_form = $(this);
        var jwt = getCookie('jwt');
        var update_account_form_obj = update_account_form.serializeObject()
        // add jwt on the object
        update_account_form_obj.jwt = jwt;
        // convert object to json string
        var form_data = JSON.stringify({
            "status": 789,
            "jwt": update_account_form_obj.jwt,
            "data": update_account_form_obj
        });
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                resul = this.responseText;
                console.log(resul);
                try {
                    if (this.responseText > 0) {
                        $('#SkillsForm').html("<div class='alert alert-success'>Account Updated Succsefully.</div>");
                        var skills = update_account_form_obj['skills'].split(";");
                        $('#skills_list').html("");
                        for (i in  skills) {
                            $('#skills_list').append(`
                        <li><a href="#" title="">`+ skills[i] + `</a></li>
            
                        `);
                        }

                    } else {
                        // on error/fail, tell the user he needs to login to show the account page
                        $('#SkillsFormRS').html("<div class='alert alert-danger'>Internal Server Error.</div>");
                        // window.location.href = "https://" + window.location.hostname + "?login";
                    }
                }
                catch (err) {
                    // on error/fail, tell the user he needs to login to show the account page
                    $('#SkillsFormRS').html("<div class='alert alert-danger'>Internal Server Error.</div>");
                    // window.location.href = "https://" + window.location.hostname + "?login";
                }
            }
        });
        xhr.open("POST", "https://" + window.location.hostname + "/api/index.php/profile/");
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
                        // window.location.href = "https://" + window.location.hostname + "?login";
                    }
                }
                catch (err) {
                    // on error/fail, tell the user he needs to login to show the account page
                    // $('#post_RS').html("<div class='alert alert-danger'>Internal Server Error.</div>");
                    // window.location.href = "https://" + window.location.hostname + "?login";
                }
            }
        });
        xhr.open("POST", "https://" + window.location.hostname + "/api/index.php/home/");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.send(form_data);
        return false;
    });

    $(document).on('submit', '#CommentsForm', function () {
        var update_account_form = $(this);
        var jwt = getCookie('jwt');
        var update_account_form_obj = update_account_form.serializeObject()
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
                                    <img src="images/resources/bg-img1.png" alt="">
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
                        // window.location.href = "https://" + window.location.hostname + "?login";
                    }
                }
                catch (err) {
                    // on error/fail, tell the user he needs to login to show the account page
                    // window.location.href = "https://" + window.location.hostname + "?login";
                }
            }
        });
        xhr.open("POST", "https://" + window.location.hostname + "/api/index.php/home/");
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
                        var CommentData = resultx['data'];
                        for (n in CommentData) {
                            var Comment = CommentData[n];
                            setComments(Comment, update_account_form_obj);
                        }




                    } else {
                        // on error/fail, tell the user he needs to login to show the account page
                        // window.location.href = "https://" + window.location.hostname + "?login";
                    }
                }
                catch (err) {
                    // on error/fail, tell the user he needs to login to show the account page
                    // window.location.href = "https://" + window.location.hostname + "?login";
                }
            }
        });
        xhr.open("POST", "https://" + window.location.hostname + "/api/index.php/home/");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.send(form_data);
        return false;
    });

    $(document).on('submit', '#profilePictureForm', function () {
        update_account_form = $(this);
        var jwt = getCookie('jwt');
        // var update_account_form_obj = update_account_form.serializeObject()

        var data = new FormData();
        // data.append("profile_pic", update_account_form[0][0]['value']);
        data.append("profile_pic", "/home/bow/Downloads/stgob1p27bed959rgllnknfli7580879-final.jpg");

        data.append("jwt", jwt);
        data.append("option", "600");

        console.log(data);

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                console.log(this.responseText);
                location.reload(); 
            }
        });

        xhr.open("POST", "http://localhost/api/index.php/upload");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("cache-control", "no-cache");

        xhr.send(data);
        return false;
    });


    document.querySelector('#profile_pic').addEventListener('change', function (e) {
        var file = this.files[0];
        var fd = new FormData();
        var jwt = getCookie('jwt');

        fd.append("profile_pic", file);
        fd.append("jwt", jwt);
        fd.append("option", 600);
        var xhr = new XMLHttpRequest();
        xhr.open('POST', "https://" + window.location.hostname + "/api/index.php/upload", true);

        xhr.upload.onprogress = function (e) {
            if (e.lengthComputable) {
                var percentComplete = (e.loaded / e.total) * 100;
                console.log(percentComplete + '% uploaded');
            }
        };
        xhr.onload = function () {
            if (this.status == 200) {
                console.log(this.response);
                var resp = JSON.parse(this.response);
                if (resp['status'] === 200) {
                    console.log('Server got:', resp);
                }
                // console.log('Server got:', resp);
                // var image = document.createElement('img');
                // image.src = resp.dataUrl;
                // document.body.appendChild(image);
            };
        };
        xhr.send(fd);
    }, false);

});


