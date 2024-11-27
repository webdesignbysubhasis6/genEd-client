import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'; // Adjust import paths as necessary
import { Input } from './ui/input'; // Replace with your Input component
import { gpaApi } from '@/utils/api';
import { toast } from 'sonner';
import { LoaderIcon } from 'lucide-react';

const PredictCgpa = () => {
  const [open, setOpen] = useState(false);
  const [predictedScore, setPredictedScore] = useState(null); // State to store the prediction
  const { register, handleSubmit, reset } = useForm();
  const [loading,setLoading]=useState(false);
  const onSubmit = async (data) => {
    setLoading(true);
    const formattedData = {
      data: Object.keys(data)
        .sort() // Ensure semesters are in order
        .map((key) => parseFloat(data[key])), // Convert GPA values to numbers
    };
    console.log(formattedData);
    try {
      const response = await gpaApi.post("/Gpa_predict/latest", formattedData);
      console.log(response);
      if (response.data && response.data.data) {
        setPredictedScore(response.data.data[0]); // Set the predicted score
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
        <Button onClick={() => setOpen(true)}>Predict</Button>
      </h2>

      <p className="text-gray-600 mt-5">
        Note: The model predicts a student’s 8th semester CGPA based on their CGPAs from the first seven semesters. Using a Linear Regression algorithm, the relationship between the input features (semesters 1–7) and the target (semester 8) is learned. The data is split into training and testing sets, the model is trained on the former, and predictions are made on the latter. Evaluation metrics like Mean Squared Error and R-squared assess the accuracy and reliability of the predictions.
      </p>

      {predictedScore !== null && (
        <div className="mt-4 p-4 border rounded-md bg-gray-100">
          <h3 className="font-bold text-lg">Predicted 8th Semester CGPA:</h3>
          <p className="text-xl text-blue-600">{predictedScore.toFixed(2)}</p>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Semester Details</DialogTitle>
            <DialogDescription>
              <form onSubmit={handleSubmit(onSubmit)}>
                {Array.from({ length: 7 }, (_, i) => (
                  <div key={i} className="py-2">
                    <label>Semester {i + 1} GPA</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder={`Enter GPA for Semester ${i + 1}`}
                      {...register(`semester${i + 1}`, {
                        required: `Semester ${i + 1} GPA is required`,
                        min: { value: 0, message: 'GPA must be at least 0' },
                        max: { value: 10, message: 'GPA cannot exceed 10' },
                      })}
                    />
                  </div>
                ))}

                <div className="flex gap-3 items-center justify-end mt-5">
                  <Button type="button" onClick={() => setOpen(false)} variant="ghost">
                    Cancel
                  </Button>
                  <Button 
                type="submit" disabled={loading}>
                    {loading?<LoaderIcon className='animate-spin'/>:
                    "Submit"}
                    </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PredictCgpa;
