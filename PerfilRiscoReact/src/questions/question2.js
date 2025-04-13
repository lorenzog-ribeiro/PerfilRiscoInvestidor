import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Questions2 = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const investment = queryParams.get('investment');
    
    console.log("Q2 URL path:", location.pathname);
    console.log("Q2 Investment query param:", investment);
    
    const navigate = useNavigate();
    
    // Add a safeguard for parsing the investment
    const handleInvestmentValue = () => {
        if (!investment) return 0;
        try {
            if (typeof investment === 'string') {
                // Process the string to maintain the last period only
                let cleanValue = investment.replace(/[^\d.,]/g, '');
                
                // Replace all periods with commas except the last one
                const lastDotIndex = cleanValue.lastIndexOf('.');
                if (lastDotIndex !== -1) {
                    // Replace all periods before the last one with commas
                    cleanValue = cleanValue.substring(0, lastDotIndex).replace(/\./g, ',') + 
                                 cleanValue.substring(lastDotIndex);
                }
                
                // Now replace any commas that might be decimal separators with periods
                cleanValue = cleanValue.replace(',', '.');
                
                console.log("Cleaned Q2 investment value:", cleanValue);
                return parseFloat(cleanValue);
            }
            return parseFloat(investment);
        } catch (error) {
            console.error("Error parsing investment in Q2:", error);
            return 0;
        }
    };
    
    const investmentValue = handleInvestmentValue();
    console.log("Q2 investmentValue", investmentValue);

    const [answer, setAnswer] = useState([]);
    const [fade, setFade] = useState(false);
    const [twist, setTwist] = useState(false)
    const [median, setMedian] = useState(0.0)
    const [downSide, setDownSide] = useState(-investmentValue*0.1);
    const [iteration, setIteration] = useState(1)
    const [difference, setDifference] = useState(false)
    const [stop, setStop] = useState(false)
    const fixedUpside = -investmentValue*0.1

    const round2Nearest10or5 = (number) => {
        if(number % 10 !=0 && number % 5 !=0 ){
            let rest5 = number % 5
            let rest10 = number % 10
            let roundedNumber = number
            if(Math.abs(rest5 - 5) < Math.abs(rest10 - 10) || 
               (Math.abs(rest5 - 5) == Math.abs(rest10 - 10))) {
                    roundedNumber += Math.abs(rest5 - 5)
               } else if(Math.abs(rest5 - 5) > Math.abs(rest10 - 10)){
                    roundedNumber += Math.abs(rest10 - 10)
            }
            return roundedNumber
        }
        return number
    }
    
    const numberWithCommas= (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    
    const handleSelect = (selected) => {
        answer.push(selected)
        setFade(true)
        let curValueMedian = median;
        let newValueMedian = downSide + ((selected === 'R' ? fixedUpside : -fixedUpside) / (Math.pow(2,iteration)))
        checkForSmallDifference(curValueMedian,newValueMedian) ? setDifference(true) : setDifference(false)
        setMedian(newValueMedian);
        setIteration(iteration => iteration+1)
    };
    
    const checkForSmallDifference=(oldValue,newValue)=>{
        if(Math.abs((newValue-oldValue)/oldValue) < 0.05 && answer.length >= 3 && answer[answer.length-2] ===answer[answer.length-1]){
            return true
        }
        return false
    };
    const checkForTwist=()=>{
        if(answer.length > 2){
            let pattern = false
            for (let i = 0; i < answer.length; i++) {
                if(i!= 0 && answer[i-1] != answer[i] && pattern == false){  
                    pattern=true
                }else if(i!= 0 && answer[i-1] != answer[i] && pattern == true){
                    return true
                }
            }
        }
        return false
    }
    useEffect(() => {
        checkForTwist() ? setTwist(true) : setTwist(false)
        if(median !== 0.0){
            setDownSide(median)
        }
        if(twist || difference){
            setStop(true)
            navigate('/form3');
        }
    }, [median, fade, difference, twist, stop, navigate]);
    return( 
    <div className="wrapperQuestion">
            {!stop ?
                <>
                    <h2><strong>Escolha o seu cenário: Sem ganhos ou ganhos com possíveis perdas?</strong><br/> 
                    O que você prefere?</h2>
                    <div className={fade ? 'fade' : 'questions'}
                        onAnimationEnd={() =>setFade(false)}
                        >
                        <div className='box' 
                            onClick={()=>{handleSelect('S')}}>
                            <div className="boxInner">
                                <strong>Sem Ganhos</strong>
                                <div className="circle">
                                    <p><strong>+ R$ 0,00</strong></p>
                                </div>
                            </div>
                        </div>
                        <div className='box'  
                            onClick={()=>{handleSelect('R')}}
                            >
                            <div className="boxInner">
                                <strong>50% de chance de ganhar R$ {numberWithCommas(round2Nearest10or5(fixedUpside))+',00'} <br/> 50% de chance de perder R$ {numberWithCommas(round2Nearest10or5(downSide))+',00'} </strong>
                                <div className="semiCircle">
                                    <p><strong>+ R$ {numberWithCommas(round2Nearest10or5(- fixedUpside))+',00'}</strong></p>
                                    <p><strong>50%</strong></p>
                                    <p><strong>- R$ {numberWithCommas(round2Nearest10or5(- downSide))+',00'}</strong></p>
                                    <p><strong>50%</strong></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
                :
                <></>
                }
    
           </div>
        );
}

export default Questions2;