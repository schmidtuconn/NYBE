﻿// Write your Javascript code.
$("#toggleAdvancedSearch").click(function () {
    if (document.getElementById("toggleAdvancedSearch").innerHTML === "Hide Advanced Search") {
        $("#advancedSearchFields").hide();
        $("#generalSearch").show()
        document.getElementById("toggleAdvancedSearch").innerHTML = "Show Advanced Search";
    } else {
        $("#advancedSearchFields").show();
        $("#generalSearch").hide();
        document.getElementById("toggleAdvancedSearch").innerHTML = "Hide Advanced Search";
    }
});

$("#schoolSelectBox").change(function() {
    var schoolSelected = $("#schoolSelectBox").find(":selected").val();
    
    //From: http://stackoverflow.com/questions/2008287/removing-and-adding-options-from-a-group-of-select-menus-with-jquery
    //Show all options
    $("#courseSelectBox > option").show().removeAttr('disabled');

    if (schoolSelected == "-1") {
        return;
    }

    //Get values that should be hidden
    $('#courseSelectBox > option').each(function () {
        
        var schoolForCourse = $(this).attr('class');
        console.log(schoolForCourse);
        if (schoolForCourse > 0 && schoolForCourse != schoolSelected) {
            $(this).hide().attr('disabled', 'disabled');
        }
    });
});

$("#editTradeCheckBox").click(function () {
    console.log("Clicked!");
    if (document.getElementById('editTradeCheckBox').checked) {
        $("#editListingPrice").hide();

    } else {
        $("#editListingPrice").show();
    }
});

$("#listingTradeCheckBox").click(function () {
    console.log("Clicked!");
    if (document.getElementById('listingTradeCheckBox').checked) {
        $("#listingPrice").hide();

    } else {
        $("#listingPrice").show();
    }
});

$("#wishTradeCheckBox").click(function () {
    console.log("Clicked!");
    if (document.getElementById('wishTradeCheckBox').checked) {
        $("#idealPrice").hide();

    } else {
        $("#idealPrice").show();
    }
});

$("#surveyTradeCheckBox").click(function () {
    console.log("Clicked!");
    if (document.getElementById('surveyTradeCheckBox').checked) {
        $("#surveyPriceDiv").hide();
        $("#surveyPrice").val(-1);
    } else {
        $("#surveyPriceDiv").show();
    }
});

$("#googleBooksSearch").click(function () {
    var isbn = $("#gb_search_isbn").val();
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                var response = JSON.parse(this.responseText);
                if (response.totalItems > 0) {
                    var book = response.items[0].volumeInfo;
                    var title = book.title;
                    var author = book.authors[0];
                    var publisher = book.publisher;
                    var firstName = author.slice(0, author.indexOf(' '));
                    var lastName = author.slice(author.indexOf(' ') + 1);
                    var isbns = book.industryIdentifiers;
                    var isbn = isbns[0].identifier;
                    if (isbns[1] && isbns[1].type === "ISBN_13") {
                        isbn = isbns[1].identifier;
                    }
                    var description = book.description;
                    var image = book.imageLinks.thumbnail;
                    $("#gb_label_title").text(title);
                    $("#gb_title").val(title);
                    $("#gb_label_authorLName").text(lastName);
                    $("#gb_authorLName").val(lastName);
                    $("#gb_label_authorFName").text(firstName);
                    $("#gb_authorFName").val(firstName);
                    $("#gb_label_isbn").text(isbn);
                    $("#gb_isbn").val(isbn);
                    $("#gb_label_description").text(description);
                    $("#gb_description").val(description);
                    $("#gb_label_image").text(image);
                    $("#gb_image").val(image);
                    $('#gb_imgDisplayarea').attr('src', image);
                    $("#gb_edition").val("");
                    $("#gb_label_publisher").text(publisher);
                    $("#gb_publisher").val(publisher);
                    $("#gb_form").show();
                } else {
                    alert("Could not find the book you are searching for.");
                }
            } else {
                alert("Could not find the book you are searching for.");
            }
        }
    };

    var url = "https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn + "&key=AIzaSyAFr1FsZceoWiIHKFdSnMPeixy_ePvMG6U";

    xhttp.open("GET", url, true);
    xhttp.send();
});