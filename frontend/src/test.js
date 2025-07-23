import { useState } from "react";
import Annotator from "./Annotator";

function App() {
  const [img, setImg] = useState("");
  const [uploadedId, setUploadedId] = useState("");

  const handleClick = async () => {
    const formdata = new FormData();
    formdata.append("image", img);

    try {
      const res = await fetch("http://localhost:5000/single", {
        method: "POST",
        body: formdata,
      });
      const data = await res.json();
      console.log("Upload Response:", data);
      setUploadedId(data.id);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div className="App">
      <h1>Upload the Image</h1>
      <input onChange={(e) => setImg(e.target.files[0])} type="file" />
      <br />
      <button onClick={handleClick}>Submit</button>

      {uploadedId && (
        <div>
          <h2>Uploaded Image Preview:</h2>
          <img
            src={`http://localhost:5000/img/${uploadedId}`}
            alt="Uploaded Preview"
            style={{ width: "300px", marginTop: "10px" }}
          />
          <Annotator imageUrl={`http://localhost:5000/img/${uploadedId}`} />
        </div>
      )}
    </div>
  );
}

export default App;
