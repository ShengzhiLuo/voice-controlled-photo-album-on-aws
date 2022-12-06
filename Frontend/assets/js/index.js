// var apigClient = apigClientFactory.newClient({apiKey: "0bo5SBm1X01vzyHdsjWvS7g98RUwKRw08pnzhLot"});
var apigClient = apigClientFactory.newClient();
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
        'q': searchText
    };
    
    apigClient.searchGet(params, {}, {})
        .then(function(result) {
            console.log("Result : ", result);

            // image_paths = result["data"]["body"]["imagePaths"];
            image_paths = result["data"];
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

function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let encoded = reader.result.replace(/^data:(.*;base64,)?/, '');
        if ((encoded.length % 4) > 0) {
          encoded += '='.repeat(4 - (encoded.length % 4));
        }
        resolve(encoded);
      };
      reader.onerror = error => reject(error);
    });
  }
  

function uploadPhoto() {
    // var file = document.getElementById('uploaded_file').value;
    // debugger;
    event.preventDefault();
    var filePath = (document.getElementById("uploaded_file").value).split("\\");
    var fileName = filePath[filePath.length - 1];
    if (document.getElementById("custom_labels").innerText == "") {
        var custom_labels = document.getElementById("custom_labels").value;
    }
    // console.log(custom_labels);

    var reader = new FileReader();
    var file = document.getElementById('uploaded_file').files[0];

    file.constructor = () => file;

    console.log('File : ', file);
    document.getElementById('uploaded_file').value = "";


    // if ((filePath == "") || (!['png', 'jpg', 'jpeg','JPG'].includes(fileName.split(".")[1]))) {
    //     alert("Please upload a valid .png/.jpg/.jpeg file!");
    // } else {

    //     fileName = fileName.split(".")[0] + ".jpeg";
    //     console.log(fileName);
    //     var params = {
    //         'photos': fileName,
    //         'Content-Type': file.type,
    //         'bucket': '6998photoss',
    //         "x-amz-meta-customLabels": custom_labels,
    //         'Access-Control-Allow-Headers': '*',
    //         'Access-Control-Request-Headers': '*',
    //         'Access-Control-Allow-Origin': '*'
    //       };
    //     var additionalParams = {
    //         headers: {
    //             // 'Access-Control-Allow-Origin': '*',
    //             'Content-Type': file.type,
    //             // 'X-Api-Key': "0bo5SBm1X01vzyHdsjWvS7g98RUwKRw08pnzhLot"
    //             // "x-amz-meta-customLabels": custom_labels
    //         }
    //     };
    
    // reader.onload = function (event) {
    //     body = btoa(event.target.result);
    //     console.log('Reader body : ', body);
    //     return apigClient.bucketPhotosPut(params, body , additionalParams).then(function(res){
    //         if (res.status == 200)
    //         {
    //             document.getElementById("uploadText").innerHTML = "Image Uploaded  !!!"
    //             document.getElementById("uploadText").style.display = "block";
    //         }
    //         })
    //     }
    // }
    // reader.readAsBinaryString(file);
    // }

    if ((filePath == "") || (!['png', 'jpg', 'jpeg', 'JPG'].includes(fileName.split(".")[1]))) {
        alert("Please upload a valid .png/.jpg/.jpeg file!");
    } else {
        fileName = fileName.split(".")[0] + ".jpeg";
        console.log(fileName);
        event.preventDefault();
        var encoded = getBase64(file).then((data) => {
            var img_base64 = data;
            console.log(img_base64);
            var params = {
                'photos': fileName,
                'bucket': '6998photoss',
                "Content-Type": file.type + ";base64",
                "x-amz-meta-customLabels": custom_labels,
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Request-Headers': '*',
                'Access-Control-Allow-Origin': '*'
            };
            var additionalParams = {
                headers: {
                    // 'Access-Control-Allow-Origin': '*',
                    'Content-Type': file.type + ";base64",
                    'X-Api-Key': "0bo5SBm1X01vzyHdsjWvS7g98RUwKRw08pnzhLot"
                    // "x-amz-meta-customLabels": custom_labels
                }
            }
            console.log(params);
            return apigClient.bucketPhotosPut(params, file, additionalParams).then(function (response) {
                if (response.status == 200) {
                    console.log("Response:");
                    console.log(response);
                    console.log("Custom label sent - "); //sameer paraphrase
                    console.log(custom_labels);
                    document.getElementById("uploadText").innerHTML = "Image Uploaded  !!!"
                    document.getElementById("uploadText").style.display = "block";
                }
            });
        });
    };
    };


    
