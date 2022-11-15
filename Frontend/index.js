var apigClient = apigClientFactory.newClient({apiKey: "0bo5SBm1X01vzyHdsjWvS7g98RUwKRw08pnzhLot"});
window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition

function voiceSearch(){
    if ('SpeechRecognition' in window) {
        console.log("SpeechRecognition is Working");
    } else {
        console.log("SpeechRecognition is Not Working");
    }
    
    var inputSearchQuery = document.getElementById("search_query");
    const recognition = new window.SpeechRecognition();
    //recognition.continuous = true;

    micButton = document.getElementById("mic_search");  
    
    if (micButton.innerHTML == "mic") {
        recognition.start();
    } else if (micButton.innerHTML == "mic_off"){
        recognition.stop();
    }

    recognition.addEventListener("start", function() {
        micButton.innerHTML = "mic_off";
        console.log("Recording.....");
    });

    recognition.addEventListener("end", function() {
        console.log("Stopping recording.");
        micButton.innerHTML = "mic";
    });

    recognition.addEventListener("result", resultOfSpeechRecognition);
    function resultOfSpeechRecognition(event) {
        const current = event.resultIndex;
        transcript = event.results[current][0].transcript;
        inputSearchQuery.value = transcript;
        console.log("transcript : ", transcript)
    }
}




function textSearch() {
    var searchText = document.getElementById('search_query');
    console.log(searchText.value);
    if (!searchText.value) {
        alert('Please enter a valid text or voice input!');
    } else {
        searchText = searchText.value.trim().toLowerCase();
        console.log('Searching Photos....');
        searchPhotos(searchText);
    }
    
}

function searchPhotos(searchText) {

    console.log(searchText);
    document.getElementById('search_query').value = searchText;
    document.getElementById('photos_search_results').innerHTML = "<h4 style=\"text-align:center\">";

    var params = {
        'q' : searchText
    };
    
    apigClient.searchGet(params, {}, {})
        .then(function(result) {
            console.log("Result : ", result);

            image_paths = result["data"]["body"]["imagePaths"];
            console.log("image_paths : ", image_paths);

            var photosDiv = document.getElementById("photos_search_results");
            photosDiv.innerHTML = "";

            var n;
            for (n = 0; n < image_paths.length; n++) {
                images_list = image_paths[n].split('/');
                imageName = images_list[images_list.length - 1];

                photosDiv.innerHTML += '<figure><img src="' + image_paths[n] + '" style="width:25%"><figcaption>' + imageName + '</figcaption></figure>';
            }

        }).catch(function(result) {
            console.log(result);
        });
}

function uploadPhoto() {
    // var file = document.getElementById('uploaded_file').value;
    // debugger;
    var filePath = (document.getElementById("uploaded_file").value).split("\\");
    var fileName = filePath[filePath.length - 1];
    if (document.getElementById("custom_labels").innerText == "") {
        var custom_labels = document.getElementById("custom_labels").value;
    }
    console.log(fileName);
    console.log(custom_labels);
    // console.log(custom_labels);

    var reader = new FileReader();
    var file = document.getElementById('uploaded_file').files[0];
    console.log('File : ', file);
    document.getElementById('uploaded_file').value = "";

    if ((filePath == "") || (!['png', 'jpg', 'jpeg','JPG'].includes(fileName.split(".")[1]))) {
        alert("Please upload a valid .png/.jpg/.jpeg file!");
    } else {
        var params = {
            'photos': fileName,
            'Content-Type': file.type,
            'bucket': '6998photoss',
            "x-amz-meta-customLabels": custom_labels
          };
        var additionalParams = {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': file.type,
                'X-Api-Key': "0bo5SBm1X01vzyHdsjWvS7g98RUwKRw08pnzhLot"
            }
        };
        
        reader.onload = function (event) {
            body = btoa(event.target.result);
            console.log('Reader body : ', body);
            return apigClient.bucketPhotosPut(params, body , additionalParams).then(function(res){
                if (res.status == 200)
                {
                  document.getElementById("uploadText").innerHTML = "Image Uploaded  !!!"
                  document.getElementById("uploadText").style.display = "block";
                }
              })
            }
        }
        reader.readAsBinaryString(file);
    }
