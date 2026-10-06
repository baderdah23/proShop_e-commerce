# نظام التصميم العام — Generic Creative Design System

> **الإصدار:** 1.0 — Cornflower Blue Edition  
> **الغرض:** وثيقة مرجعية شاملة يمكن إعطاؤها لأي AI agent لإنتاج نفس نظام التصميم بالضبط  
> **الاتجاه:** RTL (من اليمين إلى اليسار) بالكامل

---

## 1. الهوية ودور الـAI — Identity & Creative Direction

نظام تصميم عام ومرن لمواقع وتطبيقات SaaS والمنتجات الرقمية والصفحات الإبداعية. صُمم ليكون قابلاً للتطبيق على أي مجال، وليس مرتبطاً بقطاع أو صناعة محددة. يعتمد على:
- لون أساسي: **#6AABF0** (Cornflower Blue)
- خطان رئيسيان: **Rubik** (لاتيني + أرقام) و **Noto Kufi Arabic** (عربي)
- مكتبة أيقونات: **Huge Icons** عبر `hugeicons-react`
- رسومات توضيحية: SVG inline بأسلوب خطي مبسط
- إطار عمل: React 18 + Tailwind CSS v4
- الاتجاه: RTL-first

---

## 2. نظام الألوان — Color System

### اللون الأساسي (Cornflower Blue Scale)

| Token | Hex | الاستخدام |
|-------|-----|-----------|
| brand-50 | `#EEF5FC` | خلفيات ناعمة، تمييز خفيف |
| brand-100 | `#D5E8F8` | تمييز، خلفيات الأقسام |
| brand-200 | `#AACFF0` | حدود فاتحة، أيقونات صغيرة |
| brand-300 | `#8ABFE9` | تأثيرات hover فاتحة |
| **brand-400** | **`#6AABF0`** | **اللون الأساسي — Primary** |
| brand-500 | `#4D95E8` | حالة hover للأزرار |
| brand-600 | `#2B7BD4` | نص على خلفية فاتحة، روابط |
| brand-700 | `#1F63B3` | تأكيد للنص النشط |
| brand-800 | `#164A88` | تأكيد عميق |
| brand-900 | `#0E3060` | نص على خلفيات داكنة |

### الألوان الدلالية (Semantic Colors)

| الاسم | Hex | الاستخدام |
|-------|-----|-----------|
| Primary | `#6AABF0` | الأساسي في كل مكان |
| Success | `#22C55E` | نجاح، نشاط، تأكيد |
| Warning | `#F59E0B` | تحذير، انتظار |
| Danger | `#EF4444` | خطأ، حذف، طوارئ |
| Info | `#6AABF0` | معلومات، إشعارات |

### المحايدة (Neutrals — Slate Scale)

```
#F8FAFC  →  #F1F5F9  →  #E2E8F0  →  #CBD5E1  →  #94A3B8
#64748B  →  #475569  →  #334155  →  #1A1D2A
```

### CSS Custom Properties

```css
:root {
  --primary:             #6AABF0;
  --primary-foreground:  #ffffff;
  --background:          #F8FAFC;
  --foreground:          #1A1D2A;
  --card:                #ffffff;
  --card-foreground:     #1A1D2A;
  --muted:               #F1F5F9;
  --muted-foreground:    #64748B;
  --accent:              #EEF5FC;
  --accent-foreground:   #1F63B3;
  --border:              rgba(0, 0, 0, 0.08);
  --ring:                #6AABF0;
  --destructive:         #EF4444;
  --radius:              0.75rem;

  /* Sidebar (dark) */
  --sidebar-bg:          linear-gradient(180deg, #0D1B2A, #0A1520);
  --sidebar-primary:     #6AABF0;
  --sidebar-border:      rgba(106, 171, 240, 0.08);
}
```

### ألوان Glow / Spotlight

```
Primary glow:  rgba(106, 171, 240, 0.12)   للـ SpotlightCard
Blue shadow:   rgba(106, 171, 240, 0.35)   لـ boxShadow
Active glow:   0 0 8px #6AABF0             للـ indicator bar
```

---

## 3. الطباعة — Typography

### الخطوط المستخدمة

