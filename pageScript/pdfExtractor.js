const { response } = require("express");

class PdfExtractor{
    constructor(element,sessionId,requestMethod,requestUrl,fileName){
        this.sessionId =sessionId;
        this.element =element;
        this.requstMethod =requestMethod;
        this.requstUrl =requestUrl;
        this.fileName =fileName;
        this.element.addEventListener("click", (event) => this.mergeFile(event));
    }

    extractor(event){
        // return the structured data
        const formData =new FormData();
        formData.append("fileName",this.fileName);
        formData.append("sessionId",this.sessionId);
        fetch(this.requstUrl,{method:this.requstMethod,body:this.formData})
        .then(response =>{
            if (!response.ok){throw new Error("Network response was not ok!")};
            return response.json();
        })
        .then(data =>{
            // change the value of html elements
            
            
        })
    }
}






const sumbitBotton = document.getElementById("pdf-merge_button");
const requestMethod ="POST";
const requestUrl ="http://localhost:4040/merger"


const pdfMerger = new clickMerge(sumbitBotton,sessionStorage.getItem('sessionId'),requestMethod,requestUrl);