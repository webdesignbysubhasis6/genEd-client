import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { feedbackApi } from "@/utils/api";

const FeedbackForm = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const submitFeedback = async () => {
    if (!text.trim()) return toast("Feedback cannot be empty.");
    setLoading(true);
    try {
      const res = await feedbackApi.post("/feedback", { text });
      toast.success(res.data.message || "Feedback submitted!");
      setText("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit feedback.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 border rounded-lg shadow-sm h-full w-full">
      <h2 className="text-xl font-bold mb-2">Submit Feedback</h2>
      <textarea
        className="w-full border rounded p-2 mb-4"
        rows={12}
        placeholder="Enter your feedback here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button onClick={submitFeedback} disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
      </Button>
    </div>
  );
};

export default FeedbackForm;
