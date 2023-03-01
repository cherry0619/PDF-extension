from PyPDF2 import PdfMerger

def merger(pdfs,save_path):
    merger = PdfMerger()
    for pdf in pdfs:
        merger.append(pdf)
    merger.write(save_path)
    merger.close()