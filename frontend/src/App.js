import { useState } from "react";

function App() {
  const [img,setImg] = useState("")
  const formdata = new FormData()
  formdata.append("image", img)

  const handleClick = () =>{
    fetch("http://localhost:5000/single", {
      method: "POST",
      body: formdata
    }).then((res) => {
      console.log(res.msg);
    })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="App">
      <h1>Upload the Image</h1>
      <input onChange={(e)=>(setImg(e.target.files[0]))}type="file"/>
      <br/>
      <button onClick={handleClick}>Submit</button>
    </div>
  );
}

export default App;
