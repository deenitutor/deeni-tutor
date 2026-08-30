# Render Deployment & Supabase Guide

Render-এ Next.js অ্যাপ ডিপ্লয় করার জন্য প্রয়োজনীয় সেটিংস:

---

## ১. Render Web Service Settings

Render Dashboard-এ **New Web Service** তৈরি করুন এবং আপনার GitHub রিপোজিটরি কানেক্ট করুন:

| Setting | Value |
| :--- | :--- |
| **Name** | `deenitutor` (অথবা আপনার পছন্দমতো নাম) |
| **Language / Environment** | `Node` |
| **Branch** | `main` (বা আপনার কাজের ব্রাঞ্চ) |
| **Root Directory** | খালি রাখুন (Root ফোল্ডারে থাকলে) |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm run start` |
| **Plan** | Free (বা Starter) |

---

## ২. Environment Variables (Render Dashboard -> Environment)

Render-এ নিচের ভেরিয়েবলগুলো যুক্ত করুন:

```env
NODE_VERSION=20.18.0
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-public-key
GEMINI_API_KEY=your-gemini-api-key
```

> ⚠️ **গুরুত্বপূর্ণ (Status 254 ফিক্স)**: Render ডিফল্টভাবে পুরনো Node.js সংস্করণ চালাতে পারে। তাই `NODE_VERSION=20.18.0` ভেরিয়েবলটি Render Dashboard-এ সেট করলে Next.js 15 কোনো ত্রুটি ছাড়াই সফলভাবে বিল্ড হবে।

---

## ৩. Supabase Database Setup

1. [Supabase Dashboard](https://supabase.com/dashboard)-এ যান এবং আপনার প্রজেক্ট সিলেক্ট করুন।
2. বাম পাশের মেন্যু থেকে **SQL Editor**-এ যান।
3. `lib/supabase/schema.sql` ফাইলের সমস্ত কোড কপি করে SQL Editor-এ পেস্ট করে **Run** বাটনে চাপুন।
4. **Project Settings** -> **API** থেকে:
   - `Project URL` কপি করে `NEXT_PUBLIC_SUPABASE_URL`-এ বসান।
   - `anon public` কী কপি করে `NEXT_PUBLIC_SUPABASE_ANON_KEY`-এ বসান।

---

## ৪. যা যা কনফিগার করা হয়েছে:

- ✅ `package.json`-এ Node 20+ `engines` এবং ক্লিন `build` ও `start` স্ক্রিপ্ট সেট করা হয়েছে।
- ✅ `.nvmrc` এবং `.node-version` যুক্ত করা হয়েছে যাতে Render বিল্ড টাইমে Node.js 20 ব্যবহার করে।
- ✅ `render.yaml` কনফিগারেশন যোগ করা হয়েছে।
- ✅ Supabase Client এবং Auth Context ক্লায়েন্ট ও সার্ভার উভয় স্থানে নিরাপদে কাজ করার জন্য সুরক্ষিত করা হয়েছে।
