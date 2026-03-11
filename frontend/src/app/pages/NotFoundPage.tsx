import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { DosyaButton } from "../components/DosyaButton";

export default function NotFoundPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
            <div className="w-24 h-24 bg-secondary/50 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="w-12 h-12 text-muted-foreground" />
            </div>
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <h2 className="text-2xl mb-6">عذراً، الصفحة غير موجودة</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                يبدو أنك انتقلت إلى رابط غير صحيح أو أن الصفحة التي تبحث عنها قد تم نقلها.
            </p>
            <Link to="/">
                <DosyaButton>العودة للصفحة الرئيسية</DosyaButton>
            </Link>
        </div>
    );
}
