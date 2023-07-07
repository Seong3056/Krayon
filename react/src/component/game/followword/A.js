import React, { useEffect, useState } from 'react'

const A = () => {
    const [currentWord, setCurrentWord] = useState("");
    const [previousWord, setPreviousWord] = useState('');
    const $in = document.getElementById('in');
    const inWord = () =>{
        
        if($in.value != ''){
            setCurrentWord($in.value)
            
        }
    }
    const moveWord = (e) =>{
        if(e.keyCode == '13' || e.onClick) {
            if($in.value !=''){
                // $in.textContent='';
                setPreviousWord(currentWord);
                setCurrentWord("");
                
            }    
        }
        
            
        
        
    }
    useEffect(() => {
        // $in.textContent='';
        $in.value='';
      }, [previousWord])
    
  return (
    <div class="FollowWord" onKeyDown={moveWord}>
      <h1>끝말잇기 게임</h1>
      <p>이전 단어: {previousWord}</p>
      <p>현재 단어: {currentWord}</p>
      <input type="text" id="in" onChange={inWord} />

        
      
    </div>
  )
}

export default A