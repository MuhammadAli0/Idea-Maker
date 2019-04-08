
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

    function parseJwt (token) {
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
                    console.log(this.responseText);

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

    function setResultToPage(result){
        if (result['msges'] != false){
            for (i in result['msges']){
                $('#messageButton').append(`
                <li class="active" >
                <a href="#" class="msdg"  name="`+result['msges'][i]['user_id']+`">
                <div class="usr-msg-details">
                    <div class="usr-ms-img">
                        <img src="`+ ((result['msges'][i]['profile_picture_url'] != null) ? result['msges'][i]['profile_picture_url'].slice(1) : 'images/profile/unkown.jpeg') +`" alt="">
                        <span class="msg-status"></span>
                    </div>
                    <div class="usr-mg-info">
                        <h3>`+ result['msges'][i]['fname'] + " " + result['msges'][i]['lname']  +`</h3>
                        <p id="lastMsdgOfUserID`+ result['msges'][i]['user_id'] +`'"> ... </p>
                    </div><!--usr-mg-info end-->
                    <span class="posted_time">00:00 PM</span>
                    <span class="msg-notifc" id='ButOfUserID`+ result['msges'][i]['user_id'] +`'>0</span>
                </div><!--usr-msg-details end-->
                </a>
            </li>
    
                `);
                CreateMsdgForm(result['msges'][i]);
            }
        }
    }


    function CreateMsdgForm(user_Data){
        var msdgTemplateHtml = `		
        <div id="FormXChat`+user_Data['user_id']+`" class="col-lg-8 col-md-12 pd-right-none pd-left-none" style="display: none;">
        <div class="main-conversation-box">
            <div class="message-bar-head">
                <div class="usr-msg-details">
                    <div class="usr-ms-img">
                        <img src="`+ ((user_Data['profile_picture_url'] != null) ? user_Data['profile_picture_url'].slice(1) : 'images/profile/unkown.jpeg') +`" alt="">
                    </div>
                    <div class="usr-mg-info">
                        <h3> `+ user_Data['fname'] +' '+ user_Data['lname'] +` </h3>
                        <p>Online</p>
                    </div><!--usr-mg-info end-->
                </div>
                <a href="#" title=""><i class="fa fa-ellipsis-v"></i></a>
            </div><!--message-bar-head end-->
            <div class="messages-line">
                
            <div id="msgBox`+user_Data['user_id']+`"> </div>
                
            </div><!--messages-line end-->


            <div class="message-send-area">
                <form id="SendMsg">
                    <div class="mf-field">
                        <input type="hidden" name="target_id" value="`+ user_Data['user_id'] +`">
                        <input type="text" name="message" required="" placeholder="Type a message here">
                        <button type="submit">Send</button>
                    </div>
                    <ul>
                        <li><a href="#" title=""><i class="fa fa-smile-o"></i></a></li>
                        <li><a href="#" title=""><i class="fa fa-camera"></i></a></li>
                        <li><a href="#" title=""><i class="fa fa-paperclip"></i></a></li>
                    </ul>
                </form>
            </div><!--message-send-area end-->
        </div><!--main-conversation-box end-->
    </div>`;
        $('#msdgForm').append(msdgTemplateHtml);
        setTimeout(function(){ GetMassegs(user_Data['user_id'], ((user_Data['profile_picture_url'] != null) ? user_Data['profile_picture_url'].slice(1) : 'images/profile/unkown.jpeg')); }, 1000); 
        

    }

    function LoadMassges(data, user_id, Target_profile_pic){
        var myID = parseJwt(getCookie('jwt'))['data']['id'];
        for (i in data){
            if (data[i]['user_id_from'] === myID){
                var myMsg = `
                <div class="main-message-box ta-right">
                <div class="message-dt">
                    <div class="message-inner-dt">
                        <p>`+ data[i]['content'] +`</p>
                    </div><!--message-inner-dt end-->
                    <span>`+ data[i]['date_created'] +`</span>
                </div><!--message-dt end-->
                <div class="messg-usr-img">
                    <img src="`+myProfilePic+`" alt="">
                </div><!--messg-usr-img end-->
            </div><!--main-message-box end-->
                `;
                $("#msgBox"+user_id).append(myMsg);
                
                

            } else {
                var hisMsg = `
                <div class="main-message-box st3">
                    <div class="message-dt st3">
                        <div class="message-inner-dt">
                            <p> `+ data[i]['content'] +` </p>
                        </div><!--message-inner-dt end-->
                        <span>`+ data[i]['date_created'] +`</span>
                    </div><!--message-dt end-->
                    <div class="messg-usr-img">
                        <img src="`+ Target_profile_pic +`" alt="">
                    </div><!--messg-usr-img end-->
                </div><!--main-message-box end-->
                `;
                $("#msgBox"+user_id).append(hisMsg);

            }
        }

        
       

    }


    function GetMassegs(id, link){
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
                        console.log(rresult);
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


    function SetRedToMsdges(id){
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
                        console.log(rresult);
                        

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

    function SetUpdate(data){
        if (data['msgs'] != false){
            if (data['msgs'].length > 0 ){
                $('#ButOfUserID'+data['msgs'][i]['user_id_from']).html(data['msgs'].length);
            }

            for (i in data['msgs']){
                if ($('#msgBox'+data['msgs'][i]['user_id_from']).length > 0 ){
                    var hisMsg = `
                <div class="main-message-box st3">
                    <div class="message-dt st3">
                        <div class="message-inner-dt">
                            <p> `+ data['msgs'][i]['content'] +` </p>
                        </div><!--message-inner-dt end-->
                        <span>`+ data['msgs'][i]['date_created'] +`</span>
                    </div><!--message-dt end-->
                    <div class="messg-usr-img">
                        <img src="" alt="">
                    </div><!--messg-usr-img end-->
                </div><!--main-message-box end-->
                `;

                    $('#msgBox'+data['msgs'][i]['user_id_from']).append(hisMsg);
                    console.log(data['msgs']);
                    SetRedToMsdges(data['msgs'][i]['user_id_from']);
                }
                
                // $('#lastMsdgOfUserID'+data['msgs'][i]['user_id_from']).html(data['msgs'][i]['date_created']);
                
            }
        }
        console.log(data);
        return false;
    }

    function Update(){
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
    
    setInterval(function(){ Update(); }, 5000);

    $(document).on('click', '.msdg', function (){
        var form = $(this);
        var id = form[0]['name'];

        console.log(form);

        var link = form[0].firstElementChild.firstElementChild.firstElementChild['src'];
        
        SetRedToMsdges(id);
        $("#FormXChat"+id).css("display", "block");
        
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
                console.log(form_data);
                console.log(this.responseText);
                result = $.parseJSON(this.responseText);
                try {
                    if (result) {
                        var myMsg = `
                <div class="main-message-box ta-right">
                <div class="message-dt">
                    <div class="message-inner-dt">
                        <p>`+ update_account_form_obj['message'] +`</p>
                    </div><!--message-inner-dt end-->
                    <span>NOW</span>
                </div><!--message-dt end-->
                <div class="messg-usr-img">
                    <img src="`+myProfilePic+`" alt="">
                </div><!--messg-usr-img end-->
            </div><!--main-message-box end-->
                `;
                    $("#msgBox"+update_account_form_obj['target_id']).append(myMsg);
                    update_account_form[0][1]["value"] = ""; 

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

});


