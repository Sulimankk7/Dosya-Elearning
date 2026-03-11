import { useState, useEffect } from "react";
import { Sidebar } from "../components/Sidebar";
import { DosyaCard } from "../components/DosyaCard";
import { DosyaButton } from "../components/DosyaButton";
import { DosyaInput } from "../components/DosyaInput";
import { CourseCard } from "../components/CourseCard";
import { User, Camera, BookOpen, Menu } from "lucide-react";
import { profileApi, enrollmentsApi } from "../../services/api";
import type { UserProfile, EnrolledCourse } from "../../types/api";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [purchasedCourses, setPurchasedCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    Promise.all([
      profileApi.get(),
      enrollmentsApi.myCourses().catch(() => ({ courses: [], stats: { enrolled_courses: 0, completion_percentage: 0, certificates: 0, completed_lessons: 0 } })),
    ]).then(([profileData, enrollmentData]) => {
      setProfile(profileData);
      setPurchasedCourses(enrollmentData.courses);
      const nameParts = profileData.full_name.split(' ');
      setFirstName(nameParts[0] || '');
      setLastName(nameParts.slice(1).join(' ') || '');
      setEmail(profileData.email);
      setPhone(profileData.phone || '');
      setBio(profileData.bio || '');
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage("");
    try {
      const updated = await profileApi.update({
        full_name: `${firstName} ${lastName}`.trim(),
        phone,
        bio,
      });
      setProfile(updated);
      setIsEditing(false);
      setMessage("تم حفظ التغييرات بنجاح");
    } catch (err: any) {
      setMessage(err.message || "فشل حفظ التغييرات");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) return;
    try {
      await profileApi.changePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setMessage("تم تغيير كلمة المرور بنجاح");
    } catch (err: any) {
      setMessage(err.message || "فشل تغيير كلمة المرور");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar type="student" />
        <main className="flex-1 p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-card rounded w-1/3" />
            <div className="h-48 bg-card rounded-2xl" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-[100dvh]">
      <Sidebar
        type="student"
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card">
          <h2 className="text-xl font-bold text-primary">DOSYA</h2>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 md:p-8 flex-1">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl mb-2">الملف الشخصي</h1>
              <p className="text-muted-foreground text-base md:text-lg">إدارة معلوماتك الشخصية</p>
            </div>

            {message && (
              <div className="mb-4 p-3 bg-primary/10 border border-primary/30 rounded-xl text-sm text-center">
                {message}
              </div>
            )}

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Profile Card */}
              <div className="lg:col-span-1">
                <DosyaCard className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <User className="w-12 h-12 text-white" />
                    </div>
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                      <Camera className="w-4 h-4 text-primary-foreground" />
                    </button>
                  </div>
                  <h3 className="text-xl mb-1">{profile?.full_name}</h3>
                  <p className="text-muted-foreground mb-4">{email}</p>
                  <span className="inline-block bg-primary/20 text-primary text-sm px-3 py-1 rounded-full">
                    {profile?.role === 'admin' || profile?.role === 'super_admin' ? 'مدير' : 'طالب'}
                  </span>
                </DosyaCard>
              </div>

              {/* Profile Details */}
              <div className="lg:col-span-2 space-y-6">
                <DosyaCard>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h3 className="text-xl">المعلومات الشخصية</h3>
                    <DosyaButton
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto min-h-[44px]"
                      onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                      disabled={saving}
                    >
                      {isEditing ? (saving ? "جاري الحفظ..." : "حفظ التغييرات") : "تعديل"}
                    </DosyaButton>
                  </div>

                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <DosyaInput
                        label="الاسم الأول"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        disabled={!isEditing}
                      />
                      <DosyaInput
                        label="اسم العائلة"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <DosyaInput
                      label="البريد الإلكتروني"
                      value={email}
                      disabled
                    />
                    <DosyaInput
                      label="رقم الهاتف"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={!isEditing}
                    />

                    <div>
                      <label className="block mb-2 text-sm">نبذة عنك</label>
                      <textarea
                        rows={3}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50"
                        placeholder="أخبرنا عن نفسك..."
                      />
                    </div>
                  </div>
                </DosyaCard>

                {/* Change Password */}
                <DosyaCard>
                  <h3 className="text-xl mb-6">تغيير كلمة المرور</h3>
                  <div className="space-y-4">
                    <DosyaInput
                      type="password"
                      label="كلمة المرور الحالية"
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <DosyaInput
                      type="password"
                      label="كلمة المرور الجديدة"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <DosyaButton className="w-full sm:w-auto min-h-[44px]" onClick={handleChangePassword}>
                      تغيير كلمة المرور
                    </DosyaButton>
                  </div>
                </DosyaCard>

                {/* Purchased Courses */}
                <DosyaCard>
                  <h3 className="text-xl mb-6">كورساتي المشتراة</h3>
                  {purchasedCourses.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      {purchasedCourses.map((course) => (
                        <CourseCard key={course.id} {...course} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">لا توجد كورسات مشتراة بعد</p>
                    </div>
                  )}
                </DosyaCard>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
