# AI운영지원팀 협업요청 랜딩페이지

기획서: `../AI운영지원팀_랜딩페이지_기획서.md`

## 로컬 실행

```bash
npm install
npm run dev      # http://localhost:5173
```

로컬에서는 메일 발송 서버 함수(`api/request.js`)가 돌지 않으므로 요청서를 보내면 "전송 실패 → 내용 복사·연락처 안내" 화면이 뜬다 (정상).

## 문구·이미지 수정

- 모든 문구: `src/lib/content.js`
- 결과물 화면: `public/images/case-*.webp` (직원 이름 흐림 처리됨)
- 협업 절차 이미지: AI 이미지를 `public/images/`에 넣고 `content.js`의 `PROCESS` 항목에 `img: '/images/파일명'` 추가

## 배포 (Vercel)

1. 이 `landing` 폴더를 GitHub 저장소로 올리거나 `npx vercel` 로 배포
2. Vercel 프로젝트 > Settings > Environment Variables 에 `.env.example`의 4개 값 입력
   - `NHN_EMAIL_APP_KEY`, `NHN_EMAIL_SECRET_KEY`: NHN Cloud 콘솔 > Notification > Email 에서 확인
   - `NHN_EMAIL_SENDER`: 발신 주소
   - `REQUEST_MAIL_TO`: lyk621@sdm.go.kr
3. 재배포 후 요청서를 한 번 보내 수신(스팸 차단 여부) 확인
