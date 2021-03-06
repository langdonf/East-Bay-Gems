let results = [];
let allPlaces;
let allPeople;

checkHidden = function() {
  if ($("#places").is(":checked") && $("#people").is(":checked")) {
    $(".place").removeClass("hide");
    $(".people").removeClass("hide");
  } else if (!$("#places").is(":checked") && !$("#people").is(":checked")) {
    $(".place").removeClass("hide");
    $(".people").removeClass("hide");
  } else if (!$("#places").is(":checked") && $("#people").is(":checked")) {
    $(".place").addClass("hide");
    $(".people").removeClass("hide");
  } else if ($("#places").is(":checked") && !$("#people").is(":checked")) {
    $(".people").addClass("hide");
    $(".place").removeClass("hide");
  }
};

$(document).ready(function() {
  let user;
  if (sessionStorage.getItem("currentUser")) {
    user = JSON.parse(sessionStorage.getItem("currentUser"));
  }
  console.log("Sanity check");

  //initialize materialize elements
  $(".dropdown-trigger").dropdown();
  $(".pushpin").pushpin();
  $(".modal").modal();
  $(".slider").slider({
    height: 800
  });
  $(".fixed-action-btn").floatingActionButton();
  $("select").formSelect();
  $(".sidenav").sidenav();

  $("#places").on("click", function() {
    $("#places_menu").toggleClass("hide");
    checkHidden();
  });
  $("#people").on("click", function() {
    checkHidden();
  });

  //////////////// get all gems ////////////////////
  $.ajax({
    method: "GET",
    url: "/api/places",
    success: placeSuccess,
    error: placeError
  });
  function placeSuccess(places) {
    allPlaces = places;
    $.ajax({
      method: "GET",
      url: "/api/people",
      success: peopleSuccess,
      error: peopleError
    });
  }
  function peopleSuccess(people) {
    allPeople = people;
    populate();
  }
  function placeError() {
    console.log("error");
  }
  function peopleError() {
    console.log("error");
  }

  // Shows correct form
  $("#gemSelector").change(function() {
    if ($(this).val() == "place") {
      $("#submitPlace").removeClass("hide");
      $("#submitPerson").addClass("hide");
    }
    if ($(this).val() == "person") {
      $("#submitPerson").removeClass("hide");
      $("#submitPlace").addClass("hide");
    }
  });

  //////////////////////////////////////
  /////////// post new gem ///////////
  //post place
  $("#newPlaceForm").on("submit", function(e) {
    $.ajax({
      method: "POST",
      url: "/api/places",
      data: $(this).serialize(),
      success: newPlaceSuccess,
      error: newPlaceError
    });
    function newPlaceSuccess(gem) {
      user.posts.push(gem._id);
      let stringifiedPosts = JSON.stringify({ posts: user.posts });
      userPut(user.uid, stringifiedPosts, `added ${gem.name} to user posts`);
    }
    function newPlaceError() {
      console.log("error");
    }
  });
  //post new person
  $("#newPersonForm").on("submit", function(e) {
    $.ajax({
      method: "POST",
      url: "/api/people",
      data: $(this).serialize(),
      success: newPersonSuccess,
      error: newPersonError
    });

    function newPersonSuccess(gem) {
      user.posts.push(gem._id);
      let stringifiedPosts = JSON.stringify({ posts: user.posts });
      userPut(user.uid, stringifiedPosts, `added ${gem.name} to user posts`);
    }
    function newPersonError() {
      console.log("error");
    }
  });

  ///////////////////////////////////////////////
  //////////////add like to user/////////////////

  $("#gems").on("click", ".halfway-fab", function() {
    let gem = this.name;
    let likes;
    likes = user.likes;

    if (!likes.includes(gem)) {
      likes.push(gem);

      let stringifiedLikes = JSON.stringify({ likes: likes });

      userPut(user.uid, stringifiedLikes, `Added ${gem} to user liked posts`);
    } else {
      M.toast({ html: "You've already liked this post" });
    }
  });
  ///////////////////////////////////////////////
  ///////////////search filter function//////////
  $("#search").on("keyup", function() {
    var value = $(this)
      .val()
      .toLowerCase();
    $("#gems .card").filter(function() {
      $(this).toggle(
        $(this)
          .text()
          .toLowerCase()
          .indexOf(value) > -1
      );
    });
  });
});
/////////////////////////////////////////////
///////////////shuffle function/////////////
let shuffle = array => {
  var m = array.length,
    t,
    i;
  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
};
//////////////////////////////////////////
/////shuffle gems and add cards///////////
let populate = () => {
  let user;
  if (sessionStorage.getItem("currentUser")) {
    user = JSON.parse(sessionStorage.getItem("currentUser"));
  }

  gems = allPeople.concat(allPlaces);
  results = shuffle(gems);
  results.forEach(gem => {
    if (user && user.likes.includes(gem._id)) {
      var heart = "fas fa-heart fa-1x";
    } else {
      var heart = "far fa-heart fa-1x";
    }
    cardHtml = `<div attr="${gem.city}" class="${
      gem.gem
    } card small horizontal hoverable" id=${gem._id}>
                  <div class="card-image">
                  </div>
                  <div class="card-stacked">
                    <div class="card-content"><a name="${
                      gem._id
                    }" class="btn-floating halfway-fab waves-effect waves-light red"><i class="heart ${heart}"></i></a>
                      <span class="card-title activator grey-text text-darken-4"><i class="fas fa-gem fa-1x top waves-effect waves-block waves-light"></i> ${
                        gem.name
                      } - ${gem.city}</span>
                      <p>${gem.description}</p>
                    </div>
                    <div class="card-action">
                      <a href="${gem.url}">More info</a>
                    </div>
                  </div>
                  <div class="card-reveal col l4">

                    <span class="card-title grey-text text-darken-4">
                    <i class="material-icons">close</i></span>
                    <div class="map"></div>
                    
                  </div>
                </div>`;
    $(".heart").on("click", function() {
      $(this)
        .removeClass("far fa-heart")
        .addClass("fas fa-heart");
    });

    if (document.getElementById("gems")) {
      $("#gems").append(cardHtml);

      ///////////////////////////////
      ////////resize photos//////////
      document
        .getElementById(`${gem._id}`)
        .querySelector(".card-image").style.backgroundImage = `url("${
        gem.photo
      }")`;
    }
  });
  //////////// add map ///////////

  // gems.forEach(gem => {
  //   let reveal = document.getElementById(`${gem._id}`).querySelector(".map");
  //   initMap(reveal);
  // });
};

function userPut(uid, data, successMessage) {
  $.ajax({
    method: "PUT",
    url: `/api/users/${uid}`,
    contentType: "application/json",
    data: data,
    dataType: "json",
    success: updateUserSuccess,
    error: updateUserError
  });
  function updateUserSuccess() {
    console.log(successMessage);
  }
  function updateUserError() {
    console.log("error");
  }
}

function initMap(cardReveal) {
  let map = new google.maps.Map(cardReveal, {
    center: { lat: 37.8044, lng: -122.2711 },
    zoom: 8
  });
}
