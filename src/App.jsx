import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bell,
  Brain,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Clock3,
  FileText,
  Home,
  MapPin,
  Menu,
  MessageSquare,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Upload,
  X,
} from "lucide-react";

const initialIssues = [
  {
    id: "CL-1042",
    title: "Large pothole near main road",
    category: "Road Damage",
    location: "Station Road",
    priority: "High",
    status: "In Progress",
    date: "Today",
    confidence: 96,
  },
  {
    id: "CL-1038",
    title: "Streetlight not working",
    category: "Streetlight",
    location: "Shastri Nagar",
    priority: "Medium",
    status: "Reported",
    date: "Yesterday",
    confidence: 91,
  },
  {
    id: "CL-1029",
    title: "Garbage accumulation",
    category: "Waste Management",
    location: "Market Area",
    priority: "High",
    status: "Resolved",
    date: "2 days ago",
    confidence: 94,
  },
];

function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  const [issues, setIssues] = useState(() => {
    const savedIssues = localStorage.getItem("civicLensIssues");
    return savedIssues ? JSON.parse(savedIssues) : initialIssues;
  });

  const [imageName, setImageName] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const [showReport, setShowReport] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const [search, setSearch] = useState("");
  const [selectedIssue, setSelectedIssue] = useState(null);

  const [reportText, setReportText] = useState("");

  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // --------------------------------------------------
  // SAVE ISSUES TO STATE + LOCAL STORAGE
  // --------------------------------------------------

  const saveIssues = (updatedIssues) => {
    setIssues(updatedIssues);
    localStorage.setItem(
      "civicLensIssues",
      JSON.stringify(updatedIssues)
    );
  };

  // --------------------------------------------------
  // UPDATE ISSUE STATUS
  // --------------------------------------------------

  const updateIssueStatus = (newStatus) => {
    if (!selectedIssue) return;

    const updatedIssue = {
      ...selectedIssue,
      status: newStatus,
    };

    const updatedIssues = issues.map((issue) =>
      issue.id === selectedIssue.id ? updatedIssue : issue
    );

    saveIssues(updatedIssues);
    setSelectedIssue(updatedIssue);
  };

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const text =
        `${issue.title} ${issue.category} ${issue.location}`.toLowerCase();

      return text.includes(search.toLowerCase());
    });
  }, [issues, search]);

  // --------------------------------------------------
  // AI ANALYSIS
  // --------------------------------------------------

  const analyzeReport = () => {
    if (!reportText.trim()) return;

    setIsAnalyzing(true);
    setAnalysis(null);

    setTimeout(() => {
      const text = reportText.toLowerCase();

      let category = "Other Civic Issue";
      let priority = "Medium";
      let confidence = 87;

      if (
        text.includes("pothole") ||
        text.includes("road") ||
        text.includes("street")
      ) {
        category = "Road Damage";
        priority = "High";
        confidence = 96;
      } else if (
        text.includes("garbage") ||
        text.includes("waste") ||
        text.includes("trash")
      ) {
        category = "Waste Management";
        priority = "High";
        confidence = 94;
      } else if (
        text.includes("light") ||
        text.includes("lamp") ||
        text.includes("dark")
      ) {
        category = "Streetlight";
        priority = "Medium";
        confidence = 92;
      } else if (
        text.includes("water") ||
        text.includes("leak") ||
        text.includes("pipe")
      ) {
        category = "Water Supply";
        priority = "High";
        confidence = 90;
      }

      let riskReason = "";
      let department = "";
      let recommendedAction = "";

      if (category === "Road Damage") {
        riskReason =
          "Road damage can create accident risks for drivers, cyclists and pedestrians.";

        department = "Roads & Public Works";

        recommendedAction =
          "Inspect the affected road section and schedule repair.";
      } else if (category === "Waste Management") {
        riskReason =
          "Accumulated waste can create sanitation problems and attract pests.";

        department = "Waste Management";

        recommendedAction =
          "Arrange waste collection and inspect the affected area.";
      } else if (category === "Streetlight") {
        riskReason =
          "Poorly lit streets can reduce visibility for pedestrians and vehicles.";

        department = "Electrical / Street Lighting";

        recommendedAction =
          "Inspect the lighting infrastructure and replace or repair the fixture.";
      } else if (category === "Water Supply") {
        riskReason =
          "Water leaks can waste resources and may damage surrounding infrastructure.";

        department = "Water Supply";

        recommendedAction =
          "Inspect the pipeline and repair the suspected leak.";
      } else {
        riskReason =
          "The reported issue requires routine civic assessment.";

        department = "General Civic Services";

        recommendedAction =
          "Review the report and route it to the appropriate department.";
      }

      setAnalysis({
        category,
        priority,
        confidence,
        riskReason,
        department,
        recommendedAction,

        recommendation:
          priority === "High"
            ? "This issue may require faster municipal attention."
            : "This issue can be routed through the standard civic workflow.",
      });

      setIsAnalyzing(false);
    }, 1200);
  };

  // --------------------------------------------------
  // SUBMIT REPORT
  // --------------------------------------------------

  const submitReport = () => {
    if (!reportText.trim() || !analysis) return;

    const newIssue = {
      id: `CL-${1043 + issues.length}`,

      title:
        reportText.length > 42
          ? `${reportText.substring(0, 42)}...`
          : reportText,

      category: analysis.category,

      location: "Your reported location",

      priority: analysis.priority,

      status: "Reported",

      date: "Just now",

      confidence: analysis.confidence,
    };

    saveIssues([newIssue, ...issues]);

    setShowReport(false);

    setReportText("");
    setImageName("");
    setImagePreview("");

    setAnalysis(null);
    setIsAnalyzing(false);

    setActivePage("Issues");
  };

  // --------------------------------------------------
  // RESET REPORT MODAL
  // --------------------------------------------------

  const resetReport = () => {
    setShowReport(false);

    setReportText("");
    setImageName("");
    setImagePreview("");

    setAnalysis(null);
    setIsAnalyzing(false);
  };

  // --------------------------------------------------
  // NAVIGATION
  // --------------------------------------------------

  const navItems = [
    {
      name: "Dashboard",
      icon: Home,
    },
    {
      name: "Issues",
      icon: CircleDot,
    },
    {
      name: "Impact",
      icon: BarChart3,
    },
  ];

  // --------------------------------------------------
  // DASHBOARD STATS
  // --------------------------------------------------

  const stats = [
    {
      label: "Issues Reported",
      value: "1,284",
      change: "+18%",
      icon: FileText,
    },
    {
      label: "Resolved",
      value: "936",
      change: "+12%",
      icon: CheckCircle2,
    },
    {
      label: "In Progress",
      value: "218",
      change: "+7%",
      icon: Clock3,
    },
    {
      label: "Community Impact",
      value: "4.8K",
      change: "+24%",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="app">
      <style>{`

        /* =====================================================
           GLOBAL
        ===================================================== */

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;

          background: #f6f8fb;
          color: #172033;
        }

        button,
        input,
        textarea,
        select {
          font: inherit;
        }

        button {
          cursor: pointer;
        }

        /* =====================================================
           APP
        ===================================================== */

        .app {
          min-height: 100vh;

          background:
            radial-gradient(
              circle at 85% 5%,
              rgba(37, 99, 235, 0.08),
              transparent 25%
            ),
            #f6f8fb;
        }

        /* =====================================================
           TOP BAR
        ===================================================== */

        .topbar {
          height: 72px;

          background: rgba(255, 255, 255, 0.94);

          border-bottom: 1px solid #e7ebf2;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 0 34px;

          position: sticky;
          top: 0;
          z-index: 20;

          backdrop-filter: blur(12px);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 11px;

          font-size: 21px;
          font-weight: 800;
        }

        .brandMark {
          width: 38px;
          height: 38px;

          border-radius: 11px;

          background:
            linear-gradient(
              135deg,
              #2563eb,
              #4f46e5
            );

          color: white;

          display: grid;
          place-items: center;
        }

        .brand span {
          color: #2563eb;
        }

        .topActions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .iconButton {
          width: 40px;
          height: 40px;

          border: 1px solid #e5e9f0;

          background: white;

          border-radius: 11px;

          display: grid;
          place-items: center;

          color: #526071;
        }

        .iconButton:hover {
          background: #f8fafc;
        }

        .profile {
          display: flex;
          align-items: center;
          gap: 9px;

          margin-left: 6px;
        }

        .avatar {
          width: 37px;
          height: 37px;

          border-radius: 50%;

          background: #e0e7ff;

          color: #3730a3;

          display: grid;
          place-items: center;

          font-weight: 800;
        }

        /* =====================================================
           LAYOUT
        ===================================================== */

        .layout {
          display: flex;

          max-width: 1500px;

          margin: auto;
        }

        .sidebar {
          width: 230px;

          min-height: calc(100vh - 72px);

          background: white;

          border-right: 1px solid #e7ebf2;

          padding: 25px 15px;
        }

        .sideLabel {
          color: #98a2b3;

          text-transform: uppercase;

          font-size: 10px;

          font-weight: 800;

          letter-spacing: 1.2px;

          margin: 0 12px 12px;
        }

        .navButton {
          width: 100%;

          border: 0;

          background: transparent;

          color: #667085;

          display: flex;
          align-items: center;

          gap: 12px;

          padding: 12px;

          border-radius: 10px;

          margin-bottom: 5px;

          font-weight: 600;

          text-align: left;
        }

        .navButton:hover,
        .navButton.active {
          background: #eef4ff;

          color: #2563eb;
        }

        /* =====================================================
           REPORT SIDE CARD
        ===================================================== */

        .reportSide {
          margin-top: 28px;

          padding: 17px;

          border-radius: 15px;

          background:
            linear-gradient(
              145deg,
              #eff6ff,
              #f5f3ff
            );

          border: 1px solid #dce8ff;
        }

        .reportSide strong {
          display: block;

          font-size: 14px;

          margin-bottom: 6px;
        }

        .reportSide p {
          color: #667085;

          font-size: 12px;

          line-height: 1.5;

          margin: 0 0 13px;
        }

        /* =====================================================
           MAIN
        ===================================================== */

        .main {
          flex: 1;

          padding: 32px;

          min-width: 0;
        }

        .pageHeader {
          display: flex;

          align-items: flex-end;

          justify-content: space-between;

          margin-bottom: 26px;

          gap: 20px;
        }

        .eyebrow {
          color: #2563eb;

          font-size: 12px;

          font-weight: 800;

          margin-bottom: 7px;

          letter-spacing: 0.4px;
        }

        h1 {
          margin: 0;

          font-size: 30px;

          letter-spacing: -1px;
        }

        .subtitle {
          margin: 7px 0 0;

          color: #667085;

          font-size: 14px;
        }

        /* =====================================================
           BUTTONS
        ===================================================== */

        .primaryButton {
          border: 0;

          color: white;

          background:
            linear-gradient(
              135deg,
              #2563eb,
              #4f46e5
            );

          padding: 12px 17px;

          border-radius: 10px;

          font-weight: 750;

          display: inline-flex;

          align-items: center;

          gap: 8px;

          box-shadow:
            0 8px 20px
            rgba(37, 99, 235, 0.2);
        }

        .primaryButton:hover {
          transform: translateY(-1px);
        }

        .primaryButton:disabled {
          opacity: 0.5;

          cursor: not-allowed;

          transform: none;
        }

        .secondaryButton {
          border: 1px solid #dce2ea;

          background: white;

          padding: 10px 14px;

          border-radius: 9px;

          font-weight: 700;

          font-size: 12px;
        }

        .secondaryButton:hover {
          background: #f8fafc;
        }

        /* =====================================================
           STATS
        ===================================================== */

        .statsGrid {
          display: grid;

          grid-template-columns:
            repeat(4, 1fr);

          gap: 15px;

          margin-bottom: 20px;
        }

        .statCard,
        .card {
          background: white;

          border: 1px solid #e7ebf2;

          border-radius: 15px;

          box-shadow:
            0 4px 15px
            rgba(16, 24, 40, 0.025);
        }

        .statCard {
          padding: 19px;
        }

        .statTop {
          display: flex;

          justify-content: space-between;

          align-items: center;
        }

        .statIcon {
          width: 37px;
          height: 37px;

          border-radius: 10px;

          background: #eef4ff;

          color: #2563eb;

          display: grid;

          place-items: center;
        }

        .statLabel {
          color: #667085;

          font-size: 12px;

          margin-top: 13px;
        }

        .statValue {
          font-size: 25px;

          font-weight: 800;

          margin: 3px 0;
        }

        .change {
          color: #16a34a;

          font-size: 11px;

          font-weight: 700;
        }

        /* =====================================================
           CONTENT GRID
        ===================================================== */

        .contentGrid {
          display: grid;

          grid-template-columns:
            1.4fr 0.8fr;

          gap: 20px;
        }

        .cardHeader {
          padding: 18px 20px;

          border-bottom:
            1px solid #edf0f5;

          display: flex;

          justify-content: space-between;

          align-items: center;
        }

        .cardTitle {
          font-weight: 800;

          font-size: 15px;
        }

        .viewAll {
          border: 0;

          background: transparent;

          color: #2563eb;

          font-size: 12px;

          font-weight: 700;

          display: inline-flex;

          align-items: center;

          gap: 3px;
        }

        /* =====================================================
           ISSUE ROW
        ===================================================== */

        .issue {
          padding: 17px 20px;

          display: flex;

          align-items: center;

          gap: 13px;

          border-bottom:
            1px solid #f0f2f5;
        }

        .issue:last-child {
          border-bottom: 0;
        }

        .issueIcon {
          width: 42px;
          height: 42px;

          flex: 0 0 42px;

          border-radius: 11px;

          display: grid;

          place-items: center;

          background: #f1f5f9;

          color: #475569;
        }

        .issueInfo {
          flex: 1;

          min-width: 0;
        }

        .issueTitle {
          font-size: 13px;

          font-weight: 750;

          margin-bottom: 4px;
        }

        .issueMeta {
          color: #8a94a6;

          font-size: 11px;
        }

        .badge {
          font-size: 10px;

          padding: 5px 8px;

          border-radius: 999px;

          font-weight: 750;

          white-space: nowrap;
        }

        .high {
          color: #b42318;

          background: #fef3f2;
        }

        .medium {
          color: #b54708;

          background: #fffaeb;
        }

        .resolved {
          color: #027a48;

          background: #ecfdf3;
        }

        .reported {
          color: #175cd3;

          background: #eff8ff;
        }

        .inprogress {
          color: #6941c6;

          background: #f4f3ff;
        }

        /* =====================================================
           MAP
        ===================================================== */

        .map {
          height: 255px;

          position: relative;

          overflow: hidden;

          background:
            linear-gradient(
              30deg,
              transparent 45%,
              rgba(148, 163, 184, 0.18) 46%,
              rgba(148, 163, 184, 0.18) 48%,
              transparent 49%
            ),
            linear-gradient(
              120deg,
              transparent 45%,
              rgba(148, 163, 184, 0.15) 46%,
              rgba(148, 163, 184, 0.15) 48%,
              transparent 49%
            ),
            #eef2f6;
        }

        .map::before,
        .map::after {
          content: "";

          position: absolute;

          background:
            rgba(255, 255, 255, 0.9);

          transform: rotate(-12deg);
        }

        .map::before {
          width: 120%;

          height: 25px;

          top: 105px;

          left: -20px;
        }

        .map::after {
          width: 20px;

          height: 120%;

          top: -30px;

          left: 58%;

          transform: rotate(22deg);
        }

        .pin {
          position: absolute;

          z-index: 2;

          width: 33px;

          height: 33px;

          border-radius:
            50% 50% 50% 0;

          transform: rotate(-45deg);

          display: grid;

          place-items: center;

          box-shadow:
            0 5px 12px
            rgba(0, 0, 0, 0.18);
        }

        .pin span {
          transform: rotate(45deg);

          color: white;

          font-size: 12px;
        }

        .pin1 {
          left: 27%;

          top: 35%;

          background: #ef4444;
        }

        .pin2 {
          left: 63%;

          top: 54%;

          background: #f59e0b;
        }

        .pin3 {
          left: 47%;

          top: 72%;

          background: #22c55e;
        }

        .pin4 {
          left: 77%;

          top: 27%;

          background: #ef4444;
        }

        .mapLegend {
          position: absolute;

          z-index: 5;

          bottom: 12px;

          left: 12px;

          right: 12px;

          background:
            rgba(255, 255, 255, 0.94);

          padding: 9px 12px;

          border-radius: 9px;

          display: flex;

          gap: 15px;

          font-size: 10px;

          color: #667085;
        }

        .legendDot {
          display: inline-block;

          width: 7px;

          height: 7px;

          border-radius: 50%;

          margin-right: 5px;
        }

        /* =====================================================
           AI CARD
        ===================================================== */

        .aiCard {
          margin-top: 20px;

          padding: 20px;

          border-radius: 15px;

          border: 1px solid #dddfff;

          background:
            linear-gradient(
              145deg,
              #f8f7ff,
              #f4f7ff
            );

          box-shadow:
            0 8px 24px
            rgba(49, 46, 129, 0.06);
        }

        .aiTop {
          display: flex;

          align-items: center;

          gap: 11px;
        }

        .aiIcon {
          width: 38px;
          height: 38px;

          border-radius: 10px;

          display: grid;

          place-items: center;

          color: #4f46e5;

          background: #e9e7ff;
        }

        .aiLabel {
          color: #6366f1;

          font-size: 9px;

          font-weight: 800;

          letter-spacing: 1px;
        }

        .aiCard h3 {
          margin: 3px 0 0;

          font-size: 15px;
        }

        .aiCard p {
          color: #667085;

          font-size: 11px;

          line-height: 1.6;

          margin: 14px 0;
        }

        .aiFeatures {
          display: grid;

          gap: 7px;

          margin-bottom: 15px;
        }

        .aiFeature {
          display: flex;

          align-items: center;

          gap: 9px;

          padding: 8px 9px;

          background:
            rgba(255, 255, 255, 0.72);

          border:
            1px solid #e5e7f7;

          border-radius: 9px;
        }

        .aiFeature > span {
          font-size: 9px;

          font-weight: 800;

          color: #6366f1;
        }

        .aiFeature strong {
          display: block;

          font-size: 10px;
        }

        .aiFeature small {
          color: #8a94a6;

          font-size: 9px;
        }

        .aiButton {
          width: 100%;

          border:
            1px solid #cfd1f6;

          background: white;

          color: #4338ca;

          padding: 10px 12px;

          border-radius: 9px;

          font-weight: 750;

          font-size: 11px;
        }

        .aiButton:hover {
          background: #f5f3ff;
        }

        /* =====================================================
           SEARCH
        ===================================================== */

        .searchBox {
          display: flex;

          align-items: center;

          gap: 8px;

          background: white;

          border:
            1px solid #e2e8f0;

          padding: 9px 12px;

          border-radius: 9px;

          width: 230px;
        }

        .searchBox input {
          border: 0;

          outline: 0;

          width: 100%;

          font-size: 12px;
        }

        .issuesPage .card {
          margin-top: 20px;
        }

        /* =====================================================
           IMPACT
        ===================================================== */

        .impactGrid {
          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 18px;
        }

        .impactNumber {
          padding: 22px;
        }

        .impactNumber h2 {
          font-size: 31px;

          margin: 8px 0 3px;
        }

        .impactNumber p {
          color: #667085;

          font-size: 12px;

          margin: 0;
        }

        /* =====================================================
           MODAL
        ===================================================== */

        .modalOverlay {
          position: fixed;

          inset: 0;

          background:
            rgba(15, 23, 42, 0.55);

          z-index: 100;

          display: grid;

          place-items: center;

          padding: 20px;
        }

        .modal {
          width: min(620px, 100%);

          max-height: 90vh;

          overflow-y: auto;

          background: white;

          border-radius: 18px;

          box-shadow:
            0 25px 70px
            rgba(0, 0, 0, 0.25);
        }

        .modalHeader {
          padding: 20px 22px;

          border-bottom:
            1px solid #edf0f5;

          display: flex;

          justify-content: space-between;

          align-items: center;
        }

        .modalHeader h2 {
          margin: 0;

          font-size: 19px;
        }

        .close {
          border: 0;

          background: #f1f5f9;

          width: 34px;

          height: 34px;

          border-radius: 9px;

          display: grid;

          place-items: center;
        }

        .close:hover {
          background: #e2e8f0;
        }

        .modalBody {
          padding: 22px;
        }

        .fieldLabel {
          font-size: 12px;

          font-weight: 750;

          display: block;

          margin-bottom: 8px;
        }

        textarea {
          width: 100%;

          min-height: 115px;

          border:
            1px solid #d9e0ea;

          border-radius: 10px;

          padding: 12px;

          outline: none;

          resize: vertical;
        }

        textarea:focus {
          border-color: #2563eb;

          box-shadow:
            0 0 0 3px
            rgba(37, 99, 235, 0.08);
        }

        /* =====================================================
           UPLOAD
        ===================================================== */

        .upload {
          margin-top: 14px;

          border:
            1.5px dashed #cbd5e1;

          border-radius: 11px;

          padding: 17px;

          display: flex;

          align-items: center;

          gap: 12px;

          cursor: pointer;

          color: #667085;

          font-size: 12px;
        }

        .upload:hover {
          border-color: #2563eb;

          background: #f8fbff;
        }

        .upload input {
          display: none;
        }

        /* =====================================================
           IMAGE PREVIEW
        ===================================================== */

        .imagePreview {
          margin-top: 12px;

          border:
            1px solid #e7ebf2;

          border-radius: 11px;

          padding: 8px;

          background: #f8fafc;
        }

        .imagePreview img {
          width: 100%;

          max-height: 220px;

          object-fit: cover;

          border-radius: 8px;

          display: block;
        }

        .imagePreview span {
          display: block;

          margin-top: 7px;

          font-size: 10px;

          color: #667085;
        }

        /* =====================================================
           AI ANALYSIS
        ===================================================== */

        .analysis {
          margin-top: 18px;

          padding: 15px;

          border-radius: 12px;

          background: #f8fafc;

          border:
            1px solid #e2e8f0;
        }

        .analysisHeader {
          display: flex;

          align-items: center;

          gap: 8px;

          color: #312e81;

          font-weight: 800;

          font-size: 12px;

          margin-bottom: 13px;
        }

        .analysisGrid {
          display: grid;

          grid-template-columns:
            repeat(2, 1fr);

          gap: 9px;
        }

        .analysisItem {
          background: white;

          padding: 12px;

          border-radius: 9px;

          border:
            1px solid #e7ebf2;
        }

        .analysisItem small {
          color: #8a94a6;

          display: block;

          font-size: 9px;

          font-weight: 700;

          letter-spacing: 0.5px;

          margin-bottom: 5px;
        }

        .analysisItem strong {
          font-size: 11px;

          line-height: 1.4;
        }

        .analysisReason {
          grid-column: 1 / -1;

          padding: 12px;

          border-radius: 9px;

          background: #f8f9ff;

          border:
            1px solid #e4e7f7;
        }

        .analysisReason small {
          display: block;

          color: #8a94a6;

          font-size: 9px;

          font-weight: 700;

          letter-spacing: 0.5px;

          margin-bottom: 5px;
        }

        .analysisReason p {
          margin: 0;

          color: #4b5563;

          font-size: 11px;

          line-height: 1.5;
        }

        /* =====================================================
           STATUS CONTROL
        ===================================================== */

        .statusControl {
          margin-top: 18px;

          padding-top: 18px;

          border-top:
            1px solid #edf0f5;
        }

        .statusControl label {
          display: block;

          font-size: 12px;

          font-weight: 750;

          margin-bottom: 8px;
        }

        .statusControl select {
          width: 100%;

          padding: 10px 12px;

          border:
            1px solid #d9e0ea;

          border-radius: 9px;

          background: white;

          outline: none;
        }

        .statusControl select:focus {
          border-color: #2563eb;
        }

        /* =====================================================
           MODAL FOOTER
        ===================================================== */

        .modalFooter {
          padding: 15px 22px;

          border-top:
            1px solid #edf0f5;

          display: flex;

          justify-content: flex-end;

          gap: 9px;
        }

        /* =====================================================
           EMPTY STATE
        ===================================================== */

        .empty {
          padding: 40px;

          text-align: center;

          color: #8a94a6;
        }

        /* =====================================================
           RESPONSIVE
        ===================================================== */

        @media (max-width: 1000px) {
          .statsGrid {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .contentGrid {
            grid-template-columns: 1fr;
          }

          .sidebar {
            width: 190px;
          }
        }

        @media (max-width: 720px) {
          .topbar {
            padding: 0 15px;
          }

          .profile span {
            display: none;
          }

          .sidebar {
            display: none;
          }

          .main {
            padding: 20px 15px;
          }

          .pageHeader {
            align-items: flex-start;

            flex-direction: column;
          }

          .statsGrid {
            grid-template-columns:
              1fr 1fr;
          }

          .impactGrid {
            grid-template-columns: 1fr;
          }

          .searchBox {
            width: 100%;
          }

          .issue {
            flex-wrap: wrap;
          }

          .analysisGrid {
            grid-template-columns: 1fr;
          }
        }

      `}</style>

      {/* =====================================================
          TOP BAR
      ===================================================== */}

      <header className="topbar">
        <div className="brand">
          <div className="brandMark">
            <ShieldCheck size={21} />
          </div>

          Civic<span>Lens</span>
        </div>

        <div className="topActions">
          <button className="iconButton">
            <Bell size={18} />
          </button>

          <div className="profile">
            <div className="avatar">A</div>

            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              Citizen
            </span>
          </div>

          <button
            className="iconButton"
            onClick={() => setShowMenu(!showMenu)}
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
        </div>
      </header>

      {/* =====================================================
          MAIN LAYOUT
      ===================================================== */}

      <div className="layout">

        {/* ===================================================
            SIDEBAR
        =================================================== */}

        <aside className="sidebar">
          <div className="sideLabel">
            Workspace
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={`navButton ${
                  activePage === item.name
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActivePage(item.name)
                }
              >
                <Icon size={17} />

                {item.name}
              </button>
            );
          })}

          <div className="reportSide">
            <strong>
              See something?
            </strong>

            <p>
              Report a civic issue and help
              your community get it resolved.
            </p>

            <button
              className="primaryButton"
              style={{
                width: "100%",
                justifyContent: "center",
                padding: 9,
              }}
              onClick={() =>
                setShowReport(true)
              }
            >
              <Plus size={15} />

              Report Issue
            </button>
          </div>
        </aside>

        {/* ===================================================
            MAIN CONTENT
        =================================================== */}

        <main className="main">

          {/* =================================================
              DASHBOARD
          ================================================= */}

          {activePage === "Dashboard" && (
            <>
              <div className="pageHeader">
                <div>
                  <div className="eyebrow">
                    COMMUNITY COMMAND CENTER
                  </div>

                  <h1>
                    Good morning, Citizen 👋
                  </h1>

                  <p className="subtitle">
                    Here's what's happening in
                    your community today.
                  </p>
                </div>

                <button
                  className="primaryButton"
                  onClick={() =>
                    setShowReport(true)
                  }
                >
                  <Plus size={17} />

                  Report an Issue
                </button>
              </div>

              {/* STATS */}

              <div className="statsGrid">
                {stats.map((stat) => {
                  const Icon = stat.icon;

                  return (
                    <div
                      className="statCard"
                      key={stat.label}
                    >
                      <div className="statTop">
                        <div className="statIcon">
                          <Icon size={18} />
                        </div>

                        <span className="change">
                          {stat.change}
                        </span>
                      </div>

                      <div className="statLabel">
                        {stat.label}
                      </div>

                      <div className="statValue">
                        {stat.value}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CONTENT */}

              <div className="contentGrid">

                {/* RECENT ISSUES */}

                <div className="card">
                  <div className="cardHeader">
                    <span className="cardTitle">
                      Recent Civic Issues
                    </span>

                    <button
                      className="viewAll"
                      onClick={() =>
                        setActivePage("Issues")
                      }
                    >
                      View all
                      <ChevronRight size={12} />
                    </button>
                  </div>

                  {issues
                    .slice(0, 3)
                    .map((issue) => (
                      <IssueRow
                        key={issue.id}
                        issue={issue}
                        onClick={() =>
                          setSelectedIssue(issue)
                        }
                      />
                    ))}
                </div>

                {/* RIGHT SIDE */}

                <div>

                  {/* MAP */}

                  <div className="card">
                    <div className="cardHeader">
                      <span className="cardTitle">
                        Live Issue Map
                      </span>

                      <MapPin
                        size={16}
                        color="#2563eb"
                      />
                    </div>

                    <div className="map">

                      <div className="pin pin1">
                        <span>!</span>
                      </div>

                      <div className="pin pin2">
                        <span>!</span>
                      </div>

                      <div className="pin pin3">
                        <span>✓</span>
                      </div>

                      <div className="pin pin4">
                        <span>!</span>
                      </div>

                      <div className="mapLegend">
                        <span>
                          <i
                            className="legendDot"
                            style={{
                              background:
                                "#ef4444",
                            }}
                          />

                          High priority
                        </span>

                        <span>
                          <i
                            className="legendDot"
                            style={{
                              background:
                                "#f59e0b",
                            }}
                          />

                          Medium
                        </span>

                        <span>
                          <i
                            className="legendDot"
                            style={{
                              background:
                                "#22c55e",
                            }}
                          />

                          Resolved
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* AI CARD */}

                  <div className="aiCard">

                    <div className="aiTop">
                      <div className="aiIcon">
                        <Brain size={19} />
                      </div>

                      <div>
                        <span className="aiLabel">
                          CIVIC INTELLIGENCE
                        </span>

                        <h3>
                          AI-powered civic
                          intelligence
                        </h3>
                      </div>
                    </div>

                    <p>
                      Transform citizen reports
                      into structured civic
                      insights. CivicLens analyzes
                      the description, identifies
                      the issue type, estimates
                      urgency and recommends the
                      next action.
                    </p>

                    <div className="aiFeatures">

                      <div className="aiFeature">
                        <span>01</span>

                        <div>
                          <strong>
                            Classify
                          </strong>

                          <small>
                            Identify the civic issue
                          </small>
                        </div>
                      </div>

                      <div className="aiFeature">
                        <span>02</span>

                        <div>
                          <strong>
                            Assess
                          </strong>

                          <small>
                            Estimate priority and risk
                          </small>
                        </div>
                      </div>

                      <div className="aiFeature">
                        <span>03</span>

                        <div>
                          <strong>
                            Recommend
                          </strong>

                          <small>
                            Suggest the next action
                          </small>
                        </div>
                      </div>

                    </div>

                    <button
                      className="aiButton"
                      onClick={() =>
                        setShowReport(true)
                      }
                    >
                      Try AI Analysis →
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* =================================================
              ISSUES PAGE
          ================================================= */}

          {activePage === "Issues" && (
            <div className="issuesPage">

              <div className="pageHeader">
                <div>
                  <div className="eyebrow">
                    ISSUE MANAGEMENT
                  </div>

                  <h1>
                    Community Issues
                  </h1>

                  <p className="subtitle">
                    Track reported problems from
                    submission to resolution.
                  </p>
                </div>

                <button
                  className="primaryButton"
                  onClick={() =>
                    setShowReport(true)
                  }
                >
                  <Plus size={17} />

                  Report Issue
                </button>
              </div>

              <div className="card">

                <div className="cardHeader">

                  <div className="searchBox">
                    <Search
                      size={15}
                      color="#98a2b3"
                    />

                    <input
                      placeholder="Search issues..."
                      value={search}
                      onChange={(e) =>
                        setSearch(e.target.value)
                      }
                    />
                  </div>

                  <span
                    style={{
                      color: "#667085",
                      fontSize: 12,
                    }}
                  >
                    {filteredIssues.length} issues
                  </span>
                </div>

                {filteredIssues.length ? (
                  filteredIssues.map(
                    (issue) => (
                      <IssueRow
                        key={issue.id}
                        issue={issue}
                        onClick={() =>
                          setSelectedIssue(issue)
                        }
                      />
                    )
                  )
                ) : (
                  <div className="empty">
                    No issues found.
                  </div>
                )}

              </div>
            </div>
          )}

          {/* =================================================
              IMPACT PAGE
          ================================================= */}

          {activePage === "Impact" && (
            <>
              <div className="pageHeader">
                <div>
                  <div className="eyebrow">
                    MEASURABLE CHANGE
                  </div>

                  <h1>
                    Community Impact
                  </h1>

                  <p className="subtitle">
                    Turning citizen reports into
                    measurable improvements.
                  </p>
                </div>
              </div>

              {/* IMPACT NUMBERS */}

              <div className="impactGrid">

                <div className="card impactNumber">
                  <TrendingUp
                    size={20}
                    color="#2563eb"
                  />

                  <h2>
                    {issues.length}
                  </h2>

                  <p>
                    Total civic issues reported
                  </p>
                </div>

                <div className="card impactNumber">
                  <UsersIcon />

                  <h2>
                    {
                      issues.filter(
                        (issue) =>
                          issue.status ===
                          "Resolved"
                      ).length
                    }
                  </h2>

                  <p>
                    Issues successfully resolved
                  </p>
                </div>

                <div className="card impactNumber">
                  <Clock3
                    size={20}
                    color="#2563eb"
                  />

                  <h2>
                    {
                      issues.filter(
                        (issue) =>
                          issue.status ===
                          "In Progress"
                      ).length
                    }
                  </h2>

                  <p>
                    Issues currently being
                    addressed
                  </p>
                </div>

              </div>

              {/* ISSUE CATEGORIES */}

              <div
                className="card"
                style={{
                  marginTop: 20,
                  padding: 25,
                }}
              >
                <div className="cardTitle">
                  Issue Categories
                </div>

                <div
                  style={{
                    marginTop: 18,
                  }}
                >
                  {Object.entries(
                    issues.reduce(
                      (counts, issue) => {
                        counts[issue.category] =
                          (counts[issue.category] ||
                            0) + 1;

                        return counts;
                      },
                      {}
                    )
                  ).map(
                    ([category, count]) => (
                      <div
                        key={category}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent:
                            "space-between",

                          padding: "10px 0",

                          borderBottom:
                            "1px solid #edf0f5",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 12,
                            color: "#475467",
                          }}
                        >
                          {category}
                        </span>

                        <strong
                          style={{
                            fontSize: 12,
                            color: "#312e81",
                          }}
                        >
                          {count}
                        </strong>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* WHY CIVICLENS */}

              <div
                className="card"
                style={{
                  marginTop: 20,
                  padding: 25,
                }}
              >
                <div className="cardTitle">
                  Why CivicLens?
                </div>

                <p
                  style={{
                    color: "#667085",
                    fontSize: 13,
                    lineHeight: 1.7,
                    maxWidth: 750,
                  }}
                >
                  CivicLens creates a transparent
                  bridge between citizens and civic
                  issue workflows. Instead of simply
                  collecting complaints, the platform
                  structures reports, uses
                  AI-assisted classification, tracks
                  progress and makes community impact
                  visible.
                </p>
              </div>
            </>
          )}

        </main>
      </div>

      {/* =====================================================
          REPORT ISSUE MODAL
      ===================================================== */}

      {showReport && (
        <div className="modalOverlay">

          <div className="modal">

            <div className="modalHeader">

              <div>
                <h2>
                  Report a Civic Issue
                </h2>

                <span
                  style={{
                    color: "#8a94a6",
                    fontSize: 11,
                  }}
                >
                  AI-assisted issue
                  classification
                </span>
              </div>

              <button
                className="close"
                onClick={resetReport}
                aria-label="Close report"
              >
                <X size={17} />
              </button>
            </div>

            <div className="modalBody">

              <label className="fieldLabel">
                Describe the problem
              </label>

              <textarea
                placeholder="Example: There is a large pothole near the bus stop and vehicles are having difficulty passing..."
                value={reportText}
                onChange={(e) =>
                  setReportText(e.target.value)
                }
              />

              {/* PHOTO UPLOAD */}

              <label className="upload">

                <Upload size={18} />

                <span>
                  {imageName ||
                    "Upload a photo as evidence"}
                </span>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file =
                      e.target.files[0];

                    if (file) {
                      setImageName(
                        file.name
                      );

                      setImagePreview(
                        URL.createObjectURL(
                          file
                        )
                      );
                    } else {
                      setImageName("");
                      setImagePreview("");
                    }
                  }}
                />
              </label>

              {/* IMAGE PREVIEW */}

              {imagePreview && (
                <div className="imagePreview">

                  <img
                    src={imagePreview}
                    alt="Civic issue evidence"
                  />

                  <span>
                    {imageName}
                  </span>

                </div>
              )}

              {/* AI ANALYZE BUTTON */}

              <button
                className="primaryButton"
                style={{
                  marginTop: 14,
                  width: "100%",
                  justifyContent:
                    "center",
                }}
                onClick={analyzeReport}
                disabled={
                  isAnalyzing ||
                  !reportText.trim()
                }
              >
                <Sparkles size={16} />

                {isAnalyzing
                  ? "Analyzing issue..."
                  : "Analyze with AI"}
              </button>

              {/* AI RESULT */}

              {analysis && (
                <div className="analysis">

                  <div className="analysisHeader">

                    <Brain size={15} />

                    AI Analysis Complete

                  </div>

                  <div className="analysisGrid">

                    <div className="analysisItem">
                      <small>
                        CATEGORY
                      </small>

                      <strong>
                        {analysis.category}
                      </strong>
                    </div>

                    <div className="analysisItem">
                      <small>
                        PRIORITY
                      </small>

                      <strong>
                        {analysis.priority}
                      </strong>
                    </div>

                    <div className="analysisItem">
                      <small>
                        CONFIDENCE
                      </small>

                      <strong>
                        {analysis.confidence}%
                      </strong>
                    </div>

                    <div className="analysisItem">
                      <small>
                        RISK
                      </small>

                      <strong>
                        {analysis.priority ===
                        "High"
                          ? "High Risk"
                          : analysis.priority ===
                            "Medium"
                          ? "Moderate Risk"
                          : "Low Risk"}
                      </strong>
                    </div>

                    <div className="analysisItem">
                      <small>
                        DEPARTMENT
                      </small>

                      <strong>
                        {analysis.department}
                      </strong>
                    </div>

                    <div className="analysisItem">
                      <small>
                        RECOMMENDED ACTION
                      </small>

                      <strong>
                        {analysis.recommendedAction}
                      </strong>
                    </div>

                    <div className="analysisReason">

                      <small>
                        WHY THIS MATTERS
                      </small>

                      <p>
                        {analysis.riskReason}
                      </p>

                    </div>

                  </div>

                  <p
                    style={{
                      color: "#667085",
                      fontSize: 11,
                      margin:
                        "12px 0 0",
                    }}
                  >
                    {
                      analysis.recommendation
                    }
                  </p>

                </div>
              )}

            </div>

            <div className="modalFooter">

              <button
                className="secondaryButton"
                onClick={resetReport}
              >
                Cancel
              </button>

              <button
                className="primaryButton"
                disabled={!analysis}
                onClick={submitReport}
              >
                Submit Report

                <ArrowRight size={15} />
              </button>

            </div>

          </div>

        </div>
      )}

      {/* =====================================================
          ISSUE DETAILS MODAL
      ===================================================== */}

      {selectedIssue && (
        <div className="modalOverlay">

          <div
            className="modal"
            style={{
              maxWidth: 500,
            }}
          >

            <div className="modalHeader">

              <div>
                <h2>
                  Issue Details
                </h2>

                <span
                  style={{
                    color: "#8a94a6",
                    fontSize: 11,
                  }}
                >
                  {selectedIssue.id}
                </span>
              </div>

              <button
                className="close"
                onClick={() =>
                  setSelectedIssue(null)
                }
                aria-label="Close issue details"
              >
                <X size={17} />
              </button>

            </div>

            <div className="modalBody">

              <div
                style={{
                  background: "#f8fafc",
                  borderRadius: 12,
                  padding: 17,
                }}
              >

                <h3
                  style={{
                    margin: "0 0 8px",
                    fontSize: 15,
                  }}
                >
                  {selectedIssue.title}
                </h3>

                <p
                  style={{
                    margin: "0 0 14px",
                    color: "#667085",
                    fontSize: 12,
                  }}
                >
                  {selectedIssue.location}
                </p>

                <div className="analysisGrid">

                  <div className="analysisItem">
                    <small>
                      CATEGORY
                    </small>

                    <strong>
                      {selectedIssue.category}
                    </strong>
                  </div>

                  <div className="analysisItem">
                    <small>
                      PRIORITY
                    </small>

                    <strong>
                      {selectedIssue.priority}
                    </strong>
                  </div>

                  <div className="analysisItem">
                    <small>
                      STATUS
                    </small>

                    <strong>
                      {selectedIssue.status}
                    </strong>
                  </div>

                </div>

                {/* STATUS UPDATE */}

                <div className="statusControl">

                  <label>
                    Update Status
                  </label>

                  <select
                    value={
                      selectedIssue.status
                    }
                    onChange={(e) =>
                      updateIssueStatus(
                        e.target.value
                      )
                    }
                  >
                    <option value="Reported">
                      Reported
                    </option>

                    <option value="In Progress">
                      In Progress
                    </option>

                    <option value="Resolved">
                      Resolved
                    </option>
                  </select>

                </div>

              </div>

              <div
                style={{
                  marginTop: 15,
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  color: "#667085",
                  fontSize: 12,
                }}
              >
                <MessageSquare size={16} />

                Community report received{" "}
                {selectedIssue.date}.
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

/* ===========================================================
   ISSUE ROW COMPONENT
=========================================================== */

function IssueRow({ issue, onClick }) {
  const priorityClass =
    issue.priority === "High"
      ? "high"
      : issue.priority === "Medium"
      ? "medium"
      : "resolved";

  const statusClass =
    issue.status === "Resolved"
      ? "resolved"
      : issue.status === "In Progress"
      ? "inprogress"
      : "reported";

  return (
    <div
      className="issue"
      onClick={onClick}
      style={{
        cursor: "pointer",
      }}
    >

      <div className="issueIcon">

        {issue.category ===
        "Road Damage" ? (
          <AlertTriangle size={19} />
        ) : issue.category ===
          "Streetlight" ? (
          <CircleDot size={19} />
        ) : (
          <FileText size={19} />
        )}

      </div>

      <div className="issueInfo">

        <div className="issueTitle">
          {issue.title}
        </div>

        <div className="issueMeta">
          {issue.category} •{" "}
          {issue.location} •{" "}
          {issue.date}
        </div>

      </div>

      <span
        className={`badge ${priorityClass}`}
      >
        {issue.priority}
      </span>

      <span
        className={`badge ${statusClass}`}
      >
        {issue.status}
      </span>

    </div>
  );
}

/* ===========================================================
   USERS ICON
=========================================================== */

function UsersIcon() {
  return (
    <div
      style={{
        width: 20,
        height: 20,

        borderRadius: "50%",

        background: "#2563eb",

        display: "grid",

        placeItems: "center",

        color: "white",

        fontSize: 10,

        fontWeight: 800,
      }}
    >
      +
    </div>
  );
}

export default App;