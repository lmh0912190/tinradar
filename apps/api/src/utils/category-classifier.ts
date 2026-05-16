import { removeViTones, CATEGORIES } from '@trend-radar/shared';

// Valid category names (must match @trend-radar/shared CATEGORIES)
export const VALID_CATEGORIES: Set<string> = new Set(
  CATEGORIES.filter((c) => c.slug !== 'tat-ca').map((c) => c.name as string),
);

/**
 * Validate AI-returned category against the canonical CATEGORIES list.
 * Returns null if invalid — better empty than wrong.
 */
export function validateCategory(input: string | null | undefined): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (VALID_CATEGORIES.has(trimmed)) return trimmed;

  // Try case-insensitive match against canonical names
  const lower = trimmed.toLowerCase();
  for (const valid of VALID_CATEGORIES) {
    if (valid.toLowerCase() === lower) return valid;
  }
  return null;
}

// Keyword patterns — first match wins. Patterns run against diacritic-stripped lowercase text.
const KEYWORD_PATTERNS: Array<{ category: string; patterns: RegExp[] }> = [
  {
    category: 'Tài chính',
    patterns: [
      /\b(bitcoin|btc|ethereum|eth|crypto|tien ao|tien dien tu|altcoin|coin|binance|coinbase)\b/,
      /\b(gia vang|vang sjc|vang mieng|vang nhan|vang 9999|vang 24k)\b/,
      /\b(chung khoan|co phieu|vn-?index|vn30|hose|hnx|upcom|niem yet)\b/,
      /\b(ty gia|usd|eur|jpy|yen|cny|nhan dan te|lai suat|ngan hang nha nuoc|nhnn)\b/,
      /\b(vietcombank|vcb|techcombank|tcb|bidv|agribank|mb bank|vpbank|sacombank)\b/,
    ],
  },
  {
    category: 'Thể thao',
    patterns: [
      /\b(u\d{1,2}|sea games|world cup|euro|asiad|olympic|paralympic|copa america|afc)\b/,
      /\b(bong da|cau thu|trong tai|huan luyen vien|hlv|doi tuyen|tuyen viet nam|aff cup)\b/,
      /\b(v-?league|premier league|la liga|bundesliga|serie a|champions league|c1|europa)\b/,
      /\b(messi|ronaldo|neymar|mbappe|haaland|salah|lewandowski|de bruyne)\b/,
      /\b(manchester united|man utd|man city|real madrid|barcelona|chelsea|arsenal|liverpool|atletico|psg|juventus)\b/,
      /\b(park hang seo|kim sang sik|hagl|cong vinh|quang hai|tien linh|hoang anh gia lai|ha noi fc)\b/,
      /\b(vo dich|chuc vo dich|tran chung ket|ban ket|vong loai|playoff|knockout)\b/,
      /\b(bong ro|nba|tennis|atp|wta|grand slam|wimbledon|us open)\b/,
    ],
  },
  {
    category: 'Công nghệ',
    patterns: [
      /\b(iphone|ipad|macbook|airpods|apple watch|imac|mac mini)\b/,
      /\b(samsung galaxy|xiaomi|oppo|vivo|huawei|realme|nokia|google pixel)\b/,
      /\b(android|ios|windows \d+|macos|chrome ?os|linux|ubuntu)\b/,
      /\b(google|microsoft|meta|facebook|tiktok|instagram|youtube|twitter|x corp)\b/,
      /\b(ai|chatgpt|openai|claude|anthropic|gemini|copilot|deepseek|grok|llama)\b/,
      /\b(elon musk|mark zuckerberg|sam altman|tim cook|sundar pichai|jensen huang)\b/,
      /\b(tesla|spacex|nvidia|amd|intel|qualcomm|tsmc|asml)\b/,
      /\b(blockchain|web3|nft|metaverse|cong nghe|startup cong nghe|deeptech)\b/,
    ],
  },
  {
    category: 'Giải trí',
    patterns: [
      /\b(son tung|m-?tp|my tam|ho ngoc ha|tran thanh|hari won|truong giang|nha phuong)\b/,
      /\b(blackpink|bts|kpop|jisoo|jennie|rose|lisa|twice|exo|nct)\b/,
      /\b(taylor swift|justin bieber|ariana grande|drake|jason derulo|billie eilish|the weeknd)\b/,
      /\b(phim|tap cuoi|tap \d+|drama|netflix|hbo|disney|prime video)\b/,
      /\b(nghe si|ca si|dien vien|nguoi mau|hoa hau|miss universe|miss world|mister)\b/,
      /\b(vbiz|kbiz|cbiz|showbiz|sao viet|sao han|sao au my)\b/,
      /\b(hau due|bao ve|nguoi ay|nha tro|chi em|me chong)\b/,
      /\b(buoc chan vao doi|gia dinh la so 1|nha co nhieu cot)\b/,
    ],
  },
  {
    category: 'Kinh doanh',
    patterns: [
      /\b(vinfast|vingroup|vinhomes|vinpearl|vinmec|vinmart|vinschool|vincom)\b/,
      /\b(sun group|sun world|sun property|sungroup)\b/,
      /\b(masan|hoa phat|hpg|fpt|the gioi di dong|mwg|pnj|nova ?land|novaland)\b/,
      /\b(petrolimex|plx|petrovietnam|gas|pgas|evn|vinamilk|vnm|hoang anh gia lai)\b/,
      /\b(doanh nghiep|startup|ipo|m&a|sap nhap|tap doan|tong cong ty|cong ty)\b/,
      /\b(dau tu|von dieu le|von hoa|loi nhuan|doanh thu|gdp|pmi)\b/,
      /\b(bds|bat dong san|nha o|chung cu|du an|can ho|condotel)\b/,
    ],
  },
  {
    category: 'Xã hội',
    patterns: [
      /\b(tai nan|vu chay|vu no|sat hai|cuop|trom|hiep dam|giet nguoi)\b/,
      /\b(cong an|canh sat|toa an|vien kiem sat|phap luat|luat su|toa)\b/,
      /\b(bao lu|mua lu|sat lo|dong dat|song than|thien tai|ung lut|han han)\b/,
      /\b(covid|cum|dich benh|vaccin|virus|sars|ebola|h5n1|h1n1)\b/,
      /\b(tuyen an|xet xu|bi cao|bi can|ket an|tu hinh|chung than|tu giam)\b/,
      /\b(quoc hoi|chinh phu|thu tuong|chu tich nuoc|tong bi thu|bo truong)\b/,
      /\b(nong dan|cong nhan|viec lam|that nghiep|luong toi thieu|bhxh|bhyt)\b/,
    ],
  },
  {
    category: 'Đời sống',
    patterns: [
      /\b(thoi tiet|nang nong|mua to|gio mua|khong khi lanh|bao so \d+)\b/,
      /\b(du lich|nghi le|tour|resort|khach san|homestay|vietnam airlines|vietjet|bamboo)\b/,
      /\b(am thuc|mon an|nau an|pho|bun bo|com tam|banh mi|hu tieu)\b/,
      /\b(suc khoe|benh vien|bac si|thuoc|kham benh|tiem chung|dinh duong)\b/,
      /\b(lam dep|spa|my pham|cham soc da|toc|trang diem)\b/,
      /\b(giao duc|hoc sinh|sinh vien|dai hoc|truong hoc|thi cu|diem chuan|diem thi)\b/,
    ],
  },
];

