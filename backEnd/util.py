import os
from glob import glob
from PyPDF2 import PdfMerger


def mrk_dir(path):
    if not os.path.exists(path):
        os.system(f"mkdir -p {path}")
        print("path is not existed, we create a new one .--",path)

    


def fetch_files_urls(folder,url_prefix,suffix="pdf",):
    files_list =glob(f"{folder}/*.{suffix}")
    filenames_list = ["/".join(i.split('/')[-2::]) for i in files_list]
    urls_list =[f"{url_prefix}/{i}" for i in filenames_list]
    return urls_list



def merger(pdfs,save_path):
    merger = PdfMerger()
    for pdf in pdfs:
        merger.append(pdf)
    merger.write(save_path)
    merger.close()