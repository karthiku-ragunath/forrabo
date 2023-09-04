import React, { useState } from "react";
import CSVDataTable from "./CSVDataTabel";

function App() {
  const [file, setFile] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [isError, setIsError] = useState(false)
  const [errorMsg, setErrorMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false)

  const validatefiletype = (event) => {
    const selectedFile = event.target.files[0]; 
    setIsSuccess(false)

    const allowedTypes = ["text/csv", "text/xml"];
    console.log("*****item*****file type is right");
    console.log("*****item*****file type is right");
    if (!allowedTypes.includes(selectedFile?.type)) {
      setIsError(true)
      setErrorMsg("Only file type of CSV/XML are allowed.");
      return;
    }

    setIsError(false);
    setFile(selectedFile);
  };

  const filesizeisnotvalid = () => {
    const MAX_FILE_SIZE = 512000;
    const fileSizeKiloBytes = file.size / 1024;
    return fileSizeKiloBytes > MAX_FILE_SIZE;
  };

  const parsecsv = (csvText) => {
    const parsedData = [];
    var contentError = false;
    if(csvText != undefined && csvText != "" && csvText != null){
      const lines = csvText.split("\n");
      const headers = lines[0].split(",");
      
      var linesArray = [];
      lines.map ((line) => linesArray.push(line.split(",")));

      const new_data = linesArray.map((item, index) => {
        if (index > 0){
          console.log("*****item*****"+item[0]);
        }
        return item;
      });
      console.log(new_data)

      for (let i = 1; i <= 5; i++) {
        const currentLine = lines[i].split(",");

        if (currentLine.length === headers.length) {
          const row = {};
          for (let j = 0; j < headers.length; j++) {
            row[headers[j].trim()] = currentLine[j].trim();
          }
          parsedData.push(row);
        }
      }
    }
    
    setCsvData(parsedData);
  };

  const handlesubmit = (event) => {
    event.preventDefault();
    setIsError(false);
    setIsSuccess(true);

    if(isError) return
    setErrorMsg("");

    
    if (!file) {
      setIsError(true);
      setErrorMsg("Please select a file.");
      setIsSuccess(false);
      return;
    }

    
    if (filesizeisnotvalid()){
      setIsError(true);
      setIsSuccess(false);
      parsecsv("");
      return;
    } 

    if(file){
    var reader = new FileReader();
    reader.onload = function(e){
      const csvText = e.target.result;
      parsecsv(csvText);
    };
    reader.readAsText(file);
    }

  };

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h2 className="title">MT940 Validation</h2>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <input
              type="file"
              onChange={validatefiletype}
            />

                                    <div className="space-between">
                                      <p className="info-message">Max size: 50MB</p>
                                    </div>








            {isError && <div className="error-text">{errorMsg}</div>}

            <button type="submit">Upload</button>
            
            {isSuccess && <div className="success-text">Valid File</div>}
          </form>
        </div>
      </div>
      <br />
      <CSVDataTable data={csvData} />
    </div>
  );
}

export default App;
