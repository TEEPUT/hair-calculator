from flask import Flask, render_template, request, session, redirect, jsonify, send_from_directory, flash, url_for
from flask_mysqldb import MySQL
from werkzeug.utils import secure_filename
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
from PIL import Image
from io import BytesIO
import base64
import pymysql
import MySQLdb.cursors
import re
import cv2
import numpy as np
import os
import requests
import uuid
import traceback
import subprocess
import json
import re
import random



app = Flask(__name__)



# 데이터베이스 설정
app.config['MYSQL_HOST'] = '호스트'
app.config['MYSQL_PORT'] = 포트번호
app.config['MYSQL_USER'] = '유저'
app.config['MYSQL_PASSWORD'] = '비밀번호'
app.config['MYSQL_DB'] = '데이터베이스'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
mysql = MySQL(app)



# 세션 비밀 키
app.secret_key = 'StyleHC'



# 이미지 저장 폴더 설정
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER



# 메인 화면
@app.route('/main.html')
def index():
    user_id = session.get('id')
    nickname = session.get('nickname', None)
    business_registration_number = session.get('business_registration_number', None)
    company_name = session.get('company_name')

    # 사용자의 프로필 정보가 있는지 확인
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute('SELECT * FROM profiles WHERE id = %s', [user_id])
    profile_exists = cursor.fetchone() is not None
    cursor.close()
    return render_template('main.html', nickname=nickname, business_registration_number=business_registration_number, company_name=company_name, profile_exists=profile_exists)



# 지도 API
@app.route('/map.html')
def map():
    nickname = session.get('nickname', None)
    return render_template('map.html', nickname=nickname)



# 정보 수정
@app.route('/information.html', methods=['GET'])
def information():
    if 'loggedin' in session:
        id = session['id']
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('SELECT * FROM users WHERE id = %s', [id])
        user = cursor.fetchone()
        cursor.close()
        return render_template('information.html', **user) # 모든 사용자 정보를 템플릿에 전달
    return redirect('/login.html')



# 정보 수정 업데이트 정보
@app.route('/information_update', methods=['POST'])
def information_update():
    if 'loggedin' in session:
        user_id = session['id'] # "id"가 내장함수와 충돌할 수 있으므로 이름을 변경
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)

        # 비밀번호 확인 로직
        current_password = request.form.get('current_password')
        new_password = request.form.get('new_password')
        confirm_new_password = request.form.get('confirm_new_password')

        cursor.execute('SELECT password FROM users WHERE id = %s', [user_id])
        result = cursor.fetchone()

        if result['password'] != current_password:
            cursor.close()
            return "현재 비밀번호가 잘못되었습니다."

        if new_password != confirm_new_password:
            cursor.close()
            return "새로운 비밀번호와 확인 비밀번호가 일치하지 않습니다."

        # 사업자 정보 변경을 선택했고, 사업자 번호가 제공된 경우만 검증
        if 'business_info_change' in request.form:
            business_registration_number = request.form.get('business_registration_number')
            if business_registration_number:
                api_key = 'q%2BbAMtJO%2BluFeeVfOUdGd44HgnCfB1LtgEXuVjI4UZ%2BGRo0YK3P7XgVEAP%2BVaMMPokzQQ8N3o%2FCYSME3Rb3B8A%3D%3D'
                url = 'https://api.odcloud.kr/api'
                headers = {
                    'Authorization': 'Bearer ' + api_key
                }
                params = {
                    'business_registration_number': business_registration_number
                }

                response = requests.get(url, headers=headers, params=params)
                data = response.json()

                # 유효성 검사 로직 (실제 API의 응답에 따라 수정될 수 있음)
                if not data or data.get('result') != 'valid':
                    cursor.close()
                    return jsonify({'message': '사업자 등록 번호가 유효하지 않습니다.'})

        # 유저 가져오기
        name = request.form['name']
        nickname = request.form['nickname']
        email = request.form['email']
        gender = request.form['gender']
        phnumber = request.form['phnumber']

        # 사업자 정보 가져오기
        company_name = request.form.get('company_name')
        representative_name = request.form.get('representative_name')
        business_registration_number = request.form.get('business_registration_number')
        corporation_registration_number = request.form.get('corporation_registration_number')
        business_type = request.form.get('business_type')
        business_category_detail = request.form.get('business_category_detail')

        # 주소 정보 가져오기
        postcode = request.form.get('sample4_postcode')
        roadAddress = request.form.get('sample4_roadAddress')
        jibunAddress = request.form.get('sample4_jibunAddress')
        detailAddress = request.form.get('sample4_detailAddress')
        extraAddress = request.form.get('sample4_extraAddress')
        
        # database update 쿼리
        query = """UPDATE users 
                   SET name = %s, nickname = %s, email = %s, gender = %s, phnumber = %s, 
                       sample4_postcode = %s, sample4_roadAddress = %s, sample4_jibunAddress = %s, 
                       sample4_detailAddress = %s, sample4_extraAddress = %s, password = %s,
                       company_name = %s, representative_name = %s, business_registration_number = %s,
                       corporation_registration_number = %s, business_type = %s, business_category_detail = %s
                   WHERE id = %s"""
        cursor.execute(query, (name, nickname, email, gender, phnumber, postcode, roadAddress, jibunAddress, detailAddress, 
                               extraAddress, new_password, company_name, representative_name, business_registration_number, 
                               corporation_registration_number, business_type, business_category_detail, user_id))
        mysql.connection.commit()
        cursor.close()

        return redirect('/information.html')
    return redirect('/login.html')



