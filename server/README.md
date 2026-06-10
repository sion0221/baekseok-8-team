# Kickboard AI Server

불법 주정차 킥보드 신고 웹의 **AI 판별 서버**입니다.
신고 사진을 받아 YOLO 모델(`best-1.pt`)로 킥보드 여부를 판별하고,
판별 결과(킥보드 유무 · 신뢰도 · 박스 표시 이미지)를 프론트엔드에 돌려줍니다.

프론트엔드(Next.js, Vercel 배포)는 신고 제출 시 이 서버를 호출해
**킥보드가 인식되면 "접수", 아니면 "반려"** 로 자동 처리합니다.

---

## 폴더 구성

```
Kickboard_Server/
├── app.py              # Flask 서버 (/classify 엔드포인트)
├── best-1.pt           # 학습된 YOLO 모델 (약 24MB)
├── requirements.txt    # Python 의존성
├── test.jpg            # 테스트용 사진
├── test_client.py      # 서버 단독 동작 확인 스크립트
├── ngrok.exe           # 외부 공개용 터널 (배포 데모 시 사용)
└── README.md
```

> `best-1.pt`는 용량이 커서 git에 직접 올리면 무겁습니다.
> 별도 공유(드라이브 등)하거나 Git LFS 사용을 권장합니다.

---

## 1. 설치 (최초 1회)

Python 3.10 ~ 3.14 권장.

```bash
cd Kickboard_Server
pip install -r requirements.txt
```

`requirements.txt` 내용: `flask`, `flask-cors`, `ultralytics`, `pillow`
(ultralytics 설치 시 torch가 함께 깔려서 첫 설치는 몇 분 걸립니다.)

---

## 2. 서버 실행

```bash
python app.py
```

아래가 뜨면 정상이며, 이 터미널은 켜둬야 합니다.

```
* Running on http://127.0.0.1:5000
```

---

## 3. 단독 동작 확인

서버를 켜둔 채 **새 터미널**에서:

```bash
python test_client.py
```

`test.jpg`를 서버로 보내고 결과를 출력합니다. 아래처럼 나오면 정상입니다.

```
서버로 사진을 보냅니다...
[테스트 성공! 서버 응답]
킥보드 여부: True
확신도: XX%
✅ 테두리가 쳐진 결과 사진이 'result_boxed.jpg'로 저장되었습니다!
```

---

## 4. API 명세

### POST `/classify`

- 요청: `multipart/form-data`, 필드명 `file` (이미지 파일)
- 응답(JSON):

```json
{
  "is_kickboard": true,
  "confidence": 84.7,
  "message": "킥보드 발견",
  "result_image": "<base64 JPEG, 박스 표시본>"
}
```

킥보드가 없으면 `is_kickboard: false`, `confidence: 0`, `result_image: null`.

### 인식 기준(신뢰도) 조절

`app.py`의 아래 부분 `conf` 값으로 민감도를 조절합니다.

```python
results = model.predict(source=image, conf=0.2, iou=0.45, verbose=False)
```

- 값이 **낮을수록** 약한 탐지도 킥보드로 인정 → 오탐(잘못 잡음) 증가
- 값이 **높을수록** 확실한 것만 인정 → 미탐(놓침) 증가
- 현재 `0.2`. 오탐이 보이면 0.3~0.5로 올리세요.
- **값을 바꾸면 서버를 재시작**해야 적용됩니다(Ctrl+C → `python app.py`).

---

## 5. 배포 환경 연동 (Vercel + ngrok)

Vercel에 배포된 사이트는 사용자 브라우저에서 동작하므로 `localhost:5000`
(서버 PC)에 직접 닿지 못합니다. 발표/데모 시 **ngrok**으로 이 서버에
임시 공개 주소를 부여합니다.

### 준비 (최초 1회)
1. https://ngrok.com 가입 → authtoken 발급
2. 토큰 등록:
   ```bash
   .\ngrok.exe config add-authtoken 발급받은_토큰
   ```

### 실행
AI 서버(`python app.py`)를 켜둔 상태에서 **새 터미널**:

```bash
.\ngrok.exe http 5000
```

출력된 주소를 복사합니다.

```
Forwarding  https://xxxx-xx-xx.ngrok-free.app -> http://localhost:5000
```

> `http 5000`의 `5000`은 이 노트북 AI 서버의 포트입니다(Vercel 주소 아님).

### Vercel 환경변수 등록 (프로젝트 관리자)
1. Vercel → 프로젝트 → Settings → Environment Variables
2. `NEXT_PUBLIC_AI_SERVER_URL` = `https://xxxx-xx-xx.ngrok-free.app` (끝의 `/` 제외)
3. 저장 후 Deployments에서 Redeploy (환경변수는 재배포해야 반영)

프론트 코드(`src/lib/ai.js`)는 이 환경변수를 읽고, 없으면 `http://localhost:5000`을
기본값으로 사용합니다.

---

## 6. 동작 흐름 요약

```
[폰/PC] → Vercel 사이트 → ngrok 공개주소 → (인터넷) → 노트북 ngrok → localhost:5000 AI서버
```

데모 중에는 노트북에서 **AI 서버 + ngrok 두 터미널을 모두 켜두어야** 합니다.
둘 중 하나라도 끄면 판별이 멈춥니다.

---

## 주의사항

- **무료 ngrok은 껐다 켜면 공개 주소가 매번 바뀝니다.** 발표 직전에 켜고,
  그 주소를 Vercel에 등록·재배포한 뒤, 발표가 끝날 때까지 끄지 마세요.
- 폰은 노트북과 같은 와이파이일 필요 없습니다(인터넷 경유).
- CORS는 서버에서 이미 허용(`CORS(app)`)되어 있어 브라우저에서 바로 호출됩니다.
- 이 서버는 개발용(Flask 내장 서버)입니다. 실서비스 배포 시에는 별도 WSGI 서버가 필요합니다.
