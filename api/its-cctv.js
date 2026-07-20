module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=300');

  const { lat, lng } = req.query;
  if (!lat || !lng) return res.status(400).json({ error: 'lat/lng required', list: [] });

  const API_KEY = process.env.ITS_API_KEY || '';
  if (!API_KEY) return res.status(500).json({ error: 'ITS_API_KEY not configured', list: [] });

  const latF = parseFloat(lat);
  const lngF = parseFloat(lng);
  const radiusKm = 5;
  const latDelta = radiusKm / 111;
  const lngDelta = radiusKm / (111 * Math.cos(latF * Math.PI / 180));

  const minY = (latF - latDelta).toFixed(6);
  const maxY = (latF + latDelta).toFixed(6);
  const minX = (lngF - lngDelta).toFixed(6);
  const maxX = (lngF + lngDelta).toFixed(6);

  const base = `http://openapi.its.go.kr:8081/api/NCCTVInfo?key=${API_KEY}&ReqType=2`
    + `&MinX=${minX}&MaxX=${maxX}&MinY=${minY}&MaxY=${maxY}&cctvType=1`;

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    const [resEx, resIts] = await Promise.allSettled([
      fetch(`${base}&type=ex`, { signal: ctrl.signal }).then(r => r.json()),
      fetch(`${base}&type=its`, { signal: ctrl.signal }).then(r => r.json()),
    ]);
    clearTimeout(timer);

    const list = [];
    const debug = [];
    for (const r of [resEx, resIts]) {
      if (r.status === 'fulfilled') {
        const d = r.value;
        debug.push(JSON.stringify(d).substring(0, 300));
        const items = d?.response?.data || d?.data || d?.list || [];
        if (Array.isArray(items)) list.push(...items);
      } else {
        debug.push('rejected: ' + r.reason?.message);
      }
    }

    res.status(200).json({ list, total: list.length, debug });
  } catch (e) {
    res.status(502).json({ error: e.message, list: [] });
  }
};
