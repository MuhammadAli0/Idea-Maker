
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

    function parseJwt(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(window.atob(base64));
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

    function timeSince(date) {

        var seconds = Math.floor((new Date() - date) / 900);

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


    function loadPage() {
        // validate jwt to verify access
        var jwt = getCookie('jwt');
        var data = JSON.stringify({
            "option": 250,
            "jwt": jwt
        });
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                try {

                    result = $.parseJSON(this.responseText)
                    if (result) {
                        setResultToPage(result);
                        window.myProfilePic = ((result["data"][0]['profile_picture_url'] != null) ? result["data"][0]['profile_picture_url'].slice(1) : 'images/profile/unkown.jpeg');
                    } else {
                        // on error/fail, tell the user he needs to login to show the account page
                        // window.location.href = "?login";
                    }
                }
                catch (err) {
                    // on error/fail, tell the user he needs to login to show the account page
                    // window.location.href = "?login";
                    window.location.href = "/index.html?login";
                    console.log(err);
                }
            }
        });
        xhr.open("POST", "/api/index.php/action");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.send(data);

        return false;
    }

    function setResultToPage(result) {
        if (result['msges'] != false) {
            for (var i in result['msges']) {
                $('#messageButton').append(`
                <li class="active" >
                <a href="#" class="msdg"  name="`+ result['msges'][i]['user_id'] + `">
                <div class="usr-msg-details">
                    <div class="usr-ms-img">
                        <img style="height: 50px;width: 50px;" src="`+ ((result['msges'][i]['profile_picture_url'] != null) ? result['msges'][i]['profile_picture_url'].slice(1) : 'images/profile/unkown.jpeg') + `" alt="">
                        <span class="msg-status"></span>
                    </div>
                    <div class="usr-mg-info">
                        <h3>`+ result['msges'][i]['fname'] + " " + result['msges'][i]['lname'] + `</h3>
                        <p id="lastMsdgOfUserID`+ result['msges'][i]['user_id'] + `'"> ... </p>
                    </div><!--usr-mg-info end-->
                    <span class="posted_time">00:00 PM</span>
                    <span class="msg-notifc" style="display: none;" id='ButOfUserID`+ result['msges'][i]['user_id'] + `'>0</span>
                </div><!--usr-msg-details end-->
                </a>
            </li>
    
                `);
                CreateMsdgForm(result['msges'][i]);
            }
        }
    }


    function CreateMsdgForm(user_Data) {
        var msdgTemplateHtml = `		
        <div id="FormXChat`+ user_Data['user_id'] + `" class="col-lg-8 col-md-12 pd-right-none pd-left-none" style="display: none;">
        <div class="main-conversation-box">
            <div class="message-bar-head">
                <div class="usr-msg-details">
                    <div class="usr-ms-img">
                        <img style="height: 50px;width: 50px;" src="`+ ((user_Data['profile_picture_url'] != null) ? user_Data['profile_picture_url'].slice(1) : 'images/profile/unkown.jpeg') + `" alt="">
                    </div>
                    <div class="usr-mg-info">
                        <h3> `+ user_Data['fname'] + ' ' + user_Data['lname'] + ` </h3>
                    </div><!--usr-mg-info end-->
                </div>
                <a href="#" title=""><i class="fa fa-ellipsis-v"></i></a>
            </div><!--message-bar-head end-->
			<div id="mCSB_`+ user_Data['user_id'] + `" class="messages-line mCustomScrollbar _mCS_1" style="overflow:auto; overflow-x:hidden;">

            <div class="mCustomScrollBox mCS-light mCSB_vertical mCSB_inside" style="max-height: auto;"
            tabindex="0">
            <div id="mCSB_1_container" class="mCSB_container" style="position: relative; top: -60px; left: 0px;margin-top: 145px;"
                dir="ltr">

            <div id="msgBox`+ user_Data['user_id'] + `"> </div>

            </div>

            <div id="mCSB_1_scrollbar_vertical"
                class="mCSB_scrollTools mCSB_1_scrollbar mCS-light mCSB_scrollTools_vertical"
                style="display: block;">
                <div class="mCSB_draggerContainer">
                    <div id="mCSB_1_dragger_vertical" class="mCSB_dragger"
                        style="position: absolute; min-height: 30px; display: block; height: 453px; max-height: 594px; top: 45px;">
                        <div class="mCSB_dragger_bar" style="line-height: 30px;"></div>
                    </div>
                    <div class="mCSB_draggerRail"></div>
                </div>
            </div>
        </div>
    </div>


            <div class="message-send-area">
                <form id="SendMsg">
                    <div class="mf-field">
                        <input type="hidden" name="target_id" value="`+ user_Data['user_id'] + `">
                        <input class="ChatInputBox" type="text" name="message" required="" placeholder="Type a message here">
                        <button type="submit">Send</button>
                    </div>

                </form>
            </div><!--message-send-area end-->
        </div><!--main-conversation-box end-->
    </div>`;
        $('#msdgForm').append(msdgTemplateHtml);
        setTimeout(function () { GetMassegs(user_Data['user_id'], ((user_Data['profile_picture_url'] != null) ? user_Data['profile_picture_url'].slice(1) : 'images/profile/unkown.jpeg')); }, 1000);


    }

    function LoadMassges(data, user_id, Target_profile_pic) {
        var myID = parseJwt(getCookie('jwt'))['data']['id'];
        for (var i in data) {
            if (data[i]['user_id_from'] === myID) {
                var myMsg = `
                <div class="main-message-box ta-right">
                <div class="message-dt" style="float: right;">
                    <div class="message-inner-dt">
                        <p>`+ data[i]['content'] + `</p>
                    </div> <!--message-inner-dt end-->
                    <span>`+ timeSince(new Date( data[i]['date_created'] )) + `</span>
                </div><!--message-dt end-->
                <div class="messg-usr-img">
                    <img style="height: 50px;width: 50px;" style="height: 50px;width: 50px;" src="`+ myProfilePic + `" alt="">
                </div><!--messg-usr-img end-->
            </div><!--main-message-box end-->



                `;
                $("#msgBox" + user_id).append(myMsg);



            } else {
                var hisMsg = `
                <div class="main-message-box st3">
                    <div class="message-dt st3">
                        <div class="message-inner-dt">
                            <p> `+ data[i]['content'] + ` </p>
                        </div><!--message-inner-dt end-->
                        <span>`+ timeSince(new Date( data[i]['date_created'] )) + `</span>
                    </div><!--message-dt end-->
                    <div class="messg-usr-img">
                        <img style="height: 50px;width: 50px;" src="`+ Target_profile_pic + `" alt="">
                    </div><!--messg-usr-img end-->
                </div><!--main-message-box end-->
                `;
                $("#msgBox" + user_id).append(hisMsg);

            }
        }




    }


    function GetMassegs(id, link) {
        jwt = getCookie('jwt');

        var form_data = JSON.stringify({
            "option": 200,
            "jwt": jwt,
            "user_id": id
        });

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                var rresult = $.parseJSON(this.responseText);
                try {
                    if (rresult) {
                        LoadMassges(rresult['msges'], id, link);

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
    }


    function SetRedToMsdges(id) {
        jwt = getCookie('jwt');

        var form_data = JSON.stringify({
            "option": 360,
            "jwt": jwt,
            "user_id": id
        });

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                var rresult = $.parseJSON(this.responseText);
                try {
                    if (rresult) {


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
    }

    function SetUpdate(data) {
        if (data['msgs'] != false) {
            if (data['msgs'].length > 0) {


                for (var i in data['msgs']) {
                    var x = document.getElementById("myAudio");
                    x.play();

                    $('#ButOfUserID' + data['msgs'][i]['user_id_from']).show();
                    $('#ButOfUserID' + data['msgs'][i]['user_id_from']).html(data['msgs'].length);
    
                    if ($('#msgBox' + data['msgs'][i]['user_id_from']).length > 0) {
                        var hisMsg = `
                <div class="main-message-box st3">
                    <div class="message-dt st3">
                        <div class="message-inner-dt">
                            <p> `+ data['msgs'][i]['content'] + ` </p>
                        </div><!--message-inner-dt end-->
                        <span>`+ timeSince(new Date( data['msgs'][i]['date_created'] )) + `</span>
                    </div><!--message-dt end-->
                    <div class="messg-usr-img">
                        <img src="" alt="">
                    </div><!--messg-usr-img end-->
                </div><!--main-message-box end-->
                `;

                        $('#msgBox' + data['msgs'][i]['user_id_from']).append(hisMsg);
                        $('#mCSB_' + data['msgs'][i]['user_id_from']).animate({ scrollTop: $('#mCSB_' + data['msgs'][i]['user_id_from']).html().length / 9 }, 1000);

                        SetRedToMsdges(data['msgs'][i]['user_id_from']);

                    }

                    // $('#lastMsdgOfUserID'+data['msgs'][i]['user_id_from']).html(data['msgs'][i]['date_created']);

                }
            }
        }
        return false;
    }

    function Update() {
        jwt = getCookie('jwt');

        var form_data = JSON.stringify({
            "option": 400,
            "jwt": jwt
        });

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                var rresult = $.parseJSON(this.responseText);
                try {
                    if (rresult) {
                        SetUpdate(rresult);

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
    }





    setInterval(function () { Update(); }, 500);

    // setTimeout(function (){$('.ChatInputBox').emojioneArea({
    //     pickerPosition: "right"
    // });}, 2000);

    $(document).on('click', '.msdg', function () {
        var form = $(this);
        var id = form[0]['name'];


        var link = form[0].firstElementChild.firstElementChild.firstElementChild['src'];

        $(window).load();
        SetRedToMsdges(id);
        $('.col-lg-8').hide();

        $("#FormXChat" + id).css("display", "block");
        $('#mCSB_' + id).animate({ scrollTop: $('#mCSB_' + id).html().length / 9 }, 1000);
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
        var msgText = update_account_form[0][1]["value"];
        update_account_form[0][1]["value"] = "";

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                result = $.parseJSON(this.responseText);
                try {
                    if (result) {
                        var u = document.getElementById("myAudioSENDMSG");
                        u.play();

                        var myMsg = `
                <div class="main-message-box ta-right">
                <div class="message-dt" style="float: right;">
                    <div class="message-inner-dt">
                        <p>`+ update_account_form_obj['message'] + `</p>
                    </div><!--message-inner-dt end-->
                    <span>NOW</span>
                </div><!--message-dt end-->
                <div class="messg-usr-img">
                    <img style="height: 50px;width: 50px;" src="`+ myProfilePic + `" alt="">
                </div><!--messg-usr-img end-->
            </div><!--main-message-box end-->
                `;
                        $("#msgBox" + update_account_form_obj['target_id']).append(myMsg);
                        $('#mCSB_' + update_account_form_obj['target_id']).animate({ scrollTop: $('#mCSB_' + update_account_form_obj['target_id']).html().length / 9  }, 1000);


                        // $('#Post_Form').html("<div class='alert alert-success'>Posted Succsefully.</div>");

                    } else {
                        // on error/fail, tell the user he needs to login to show the account page
                        // $('#post_RS').html("<div class='alert alert-danger'>Internal Server Error.</div>");
                        // window.location.href = "?login";
                    }
                }
                catch (err) {
                    console.log(err);
                    update_account_form[0][1]["value"] = msgText;

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













});