// Source name (lowercased) → category. Only sources that strongly imply a single category.
const SOURCE_TO_CATEGORY: Record<string, string> = {
  cafef: 'Tài chính',
  vietstock: 'Tài chính',
  ndh: 'Tài chính',
  fili: 'Tài chính',
  cafebiz: 'Kinh doanh',
  doanhnhansaigon: 'Kinh doanh',
  brandsvietnam: 'Kinh doanh',
  bongda: 'Thể thao',
  bongdaplus: 'Thể thao',
  thethao247: 'Thể thao',
  thethaovanhoa: 'Thể thao',
  webthethao: 'Thể thao',
  genk: 'Công nghệ',
  vnreview: 'Công nghệ',
  tinhte: 'Công nghệ',
  ictnews: 'Công nghệ',
  kenh14: 'Giải trí',
  zing: 'Giải trí',
  tiin: 'Giải trí',
  '2sao': 'Giải trí',
  yan: 'Giải trí',
  saostar: 'Giải trí',
  suckhoedoisong: 'Đời sống',
  giadinh: 'Đời sống',
  eva: 'Đời sống',
  afamily: 'Đời sống',
};

function normalize(s: string): string {
  return removeViTones(s).toLowerCase();
}

function matchSourceCategory(sourceHint: string | null): string | null {
  if (!sourceHint) return null;
  const norm = normalize(sourceHint).replace(/[^a-z0-9]/g, '');
  for (const [key, cat] of Object.entries(SOURCE_TO_CATEGORY)) {
    if (norm.includes(key)) return cat;
  }
  return null;
}

/**
 * Heuristic category classifier for trends that haven't gone through AI batch yet.
 * Strategy: keyword pattern matching first (more reliable), then source hint fallback.
 * Returns null if no confident match — let AI fill it later.
 */
export function classifyByHeuristic(keyword: string, sourceHint?: string | null): string | null {
  const normalized = normalize(keyword);

  for (const { category, patterns } of KEYWORD_PATTERNS) {
    for (const re of patterns) {
      if (re.test(normalized)) return category;
    }
  }

  return matchSourceCategory(sourceHint ?? null);
}
