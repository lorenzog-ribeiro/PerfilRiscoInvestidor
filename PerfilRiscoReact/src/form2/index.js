import React, {useState, useEffect} from "react";
import pdf from '../TCLE.pdf'
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Papa from 'papaparse';
import csvFile from '../convertcsv.csv'
import { useNavigate, useLocation } from "react-router-dom";

const Form2 = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Get investment from query parameters
    const queryParams = new URLSearchParams(location.search);
    const investment = queryParams.get('investment');
    
    const [value, setValue] = useState(30);
    const [records, setRecords] = useState('');
    const [checked, setChecked] = useState(false);
    
    useEffect(() => {
        Papa.parse(csvFile, {
            download: true,
            complete: function (input) {
                setRecords(input.data);
            }
        });
    }, []);

    const handleCurrencyString = () => {
        if (!investment) return 0;
        let decimal = investment.slice(-2);
        let integer = investment.slice(0,-3).replace(".","");
        let wholeNUmber = parseFloat(integer+"."+decimal);
        return wholeNUmber;
    }

    const handleSubmit = () => {
        // Make sure investment is properly encoded for URL
        if (investment) {
            // Clean the investment value: remove all periods except for the last one (decimal)
            let cleanInvestment = investment;
            
            // First remove all non-numeric characters except periods and commas
            cleanInvestment = cleanInvestment.replace(/[^\d.,]/g, '');
            
            // Replace all periods with empty string (removing thousands separators)
            // but keep the decimal separator (either last period or comma)
            const lastDotIndex = cleanInvestment.lastIndexOf('.');
            if (lastDotIndex !== -1) {
                // If there's a period, assume the last one is decimal
                cleanInvestment = cleanInvestment.substring(0, lastDotIndex).replace(/\./g, '') + 
                                  cleanInvestment.substring(lastDotIndex);
            }
            
            // Now replace comma with period if it exists (standard decimal format)
            cleanInvestment = cleanInvestment.replace(',', '.');
            
            console.log("Clean investment for URL:", cleanInvestment);
            navigate(`/questions/?investment=${encodeURIComponent(cleanInvestment)}`);
        } else {
            console.error("Investment value is missing");
        }
    }

    const triangleStyle = {
      width: "300px", 
      height: "100px",
      background: `linear-gradient(90deg, darkgreen ${value+2}%, #b3ffb3 ${value+2}%, #b3ffb3 100%)`,
      clipPath: "polygon(100% 0%, 100% 100%, 0% 100%)",
      bottom: "0",
      left: "0",
      top:"0",
      zIndex:1
    }
    
    const reverseTriangleStyle = {
      width: "300px", 
      height: "100px", 
      background: `linear-gradient(90deg, #800000 ${value+2}%, #ff9999 ${value+2}%, #ff9999 100%)`,
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%)",
      bottom: "0",
      left: "0",
      zIndex:1
    }
    
    const handleSliderChange = (event, newValue) => {
      setValue(newValue);
    };

    return(
        <div className='form2'>
            {records ? 
             <>
                <div className="resultWrapper">
                    <div className='numericResult'>
                        <h3 style={{color:"#3eb398", backgroundColor:"#daf2ed", fontSize:"1.7em", padding:"8px"}}>R${(handleCurrencyString()*(parseFloat(records[value][3]))).toFixed(2)}</h3>
                        <h3 style={{color:"#d32f2f", backgroundColor:"#f7d7d7",fontSize:"1.7em", padding:"8px"}}>R${(handleCurrencyString()*(parseFloat(records[value][2]))).toFixed(2)}</h3>
                    </div>
                    <div className="graphicWrappeer">
                        <div className='results' id='box'>
                            <p className='resultText'>upside</p>
                            <p className='resultText'>downside</p>
                            <p className='resultText'>total</p>
                            <p style={{color:'green',fontWeight:'bold'}}>{(records[value][3]*100).toFixed(2)}%</p>
                            <p style={{color:'red',fontWeight:'bold'}}>{(records[value][2]*100).toFixed(2)}%</p>
                            <p style={{color:'blue',fontWeight:'bold'}}>{(records[value][4]*100).toFixed(2)}%</p>
                        </div>
                        <div className='upperTri' style={triangleStyle}>
                        </div>
                        <Box sx={{ display:'flex', height:5 ,width: 300 , margin:0, alignItems:'center'}}>
                            <Slider sx={{
                                '.MuiSlider-thumb': {
                                    zIndex: 2,
                                },
                            }}
                            style={{ zIndex: 2 }} value={value} onChange={handleSliderChange} min={1} max={98} aria-label="Default" />
                        </Box>
                        <div className='lowerTri' style={reverseTriangleStyle}>
                        </div>
                    </div>
                </div>
                <div className='wrapper'> 
                    <input value={checked} onChange={(e)=>setChecked(e.target.checked)} className="input" type="checkbox" id="consent"/>
                    <label htmlFor="consent"> Eu li o <a href={pdf} target="_blank" rel="noopener noreferrer">Termo de Consentimento Livre</a> e Esclarecido da pesquisa e concordo em participar voluntariamente.</label>
                </div>
                <div className="btnWrapper">
                    <button onClick={handleSubmit} disabled={!checked} className="btn">Próximo</button>
                </div>
             </>
            :
             <></>   
            }
        </div>
    );
};

export default Form2;