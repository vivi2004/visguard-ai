// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import MainLayout from "@/components/MainLayout"
import Login from "@/pages/Login"
import Signup from "@/pages/Signup"
import Upload from "@/features/upload/Upload"
import Analysis from "@/features/analysis/Analyze"
import AnalyzePage from "@/features/analysis/AnalyzePage" // ✅ make sure the file name matches
import Feedback from "@/features/feedback/Feedback"
import HistoryPage from "@/features/history/HistoryPage"


export default function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/analyze" element={<AnalyzePage />} /> {/* ✅ Added this route */}
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </Router>
  )
}