#### Outfit — للإنجليزية والأرقام اللاتينية
```html
<link href="https://fonts.googleapis.com/css2?family=Outfit:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap" rel="stylesheet">
```

#### Rubik Arabic — للعربية
```html
<link href="https://fonts.googleapis.com/css2?family=Rubik+Arabic:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
```

#### CSS Font Stack
```css
--font-sans: 'Outfit', 'Rubik Arabic', system-ui, -apple-system, sans-serif;
```

### مقياس الأوزان (Weight Scale)

| Weight | القيمة | الاستخدام |
|--------|--------|-----------|
| Light | 300 | نصوص طويلة، وصف |
| Regular | 400 | النص الأساسي body |
| Medium | 500 | تسميات labels |
| SemiBold | 600 | عناوين ثانوية، أزرار |
| Bold | 700 | عناوين رئيسية |
| ExtraBold | 800 | أرقام ضخمة، KPIs |
| Black | 900 | بطل hero، تأكيد قوي |

### مقياس الأحجام (Size Scale)

| الدور | الحجم | العلاقة |
|-------|-------|---------|
| Display | 3rem / 48px | عناوين Landing Page |
| H1 | 2.5rem / 40px | عنوان الصفحة |
| H2 | 2rem / 32px | عنوان القسم |
| H3 | 1.5rem / 24px | عنوان فرعي |
| H4 | 1.25rem / 20px | عنوان بطاقة |
| Body L | 1.125rem / 18px | نص كبير |
| Body | 1rem / 16px | النص الأساسي |
| Body S | 0.875rem / 14px | نص مساعد |
| Caption | 0.75rem / 12px | تسميات صغيرة |
| Micro | 0.625rem / 10px | تسميات دقيقة |

### ارتفاع السطر (Line Height)

```
عناوين:       1.2 – 1.35
نص عربي:     1.6 – 1.8  (أكبر بسبب طبيعة الخط)
نص لاتيني:   1.4 – 1.5
```

---


### قاعدة استخدام الخطوط

- **Outfit** للإنجليزية والأرقام اللاتينية فقط.
- **Rubik Arabic** للعربية فقط.
- لا تستخدم Outfit لكتابة النص العربي.
- لا تستخدم Rubik Arabic للنص الإنجليزي.
- عند وجود لغة عربية وإنجليزية في نفس الواجهة، يحافظ كل نص على خطه المخصص.

## 4. مكتبة الأيقونات — Huge Icons

### التثبيت

```bash
npm install hugeicons-react @hugeicons/react
# أو
pnpm add hugeicons-react @hugeicons/react
```

> **ملاحظة:** `hugeicons-react` تعتمد على `@hugeicons/react` كـ peer dependency. يجب تثبيت الاثنين.

### طريقة الاستيراد

```tsx
import { HeartCheckIcon, Doctor01Icon, Calendar01Icon } from 'hugeicons-react'

// الاستخدام الأساسي
<HeartCheckIcon size={24} color="#6AABF0" />

// مع خصائص إضافية
<Doctor01Icon
  size={32}
  color="#6AABF0"
  strokeWidth={1.5}
/>
```

### الأيقونات المتخصصة حسب السياق

لا توجد مجموعة أيقونات مرتبطة بمجال واحد. اختر الأيقونات التي تعبّر عن محتوى المنتج أو الصفحة، مع الالتزام دائماً بمكتبة **Huge Icons** وبنفس الوزن والأسلوب البصري. لا تستخدم أيقونات طبية افتراضياً في المنتجات العامة.

### أيقونات الواجهة (UI Icons)

