import { useState, useEffect } from "react"
import constants, { buildPresenceChecklist, METRIC_CONFIG } from "../context/constants.js"
import * as pdfjsLib from "pdfjs-dist"
import { toast } from "react-toastify"

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs"

const ResumeAnalyser = () => {

    const [aiReady, setAiReady] = useState(false)
    const [loading, setLoading] = useState(false)
    const [uploadedFile, setUploadedFile] = useState(null)
    const [analysisResult, setAnalysisResult] = useState(null)
    const [resumeText, setResumeText] = useState("")
    const [presenceChecklist, setPresenceChecklist] = useState([])

    useEffect(() => {
        const interval = setInterval(() => {
            if (window.puter?.ai?.chat) {
                setAiReady(true)
                clearInterval(interval)
            }
        }, 300)

        return () => clearInterval(interval)
    }, [])

    // ✅ FIXED: Proper PDF text extraction
    const extractTextFromPDF = async (file) => {
        const arrayBuffer = await file.arrayBuffer()
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

        let fullText = ""

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum)
            const content = await page.getTextContent()

            const pageText = content.items
                .map(item => item.str)
                .join(" ")

            fullText += pageText + "\n"
        }

        console.log("===== EXTRACTED RESUME TEXT =====")
        console.log(fullText)
        console.log("TEXT LENGTH:", fullText.length)

        return fullText.trim()
    }

    // ✅ AI analysis
    const analyzeResume = async (text) => {
        const prompt = constants.ANALYZE_RESUME_PROMPT.replace(
            "{{DOCUMENT_TEXT}}",
            text
        )

        const response = await window.puter.ai.chat(
            [
                { role: "system", content: "you are an expert resume reviewer" },
                { role: "user", content: prompt }
            ],
            { model: "gpt-4o" }
        )

        const rawContent =
            typeof response === "string"
                ? response
                : response?.message?.content || ""

        // ✅ REMOVE ```json ``` WRAPPERS
        const cleaned = rawContent
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim()

        let result
        try {
            result = JSON.parse(cleaned)
        } catch (err) {
            console.error("RAW AI CONTENT:", rawContent)
            throw new Error("AI returned invalid JSON")
        }

        if (result.error) {
            throw new Error(result.error)
        }

        return result
    }


    const handleFileUpload = async (event) => {
        const file = event.target.files[0]

        // ✅ FIXED: Correct PDF MIME type
        if (!file || file.type !== "application/pdf") {
            toast.error("Please upload a valid PDF file.")
            return
        }

        setUploadedFile(file)
        setLoading(true)
        setAnalysisResult(null)
        setResumeText("")
        setPresenceChecklist([])

        try {
            const text = await extractTextFromPDF(file)

            // ✅ Guard: unreadable resume
            if (!text || text.length < 300) {
                toast.warning(
                    "Resume text could not be read properly. Please upload a text-based resume."
                )
                reset()
                return
            }

            setResumeText(text)
            setPresenceChecklist(buildPresenceChecklist(text))

            const analysis = await analyzeResume(text)
            setAnalysisResult(analysis)

        } catch (error) {
            toast.error(error.message || "An error occurred during resume analysis.")
            reset()
        } finally {
            setLoading(false)
        }
    }

    const reset = () => {
        setUploadedFile(null)
        setLoading(false)
        setAnalysisResult(null)
        setResumeText("")
        setPresenceChecklist([])
    }

    return (
        <div className="min-h-screen bg-main-gradient p-4 sm:p-6 lg:p-8 flex items-center justify-center">
            <div className="max-w-5xl mx-auto w-full">

                <div className="text-center mb-6">
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light bg-gradient-to-r from-cyan-300 via-teal-200 to-sky-300 bg-clip-text text-transparent mb-2">
                        AI Resume Analyser
                    </h1>
                    <p className="text-slate-300 text-sm sm:text-base">
                        Upload your pdf resume to get instant AI feedback
                    </p>
                </div>

                {!uploadedFile && (
                    <div className="upload-area">
                        <div className="upload-zone">
                            <div className="text-4xl sm:text-5xl lg:text-6xl mb-4">📂</div>
                            <h3 className="text-xl sm:text-2xl text-slate-200 mb-2">
                                Upload your Resume
                            </h3>
                            <p className="text-slate-400 mb-4 sm:mb-6 text-sm sm:text-base">
                                PDF files only . Get AI-powered analysis and feedback.
                            </p>

                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={handleFileUpload}
                                disabled={!aiReady || loading}
                                className="hidden"
                                id="file-upload"
                            />

                            <label
                                htmlFor="file-upload"
                                className={`inline-block btn-primary ${!aiReady ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                Choose PDF File
                            </label>
                        </div>
                    </div>
                )}

                {loading && (
                    <div className="p-6 sm:p-8 max-w-md mx-auto">
                        <div className="text-center">
                            <div className="loading-spinner"></div>
                            <h3 className="text-lg sm:text-xl text-slate-200 mb-2">
                                Analyzing Your Resume
                            </h3>
                            <p className="text-slate-400 text-sm sm:text-base">
                                Please wait while our AI reviews your resume...
                            </p>
                        </div>
                    </div>
                )}

                {/* ✅ FIXED JSX condition */}
                {analysisResult && uploadedFile && (
                    <div className="space-y-6 p-4 sm:px-8 lg:px-16">

                        <div className="file-info-card">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="icon-container-xl br-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30">
                                        <span className="text-3xl">📄</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl sm:text-2xl font-medium text-green-500 mb-1">
                                            Analysis Complete
                                        </h3>
                                        <p className="text-slate-300 text-sm break-all">
                                            {uploadedFile.name}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button onClick={reset} className="btn-secondary">
                                        New Analysis
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="score-card">
                            <div className="text-center mb-6">
                                <div className="flex items-center justify-center gap-2 mb-3">
                                    <span className="text-2xl">🏆</span>
                                    <h2 className="text-2xl sm:text-3xl font-bold text-white">
                                        Overall Score
                                    </h2>
                                </div>
                                <div className="relative">
                                    <p className="text-6xl sm:text-7xl font-extrabold text-cyan-400 drop-show-lg">
                                        {analysisResult.overallScore || 0}
                                    </p>
                                </div>
                                <div className={`inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full ${parseInt(analysisResult.overallScore) >= 8 ? "score-status-excellent" : parseInt(analysisResult.overallScore) >= 6 ? "score-status-good" : "score-status-improvement"}`}>
                                    <span className="text-lg">
                                        {parseInt(analysisResult.overallScore) >= 8 ? "🌟" : parseInt(analysisResult.overallScore) >= 6 ? "⭐" : "☆"}
                                    </span>
                                    <span className="font-semibold text-lg">
                                        {parseInt(analysisResult.overallScore) >= 8 ? "Excellent" : parseInt(analysisResult.overallScore) >= 6 ? "Good" : "Needs Improvement"}
                                    </span>
                                </div>
                            </div>

                            <div className="progress-bar">
                                <div className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm 
                        ${parseInt(analysisResult.overallScore) >= 8 ? "progress-excellent" : parseInt(analysisResult.overallScore) >= 6 ? "progress-good" : "progress-improvement"

                                    }`}
                                    style={{ width: `${(parseInt(analysisResult.overallScore) / 10) * 100}%` }}></div>
                            </div>

                            <p className="text-slate-400 text-sm mt-3 text-center font-medium">
                                Score based on Content Quality,Formatting and Keyword Usage
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="feature-card-green group">
                                <div className="bg-green-500/20 icon-container-lg mx-auto mb-3 group-hover:bg-green-400/30 transition-colors">
                                    <span className="text-green-300 text-xl">✔</span>

                                </div>
                                <h4 className="text-green-300 text-sm font-semibold uppercase tracking-wide mb-3">Top Strengths</h4>
                                <div className="space-y-2 text-left">
                                    {analysisResult.strengths.slice(0, 4).map(
                                        (strength, index) => {
                                            return (
                                                <div key={index} className="list-item-green">
                                                    <span className="text-green-2xl mt-0.5">‣</span>
                                                    <span className="text-slate-200 font-medium text-sm leading-relaxed">
                                                        {strength}
                                                    </span>
                                                </div>
                                            )
                                        }
                                    )
                                    }
                                </div>


                            </div>

                            <div className="feature-card-orange group">
                                <div className="bg-orange-500/20 icon-container-lg mx-auto mb-3 group-hover:bg-green-400/30 transition-colors">
                                    <span className="text-orange-300 text-xl">⚡</span>

                                </div>
                                <h4 className="text-orange-300 text-sm font-semibold uppercase tracking-wide mb-3">Main Improvements</h4>
                                <div className="space-y-2 text-left">
                                    {analysisResult.improvements.slice(0, 4).map(
                                        (improvement, index) => {

                                            return (
                                                <div key={index} className="list-item-orange">
                                                    <span className="text-orange-2xl mt-0.5">‣</span>
                                                    <span className="text-slate-200 font-medium text-sm leading-relaxed">{improvement}</span>
                                                </div>
                                            )
                                        }
                                    )}
                                </div>


                            </div>
                        </div>
                        <div className="section-card group">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="icon-container bg-purple-500/20">
                                    <span className="text-purple-300 text-lg">📋</span>
                                </div>
                                <h4 className="text-xl font-bold text-white">
                                    Executive Summary
                                </h4>
                            </div>
                            <div className="summary-box">
                                <p className="text-slate-200 text-sm sm:text-base leading-relaxed">{analysisResult.summary}</p>
                            </div>
                        </div>

                        <div className="section-card group">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="icon-container bg-cyan-500/20">
                                    <span className="text-cyan-300 text-lg">
                                        📊
                                    </span>
                                </div>
                                <h4 className="text-xl font-bold text-white">Performance Metrics</h4>
                            </div>

                            <div className="space-y-4">
                                {METRIC_CONFIG.map((cfg, i) => {
                                    const value = analysisResult.
                                        performanceMetrics?.[cfg.key] ?? cfg.defaultValue;
                                    return (
                                        <div key={i} className="group/item">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg">{cfg.icon}</span>
                                                    <p className="text-slate-200 font-medium">{cfg.label}</p>
                                                </div>
                                                <span className="text-slate-300 font-bold">{value}/10</span>
                                            </div>
                                            <div className="progress-bar-small">
                                                <div className={`h-full bg-gradient-to-r ${cfg.colorClass} rounded-full transition-all duration-1000 ease-out group-hover/item:shadow-lg ${cfg.shadowClass}`}
                                                    style={{ width: `${(value / 10) * 100}%` }}>

                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="section-card group">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="icon-container bg-purple-500/20">
                                    <span className="text-lg text-purple-300">🔍</span>
                                    
                                </div>
                                <h2 className="text-xl font-bold text-purple-400">Resume Insights</h2>
                                <div className="grid gap-4">
                                    <div className="info-box-cyan group/item">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-lg text-cyan-400">🎯</span>
                                            <h3 className="text-cyan-300 font-semibold">Action Items</h3>
                                        </div>

                                        <div className="space-y-2">
                                            {(analysisResult.actionItems || ["Optimize keyword placement for better Ats scoring", "Enhance content with quantifiable achievements"]

                                            ).map((item, index) => (
                                                <div key={index} className="list-item-cyan">
                                                    <span className="text-cyan-400">•</span>
                                                    <span>{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="info-box-emerald group/item">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-lg">🔥</span>
                                            <h3 className="text-emerald-300 font-semibold">Pro Tips</h3>
                                        </div>
                                        <div className="space-y-2">
                                            {(
                                                analysisResult.proTips || ["use action words to start bullet points", "Keep descriptions concise and impactful"

                                                ]
                                            ).map((tip, index) => (
                                                <div key={index} className="list-item-emerald">
                                                    <span className="text-emerald-400">•</span>
                                                    <span>{tip}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="section-card group">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="icon-container bg-violet-500/20">
                                    <span className="text-lg">🚇</span></div>
                                <h2 className="text-violet-400 font-bold">ATS Optimization</h2>
                            </div>

                            <div className="info-box-violet mb-4">
                                <div className="flexitems-start gap-3 mb-3">
                                    <div>
                                        <h3 className="text-violet-300 font-semibold mb-2">What is ATS?</h3>
                                        <p className="text-slate-200 text-sm leading-relaxed">TS (Applicant Tracking System) is software used by companies to automatically collect, scan, and filter job applications before they are reviewed by a human recruiter. It works by analyzing resumes for keywords, skills, job titles, and experience that match the job description. If a resume does not meet the required criteria or is poorly formatted, the ATS may reject it even if the candidate is qualified. This system helps employers handle large numbers of applications efficiently by shortlisting only the most relevant candidates for further review.</p>

                                    </div>
                                </div>
                            </div>

                            <div className="info-box-violet">
                                <div className="flex items-center gap-3 mb-3">
                                        <span className="text-lg">🚇</span>
                                    <h3 className="text-lg text-violet-400 font-semibold">ATS Compatibility Checklist</h3>
                                </div>
                                <div className="space-y-2">
                                    {(presenceChecklist || [

                                    ]

                                    ).map((item,index)=>(
                                        <div key={index} className="flex items-start gap-2 text-slate-200">
                                            <span className={`${item.present ? "text-emerald-400":"text-red-400"}`}>{item.present ? "✅": "❌"}</span>
                                            <span>{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="section-card group">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="icon-container bg-blue-500/20">
                                    <span className="text-lg">🗝️</span></div>
                                <h2 className="text-blue-400 font-bold">Recommended Keywords</h2>
                            </div>
                            <div className="flex flex-wrap gap-3 mb-4">
                                {analysisResult.keywords.map((k,i) =>(
                                    <span key={i} className="keyword-tag group/item">
                                        {k}
                                    </span>
                                ))}
                            </div>
                            <div className="info-box-blue">
                                <p className="text-slate-300 text-sm leading-relaxed flex items-start gap-2">
                                    <span className="text-lg mt-0.5">💡</span>
                                    Consider incorporating these Keywords into your resume for better ATS compatability
                                </p>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

export default ResumeAnalyser
