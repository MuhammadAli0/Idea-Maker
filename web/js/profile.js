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
                        if (result['accType'] === "idea-maker") {
                            setPosts(result);
                        } else {
                            $('.tab-feed').hide();
                            $('#info').click();
                        }

                        // ShowAccountUpdateForm();
                    } else {
                        // on error/fail, tell the user he needs to login to show the account page
                        // window.location.href = "?login";
                    }
                }
                catch (err) {
                    // on error/fail, tell the user he needs to login to show the account page
                    // window.location.href = "/index.html?login";
                    console.log(err);
                }
            }
        });
        xhr.open("POST", "/api/index.php/profile/");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.send(data);


    }

    function setResultToPage(result) {
        // document.getElementById("username").innerHTML = result['username'];

        $("#fname").html(result['personal']['fname']);

        $("#name").html(result['personal']['fname'] + ' ' + result['personal']['lname']);
        $("#accType").html(result['accType']);
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
        <h4>`+ data['work']['position'] + `</h4>
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
    </div>    

        <!--post-comment end-->
        </div>
        </div><!--post-bar end-->
            `;


        $('#feed-dd').append(html);

        if (result['likes'] != 'false') {
            for (var w in result['likes']) {
                if ( owner === result['likes'][w]['user_id']) {
                    $("#" + postID).html('<i class="la la-heart"></i>' + $("#" + postID)[0].dataset.textSwap);
                    $("#" + postID).removeClass("like").addClass("unlike");
                    $("#" + postID)[0].dataset.textSwap = "like";
                    break;
                }

            }
        }

        if (status != "Discussions") {
            $("#comment_box" + postID).remove();
            $(".CommentButton_" + postID).remove();
        }
        
        return false;
    }

    function setPosts(result) {
        if (result['posts'] != 'false') {

            for (var i in result['posts']) {
                
                SetMyPosts(i, result);
            }
        }
    }


    function setProfilePic(result) {
        if (result['profile_pic'] != null) {
            $("#usr-pic-main").attr('src', result['profile_pic'].slice(1))
            $("#usr-pic-post").attr('src', result['profile_pic'].slice(1))
            $("#usr-pic-nav").attr('src', result['profile_pic'].slice(1))

        }
        if (result['cover_pic'] != null) {
            $("#MyCoverPic").attr('src', result['cover_pic']);
        }
    }

    function setComments(Comment, post_id) {
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

    function custom_sort(a, b) {
        return new Date(a.date_created).getTime() - new Date(b.date_created).getTime();
    }

    function parseJwt(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(window.atob(base64));
    };


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
                        // window.location.href = "?login";
                    }
                }
                catch (err) {
                    // on error/fail, tell the user he needs to login to show the account page
                    $('#response').html("<div class='alert alert-danger'>Please login to access the account page.</div>");
                    // window.location.href = "?login";
                }
            }
        });
        xhr.open("POST", "/api/index.php/profile/");
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
                        // window.location.href = "?login";
                    }
                }
                catch (err) {
                    // on error/fail, tell the user he needs to login to show the account page
                    $('#work_responce').html("<div class='alert alert-danger'>INTERNAL SERVER ERROR.</div>");
                    // window.location.href = "?login";
                }
            }
        });
        xhr.open("POST", "/api/index.php/profile/");
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
                        // window.location.href = "?login";
                    }
                }
                catch (err) {
                    // on error/fail, tell the user he needs to login to show the account page
                    $('#summaryResponce').html("<div class='alert alert-danger'>Internal Server Error.</div>");
                    // window.location.href = "?login";
                }
            }
        });
        xhr.open("POST", "/api/index.php/profile/");
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
                        // window.location.href = "?login";
                    }
                }
                catch (err) {
                    // on error/fail, tell the user he needs to login to show the account page
                    $('#edu_responce').html("<div class='alert alert-danger'>INTERNAL SERVER ERROR.</div>");
                    // window.location.href = "?login";
                }
            }
        });
        xhr.open("POST", "/api/index.php/profile/");
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
                        // window.location.href = "?login";
                    }
                }
                catch (err) {
                    // on error/fail, tell the user he needs to login to show the account page
                    $('#LocationFormResponce').html("<div class='alert alert-danger'>Internal Server Error.</div>");
                    // window.location.href = "?login";
                }
            }
        });
        xhr.open("POST", "/api/index.php/profile/");
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
                        for (i in skills) {
                            $('#skills_list').append(`
                        <li><a href="#" title="">`+ skills[i] + `</a></li>
            
                        `);
                        }

                    } else {
                        // on error/fail, tell the user he needs to login to show the account page
                        $('#SkillsFormRS').html("<div class='alert alert-danger'>Internal Server Error.</div>");
                        // window.location.href = "?login";
                    }
                }
                catch (err) {
                    // on error/fail, tell the user he needs to login to show the account page
                    $('#SkillsFormRS').html("<div class='alert alert-danger'>Internal Server Error.</div>");
                    // window.location.href = "?login";
                }
            }
        });
        xhr.open("POST", "/api/index.php/profile/");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.send(form_data);
        return false;
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

    document.querySelector('#profile_pic').addEventListener('change', function (e) {
        var file = this.files[0];
        var fd = new FormData();
        var jwt = getCookie('jwt');

        fd.append("profile_pic", file);
        fd.append("jwt", jwt);
        fd.append("option", 600);
        var xhr = new XMLHttpRequest();
        xhr.open('POST', "/api/index.php/upload", true);
        xhr.upload.onprogress = function (e) {
            if (e.lengthComputable) {
                var percentComplete = (e.loaded / e.total) * 100;
                console.log(percentComplete + '% uploaded');
            }
        };
        xhr.onload = function () {
            if (this.readyState === 400) {
                var resp = JSON.parse(this.responseText);
                if (resp['status'] === 200) {
                    console.log('Server got:', resp);
                    // location.reload(); 
                    window.location.reload();
                };
            };
        };        
        
        xhr.send(fd);
    }, false);

    document.querySelector('#cover_pic').addEventListener('change', function (e) {
        var file = this.files[0];
        var fd = new FormData();
        var jwt = getCookie('jwt');

        fd.append("cover_pic", file);
        fd.append("jwt", jwt);
        fd.append("option", 700);
        var xhr = new XMLHttpRequest();
        xhr.open('POST', "/api/index.php/upload", true);

        xhr.upload.onprogress = function (e) {
            if (e.lengthComputable) {
                var percentComplete = (e.loaded / e.total) * 100;
                console.log(percentComplete + '% uploaded');
            }
        };
        xhr.onload = function () {
            if (this.status == 200) {
                var resp = JSON.parse(this.responseText);
                console.log('Server got:', resp);
                // location.reload();
                window.location.reload(); 
            };
        };
        xhr.send(fd);
    }, false);

    $(document).on('click', '.ed-opts-open', function () {
        $(this).next(".ed-options").toggleClass("active");
        return false;
    });

    $(document).on('click', '.Delete-Post', function () {

        var post_id = $(this)[0].offsetParent.childNodes[1]["value"];
        console.log(post_id);
        DeletePost(post_id);
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


    function DeletePost(id) {
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
                        $("#post_" + id).remove();
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



});

