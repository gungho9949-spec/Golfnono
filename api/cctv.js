module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=300');
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    const response = await fetch(
      'https://www.roadplus.co.kr/main/selectGisDbLayerAjax.do?stype=cctv&loadno=0',
      { headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' }, signal: ctrl.signal }
    );
    clearTimeout(timer);
    if (!response.ok) throw new Error(`upstream ${response.status}`);
    const raw = await response.json();
    // Normalize to array regardless of response envelope
    const list = Array.isArray(raw) ? raw
      : Array.isArray(raw.list) ? raw.list
      : Array.isArray(raw.data) ? raw.data
      : Array.isArray(raw.result) ? raw.result
      : Array.isArray(raw.cctvs) ? raw.cctvs
      : [];
    res.status(200).json({ list, total: list.length });
  } catch (e) {
    res.status(502).json({ error: e.message, list: [] });
  }
};