| اسم الأيقونة | الاستيراد | الاستخدام |
|-------------|-----------|-----------|
| لوحة تحكم | `DashboardCircleIcon` | الرئيسية |
| تحليلات | `Analytics01Icon` | الإحصائيات |
| تقويم | `Calendar01Icon` | المواعيد |
| ملف | `File01Icon` | التقارير |
| فاتورة+ | `AddInvoiceIcon` | الفوترة |
| إشعار | `Notification01Icon` | التنبيهات |
| مستخدم | `User02Icon` | الملف الشخصي |
| إضافة مستخدم | `UserAdd01Icon` | تسجيل مريض |
| درع | `Shield01Icon` | الأمان |
| إعدادات | `Setting06Icon` | الإعدادات |
| ساعة | `Clock01Icon` | الوقت |
| مجموعة | `Group01Icon` | المرضى |
| بحث | `Search01Icon` | البحث |
| منزل | `Home01Icon` | الرئيسية |
| تعديل | `Edit01Icon` | التعديل |
| حذف | `Delete01Icon` | الحذف |
| تأكيد ✓ | `CheckmarkCircle01Icon` | نجاح |
| قائمة | `Menu01Icon` | القائمة |
| إغلاق | `Cancel01Icon` | الإغلاق |
| سهم | `ArrowRight01Icon` | CTA |
| عين | `EyeIcon` | إظهار كلمة المرور |
| قفل | `LockPasswordIcon` | كلمة المرور |
| بريد | `Mail01Icon` | البريد الإلكتروني |
| هاتف | `Phone01Icon` | رقم الهاتف |
| نجمة | `StarIcon` | التقييم، الباقات |
| ماسة | `DiamondIcon` | باقة Pro |
| تاج | `CrownIcon` | باقة Enterprise |
| موقع | `Location01Icon` | العنوان |
| برق | `FlashIcon` | المميزات السريعة |

### معايير الأحجام

```
16px  — داخل الإدخالات، النص الصغير
20px  — القوائم، شارات
24px  — المعيار الأساسي (standard)
32px  — البطاقات الكبيرة
40px  — Hero sections
48px  — Empty states
```

### الألوان المستخدمة مع الأيقونات

```tsx
color="#6AABF0"   // الأساسي
color="#22C55E"   // النجاح
color="#F59E0B"   // التحذير
color="#EF4444"   // الخطر
color="#94A3B8"   // محايد
color="white"     // على خلفية داكنة
```

---

## 5. الرسومات التوضيحية — UI Illustrations

### المبدأ العام

الرسومات التوضيحية في هذا النظام هي **SVG inline** مخصصة، بأسلوب خطي مبسط (flat line illustration). لا تُستخدم صور خارجية أو مكتبات illustrations جاهزة.

### معايير الأسلوب

```
النوع:        SVG inline (مدمجة في JSX)
الأسلوب:     خطي مبسط (flat / minimal)
الزوايا:      مدورة دائماً (rx="8" أو أكثر)
الألوان:      من نظام الألوان الخاص بالمنصة فقط
الخلفية:     #EEF5FC أو #F0F9FF أو #F0FDF4 (فاتحة محايدة)
الحجم:       viewBox مرن، عادةً 280×180 أو 320×200
```

### بالت الألوان المسموح به في الرسوم

```
#EEF5FC — خلفية زرقاء فاتحة
#AACFF0 — عناصر ثانوية
#6AABF0 — اللون الأساسي، العناصر المميزة
#2B7BD4 — تأكيد، شرائط sidebar
#22C55E — نجاح، صحة
#F59E0B — تحذير، جداول مواعيد
#EF4444 — طوارئ (نادر)
#CBD5E1 — حدود محايدة
#94A3B8 — نص داخل الرسم
#1A1D2A — نص داكن
white   — خلفيات البطاقات
```

### حالات الاستخدام

```
صفحات الهبوط    → رسوم hero ضخمة (320×200)
حالات الفراغ   → Empty state illustration (240×160)
الإونبوردينغ   → خطوات توضيحية (280×180)
البطاقات الكبيرة → تزيين خلفي خفيف (auto)
رأس الأقسام   → أيقونة SVG تزيينية
```

### الرسومات الأساسية المقترحة

1. **IllustrationDashboard** — لوحة تحكم مع navigation وcards وcharts
2. **IllustrationProduct** — تمثيل بصري للمنتج أو الخدمة
3. **IllustrationFeature** — رسم يشرح ميزة أو workflow
4. **IllustrationStats** — شارت أعمدة + Donut chart مع legend
5. **IllustrationEmpty** — حالة فراغ مع أيقونة أو عنصر بصري مناسب
6. **IllustrationError** — حالة خطأ (404، خلل في الاتصال)
7. **IllustrationSuccess** — حالة نجاح مع علامة تأكيد

يتم اختيار الرسم وفقاً للسياق الفعلي للموقع، وليس وفق قالب ثابت لمجال معين.

