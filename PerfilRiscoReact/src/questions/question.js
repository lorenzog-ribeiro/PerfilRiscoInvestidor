import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Questions = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const investment = queryParams.get('investment');
    
    console.log("URL path:", location.pathname);
    console.log("Investment query param:", investment);
    
    const navigate = useNavigate();
    
    const handleInvestmentValue = () => {
        if (!investment) return 0;
        
        try {
            // The investment should already be in a clean format now
            // Just ensure it's a number
            return parseFloat(investment);
        } catch (error) {
            console.error("Error parsing investment:", error);
            return 0;
        }
    };

    const investmentValue = handleInvestmentValue();
    console.log("investmentValue", investmentValue);
    const [upSide, setUpSide] = useState(investmentValue*0.5*0.1);
    const [downSide, setDownSide] = useState(investmentValue*0.1);
    const [answer, setAnswer] = useState([]);
    const [fade, setFade] = useState(false);
    const [twist, setTwist] = useState(false)
    const [median, setMedian] = useState(0.0)
    const [iteration, setIteration] = useState(1)
    const [difference, setDifference] = useState(false)
    const [stop, setStop] = useState(false)
    const fixedUpside = investmentValue*0.5*0.1

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
        let newValueMedian = upSide + ((selected === 'R' ? fixedUpside : -fixedUpside) / (Math.pow(2,iteration)))
        checkForSmallDifference(curValueMedian,newValueMedian) ? setDifference(true) : setDifference(false)
        setMedian(newValueMedian);
        setIteration(iteration => iteration+1)
    };

    const checkForSmallDifference=(oldValue,newValue)=>{
        if(((newValue-oldValue)/oldValue) < 0.05 && answer.length >= 3 && answer[answer.length-2] ===answer[answer.length-1]){
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
            setUpSide(median)
        }
        if(twist || difference){
            setStop(true)
            navigate(`/questions2/?investment=${encodeURIComponent(investment)}`);
        }
    }, [median, fade, difference, twist, stop, navigate, investment]);
    
    return(
       <div className="wrapperQuestion">
            <h2><strong>Escolha o seu cenário: ganho certo ou ganho incerto?</strong><br/> 
            O que você prefere?</h2>
            <div className={fade ? 'fade' : 'questions'}
                onAnimationEnd={() =>setFade(false)}
                >
                <div className='box' 
                    onClick={()=>{handleSelect('S')}}>
                    <div className="boxInner">
                        <strong>Ganho garantido de R$ {numberWithCommas(round2Nearest10or5(upSide))+',00'}</strong>
                        <div className="circle">
                            <p><strong>+ R$ {numberWithCommas(round2Nearest10or5(upSide))+',00'}</strong></p>
                        </div>
                    </div>
                </div>
                <div className='box'  
                    onClick={()=>{handleSelect('R')}}
                    >
                    <div className="boxInner">
                        <strong>50% de chance de ganhar R$ {numberWithCommas(round2Nearest10or5(downSide))+',00'} <br/> 50% de chance de não ganhar nada</strong>
                        <div className="semiCircle">
                            <p><strong>R$ {numberWithCommas(round2Nearest10or5(downSide))+',00'}</strong></p>
                            <p><strong>50%</strong></p>
                            <p><strong>Sem Ganhos</strong></p>
                            <p><strong>50%</strong></p>
                        </div>
                    </div>
                </div>
            </div>
       </div>
    );
}

export default Questions;