# 상세 정보
@app.route('/product.html')
def product():
    nickname = session.get('nickname', None)
    return render_template('product.html', nickname=nickname)



# 로그인
@app.route('/login.html', methods=['GET', 'POST'])
def login():
    msg = ''
    if request.method == 'POST' and 'id' in request.form and 'password' in request.form:
        id = request.form['id']
        password = request.form['password']

        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('SELECT * FROM users WHERE id = %s AND password = %s', (id, password))
        account = cursor.fetchone()
        cursor.close()

        if account:
            session['loggedin'] = True
            session['id'] = account['id']
            session['nickname'] = account['nickname']
            session['business_registration_number'] = account['business_registration_number']
            session['company_name'] = account['company_name']
            return redirect('/main.html')
        else:
            msg = '아이디/비밀번호가 올바르지 않습니다!'

    return render_template('login.html', msg=msg)



# 로그아웃
@app.route('/logout')
def logout():
    session.pop('id', None)
    session.pop('nickname', None)
    session['loggedin'] = False
    return redirect('/login.html')



# 회원가입
@app.route('/signup.html', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        
        business_registration_number = request.form.get('business_registration_number')
        
        # 사업자로 회원가입을 선택했고, 사업자 번호가 제공된 경우만 검증
        if 'business_signup' in request.form and business_registration_number:
            api_key = 'q%2BbAMtJO%2BluFeeVfOUdGd44HgnCfB1LtgEXuVjI4UZ%2BGRo0YK3P7XgVEAP%2BVaMMPokzQQ8N3o%2FCYSME3Rb3B8A%3D%3D'
            url = 'https://api.odcloud.kr/api'
            headers = {
                'Authorization': 'Bearer ' + api_key
            }
            params = {
                'business_registration_number': business_registration_number
            }

            response = requests.get(url, headers=headers, params=params)
            data = response.json()

            # 유효성 검사 로직 (실제 API의 응답에 따라 수정될 수 있음)
            if not data or data.get('result') != 'valid':
                return jsonify({'message': '사업자 등록 번호가 유효하지 않습니다.'})

            # 사업자로 회원가입 선택 시 비즈니스 정보 추가
            details = {
                "username": request.form['id'],
                "name": request.form['name'],
                "nickname": request.form['nickname'],
                "password": request.form['password'],
                "email": request.form['email'],
                "gender": request.form['gender'],
                "phnumber": request.form['phnumber'],
                "postcode": request.form['sample4_postcode'],
                "roadAddress": request.form['sample4_roadAddress'],
                "jibunAddress": request.form['sample4_jibunAddress'],
                "detailAddress": request.form['sample4_detailAddress'],
                "extraAddress": request.form['sample4_extraAddress'],
                "company_name": request.form.get('company_name'),
                "representative_name": request.form.get('representative_name'),
                "business_registration_number": business_registration_number,
                "corporation_registration_number": request.form.get('corporation_registration_number'),
                "business_type": request.form.get('business_type'),
                "business_category_detail": request.form.get('business_category_detail'),
            }

            query = """
            INSERT INTO users (id, name, nickname, password, email, gender, phnumber, 
                               sample4_postcode, sample4_roadAddress, sample4_jibunAddress,
                               sample4_detailAddress, sample4_extraAddress,
                               company_name, representative_name, business_registration_number,
                               corporation_registration_number, business_type, business_category_detail)
            VALUES (%(username)s, %(name)s, %(nickname)s, %(password)s, %(email)s, %(gender)s, %(phnumber)s, 
                    %(postcode)s, %(roadAddress)s, %(jibunAddress)s, %(detailAddress)s, %(extraAddress)s,
                    %(company_name)s, %(representative_name)s, %(business_registration_number)s,
                    %(corporation_registration_number)s, %(business_type)s, %(business_category_detail)s)
            """
        else:
            details = {
                "username": request.form['id'],
                "name": request.form['name'],
                "nickname": request.form['nickname'],
                "password": request.form['password'],
                "email": request.form['email'],
                "gender": request.form['gender'],
                "phnumber": request.form['phnumber'],
            }

            query = """
            INSERT INTO users (id, name, nickname, password, email, gender, phnumber)
            VALUES (%(username)s, %(name)s, %(nickname)s, %(password)s, %(email)s, %(gender)s, %(phnumber)s)
            """
        
        cursor = mysql.connection.cursor()
        cursor.execute(query, details)
        mysql.connection.commit()
        cursor.close()

        return redirect('/login.html')

    return render_template('signup.html')



# 사업자 번호 확인
@app.route('/check_business_number')
def check_business_number():
    number = request.args.get('number')
    
    # TODO: API를 사용하여 사업자 등록 번호 확인
    # 예시:
    # response = requests.get(f"https://api.example.com/check?number={number}")
    # if response.json()['exists']:
    #     return jsonify({'message': '사업자 등록 번호가 유효합니다.'})
    
    # 아래는 임시 응답입니다.
    return jsonify({'message': '사업자 등록 번호 확인이 필요합니다.'})



# 즐겨찾기
@app.route('/favorites.html')
def favorites():
    if 'loggedin' in session and session['loggedin']:
        nickname = session['nickname']
        return render_template('favorite.html', nickname=nickname)
    else:
        return redirect('/login.html')



# 스타일러 인포
@app.route('/info.html')
def info():
    nickname = session.get('nickname', None)
    user_id = session.get('id', None)
    business_registration_number = session.get('business_registration_number')
    company_name = session.get('company_name')
    return render_template('info.html', nickname=nickname, user_id=user_id, business_registration_number=business_registration_number, company_name=company_name)



# 스타일러 인포 저장
@app.route('/info-profile', methods=['POST'])
def info_profile():
    # 세션에서 사용자 ID, 사업자 번호, 회사 이름 가져오기
    user_id = session.get('id')
    business_registration_number = session.get('business_registration_number')
    company_name = session.get('company_name')  # 기본값 설정

    # 파일 저장 및 파일명 생성 로직
    cover_image = request.files.get('cover_image')
    profile_image = request.files.get('profile_image')

    if cover_image:
        cover_filename = secure_filename(f'cover{user_id}.png')
        cover_image.save(os.path.join('uploads', cover_filename))


    if profile_image:
        profile_filename = secure_filename(f'profile{user_id}.png')
        profile_image.save(os.path.join('uploads', profile_filename))


    # 나머지 데이터
    info = request.form.get('info', '')
    hours = request.form.get('hours', '')
    menu = request.form.get('menu', '')
    designer = request.form.get('designer', '')

    # 데이터베이스에 저장
    cursor = mysql.connection.cursor()
    sql = """
        INSERT INTO profiles (id, business_registration_number, company_name, cover, profile, info, hours, menu, designer)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE
        company_name = VALUES(company_name), cover = VALUES(cover), profile = VALUES(profile), info = VALUES(info), hours = VALUES(hours), menu = VALUES(menu), designer = VALUES(designer)
    """
    cursor.execute(sql, (user_id, business_registration_number, company_name, cover_filename, profile_filename, info, hours, menu, designer))
    mysql.connection.commit()
    cursor.close()

    return redirect(url_for('main.html'))



# 정보 보기
@app.route('/pr2.html')
def pr2():
    user_id = session.get('id')  # 현재 로그인된 사용자 ID
    nickname = session.get('nickname', None)
    company_name = session.get('company_name')
    business_registration_number = request.args.get('brn')

    # 데이터베이스에서 프로필 정보 검색
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    if business_registration_number:
        cursor.execute('SELECT * FROM profiles WHERE business_registration_number = %s', [business_registration_number])
    else:
        cursor.execute('SELECT * FROM profiles WHERE id = %s', [user_id])

    profile = cursor.fetchone()
    cursor.close()

    if not profile:
        profile = {}  # 프로필 정보가 없는 경우 빈 딕셔너리 사용

    # cover와 profile 이미지 경로 설정 (프로필이 존재하는 경우에만 실행)
    if profile:
        profile['cover_path'] = f'uploads/cover{user_id}.png' if profile.get('cover') else 'default_cover.png'
        profile['profile_path'] = f'uploads/profile{user_id}.png' if profile.get('profile') else 'default_profile.png'

    # pr2.html 페이지로 프로필 정보 전달
    return render_template('pr2.html', profile=profile, nickname=nickname)






def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS



def convert_and_save(b64_string):
    # b64_string을 Image 객체로 변환
    decoded_img = base64.b64decode(b64_string.split(",")[1])
    img = Image.open(BytesIO(decoded_img))

    # 중복을 피하기 위해 number를 사용하여 이미지 이름 생성
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT IFNULL(MAX(number), 0) + 1 AS next_num FROM images")
    next_num = cursor.fetchone()["next_num"]
    new_filename = os.path.join(app.config['UPLOAD_FOLDER'], str(next_num) + ".png")
    img.save(new_filename)

    return new_filename



# 업로드 라우터
@app.route('/upload', methods=['POST'])
def upload_file():
    # 파일 존재 여부 검사
    if 'file' not in request.files:
        flash('No file part')
        return redirect(request.url)
    
    file = request.files['file']

    # 사용자가 파일을 선택하지 않고 버튼을 클릭한 경우
    if file.filename == '':
        flash('No selected file')
        return redirect(request.url)

    user_id = session.get("id")
    business_reg_num = session.get("business_registration_number", "1234567890")

    # canvas 데이터와 스타일 가져오기
    canvas_data = request.form.get('filename')
    style = request.form.get('style')  # 스타일 데이터를 폼에서 가져옴

    if canvas_data and style:  # 스타일 데이터도 유효성 검사
        new_filename = convert_and_save(canvas_data)
        new_filename = new_filename.replace("uploads\\", "")

        # DB에 이미지 정보 삽입
        img_insert_query = """
        INSERT INTO images (filename, id, business_registration_number, style)
        VALUES (%s, %s, %s, %s)
        """
        cursor = mysql.connection.cursor()
        cursor.execute(img_insert_query, (new_filename, user_id, business_reg_num, style))
        mysql.connection.commit()
        cursor.close()

        flash('Image successfully uploaded and stored with style!')
        return redirect(url_for('index'))  # or any route you prefer
    else:
        flash('Allowed image types are -> png, jpg, jpeg, gif, and style is required')
        return redirect(request.url)



# 이미지 업로드 
@app.route('/filter.html')
def filter_page():
    nickname = session.get('nickname', None)
    user_id = session.get('id', None)
    business_registration_number = session.get('business_registration_number', None)

    return render_template('filter.html', nickname=nickname, user_id=user_id, business_registration_number=business_registration_number)



# 이미지 합성
@app.route('/image.html', methods=['GET'])
def image():
    nickname = session.get('nickname', None)
    user_id = session.get('id', None)
    business_registration_number = session.get('business_registration_number', None)

    return render_template('image.html', nickname=nickname, user_id=user_id, business_registration_number=business_registration_number)



# 다른 폴더에서 이미지를 제공하기 위한 라우트
@app.route('/uploads/<filename>')
def get_image(filename):
    return send_from_directory('uploads', filename)



# 이미지 정보를 가져오는 라우트
@app.route('/get-images', methods=['GET'])
def get_images():
    page = request.args.get('page', 1, type=int)  # 페이지 번호를 가져옵니다.
    limit = 5
    offset = (page - 1) * limit

    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    try:
        cursor.execute("SELECT * FROM images LIMIT %s OFFSET %s", (limit, offset))
        results = cursor.fetchall()
    except Exception as e:
        print(f"An error occurred: {e}")
        cursor.close()
        return jsonify({'error': str(e)}), 500

    cursor.close()

    if not results:
        return jsonify([])  # 빈 배열 반환

    images = [{'number': row['number'], 'filename': row['filename'], 'id': row['id'], 'business_registration_number': row['business_registration_number'], 'style': row['style']} for row in results]

    return jsonify(images)



# 퍼스널컬러 업로드화면
@app.route('/personal.html')
def personal():
    nickname = session.get('nickname', None)
    user_id = session.get("user_id")
    return render_template('personal.html', nickname=nickname, user_id=user_id)



# 퍼스널컬러 데이터베이스 저장
@app.route('/personal', methods=['POST'])
def upload_personal_file():
    try:
        if 'uploadedFile' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['uploadedFile']
        if file.filename == '' or not allowed_file(file.filename):
            flash('No selected file or file type not allowed')
            return redirect(request.url)

        # 파일명 생성
        cursor = mysql.connection.cursor()
        try:
            cursor.execute("SELECT MAX(number) AS max_number FROM personal")
            result = cursor.fetchone()
        except Exception as e:
            print("Database query error (SELECT MAX):", e)
            traceback.print_exc()
            raise

        max_number = 0 if not result or result['max_number'] is None else result['max_number']

        new_filename = f"p{max_number + 1}.png"

        try:
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], new_filename))
        except Exception as e:
            print("File save error:", e)
            traceback.print_exc()
            raise

        # 데이터베이스에 저장
        user_id = session.get('id')  # 'user_id' 대신 'id'를 사용
        if not user_id:
            raise Exception("User ID not found in session")

        try:
            cursor.execute("INSERT INTO personal (psfilename, id) VALUES (%s, %s)", (new_filename, user_id))
            mysql.connection.commit()
        except Exception as e:
            print("Database insert error:", e)
            traceback.print_exc()
            raise
        flash('File uploaded successfully')
        return redirect(url_for('result'))
    except Exception as e:
        print(f"An error occurred: {e}")
        traceback.print_exc()
        return "An error occurred during file upload"

        

