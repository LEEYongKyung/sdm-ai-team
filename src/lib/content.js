// 페이지 문구는 모두 여기서 관리한다 (기획서: ../AI운영지원팀_랜딩페이지_기획서.md)

// 배포 경로(GitHub Pages는 /저장소이름/)에 맞춘 이미지 주소
export const img = name => `${import.meta.env.BASE_URL}images/${name}`;

export const TEAM = {
  dept: '스마트정보과',
  name: 'AI운영지원팀',
  phone: '02-330-1898',
  mail: 'lyk621@sdm.go.kr'
};

export const HERO = {
  title: '생각만 하던 AI, 같이 만들어요',
  side: ['구청 안의 AI 파트너', '간단한 것도 편하게 요청하세요']
};

export const MARQUEE_IMAGES = [
  img('case-shade.webp'),
  img('case-duty.webp'),
  img('case-nursery.webp'),
  img('case-audit.webp'),
  img('case-duty2.webp')
];

export const CASES = [
  {
    title: '당직근무(조) 자동 편성',
    dept: '행정지원과',
    tags: '반복 업무 자동화',
    before: '담당자 경험에 의존한 엑셀 수기 편성',
    after: '제약조건을 구조화해 근무(조)를 자동 편성',
    metric: { from: '1시간', to: '4초', label: '편성 처리시간' },
    note: '업무 표준화',
    img: img('case-duty2.webp')
  },
  {
    title: '보육교직원 임면서류 자동 검토',
    dept: '가족정책과',
    tags: '반복 업무 자동화',
    before: '연 2,349명분 서류를 담당자가 수기 검토',
    after: '서류 자동 분류·검토, 문제 항목 알림',
    metric: { from: null, to: '20초', label: '파일 1건당 검토시간' },
    note: '검토 기준 일관성 확보',
    img: img('case-nursery.webp')
  },
  {
    title: '그늘막 설치 위치 선정',
    dept: '재난안전과',
    tags: 'AI 시범 서비스',
    before: '민원·현장 방문 중심의 위치 결정',
    after: '공공데이터 연계, 평가항목 점수화로 우선순위 제시',
    metric: { from: '7일', to: '3일', label: '위치 결정 처리기간' },
    note: '데이터 기반 의사결정',
    img: img('case-shade.webp')
  },
  {
    title: '감사사례 업무 도우미',
    dept: '감사담당관',
    tags: '매뉴얼 기반 업무 도우미',
    before: '업무 전 유사 감사사례·관계법령을 직접 찾아 확인',
    after: '진행할 업무를 설명하면 관련 감사사례와 관계법령을 함께 확인',
    metric: null,
    note: '직원용 업무 도우미 운영',
    img: img('case-audit.webp')
  }
];

export const CASE_FACTS = ['비예산 추진', '팀장 직접 개발', '인터넷 연결 없이 구동해 정보 유출 차단'];

export const WHY = [
  {
    icon: 'compass',
    title: 'AI 사업 기획 지원',
    desc: '아이디어 단계의 AI 사업을 함께 구체화합니다. 적용 가능성 검토부터 범위 설정, 추진 방식까지 정리해 드립니다.'
  },
  {
    icon: 'cpu',
    title: 'AI 모델 및 서비스 개발, 시범운영 지원',
    desc: '시제품을 직접 만들어 먼저 써보고 판단할 수 있게 합니다. 시범운영 중 피드백을 반영해 개선 버전을 제공합니다.'
  },
  {
    icon: 'chat',
    title: 'AI 전문가 자문 지원',
    desc: 'AI 관련 사업·용역을 추진할 때 기술 검토와 보안 검토 등 전문적인 의견을 드립니다.'
  }
];

export const SERVICES = [
  {
    title: '문서·보고서 자동화',
    desc: '반복해서 작성하는 문서의 초안 작성과 서식 정리를 자동화합니다.',
    example: '정기 보고서, 서식 변환'
  },
  {
    title: '매뉴얼 기반 업무 도우미 생성',
    desc: '업무 매뉴얼·규정·사례를 바탕으로 답하는 업무 도우미를 만듭니다.',
    example: '감사사례 업무 도우미 · 감사담당관'
  },
  {
    title: 'AI 시범 서비스 개발',
    desc: '데이터를 활용한 시범 서비스를 만들어 효과를 먼저 확인합니다.',
    example: '그늘막 설치 위치 선정 · 재난안전과'
  },
  {
    title: '업무 지원 챗봇',
    desc: '자주 묻는 업무 질문에 답하는 챗봇을 만듭니다.',
    example: '업무 규정·절차 안내'
  },
  {
    title: '반복 업무 자동화',
    desc: '매번 같은 방식으로 처리하는 업무를 프로그램으로 자동화합니다.',
    example: '당직 편성 · 행정지원과 / 임면서류 검토 · 가족정책과'
  }
];

export const PROCESS = [
  { no: '01', title: '요청·상담', desc: '부서의 업무 이야기를 듣고 AI로 해결할 수 있는 부분을 함께 찾습니다.', icon: 'chat' },
  { no: '02', title: '담당자 면담·기획', desc: '요구사항과 예외사항을 정리하고 결과물의 형태를 협의합니다.', icon: 'board' },
  { no: '03', title: '개발·시범운영', desc: '시제품을 만들어 담당자에게 배포하고 피드백을 받습니다.', icon: 'code' },
  { no: '04', title: '적용·확산', desc: '개선 버전을 제공하고 유사 업무로 확대를 검토합니다.', icon: 'spread' }
];

export const DEPARTMENTS = ['행정지원과', '가족정책과', '재난안전과', '감사담당관', '인생케어과', '기획예산과'];

export const FAQ = [
  {
    q: '아주 간단한 것도 요청해도 되나요?',
    a: '네. 작은 반복 업무나 아이디어 단계의 고민도 괜찮습니다. 이야기를 나눠보며 AI로 도울 수 있는 부분을 함께 찾습니다.'
  },
  {
    q: '예산이 필요한가요?',
    a: '업무 규모와 방식에 따라 다릅니다. 지금까지의 반복·정형 업무 자동화 시범 사례는 비예산으로 진행했습니다.'
  },
  {
    q: '개인정보가 포함된 자료도 다룰 수 있나요?',
    a: '상담 단계에서 자료의 성격을 확인하고 보안 방식을 함께 정합니다. 개인정보가 포함된 업무는 인터넷 연결 없이 구동되는 프로그램으로 개발한 사례가 있습니다.'
  },
  {
    q: '기간은 얼마나 걸리나요?',
    a: '업무 범위에 따라 다릅니다. 상담 때 일정과 결과물 형태를 함께 정리합니다.'
  },
  {
    q: '개발한 뒤에도 관리해 주나요?',
    a: '운영 중 문제가 발견되면 피드백을 받아 개선 버전을 제공합니다.'
  },
  {
    q: '어떻게 요청하나요?',
    a: `페이지의 ‘협업 요청하기’ 버튼으로 요청서를 보내거나 ${TEAM.dept} ${TEAM.name}(${TEAM.phone})로 문의해 주세요.`
  }
];

export const REQUEST_TYPES = [
  '문서·보고서 자동화',
  '매뉴얼 기반 업무 도우미',
  'AI 시범 서비스',
  '업무 지원 챗봇',
  '반복 업무 자동화',
  '사업 기획·자문',
  '기타·잘 모르겠음'
];