### مثال كود رسم توضيحي

```tsx
function IllustrationDashboard() {
  return (
    <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="320" height="200" rx="12" fill="#EEF5FC" />
      {/* Sidebar */}
      <rect x="0" y="0" width="70" height="200" rx="12" fill="#2B7BD4" />
      <rect x="12" y="20" width="46" height="6" rx="3" fill="white" fillOpacity="0.8" />
      {/* Cards */}
      <rect x="84" y="16" width="66" height="50" rx="8" fill="white" />
      {/* Chart line */}
      <polyline
        points="96,160 115,140 134,148 153,120 172,130 191,108 210,115"
        stroke="#6AABF0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}
```

---

## 6. المكوّن المميز — SpotlightCard

### الوصف
بطاقة تتبع حركة الماوس وتظهر بقعة ضوء دائرية (radial gradient) عند التمرير عليها.

### الكود الكامل

```tsx
interface SpotlightCardProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  spotlightColor?: string   // default: 'rgba(106,171,240,0.15)'
  spotlightSize?: number    // default: 300
}

function SpotlightCard({ children, className = '', style, spotlightColor = 'rgba(106,171,240,0.15)', spotlightSize = 300 }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0, opacity: 0 })

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top, opacity: 1 })
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={() => setPos(p => ({ ...p, opacity: 0 }))}
      className={`relative overflow-hidden ${className}`}
      style={style}
    >
      <div style={{
        position: 'absolute',
        left: pos.x - spotlightSize / 2,
        top: pos.y - spotlightSize / 2,
        width: spotlightSize,
        height: spotlightSize,
        background: `radial-gradient(circle at center, ${spotlightColor}, transparent 70%)`,
        opacity: pos.opacity,
        transition: 'opacity 0.25s ease',
        pointerEvents: 'none',
        borderRadius: '50%',
        zIndex: 1,
      }} />
      <div className="relative" style={{ zIndex: 2 }}>{children}</div>
    </div>
  )
}
```

### قيم spotlightColor حسب السياق

```
بطاقة عادية:    rgba(106,171,240,0.08)
بطاقة primary:  rgba(106,171,240,0.15)
بطاقة نجاح:     rgba(34,197,94,0.12)
بطاقة تحذير:    rgba(245,158,11,0.12)
بطاقة خطر:      rgba(239,68,68,0.12)
خلفية داكنة:    rgba(106,171,240,0.20)
```

---

## 7. الشريط الجانبي — Sidebar

### التصميم

```
الخلفية:  linear-gradient(180deg, #0D1B2A 0%, #0A1520 100%)
الحد:     1px solid rgba(106,171,240,0.08)
العرض:    240px (مفتوح) / 0 (مغلق)
```

### حالة Active (النشط)

```
خلفية العنصر:   rgba(106,171,240,0.12)
لون النص:       #6AABF0
وزن الخط:       600

المؤشر الجانبي:
  position: absolute
  end: 0  (في RTL = يسار، يواجه المحتوى)
  height: calc(100% - 16px), width: 2px
  background: #6AABF0
  boxShadow: 0 0 8px #6AABF0
  borderRadius: 9999px
```

### اللوغو في الـ Sidebar

```tsx
<div style={{ background: 'linear-gradient(135deg,#6AABF0,#2B7BD4)', borderRadius: 12, width: 36, height: 36 }}>
  <HeartCheckIcon size={18} color="white" />
</div>
```

---

## 8. الأزرار — Buttons

### الأنواع والألوان

