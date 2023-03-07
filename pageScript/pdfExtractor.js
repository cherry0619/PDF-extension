
class PdfExtractor{
    constructor(element,requestMethodEx,requestUrlEx){
        this.element =element;
        this.requestMethodEx =requestMethodEx;
        this.requestUrlEx =requestUrlEx;
        this.element.addEventListener("click", (event) => this.extractor(event));
    }

    changeFicoValue(tb,cellValueArray){
        // for (let i = 1; i < tb.rows.length; i++) {
        for (let i = 1; i < tb.rows.length; i++) {
            // Iterate over the cells of the row
            for (let j = 0; j < tb.rows[i].cells.length; j++) {
          
              // Get the current cell element
              const cell = tb.rows[i].cells[j];
              cell.innerHTML =cellValueArray[i-1][j];
            }
        }
    }

    changeBereauValue(tb,cellValueArray){
        var tbody = document.createElement("tbody");
        for(var i =0; i<cellValueArray.length;i++){
            var row = document.createElement("tr");
            var rowValues = cellValueArray[i];
            for(var j =0;j<rowValues.length;j++){
                var cell = document.createElement("td");
                cell.innerHTML =rowValues[j];
                row.appendChild(cell);
            }
            tbody.appendChild(row);
        }
        tb.replaceChild(tbody,tb.tBodies[0]);
    }



    extractor(event){
        // return the structured data
        const formData =new FormData();
        formData.append("file_name",sessionStorage.getItem("file_name"));
        formData.append("session_id",sessionStorage.getItem("session_id"));
        fetch(this.requestUrlEx,{method:this.requestMethodEx,body:formData})
        .then(response =>{
            if (!response.ok){throw new Error("Network response was not ok!")};
            return response.json();
        })
        .then(data =>{
            // change the value of html elements
            console.log("response from interface ",data)
            var tbFICO= document.getElementById('FICO-SCORE-SUMMARY');
            var FICOData =data.scoreSummary;
            this.changeFicoValue(tbFICO,FICOData);

            var TbBereau =document.getElementById('BUREAU-SUMMARY');
            var bereauData =data.bereauSummary;
            this.changeBereauValue(TbBereau,bereauData);
            // for (let i = 1; i < tbFICO.rows.length; i++) {

            //     // Iterate over the cells of the row
            //     for (let j = 0; j < tbFICO.rows[i].cells.length; j++) {
              
            //       // Get the current cell element
            //       const cell = tbFICO.rows[i].cells[j];
            //       cell.innerHTML =data.scoreSummary[i-1][j];
            //     }
            // }
            // const TbBereau =decodeURIComponent.getElementById('bereauSummary');

            // this.changeTableValue(tbFICO);
            // this.changeTableValue(TbBereau);
        })
    }
}



const extractBotton = document.getElementById("extractorButton");
// const requestMethodCon ="POST";
// const requestUrlCon ="http://localhost:4040/extractor";
// const uploadedFileName =sessionStorage.getItem('fileName');
// console.log("filename is", sessionStorage.getItem);
const PdfExtract = new PdfExtractor(extractBotton,
                                    "POST",
                                    "http://localhost:4040/extractor");