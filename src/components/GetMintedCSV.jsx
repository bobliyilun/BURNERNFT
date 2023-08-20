import { useState, useEffect } from 'react';

function DownLoadMinted({ fetchedDataList }) {

  const handleclick = () => {
    const txtContent = fetchedDataList.join('');
    const blobber = new Blob([txtContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blobber);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.txt';
    a.click();
    URL.revokeObjectURL(url);
  };


  return (
    <div>
      <h1>Export</h1>
      <button onClick={handleclick}>Download Phone Book</button>
    </div>
  );
};

export default DownLoadMinted;