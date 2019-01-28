$(document).ready(function () {

    var option = window.location.search.substring(1);
    if (option === 'login') {
        showLoginPage();
    } else if (option === 'home') {
        showHomePage();
        clearResponse();
    } else if (option === 'profile') {
    } else if (option === 'sign_up') {
        ShowSignUpForm();
    }

    // show sign up / registration form
    $(document).on('click', '#sign_up', function () {
        ShowSignUpForm();

    });


    // trigger when registration form is submitted
    $(document).on('submit', '#sign_up_form', function () {

        // get form data
        var sign_up_form = $(this);

        // var form_data = JSON.stringify(sign_up_form.serializeObject());

        var data = JSON.stringify(sign_up_form.serializeObject());

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                var responceData = $.parseJSON(this.responseText);
                if (responceData['Status'] === 200) {
                    var html = '<h2>Check your mail for validation link<h2>';
                    $('#content').html(html);
                    $('#response').html("<div class='alert alert-success'>Successful sign up.</div>");
                    sign_up_form.find('input').val('');
                } else if (responceData['Status'] > 200) {
                    usernameAlert = '';
                    emailAlert = '';
                    phoneAlert = '';
                    if (responceData['username'] != null) {
                        usernameAlert = "<div class='alert alert-danger'>You Username Already in Use.</div>";
                    } if (responceData['email'] != null) {
                        emailAlert = "<div class='alert alert-danger'>You Email Address Already in Use.</div>";
                    } if (responceData['phone'] != null) {
                        phoneAlert = "<div class='alert alert-danger'>You Phone Number Already in Use.</div>";

                    } $('#response').html(usernameAlert + emailAlert + phoneAlert);

                } else {
                    $('#response').html("<div class='alert alert-danger'>Unable to sign up. Please contact admin.</div>");
                }
            }
        });

        xhr.open("POST", "https://idea-maker.herokuapp.com/api/index.php/register");
        xhr.setRequestHeader("content-type", "application/json");

        xhr.setRequestHeader("cache-control", "no-cache");

        xhr.send(data);

        return false;
    });

    // show login form
    $(document).on('click', '#login', function () {
        showLoginPage();
    });

    // trigger when login form is submitted
    $(document).on('submit', '#login_form', function () {

        // get form data
        var login_form = $(this);
        var data = JSON.stringify(login_form.serializeObject());

        // submit form data to api


        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                try {
                    result = $.parseJSON(this.responseText)

                    if (result['status'] === 200) {
                        setCookie("jwt", result['jwt'], 1);
                        showHomePage();
                        $('#response').html("<div class='alert alert-success'>Successful login.</div>");

                    } else if (result['status'] === 122) {
                        $('#response').html("<div class='alert alert-danger'>Plice Validate your Account.</div>");
                    } else {

                        $('#response').html("<div class='alert alert-danger'>Plice check your username or password.</div>");
                    }
                }
                catch (err) {
                    $('#response').html("<div class='alert alert-danger'>Unable to login, plice contact the admin.</div>");
                }


            }




        });

        xhr.open("POST", "https://idea-maker.herokuapp.com/api/index.php/login");
        xhr.setRequestHeader("content-type", "application/json");

        xhr.setRequestHeader("cache-control", "no-cache");

        xhr.send(data);


        return false;
    });

    // show home page
    $(document).on('click', '#home', function () {
        showHomePage();
        clearResponse();
    });

    // show profile form
    $(document).on('click', '#profile', function () {
        showProfileForm();
    });

    // show update account form
    $(document).on('click', '#update_account', function () {
        showUpdateAccountForm();
    });

    // trigger when 'update account' form is submitted
    $(document).on('submit', '#UpdatePersonalData', function () {

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


                        ShowAccountUpdateForm();
                        $('#response').html("<div class='alert alert-success'>Account Updated Succsefully.</div>");



                    } else {
                        // on error/fail, tell the user he needs to login to show the account page
                        showLoginPage();
                        $('#response').html("<div class='alert alert-danger'>Please login to access the account page.</div>");
                    }
                }
                catch (err) {
                    // on error/fail, tell the user he needs to login to show the account page
                    showLoginPage();
                    $('#response').html("<div class='alert alert-danger'>Please login to access the account page.</div>");
                }
            }
        });

        xhr.open("POST", "https://idea-maker.herokuapp.com/api/index.php/profile/");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("cache-control", "no-cache");


        xhr.send(form_data);




        return false;
    });


    // logout the user
    $(document).on('click', '#logout', function () {
        showLoginPage();
        $('#response').html("<div class='alert alert-info'>You are logged out.</div>");
    });

    $(document).on('click', '#passwordRecovery', function () {
        ShowSendRecoverMailForm();
    });

    $(document).on('submit', '#recovry-form', function () {

        SendPassowrRecovery(document.getElementById('email').value);

        return false;
    });

    // get or read cookie
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

    // function to set cookie
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    // if the user is logged out
    function showLoggedOutMenu() {
        // show login and sign up from navbar & hide logout button
        $("#login, #sign_up").show();
        $("#logout").hide();

    }

    // if the user is logged in
    function showLoggedInMenu() {
        // hide login and sign up from navbar & show logout button
        $("#login, #sign_up").hide();
        $("#logout, #profile, #home, #update_account").show();
    }

    // remove any prompt messages
    function clearResponse() {
        $('#response').html('');
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

    // Show SignUp From
    function ShowSignUpForm() {
        var html = `
        <h2>Sign Up</h2>
        <form id='sign_up_form'>
        
        <div class="form-group">
                <label for="firstname">First Name</label><span style="color: red !important; display: inline; float: none;">*</span>
                <input type="text" class="form-control" name="fname" id="fname" required />

                <label for="lastname">Last Name</label><span style="color: red !important; display: inline; float: none;">*</span>
                <input type="text" class="form-control" name="lname" id="lname" required />
        </div>

        <div class="form-check">

            <label  class="form-check-label">Gender</label><span style="color: red !important; display: inline; float: none;">*</span>
            <div style="margin-left: 5rem;">

            <table>
                   <tr><th> <input type="radio" class="form-check-input" name="gender" value="male" checked required /> </th> <th><p>Male</th></tr>
                
                    <tr><th><input type="radio" class="form-check-input" name="gender" value="female" required />  </th> <th><p>Female</th></tr>
            </table>
            </div> <br>

        </div>  
            
        
        <div class="form-group">
                <label for="country">Country</label><span style="color: red !important; display: inline; float: none;">*</span>      

                <select id="country" style="height: calc(2.25rem + 11px);" name="country" class="form-control">
                    <option value="Afghanistan">Afghanistan</option>
                    <option value="Åland Islands">Åland Islands</option>
                    <option value="Albania">Albania</option>
                    <option value="Algeria">Algeria</option>
                    <option value="American Samoa">American Samoa</option>
                    <option value="Andorra">Andorra</option>
                    <option value="Angola">Angola</option>
                    <option value="Anguilla">Anguilla</option>
                    <option value="Antarctica">Antarctica</option>
                    <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                    <option value="Argentina">Argentina</option>
                    <option value="Armenia">Armenia</option>
                    <option value="Aruba">Aruba</option>
                    <option value="Australia">Australia</option>
                    <option value="Austria">Austria</option>
                    <option value="Azerbaijan">Azerbaijan</option>
                    <option value="Bahamas">Bahamas</option>
                    <option value="Bahrain">Bahrain</option>
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="Barbados">Barbados</option>
                    <option value="Belarus">Belarus</option>
                    <option value="Belgium">Belgium</option>
                    <option value="Belize">Belize</option>
                    <option value="Benin">Benin</option>
                    <option value="Bermuda">Bermuda</option>
                    <option value="Bhutan">Bhutan</option>
                    <option value="Bolivia">Bolivia</option>
                    <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                    <option value="Botswana">Botswana</option>
                    <option value="Bouvet Island">Bouvet Island</option>
                    <option value="Brazil">Brazil</option>
                    <option value="British Indian Ocean Territory">British Indian Ocean Territory</option>
                    <option value="Brunei Darussalam">Brunei Darussalam</option>
                    <option value="Bulgaria">Bulgaria</option>
                    <option value="Burkina Faso">Burkina Faso</option>
                    <option value="Burundi">Burundi</option>
                    <option value="Cambodia">Cambodia</option>
                    <option value="Cameroon">Cameroon</option>
                    <option value="Canada">Canada</option>
                    <option value="Cape Verde">Cape Verde</option>
                    <option value="Cayman Islands">Cayman Islands</option>
                    <option value="Central African Republic">Central African Republic</option>
                    <option value="Chad">Chad</option>
                    <option value="Chile">Chile</option>
                    <option value="China">China</option>
                    <option value="Christmas Island">Christmas Island</option>
                    <option value="Cocos (Keeling) Islands">Cocos (Keeling) Islands</option>
                    <option value="Colombia">Colombia</option>
                    <option value="Comoros">Comoros</option>
                    <option value="Congo">Congo</option>
                    <option value="Congo, The Democratic Republic of The">Congo, The Democratic Republic of The</option>
                    <option value="Cook Islands">Cook Islands</option>
                    <option value="Costa Rica">Costa Rica</option>
                    <option value="Cote D'ivoire">Cote D'ivoire</option>
                    <option value="Croatia">Croatia</option>
                    <option value="Cuba">Cuba</option>
                    <option value="Cyprus">Cyprus</option>
                    <option value="Czech Republic">Czech Republic</option>
                    <option value="Denmark">Denmark</option>
                    <option value="Djibouti">Djibouti</option>
                    <option value="Dominica">Dominica</option>
                    <option value="Dominican Republic">Dominican Republic</option>
                    <option value="Ecuador">Ecuador</option>
                    <option value="Egypt">Egypt</option>
                    <option value="El Salvador">El Salvador</option>
                    <option value="Equatorial Guinea">Equatorial Guinea</option>
                    <option value="Eritrea">Eritrea</option>
                    <option value="Estonia">Estonia</option>
                    <option value="Ethiopia">Ethiopia</option>
                    <option value="Falkland Islands (Malvinas)">Falkland Islands (Malvinas)</option>
                    <option value="Faroe Islands">Faroe Islands</option>
                    <option value="Fiji">Fiji</option>
                    <option value="Finland">Finland</option>
                    <option value="France">France</option>
                    <option value="French Guiana">French Guiana</option>
                    <option value="French Polynesia">French Polynesia</option>
                    <option value="French Southern Territories">French Southern Territories</option>
                    <option value="Gabon">Gabon</option>
                    <option value="Gambia">Gambia</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Germany">Germany</option>
                    <option value="Ghana">Ghana</option>
                    <option value="Gibraltar">Gibraltar</option>
                    <option value="Greece">Greece</option>
                    <option value="Greenland">Greenland</option>
                    <option value="Grenada">Grenada</option>
                    <option value="Guadeloupe">Guadeloupe</option>
                    <option value="Guam">Guam</option>
                    <option value="Guatemala">Guatemala</option>
                    <option value="Guernsey">Guernsey</option>
                    <option value="Guinea">Guinea</option>
                    <option value="Guinea-bissau">Guinea-bissau</option>
                    <option value="Guyana">Guyana</option>
                    <option value="Haiti">Haiti</option>
                    <option value="Heard Island and Mcdonald Islands">Heard Island and Mcdonald Islands</option>
                    <option value="Holy See (Vatican City State)">Holy See (Vatican City State)</option>
                    <option value="Honduras">Honduras</option>
                    <option value="Hong Kong">Hong Kong</option>
                    <option value="Hungary">Hungary</option>
                    <option value="Iceland">Iceland</option>
                    <option value="India">India</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="Iran, Islamic Republic of">Iran, Islamic Republic of</option>
                    <option value="Iraq">Iraq</option>
                    <option value="Ireland">Ireland</option>
                    <option value="Isle of Man">Isle of Man</option>
                    <option value="Israel">Israel</option>
                    <option value="Italy">Italy</option>
                    <option value="Jamaica">Jamaica</option>
                    <option value="Japan">Japan</option>
                    <option value="Jersey">Jersey</option>
                    <option value="Jordan">Jordan</option>
                    <option value="Kazakhstan">Kazakhstan</option>
                    <option value="Kenya">Kenya</option>
                    <option value="Kiribati">Kiribati</option>
                    <option value="Korea, Democratic People's Republic of">Korea, Democratic People's Republic of</option>
                    <option value="Korea, Republic of">Korea, Republic of</option>
                    <option value="Kuwait">Kuwait</option>
                    <option value="Kyrgyzstan">Kyrgyzstan</option>
                    <option value="Lao People's Democratic Republic">Lao People's Democratic Republic</option>
                    <option value="Latvia">Latvia</option>
                    <option value="Lebanon">Lebanon</option>
                    <option value="Lesotho">Lesotho</option>
                    <option value="Liberia">Liberia</option>
                    <option value="Libyan Arab Jamahiriya">Libyan Arab Jamahiriya</option>
                    <option value="Liechtenstein">Liechtenstein</option>
                    <option value="Lithuania">Lithuania</option>
                    <option value="Luxembourg">Luxembourg</option>
                    <option value="Macao">Macao</option>
                    <option value="Macedonia, The Former Yugoslav Republic of">Macedonia, The Former Yugoslav Republic of</option>
                    <option value="Madagascar">Madagascar</option>
                    <option value="Malawi">Malawi</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="Maldives">Maldives</option>
                    <option value="Mali">Mali</option>
                    <option value="Malta">Malta</option>
                    <option value="Marshall Islands">Marshall Islands</option>
                    <option value="Martinique">Martinique</option>
                    <option value="Mauritania">Mauritania</option>
                    <option value="Mauritius">Mauritius</option>
                    <option value="Mayotte">Mayotte</option>
                    <option value="Mexico">Mexico</option>
                    <option value="Micronesia, Federated States of">Micronesia, Federated States of</option>
                    <option value="Moldova, Republic of">Moldova, Republic of</option>
                    <option value="Monaco">Monaco</option>
                    <option value="Mongolia">Mongolia</option>
                    <option value="Montenegro">Montenegro</option>
                    <option value="Montserrat">Montserrat</option>
                    <option value="Morocco">Morocco</option>
                    <option value="Mozambique">Mozambique</option>
                    <option value="Myanmar">Myanmar</option>
                    <option value="Namibia">Namibia</option>
                    <option value="Nauru">Nauru</option>
                    <option value="Nepal">Nepal</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="Netherlands Antilles">Netherlands Antilles</option>
                    <option value="New Caledonia">New Caledonia</option>
                    <option value="New Zealand">New Zealand</option>
                    <option value="Nicaragua">Nicaragua</option>
                    <option value="Niger">Niger</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="Niue">Niue</option>
                    <option value="Norfolk Island">Norfolk Island</option>
                    <option value="Northern Mariana Islands">Northern Mariana Islands</option>
                    <option value="Norway">Norway</option>
                    <option value="Oman">Oman</option>
                    <option value="Pakistan">Pakistan</option>
                    <option value="Palau">Palau</option>
                    <option value="Palestinian Territory, Occupied">Palestinian Territory, Occupied</option>
                    <option value="Panama">Panama</option>
                    <option value="Papua New Guinea">Papua New Guinea</option>
                    <option value="Paraguay">Paraguay</option>
                    <option value="Peru">Peru</option>
                    <option value="Philippines">Philippines</option>
                    <option value="Pitcairn">Pitcairn</option>
                    <option value="Poland">Poland</option>
                    <option value="Portugal">Portugal</option>
                    <option value="Puerto Rico">Puerto Rico</option>
                    <option value="Qatar">Qatar</option>
                    <option value="Reunion">Reunion</option>
                    <option value="Romania">Romania</option>
                    <option value="Russian Federation">Russian Federation</option>
                    <option value="Rwanda">Rwanda</option>
                    <option value="Saint Helena">Saint Helena</option>
                    <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                    <option value="Saint Lucia">Saint Lucia</option>
                    <option value="Saint Pierre and Miquelon">Saint Pierre and Miquelon</option>
                    <option value="Saint Vincent and The Grenadines">Saint Vincent and The Grenadines</option>
                    <option value="Samoa">Samoa</option>
                    <option value="San Marino">San Marino</option>
                    <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="Senegal">Senegal</option>
                    <option value="Serbia">Serbia</option>
                    <option value="Seychelles">Seychelles</option>
                    <option value="Sierra Leone">Sierra Leone</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Slovakia">Slovakia</option>
                    <option value="Slovenia">Slovenia</option>
                    <option value="Solomon Islands">Solomon Islands</option>
                    <option value="Somalia">Somalia</option>
                    <option value="South Africa">South Africa</option>
                    <option value="South Georgia and The South Sandwich Islands">South Georgia and The South Sandwich Islands</option>
                    <option value="Spain">Spain</option>
                    <option value="Sri Lanka">Sri Lanka</option>
                    <option value="Sudan">Sudan</option>
                    <option value="Suriname">Suriname</option>
                    <option value="Svalbard and Jan Mayen">Svalbard and Jan Mayen</option>
                    <option value="Swaziland">Swaziland</option>
                    <option value="Sweden">Sweden</option>
                    <option value="Switzerland">Switzerland</option>
                    <option value="Syrian Arab Republic">Syrian Arab Republic</option>
                    <option value="Taiwan, Province of China">Taiwan, Province of China</option>
                    <option value="Tajikistan">Tajikistan</option>
                    <option value="Tanzania, United Republic of">Tanzania, United Republic of</option>
                    <option value="Thailand">Thailand</option>
                    <option value="Timor-leste">Timor-leste</option>
                    <option value="Togo">Togo</option>
                    <option value="Tokelau">Tokelau</option>
                    <option value="Tonga">Tonga</option>
                    <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                    <option value="Tunisia">Tunisia</option>
                    <option value="Turkey">Turkey</option>
                    <option value="Turkmenistan">Turkmenistan</option>
                    <option value="Turks and Caicos Islands">Turks and Caicos Islands</option>
                    <option value="Tuvalu">Tuvalu</option>
                    <option value="Uganda">Uganda</option>
                    <option value="Ukraine">Ukraine</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="United States Minor Outlying Islands">United States Minor Outlying Islands</option>
                    <option value="Uruguay">Uruguay</option>
                    <option value="Uzbekistan">Uzbekistan</option>
                    <option value="Vanuatu">Vanuatu</option>
                    <option value="Venezuela">Venezuela</option>
                    <option value="Viet Nam">Viet Nam</option>
                    <option value="Virgin Islands, British">Virgin Islands, British</option>
                    <option value="Virgin Islands, U.S.">Virgin Islands, U.S.</option>
                    <option value="Wallis and Futuna">Wallis and Futuna</option>
                    <option value="Western Sahara">Western Sahara</option>
                    <option value="Yemen">Yemen</option>
                    <option value="Zambia">Zambia</option>
                    <option value="Zimbabwe">Zimbabwe</option>
                </select>
            
                <label for="town">City:</label><span style="color: red !important; display: inline; float: none;">*</span>
                <input type="text" class="form-control" name="town" id="town" required />

                <label for="username">UserName:</label><span style="color: red !important; display: inline; float: none;">*</span>
                <input type="text" class="form-control" name="username" id="username" required />

                <label for="email">Email</label><span style="color: red !important; display: inline; float: none;">*</span>
                <input type="email" class="form-control" name="email" id="email" required />


                <label for="phone">Phone Number</label><span style="color: red !important; display: inline; float: none;">*</span>
                <input type="tel" class="form-control" name="phone" id="phone" required />


                <label for="type">Account Rule</label><span style="color: red !important; display: inline; float: none;">*</span>             
                <select id="type" style="height: calc(2.25rem + 11px);" name="type" class="form-control">
                    <option value="client">Client</option>
                    <option value="developer">Developer</option>
                    <option value="investor">Investor</option>
                </select>

                <label for="password">Password</label><span style="color: red !important; display: inline; float: none;">*</span>
                <input type="password" class="form-control" name="password" id="password" required />

            <button type='submit' class='btn btn-primary'>Sign Up</button>
        </div>    
        </form>
        `;

        clearResponse();
        $('#content').html(html);
    }

    // show login page
    function showLoginPage() {

        // remove jwt
        setCookie("jwt", "", 1);

        // login page html
        var html = `
        <h2>Login</h2>
        <form id='login_form'>
            <div class='form-group'>
                <label for='username'>Username:</label>
                <input type='email' class='form-control' id='username' name='username' placeholder='Email or Username'>
            </div>
 
            <div class='form-group'>
                <label for='password'>Password:</label>
                <input type='password' class='form-control' id='password' name='password' placeholder='Password'>
            </div>
 
            <button type='submit' class='btn btn-primary'>Login</button>
        </form>
        <a class="nav-item nav-link" href="#" id='passwordRecovery'>Forgotten password</a>
        `;

        $('#content').html(html);
        clearResponse();
        showLoggedOutMenu();
    }

    // show home page
    function showHomePage() {

        // validate jwt to verify access
        var jwt = getCookie('jwt');


        var data = JSON.stringify({
            "jwt": jwt
        });

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                try {
                    result = $.parseJSON(this.responseText)
                    if (result) {
                        showLoggedInMenu();

                        GetProfilePicture = (result['personal']['gender'] === "male") ? "img/M_profile.png" : "img/F_profile.png";
                        var Home_html = `

                        
                        <div class="mainbody container-fluid">
                            <div class="row" style="flex-wrap: unset;">
                               
                                <div style="padding-top:50px;"> </div>
                                <div class="col-lg-3 col-md-3 hidden-sm hidden-xs">
                                    <div class="panel panel-default">
                                        <div class="panel-body">
                                            
                                            
                                                <img class="avatar img-circle img-thumbnail" src="`+ GetProfilePicture + `" width="300px" height="300px">

                                                <div class="media-body">
                                                    <h3><strong>`+ result['personal']['name']['fname'] + ` ` + result['personal']['name']['lname'] + `</strong></h3>
                                                    <hr>
                                                    <hr>
                                                    <h4><strong>Bio</strong></h4>
                                                    <p>`+ result['personal']['summary'] + `.</p>
                                                    <hr>
                                                    <h4><strong>Location</strong></h4>
                                                    <p>`+ result['personal']['town'] + ` ` + result['personal']['country'] + `</p>
                                                    <hr>
                                                    <h4><strong>Gender</strong></h4>
                                                    <p>`+ result['personal']['gender'] + `</p>
                                                    <hr>
                                                    <h4><strong>Account Role</strong></h4>
                                                    <p>`+ result['accType'] + `</p>
                                                </div>
                                        </div>
                                    </div>
                                </div>

                                <!----- Write NEW POST CODE HERE-------!>
                                    <hr>
                                    <div id="posts"></div>
                                </div>
                            </div>   
                `;


                        clearResponse();
                        $('#content').html(Home_html);

                    } else {
                        // on error/fail, tell the user he needs to login to show the home page
                        showLoginPage();
                        $('#response').html("<div class='alert alert-danger'>Please login to access the home page.</div>");
                    }
                }
                catch (err) {
                    // on error/fail, tell the user he needs to login to show the home page
                    showLoginPage();
                    $('#response').html("<div class='alert alert-danger'>Please login to access the home page.</div>");
                }


            }




        });

        xhr.open("POST", "https://idea-maker.herokuapp.com/api/index.php/home/");
        xhr.setRequestHeader("content-type", "application/json");

        xhr.setRequestHeader("cache-control", "no-cache");


        xhr.send(data);
    }

    // account Update Form
    function ShowAccountUpdateForm() {
        GetProfilePicture = (result['personal']['gender'] === "male") ? "img/M_profile.png" : "img/F_profile.png";
        var html = `

                      
                      
        <hr>
        <div class="container bootstrap snippet">
            <div class="row" >
                  <div class="col-sm-10"><h1>`+ result['username'] + `</h1></div>
            </div>
            <div class="row">
                  <div class="col-sm-3"><!--left col-->
                      
        
              <div class="text-center">
                <img src="`+ GetProfilePicture + `" class="avatar img-circle img-thumbnail" alt="avatar">
              </div></hr><br>
        
                       

                  
                  
                  <ul class="list-group">
                    <li class="list-group-item text-muted">Activity <i class="fa fa-dashboard fa-1x"></i></li>
                    <li class="list-group-item text-right"><span class="pull-left"><strong>Will Come Soon</strong></span> 0000</li>

                  </ul> 
                       
                  <div class="panel panel-default">
                    <div class="panel-heading">Social Media</div>
                    <div class="panel-body">




                    </div>
                  </div>
                  
                </div><!--/col-3-->
                <div class="col-sm-9">
                    <ul class="nav nav-tabs">
                        <li class="active"><a data-toggle="tab" href="#personal">Personal</a></li>
                        <li><a data-toggle="tab" href="#about">About</a></li>
                        <li><a data-toggle="tab" href="#education">Education</a></li>
                        <li><a data-toggle="tab" href="#work">Work</a></li>
                      </ul>
        
                      
                  <div class="tab-content">
                    <div class="tab-pane active" id="personal">
                        <hr>




                          <form class="form"  id="UpdatePersonalData">
                              <div class="form-group">
                                  
                                  <div class="col-xs-6">
                                      <label for="first_name"><h4>First Name</h4></label>
                                      <input type="text" class="form-control" name="fname" id="fname"  value="`+ result['personal']['name']['fname'] + `" required / ">
                                  </div>
                              </div>
                              <div class="form-group">
                                  
                                  <div class="col-xs-6">
                                    <label for="last_name"><h4>Last Name</h4></label>
                                      <input type="text" class="form-control" name="lname" id="lname" value="`+ result['personal']['name']['lname'] + `" required /" >
                                  </div>
                              </div>
                  
                              <div class="form-group">
                                  
                                  <div class="col-xs-6">
                                      <label for="phone"><h4>Phone</h4></label>
                                      <input type="text" class="form-control" name="phone" id="phone" value="`+ result['personal']['contact']['phone'] + `" required /">
                                  </div>
                              </div>
                  

                              <div class="form-group">
                                  
                                  <div class="col-xs-6">
                                      <label for="email"><h4>Email</h4></label>
                                      <input type="email" class="form-control" name="email" id="email" value="`+ result['personal']['contact']['email'] + `"  required /">
                                  </div>
                              </div>
                              <div class="form-group">
                                  
                                  <div class="col-xs-6">
                                      <label for="country"><h4>Country</h4></label>

              <select id="country" style="height: calc(2.25rem + 11px);" name="country" class="form-control" >
                  <option selected="selected">`+ result['personal']['country'] + `</option>
                  <option value="Afghanistan">Afghanistan</option>
                  <option value="Åland Islands">Åland Islands</option>
                  <option value="Albania">Albania</option>
                  <option value="Algeria">Algeria</option>
                  <option value="American Samoa">American Samoa</option>
                  <option value="Andorra">Andorra</option>
                  <option value="Angola">Angola</option>
                  <option value="Anguilla">Anguilla</option>
                  <option value="Antarctica">Antarctica</option>
                  <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                  <option value="Argentina">Argentina</option>
                  <option value="Armenia">Armenia</option>
                  <option value="Aruba">Aruba</option>
                  <option value="Australia">Australia</option>
                  <option value="Austria">Austria</option>
                  <option value="Azerbaijan">Azerbaijan</option>
                  <option value="Bahamas">Bahamas</option>
                  <option value="Bahrain">Bahrain</option>
                  <option value="Bangladesh">Bangladesh</option>
                  <option value="Barbados">Barbados</option>
                  <option value="Belarus">Belarus</option>
                  <option value="Belgium">Belgium</option>
                  <option value="Belize">Belize</option>
                  <option value="Benin">Benin</option>
                  <option value="Bermuda">Bermuda</option>
                  <option value="Bhutan">Bhutan</option>
                  <option value="Bolivia">Bolivia</option>
                  <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                  <option value="Botswana">Botswana</option>
                  <option value="Bouvet Island">Bouvet Island</option>
                  <option value="Brazil">Brazil</option>
                  <option value="British Indian Ocean Territory">British Indian Ocean Territory</option>
                  <option value="Brunei Darussalam">Brunei Darussalam</option>
                  <option value="Bulgaria">Bulgaria</option>
                  <option value="Burkina Faso">Burkina Faso</option>
                  <option value="Burundi">Burundi</option>
                  <option value="Cambodia">Cambodia</option>
                  <option value="Cameroon">Cameroon</option>
                  <option value="Canada">Canada</option>
                  <option value="Cape Verde">Cape Verde</option>
                  <option value="Cayman Islands">Cayman Islands</option>
                  <option value="Central African Republic">Central African Republic</option>
                  <option value="Chad">Chad</option>
                  <option value="Chile">Chile</option>
                  <option value="China">China</option>
                  <option value="Christmas Island">Christmas Island</option>
                  <option value="Cocos (Keeling) Islands">Cocos (Keeling) Islands</option>
                  <option value="Colombia">Colombia</option>
                  <option value="Comoros">Comoros</option>
                  <option value="Congo">Congo</option>
                  <option value="Congo, The Democratic Republic of The">Congo, The Democratic Republic of The</option>
                  <option value="Cook Islands">Cook Islands</option>
                  <option value="Costa Rica">Costa Rica</option>
                  <option value="Cote D'ivoire">Cote D'ivoire</option>
                  <option value="Croatia">Croatia</option>
                  <option value="Cuba">Cuba</option>
                  <option value="Cyprus">Cyprus</option>
                  <option value="Czech Republic">Czech Republic</option>
                  <option value="Denmark">Denmark</option>
                  <option value="Djibouti">Djibouti</option>
                  <option value="Dominica">Dominica</option>
                  <option value="Dominican Republic">Dominican Republic</option>
                  <option value="Ecuador">Ecuador</option>
                  <option value="Egypt">Egypt</option>
                  <option value="El Salvador">El Salvador</option>
                  <option value="Equatorial Guinea">Equatorial Guinea</option>
                  <option value="Eritrea">Eritrea</option>
                  <option value="Estonia">Estonia</option>
                  <option value="Ethiopia">Ethiopia</option>
                  <option value="Falkland Islands (Malvinas)">Falkland Islands (Malvinas)</option>
                  <option value="Faroe Islands">Faroe Islands</option>
                  <option value="Fiji">Fiji</option>
                  <option value="Finland">Finland</option>
                  <option value="France">France</option>
                  <option value="French Guiana">French Guiana</option>
                  <option value="French Polynesia">French Polynesia</option>
                  <option value="French Southern Territories">French Southern Territories</option>
                  <option value="Gabon">Gabon</option>
                  <option value="Gambia">Gambia</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Germany">Germany</option>
                  <option value="Ghana">Ghana</option>
                  <option value="Gibraltar">Gibraltar</option>
                  <option value="Greece">Greece</option>
                  <option value="Greenland">Greenland</option>
                  <option value="Grenada">Grenada</option>
                  <option value="Guadeloupe">Guadeloupe</option>
                  <option value="Guam">Guam</option>
                  <option value="Guatemala">Guatemala</option>
                  <option value="Guernsey">Guernsey</option>
                  <option value="Guinea">Guinea</option>
                  <option value="Guinea-bissau">Guinea-bissau</option>
                  <option value="Guyana">Guyana</option>
                  <option value="Haiti">Haiti</option>
                  <option value="Heard Island and Mcdonald Islands">Heard Island and Mcdonald Islands</option>
                  <option value="Holy See (Vatican City State)">Holy See (Vatican City State)</option>
                  <option value="Honduras">Honduras</option>
                  <option value="Hong Kong">Hong Kong</option>
                  <option value="Hungary">Hungary</option>
                  <option value="Iceland">Iceland</option>
                  <option value="India">India</option>
                  <option value="Indonesia">Indonesia</option>
                  <option value="Iran, Islamic Republic of">Iran, Islamic Republic of</option>
                  <option value="Iraq">Iraq</option>
                  <option value="Ireland">Ireland</option>
                  <option value="Isle of Man">Isle of Man</option>
                  <option value="Israel">Israel</option>
                  <option value="Italy">Italy</option>
                  <option value="Jamaica">Jamaica</option>
                  <option value="Japan">Japan</option>
                  <option value="Jersey">Jersey</option>
                  <option value="Jordan">Jordan</option>
                  <option value="Kazakhstan">Kazakhstan</option>
                  <option value="Kenya">Kenya</option>
                  <option value="Kiribati">Kiribati</option>
                  <option value="Korea, Democratic People's Republic of">Korea, Democratic People's Republic of</option>
                  <option value="Korea, Republic of">Korea, Republic of</option>
                  <option value="Kuwait">Kuwait</option>
                  <option value="Kyrgyzstan">Kyrgyzstan</option>
                  <option value="Lao People's Democratic Republic">Lao People's Democratic Republic</option>
                  <option value="Latvia">Latvia</option>
                  <option value="Lebanon">Lebanon</option>
                  <option value="Lesotho">Lesotho</option>
                  <option value="Liberia">Liberia</option>
                  <option value="Libyan Arab Jamahiriya">Libyan Arab Jamahiriya</option>
                  <option value="Liechtenstein">Liechtenstein</option>
                  <option value="Lithuania">Lithuania</option>
                  <option value="Luxembourg">Luxembourg</option>
                  <option value="Macao">Macao</option>
                  <option value="Macedonia, The Former Yugoslav Republic of">Macedonia, The Former Yugoslav Republic of</option>
                  <option value="Madagascar">Madagascar</option>
                  <option value="Malawi">Malawi</option>
                  <option value="Malaysia">Malaysia</option>
                  <option value="Maldives">Maldives</option>
                  <option value="Mali">Mali</option>
                  <option value="Malta">Malta</option>
                  <option value="Marshall Islands">Marshall Islands</option>
                  <option value="Martinique">Martinique</option>
                  <option value="Mauritania">Mauritania</option>
                  <option value="Mauritius">Mauritius</option>
                  <option value="Mayotte">Mayotte</option>
                  <option value="Mexico">Mexico</option>
                  <option value="Micronesia, Federated States of">Micronesia, Federated States of</option>
                  <option value="Moldova, Republic of">Moldova, Republic of</option>
                  <option value="Monaco">Monaco</option>
                  <option value="Mongolia">Mongolia</option>
                  <option value="Montenegro">Montenegro</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Morocco">Morocco</option>
                  <option value="Mozambique">Mozambique</option>
                  <option value="Myanmar">Myanmar</option>
                  <option value="Namibia">Namibia</option>
                  <option value="Nauru">Nauru</option>
                  <option value="Nepal">Nepal</option>
                  <option value="Netherlands">Netherlands</option>
                  <option value="Netherlands Antilles">Netherlands Antilles</option>
                  <option value="New Caledonia">New Caledonia</option>
                  <option value="New Zealand">New Zealand</option>
                  <option value="Nicaragua">Nicaragua</option>
                  <option value="Niger">Niger</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="Niue">Niue</option>
                  <option value="Norfolk Island">Norfolk Island</option>
                  <option value="Northern Mariana Islands">Northern Mariana Islands</option>
                  <option value="Norway">Norway</option>
                  <option value="Oman">Oman</option>
                  <option value="Pakistan">Pakistan</option>
                  <option value="Palau">Palau</option>
                  <option value="Palestinian Territory, Occupied">Palestinian Territory, Occupied</option>
                  <option value="Panama">Panama</option>
                  <option value="Papua New Guinea">Papua New Guinea</option>
                  <option value="Paraguay">Paraguay</option>
                  <option value="Peru">Peru</option>
                  <option value="Philippines">Philippines</option>
                  <option value="Pitcairn">Pitcairn</option>
                  <option value="Poland">Poland</option>
                  <option value="Portugal">Portugal</option>
                  <option value="Puerto Rico">Puerto Rico</option>
                  <option value="Qatar">Qatar</option>
                  <option value="Reunion">Reunion</option>
                  <option value="Romania">Romania</option>
                  <option value="Russian Federation">Russian Federation</option>
                  <option value="Rwanda">Rwanda</option>
                  <option value="Saint Helena">Saint Helena</option>
                  <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                  <option value="Saint Lucia">Saint Lucia</option>
                  <option value="Saint Pierre and Miquelon">Saint Pierre and Miquelon</option>
                  <option value="Saint Vincent and The Grenadines">Saint Vincent and The Grenadines</option>
                  <option value="Samoa">Samoa</option>
                  <option value="San Marino">San Marino</option>
                  <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                  <option value="Saudi Arabia">Saudi Arabia</option>
                  <option value="Senegal">Senegal</option>
                  <option value="Serbia">Serbia</option>
                  <option value="Seychelles">Seychelles</option>
                  <option value="Sierra Leone">Sierra Leone</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Slovakia">Slovakia</option>
                  <option value="Slovenia">Slovenia</option>
                  <option value="Solomon Islands">Solomon Islands</option>
                  <option value="Somalia">Somalia</option>
                  <option value="South Africa">South Africa</option>
                  <option value="South Georgia and The South Sandwich Islands">South Georgia and The South Sandwich Islands</option>
                  <option value="Spain">Spain</option>
                  <option value="Sri Lanka">Sri Lanka</option>
                  <option value="Sudan">Sudan</option>
                  <option value="Suriname">Suriname</option>
                  <option value="Svalbard and Jan Mayen">Svalbard and Jan Mayen</option>
                  <option value="Swaziland">Swaziland</option>
                  <option value="Sweden">Sweden</option>
                  <option value="Switzerland">Switzerland</option>
                  <option value="Syrian Arab Republic">Syrian Arab Republic</option>
                  <option value="Taiwan, Province of China">Taiwan, Province of China</option>
                  <option value="Tajikistan">Tajikistan</option>
                  <option value="Tanzania, United Republic of">Tanzania, United Republic of</option>
                  <option value="Thailand">Thailand</option>
                  <option value="Timor-leste">Timor-leste</option>
                  <option value="Togo">Togo</option>
                  <option value="Tokelau">Tokelau</option>
                  <option value="Tonga">Tonga</option>
                  <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                  <option value="Tunisia">Tunisia</option>
                  <option value="Turkey">Turkey</option>
                  <option value="Turkmenistan">Turkmenistan</option>
                  <option value="Turks and Caicos Islands">Turks and Caicos Islands</option>
                  <option value="Tuvalu">Tuvalu</option>
                  <option value="Uganda">Uganda</option>
                  <option value="Ukraine">Ukraine</option>
                  <option value="United Arab Emirates">United Arab Emirates</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United States">United States</option>
                  <option value="United States Minor Outlying Islands">United States Minor Outlying Islands</option>
                  <option value="Uruguay">Uruguay</option>
                  <option value="Uzbekistan">Uzbekistan</option>
                  <option value="Vanuatu">Vanuatu</option>
                  <option value="Venezuela">Venezuela</option>
                  <option value="Viet Nam">Viet Nam</option>
                  <option value="Virgin Islands, British">Virgin Islands, British</option>
                  <option value="Virgin Islands, U.S.">Virgin Islands, U.S.</option>
                  <option value="Wallis and Futuna">Wallis and Futuna</option>
                  <option value="Western Sahara">Western Sahara</option>
                  <option value="Yemen">Yemen</option>
                  <option value="Zambia">Zambia</option>
                  <option value="Zimbabwe">Zimbabwe</option>
              </select>
                                  </div>
                              </div>

                              <div class="form-group">
                                  
                              <div class="col-xs-6">
                                  <label for="city"><h4>City</h4></label>
                                  <input type="text" class="form-control" name="town" id="town" value="`+ result['personal']['town'] + `"  required /">
                              </div>
                          </div>
                          
                              <div class="form-group">
                                  

                              
                                  <div class="col-xs-6">
                                      <label for="password"><h4>Password</h4></label>
                                      <input type="password" class="form-control" name="password" id="password" placeholder="password"  required />
                                  </div>
                              </div>
                              
                              <div class="form-group">
                                   <div class="col-xs-12">
                                        <br>
                                          <button id="PersonalUpdate" class="btn btn-lg btn-success" type="submit"> Save</button>
                                    </div>
                              </div>
                          </form>
                      
                      <hr>
                      

  `;

        clearResponse();
        $('#content').html(html);
    }

    // Acount Update Access Validation
    function showUpdateAccountForm() {
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


                        ShowAccountUpdateForm();



                    } else {
                        // on error/fail, tell the user he needs to login to show the account page
                        showLoginPage();
                        $('#response').html("<div class='alert alert-danger'>Please login to access the account page.</div>");
                    }
                }
                catch (err) {
                    // on error/fail, tell the user he needs to login to show the account page
                    showLoginPage();
                    $('#response').html("<div class='alert alert-danger'>Please login to access the account page.</div>");
                }


            }




        });

        xhr.open("POST", "https://idea-maker.herokuapp.com/api/index.php/profile/");
        xhr.setRequestHeader("content-type", "application/json");

        xhr.setRequestHeader("cache-control", "no-cache");


        xhr.send(data);


    }

    // Show Password Recovry via mail from
    function ShowSendRecoverMailForm() {
        var html = `
                <!------ Include the above in your HEAD tag ---------->
                
                    <div class="form-gap"></div>
                    <div class="container">
                        <div class="row">
                            <div class="col-md-4 col-md-offset-4">
                                <div class="panel panel-default">
                                    <div class="panel-body">
                                        <div class="text-center">
                                            <h3><i class="fa fa-lock fa-4x"></i></h3>
                                            <div id="recovryFrom">
                                            <h2 class="text-center">Forgot Password?</h2>
                                            <p>You can reset your password here.</p>
                                            <div class="panel-body" >

                                                <form id="recovry-form" role="form" autocomplete="off" class="form" method="PUT">

                                                    <div class="form-group">
                                                        <div class="input-group">
                                                            <span class="input-group-addon"><i class="glyphicon glyphicon-envelope color-blue"></i></span>
                                                            <input id="email" name="email" placeholder="email address" class="form-control" type="email">
                        </div>
                                                        </div>
                                                        <div class="form-group">
                                                            <input name="recover-submit" class="btn btn-lg btn-primary btn-block" value="Reset Password" type="submit">
                      </div>
                    </form>
                    <div>

                                                        </div>
                                                    </div>
              </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
`;
        $('#content').html(html);
        clearResponse();
    }

    // Send Password Recovry Via Mail
    function SendPassowrRecovery(email) {
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                var result = $.parseJSON(this.responseText);
                console.log(result);
                if (result['status'] === 200) {
                    $('#recovryFrom').html("<div class='alert alert-success'>Mail Sended Successfully.</div>");
                } else if (result['status'] === 300) {
                    $('#response').html("<div class='alert alert-danger'>Email not execit in our database.</div>");
                } else {
                    $('#response').html("<div class='alert alert-danger'>SomeThing Wrong Plise Try again latre.</div>");
                }
            }
        });

        xhr.open("PUT", "https://idea-maker.herokuapp.com/api/index.php/recovery/" + email + "/");
        xhr.setRequestHeader("cache-control", "no-cache");

        xhr.send(null);


    }

    // show Profile Form
    function showProfileForm() {

        // validate jwt to verify access
        var jwt = getCookie('jwt');


        var data = JSON.stringify({
            "jwt": jwt
        });

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                try {
                    result = $.parseJSON(this.responseText)
                    if (result) {
                        showLoggedInMenu();

                        GetProfilePicture = (result['personal']['gender'] === "male") ? "img/M_profile.png" : "img/F_profile.png";
                        CreateProfileFormPage();
                    } else {
                        // on error/fail, tell the user he needs to login to show the home page
                        showLoginPage();
                        $('#response').html("<div class='alert alert-danger'>Please login to access the home page.</div>");
                    }
                }
                catch (err) {
                    // on error/fail, tell the user he needs to login to show the home page
                    showLoginPage();
                    $('#response').html("<div class='alert alert-danger'>Please login to access the home page.</div>");
                }


            }




        });

        xhr.open("POST", "https://idea-maker.herokuapp.com/api/index.php/home/");
        xhr.setRequestHeader("content-type", "application/json");

        xhr.setRequestHeader("cache-control", "no-cache");


        xhr.send(data);
    }

    function CreateProfileFormPage() {
        var Home_html = `
    
                            
                            <div class="mainbody container-fluid">
                                <div class="row" style="flex-wrap: unset;">
                                   
                                    <div style="padding-top:50px;"> </div>
                                    <div class="col-lg-3 col-md-3 hidden-sm hidden-xs">
                                        <div class="panel panel-default">
                                            <div class="panel-body">
                                                
                                                
                                                    <img class="avatar img-circle img-thumbnail" src="`+ GetProfilePicture + `" width="300px" height="300px">
    
                                                    <div class="media-body">
                                                        <h3><strong>`+ result['personal']['name']['fname'] + ` ` + result['personal']['name']['lname'] + `</strong></h3>
                                                        <hr>
                                                        <hr>
                                                        <h4><strong>Bio</strong></h4>
                                                        <p>`+ result['personal']['summary'] + `.</p>
                                                        <hr>
                                                        <h4><strong>Location</strong></h4>
                                                        <p>`+ result['personal']['town'] + ` ` + result['personal']['country'] + `</p>
                                                        <hr>
                                                        <h4><strong>Gender</strong></h4>
                                                        <p>`+ result['personal']['gender'] + `</p>
                                                        <hr>
                                                        <h4><strong>Account Role</strong></h4>
                                                        <p>`+ result['accType'] + `</p>
                                                    </div>
                                            </div>
                                        </div>
                                    </div>
    
                                    <!----- Write NEW POST CODE HERE-------!>
                                        <hr>
                                        <div id="posts"></div>
                                    </div>
                                </div>   
                    `;


        clearResponse();
        $('#content').html(Home_html);

    }

});


