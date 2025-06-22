import Header from "@/components/Header";
import HistoryPage from "@/features/history/HistoryPage";

export default function History() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Header />
            <div className="p-10">
                <HistoryPage />
            </div>
        </div>
    );
}  