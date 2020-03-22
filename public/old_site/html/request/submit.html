<?php
/** Debug **/

// Print out POST variables
//print_r($_POST);

/** Get Post Variables from Form **/

// Starter Administrative Values
$date = date('m/d/Y h:i:s a', time());
$completed = 0;

// User Information
$name = $_POST['usr'];
$email = $_POST['email'];

// Model Request Body
$iam = $_POST['iam'];
$otherPerson = $_POST['otherPerson'];

$description = $_POST['description'];
$telephone = $_POST['phoneInput'];
$school = $_POST['school'];
$feedback = $_POST['feedback'];

$stlLink =  $_POST['stlUpload'];
$modelSize = $_POST['modelSize'];
$considerations = $_POST['considerations'];
$understand = $_POST['understand'];
$publicity = $_POST['publicity'];

// Address Variables
$address1 = $_POST['address1'];
$address2 = $_POST['address2'];
$city = $_POST['city'];
$state = $_POST['state'];
$zipcode = $_POST['zipcode'];
$label = $_POST['label'];

/** Sanitize Input for Database **/

// Set other person if iAm radio with text box set
if(strcmp($iam, "other") == 0) {
  $iam = $otherPerson;
}

// Set telephone if phone description radio set
if(strcmp($description, "telephone") == 0) {
  $description .= ": " . $telephone;
}

$feedbackChecked = 0;
if(strcmp($feedback, "on") == 0) {
  $feedbackChecked = 1;
}

// Address Field
$address = $address1 . " " . $address2 . " " . $city . " " .
$state . " " . $zipcode;

// Label Checkbox
$brailleLabel = 0;
if(strcmp($label, "on") == 0) {
  $brailleLabel = 1;
}

/** Database Operations **/

// Establish MySql Connection
include_once('../includes/db_connect_form.php');

// Insert into Working Table
if($submit = $mysqli -> prepare("INSERT INTO form_submits
  (date, completed, name, email, iam, description, telephone, school, feedback,
  stl_file, model_size, considerations, understand, how_found, address, label)
  VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)")) {
  $submit -> bind_param("sissssssissssssi", $date, $completed, $name, $email,
    $iam, $description, $telephone, $school, $feedbackChecked, $stlLink, $modelSize,
    $considerations, $understand, $publicity,  $address, $brailleLabel);
  $submit -> execute();
}

// Insert into Permanent Table
if($submit = $mysqli -> prepare("INSERT INTO form_submits_permanent
  (date, completed, name, email, iam, description, telephone, school, feedback,
  stl_file, model_size, considerations, understand, how_found, address, label)
  VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)")) {
  $submit -> bind_param("sissssssissssssi", $date, $completed, $name, $email,
    $iam, $description, $telephone, $school, $feedback, $stlLink, $modelSize,
    $considerations, $understand, $publicity,  $address, $brailleLabel);
  $submit -> execute();
}

// Close Link
$mysqli->close();

/** Redirect once Complete **/
header("Location: donate.php");
?>
