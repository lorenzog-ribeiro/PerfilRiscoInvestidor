import React, {useState} from "react";
import { NumericFormat } from 'react-number-format';
import { useNavigate } from "react-router-dom";

const Form = () => {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [erro, setErro] = useState('');
    const [investment, setInvestment] = useState('');
    const [showInvestmentForm, setShowInvestmentForm] = useState(false);
    
    const navigate = useNavigate();

    const submitForm = (e) => {
        e.preventDefault();
        if (name === "") { setErro(0) }
        else if (email === "") { setErro(2) }
        else if (lastName === "") { setErro(1)}
        else if (investment === "") { setErro(3)}
        else {
            // Clean the investment value before navigating
            let cleanInvestment = investment;
            
            // Remove all non-numeric characters except periods and commas
            cleanInvestment = cleanInvestment.replace(/[^\d.,]/g, '');
            
            // Replace all periods with empty string (removing thousands separators)
            // but keep the decimal separator (last period or comma)
            const lastDotIndex = cleanInvestment.lastIndexOf('.');
            if (lastDotIndex !== -1) {
                cleanInvestment = cleanInvestment.substring(0, lastDotIndex).replace(/\./g, '') + 
                                 cleanInvestment.substring(lastDotIndex);
            }
            
            // Replace comma with period if it exists
            cleanInvestment = cleanInvestment.replace(',', '.');
            
            // Navigate to Form2 with cleaned investment as URL parameter
            navigate(`/form2?investment=${encodeURIComponent(cleanInvestment)}`);
        }
    }

    const goToInvestmentForm = (e) => {
        e.preventDefault();
        if (name === "") { setErro(0) }
        else if (email === "") { setErro(2) }
        else if (lastName === "") { setErro(1)}
        else {
            setShowInvestmentForm(true);
        }
    }

    return (
        <div className='Form1'>
            {!showInvestmentForm ?
            <div>
                <h3 className="title">Primeiro, algumas informações sobre você!</h3>
                <form className="form">
                    <div className="form">
                        <div className="upperForm">
                            <div className="InputWrapper">
                                <label className="inputLabel">Primeiro nome</label>
                                <input value={name} onChange={(e)=>{setName(e.target.value)}} className="input" type="name"></input>
                                {erro === 0 && (
                                    <p className="errorMsg">Este campo é obrigatório.</p>
                                )}
                            </div>
                            <div className="InputWrapper">
                                <label className="inputLabel">Último nome</label>
                                <input value={lastName} onChange={(e)=>{setLastName(e.target.value)}} className="input" type="name"></input>
                                {erro === 1 && (
                                    <p className="errorMsg">Este campo é obrigatório.</p>
                                )}
                            </div>
                        </div>
                        <div className="InputWrapper">
                            <label className="inputLabel">E-mail</label>
                            <input value={email} onChange={(e)=>{setEmail(e.target.value)}} className="input" type="e-mail"></input>
                            {erro === 2 && (
                                <p className="errorMsg">Este campo é obrigatório.</p>
                            )}
                        </div>
                        <div className="btnWrapper">
                            <button onClick={goToInvestmentForm} className="btn">Próximo</button>
                        </div>
                    </div>
                </form>
            </div>
            : 
            <div className="Form2">
                <h3 className="title">Quanto você possui para investir?</h3>
                <div className="InputWrapper">
                    <label className="inputLabel">Quantia total:</label>
                    <NumericFormat thousandSeparator="." decimalSeparator="," decimalScale={2} fixedDecimalScale placeholder="R$ 10.000" value={investment} onChange={(e)=>{setInvestment(e.target.value)}} className="input"/>
                    {erro === 3 && (
                        <p className="errorMsg">Este campo é obrigatório.</p>
                    )}
                </div>
                <div className="btnWrapper">
                    <button onClick={submitForm} className="btn">Próximo</button>
                </div>
            </div>
            }
        </div>
    );
}

export default Form;