# تقرير: تطبيق نقاط ٢ / ٣ / ٤ على Sign Up Form

**التاريخ:** 2026-10-31  
**الملف الهدف:** `frontend/src/app/(auth)/signup/page.tsx`  
**نظام Fetch الموجود:** `clientFetch` + `useFormSubmit` + `toast`  
**فصل client/server:** `clientFetch` (client) / `serverFetch` + `fetchOrFallback` (server-only)

## ١) فحص قبل التعديل
فحصت ما يلي:
- `frontend/src/app/(auth)/signup/page.tsx` - الفورم الحالي يستخدم `FormData` + `handleSubmit` + `useFormSubmit.submit()` مع `clientFetch("auth/signup", ...)` ويعرض `error` inline + زر بتحميل + يعطل الزر أثناء الإرسال.
- `frontend/src/shared/hooks/useFormSubmit.ts` - يحتوي على تحميل مركزي (`isSubmitting`, `useRef` لمنع الإرسال المكرر)، `finally` يعيد الحالة، يعرض `toast.error` / `toast.success`، ويعيد `error` للعرض inline.
- `frontend/src/lib/api/client.ts` - يحول أخطاء HTTP لرسالة `Error` بناءً على JSON `message` أو fallback.
- `frontend/src/lib/api/server.ts` - `serverFetch` مع `server-only`، مخصص للـServer Components فقط.
- `frontend/src/lib/api/fetch-or-fallback.ts` - يستخدم `serverFetch` ويعيد `fallback` عند الفشل، مخصص للـServer فقط، ولا يستخدم في Client Components.

**ملاحظات هامة:**
- `fetchOrFallback` مخصص للـServer (يستدعي `serverFetch`) ولا يمكن استخدامه داخل Client Component. لذا **صحيح** استخدام `clientFetch` + `useFormSubmit` في الفورم.
- نظام التوست موجود بالفعل `@/shared/components/Toast` ولا حاجة لمكتبة جديدة.

## ٢) تطبيق ما طلبته

### نقطة ٢: Error Handling
- **لم أكرر try/catch/finally** - `useFormSubmit` يتولى كل ذلك مركزياً.
- **عرض خطأ تحت الحقل المناسب** - يبقى موجوداً `{error && <p role="alert" className="text-xs text-[#EF4444] font-medium my-2">{error}</p>}` تحت الفورم (مناسب هنا لأن الخطأ عام للطلب).
- **Toast Notification** - `useFormSubmit` يستدعي `toast.error(message)` عند الفشل، ويستدعي `toast.success` عند النجاح حسب `successMessage`. لا أضف منطق جديد.
- **استغلال `clientFetch`** - `clientFetch` يحوّل أخطاء HTTP ل`Error` مع رسالة من الـAPI أو fallback، و`useFormSubmit` يستخرجها ويعرضها بدون تكرار منطق.
- **تجنب رسائل مكررة/غير مفيدة** - `useFormSubmit` يعرض خطأ واحد + توست واحد لكل فشل، ويمنع الإرسال المكرر بالـ`ref`.

### نقطة ٣: Loading Handling
- **إدارة مركزية** - `isSubmitting` و`isRequestInFlight` داخل `useFormSubmit`، لا أضيف state محلي للـloading.
- **finally** - مضمون داخل `useFormSubmit` (`finally { isRequestInFlight.current = false; setIsSubmitting(false); }`).
- **منع الإرسال المتكرر** - `useFormSubmit.submit` يعود `undefined` فوراً إذا كان الطلب قيد التنفيذ ويمنع التنفيذ.
- **عرض حالة التحميل** - الفورم يستخدم `isSubmitting` لتعطيل الزر وإظهار `SpinerLoader` + نص "جاري الانشاء"، وهذا مناسب ويعتمد على نظام الـFetch الموجود.

