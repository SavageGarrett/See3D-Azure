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
    <link href="../../vendor/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
    <link href="https://fonts.googleapis.com/css?family=Lora:400,700,400italic,700italic" rel="stylesheet" type="text/css">
    <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700" rel="stylesheet" type="text/css">

    <!-- Theme CSS -->
    <link href="../../css/grayscale.min.css" rel="stylesheet">

  	<!-- Added CSS -->
  	<link href="../../css/index.css" rel="stylesheet">
  	<link href="../../css/slides.css" rel="stylesheet">

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
        <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
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
                <a class="navbar-brand page-scroll" href="../../index.php">
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
                    <!-- <li>
                        <a class="page-scroll" href="#about">About</a>
                    </li>
                    <li>
                        <a class="page-scroll" href="#volunteer">Volunteer</a>
                    </li>
                    <li>
                        <a class="page-scroll" href="#impact">Impact</a>
                    </li> -->
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


	<section class="container content-section text-center reset-top-padding">
        <div class="row" style="padding-left: 120px; padding-right: 60px;">
              <h3>Gallery</h3>
              <style>
                div.gallery {
                  margin: 5px;
                  border: 1px solid #ccc;
                  float: left;
                  width: 180px;
                }

                div.gallery:hover {
                  border: 1px solid #777;
                }

                div.gallery img {
                  width: 178px;
                  height: 133.5px;
                  object-fit: cover;
                  image-orientation: from-image;
                }

                div.desc {
                  padding: 15px;
                  text-align: center;
                }
              </style>

              <?php
                // Open image directory
                if ($handle = opendir('../../all_images/')) {
                  // Loop over files in directory
                  while (false !== ($entry = readdir($handle))) {
                    if (!(strcmp(basename($entry),".") == 0 || strcmp(basename($entry), "..") == 0)) {
                      echo "<div class=\"gallery\">" .
                        "<a target=\"_blank\" href=\"" . "../../all_images/" . basename($entry) . "\">" .
                        "<img src=\"" . "../../all_images/" . basename($entry) . "\"alt=\"Cinque Terre\" width=\"600\" height=\"400\">" .
                        "</a>" .
                        "<div class=\"desc\">Add a description of the image here</div>" .
                        "</div>";
                    }
                    print_r($entry);
                  }

                  closedir($handle);
                }
                ?>
        </div>
    </section>

    <!-- Footer -->
    <footer>

    </footer>

    <!-- jQuery -->
    <script src="../../vendor/jquery/jquery.js"></script>

    <!-- Bootstrap Core JavaScript -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>

    <!-- Plugin JavaScript -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.3/jquery.easing.min.js"></script>

    <!-- Theme JavaScript -->
    <script src="../../js/grayscale.min.js"></script>

	</div>
</body>

</html>
