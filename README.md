<p align="center">
  <h1 align="center">🛍️ برو ستور — متجر إلكتروني متكامل</h1>
  <p align="center">مشروع Full-stack عربي للأجهزة والإلكترونيات: متجر للعملاء + لوحة تحكم للأدمن + دفع عبر Stripe</p>
</p>

---

## 📑 المحتويات

- [نبذة عن المشروع](#-نبذة-عن-المشروع)
- [المميزات](#-المميزات)
- [التقنيات](#-التقنيات)
- [بنية المشروع](#-بنية-المشروع)
- [متطلبات التشغيل](#-متطلبات-التشغيل)
- [التشغيل المحلي](#-التشغيل-المحلي)
- [متغيرات البيئة](#-متغيرات-البيئة)
- [بيانات البذر والحسابات التجريبية](#-بيانات-البذر-والحسابات-التجريبية)
- [الواجهة البرمجية (API)](#-الواجهة-البرمجية-api)
- [مدفوعات Stripe](#-مدفوعات-stripe)
- [النشر على Vercel + Neon](#-النشر-على-vercel--neon)
- [الأمان](#-الأمان)
- [العلاقة بين الملفات](#-العلاقة-بين-الملفات)

---

## 📖 نبذة عن المشروع

منصة تجارة إلكترونية كاملة باللغة العربية لبيع الأجهزة والإلكترونيات، مقسمة إلى جزأين:

| الجزء       | التقنية                           | الوصف                                          |
| ----------- | --------------------------------- | ---------------------------------------------- |
| `frontend/` | Next.js + React + Tailwind        | متجر العملاء (تصفح/سلة/دفع) + لوحة تحكم الأدمن |
| `backend/`  | Express + TypeScript + PostgreSQL | REST API محمي بـ JWT + تكامل Stripe            |

التطبيق يدعم: مصادقة المستخدمين، الأدمن والعميل، السلة مع الكوبونات، الطلبات، المفضلة، التقييمات، العناوين، والدفع بالبطاقة (Stripe) أو عند الاستلام (COD). جاهز للنشر على **Vercel** مع قاعدة **Neon (Postgres)**.

---

## ✨ المميزات

### 👤 جانب العميل

- تسجيل دخول / إنشاء حساب / إعادة تعيين كلمة المرور عبر كود بريدي.
- صفحة رئيسية مع عروض ومنتجات مميزة، وتصفح حسب التصنيف والماركة.
- صفحة منتج: معرض صور، مواصفات، تقييمات، حاسبة **السلة + المفضلة**.
- سلة مشتريات مع **كوبونات خصم** (نسبة أو مبلغ ثابت) تُطبَّق وتُستهلك على السيرفر.
- إتمام الطلب: اختيار عنوان محفوظ أو إدخال جديد، وطريقتا دفع:
  - **الدفع عند الاستلام (COD)**.
  - **بطاقة ائتمانية** عبر Stripe PaymentElement + Webhook يصحّح حالة الطلب.
- صفحة حساب لعرض الطلبات والعناوين، وصفحة مفضلة منفصلة.

### 🔐 لوحة الأدمن (`/admin`)

- لوحة إحصائيات، وإدارة: المنتجات (+ إنشاء/تعديل)، الفئات، الفئات الفرعية، الماركات، الطلبات (تغيير الحالة)، المستخدمين، الكوبونات، التقييمات.
- الحماية عبر `role` على السيرفر + `protect` و`allowedTo` لكل مسار.

---

## 🧰 التقنيات

**Frontend**

- Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4
- @stripe/react-stripe-js + @stripe/stripe-js · sonner (toasts) · framer-motion · hugeicons/react · recharts (إحصائيات الأدمن)

**Backend**

- Express 5 · TypeScript · PostgreSQL (`pg`) · JSON Web Tokens · bcryptjs · zod (تحقق المدخلات) · Nodemailer (إيميلات إعادة التعيين) · stripe SDK · rate-limit · helmet · morgan

---

## 🏗️ بنية المشروع

```
pro-ecommerce/
├── backend/                         # REST API (Express + TS)
│   ├── api/index.ts                 # نقطة دخول Vercel (Serverless)
│   ├── vercel.json
│   ├── scripts/seed.mjs             # إنشاء السكيما + البيانات من src/db
│   └── src/
│       ├── server.ts                # إعداد Express وجميع الراوترات + route الـ webhook
│       ├── config/db.ts             # Pool اتصال (DATABASE_URL أو db_*)
│       ├── db/schema.sql            # مخطط قاعدة البيانات (يعمل كمصدر رسمي)
│       ├── db/data.sql              # بيانات البذر (منتجات/عملاء/كوبونات)
│       ├── middlewares/             # auth (protect) + allowedTo + أخطاء
│       ├── services/stripe.service.ts
│       └── models/                  # نموذج لكل ميزة: controller + repo + routes + validation
│           ├── auth/  user/  category/  subCategory/  brand/
│           ├── product/  rating&reviews/  coupons/  cart/
│           ├── orders/  address/  wishlist/  payments/
│           └── (كل نموذج: *.routes.ts / *.controller.ts / *.repo.ts / *.validation.ts)
└── frontend/                        # واجهة Next.js
    └── src/
        ├── app/                     # الصفحات (App Router)
        │   ├── (auth)/login  (auth)/signup  forgot-password  reset-password
        │   ├── products/  products/[slug]/  categories/  cart/  checkout/  wishlist/  account/
        │   ├── admin/                # dashboard + orders/products/categories/customers/coupons/reviews
        │   └── terms  privacy        # صفحات قانونية
        ├── features/                # auth/ home/ products (مكوّنات ومهام لكل ميزة)
        ├── shared/                  # components/ types/ utils/ (قابلة لإعادة الاستخدام)
        └── lib/api-client.ts        # عميل API موحّد لكل النقاط
```

> كل نموذج في الـ backend يتبع نمطاً ثابتاً: `*.routes.ts` (المسارات) ← `*.controller.ts` (المنطق) ← `*.repo.ts` (SQL) ← `*.validation.ts` (zod).

---

## 📋 متطلبات التشغيل

- **Node.js ≥ 20** و npm.
- **PostgreSQL** محلي (أو حساب Neon للاختبار عبر السحابة).
- حساب Stripe (test mode كافٍ تماماً للتطوير).

---

## 🚀 التشغيل المحلي

### 1) إعداد قاعدة البيانات

أنشئ قاعدة بيانات (`e_commerce` مثلاً) ثم نفّذ البذر — سيُنشئ **كل الجداول** (من `schema.sql`) ويملأها **بالبيانات** (من `data.sql`):

```bash
# إنشاء ملف .env أولاً (راجع قسم متغيرات البيئة)
cd backend
npm install
npm run db:seed
```

> `db:seed` يقرأ `DATABASE_URL` إن وُجدت (Neon)، وإلا يستخدم متغيرات `db_*` المحلية. **تنبيه:** يُنفَّذ `DROP TABLE` أولاً — يعيد بناء قاعدة فارغة بالكامل.

### 2) تشغيل الـ Backend

```bash
cd backend
npm run dev        # يعيد البناء (tsc) ويشغّل nodemon على http://localhost:8000
```

### 3) تشغيل الـ Frontend

```bash
cd frontend
npm install
npm run dev        # Next.js على http://localhost:3000
```

افتح `http://localhost:3000`. سجّل دخولك بحساب من قسم [الحسابات التجريبية](#-بيانات-البذر-والحسابات-التجريبية).

---

## 🔧 متغيرات البيئة

انسخ `.env.example` إلى `.env` في كل مجلد (الملفات التالية مكرسة لذلك):

### Backend — `backend/.env`

| المتغير                                                           | الوصف                                                           |
| ----------------------------------------------------------------- | --------------------------------------------------------------- |
| `PORT`                                                            | منفذ السيرفر (افتراضي 8000)                                     |
| `CORS_URL`                                                        | أصول الفرونت المسموحة، مفصولة بفواصل                            |
| `DATABASE_URL`                                                    | للإنتاج (Vercel + Neon). عند وجودها تغلب على `db_*` وSSL تلقائي |
| `db_host` / `db_port` / `db_user` / `db_password` / `db_database` | إعدادات PostgreSQL المحلية                                      |
| `NODE_ENV`                                                        | `development` / `production`                                    |
| `JWT_SECRET`                                                      | سري لتوقيع التوكن (قيمة عشوائية قوية في الإنتاج)                |
| `EMAIL_USER` / `EMAIL_PASS`                                       | بيانات Nodemailer لإيميلات إعادة التعيين                        |
| `STRIPE_SECRET_KEY`                                               | `sk_test_...` للتطوير، `sk_live_...` للإنتاج                    |
| `STRIPE_WEBHOOK_SECRET`                                           | `whsec_...` لتوقيع الـ webhook (انظر قسم Stripe)                |

### Frontend — `frontend/.env`

| المتغير                              | الوصف                                                                      |
| ------------------------------------ | -------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`                | قاعدة الـ API: `http://localhost:8000` محلياً، أو رابط الـ backend المنشور |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` للتطوير، `pk_live_...` للإنتاج (آمن للاستخدام في المتصفح)    |

> **لا ترفع ملفات `.env` إلى git أبداً** — القاعدة الذهبية موضحة في قسم [الأمان](#-الأمان).

---

## 🌱 بيانات البذر والحسابات التجريبية

### حسابات أدمن (باسورد نص عادي — طلب صريح في بيانات البذر)

| البريد                     | كلمة المرور   | الدور |
| -------------------------- | ------------- | ----- |
| `admin@electrostore.com`   | `Pass0001!23` | admin |
| `manager@electrostore.com` | `Pass0002!23` | admin |

### حسابات عملاء

| البريد           | كلمة المرور   |
| ---------------- | ------------- |
| `user1@mail.com` | `Pass0003!23` |
| `user2@mail.com` | `Pass0004!23` |
| `user3@mail.com` | `Pass0005!23` |

### كوبونات الخصم المثبتة

| الكود           | النوع      | القيمة         |
| --------------- | ---------- | -------------- |
| `WELCOME10`     | percentage | 10%            |
| `SAVE50`        | fixed      | 50             |
| `GAMER15`       | percentage | 15%            |
| `STUDENT5`      | fixed      | 5              |
| `BLACKFRIDAY25` | percentage | 25% (غير فاعل) |
| `NOCOUPON`      | fixed      | 0              |

---

## 🔌 الواجهة البرمجية (API)

القاعدة: `http://localhost:8000`. استجابة موحّدة: `{ success, data }` أو `{ success:false, error:{ code, message } }`.

| المجموعة           | المسارات                                                                                                                                                                                         | الحماية                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| **Auth**           | `POST /auth/signup` · `POST /auth/login` · `GET /auth/me` · `PATCH /auth/me` · `POST /auth/logout` · `POST /auth/forgot-password` · `POST /auth/verify-reset-code` · `POST /auth/reset-password` | me/update/logout محمية  |
| **Users**          | `POST/GET /users` · `GET/PATCH/DELETE /users/:id`                                                                                                                                                | أدمن                    |
| **Categories**     | `POST/GET /categories` · `GET/PATCH/DELETE /categories/:id`                                                                                                                                      | الكتابة للأدمن          |
| **Sub-categories** | `POST/GET /sub-categories` · `GET/PATCH/DELETE /sub-categories/:id`                                                                                                                              | الكتابة للأدمن          |
| **Brands**         | `POST/GET /brands` · `GET/PATCH/DELETE /brands/:id`                                                                                                                                              | الكتابة للأدمن          |
| **Products**       | `POST/GET /products` · `GET/PATCH/DELETE /products/:id`                                                                                                                                          | الكتابة للأدمن          |
| **Reviews**        | `POST /reviews` · `GET /reviews/product/:id` · `GET /reviews` (أدمن) · `GET/PATCH/DELETE /reviews/:id`                                                                                           | للعملاء محمية           |
| **Coupons**        | `POST /coupons/validate` · `POST/GET /coupons` · `DELETE /coupons/:couponId`                                                                                                                     | الكتابة للأدمن          |
| **Cart**           | `GET /cart` · `POST /cart/items` · `PUT /cart/items/:cartItemId` · `DELETE /cart/items/:cartItemId` · `DELETE /cart/clear` · `POST /cart/coupon` · `DELETE /cart/coupon`                         | محمية                   |
| **Orders**         | `POST /orders` · `GET /orders` (أدمن) · `PATCH /orders/:orderId/status` (أدمن) · `GET /orders/my-orders` · `GET /orders/:orderId/invoice`                                                        | محمية                   |
| **Addresses**      | `POST/GET /addresses` · `PATCH/DELETE /addresses/:addressId`                                                                                                                                     | محمية                   |
| **Wishlist**       | `POST/GET /wishlists` · `DELETE /wishlists/:productId`                                                                                                                                           | محمية                   |
| **Payments**       | `POST /payments/process` · `POST /payments/:orderId/cancel`                                                                                                                                      | محمية                   |
| **Webhook**        | `POST /payments/webhook`                                                                                                                                                                         | توقيع Stripe (raw body) |

> **الكوبون server-side:** يُخزَّن على السلة (`carts.coupon_id`)، تظهره `GET /cart` كـ `applied_coupon`، ويُستهلك (يُمسح من السلة + `used_count+1`) عند إنشاء الطلب — لا يُحفظ في `sessionStorage` بالمرة.

---

## 💳 مدفوعات Stripe

### مفاتيح الاختبار

- **Secret key** → `backend/.env` : `STRIPE_SECRET_KEY=sk_test_...`
- **Publishable key** → `frontend/.env` : `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...`

> عند اختيار "بطاقة ائتمانية" في صفحة الدفع تظهر رسالة داخلية ببيانات بطاقة الاختبار.

### الـ Webhook (مطلوب لتحديث الطلب بعد الدفع)

أثناء التطوير المحلي استخدم Stripe CLI:

```bash
npm i -g stripe
stripe login
stripe listen --forward-to localhost:8000/payments/webhook
```

انسخ القيمة `whsec_...` التي يطبعها الأمر إلى `backend/.env`:

```
STRIPE_WEBHOOK_SECRET=whsec_...
```

المسار **مسجَّل قبل `express.json()`** في `server.ts` حتى يستلم الـ request بـ `express.raw()` لتوثيق التوقيع. الأحداث المُعالجة:

- `payment_intent.succeeded` → الدفع `paid` + حالة الطلب `processing`.
- `payment_intent.payment_failed` → الدفع `failed` + تحرير حجز المخزون.

> **مهم:** `whsec_...` يُنشأ من جديد مع كل تشغيل لـ `stripe listen` — اترك النافذة مفتوحة أثناء الاختبار. للإنتاج تحتاج الـ secret الخاص بالـ endpoint الحي من Stripe Dashboard (Developers → Webhooks).

### بطاقة اختبار Stripe

```
الرقم: 4242 4242 4242 4242
التاريخ: أي تاريخ مستقبلي (مثال 12/30)
CVC: 123 · ZIP: 10001
```

---

## 🌍 النشر على Vercel + Neon

1. **قاعدة البيانات:** أنشئ مشروع Neon وخذ `DATABASE_URL`.
2. **البذر على Neon:** `cd backend && DATABASE_URL=postgres://... npm run db:seed`.
3. **Backend على Vercel:** اربط مجلد `backend` — الملف `vercel.json` يعيد كتابة كل الطلبات إلى `api/index.ts` (يمثّل تطبيق Express كاملاً، ويُستثنى فتح المنفذ عند وجود `VERCEL`).
4. **متغيرات بيئة Vercel (Backend):** `DATABASE_URL` · `JWT_SECRET` · `CORS_URL` · `NODE_ENV=production` · `STRIPE_SECRET_KEY` · `STRIPE_WEBHOOK_SECRET` · `EMAIL_USER` · `EMAIL_PASS` · `PORT=8000`.
5. **Webhook حي:** Stripe Dashboard → Developers → Webhooks → Add endpoint بالرابط `https://<backend>.vercel.app/api/payments/webhook` مع الحدثين `payment_intent.succeeded` و`payment_intent.payment_failed`.
6. **Frontend على Vercel:** اربط مجلد `frontend` مع `NEXT_PUBLIC_API_URL=https://<backend>.vercel.app` و`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...`.

---

## 🔒 الأمان

- **المفاتيح الحساسة على السيرفر فقط** (`STRIPE_SECRET_KEY`, `JWT_SECRET`, كلمة مرور DB) — لا تُكتب أبداً في كود الفرونت أو في متغيرات `NEXT_PUBLIC_*` أو في git.
- `NEXT_PUBLIC_*` عامة بطبيعتها (رابط الـ API ومفتاح Stripe النشور فقط).
- كل مسارات الكتابة محمية: `protect` للمستخدمين، و`allowedTo` للأدمن على مستويات RBAC.
- تحقق من المدخلات عبر **zod** على السيرفر، وبيانات Stripe الـ webhook تُوثَّق بالتوقيع `whsec`.
- قاعدة التحقق: **لا تثق بالعميل** — RLS لم يُفعَّل محلياً (مشروع سريع)، وإن أردت طبقة أمنية إضافية للبيانات يمكن إضافة RLS بعد النشر.

---

## 🗃️ العلاقة بين الملفات

- `backend/src/db/schema.sql` — المصدر الرسمي للسكيما (مع فهرس لكل FK وعلاقات `ON DELETE`).
- `backend/src/db/migrate_cascade.sql` — ترحيل قاعدة **قائمة** إليها دون `DROP` (أفضل عمود FK + إلغاء `UNIQUE` من `payments.order_id` + جعل `transaction_ref` قابلاً للفراغ).
- `backend/src/db/data.sql` — بيانات البذر.
- `backend/scripts/seed.mjs` — ينفّذ `schema.sql` ثم `data.sql` محلياً أو على Neon.
- `frontend/src/lib/api-client.ts` — عميل API موحّد تستخدمه كل الصفحات.
- `backend/api/index.ts` + `vercel.json` — نقطة دخول النشر على Vercel.

---

مبروك الوصول لهنا 🎉 المشروع جاهز للتطوير والنشر. أي سؤال مفتوح بخصوص أي جزء — ارجع إلى `AGENTS.md` كمرجع للقبعات المعمارية قبل أي تعديل.
