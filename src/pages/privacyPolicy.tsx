import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import logo from "@/assets/logo.png";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen font-tajawal bg-background text-foreground" dir="rtl">
      {/* Header */}
      <header className="border-b border-border py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="نظام جدولة" className="h-8 w-auto" />
            <span className="text-lg font-bold text-primary">نظام جدولة</span>
          </Link>
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowRight className="h-4 w-4" />
            العودة للرئيسية
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8 text-primary">سياسة الخصوصية</h1>
        <p className="text-muted-foreground mb-8">آخر تحديث: مارس 2026</p>

        <div className="space-y-8 text-foreground/90 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold mb-3">1. جمع البيانات</h2>
            <p>نقوم بجمع البيانات التي تقدمها لنا عند التسجيل أو التواصل معنا، وتشمل: الاسم الكامل، البريد الإلكتروني، رقم الهاتف، اسم المؤسسة التعليمية، والمسمى الوظيفي. لا نجمع أي بيانات حساسة دون موافقتك الصريحة.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">2. استخدام البيانات</h2>
            <p>نستخدم بياناتك للأغراض التالية:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
              <li>تقديم خدماتنا وتحسينها</li>
              <li>التواصل معك بشأن حسابك أو خدماتنا</li>
              <li>إرسال تحديثات ومعلومات تقنية</li>
              <li>تحليل أنماط الاستخدام لتطوير المنتج</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">3. حماية البيانات</h2>
            <p>نلتزم بحماية بياناتك الشخصية باستخدام تقنيات تشفير متقدمة وإجراءات أمنية صارمة. لا نشارك بياناتك مع أطراف ثالثة إلا بموافقتك أو عند الضرورة القانونية.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">4. حقوق المستخدم</h2>
            <p>يحق لك:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
              <li>الوصول إلى بياناتك الشخصية المخزنة لدينا</li>
              <li>طلب تصحيح أو تحديث بياناتك</li>
              <li>طلب حذف بياناتك من أنظمتنا</li>
              <li>الانسحاب من القوائم البريدية في أي وقت</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">5. ملفات تعريف الارتباط (Cookies)</h2>
            <p>نستخدم ملفات تعريف الارتباط لتحسين تجربة التصفح وتحليل حركة المرور على الموقع. يمكنك تعطيل ملفات تعريف الارتباط من إعدادات المتصفح، لكن ذلك قد يؤثر على بعض وظائف الموقع.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">6. التواصل</h2>
            <p>إذا كان لديك أي استفسارات حول سياسة الخصوصية، يمكنك التواصل معنا عبر البريد الإلكتروني أو من خلال صفحة التواصل في الموقع.</p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} نظام جدولة. جميع الحقوق محفوظة.
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