```
Primary:
  يجب أن يكون الزر الأساسي هو أكثر عناصر الـCTA تميزاً بصرياً.
  المظهر الافتراضي: Liquid Glass / Crystal Glass premium treatment.
  لا يكون مجرد مستطيل بلون solid عادي.
  استخدم شفافية محسوبة، backdrop blur، inner highlight، border خفيف شبه زجاجي،
  انعكاس ضوئي أو gradient subtle، وshadow/glow ناعم عند الحاجة.
  يجب أن يبدو فخماً وواقعياً وPremium، وليس كـglass effect رخيص أو مبالغ فيه.
  hover: انتقال ضوئي/انعكاسي محسوب + رفع بصري خفيف.
  active: ضغط بصري واضح مع تقليل الـglow.

Secondary: background #EEF5FC, color #2B7BD4

Outline:   border 1.5px solid #6AABF0, color #6AABF0, bg transparent

Ghost:     color #64748B, bg transparent

Danger:    background #EF4444, color white

Success:   background #22C55E, color white

قاعدة مهمة:
Liquid Glass ليس إجبارياً على كل عنصر. يستخدم عندما يخدم الـhierarchy والـbrand
والتكوين البصري، خصوصاً في CTAs، hero controls، floating controls، أو عناصر premium.
لا تحول الصفحة كلها إلى زجاج.

### الأحجام

```
xs:  px-3  py-1.5  text-xs   (12px)
sm:  px-3.5 py-2  text-sm   (14px)
md:  px-5  py-2.5 text-sm   (14px) ← المعيار
lg:  px-6  py-3   text-base (16px)
xl:  px-8  py-4   text-base (16px)
```

```
borderRadius: 12px (rounded-xl) — دائماً
fontWeight: 500-600
transition: all 200ms ease
```

---

## 9. الإدخالات — Inputs

```
الحجم:         px-4 py-2.5 (10px × 16px)
borderRadius:   12px
fontSize:       14px
border:         1px solid rgba(0,0,0,0.08)
background:     white

Focus:
  border: 1px solid #6AABF0
  ring: 2px rgba(106,171,240,0.20)
  outline: none

Error:
  border: 2px solid #EF4444
  background: #FEF2F2

Success:
  border: 2px solid #22C55E
  background: #F0FDF4

Disabled:
  opacity: 0.5
  cursor: not-allowed

أيقونة داخل الإدخال:
  position: absolute
  right: 14px (في RTL)
  color: #94A3B8
  size: 16px
```

---

## 10. الشارات — Badges

```tsx
// القياس
padding: 4px 12px
borderRadius: 9999px
fontSize: 12px, fontWeight: 500

// الألوان
نشط:    bg rgba(34,197,94,0.10)    color #16A34A   dot #22C55E
معلّق:  bg rgba(245,158,11,0.10)   color #D97706   dot #F59E0B
ملغى:   bg rgba(239,68,68,0.10)    color #DC2626   dot #EF4444
مكتمل:  bg rgba(106,171,240,0.10)  color #2B7BD4   dot #6AABF0
مسودة:  bg rgba(148,163,184,0.10)  color #64748B   dot #94A3B8
```

---

## 11. البطاقات — Cards

```
background: white
border: 1px solid rgba(0,0,0,0.08)
borderRadius: 16px (2xl)
padding: 24px
boxShadow: 0 2px 8px rgba(0,0,0,0.06)

