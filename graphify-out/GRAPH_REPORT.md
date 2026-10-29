# Graph Report - pro-ecommerce  (2026-10-29)

## Corpus Check
- 128 files · ~57,428 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 3, .example 2, .ico 1)

## Summary
- 829 nodes · 1850 edges · 68 communities (50 shown, 18 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 58 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6e043e72`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- apiError
- src/server.ts
- frontend/package.json
- Footer
- app/page.tsx
- Button
- mock-data.ts
- utils/index.ts
- README.md
- subCategory.controller.ts
- Toast.tsx
- product.controller.ts
- AGENTS.md
- reviews.controller.ts
- compilerOptions
- react
- address.controller.ts
- brand.controller.ts
- category.controller.ts
- نظام التصميم العام — Generic Creative Design System
- sovereigneg
- backend/package.json
- dependencies
- user.controller.ts
- compilerOptions
- 11. React Best Practices
- db.ts
- LogoLoop.tsx
- 3. الطباعة — Typography
- 1. Prime Directives (Non-Negotiable)
- 8. Security Rules
- 4. مكتبة الأيقونات — Huge Icons
- 5. الرسومات التوضيحية — UI Illustrations
- Frontend Design
- 4. Architecture & Folder Structure
- HeroSlider.tsx
- 21. التوجيه الإبداعي العام — Creative Product Direction
- 2. نظام الألوان — Color System
- 10. Documentation & Comments
- 7. Performance Rules
- scripts
- client.ts
- api/server.ts
- vercel.json
- 20. هيكل ملفات CSS
- 6. المكوّن المميز — SpotlightCard
- 7. الشريط الجانبي — Sidebar
- 23. Change Impact & API Stability
- 3. Code Quality Rules
- Homepage hero image credits
- ParticlesBackground.tsx
- 16. التصميم للـ RTL
- cookie-parser
- cors
- ejs@^6.0.1
- express-async-handler
- express-rate-limit@^8.7.0
- helmet@^8.3.0
- morgan@^1.12.1
- nodemailer
- nodemon@^3.1.14
- stripe
- @tsconfig/node-lts@^24.0.1
- @types/cors@^2.8.19
- @types/express@^5.0.6
- @types/jsonwebtoken@^9.0.10
- postcss.config.mjs

## God Nodes (most connected - your core abstractions)
1. `apiError` - 61 edges
2. `Button` - 40 edges
3. `express` - 33 edges
4. `Footer()` - 33 edges
5. `Navbar()` - 33 edges
6. `react` - 32 edges
7. `@hugeicons/react` - 29 edges
8. `next` - 24 edges
9. `formatPrice()` - 23 edges
10. `نظام التصميم العام — Generic Creative Design System` - 22 edges

## Surprising Connections (you probably didn't know these)
- `🔒 الأمان` --references--> `allowedTo()`  [INFERRED]
  README.md → backend/src/middlewares/allowedTo.ts
- `🔐 لوحة الأدمن (`/admin`)` --references--> `allowedTo()`  [INFERRED]
  README.md → backend/src/middlewares/allowedTo.ts
- `🔒 الأمان` --references--> `protect()`  [INFERRED]
  README.md → backend/src/middlewares/auth.ts
- `🔐 لوحة الأدمن (`/admin`)` --references--> `protect()`  [INFERRED]
  README.md → backend/src/middlewares/auth.ts
- `4.4 Organization by concern` --references--> `User`  [INFERRED]
  AGENTS.md → frontend/src/shared/types/index.ts

## Import Cycles
- None detected.

## Communities (68 total, 18 thin omitted)

### Community 0 - "apiError"
Cohesion: 0.07
Nodes (63): zod@^4.6.5, addItemToCart(), applyCouponToCart(), clearCart(), getCart(), removeCartItem(), removeCouponFromCart(), updateCartItem() (+55 more)

### Community 1 - "src/server.ts"
Cohesion: 0.07
Nodes (46): allowedTo(), DecodedToken, DecodedToken, protect(), globalError(), cookieOption, forgetPassword(), generateToken() (+38 more)

### Community 2 - "frontend/package.json"
Cohesion: 0.06
Nodes (38): eslintConfig, dependencies, clsx@^2.1.1, @hugeicons/react@^1.1.10, next@16.3.8, react@19.2.8, react-dom@19.2.8, react-icons@^5.7.0 (+30 more)

### Community 3 - "Footer"
Cohesion: 0.15
Nodes (25): nextConfig, AccountPage(), Field(), OrderTracking(), Shell(), CartPage(), EmptyState(), PageShell() (+17 more)

### Community 4 - "app/page.tsx"
Cohesion: 0.13
Nodes (23): CategoriesResponse, Category, HomePage(), ProductsResponse, SubCategories, buildPageHref(), FilterList(), Pagination() (+15 more)

### Community 5 - "Button"
Cohesion: 0.19
Nodes (16): AdminCategoriesBrandsPage(), AdminCouponsPage(), NewProductPage(), LoginPage(), SignupPage(), ForgotPasswordPage(), Shell(), ResetPasswordPage() (+8 more)

### Community 6 - "mock-data.ts"
Cohesion: 0.11
Nodes (24): createdAt(), InvoiceData, InvoiceDoc(), InvoicePage(), paymentLabels, paymentStatusLabels, Shell(), statusLabels (+16 more)

### Community 7 - "utils/index.ts"
Cohesion: 0.19
Nodes (18): AdminCustomersPage(), MockCustomer, AdminOrdersPage(), AdminDashboardPage(), AdminProductsPage(), AdminReviewsPage(), Badge(), BadgeProps (+10 more)

### Community 8 - "README.md"
Cohesion: 0.08
Nodes (25): 1) إعداد قاعدة البيانات, 2) تشغيل الـ Backend, 3) تشغيل الـ Frontend, Backend — `backend/.env`, Frontend — `frontend/.env`, 🚀 التشغيل المحلي, 🧰 التقنيات, 🗃️ العلاقة بين الملفات (+17 more)

### Community 9 - "subCategory.controller.ts"
Cohesion: 0.13
Nodes (20): createSubCategory, deleteSubCategory, getSubCategories, getSubCategoryById, updateSubCategory, addSubCategorieQuery(), deleteSubCategoryQuery(), getAllSubCategories() (+12 more)

### Community 10 - "Toast.tsx"
Cohesion: 0.12
Nodes (20): metadata, outfit, RootLayout(), rubik, dismiss(), emit(), EMPTY, getServerSnapshot() (+12 more)

### Community 11 - "product.controller.ts"
Cohesion: 0.22
Nodes (17): createProduct, deleteProduct, getProductById, getProducts, ProductFilters, ProductInputType, updateProduct, checkBrandQuery() (+9 more)

### Community 12 - "AGENTS.md"
Cohesion: 0.10
Nodes (18): 12. TypeScript Rules, 13. API Design, 14. Database Rules, 15. Logging & Observability, 16. Git Workflow, 17. Testing Philosophy, 18. Accessibility, 19. SEO Rules (+10 more)

### Community 13 - "reviews.controller.ts"
Cohesion: 0.22
Nodes (16): createReview, deleteReview, getAllReviewsByProductId, getAllReviewsForAdmin, getReviewById, updateReview, deleteReviewFromDb(), findReviewById() (+8 more)

### Community 14 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 15 - "react"
Cohesion: 0.20
Nodes (10): AdminLayout(), AddReviewButton(), ReviewDialog(), ReviewDialogProps, ReviewFormData, AdminHeader(), AdminSidebar(), navigationItems (+2 more)

### Community 16 - "address.controller.ts"
Cohesion: 0.24
Nodes (13): createAddress(), deleteAddress(), getAddress, updateAddress(), AddressRow, deleteAddressFromDb(), findAddressByIdAndUserId(), findAddressesByUserId() (+5 more)

### Community 17 - "brand.controller.ts"
Cohesion: 0.24
Nodes (13): createBrand, deleteBrand, getBrandById, getBrands, updateBrand, createBrandQuery(), deleteBrandQuery(), getAllBrands() (+5 more)

### Community 18 - "category.controller.ts"
Cohesion: 0.24
Nodes (13): createCategory, deleteCategory, getCategories, getCategoryById, updateCategory, addCategorieQuery(), deleteCategoryQuery(), getAllCategories() (+5 more)

### Community 19 - "نظام التصميم العام — Generic Creative Design System"
Cohesion: 0.12
Nodes (16): 11. البطاقات — Cards, 12. التنبيهات — Alerts, 13. الظلال — Shadows, 14. نصف القطر — Border Radius, 15. الفراغات — Spacing (base 4px), 17. الحركة والانتقالات — Motion, 18. التسعير — Pricing, 19. البنية التقنية — Tech Stack (+8 more)

### Community 20 - "sovereigneg"
Cohesion: 0.12
Nodes (15): context, output, model, SovereignEG/Qwen3.8-27B-FP8, apiKey, baseURL, provider, sovereigneg (+7 more)

### Community 21 - "backend/package.json"
Cohesion: 0.15
Nodes (14): author, description, devDependencies, eslint@^10.11.0, @types/nodemailer@^8.0.2, engines, node, eslint (+6 more)

### Community 22 - "dependencies"
Cohesion: 0.13
Nodes (15): dependencies, bcryptjs@^3.0.3, express@^5.2.1, jsonwebtoken@^9.0.3, slugify@^1.6.9, @types/cookie-parser@^1.4.10, @types/node@^26.6.3, @types/pg@^8.23.1 (+7 more)

### Community 23 - "user.controller.ts"
Cohesion: 0.26
Nodes (11): createUser, deleteUser, getUserById, getUsers, updateUser, createUserQuery(), deleteUserQuery(), getAllUsers() (+3 more)

### Community 24 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, esModuleInterop, module, moduleResolution, outDir, rootDir, skipLibCheck, strict (+4 more)

### Community 25 - "11. React Best Practices"
Cohesion: 0.20
Nodes (10): 11. React Best Practices, Accessibility, Component design, Context, Effects, Error boundaries & Suspense, Forms & validation, Memoization (+2 more)

### Community 26 - "db.ts"
Cohesion: 0.22
Nodes (5): dotenv@^18.0.3, pg@^8.23.0, __dirname, dotenv, pg

### Community 27 - "LogoLoop.tsx"
Cohesion: 0.31
Nodes (9): ANIMATION_CONFIG, cx(), LogoItem, LogoLoop, LogoLoopProps, toCssLength(), useAnimationLoop(), useImageLoader() (+1 more)

### Community 28 - "3. الطباعة — Typography"
Cohesion: 0.22
Nodes (9): 3. الطباعة — Typography, CSS Font Stack, Outfit — للإنجليزية والأرقام اللاتينية, Rubik Arabic — للعربية, ارتفاع السطر (Line Height), الخطوط المستخدمة, قاعدة استخدام الخطوط, مقياس الأحجام (Size Scale) (+1 more)

### Community 29 - "1. Prime Directives (Non-Negotiable)"
Cohesion: 0.29
Nodes (7): 1.1 Continuous Self-Questioning, 1.2 Mandatory Rule-Compliance Review, 1.3 Never Expose Secrets, 1.4 Think Before Every Change, 1.5 Production-Quality Guarantee, 1.6 Verify, Don't Assume, 1. Prime Directives (Non-Negotiable)

### Community 30 - "8. Security Rules"
Cohesion: 0.29
Nodes (7): 8. Security Rules, Authentication & Authorization, File uploads & storage, Input validation & output handling, Secrets & environment, Secure defaults, Trust boundary

### Community 31 - "4. مكتبة الأيقونات — Huge Icons"
Cohesion: 0.29
Nodes (7): 4. مكتبة الأيقونات — Huge Icons, أيقونات الواجهة (UI Icons), الألوان المستخدمة مع الأيقونات, الأيقونات المتخصصة حسب السياق, التثبيت, طريقة الاستيراد, معايير الأحجام

### Community 32 - "5. الرسومات التوضيحية — UI Illustrations"
Cohesion: 0.29
Nodes (7): 5. الرسومات التوضيحية — UI Illustrations, الرسومات الأساسية المقترحة, المبدأ العام, بالت الألوان المسموح به في الرسوم, حالات الاستخدام, مثال كود رسم توضيحي, معايير الأسلوب

### Community 33 - "Frontend Design"
Cohesion: 0.29
Nodes (6): Design principles, Frontend Design, Ground your designs in the subject matter, More on writing in design, Process: plan, review against the brief, build, critique, Restraint and self-critique

### Community 34 - "4. Architecture & Folder Structure"
Cohesion: 0.33
Nodes (6): 4.1 Guiding shape, 4.2 Module boundaries, 4.3 Dependency direction, 4.4 Organization by concern, 4. Architecture & Folder Structure, User

### Community 35 - "HeroSlider.tsx"
Cohesion: 0.67
Nodes (3): HeroSlider(), HeroSlide, heroSlides

### Community 36 - "21. التوجيه الإبداعي العام — Creative Product Direction"
Cohesion: 0.33
Nodes (6): 21. التوجيه الإبداعي العام — Creative Product Direction, Creative Composition, Liquid Glass / Crystal Glass, الصور والـVisual Content, دور المصمم/المهندس الذي يقرأ هذه الوثيقة, كثافة الصفحة — Rich, Not Crowded

### Community 37 - "2. نظام الألوان — Color System"
Cohesion: 0.33
Nodes (6): 2. نظام الألوان — Color System, CSS Custom Properties, ألوان Glow / Spotlight, الألوان الدلالية (Semantic Colors), اللون الأساسي (Cornflower Blue Scale), المحايدة (Neutrals — Slate Scale)

### Community 38 - "10. Documentation & Comments"
Cohesion: 0.40
Nodes (5): 10. Documentation & Comments, Complex logic blocks, Every exported function gets a doc comment, New dependencies, What not to document

### Community 39 - "7. Performance Rules"
Cohesion: 0.40
Nodes (5): 7. Performance Rules, Bundle & assets, Data fetching / server state, Database / Supabase / Postgres, Frontend / React

### Community 40 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, db:seed, dev, start

### Community 41 - "client.ts"
Cohesion: 0.50
Nodes (4): submitReview(), ApiErrorBody, clientFetch(), getErrorMessage()

### Community 42 - "api/server.ts"
Cohesion: 0.50
Nodes (3): ApiErrorBody, getErrorMessage(), serverFetch()

### Community 43 - "vercel.json"
Cohesion: 0.50
Nodes (3): buildCommand, rewrites, version

### Community 44 - "20. هيكل ملفات CSS"
Cohesion: 0.50
Nodes (4): 20. هيكل ملفات CSS, src/styles/fonts.css, src/styles/index.css, src/styles/theme.css (الجزء الجوهري)

### Community 45 - "6. المكوّن المميز — SpotlightCard"
Cohesion: 0.50
Nodes (4): 6. المكوّن المميز — SpotlightCard, الكود الكامل, الوصف, قيم spotlightColor حسب السياق

### Community 46 - "7. الشريط الجانبي — Sidebar"
Cohesion: 0.50
Nodes (4): 7. الشريط الجانبي — Sidebar, التصميم, اللوغو في الـ Sidebar, حالة Active (النشط)

### Community 47 - "23. Change Impact & API Stability"
Cohesion: 0.67
Nodes (3): 23. Change Impact & API Stability, Before modifying anything shared, What counts as a public contract

### Community 48 - "3. Code Quality Rules"
Cohesion: 0.67
Nodes (3): 3. Code Quality Rules, Always, Never

### Community 51 - "16. التصميم للـ RTL"
Cohesion: 0.67
Nodes (3): 16. التصميم للـ RTL, الخط العربي, القواعد

## Knowledge Gaps
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `express` connect `src/server.ts` to `apiError`, `subCategory.controller.ts`, `product.controller.ts`, `reviews.controller.ts`, `address.controller.ts`, `brand.controller.ts`, `category.controller.ts`, `backend/package.json`, `dependencies`, `user.controller.ts`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Should `apiError` be split into smaller, more focused modules?**
  _Cohesion score 0.06740506329113924 - nodes in this community are weakly interconnected._
- **Why does `User` connect `4. Architecture & Folder Structure` to `mock-data.ts`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Should `src/server.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07490079365079365 - nodes in this community are weakly interconnected._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06341463414634146 - nodes in this community are weakly interconnected._
- **Should `Footer` be split into smaller, more focused modules?**
  _Cohesion score 0.14761904761904762 - nodes in this community are weakly interconnected._
- **Should `app/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1330049261083744 - nodes in this community are weakly interconnected._