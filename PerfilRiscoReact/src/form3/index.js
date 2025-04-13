import React, { useEffect, useState } from "react";
import questions from "../questions.txt"
const Form3 = () => {
    const [arrayQuestions, setArrayQuestions] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(questions);
                const text = await response.text();
                setArrayQuestions(text.split("\n")); // Assuming each line is a question
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        }
        fetchData();
    }, []);

    return (
        <div>
            {arrayQuestions.map((item, index) => (
                <div key={index}>
                    <p>{item}</p>
                </div>
            ))}
        </div>
    );
};

export default Form3;
