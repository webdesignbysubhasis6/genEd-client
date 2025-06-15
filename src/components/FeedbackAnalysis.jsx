import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { feedbackApi } from "@/utils/api";

const COLORS = {
  POSITIVE: "#4caf50",
  NEUTRAL: "#ffc107",
  NEGATIVE: "#f44336",
};

const FeedbackAnalysis = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [sentimentCount, setSentimentCount] = useState({
    positive: 0,
    neutral: 0,
    negative: 0,
  });

  useEffect(() => {
    fetchFeedbackData();
  }, []);

  const fetchFeedbackData = async () => {
    try {
      const [feedbackRes, countRes] = await Promise.all([
        feedbackApi.get("/feedbacks"),
        feedbackApi.get("/sentiment_counts"),
      ]);
      setFeedbackList(feedbackRes.data);
      setSentimentCount(countRes.data);
    } catch (error) {
      console.error("Error fetching feedback data", error);
    }
  };

  const pieData = [
    { name: "Positive", value: sentimentCount.positive },
    { name: "Neutral", value: sentimentCount.neutral },
    { name: "Negative", value: sentimentCount.negative },
  ];

  const colDefs = [
    { field: "feedback", headerName: "Feedback", flex: 1, filter: true },
    { field: "sentiment", filter: true },
    { field: "score", filter: true },
  ];

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 h-full">
  {/* All Feedback */}
  <div className="w-full md:w-1/2 bg-white border rounded-2xl shadow-xl p-5 transition-transform duration-300 hover:scale-[1.02]">
    <h3 className="text-lg font-semibold mb-4 text-[#1A3A6E]">All Feedback</h3>
    <div className="ag-theme-quartz" style={{ height: 400, width: "100%" }}>
      <AgGridReact
        rowData={feedbackList}
        columnDefs={colDefs}
        pagination
        paginationPageSize={5}
      />
    </div>
  </div>

  {/* Pie Chart */}
  <div className="w-full md:w-1/2 bg-white border rounded-2xl shadow-xl p-5 transition-transform duration-300 hover:scale-[1.02]">
    <h3 className="text-lg font-semibold mb-4 text-[#1A3A6E]">Sentiment Pie Chart</h3>
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            outerRadius={80}
            label
          >
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[entry.name.toUpperCase()]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
</div>

  );
};

export default FeedbackAnalysis;
