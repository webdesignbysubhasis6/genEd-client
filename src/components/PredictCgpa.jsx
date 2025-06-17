import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from './ui/input';
import { cgpaApi } from '@/utils/api';
import { toast } from 'sonner';
import { LoaderIcon } from 'lucide-react';
import axios from 'axios';
const PredictCgpa = () => {
  const [averageScore, setAverageScore] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(4);
  const [predictedScore, setPredictedScore] = useState(null);
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);

  const semesterRoman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

  const onSubmit = async (data) => {
  setLoading(true);

  const formattedData = {};
  for (let i = 0; i < selectedSemester - 1; i++) {
    const romanKey = `SEM-${semesterRoman[i]}`;
    const formKey = `semester${i + 1}`;
    const value = data[formKey];
    if (value !== undefined && value !== '' && !isNaN(value)) {
      formattedData[romanKey] = parseFloat(value);
    }
  }

  const values = Object.values(formattedData);
  const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
  setAverageScore(avg);

  try {
    const response = await cgpaApi.post("/predict", {
      ...formattedData,
    });

    if (response.data) {
      setPredictedScore(response.data.predicted_score);
      toast("CGPA Predicted Successfully!");
      setOpen(true);
      reset();
    }
  } catch (error) {
    console.error("Prediction error:", error);
    toast("Prediction failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="p-7 bg-[#dcedf5] min-h-screen">
      <h2 className="font-bold text-3xl text-[#1A3A6E] mb-5">Predict CGPA</h2>

      {/* <p className="text-gray-600 mt-5 mb-5">
        The model predicts your selected semester CGPA (between 2–8) based on the previous semesters using Linear Regression.
      </p> */}

      <div className="flex justify-center">
        <div className="bg-white rounded-2xl shadow-xl border transition-transform duration-300 hover:scale-[1.01] w-full md:w-[100rem]">
          <Card className="w-full ">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">CGPA Predictor</CardTitle>
              <CardDescription>The model predicts your selected semester CGPA (between 2–8) based on the previous semesters using Linear Regression.
                Select a semester and provide previous GPA scores.</CardDescription>
            </CardHeader>

            <CardContent>
              {/* Semester Selection */}
              <div className="mb-6">
                <label className="block font-medium text-gray-700 mb-1">
                  Select Semester to Predict
                </label>
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(Number(e.target.value))}
                  className="border rounded px-3 py-2 w-full max-w-xl"
                >
                  {Array.from({ length: 7 }, (_, i) => i + 2).map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
              </div>

              {/* GPA Inputs */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: selectedSemester - 1 }, (_, i) => {
                    const formKey = `semester${i + 1}`;
                    const romanKey = semesterRoman[i];
                    return (
                      <div key={formKey} className="space-y-1">
                        <label className="text-sm font-medium">
                          Semester {romanKey} GPA
                        </label>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder={`Enter GPA for Semester ${romanKey}`}
                          {...register(formKey, {
                            required: `Semester ${romanKey} GPA is required`,
                            min: { value: 0, message: "GPA must be at least 0" },
                            max: { value: 10, message: "GPA cannot exceed 10" },
                            validate: (value) => !isNaN(value) || "Enter a valid number",
                          })}
                        />
                        {errors[formKey] && (
                          <p className="text-sm text-red-500">
                            {errors[formKey]?.message}
                          </p>
                        )}
                      </div>
                    );
                  })}

                  {/* Buttons */}
                  <div className="pt-6 col-span-2 flex gap-4">
                    <Button type="button" variant="outline" onClick={() => reset()} className="w-24">
                      Reset
                    </Button>
                    <Button type="submit" disabled={loading} className="w-24">
                      {loading ? <LoaderIcon className="h-4 w-4 animate-spin" /> : "Submit"}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {open && predictedScore !== null && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md">
      <h3 className="text-xl font-semibold mb-4">Prediction Result</h3>
      <p className="mb-2">
        <strong>Predicted Semester:</strong> SEM-{semesterRoman[selectedSemester - 1]}
      </p>
      <p className="mb-2">
        <strong>Predicted CGPA:</strong>{" "}
        <span className="text-green-600 font-bold text-lg">
          {predictedScore.toFixed(2)}
        </span>
      </p>
      <p className="mb-4">
        <strong>Average of Previous Semesters:</strong>{" "}
        <span className="text-blue-600 font-medium">
          {averageScore?.toFixed(2)}
        </span>
      </p>
      <div className="flex justify-end">
        <Button onClick={() => setOpen(false)}>Close</Button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default PredictCgpa;