# 업로드 파일 권한
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)



# 염색 색상 정보를 담은 딕셔너리
hair_color_info = {
    "골든 브라운": {
        "description": "풍부한 골든 브라운 컬러는 당신의 쿨톤에 어울려 멋진 자연스러운 룩을 연출해줄 것입니다!",
        "css_color": "#996515"
    },
    "플러미 레드": {
        "description": "화사한 플러미 레드는 당신의 웜톤에 어울려 화사한 분위기를 연출해줄 것입니다!",
        "css_color": "#C71585"
    },
    "펄 그레이": {
        "description": "고급스러운 펄 그레이는 당신의 중립톤에 어울려 세련된 분위기를 연출해줄 것입니다!",
        "css_color": "#CECECE"
    },
    "로즈 블론드": {
        "description": "로맨틱한 로즈 블론드는 당신의 쿨톤에 어울려 사랑스러운 분위기를 연출해줄 것입니다!",
        "css_color": "#F7CAC9"
    },
    "아이스 블루": {
        "description": "시원한 아이스 블루는 당신의 웜톤에 어울려 시원한 분위기를 연출해줄 것입니다!",
        "css_color": "#AFDCEC"
    },
    "에메랄드 그린": {
        "description": "생기 있는 에메랄드 그린은 당신의 중립톤에 어울려 자연스러우면서도 독특한 룩을 만들어줄 것입니다!",
        "css_color": "#50C878"
    },
    "버건디 와인": {
        "description": "깊고 풍부한 버건디 와인은 당신의 쿨톤에 어울려 우아하고 고급스러운 분위기를 연출해줄 것입니다!",
        "css_color": "#800020"
    },
    "썬셋 오렌지": {
        "description": "밝고 생동감 넘치는 썬셋 오렌지는 당신의 웜톤에 어울려 활기찬 분위기를 연출해줄 것입니다!",
        "css_color": "#FF5733"
    },
    "스카이 블루": {
        "description": "맑고 투명한 스카이 블루는 당신의 중립톤에 어울려 상쾌한 느낌을 줄 것입니다!",
        "css_color": "#87CEEB"
    },
    "미드나잇 블랙": {
        "description": "강렬한 미드나잇 블랙은 당신의 쿨톤에 어울려 시크하고 세련된 룩을 연출해줄 것입니다!",
        "css_color": "#2C3539"
    },
    "자수정 퍼플": {
        "description": "매혹적인 자수정 퍼플은 당신의 쿨톤에 어울려 고급스러운 느낌을 줄 것입니다!",
        "css_color": "#5a507c"
    },
    "산호 핑크": {
        "description": "부드러운 산호 핑크는 당신의 웜톤에 어울려 사랑스러운 룩을 연출해줄 것입니다!",
        "css_color": "#FF6F61"
    },
    "민트 그린": {
        "description": "시원한 민트 그린은 당신의 중립톤에 어울려 청량감을 줄 것입니다!",
        "css_color": "#98FF98"
    },
    "네이비 블루": {
        "description": "깊은 네이비 블루는 당신의 쿨톤에 어울려 신뢰감 있는 스타일을 만들어줄 것입니다!",
        "css_color": "#000080"
    },
    "코랄 오렌지": {
        "description": "생기 넘치는 코랄 오렌지는 당신의 웜톤에 어울려 활력 있는 분위기를 줄 것입니다!",
        "css_color": "#FF7F50"
    },
    "모카 브라운": {
        "description": "따뜻한 모카 브라운은 당신의 중립톤에 어울려 안정감 있는 룩을 연출해줄 것입니다!",
        "css_color": "#7B3F00"
    },
    "루비 레드": {
        "description": "강렬한 루비 레드는 당신의 쿨톤에 어울려 열정적인 분위기를 만들어줄 것입니다!",
        "css_color": "#9B111E"
    },
    "피치 베이지": {
        "description": "부드러운 피치 베이지는 당신의 웜톤에 어울려 자연스러운 아름다움을 줄 것입니다!",
        "css_color": "#FFDAB9"
    },
    "스틸 그레이": {
        "description": "시크한 스틸 그레이는 당신의 중립톤에 어울려 현대적인 느낌을 줄 것입니다!",
        "css_color": "#71797E"
    },
    "마호가니 브라운": {
        "description": "진한 마호가니 브라운은 당신의 쿨톤에 어울려 강렬하고 깊은 인상을 줄 것입니다!",
        "css_color": "#420D09"
    },
    "올리브 그린": {
        "description": "자연스러운 올리브 그린은 당신의 웜톤에 어울려 평온한 분위기를 줄 것입니다!",
        "css_color": "#808000"
    },
    "블러쉬 핑크": {
        "description": "섬세한 블러쉬 핑크는 당신의 중립톤에 어울려 여성스러운 느낌을 줄 것입니다!",
        "css_color": "#FF6A6A"
    },
    "차콜 그레이": {
        "description": "강렬한 차콜 그레이는 당신의 쿨톤에 어울려 심플하면서도 강한 인상을 줄 것입니다!",
        "css_color": "#36454F"
    },
    "캐러멜 브라운": {
        "description": "달콤한 캐러멜 브라운은 당신의 웜톤에 어울려 따뜻하고 친근한 느낌을 줄 것입니다!",
        "css_color": "#AF6E4D"
    },
    "라벤더 퍼플": {
        "description": "꿈같은 라벤더 퍼플은 당신의 중립톤에 어울려 신비롭고 부드러운 분위기를 줄 것입니다!",
        "css_color": "#E6E6FA"
    },
    "진저 옐로우": {
        "description": "생동감 있는 진저 옐로우는 당신의 웜톤에 어울려 활기찬 분위기를 줄 것입니다!",
        "css_color": "#FFD700"
    },
    "스카이 블루": {
        "description": "맑고 투명한 스카이 블루는 당신의 중립톤에 어울려 상쾌한 느낌을 줄 것입니다!",
        "css_color": "#87CEEB"
    },
    "자정 블루": {
        "description": "깊고 신비로운 자정 블루는 당신의 쿨톤에 어울려 고급스러운 느낌을 줄 것입니다!",
        "css_color": "#003366"
    },
    "써니 옐로우": {
        "description": "밝고 쾌청한 써니 옐로우는 당신의 웜톤에 어울려 긍정적인 에너지를 줄 것입니다!",
        "css_color": "#FFF700"
    },
    "빈티지 로즈": {
        "description": "고전적인 빈티지 로즈는 당신의 중립톤에 어울려 우아하고 고상한 분위기를 줄 것입니다!",
        "css_color": "#C08081"
    },
}



