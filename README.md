# Golfnono 골프노노 🏌️

대한민국 골프장 실시간 날씨 + 맛집 정보 웹 서비스

## 로컬에서 바로 열기

`index.html` 파일을 브라우저로 드래그&드롭 → 즉시 실행 (Mock 데이터로 동작)

## Vercel 배포 방법

1. GitHub에서 새 저장소 생성 (이름: `golfnono`)
2. 이 폴더의 파일을 전부 push
3. [vercel.com](https://vercel.com) 접속 → Add New Project → 저장소 선택
4. Deploy 클릭 → 완료 (`golfnono.vercel.app` 형태로 주소 생성)

## 환경변수 (실제 API 연동 시 Vercel 대시보드에서 추가)

| 변수명 | 설명 |
|---|---|
| `CCTV_API_KEY` | 공공데이터포털 도로 CCTV API 키 |
| `TMAP_API_KEY` | SKT T-map API 키 |
| `WEATHER_API_KEY` | OpenWeatherMap API 키 |

## 실제 API 교체 포인트

| 기능 | 교체 위치 | API |
|---|---|---|
| 골프장 목록 | `api/courses.js` 상단 주석 | 공공데이터포털 골프장 API |
| CCTV 영상 | `api/courses.js` 각 골프장 `cctvUrl` | 공공데이터포털 도로 CCTV API |
| 날씨 | `api/courses.js` 각 골프장 `weather` | OpenWeatherMap / 기상청 API |
| 맛집 | `api/courses.js` 각 골프장 `restaurants` | T-map POI 검색 API |
| 지도 | `index.html` Leaflet 초기화 주석 | 카카오맵 JavaScript API |

## 파일 구조

```
Golfnono/
├── index.html      # 앱 전체 (HTML + CSS + JS)
├── api/
│   └── courses.js  # Vercel 서버리스 함수 (골프장 데이터)
├── vercel.json     # Vercel 배포 설정
└── README.md
```
