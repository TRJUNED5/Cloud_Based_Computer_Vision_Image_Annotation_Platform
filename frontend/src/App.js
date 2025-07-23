import { useState } from "react";

function App() {
  const [img, setImg] = useState("");
  const [uploadedId, setUploadedId] = useState("");
  const [labels, setLabels] = useState([]);

  const handleClick = async () => {
    const formdata = new FormData();
    formdata.append("image", img);

    try {
      const res = await fetch("http://localhost:5000/single", {
        method: "POST",
        body: formdata
      });

      const data = await res.json();
      console.log("Upload Response:", data);

      setUploadedId(data.id);
      setLabels(data.labels || []);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div className="App" style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>Upload an Image</h1>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImg(e.target.files[0])}
      />
      <br />
      <button onClick={handleClick} style={{ marginTop: "10px" }}>
        Submit
      </button>

      {uploadedId && (
        <div style={{ marginTop: "20px" }}>
          <h2>Uploaded Image Preview:</h2>
          <img
            src={`http://localhost:5000/img/${uploadedId}`}
            alt="Uploaded Preview"
            style={{ width: "400px", border: "1px solid #ccc", padding: "5px" }}
          />

          {labels.length > 0 && (
            <>
              <h3>Auto-Detected Labels:</h3>
              <ul>
                {labels.map((label, i) => (
                  <li key={i}>
                    <strong>{label.description}</strong> (
                    {(label.score * 100).toFixed(1)}%)
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