# 퍼스널 컬러 톤별 색상 추천
def recommend_colors_based_on_tone(personal_color_tone, hair_color_info):
    suitable_colors = {
        color: info for color, info in hair_color_info.items() if personal_color_tone in info['description']
    }
    selected_colors = random.sample(list(suitable_colors.items()), min(4, len(suitable_colors)))
    return selected_colors



# 퍼스널컬러 결과화면
@app.route('/result.html')
def result():
    nickname = session.get('nickname', None)
    user_id = session.get('id')
    if not user_id:
        return redirect(url_for('login'))

    cursor = mysql.connection.cursor()
    try:
        cursor.execute("SELECT psfilename FROM personal WHERE id = %s ORDER BY number DESC LIMIT 1", (user_id,))
        result = cursor.fetchone()
        if result:
            image_filename = result['psfilename']
            image_path = os.path.join(app.config['UPLOAD_FOLDER'], image_filename)
            absolute_image_path = os.path.abspath(image_path)
            src_folder_path = 'src'

            try:
                process = subprocess.Popen(
                    ['python', 'personal.py', '--image', absolute_image_path],
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    cwd=src_folder_path
                )
                stdout, stderr = process.communicate()

                try:
                    analysis_result = stdout.decode('utf-8').strip()
                except UnicodeDecodeError:
                    analysis_result = stdout.decode('cp949').strip()

                if process.returncode != 0:
                    try:
                        error_message = stderr.decode('utf-8')
                    except UnicodeDecodeError:
                        error_message = stderr.decode('cp949')

                    print("Error during script execution:", error_message)
                    return f"An error occurred in analysis: {error_message}"

                lab_b_values = re.findall(r'Lab_b\[[^\]]+\] \[([^\]]+)\]', analysis_result)
                hsv_s_values = re.findall(r'hsv_s\[[^\]]+\] \[([^\]]+)\]', analysis_result)
                lab_b_numbers = [float(num) for num in lab_b_values[0].split(', ')] if lab_b_values else []
                hsv_s_numbers = [float(num) for num in hsv_s_values[0].split(', ')] if hsv_s_values else []
                graph_data = {
                    'Lab_b': lab_b_numbers,
                    'Hsv_s': hsv_s_numbers
                }

                personal_color_match = re.search(r'([가-힣]+)\((\w+)\)입니다\.', analysis_result)
                personal_color = personal_color_match.group(0) if personal_color_match else "퍼스널 컬러 정보를 찾을 수 없습니다."

                if personal_color:
                    personal_color_tone = "쿨톤" if "쿨톤" in personal_color else "웜톤" if "웜톤" in personal_color else "중립톤"
                    recommended_colors = recommend_colors_based_on_tone(personal_color_tone, hair_color_info)

            except Exception as e:
                print("Exception during script execution:", e)
                return f"An exception occurred: {e}"

        else:
            image_filename = None
            analysis_result = None
            graph_data = None
            personal_color = None
            recommended_colors = []

    except Exception as e:
        print("Database query error:", e)
        traceback.print_exc()
        return "An error occurred while retrieving the image file"

    return render_template('result.html', image_filename=image_filename, nickname=nickname, user_id=user_id, analysis_result=analysis_result, graph_data=graph_data, personal_color=personal_color, recommended_colors=recommended_colors)



