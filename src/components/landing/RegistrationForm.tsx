import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Send, Sparkles, Loader2 } from "lucide-react";

const countryCodes = [
  { code: "+966", country: "السعودية", flag: "🇸🇦" },
  { code: "+965", country: "الكويت", flag: "🇰🇼" },
  { code: "+971", country: "الإمارات", flag: "🇦🇪" },
  { code: "+973", country: "البحرين", flag: "🇧🇭" },
  { code: "+974", country: "قطر", flag: "🇶🇦" },
  { code: "+968", country: "عمان", flag: "🇴🇲" },
  { code: "+20", country: "مصر", flag: "🇪🇬" },
  { code: "+962", country: "الأردن", flag: "🇯🇴" },
  { code: "+961", country: "لبنان", flag: "🇱🇧" },
  { code: "+963", country: "سوريا", flag: "🇸🇾" },
  { code: "+964", country: "العراق", flag: "🇮🇶" },
  { code: "+967", country: "اليمن", flag: "🇾🇪" },
  { code: "+212", country: "المغرب", flag: "🇲🇦" },
  { code: "+213", country: "الجزائر", flag: "🇩🇿" },
  { code: "+216", country: "تونس", flag: "🇹🇳" },
  { code: "+218", country: "ليبيا", flag: "🇱🇾" },
  { code: "+249", country: "السودان", flag: "🇸🇩" },
  { code: "+970", country: "فلسطين", flag: "🇵🇸" },
  { code: "+1", country: "أمريكا/كندا", flag: "🇺🇸" },
  { code: "+44", country: "بريطانيا", flag: "🇬🇧" },
  { code: "+33", country: "فرنسا", flag: "🇫🇷" },
  { code: "+49", country: "ألمانيا", flag: "🇩🇪" },
  { code: "+91", country: "الهند", flag: "🇮🇳" },
  { code: "+92", country: "باكستان", flag: "🇵🇰" },
  { code: "+90", country: "تركيا", flag: "🇹🇷" },
];

