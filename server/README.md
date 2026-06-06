# AI 백엔드 서버 구동 가이드 (Back-End)

본 가이드는 프로젝트를 처음 다운로드(`pull`)받은 후, 로컬 환경에서 AI 킥보드 인식 서버를 구축하고 실행하는 방법을 안내합니다.

본 서버를 구동하기 위해서는 컴퓨터에 **파이썬(Python)**이 반드시 설치되어 있어야 합니다!

파이썬 설치 여부 및 버전 확인을 확인해본 후,  
설치가 되어있지 않다면 설치를 진행하고 서버를 구동시켜야 함
```bash
python --version
```

## 프로젝트 폴더구조 (server)
```
project-8/
└── server/                  # 백엔드 (Python AI 서버 폴더)
    ├── app.py               # 메인 Flask 웹 서버 파일 (실행 파일)
    ├── test_client.py       # AI 인식 기능을 가상으로 테스트하는 클라이언트 파일
    ├── requirements.txt     # 프로젝트에 사용된 파이썬 라이브러리 목록 명세서
    ├── .gitignore          
    │
    │  /* ⚠️ 아래 파일들은 대용량 및 로컬 전용이므로 Git(깃허브)에 올라가지 않습니다 */
    ├── best-1.pt            # YOLOv8 기반 AI 킥보드 인식 가중치 모델 파일 (수동 배치 필요)
    ├── test.jpg             # 인식 테스트용 원본 이미지 파일 (수동 배치 필요)
    ├── result_boxed.jpg     # 테스트 완료 후 AI가 사각형 박스를 쳐서 새로 생성한 결과 이미지
    └── venv/                # 파이썬 가상환경 폴더 (최초 구동 시 명령어에 의해 자동 생성)
```

> ⚠️ **필독 사항:** 인공지능 가중치 모델 파일과 테스트 이미지는 대용량 파일인 관계로 깃허브 업로드 대상에서 제외하였으므로 서버를 구동하기 전, 해당 파일들을 다운로드하여 `server` 폴더 내부에 반드시 직접 배치해야 함
---

### 1. 최초 구동 방법 (환경 세팅 및 서버 실행)
프로젝트를 처음 다운로드받았을 때 딱 한 번만 수행하는 전체 과정입니다.  
본인의 터미널 환경에 맞는 명령어를 입력해 주세요.

#### Windows (Git Bash / VS Code 기본 터미널) 사용자
```bash
cd server
python -m venv venv
source venv/Scripts/activate
pip install --upgrade pip
pip install -r requirements.txt
python app.py
```

#### macOS / Linux 사용자
```bash
cd server
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
python app.py
```

---

### 2. 이후 구동 방법 (서버 실행)

#### Windows 사용자
```bash
cd server
source venv/Scripts/activate  # CMD 창일 경우: venv\Scripts\activate
python app.py
```

#### macOS / Linux 사용자
```bash
cd server
source venv/bin/activate
python app.py
```
---
### 3. AI 기능 로컬 테스트 방법 (선택 사항)

서버가 켜져 있는 상태에서, 실제로 AI 모델이 이미지(test.jpg)를 분석하고 결과물을 잘 만들어내는지 가상으로 테스트해보는 방법입니다.

> ⚠️ **주의:** 반드시 위의 가이드대로 **서버가 구동 중인 터미널 창을 그대로 켜두신 상태**에서, VS Code의 `+` 버튼을 눌러 **새 터미널 창을 하나 더 열고** 아래 명령어를 실행해야함

#### Windows (Git Bash / VS Code 기본 터미널) 사용자
```bash
cd server
source venv/Scripts/activate
python test_client.py
```

#### Windows (기본 명령 프롬프트 / CMD) 사용자
```bash
cd server
venv\Scripts\activate
python test_client.py
```

#### macOS / Linux 사용자
```bash
cd server
source venv/bin/activate
python test_client.py
```

