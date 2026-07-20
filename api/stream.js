module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { url } = req.query;
  if (!url) return res.status(400).end('url required');

  let target;
  try {
    target = new URL(url);
  } catch {
    return res.status(400).end('invalid url');
  }

  // cctvsec.ktict.co.kr 만 허용 (보안)
  if (!target.hostname.endsWith('ktict.co.kr')) {
    return res.status(403).end('forbidden');
  }

  try {
    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), 12000);

    const upstream = await fetch(url, {
      signal: ctrl.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible)' },
    });

    if (!upstream.ok) {
      return res.status(upstream.status).end('upstream error');
    }

    const contentType = upstream.headers.get('content-type') || 'application/octet-stream';
    const isPlaylist = url.includes('.m3u8') || contentType.includes('mpegurl') || contentType.includes('x-mpegURL');

    res.setHeader('Cache-Control', 's-maxage=30');

    if (isPlaylist) {
      // m3u8 내 세그먼트/서브플레이리스트 URL을 프록시 경유로 재작성
      const text = await upstream.text();
      const base = url.substring(0, url.lastIndexOf('/') + 1);
      const rewritten = text.split('\n').map(line => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return line;
        const absUrl = trimmed.startsWith('http') ? trimmed : base + trimmed;
        return `/api/stream?url=${encodeURIComponent(absUrl)}`;
      }).join('\n');
      res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
      return res.status(200).send(rewritten);
    }

    // .ts 세그먼트: 바이너리 그대로 전달
    const buffer = await upstream.arrayBuffer();
    res.setHeader('Content-Type', contentType);
    return res.status(200).send(Buffer.from(buffer));
  } catch (e) {
    return res.status(502).end('proxy error: ' + e.message);
  }
};
