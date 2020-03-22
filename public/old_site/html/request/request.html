<?php
  include_once '../includes/register.inc.php';
  include_once '../includes/functions.php';

  sec_session_start();
 ?>
<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>See3D</title>

    <!-- Bootstrap Core CSS -->
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">

    <!-- Custom Fonts -->
    <link href="../vendor/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
    <link href="https://fonts.googleapis.com/css?family=Lora:400,700,400italic,700italic" rel="stylesheet" type="text/css">
    <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700" rel="stylesheet" type="text/css">

    <!-- Theme CSS -->
    <link href="../css/grayscale.min.css" rel="stylesheet">

    <!-- Added CSS -->
    <link href="../css/index.css" rel="stylesheet">
    <link href="../css/slides.css" rel="stylesheet">
    <link href="../css/request.css" rel="stylesheet">

    <!-- Added Scripts -->
    <script src="../js/slides.js"></script>

</head>

<body id="page-top" data-spy="scroll" data-target=".navbar-fixed-top">

    <!-- Navigation -->
    <div id="page-child">
        <nav class="navbar navbar-custom navbar-fixed-top" role="navigation">
            <div class="container">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-main-collapse">
                        Menu <i class="fa fa-bars"></i>
                    </button>
                    <a class="navbar-brand page-scroll" href="../index.php">
                        <i class="fa fa-play-circle"></i> <span class="light">See</span>3D
                    </a>
                </div>

                <!-- Collect the nav links, forms, and other content for toggling -->
                <div class="collapse navbar-collapse navbar-right navbar-main-collapse">
                    <ul class="nav navbar-nav">
                        <!-- Hidden li included to remove active class from about link when scrolled up past about section -->
                        <li class="hidden">
                            <a href="#page-top"></a>
                        </li>
                        <?php if (login_check($mysqli) == true) : ?>
                          <li>
                              <a class="page-scroll" href="../includes/logout.php">Logout</a>
                          </li>
                        <?php endif; ?>
                    </ul>
                </div>
                <!-- /.navbar-collapse -->
            </div>
            <!-- /.container -->
        </nav>

        <!-- Intro Header -->
        <header class="intro">
            <div class="intro-body">
                <div class="container">
                    <div class="row row-spacing">
                        <div class="col-md-8 col-md-offset-2">
                            <h1 class="brand-heading transform-reset">See3D</h1>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <!-- Model Request -->
        <section id="model-request" class="container content-section text-center reset-top-padding">
            <div class="row">
                <div class="col-lg-8 col-lg-offset-2">
                  <?php
                  if (isset($_GET['error'])) {
                      echo '<p class="error">Error Logging In!</p>';
                  }
                  ?>
                    <!-- Model Request Text -->
                    <h2 class="transform-reset">Request a Model Today</h2>
                    <h4 class="transform-reset">Having questions about parts of the form? View our frequently asked <a href="instructions.php">here</a>. </h4>

                    <form id="requestForm" action="submit.php" method="post">
                        <!-- Order Name Field -->
                        <div class="form-group">
                            <label for="usr">
                                <h5 style="margin: 0">Name <span style="color:red;">*</span></h5></label>
                            <input type="text" class="form-control" placeholder="John Doe" id="usr" name="usr" maxlength="128" required>
                        </div>
                        <!-- Order E-Mail Field -->
                        <div class="form-group">
                            <label for="email">
                                <h5 style="margin: 0">E-Mail <span style="color:red;">*</span></h5></label>
                            <input type="email" class="form-control" placeholder="user@example.com" id="email" name="email" maxlength="256" required>
                        </div>

                        <div class="form-spacing"></div>

                        <!-- Button Enable Script -->
                        <script type="text/javascript">
                          function textEnable(id) {
                            let textfield = document.getElementById(id);
                            textfield.disabled = false;
                          }
                          function textDisable(id) {
                            let textfield = document.getElementById(id);
                            textfield.disabled = true;
                            textfield.value = "";
                          }
                        </script>

                        <!-- I Am Radio Button Field -->
                        <h5 style="margin: 0;">I Am:</h5>
                        <div class="form-group tabbed-group">
                            <div>
                              <input onclick="textDisable('otherInput');" type="radio" class="form-control radio-input" id="iAm1" name="iam" value="blind">
                              <label class="iamLabel" for="iAm1">A person who is blind or visually impaired</label>
                            </div>
                            <br>
                            <div>
                              <input onclick="textDisable('otherInput');" type="radio" class="form-control radio-input" id="iAm2" name="iam" value="parent">
                              <label class="iamLabel" for="iAm2">A parent, guardian, or teacher of someone who is blind or visually impaired</label>
                            </div>
                            <br>
                            <div>
                              <input onclick="textEnable('otherInput');" type="radio" class="form-control radio-input" id="iAm3" name="iam" value="other">
                              <label style="margin-right: 20px;" class="iamLabel" id="iAm3Label" for="iAm3">Other: </label>
                              <input id="otherInput" class="form-control textbox-resize" type="text" name="otherPerson" maxlength="128" disabled>
                            </div>
                        </div>

                        <style media="screen">
                          .radio-input {
                            width: auto;
                            padding-right: 5px;
                            padding-left: 5px;
                            float: left;
                            margin: 0 !important;
                          }
                          .iamLabel {
                            margin-top: 7px;
                            margin-left: 10px;
                          }
                          .tabbed-group {
                            margin-left: 25px;
                          }
                          .textbox-resize{
                            width: 40%;
                          }
                          #iAm3Label {
                            float:left;
                          }
                        </style>

                        <!-- Model Description -->
                        <h5 style="margin: 0;">Would you like a model description? (Models with descriptions may take longer to ship)</h5>
                        <div class="form-group tabbed-group">
                            <div>
                              <input type="radio" class="form-control radio-input" id="desc1" name="description" value="email" onclick="textDisable('phoneInput');">
                              <label class="iamLabel" for="desc1">Email Description</label>
                            </div>
                            <br>
                            <div>
                              <input type="radio" class="form-control radio-input" id="desc2" name="description" value="braille" onclick="textDisable('phoneInput')">
                              <label class="iamLabel" for="desc2">Braille Description (Hard Copy)</label>
                            </div>
                            <br>
                            <div>
                              <input type="radio" class="form-control radio-input" id="desc3" name="description" value="large print" onclick="textDisable('phoneInput');">
                              <label class="iamLabel" for="desc3">Large Print Description (Hard Copy)</label>
                            </div>
                            <br>
                            <div>
                              <input type="radio" class="form-control radio-input" id="desc4" name="description" value="telephone" onclick="textEnable('phoneInput');">
                              <label style="margin-right: 20px;" class="iamLabel" id="iAm3Label" for="desc4">Phone Call</label>
                              <input id="phoneInput" class="form-control textbox-resize" type="tel" name="phoneInput" maxlength="16" placeholder="(123)-456-7890" disabled>
                            </div>
                            <br>
                            <div>
                              <input type="radio" class="form-control radio-input" id="desc5" name="description" value="no description" onclick="textDisable('phoneInput');">
                              <label class="iamLabel" for="desc5">No Description</label>
                            </div>
                        </div>

                        <!-- School Field -->
                        <div class="form-group">
                            <label for="school">
                                <h5 style="margin: 0;">School (If Applicable)</h5></label>
                            <input type="text" class="form-control" id="school" name="school" maxlength="128">
                        </div>

                        <!-- Feedback -->
                        <div class="line-box" style="margin-top: 10px;">
                            <h5 class="address-label" style="margin:0;">Would you be willing to provide feedback?</h5>
                            <input type="checkbox" class="form-control checkbox-change" id="feedback" name="feedback">
                        </div>

                        <!-- STL File Field -->
                        <div class="form-group">
                            <label for="stlUpload">
                                <h5 style="margin: 0;">What model would you like? (or link to file download) <span style="color:red;">*</span></h5></label>
                            <input type="text" class="form-control" id="stlUpload" name="stlUpload" maxlength="256" required>
                        </div>

                        <!-- Model Size Field -->
                        <div class="form-group">
                            <label for="modelSize">
                                <h5 style="margin: 0;">Desired Model Size (in.)</h5></label>
                            <input type="text" class="form-control" id="modelSize" name="modelSize" maxlength="128"></input>
                        </div>

                        <!-- Considerations Field -->
                        <div class="form-group">
                            <label for="considerations">
                                <h5 style="margin: 0;">Do you need any special considerations?</h5></label>
                            <input type="text" class="form-control" placeholder="Details..." id="considerations" name="considerations" maxlength="256"></input>
                        </div>

                        <!-- Understand Field -->
                        <div class="form-group">
                            <label for="understand">
                                <h5 style="margin: 0;">What part of this object are you trying to better understand?</h5></label>
                            <input type="text" class="form-control" placeholder="Details..." id="understand" name="understand" maxlength="256"></input>
                        </div>

                        <!-- Publicity Field -->
                        <div class="form-group">
                            <label for="publicity">
                                <h5 style="margin: 0;">How did you hear about See3D?</h5></label>
                            <input type="text" class="form-control" placeholder="Details..." id="publicity" name="publicity" maxlength="256"></input>
                        </div>

                        <div class="form-spacing"></div>

                        <!-- Order Address Field -->
                        <div class="form-group">
                            <label for="address">
                                <h5 style="margin: 0">Address</h5></label>

                            <!-- Address Line 1 Field -->
                            <div class="line-box">
                                <a class="address-label">Address Line 1 <span style="color:red;">*</span></a>
                                <input type="text" class="form-control line-change" placeholder="Address Line 1" id="address1" name="address1" maxlength="128" required>
                            </div>

                            <!-- Address Line 2 Field -->
                            <div class="line-box" style="margin-top: 10px;">
                                <a class="address-label">Address Line 2</a>
                                <input type="text" class="form-control line-change" placeholder="Address Line 2" id="address2" name="address2" maxlength="128">
                            </div>

                            <!-- City Field -->
                            <div class="line-box" style="margin-top: 10px;">
                                <a class="address-label">City <span style="color:red;">*</span></a>
                                <input type="text" class="form-control line-change" placeholder="City" id="city" name="city" maxlength="32" required>
                            </div>

                            <!-- State Field -->
                            <div class="line-box" style="margin-top: 10px;">
                                <a class="address-label">State <span style="color:red;">*</span></a>
                                <input type="text" class="form-control line-change" placeholder="State" id="state" name="state" maxlength="32" required>
                            </div>

                            <!-- Zip Code Field -->
                            <div class="line-box" style="margin-top: 10px;">
                                <a class="address-label">Zip Code <span style="color:red;">*</span></a>
                                <input type="text" class="form-control line-change" placeholder="Zip Code" id="zipcode" name="zipcode" maxlength="10" required>
                            </div>

                            <!-- Braille Address Label -->
                            <div class="line-box" style="margin-top: 10px;">
                                <a class="address-label">Braille Address Label</a>
                                <input type="checkbox" class="form-control checkbox-change" id="label" name="label">
                            </div>
                        </div>

                        <!-- Submit Button -->
                        <div class="button-box">
                            <!-- <a class="btn btn-default btn-lg" href="javascript:submit()">Submit</a> -->
                            <input id="submit" type="submit" class="btn btn-default btn-lg">
                        </div>
                        <style media="screen">
                          .form-spacing {
                            width: 100%;
                            height: 50px;
                          }
                        </style>
                    </form>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer>

        </footer>

        <!-- Form Validation -->
        <script>
            // Called when submit button is pressed
            function submit() {
              // Gather form variables
              var name = document.getElementById('usr');
              var email = document.getElementById('email');
              var address1 = document.getElementById('address1');
              var city = document.getElementById('city');
              var state = document.getElementById('state');
              var zipcode = document.getElementById('zipcode');
              var understand = document.getElementById('understand');
              var publicity = document.getElementById('publicity');

              if (name.value.equals("")){
                name.style.borderColor = "red";
              }
            }
        </script>

        <!-- jQuery -->
        <script src="../vendor/jquery/jquery.js"></script>

        <!-- Bootstrap Core JavaScript -->
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>

        <!-- Plugin JavaScript -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.3/jquery.easing.min.js"></script>

        <!-- Theme JavaScript -->
        <script src="../js/grayscale.min.js"></script>

    </div>
</body>

</html>
