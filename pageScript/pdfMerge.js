
class clickMerge{
    constructor(element,sessionId,requestMethod,requestUrl){
        this.sessionId =sessionId;
        this.element =element;
        this.requstMethod =requestMethod;
        this.requstUrl =requestUrl;
        this.element.addEventListener("click", (event) => this.mergeFile(event));
    }
    
    mergeFile(event){
        const formData = new FormData()
        formData.append("session_id",this.sessionId);

        fetch(this.requstUrl,{
            method:this.requstMethod,
            body:formData
        })
        .then(response =>{
            if(!response.ok){
                throw new Error("Network response was not ok");
            }
            return response.json();
        }).then(data => {
            // change the src of pdf-preview
            const previewElement = document.getElementById("pdf-preview");
            previewElement.src = data.urls[0];
        })
    }

 }


const sumbitBotton = document.getElementById("pdf-merge_button");
const requestMethod ="POST";
const requestUrl ="http://localhost:4040/merger"


const pdfMerger = new clickMerge(sumbitBotton,sessionStorage.getItem('sessionId'),requestMethod,requestUrl);