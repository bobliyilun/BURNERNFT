import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function NumberTransfer({contract}) {

    const [input1, setInput1] = useState('');
    const [input2, setInput2] = useState('');
  
    const handleInputChange1 = (event) => {
      setInput1(event.target.value);
    };
  
    const handleInputChange2 = (event) => {
      setInput2(event.target.value);
    };
  
    // const handleLogValues = () => {
    //   console.log('Address:', input1);
    //   console.log('ID:', input2);
    // };
    const handleLogValues = async () => {
        await contract.transferNFT(input2, input1);
        setInput1('');
        setInput2('');
    };
  
    return (
      <div>
        <input
          type="text"
          value={input1}
          onChange={handleInputChange1}
          placeholder="Which token to transfer?"
        />
        <br />
        <input
          type="text"
          value={input2}
          onChange={handleInputChange2}
          placeholder="Which address to transfer to?"
        />
        <br />
        <button onClick={handleLogValues}>Transfer</button>
      </div>
    );
  }
  
  export default NumberTransfer;