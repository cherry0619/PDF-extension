
const sessionId = Math.random().toString(36).substr(2);
sessionStorage.setItem("session_id",sessionId);

class FileUploader{
    constructor(element,recievingUrl,requestMethod,pdfPreviewId){
        this.element = element;
        this.recievingUrl = recievingUrl;
        this.requestMethod = requestMethod;
        this.pdfPreviewId =pdfPreviewId;
        this.element.addEventListener("dragover", (event) => this.handleDragOver(event));
        this.element.addEventListener("dragleave", (event) => this.handleDragLeave(event));
        this.element.addEventListener("drop", (event) => this.handleDrop(event));
  }

    handleDragOver(event){
        event.preventDefault();
        this.element.classList.add("drag-over");

    }

    handleDragLeave(event) {
        event.preventDefault();
        this.element.classList.remove("drag-over");
      }
      
      // only one file per time
      // if multiple files are choosed, only the first file will be uploaded to the sercer
    handleDrop(event) {
      console.log("Drop started ~~")
      event.preventDefault();
      this.element.classList.remove("drag-over");
      const file = event.dataTransfer.files[0];
        if (file.length === 0) return;
          const formData = new FormData();
          formData.append("file", file);
        // add session id to identify the user
        formData.append('session_id',sessionId);
        // fetch url and send form data;
        fetch(this.recievingUrl, {
          method: this.requestMethod,
          body: formData
        })
        .then(response => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then(data => {
            // console.log("starting the preview !!");
            const previewElement = document.getElementById("pdf-preview");
            previewElement.src = data.urls[0];
            // dynamically generate <li> tag
            const pdfLists = document.getElementById("uploaded-files-lists");
            pdfLists.innerHTML = "";
            for(let i=0;i<data.urls.length;i++){
              const url = data.urls[i];
              const li = document.createElement("li");
              const a =document.createElement("a");
              const linkText = document.createTextNode(url.split('/').slice(-1));
              a.appendChild(linkText);
              a.href =url;
              li.append(a);
              pdfLists.append(li);
            }
        })
        .catch(error => {
          console.error("Error:", error);
        });

        event.preventDefault();
      }
      
}


function fileupload(event,fileInputId,requestMethod,requestUrl,pdfReviewerId,uploadedFilesLists){
  const fileInput =document.getElementById(fileInputId);
  const formData = new FormData();
  sessionStorage.setItem('fileName',fileInput.files[0].name)
  formData.append("file",fileInput.files[0]);
  formData.append('session_id',sessionId);
  fetch(requestUrl,
    {method:requestMethod,
    body:formData})
  .then(response =>{
    if (!response.ok) {throw new Error("Network response was not ok");}
  return response.json();
  })
  .then(data => {
    // console.log("starting the preview !!");
    const previewElement = document.getElementById(pdfReviewerId);
    previewElement.src = data.urls[0]+"#zoom=100%";
    // dynamically generate <li> tag
    const pdfLists = document.getElementById(uploadedFilesLists);
    pdfLists.innerHTML = "";
    for(let i=0;i<data.urls.length;i++){
      const url = data.urls[i];
      const li = document.createElement("li");
      const a =document.createElement("a");
      const linkText = document.createTextNode(url.split('/').slice(-1));
      a.appendChild(linkText);
      a.href =url;
      li.append(a);
      pdfLists.append(li);
    }
  })
  .catch(error => {
    console.error("Error:", error);
  });
}



function fileExtract(event,fileInputId,requestMethod,requestUrl,pdfReviewerId){
  const fileInput =document.getElementById(fileInputId);
  const formData = new FormData();
  sessionStorage.setItem('file_name',fileInput.files[0].name)
  formData.append("file",fileInput.files[0]);
  formData.append('session_id',sessionStorage.getItem("session_id"));
  
  console.log("session id is ",sessionStorage.getItem("session_id"));
  console.log("file name is ",sessionStorage.getItem("file_name"));

  fetch(requestUrl,
    {method:requestMethod,
    body:formData})
  .then(response =>{
    if (!response.ok) {throw new Error("Network response was not ok");}
  return response.json();
  })
  .then(data => {
    // console.log("starting the preview !!");
    const previewElement = document.getElementById(pdfReviewerId);
    previewElement.src = data.urls[0]+"#zoom=100%";
  })
  .catch(error => {
    console.error("Error:", error);
  });
}


const dropBox = document.getElementById("dropBox");
const requestUrlCon ="http://localhost:4040/upload";
const requestMethodCon ="POST";

const uploader = new FileUploader(dropBox, requestUrlCon, requestMethodCon,"pdf-preview");

const clickUp = document.getElementById("sumbit-file");
clickUp.addEventListener("click",function(event){fileupload(event,"fileInput",requestMethodCon,requestUrlCon,"pdf-preview","uploaded-files-lists")});


const formSubmit = document.getElementById("extractFileSubmit");
formSubmit.addEventListener("click",
                            function(event){fileExtract(event,
                                                        "extractorFileInput",
                                                        requestMethodCon,
                                                        requestUrlCon,
                                                        "extractorPdfPreview")});