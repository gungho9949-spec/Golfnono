module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 's-maxage=86400');
  res.setHeader('Access-Control-Allow-Origin', '*');
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // [나중에 실제 API로 교체할 곳]
  // 공공데이터포털 골프장 API:
  // https://www.data.go.kr/data/15118920/fileData.do
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const COURSES = [
    {
      id: 'nambu',
      name: '남부 컨트리클럽',
      region: '경기도 용인시',
      lat: 37.2403, lng: 127.1944,
      holes: 36, type: '퍼블릭', rating: 4.8,
      tags: ['36홀', '퍼블릭', '챔피언십'],
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // [CCTV 교체] 공공데이터포털 도로 CCTV API:
      // https://openapi.its.go.kr:9443/cctvInfo
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      cctvUrl: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8',
      cctvLabel: '경부고속도로 수원IC 인근',
      weather: { icon:'⛅', temp:23, desc:'구름 조금', wind:'북서 4m/s', humidity:'52%', uv:'UV 5 (보통)', visibility:'20km' },
      restaurants: [
        { rank:1, name:'용인왕갈비', category:'한식·갈비', distance:'1.2km', badge1:'T-map 목적지 1위', badge2:'13-15시 결제 42%', badge3:'주차 완비', price:'35,000원~', emoji:'🥩' },
        { rank:2, name:'미나리 두부마을', category:'한식·두부', distance:'2.1km', badge1:'카드결제 급증 ↑', badge2:'줄서는 맛집', badge3:'예약 가능', price:'18,000원~', emoji:'🌿' },
        { rank:3, name:'우리손칼국수', category:'분식·칼국수', distance:'0.8km', badge1:'가성비 1위', badge2:'대기 없음', badge3:'단체석 있음', price:'12,000원~', emoji:'🍜' },
      ],
    },
    {
      id: 'gapyeong',
      name: '가평 베네스트 GC',
      region: '경기도 가평군',
      lat: 37.8142, lng: 127.5110,
      holes: 18, type: '프라이빗', rating: 4.9,
      tags: ['18홀', '프라이빗', '산악코스'],
      cctvUrl: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8',
      cctvLabel: '서울양양고속도로 가평IC 인근',
      weather: { icon:'🌤', temp:19, desc:'맑음', wind:'동 2m/s', humidity:'45%', uv:'UV 4 (보통)', visibility:'25km' },
      restaurants: [
        { rank:1, name:'가평잣두부마을', category:'한식·두부', distance:'2.3km', badge1:'T-map 목적지 1위', badge2:'13-15시 결제 38%', badge3:'주차 완비', price:'22,000원~', emoji:'🫘' },
        { rank:2, name:'산골닭갈비', category:'한식·닭갈비', distance:'1.5km', badge1:'블로거 추천 1위', badge2:'웨이팅 있음', badge3:'예약 불가', price:'16,000원~', emoji:'🍗' },
        { rank:3, name:'남이섬 막국수', category:'분식·막국수', distance:'3.0km', badge1:'관광객 픽', badge2:'대기 10분', badge3:'경치 좋음', price:'14,000원~', emoji:'🍝' },
      ],
    },
    {
      id: 'wellington',
      name: '웰링턴 CC',
      region: '경기도 광주시',
      lat: 37.4072, lng: 127.3421,
      holes: 27, type: '프라이빗', rating: 4.7,
      tags: ['27홀', '프라이빗', '구릉코스'],
      cctvUrl: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8',
      cctvLabel: '중부고속도로 광주IC 인근',
      weather: { icon:'🌧', temp:17, desc:'비', wind:'남서 6m/s', humidity:'82%', uv:'UV 1 (낮음)', visibility:'8km' },
      restaurants: [
        { rank:1, name:'광주 한우명가', category:'한식·한우', distance:'1.8km', badge1:'T-map 목적지 1위', badge2:'13-15시 결제 51%', badge3:'발렛 가능', price:'65,000원~', emoji:'🥩' },
        { rank:2, name:'초월 순두부찌개', category:'한식·두부', distance:'0.9km', badge1:'로컬 맛집', badge2:'대기 없음', badge3:'단체 가능', price:'10,000원~', emoji:'🍲' },
        { rank:3, name:'양평 물닭갈비', category:'한식·닭갈비', distance:'4.2km', badge1:'SNS 핫플', badge2:'예약 필수', badge3:'드라이브코스', price:'20,000원~', emoji:'🍗' },
      ],
    },
    {
      id: 'trinity',
      name: '트리니티 클럽',
      region: '강원도 홍천군',
      lat: 37.6693, lng: 127.9124,
      holes: 18, type: '프라이빗', rating: 4.8,
      tags: ['18홀', '프라이빗', '리조트형'],
      cctvUrl: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8',
      cctvLabel: '서울춘천고속도로 홍천IC 인근',
      weather: { icon:'🌥', temp:15, desc:'흐림', wind:'북동 3m/s', humidity:'68%', uv:'UV 2 (낮음)', visibility:'15km' },
      restaurants: [
        { rank:1, name:'홍천 한우 직판장', category:'한식·한우', distance:'5.0km', badge1:'T-map 목적지 1위', badge2:'13-15시 결제 47%', badge3:'주차 완비', price:'45,000원~', emoji:'🥩' },
        { rank:2, name:'강원 메밀국수', category:'분식·국수', distance:'2.7km', badge1:'강원 향토음식', badge2:'대기 없음', badge3:'포장 가능', price:'11,000원~', emoji:'🍜' },
        { rank:3, name:'홍천 닭갈비 골목', category:'한식·닭갈비', distance:'4.8km', badge1:'현지인 1위', badge2:'단체 예약 권장', badge3:'단체석 있음', price:'15,000원~', emoji:'🍗' },
      ],
    },
    {
      id: 'trius',
      name: '트리우스 골프클럽',
      region: '인천광역시 영종도',
      lat: 37.4844, lng: 126.4830,
      holes: 18, type: '퍼블릭', rating: 4.6,
      tags: ['18홀', '퍼블릭', '해변코스'],
      cctvUrl: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8',
      cctvLabel: '인천국제공항고속도로 영종IC 인근',
      weather: { icon:'🌊', temp:21, desc:'흐리고 바람', wind:'서 8m/s', humidity:'74%', uv:'UV 3 (보통)', visibility:'12km' },
      restaurants: [
        { rank:1, name:'영종 활어회 센터', category:'해산물·회', distance:'3.1km', badge1:'T-map 목적지 1위', badge2:'13-15시 결제 35%', badge3:'주차 완비', price:'55,000원~', emoji:'🐟' },
        { rank:2, name:'을왕리 해물찜', category:'해산물·찜', distance:'4.0km', badge1:'SNS 핫플', badge2:'예약 권장', badge3:'오션뷰', price:'40,000원~', emoji:'🦐' },
        { rank:3, name:'영종 조개구이', category:'해산물·조개', distance:'2.5km', badge1:'로컬 1위', badge2:'대기 15분', badge3:'야외 테이블', price:'30,000원~', emoji:'🦪' },
      ],
    },
  ];
  res.status(200).json({ courses: COURSES, total: COURSES.length, updatedAt: new Date().toISOString() });
};
