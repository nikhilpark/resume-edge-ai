import { useEffect, useState } from "react"
import "./popup.css"



function IndexPopup() {
  const [jdData, setJdData] = useState<any>({})
  const [readingJD, setReadingJD] = useState(true)
  const [resumeText, setResumeText] = useState("")
  const [tailoredResumeText,setTailoredResumeText] = useState("")

  const readJD = () => {
    console.log("READING JD........")
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0].id) return
      chrome.tabs.sendMessage(tabs[0].id, { type: "GET_JD" }, (response) => {
        setJdData(response)
        setReadingJD(false)
      })
    })
  }

  const getTailoredResume = async () => {
    console.log(getTailoredResume,"getTailored resume",)
    if(resumeText && resumeText != "" && jdData && Object.keys(jdData)>1)  
  console.log("26666666666666666")
    try {
      const response = await fetch("http://localhost:3000/get-tailored-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          resumeText: resumeText,
          jdData: jdData
        })
      });
  
      if (!response.ok) throw new Error("Failed to get Tailored Resume")
      const data = await response.json()
      console.log(data)
      setTailoredResumeText(data.text) // or .content or whatever your backend returns
    } catch (error) {
      console.error("Upload error:", error)
      alert("Failed to get tailored resume")
    }
  }

  useEffect(() => {
    readJD()
  }, [])

  useEffect(()=>{
    if(resumeText && resumeText!="") {
      getTailoredResume(resumeText)

    }
  },[resumeText])

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
  
    const formData = new FormData()
    formData.append("resume", file)
  
    try {
      const response = await fetch("http://localhost:3000/parse-resume", {
        method: "POST",
        body: formData
      })
  
      if (!response.ok) throw new Error("Failed to parse resume")
      const data = await response.json()
      console.log(data)
      setResumeText(data.text) // or .content or whatever your backend returns
    } catch (error) {
      console.error("Upload error:", error)
      alert("Failed to parse resume")
    }
  }

  return (
    <div style={{ width: "400px", margin: "1rem", borderRadius: "8px" }}>
      <h2>Welcome to Resume-Edge AI</h2>

      {readingJD ? (
        <div>Reading JD from LinkedIn...</div>
      ) : (
        <div>
          <h4>JD:</h4>
          <p style={{ whiteSpace: "pre-wrap" }}>Company name - {jdData.companyName}</p>
          <p style={{ whiteSpace: "pre-wrap" }}>Job title - {jdData.jdTitle}</p>

          
      <div>
        <h4>Upload your Resume:</h4>
        <input type="file" accept=".pdf,.txt,.docx,.doc" onChange={handleResumeUpload} />
        {resumeText && (
          <>
            <h5 style={{ marginTop: "1rem" }}>Tailored Resume Text:</h5>
            <div style={{ maxHeight: "150px", overflowY: "auto", background: "#f9f9f9", padding: "0.5rem", borderRadius: "6px", fontSize: "0.9rem" }}>
              <pre style={{ whiteSpace: "pre-wrap" }}>{tailoredResumeText}</pre>
            </div>
          </>
        )}
      </div>
        </div>
      )}

    </div>
  )
}

export default IndexPopup
