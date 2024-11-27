$(document).ready(function () {

    fetchTheaters();

    $("#theaterSelect").change(function () {
        fetchMoviesByTheater();
    });

    $("#searchButton").click(function () {
        searchMovies();
    });

    function fetchTheaters() {
        $.ajax({
            url: "https://www.finnkino.fi/xml/TheatreAreas/",
            method: "GET",
            success: function (data) {
                let $xml = $(data);
                $xml.find("TheatreArea").each(function () {
                    let id = $(this).find("ID").text();
                    let name = $(this).find("Name").text();
                    $("#theaterSelect").append(`<option value="${id}">${name}</option>`);
                });
            },
            error: function () {
                alert("Failed to fetch theaters. Please try again later.");
            }
        });
    }

    function fetchMoviesByTheater() {
        let theaterID = $("#theaterSelect").val();
        if (!theaterID) return;

        $.ajax({
            url: `https://www.finnkino.fi/xml/Schedule/?area=${theaterID}`,
            method: "GET",
            success: function (data) {
                let $xml = $(data);
                let shows = $xml.find("Show");
                displayMovies(shows);
            },
            error: function () {
                alert("Failed to fetch movies. Please try again later.");
            }
        });
    }

    // Display movies with optional filtering
    function displayMovies(shows, filter = "") {
        let $movieInfo = $("#movieInfo");
        $movieInfo.empty();

        shows.each(function () {
            let movieTitle = $(this).find("Title").text();
            if (filter && !movieTitle.toLowerCase().includes(filter.toLowerCase())) return;

            let startTime = $(this).find("dttmShowStart").text();
            let imageUrl = $(this).find("EventSmallImagePortrait").text();
            let genre = $(this).find("Genres").text() || "N/A";

            let $card = $(`
                <div class="col-12 col-md-4">
                    <div class="card h-100 shadow-sm">
                        <img src="${imageUrl}" class="card-img-top" alt="${movieTitle}">
                        <div class="card-body">
                            <h5 class="card-title">${movieTitle}</h5>
                            <p class="card-text">Start time: ${startTime}</p>
                            <p class="card-text">Genre: ${genre}</p>
                        </div>
                    </div>
                </div>
            `);

            $movieInfo.append($card);
        });

        // Add fade-in animation
        $movieInfo.children().hide().fadeIn(800);
    }

    function searchMovies() {
        let filter = $("#movieSearch").val().trim();
        let theaterID = $("#theaterSelect").val();
        if (!theaterID) return;

        $.ajax({
            url: `https://www.finnkino.fi/xml/Schedule/?area=${theaterID}`,
            method: "GET",
            success: function (data) {
                let $xml = $(data);
                let shows = $xml.find("Show");
                displayMovies(shows, filter);
            },
            error: function () {
                alert("Failed to fetch movies. Please try again later.");
            }
        });
    }
});
