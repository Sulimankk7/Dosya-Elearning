import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { DosyaCard } from "../components/DosyaCard";
import { DosyaInput } from "../components/DosyaInput";
import { DosyaButton } from "../components/DosyaButton";
import { authApi } from "../../services/api";

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);

        try {
            await authApi.resetPassword(token!, password);

            setMessage("تم تغيير كلمة المرور بنجاح");

            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (error) {
            setMessage("فشل تغيير كلمة المرور");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-md">

                <DosyaCard>

                    <h2 className="text-2xl text-center mb-6">
                        إعادة تعيين كلمة المرور
                    </h2>

                    {message && (
                        <div className="text-center mb-4 text-sm">
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <DosyaInput
                            type="password"
                            label="كلمة المرور الجديدة"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <DosyaButton
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? "جارٍ التغيير..." : "تغيير كلمة المرور"}
                        </DosyaButton>

                    </form>

                </DosyaCard>

            </div>
        </div>
    );
}