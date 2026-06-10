from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
from PIL import Image
import io
import base64

app = Flask(__name__)
CORS(app) 

model = YOLO("best-1.pt")

@app.route('/classify', methods=['POST'])
def classify_image():
    if 'file' not in request.files:
        return jsonify({'error': '사진 파일이 없습니다.'}), 400
        
    try:
        file = request.files['file']
        image_bytes = file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        
        results = model.predict(source=image, conf=0.4, iou=0.45, verbose=False)
        is_kickboard = len(results[0].boxes) > 0
        
        confidence = 0.0
        encoded_image = None
        
        if is_kickboard:
            confidence = round(float(results[0].boxes[0].conf.item()) * 100, 1)
            
            # 💡 [핵심] 테두리가 쳐진 사진을 만들고 텍스트(Base64)로 변환
            im_array = results[0].plot() 
            result_image = Image.fromarray(im_array[..., ::-1]) # 색상 보정
            
            buffered = io.BytesIO()
            result_image.save(buffered, format="JPEG")
            encoded_image = base64.b64encode(buffered.getvalue()).decode('utf-8')
            
        return jsonify({
            'is_kickboard': is_kickboard,
            'confidence': confidence,
            'message': '킥보드 발견' if is_kickboard else '킥보드 없음',
            'result_image': encoded_image  # 프론트엔드로 사진 데이터 전송!
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)