import Header from "@/components/Header";
import FeedbackPage from "@/features/feedback/FeedbackPage";

export default function Feedback() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Header />
            <div className="p-10">
                <FeedbackPage />
            </div>
        </div>
    );
}  