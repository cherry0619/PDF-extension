// function part
// use session storage to track the former


// here I should change the text of the button and display style
function extractorPageLayout(navName,dropBoxClassname,pdfViewerId){
    // firstly, the dropbox should be a rectangle with wider border and narrow height
    const dropBox =document.getElementsByClassName(dropBoxClassname)[0]; 
    dropBox.id="dropBox"+navName;
}


function changeStyle(highlightName,navList,sectionList){
    var len = navList.length;
    for (let i=0;i<navList.length;i++){
        const activeFlag = navList[i].id.includes(highlightName);
        if (activeFlag ==true){
            sectionList[i].style.display="block";
            navList[i].className="active";
        } else{
            sectionList[i].style.display="none";
            navList[i].className="non-active";
        }
    }
}


// loop running part
var functionList =["merger","extractor","word"]
var navList =[];
var sectionList =[];
for(let i=0;i<functionList.length;i++){
    navLink = document.getElementById(functionList[i]+"-link");
    sectionName =document.getElementById(functionList[i]);
    navList.push(navLink);
    sectionList.push(sectionName);

}


navList[0].addEventListener("click", function() { changeStyle("merger", navList, sectionList); });

navList[1].addEventListener("click", function() { changeStyle("extractor", navList, sectionList); });

navList[2].addEventListener("click", function() { changeStyle("word", navList, sectionList); });