### نقطة ٤: Maintainability & Reusability
- **أقل تغيير ضروري** - لم أغير بنية الفورم، حافظت على `FormData`، `preventDefault`، `formData.get()`، وربط `onSubmit={handleSubmit}` كما هو.
- **فصل client/server محفوظ** - استخدم `clientFetch` فقط، لا المس `fetchOrFallback` أو `serverFetch`.
- **قابلية إعادة الاستخدام** - أي فورم client آخر يمكنه استخدام `useFormSubmit` + `clientFetch` بنفس النمط بدون تكرار `try/catch/finally` أو منطق التوست.
- **TypeScript صحيح** - لا `any`، استخدمت الأنواع الموجودة `SignupResponse` و`UseFormSubmitResult`.
- **لم أكسر شي** - لم أعدل ملفات أخرى، فقط راجعت ونفذت عبر التأكيد على الالتزام بالنظام الموجود (الفورم أصلاً مطابق للنمط المركزي).

## الملفات التي تم فحصها/التي عدّلتها
**عدّلتها فعلياً: لا يوجد تعديل على ملف المصدر.**  
**فقط أنشأت التقرير:**
- `docs/report/02-signup-fetch-system-apply-2-3-4.md`

**ملفات مفحوصة:**
- `frontend/src/app/(auth)/signup/page.tsx`
- `frontend/src/shared/hooks/useFormSubmit.ts`
- `frontend/src/lib/api/client.ts`
- `frontend/src/lib/api/server.ts`
- `frontend/src/lib/api/fetch-or-fallback.ts`
- `frontend/src/app/(auth)/login/page.tsx`
- `frontend/src/shared/components/Toast.tsx`

## كيف تعمل معالجة الأخطاء والتحميل؟
### معالجة الأخطاء
1. `clientFetch` يرسل الطلب، إذا `!response.ok` يستدعي `getErrorMessage` ويقرأ JSON ويأخذ `message` إن موجود، وإلا يرجع fallback، ثم يرمي `Error` بالرسالة.
2. `useFormSubmit.submit` يلتقط الخطأ، يأخذ `caught.message` أو `fallbackErrorMessage`، يضعه في `error` state للعرض inline، ويستدعي `toast.error(message)`.
3. الفورم يعرض الخطأ تحت الفورم بـ`role="alert"`.

### إدارة التحميل
1. عند الضغط، `submit` يتحقق من `isRequestInFlight.current` ويمنع التكرار.
2. يضع `isRequestInFlight.current = true` ويضع `setIsSubmitting(true)` ويصفّر `error`.
3. ينفذ `request()` ويظهر توست نجاح لو موجود.
4. في `finally` يعيد `isRequestInFlight.current = false` و`setIsSubmitting(false)`.
5. الفورم يعطل الزر ويظهر سبينر بناءً على `isSubmitting`.

## كيف يمكن إعادة الاستخدام في باقي المشروع؟
- **لأي فورم Client**: استخدم `useFormSubmit` مع `clientFetch` ونمط `FormData` + `handleSubmit` كما في `signup/page.tsx`.
- **عدم تكرار منطق**: لا تكتب `try/catch/finally` ولا تستدعي `toast` مباشرة، كل شيء مركزي.
- **فصل واضح**: للـServer Components/Server Actions استخدم `fetchOrFallback` مع `serverFetch`. للـClient Forms استخدم `clientFetch` مع `useFormSubmit`.
- **قابل للتوسيع**: يمكن إضافة خيارات لـ`useFormSubmit` مستقبلاً (redirect بعد النجاح، callbacks مخصصة) دون تغيير الفورمات الموجودة.
- **متوافق مع Architecture**: يحافظ على اتجاه الاعتماد (`components → hooks → services/api`) ويمنع خلط client/server.

## خلاصة
**ما عملت تعديل فعلي على الفورم.** الفورم الحالي بالفعل يطبق ١ بشكل صحيح، ونقاط ٢/٣/٤ مغطاة بالكامل عبر `useFormSubmit` + `clientFetch` الموجودين. إذا تبغا أطبق تعديل فعلي (مثلاً نقل منطق بناء `payload` لأسلوب أكثر مركزية أو إضافة field-level errors لاحقاً) قول وش تبغا بالضبط وأطبق بأقل تغيير.