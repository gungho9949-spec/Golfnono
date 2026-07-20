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

  const base = `https://openapi.its.go.kr:9443/cctvInfo?apiKey=${API_KEY}&cctvType=1&getType=json`
    + `&minX=${minX}&maxX=${maxX}&minY=${minY}&maxY=${maxY}`;

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 5000);
    const [resEx, resIts] = await Promise.allSettled([
      fetch(`${base}&type=ex`, { signal: ctrl.signal }).then(r => r.json()),
      fetch(`${base}&type=its`, { signal: ctrl.signal }).then(r => r.json()),
    ]);
    clearTimeout(timer);

    const list = [];
    let apiReachable = false;
    for (const r of [resEx, resIts]) {
      if (r.status === 'fulfilled') {
        apiReachable = true;
        const d = r.value;
        const items = d?.response?.data || d?.data || d?.list || [];
        if (Array.isArray(items)) list.push(...items);
      }
    }

    const _debug = [resEx, resIts].map((r, i) =>
      r.status === 'rejected' ? `[${i === 0 ? 'ex' : 'its'}] ${r.reason?.message}` : `[${i === 0 ? 'ex' : 'its'}] ok`
    );
    res.status(200).json({ list, total: list.length, apiReachable, _debug });
  } catch (e) {
    res.status(200).json({ list: [], total: 0, apiReachable: false, _debug: ['catch: ' + e.message] });
  }
};
