$(document).ready(function() {
  console.log("Sanity check");

  $.ajax({
    method: "GET",
    url: "/api/places/featured",
    success: placeSuccess,
    error: placeError
  });

  function placeSuccess(json) {
    json.forEach(featured => {
      featHtml = `<li>
                    <img src="${featured.photo}" />
                      <div class="caption center-align">
                      <h3>${featured.name} - ${featured.city}</h3>
                      <h5 class="light grey-text text-lighten-3">${
                        featured.description
                      }</h5>
                    </div>
                  </li>`;
      $("#featured").append(featHtml);
    });
    $(".slider").slider({
      height: 800
    });
  }
  function placeError() {
    console.log("error in feat.js");
  }
});
