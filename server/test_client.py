import requests
import base64

url = 'http://127.0.0.1:5000/classify'
image_path = 'test.jpg'

print("서버로 사진을 보냅니다...")

try:
    with open(image_path, 'rb') as img_file:
        files = {'file': img_file}
        response = requests.post(url, files=files)

    if response.status_code == 200:
        result = response.json()
        print("\n[테스트 성공! 서버 응답]")
        print(f"킥보드 여부: {result['is_kickboard']}")
        print(f"확신도: {result['confidence']}%")
        
        # 서버가 사진 데이터를 보내줬다면, 다시 사진 파일로 만들어서 저장
        if result.get('result_image'):
            image_data = base64.b64decode(result['result_image'])
            with open('result_boxed.jpg', 'wb') as f:
                f.write(image_data)
            print("✅ 테두리가 쳐진 결과 사진이 'result_boxed.jpg'로 저장되었습니다!")
    else:
        print(f"에러: {response.text}")
except FileNotFoundError:
    print(f"'{image_path}' 사진 파일을 찾을 수 없습니다.")