import os
from flask import Flask, request, jsonify
from flask_cors import CORS,cross_origin
from glob import glob
from cnocr import CnOcr


import util
from pdfExtractor import FicoScore,bereauExtract


app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
ARCHIVE_PATH = "/Users/maggie/Desktop/PDF-extension/uploads"
FILE_FETCH_URL = "http://127.0.0.1:4050/uploads/"
OCR = CnOcr()  # using default setting


@app.route('/upload', methods=['POST','GET'])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'})
    file = request.files['file']
    print(request.form)
    # session_id = request.files['sessionId']
    session_id =request.form.get("session_id")
    resp =None
    if file.filename == '':
        resp = jsonify({'error': 'No file selected'})
    else:
        filename = file.filename
        folder =f'{ARCHIVE_PATH}/{session_id}'
        util.mrk_dir(folder)
        destination = os.path.join(folder, filename)
        file.save(destination)
        # fetch url_list
        urls_list =util.fetch_files_urls(folder,FILE_FETCH_URL)
        resp =jsonify({"urls":urls_list})
    return resp



@app.route('/merger', methods=['POST','GET'])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def merger():
    session_id =request.form.get("session_id")
    folder =f'{ARCHIVE_PATH}/{session_id}'
    pdfs = glob(f"{folder}/*.pdf")
    if len(pdfs) <1:
        resp = jsonify({'error': 'No file selected'})
    else:
        merged_filename = f"{session_id}_merged.pdf"
        merged_path =f"{ARCHIVE_PATH}/{merged_filename}"
        util.merger(pdfs,merged_path)

        resp = jsonify({"urls":[f"{FILE_FETCH_URL}/{merged_filename}"]})
    return resp



@app.route('/extractor', methods=['POST','GET'])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def extractor():
    print("request is ",request.form)
    session_id =request.form.get("session_id")
    print("the url is extractor!!")
    print("get session_id", session_id)
    file = request.form.get("file_name")
    file_path =f'{ARCHIVE_PATH}/{session_id}/{file}'
    print('get file name',file_path)
    Fico_score = FicoScore(pdfPath=file_path,pageNum=0,OCR=OCR,searchPhrase="Summary")
    bereau_summary = bereauExtract(pdfPath=file_path,pageNum=1)
    resp={}
    resp['scoreSummary'] =Fico_score
    resp['bereauSummary']=bereau_summary
    return jsonify(resp)

if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0',port=4040)




