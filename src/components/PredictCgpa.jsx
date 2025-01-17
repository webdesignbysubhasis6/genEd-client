import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Input } from './ui/input'; // Replace with your Input component
import { gpaApi } from '@/utils/api';
import { toast } from 'sonner';
import { LoaderIcon } from 'lucide-react';

const PredictCgpa = () => {
  const [open, setOpen] = useState(false);
  const [predictedScore, setPredictedScore] = useState(null); // State to store the prediction
  const [averageValue,setAverageValue]=useState(null);
  const { register, handleSubmit, reset ,formState: { errors }} = useForm();
  const [loading,setLoading]=useState(false);
  const onSubmit = async (data) => {
    setLoading(true);
    const formattedData = {
      data: Object.keys(data)
        .sort() // Ensure semesters are in order
        .map((key) => parseFloat(data[key])), // Convert GPA values to numbers
    };
    const total = formattedData.data.reduce((sum, value) => sum + value, 0); // Sum up all values
    const average = total / formattedData.data.length; // Divide by the number of elements
  
    try {
      const response = await gpaApi.post("/Gpa_predict/latest", formattedData);
      console.log(response);
      if (response.data && response.data.data) {
        setPredictedScore(response.data.data[0]); // Set the predicted score
        setAverageValue(average);
        reset();
        toast("GCPA Predicted Succesfully!")
        setOpen(false);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error during prediction:", error); 
    }
  };

  return (
    <div className="p-7">
      <h2 className="font-bold text-2xl flex justify-between items-center">
        Predict CGPA
      </h2>

      <p className="text-gray-600 mt-5 mb-5">
        Note: The model predicts a student’s 8th semester CGPA based on their CGPAs from the first seven semesters. Using a Linear Regression algorithm, the relationship between the input features (semesters 1–7) and the target (semester 8) is learned. The data is split into training and testing sets, the model is trained on the former, and predictions are made on the latter. Evaluation metrics like Mean Squared Error and R-squared assess the accuracy and reliability of the predictions.
      </p>

      <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
      <div className='md:col-span-2'>
      <Card className="w-full max-w-xl">
  <CardHeader>
    <CardTitle className="text-2xl font-bold text-gray-900">Semester GPA Calculator</CardTitle>
    <CardDescription>Enter your GPA for each semester to calculate your overall academic performance.</CardDescription>
  </CardHeader>
  <CardContent>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Semesters Input Grid */}
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} className="space-y-1">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Semester {i + 1} GPA
            </label>
            <Input
              type="number"
              step="0.01"
              placeholder={`Enter GPA for Semester ${i + 1}`}
              {...register(`semester${i + 1}`, {
                required: `Semester ${i + 1} GPA is required`,
                min: { value: 0, message: "GPA must be at least 0" },
                max: { value: 10, message: "GPA cannot exceed 10" },
                validate: (value) => !isNaN(value) || "Please enter a valid number",
              })}
              className="focus:ring-2 focus:ring-blue-500"
            />
            {errors[`semester${i + 1}`] && (
              <p className="text-sm font-medium text-red-500">
                {errors[`semester${i + 1}`]?.message}
              </p>
            )}
          </div>
        ))}

        <div className='p-8 flex gap-5'>
          {/* Reset Button */}
        <Button
          type="button"
          variant="outline"
          onClick={() => reset()}
          className="w-24"
        >
          Reset
        </Button>

        {/* Submit Button */}
        <Button type="submit" disabled={loading} className="w-24">
          {loading ? (
            <LoaderIcon className="h-4 w-4 animate-spin" />
          ) : (
            "Submit"
          )}
        </Button>
        </div>
        
      </div>
    </form>
  </CardContent>
</Card>

      </div>
      
      {/* Statistics Cards */}
      <div className="md:col-span-2">
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
              {averageValue!==null &&(<div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">Current Average</h3>
                <p className="text-3xl font-bold text-blue-600">{averageValue.toFixed(2)}</p>
              </div>)}
              {predictedScore !== null && (<div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">Predicted CGPA</h3>
                <p className="text-3xl font-bold text-green-600">{predictedScore.toFixed(2)}</p>
              </div>)}
              {predictedScore !== null && (<div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">Accuracy</h3>
                <p className="text-3xl font-bold text-purple-600">94%</p>
              </div>)}
            </div>
            </div>
            </div>
    </div>
  );
};

export default PredictCgpa;
