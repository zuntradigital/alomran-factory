# دليل الإعداد والإدارة — Al Omran Precast Factory
# System Setup & Management Guide

---

## الفهرس / Table of Contents

1. [كيفية إنشاء أول مدير](#first-admin)
2. [كيفية تسجيل الدخول](#login)
3. [إضافة مستخدمين جدد](#add-users)
4. [تغيير كلمة المرور](#change-password)
5. [تحديث معلومات الشركة](#company-settings)
6. [إدارة الأدوار والصلاحيات](#roles)
7. [تفعيل / تعطيل المستخدمين](#toggle-users)
8. [أين توجد بيانات الاعتماد](#credentials)
9. [قواعد الأمان في Firestore](#security-rules)
10. [ترقية إلى Firebase Auth (اختياري)](#firebase-auth-upgrade)

---

## 1. إنشاء أول مدير (لمرة واحدة) {#first-admin}

```bash
# من داخل مجلد backend
node setup-first-admin.js <البريد الإلكتروني> <كلمة المرور> <الاسم>

# مثال
node setup-first-admin.js admin@company.com TempPass123 "Ahmed Al-Omran"
```

**ملاحظة:** قم بتغيير كلمة المرور فور تسجيل الدخول الأول.

---

## 2. كيفية تسجيل الدخول {#login}

### لوحة التحكم المستقلة (Dashboard)
- URL: `http://localhost:5174` (للتطوير)
- أو اذهب إلى رابط النطاق الإنتاجي

### لوحة تحكم الموقع المدمجة (Website Admin)
- URL: `http://localhost:5173/admin/login` (للتطوير)

---

## 3. إضافة مستخدمين جدد {#add-users}

### من خلال لوحة التحكم (Dashboard):
1. تسجيل الدخول كـ مدير (admin)
2. اضغط على "المستخدمون" في الشريط الجانبي
3. اضغط "+ إضافة مستخدم"
4. أدخل:
   - الاسم الكامل
   - البريد الإلكتروني
   - كلمة المرور (8 أحرف على الأقل)
   - الدور (مدير / محرر / مشاهد)
5. اضغط "إضافة"

### عبر API (للمطورين):
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"email":"user@company.com","password":"Pass@1234","displayName":"اسم المستخدم","role":"editor"}'
```

---

## 4. تغيير كلمة المرور {#change-password}

### من خلال API:
```bash
curl -X PUT http://localhost:5000/api/users/<user-id>/password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"newPassword":"NewPass@2024"}'
```

**قواعد كلمة المرور:**
- 8 أحرف على الأقل
- يُنصح باستخدام حروف كبيرة وصغيرة وأرقام ورموز

---

## 5. تحديث معلومات الشركة {#company-settings}

### من لوحة التحكم:
1. تسجيل الدخول
2. اضغط "إعدادات الشركة" في الشريط الجانبي
3. قم بتعديل:
   - اسم الشركة (عربي / إنجليزي)
   - أرقام الهواتف
   - العناوين
   - البريد الإلكتروني
   - روابط التواصل الاجتماعي
   - رابط Google Maps
4. اضغط "حفظ الإعدادات"

**الإعدادات محفوظة في Firestore** في `settings/company` ومتاحة للقراءة من الموقع العام.

---

## 6. إدارة الأدوار والصلاحيات {#roles}

| الدور   | القراءة | الكتابة | حذف المنتجات | إدارة المستخدمين |
|---------|---------|---------|-------------|-----------------|
| admin   | ✅      | ✅      | ✅          | ✅              |
| editor  | ✅      | ✅      | ❌          | ❌              |
| viewer  | ✅      | ❌      | ❌          | ❌              |

### تغيير دور مستخدم:
1. لوحة التحكم → المستخدمون
2. ابحث عن المستخدم
3. (قريباً: نموذج التعديل)

أو عبر API:
```bash
curl -X PUT http://localhost:5000/api/users/<id> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"role":"editor"}'
```

---

## 7. تفعيل / تعطيل المستخدمين {#toggle-users}

من لوحة التحكم:
- اضغط "تعطيل" بجانب المستخدم لمنعه من الدخول
- اضغط "تفعيل" لإعادة تفعيله

المستخدم المعطل لن يتمكن من تسجيل الدخول حتى لو عنده كلمة المرور الصحيحة.

---

## 8. أين توجد بيانات الاعتماد {#credentials}

### ملفات البيئة:
```
backend/.env          ← Firebase Admin SDK credentials, JWT secret
website/.env          ← API URL
dashboard/.env        ← لا يوجد حتى الآن (أو أضف VITE_API_URL)
```

### Firestore Collections:
```
users/      ← بيانات المستخدمين (كلمات المرور مشفرة bcrypt)
admins/     ← المستخدمون القديمون (legacy)
products/   ← المنتجات (129 منتج)
inquiries/  ← استفسارات العملاء من الموقع
settings/   ← إعدادات الشركة
```

### JWT Secret:
موجود في `backend/.env` → `JWT_SECRET`
**غيّره في الإنتاج!**

---

## 9. قواعد أمان Firestore {#security-rules}

الملف: `firestore.rules`

لنشر القواعد:
1. Firebase Console → Firestore → Rules
2. انسخ محتوى `firestore.rules`
3. اضغط Publish

أو عبر Firebase CLI:
```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules
```

---

## 10. Firebase Authentication (مفعّل) {#firebase-auth-upgrade}

Firebase Auth مفعّل بالكامل. الميزات المتاحة:
- ✅ تسجيل الدخول بالبريد الإلكتروني وكلمة المرور
- ✅ تسجيل الدخول بـ Google
- ✅ نسيان كلمة المرور (إرسال رابط للبريد)
- ✅ تغيير كلمة المرور من لوحة التحكم
- ✅ حماية الحسابات المعطلة

### ملف الإعدادات:
```
dashboard/.env
website/.env
# كلاهما يحتويان على Firebase web app config
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=al-omran-factory.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=al-omran-factory
...
```

### آلية العمل:
1. المستخدم يسجل الدخول عبر Firebase Auth (email/password أو Google)
2. Firebase يعطي ID token
3. الـ ID token يُرسل للخادم: `POST /api/auth/firebase-login`
4. الخادم يتحقق من التوكن ويُصدر JWT
5. JWT يُستخدم لجميع طلبات API اللاحقة

---

## هيكل الملفات الرئيسية

```
alomran-factory/
├── backend/
│   ├── .env                    ← Firebase credentials (لا تشاركه!)
│   ├── src/index.js            ← API server (المنطق الرئيسي)
│   ├── seed-products.js        ← بذر 129 منتج في Firestore
│   └── setup-first-admin.js   ← إنشاء أول مدير
├── dashboard/                  ← لوحة التحكم (port 5174)
├── website/                    ← الموقع العام (port 5173)
│   └── src/pages/admin/        ← لوحة تحكم مدمجة في الموقع
├── firestore.rules             ← قواعد أمان Firestore
└── SETUP_FOR_CLIENT.md         ← هذا الملف
```

---

## الأوامر المهمة

```bash
# تشغيل الخادم
cd backend && npm run dev     # بـ nodemon (تطوير)
cd backend && npm start       # production

# تشغيل الموقع
cd website && npm run dev     # http://localhost:5173

# تشغيل لوحة التحكم
cd dashboard && npm run dev   # http://localhost:5174

# بذر المنتجات (عند الحاجة)
cd backend && node seed-products.js

# إنشاء مدير جديد
cd backend && node setup-first-admin.js email@example.com Pass@1234 "الاسم"
```

---

*Al Omran Precast Factory — Admin System v2.0*
*نظام آمن بكلمات مرور مشفرة bcrypt + JWT + Firebase Firestore*
