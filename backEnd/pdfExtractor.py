from PyPDF2 import PdfReader
import fitz
from PIL import Image


def FicoScore(pdfPath,pageNum,OCR,searchPhrase="Summary"):
    pdfDoc = fitz.open(pdfPath)
    text_instances = pdfDoc[pageNum].search_for(searchPhrase)
    # Get the coordinates of the first occurrence of the text
    x1, y1, x2, y2 = text_instances[0].x0, text_instances[0].y0, text_instances[0].x1, text_instances[0].y1
    # Set the crop box of the page to the rectangular area
    crop_area = fitz.Rect(x1-50, y1, x2+400, y2+120)
    pdfDoc[pageNum].set_cropbox(crop_area)
    # Render the cropped area as an image
    mat = fitz.Matrix(2, 2)  # adjust the scaling factor as needed
    pix = pdfDoc[pageNum].get_pixmap(matrix=mat)
    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
    out = OCR.ocr(img)
    scores =[i.get('text') for i in out[-3:]]

    return [scores]


def bereauExtract(pdfPath,pageNum):
    reader = PdfReader(pdfPath)
    page = reader.pages[pageNum]
    text = page.extract_text()
    text_list =text.split('\n')
    valid_text =[text_list[i:i+3] for i,t in enumerate(text_list) if "Public Records" in t]
    clean_text =[ [m.strip(' ') for j in i.split("   ") for m in j.split(':') ]for i in valid_text[0] ]
    return clean_text


if __name__ =="__main__":
    from cnocr import CnOcr
    OCR = CnOcr()  # using default setting

    file_path ="/Users/maggie/Desktop/PDF-extension/uploads/2slhyzi9ibd/experian_report_02.pdf"
    Fico_score = FicoScore(pdfPath=file_path,pageNum=0,OCR=OCR,searchPhrase="Summary")
    bereau_summary = bereauExtract(pdfPath=file_path,pageNum=1)
    resp={}
    resp['score-summary'] =Fico_score
    resp['bereau-summary']=bereau_summary
    print(resp)