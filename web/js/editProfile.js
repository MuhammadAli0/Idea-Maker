loadPage();

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
    document.getElementById("username").innerHTML = result['username'];


    document.getElementById("fname").value = result['personal']['fname'];
    document.getElementById("lname").value = result['personal']['lname'];
    document.getElementById("phone").value = result['personal']['contact']['phone'];
    document.getElementById("email").value = result['personal']['contact']['email'];
    document.getElementById("country").value = result['personal']['country'];
    document.getElementById("town").value = result['personal']['town'];
    document.getElementById("gender").value = result['personal']['gender'];
    document.getElementById("summary1").value = result['personal']['summary'];
    document.getElementById("date").value = result['personal']['date'];

    if (result['work'] != 'false') {
        document.getElementById("work_name").value = result['work']['work_name'];
        document.getElementById("position").value = result['work']['position'];
        document.getElementById("exp_year").value = result['work']['exp_Years'];
        document.getElementById("start_work").value = result['work']['started_date'];
        document.getElementById("end_work").value = result['work']['end_date'];
        document.getElementById("summary2").value = result['work']['summary'];
    }

    if (result['University'] != 'false') {
        document.getElementById("university_name").value = result['University']['uni_name'];
        document.getElementById("college_degree").value = result['University']['study_field'];
        document.getElementById("year").value = result['University']['year'];
        document.getElementById("start_study").value = result['University']['startDate'];
        document.getElementById("end_study").value = result['University']['endDate'];
        document.getElementById("summary3").value = result['University']['summary'];
    }


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
    console.log(form_data);

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
    console.log(form_data);

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

