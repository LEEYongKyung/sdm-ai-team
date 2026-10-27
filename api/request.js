// Vercel 서버 함수: 협업 요청서를 NHN Cloud Email API로 발송한다
// API 문서: https://docs.nhncloud.com/ko/Notification/Email/ko/api-guide/
// 필요한 환경변수: NHN_EMAIL_APP_KEY, NHN_EMAIL_SECRET_KEY, NHN_EMAIL_SENDER, REQUEST_MAIL_TO

const FIELDS = {
  dept: ['부서명', 50, true],
  name: ['담당자', 50, true],
  phone: ['내선번호', 30, true],
  type: ['요청 유형', 50, true],
  schedule: ['희망 일정', 100, false],
  content: ['요청 내용', 5000, true]
};

const escapeHtml = s =>
  String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method' });

  const { NHN_EMAIL_APP_KEY, NHN_EMAIL_SECRET_KEY, NHN_EMAIL_SENDER, REQUEST_MAIL_TO } = process.env;
  if (!NHN_EMAIL_APP_KEY || !NHN_EMAIL_SECRET_KEY || !NHN_EMAIL_SENDER || !REQUEST_MAIL_TO) {
    return res.status(503).json({ ok: false, error: 'not-configured' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  const form = {};
  for (const [key, [, max, required]] of Object.entries(FIELDS)) {
    const value = String(body[key] ?? '').trim();
    if ((required && !value) || value.length > max) return res.status(400).json({ ok: false, error: `invalid:${key}` });
    form[key] = value;
  }

  const rows = Object.entries(FIELDS)
    .filter(([key]) => key !== 'content')
    .map(([key, [label]]) => `<tr><th align="left" style="padding:4px 16px 4px 0;color:#555">${label}</th><td>${escapeHtml(form[key] || '-')}</td></tr>`)
    .join('');
  const html = `
    <h2 style="margin:0 0 16px">AI운영지원팀 협업 요청</h2>
    <table style="border-collapse:collapse;font-size:14px">${rows}</table>
    <h3 style="margin:24px 0 8px">요청 내용</h3>
    <div style="white-space:pre-wrap;font-size:14px;line-height:1.6">${escapeHtml(form.content)}</div>`;

  try {
    const r = await fetch(`https://email.api.nhncloudservice.com/email/v2.1/appKeys/${NHN_EMAIL_APP_KEY}/sender/mail`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=UTF-8', 'X-Secret-Key': NHN_EMAIL_SECRET_KEY },
      body: JSON.stringify({
        senderAddress: NHN_EMAIL_SENDER,
        senderName: 'AI운영지원팀 협업요청',
        title: `[AI협업요청] ${form.dept} - ${form.type}`,
        body: html,
        receiverList: [{ receiveMailAddr: REQUEST_MAIL_TO, receiveType: 'MRT0' }]
      })
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok || !data?.header?.isSuccessful) {
      console.error('NHN mail failed', r.status, data?.header);
      return res.status(502).json({ ok: false, error: 'send-failed' });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('NHN mail error', e);
    return res.status(502).json({ ok: false, error: 'send-error' });
  }
}