const formSchema = z.object({
  fullName: z.string().trim().min(3, "الاسم يجب أن يكون 3 أحرف على الأقل").max(100),
  email: z.string().trim().email("البريد الإلكتروني غير صحيح").max(255),
  countryCode: z.string().min(1, "رمز الدولة مطلوب"),
  phone: z.string().trim().min(7, "رقم الهاتف غير صحيح").max(15),
  institution: z.string().trim().min(2, "اسم المؤسسة مطلوب").max(200),
  jobTitle: z.string().trim().min(2, "المسمى الوظيفي مطلوب").max(100),
  studentCount: z.string().min(1, "عدد الطلاب مطلوب"),
  notes: z.string().max(500).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface RegistrationFormProps {
  formRef: React.RefObject<HTMLDivElement>;
}

const RegistrationForm = ({ formRef }: RegistrationFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      countryCode: "+965",
      phone: "",
      institution: "",
      jobTitle: "",
      studentCount: "",
      notes: "",
    },
  });

 const onSubmit = async (data: FormData) => {
  setIsSubmitting(true);
  try {
    const fullPhone = `${data.countryCode} ${data.phone}`;
    
    // 1. إرسال البيانات إلى Supabase (الكود الحالي)
    const { error } = await supabase.from("leads").insert({
      full_name: data.fullName,
      email: data.email,
      phone: fullPhone,
      institution: data.institution,
      job_title: data.jobTitle,
      student_count: data.studentCount,
      notes: data.notes || null,
    });

    if (error) {
      console.error("Error submitting lead:", error);
      toast({
        variant: "destructive",
        title: "خطأ في التسجيل",
        description: "حدث خطأ أثناء إرسال البيانات. يرجى المحاولة مرة أخرى.",
      });
    } else {
      // 2. إرسال إشعار الواتساب (الكود الحالي)
      try {
        await supabase.functions.invoke('send-whatsapp-notification', {
          body: {
            fullName: data.fullName,
            email: data.email,
            phone: fullPhone,
            institution: data.institution,
            jobTitle: data.jobTitle,
            studentCount: data.studentCount,
            notes: data.notes,
          },
        });
        console.log("WhatsApp notification sent successfully");
      } catch (notificationError) {
        console.error("Failed to send WhatsApp notification:", notificationError);
      }

      // ==========================================
      // 3. الجزء الجديد: إرسال البيانات إلى n8n
      // ==========================================
      try {
        // استبدل الرابط أدناه برابط Webhook الخاص بك من n8n
        await fetch('https://8n8.connectsys.cloud/webhook/389ad680-0529-4b59-b5fe-ae864e1bcd24', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullName: data.fullName,
            email: data.email,
            phone: fullPhone,
            institution: data.institution,
            jobTitle: data.jobTitle,
            studentCount: data.studentCount,
            notes: data.notes || "لا يوجد",
          }),
        });
        console.log("n8n webhook triggered successfully");
      } catch (n8nError) {
        console.error("Failed to trigger n8n webhook:", n8nError);
      }
      // ==========================================

      toast({
        title: "تم التسجيل بنجاح! 🎉",
        description: "سنتواصل معك قريباً",
      });
      form.reset();
    }
  } catch (error) {
    console.error("Error:", error);
    toast({
      variant: "destructive",
      title: "خطأ",
      description: "حدث خطأ غير متوقع",
    });
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <section id="register" className="py-24 relative" ref={formRef}>
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10" dir="rtl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-primary-text">سجل اهتمامك الآن</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            احصل على عرض تجريبي مجاني واكتشف كيف يمكن لنظام جدولة تحويل إدارة جداولك
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="glass-card border-0 shadow-glow overflow-hidden">
            <CardHeader className="text-center pb-2">
              <CardTitle className="flex items-center justify-center gap-2 text-xl">
                <Sparkles className="w-5 h-5 text-accent" />
                نموذج التسجيل
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الاسم الكامل *</FormLabel>
                          <FormControl>
                            <Input placeholder="أدخل اسمك الكامل" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>البريد الإلكتروني *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="example@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormItem className="md:col-span-2">
                      <FormLabel>رقم الهاتف *</FormLabel>
                      <div className="flex gap-2">
                        <FormField
                          control={form.control}
                          name="countryCode"
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="w-32 bg-card">
                                  <SelectValue placeholder="الدولة" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-card border border-border z-50 max-h-60">
                                {countryCodes.map((country) => (
                                  <SelectItem key={country.code} value={country.code}>
                                    <span className="flex items-center gap-2">
                                      <span>{country.flag}</span>
                                      <span>{country.code}</span>
                                    </span>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormControl>
                              <Input 
                                type="tel" 
                                placeholder="5XX XXX XXXX" 
                                className="flex-1"
                                dir="ltr"
                                {...field} 
                              />
                            </FormControl>
                          )}
                        />
                      </div>
                      <FormMessage />
                    </FormItem>

                    <FormField
                      control={form.control}
                      name="institution"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>المؤسسة التعليمية *</FormLabel>
                          <FormControl>
                            <Input placeholder="اسم الجامعة أو المعهد" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="jobTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>المسمى الوظيفي *</FormLabel>
                          <FormControl>
                            <Input placeholder="مثال: رئيس قسم" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="studentCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>عدد الطلاب المتوقع *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر النطاق" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="less-100">أقل من 100</SelectItem>
                              <SelectItem value="100-500">100 - 500</SelectItem>
                              <SelectItem value="500-1000">500 - 1000</SelectItem>
                              <SelectItem value="1000-5000">1000 - 5000</SelectItem>
                              <SelectItem value="more-5000">أكثر من 5000</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ملاحظات إضافية (اختياري)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="أي متطلبات خاصة أو استفسارات..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full gradient-primary text-primary-foreground hover:opacity-90 shadow-glow text-lg py-6"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        إرسال الطلب
                        <Send className="w-5 h-5 mr-2" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default RegistrationForm;