# 리뷰 목록 조회
@app.route('/reviews.html')
def get_reviews():
    cursor = mysql.connection.cursor()
    cursor.execute('SELECT * FROM reviews')
    reviews = cursor.fetchall()
    cursor.close()
    return render_template('reviews.html', reviews=reviews)



# 리뷰 추가
@app.route('/add_review', methods=['POST'])
def add_review():
    title = request.form['title']
    content = request.form['content']
    cursor = mysql.connection.cursor()
    cursor.execute('INSERT INTO reviews (title, content) VALUES (%s, %s)', (title, content))
    mysql.connection.commit()
    cursor.close()
    return redirect('/reviews.html')



# 리뷰 페이지 표시
@app.route('/review.html')
def show_review_page():
    return render_template('review.html')



# 리뷰 수정
@app.route('/edit_review/<int:review_id>')
def edit_review(review_id):
    cursor = mysql.connection.cursor()
    cursor.execute('SELECT * FROM reviews WHERE num = %s', (review_id,))
    review = cursor.fetchone()
    cursor.close()
    return render_template('edit_review.html', review=review)



# 수정 처리 라우트
@app.route('/update_review/<int:review_id>', methods=['POST'])
def update_review(review_id):
    title = request.form['title']
    content = request.form['content']
    cursor = mysql.connection.cursor()
    cursor.execute('UPDATE reviews SET title = %s, content = %s WHERE num = %s', (title, content, review_id))
    mysql.connection.commit()
    cursor.close()
    return redirect('/reviews.html')



# 리뷰 삭제
@app.route('/delete_review/<int:review_id>')
def delete_review(review_id):
    cursor = mysql.connection.cursor()
    cursor.execute('DELETE FROM reviews WHERE num = %s', (review_id,))
    mysql.connection.commit()
    cursor.close()
    return redirect('/reviews.html')



# map에서 사업자 번호 읽기
@app.route('/get-business-info', methods=['GET'])
def get_business_info():
    business_registration_number = request.args.get('business_registration_number')

    # 데이터베이스에서 정보 조회
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute('SELECT * FROM profiles WHERE business_registration_number = %s', [business_registration_number])
    profile = cursor.fetchone()
    cursor.close()

    if profile:
        # JSON 형식으로 데이터 전송
        return jsonify(profile)
    else:
        return jsonify({'error': '해당 사업자 번호에 대한 프로필 정보를 찾을 수 없습니다.'}), 404



# 서브페이지
@app.route('/sub.html')
def sub():
    nickname = session.get('nickname', None)
    return render_template('sub.html', nickname=nickname)



# Expo Go 최신화
@app.route('/qr.html')
def qr():
    return render_template('qr.html')


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
