import Header from "@/components/Header";
import AnalysisResult from "@/features/analysis/AnalyzePage";

export default function Analysis() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Header />
            <div className="p-10">
                <AnalysisResult />
            </div>
        </div>
    );
}  