بطاقة داكنة (Popular Pricing):
  background: linear-gradient(160deg, #1A2F4A, #0D1B2A)
  border: 1px solid rgba(106,171,240,0.30)
  boxShadow: 0 8px 40px rgba(106,171,240,0.20)
```

---

## 12. التنبيهات — Alerts

```
Info:
  bg rgba(106,171,240,0.08)  border rgba(106,171,240,0.30)  color #2B7BD4

Success:
  bg rgba(34,197,94,0.08)    border rgba(34,197,94,0.30)    color #16A34A

Warning:
  bg rgba(245,158,11,0.08)   border rgba(245,158,11,0.30)   color #D97706

Error:
  bg rgba(239,68,68,0.08)    border rgba(239,68,68,0.30)    color #DC2626

padding: 14px
borderRadius: 12px
أيقونة: 16px من Huge Icons، تطابق لون الحالة
```

---

## 13. الظلال — Shadows

```
xs:      0 1px 3px rgba(0,0,0,0.06)
sm:      0 2px 8px rgba(0,0,0,0.08)
md:      0 4px 16px rgba(0,0,0,0.10)
lg:      0 8px 32px rgba(0,0,0,0.12)
xl:      0 16px 48px rgba(0,0,0,0.14)

blue-sm: 0 2px 12px rgba(106,171,240,0.25)
blue-md: 0 4px 24px rgba(106,171,240,0.35)
blue-lg: 0 8px 40px rgba(106,171,240,0.40)

glow:    0 0 8px #6AABF0
```

---

## 14. نصف القطر — Border Radius

```
sm:   4px
md:   8px
lg:   12px  ← المعيار (--radius)
xl:   16px
2xl:  20px
full: 9999px
```

---

## 15. الفراغات — Spacing (base 4px)

```
4 → 8 → 12 → 16 → 20 → 24 → 32 → 40 → 48 → 64 → 80 → 96px
```

---

## 16. التصميم للـ RTL

### القواعد

```html
<!-- على عنصر الجذر -->
<div dir="rtl">
```

```css
/* Tailwind RTL-aware classes */
me-*   ms-*    بدلاً من mr-* ml-*
pe-*   ps-*    بدلاً من pr-* pl-*
start-* end-*  بدلاً من left-* right-*
text-start     بدلاً من text-left
```

```
الشريط الجانبي:  على اليمين
المحتوى:         على اليسار
المؤشر النشط:    end-0 (= left: 0 في RTL = يواجه المحتوى)
الأيقونات:       تعكس تلقائياً مع dir="rtl" عند الحاجة
```

### الخط العربي

```css
font-family: 'Rubik Arabic', 'Outfit', system-ui;
line-height: 1.6;  /* أوسع من اللاتيني */
```

---

## 17. الحركة والانتقالات — Motion

```
أزرار / روابط:       transition: all 200ms ease
بطاقات:              transition: border-color 200ms, box-shadow 200ms
Spotlight opacity:   transition: opacity 250ms ease
Sidebar:             transition: width 300ms ease
أنيميشن spinner:     animation: spin 1s linear infinite
```

### motion/react (للـ Active State المتحرك)

```tsx
import { LayoutGroup, motion } from 'motion/react'

<LayoutGroup>
  {items.map(item => (
    <div key={item.id} className="relative">
      {active === item.id && (
        <motion.div layoutId="sidebar-active-bg"
          style={{ background: 'rgba(106,171,240,0.12)', borderRadius: 12 }}
        />
      )}
    </div>
  ))}
</LayoutGroup>
```

---

## 18. التسعير — Pricing

```
3 خطط نموذجية: أساسي → احترافي → مؤسسي (يمكن تعديلها حسب المنتج)

Starter (أساسي):
  bg white, icon StarIcon color #64748B

Pro (احترافي) — Popular:
  bg linear-gradient(160deg, #1A2F4A, #0D1B2A)
  border rgba(106,171,240,0.30)
  shadow 0 8px 40px rgba(106,171,240,0.20)
  شارة: linear-gradient(90deg, #6AABF0, #2B7BD4), color white
  icon DiamondIcon color #6AABF0

Enterprise (مؤسسي):
  bg white, icon CrownIcon color #F59E0B

زر Popular:  background #6AABF0, boxShadow 0 4px 16px rgba(106,171,240,0.40)
زر غيره:    background rgba(106,171,240,0.08), color #2B7BD4
```

---

## 19. البنية التقنية — Tech Stack

```
React 18 + TypeScript
Vite 5+
Tailwind CSS v4

الحزم المطلوبة:
  hugeicons-react         الأيقونات (Huge Icons)
  @hugeicons/react        peer dependency مطلوب
  motion                  import from 'motion/react'
  @radix-ui/*             Accessible primitives
  recharts                الرسوم البيانية
  sonner                  Toast notifications
  date-fns                التواريخ
  tailwind-merge
  clsx
```

### vite.config.ts

```ts
import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    dedupe: ['react', 'react-dom', 'react/jsx-runtime'],
    alias: { '@': path.resolve(__dirname, './src') },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
```

> `resolve.dedupe` ضروري لتجنب تعارض نسخ React عند استخدام motion v12+ (الذي يستخدم Jotai داخلياً).

---

## 20. هيكل ملفات CSS

### src/styles/fonts.css
```css
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Rubik+Arabic:wght@300;400;500;600;700;800;900&display=swap');
```

### src/styles/theme.css (الجزء الجوهري)
```css
@custom-variant dark (&:is(.dark *));
:root {
  --font-sans: 'Rubik', 'Noto Kufi Arabic', system-ui, sans-serif;
  --primary: #6AABF0;
  --primary-foreground: #ffffff;
  --background: #F8FAFC;
  --foreground: #1A1D2A;
  --accent: #EEF5FC;
  --accent-foreground: #1F63B3;
  --border: rgba(0,0,0,0.08);
  --ring: #6AABF0;
  --radius: 0.75rem;
}
@theme inline {
  --color-primary: var(--primary);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-border: var(--border);
  --color-ring: var(--ring);
  /* ... باقي الـ mappings */
}
```

### src/styles/index.css
```css
@import 'tailwindcss';
@import './fonts.css';
@import './theme.css';
```

---

## 21. التوجيه الإبداعي العام — Creative Product Direction

هذه الوثيقة لا تصف قالباً طبياً ولا قالباً جاهزاً لمجال واحد. هي **Generic Design System**
يمكن تطبيقه على SaaS، أدوات AI، منتجات تقنية، منصات تعليم، متاجر، dashboards،
portfolio sites، landing pages، ومنتجات رقمية مختلفة.

### دور المصمم/المهندس الذي يقرأ هذه الوثيقة

أنت تعمل كـ **Senior UI/UX Engineer + Senior Product Engineer + Senior Graphic Design Engineer**.
لديك خبرة في بناء مواقع ومنتجات **creative, premium, human-designed** وليست مجرد صفحات مولدة
من قوالب AI شائعة.

يجب أن تكون النتيجة:
- أصلية بصرياً وليست نسخة من موقع معروف.
- creative جداً مع حس بشري واضح في composition وspacing وtypography وvisual hierarchy.
- متوازنة: غنية بالتفاصيل، لكن ليست مزدحمة أو chaotic.
- لا تبدو كـAI-generated template.
- كل section له شخصية وتركيب بصري واضح، وليس مجرد heading + paragraph + 3 cards.
- استخدم visual storytelling، layering، depth، subtle motion، abstract shapes، imagery،
  charts، product UI previews، أو illustrations عندما تكون مناسبة.
- لا تملأ الصفحة بعناصر بلا وظيفة؛ كل تفصيلة يجب أن تخدم الـcontent أو الـhierarchy.

### كثافة الصفحة — Rich, Not Crowded

الموقع **لا يجب أن يبدو فارغاً**. يجب أن تكون الـsections غنية بصرياً ومليئة بتفاصيل
مدروسة: صور، product mockups، cards، floating elements، gradients، textures،
illustrations، metrics، decorative geometry، أو micro-interactions حسب السياق.

لكن:
- لا تستخدم كل هذه العناصر في كل section.
- اترك breathing room حول العناصر المهمة.
- استخدم الـnegative space كجزء من التصميم، وليس كسبب لترك الصفحة فارغة.
- يجب أن يشعر المستخدم أن الصفحة مصممة بعناية من إنسان، لا أنها مجموعة components موضوعة جنباً إلى جنب.

### الصور والـVisual Content

- عند الحاجة إلى صور، استخدم صوراً حقيقية أو assets مناسبة للسياق.
- **ممنوع تماماً استخدام صور تحتوي على نساء أو بنات.**
- لا تستخدم صور أشخاص نساء في hero، cards، testimonials، avatars، backgrounds، أو decorative imagery.
- إذا احتاج التصميم إلى human imagery، استخدم imagery لا تحتوي على نساء، أو استخدم product imagery،
  architecture، objects، environments، abstract visuals، أو illustrations بدلاً منها.
- لا تجعل الصور مجرد placeholders؛ يجب أن تكون جزءاً حقيقياً من الـcomposition.
- لا تجعل كل section يحتوي على صورة بالقوة؛ اختر الـvisual عندما يضيف قيمة.

### Liquid Glass / Crystal Glass

Liquid Glass هو أسلوب مميز داخل النظام وليس قاعدة إجبارية لكل عنصر.

عند استخدامه يجب أن يكون **فعلياً** وليس مجرد gradient أبيض:
- `backdrop-filter: blur(...)`
- شفافية حقيقية تسمح بإظهار الخلفية من خلال العنصر.
- border شبه زجاجي.
- inner highlight / specular highlight.
- subtle reflection أو light streak.
- shadow وdepth ناعمان.
- contrast واضح مع الخلفية.
- motion أو light shift عند الحاجة.
- لا تستخدم glass على كل cards أو كل sections.
- استخدمه فقط في الأماكن التي تستفيد من الإحساس الزجاجي: primary CTA، floating UI،
  hero controls، premium cards، navigation overlays، أو عناصر تفاعلية محددة.
- يجب أن يبدو **crystal / liquid glass premium** وليس مجرد `opacity + border-radius`.

### Creative Composition

لا تعتمد على grid مكرر من:
`Title → Subtitle → 3 Cards → CTA`.

بدلاً من ذلك، حسب المشروع استخدم:
- asymmetric layouts
- overlapping cards
- floating elements
- large editorial typography
- image + UI composition
- bento compositions عندما تكون مناسبة
- layered backgrounds
- spotlight effects
- scroll-based reveals
- controlled motion
- visual anchors
- unexpected but usable spacing
- strong hero compositions

يجب أن يكون لكل صفحة وsection سبب بصري واضح لوجوده.

---

## 22. قواعد التصميم المطلقة — Non-Negotiable Rules

1. **النظام Generic** — لا تفترض مجالاً معيناً مثل الطب أو التعليم أو التجارة.
2. **#6AABF0 هو اللون الأساسي الافتراضي** — يمكن بناء النظام حوله دون ربطه بمجال طبي.
3. **Primary CTA يجب أن يكون Premium** — استخدم Liquid Glass / Crystal Glass عندما يناسب التكوين.
4. **Liquid Glass ليس إجبارياً لكل العناصر** — استخدمه بانتقائية.
5. **RTL-first دائماً** — `dir="rtl"` على جذر الصفحة عندما يكون المنتج RTL.
6. **Rubik للأرقام والنص اللاتيني** — Noto Kufi Arabic للعربية.
7. **Huge Icons حصراً** — لا Lucide ولا Heroicons ولا غيرها.
8. **SVG inline للرسوم التوضيحية** — عند الحاجة إلى illustrations مخصصة.
9. **SpotlightCard للبطاقات التفاعلية** — تأثير الضوء المتتبع للماوس عند ملاءمته.
10. **لا ظلال صلبة** — كل الظلال rgba شفافة.
11. **الزوايا مستديرة** — الحد الأدنى 8px، المعيار 12px.
12. **الصفحة يجب ألا تكون فارغة** — أضف visual details ذات معنى.
13. **الصفحة يجب ألا تكون مزدحمة** — استخدم hierarchy وspacing للحفاظ على الوضوح.
14. **لا صور لنساء أو بنات** — في أي مكان داخل الموقع.
15. **التصميم يجب أن يكون أصلياً وcreative** — لا تقلد AI templates أو مواقع جاهزة.
16. **لا comments في الكود** — الأسماء الواضحة تشرح نفسها.
17. **لا inline styles إلا للقيم الديناميكية** — Tailwind للبقية.
18. **resolve.dedupe في vite.config.ts** — منع تعارض React + motion.

---

## 23. معيار الجودة النهائي — Final Quality Bar

قبل اعتبار التصميم منتهياً، يجب أن يحقق الآتي:

- هل يبدو كمنتج صممه Senior UI/UX Engineer وProduct Engineer؟
- هل الـvisual hierarchy واضحة من أول نظرة؟
- هل الـprimary CTA بارز وفخم؟
- هل استخدام Liquid Glass انتقائي وحقيقي؟
- هل الصفحة غنية بالتفاصيل دون أن تصبح مزدحمة؟
- هل كل section له composition مختلف ومقصود؟
- هل توجد صور أو visuals حيث تحتاج الصفحة لذلك، بدون صور نساء؟
- هل التصميم يبدو human-crafted وليس AI-template؟
- هل الـspacing، typography، motion، shadows، وradius متناسقة؟
- هل يمكن تطبيق النظام على منتجات ومجالات مختلفة بدون إعادة كتابة النظام من الصفر؟

---

*هذا الملف هو المرجع الكامل لنظام التصميم العام. أي AI agent يتبع هذه المواصفات يجب أن يلتزم بالهوية البصرية والقواعد الإبداعية والتقنية أعلاه مع تكييف المحتوى حسب المنتج والمجال.*
