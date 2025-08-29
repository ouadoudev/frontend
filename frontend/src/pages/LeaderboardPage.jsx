import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ExamLeaderboard from "../components/dashboard/exam/ExamLeaderboard";

const LeaderboardPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <ExamLeaderboard
        examId={examId}
        showHeader={true}
        maxEntries={50}
        compact={false}
      />
    </div>
  );
};

export default LeaderboardPage;
