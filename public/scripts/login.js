function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log("ID: " + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log("Name: " + profile.getName());
  console.log("Image URL: " + profile.getImageUrl());
  console.log("Email: " + profile.getEmail()); // This is null if the 'email' scope is not present.
  $("#sign-in-button").toggleClass("hide");
  $("#nav-profile-pic").toggleClass("hide");
  document.getElementById(
    "nav-profile-pic"
  ).style.backgroundImage = `url("${profile.getImageUrl()}")`;
}

function onSuccess(googleUser) {
  console.log("Logged in as: " + googleUser.getBasicProfile().getName());
}
function onFailure(error) {
  console.log(error);
}
function renderButton() {
  gapi.signin2.render("my-signin2", {
    scope: "profile email",
    width: 240,
    height: 50,
    longtitle: true,
    theme: "dark",
    onsuccess: onSuccess,
    onfailure: onFailure
  });
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function() {
    console.log("User signed out.");
    location.reload();
  });
}

function checkForUser(id) {
  $.ajax({
    method: "GET",
    url: "/api/users/:id",
    success: userSuccess,
    error: userError
  });
}

function userSuccess(user) {
  console.log("retrieved user data:" + user);
}
function placeError() {
  console.log("error retrieving user data");
}

$(".dropdown-trigger").dropdown({ constrainWidth: false });
$(".modal").modal();
