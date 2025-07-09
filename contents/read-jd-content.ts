chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("IN read-jd-contents")
    if (message.type === "GET_JD") {
      console.log("IN read-jd-contents GET_JD")
      const jdTitle =       document.querySelector(".top-card-layout__title") ||
      document.querySelector(".job-details-jobs-unified-top-card__job-title")
      const jdDetails =
        document.querySelector("#job-details") 
        const companyElement = document.querySelector(
          ".job-details-jobs-unified-top-card__company-name a"
        )     
      const jdDetailsText = jdDetails?.textContent?.trim() || "JD not found"
      const jdTitleText = jdTitle?.textContent?.trim() || "JD title not found"
      const companyNameText = companyElement?.textContent?.trim() || "Company name not found"
      
      console.log(jdTitleText,jdDetailsText)
      sendResponse({ jd: jdDetailsText,jdTitle:jdTitleText,companyName:companyNameText })
    }
  
    return true // keep message channel open for async
  })
  