import Header from "@/components/Header";
import UploadBox from "@/features/upload/UploadBox";

export default function Upload() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Header />
            <div className="flex justify-center p-10">
                <UploadBox />
            </div>
        </div>
    );
}
