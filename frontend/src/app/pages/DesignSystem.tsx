import { Link } from "react-router-dom";
import { DosyaButton } from "../components/DosyaButton";
import { DosyaCard } from "../components/DosyaCard";
import { DosyaInput } from "../components/DosyaInput";
import { StatusBadge } from "../components/StatusBadge";
import { VideoPlayer } from "../components/VideoPlayer";
import { BookOpen, Home, User, Star, CheckCircle } from "lucide-react";

export default function DesignSystem() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link to="/" className="inline-block mb-4 text-primary hover:underline">
            ← العودة للصفحة الرئيسية
          </Link>
          <h1 className="text-5xl mb-4">نظام التصميم - DOSYA</h1>
          <p className="text-xl text-muted-foreground">
            دليل شامل لجميع مكونات وعناصر التصميم المستخدمة في المنصة
          </p>
        </div>
        
        {/* Color Tokens */}
        <section className="mb-16">
          <h2 className="text-3xl mb-6">نظام الألوان</h2>
          <DosyaCard>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="h-24 rounded-xl bg-[#0B1220] mb-3 border border-border" />
                <p className="mb-1">Deep Navy</p>
                <p className="text-sm text-muted-foreground">#0B1220</p>
              </div>
              <div>
                <div className="h-24 rounded-xl bg-[#111827] mb-3 border border-border" />
                <p className="mb-1">Surface Navy</p>
                <p className="text-sm text-muted-foreground">#111827</p>
              </div>
              <div>
                <div className="h-24 rounded-xl bg-[#22C55E] mb-3" />
                <p className="mb-1">Primary Green</p>
                <p className="text-sm text-muted-foreground">#22C55E</p>
              </div>
              <div>
                <div className="h-24 rounded-xl bg-[#3B82F6] mb-3" />
                <p className="mb-1">Accent Blue</p>
                <p className="text-sm text-muted-foreground">#3B82F6</p>
              </div>
              <div>
                <div className="h-24 rounded-xl bg-[#64748B] mb-3" />
                <p className="mb-1">Soft Gray</p>
                <p className="text-sm text-muted-foreground">#64748B</p>
              </div>
              <div>
                <div className="h-24 rounded-xl bg-[#EF4444] mb-3" />
                <p className="mb-1">Error Red</p>
                <p className="text-sm text-muted-foreground">#EF4444</p>
              </div>
              <div>
                <div className="h-24 rounded-xl bg-[#F59E0B] mb-3" />
                <p className="mb-1">Warning Amber</p>
                <p className="text-sm text-muted-foreground">#F59E0B</p>
              </div>
              <div>
                <div className="h-24 rounded-xl bg-[#F1F5F9] mb-3" />
                <p className="mb-1">Foreground</p>
                <p className="text-sm text-muted-foreground">#F1F5F9</p>
              </div>
            </div>
          </DosyaCard>
        </section>
        
        {/* Typography */}
        <section className="mb-16">
          <h2 className="text-3xl mb-6">الطباعة</h2>
          <DosyaCard className="space-y-6">
            <div>
              <h1 className="mb-2">Heading 1 - عنوان رئيسي كبير</h1>
              <p className="text-sm text-muted-foreground">Font: Cairo, Weight: 600, Size: 2.5rem</p>
            </div>
            <div>
              <h2 className="mb-2">Heading 2 - عنوان رئيسي متوسط</h2>
              <p className="text-sm text-muted-foreground">Font: Cairo, Weight: 600, Size: 2rem</p>
            </div>
            <div>
              <h3 className="mb-2">Heading 3 - عنوان فرعي</h3>
              <p className="text-sm text-muted-foreground">Font: Cairo, Weight: 600, Size: 1.5rem</p>
            </div>
            <div>
              <h4 className="mb-2">Heading 4 - عنوان صغير</h4>
              <p className="text-sm text-muted-foreground">Font: Cairo, Weight: 600, Size: 1.25rem</p>
            </div>
            <div>
              <p className="mb-2">Body Text - هذا نص عادي يستخدم في المحتوى الأساسي</p>
              <p className="text-sm text-muted-foreground">Font: Cairo, Weight: 400, Size: 1rem</p>
            </div>
            <div>
              <p className="text-sm mb-2">Small Text - نص صغير للتفاصيل والملاحظات</p>
              <p className="text-sm text-muted-foreground">Font: Cairo, Weight: 400, Size: 0.875rem</p>
            </div>
          </DosyaCard>
        </section>
        
        {/* Spacing */}
        <section className="mb-16">
          <h2 className="text-3xl mb-6">نظام المسافات</h2>
          <DosyaCard>
            <div className="space-y-4">
              {[4, 8, 12, 16, 24, 32, 48, 64].map((size) => (
                <div key={size} className="flex items-center gap-4">
                  <div className="w-20 text-sm text-muted-foreground">{size}px</div>
                  <div className="h-8 bg-primary rounded" style={{ width: `${size}px` }} />
                </div>
              ))}
            </div>
          </DosyaCard>
        </section>
        
        {/* Buttons */}
        <section className="mb-16">
          <h2 className="text-3xl mb-6">الأزرار</h2>
          <DosyaCard>
            <div className="space-y-6">
              <div>
                <h4 className="mb-4">الأنماط</h4>
                <div className="flex flex-wrap gap-4">
                  <DosyaButton variant="primary">Primary Button</DosyaButton>
                  <DosyaButton variant="secondary">Secondary Button</DosyaButton>
                  <DosyaButton variant="outline">Outline Button</DosyaButton>
                  <DosyaButton variant="ghost">Ghost Button</DosyaButton>
                </div>
              </div>
              
              <div>
                <h4 className="mb-4">الأحجام</h4>
                <div className="flex flex-wrap items-center gap-4">
                  <DosyaButton size="sm">Small</DosyaButton>
                  <DosyaButton size="md">Medium</DosyaButton>
                  <DosyaButton size="lg">Large</DosyaButton>
                </div>
              </div>
              
              <div>
                <h4 className="mb-4">مع الأيقونات</h4>
                <div className="flex flex-wrap gap-4">
                  <DosyaButton>
                    <Home className="w-5 h-5" />
                    مع أيقونة
                  </DosyaButton>
                  <DosyaButton variant="outline">
                    <User className="w-5 h-5" />
                    Outline مع أيقونة
                  </DosyaButton>
                </div>
              </div>
              
              <div>
                <h4 className="mb-4">حالات خاصة</h4>
                <div className="flex flex-wrap gap-4">
                  <DosyaButton disabled>معطل</DosyaButton>
                  <DosyaButton className="w-full">زر بعرض كامل</DosyaButton>
                </div>
              </div>
            </div>
          </DosyaCard>
        </section>
        
        {/* Input Fields */}
        <section className="mb-16">
          <h2 className="text-3xl mb-6">حقول الإدخال</h2>
          <DosyaCard>
            <div className="space-y-6 max-w-lg">
              <DosyaInput label="حقل نصي عادي" placeholder="أدخل النص هنا..." />
              <DosyaInput label="البريد الإلكتروني" type="email" placeholder="example@domain.com" />
              <DosyaInput label="كلمة المرور" type="password" placeholder="••••••••" />
              <DosyaInput label="حقل مع خطأ" error="هذا الحقل مطلوب" placeholder="حقل بخطأ" />
              <div>
                <label className="block mb-2 text-sm">Textarea</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="أدخل نص متعدد الأسطر..."
                />
              </div>
              <div>
                <label className="block mb-2 text-sm">Dropdown</label>
                <select className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all">
                  <option>الخيار الأول</option>
                  <option>الخيار الثاني</option>
                  <option>الخيار الثالث</option>
                </select>
              </div>
            </div>
          </DosyaCard>
        </section>
        
        {/* Cards */}
        <section className="mb-16">
          <h2 className="text-3xl mb-6">البطاقات</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <DosyaCard>
              <h3 className="text-xl mb-2">بطاقة عادية</h3>
              <p className="text-muted-foreground">
                هذه بطاقة عادية بتصميم بسيط ونظيف
              </p>
            </DosyaCard>
            
            <DosyaCard glass>
              <h3 className="text-xl mb-2">بطاقة Glass</h3>
              <p className="text-muted-foreground">
                بطاقة بتأثير زجاجي شفاف
              </p>
            </DosyaCard>
            
            <DosyaCard className="bg-primary/10 border-2 border-primary/30">
              <h3 className="text-xl mb-2">بطاقة مميزة</h3>
              <p className="text-muted-foreground">
                بطاقة بخلفية وحدود ملونة
              </p>
            </DosyaCard>
            
            <DosyaCard className="hover:shadow-xl transition-all cursor-pointer">
              <h3 className="text-xl mb-2">بطاقة تفاعلية</h3>
              <p className="text-muted-foreground">
                بطاقة بتأثير عند التمرير
              </p>
            </DosyaCard>
          </div>
        </section>
        
        {/* Status Badges */}
        <section className="mb-16">
          <h2 className="text-3xl mb-6">شارات الحالة</h2>
          <DosyaCard>
            <div className="flex flex-wrap gap-4">
              <StatusBadge status="active">نشط</StatusBadge>
              <StatusBadge status="inactive">غير نشط</StatusBadge>
              <StatusBadge status="completed">مكتمل</StatusBadge>
              <StatusBadge status="locked">مقفل</StatusBadge>
              <StatusBadge status="pending">قيد الانتظار</StatusBadge>
            </div>
          </DosyaCard>
        </section>
        
        {/* Video Player */}
        <section className="mb-16">
          <h2 className="text-3xl mb-6">مشغل الفيديو</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="mb-4">عادي</h4>
              <VideoPlayer />
            </div>
            <div>
              <h4 className="mb-4">مقفل</h4>
              <VideoPlayer locked />
            </div>
          </div>
        </section>
        
        {/* Icons */}
        <section className="mb-16">
          <h2 className="text-3xl mb-6">الأيقونات</h2>
          <DosyaCard>
            <p className="text-muted-foreground mb-6">استخدام مكتبة Lucide React</p>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-6">
              {[Home, BookOpen, User, Star, CheckCircle].map((Icon, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">{Icon.name}</p>
                </div>
              ))}
            </div>
          </DosyaCard>
        </section>
        
        {/* Shadows */}
        <section className="mb-16">
          <h2 className="text-3xl mb-6">الظلال</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <DosyaCard className="shadow-sm">
              <h4 className="mb-2">Shadow Small</h4>
              <p className="text-sm text-muted-foreground">shadow-sm</p>
            </DosyaCard>
            <DosyaCard className="shadow-lg">
              <h4 className="mb-2">Shadow Large</h4>
              <p className="text-sm text-muted-foreground">shadow-lg</p>
            </DosyaCard>
            <DosyaCard className="shadow-xl shadow-primary/20">
              <h4 className="mb-2">Shadow XL with Color</h4>
              <p className="text-sm text-muted-foreground">shadow-xl shadow-primary/20</p>
            </DosyaCard>
          </div>
        </section>
        
        {/* Grid System */}
        <section className="mb-16">
          <h2 className="text-3xl mb-6">نظام الشبكة</h2>
          <DosyaCard>
            <div className="space-y-4">
              <div className="grid grid-cols-12 gap-4">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="bg-primary/20 rounded-lg p-4 text-center text-sm">
                    {i + 1}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-accent/20 rounded-lg p-4 text-center text-sm">
                    {i + 1}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-primary/20 rounded-lg p-4 text-center text-sm">
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </DosyaCard>
        </section>
        
        {/* Border Radius */}
        <section className="mb-16">
          <h2 className="text-3xl mb-6">نصف القطر (Border Radius)</h2>
          <DosyaCard>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="h-24 bg-primary/20 rounded-lg mb-3" />
                <p className="text-sm">rounded-lg (0.5rem)</p>
              </div>
              <div>
                <div className="h-24 bg-primary/20 rounded-xl mb-3" />
                <p className="text-sm">rounded-xl (0.75rem)</p>
              </div>
              <div>
                <div className="h-24 bg-primary/20 rounded-2xl mb-3" />
                <p className="text-sm">rounded-2xl (1rem)</p>
              </div>
              <div>
                <div className="h-24 bg-primary/20 rounded-full mb-3" />
                <p className="text-sm">rounded-full</p>
              </div>
            </div>
          </DosyaCard>
        </section>
      </div>
    </div>
  );
}
