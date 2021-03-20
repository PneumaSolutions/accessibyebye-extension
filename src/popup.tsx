import React, { useEffect, useState } from "react"
import ReactDOM from "react-dom"

const Popup = () => {
  const [blockCounter, setBlockCounter] = useState<number>(0)

  useEffect(() => {
    // Restores settings state using the preferences stored in chrome.storage.
    chrome.storage.sync.get(null, (storage) => {
      setBlockCounter(storage.blockCounter)
    })
  }, [])

  return (
    <div style={{minWidth: "250px"}}>
      <p style={{fontSize: "large"}}>
        Overlays blocked since install: {blockCounter}
      </p>
      <p>Brought to you by <a href="https://pneumasolutions.com/" target="_blank">Pneuma Solutions</a></p>
    </div>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
)
