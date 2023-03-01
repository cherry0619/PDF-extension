import os
from flask import Flask, request, jsonify
from flask_cors import CORS,cross_origin
from glob import glob

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})


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
        folder =f'/Users/maggie/Desktop/PDF-extension/uploads/{session_id}'
        mrk_dir(folder)
        destination = os.path.join(folder, filename)
        file.save(destination)
        # fetch url_list
        urls_list =fetch_files(folder)
        resp =jsonify({"urls":urls_list})
        # resp = jsonify({"url":f"http://127.0.0.1:4050/uploads/{session_id}/{filename}"})
    print(urls_list)
    return resp



def mrk_dir(path):
    if not os.path.exists(path):
        os.system(f"mkdir -p {path}")
        print("path is not existed, we create a new one .--",path)


def fetch_files(folder,suffix="pdf",url_prefix="http://127.0.0.1:4050/uploads/"):
    files_list =glob(f"{folder}/*.{suffix}")
    filenames_list = ["/".join(i.split('/')[-2::]) for i in files_list]
    urls_list =[f"{url_prefix}/{i}" for i in filenames_list]
    return urls_list

if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0',port=4040)