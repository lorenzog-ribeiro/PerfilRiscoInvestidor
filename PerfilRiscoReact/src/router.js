import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Form from "./form";
import Form2 from "./form2";
import Form3 from "./form3";
import Questions from "./questions/question";
import Questions2 from "./questions/question2";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/form" />} />
        <Route path="/form" element={<Form />} />
        <Route path="/form-investment" element={<Form />} />
        <Route path="/form2" element={<Form2 />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/questions2" element={<Questions2 />} />
        <Route path="/form3" element={<Form3 />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter; 