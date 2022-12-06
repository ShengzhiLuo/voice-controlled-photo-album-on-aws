document.getElementById("displaytext").style.display = "none";

function searchPhoto()
{

  var apigClient = apigClientFactory.newClient({
                     apiKey: "0bo5SBm1X01vzyHdsjWvS7g98RUwKRw08pnzhLot"
        });

    var user_message = document.getElementById('search_query').value;

    var body = { };
    var params = {q : user_message};
    var additionalParams = {headers: {
      'Content-Type': "application/json"
  }};

    apigClient.searchGet(params, body , additionalParams).then(function(res){
        var data = {}
        var data_array = []
        resp_data  = res.data
        length_of_response = resp_data.length;
        if(length_of_response == 0)
        {
          document.getElementById('photos_search_results').innerHTML = "No Images Found !!!"
          document.getElementById('photos_search_results').style.display = "block";

        }

        resp_data.forEach( function(obj) {

            var img = new Image();
            img.src = "https://s3.amazonaws.com/6998photoss/"+obj;
            img.setAttribute("class", "banner-img");
            img.setAttribute("alt", "effy");
            document.getElementById('photos_search_results').innerHTML = "Images returned are : "
            document.getElementById("img-container").appendChild(img);
            document.getElementById('photos_search_results').style.display = "block";

          });
      }).catch( function(result){

      });



}

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    // reader.onload = () => resolve(reader.result)
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



function uploadPhoto()
{
   // var file_data = $("#file_path").prop("files")[0];
   var file = document.getElementById('uploaded_file').files[0];
   const reader = new FileReader();

   var file_data;
   // var file = document.querySelector('#file_path > input[type="file"]').files[0];
   var encoded_image = getBase64(file).then(
     data => {
     console.log(data)
     var apigClient = apigClientFactory.newClient({
                       apiKey: "0bo5SBm1X01vzyHdsjWvS7g98RUwKRw08pnzhLot"
          });

     // var data = document.getElementById('file_path').value;
     // var x = data.split("\\")
     // var filename = x[x.length-1]
     var file_type = file.type + ";base64"
     var custom_label = document.getElementById("custom_labels").value;
     var body = data;
     var params = {"key" : file.name, "bucket" : "6998photoss", "Content-Type" : file.type};
     var additionalParams = {headers: {"x-amz-meta-customLabels": custom_label} };
      //  axios.put("https://dlax6rsc77.execute-api.us-east-1.amazonaws.com/test3/" + file.name, body, additionalParams).then(function (res) {
        apigClient.bucketPhotosPut(params, body , additionalParams).then(function(res){
       if (res.status == 200)
       {
         document.getElementById("uploadText").innerHTML = "Image Uploaded  !!!"
         document.getElementById("uploadText").style.display = "block";
       }
     })
   });

}