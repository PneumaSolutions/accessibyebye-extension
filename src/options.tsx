import React, { useEffect, useState } from "react"
import ReactDOM from "react-dom"

const Options = () => {
  const [status, setStatus] = useState<string>('')
  const [analyticsEnabled, setAnalyticsEnabled] = useState<boolean>(false)
  const [blockCounter, setBlockCounter] = useState<number>(0)

  useEffect(() => {
    // Restores settings state using the preferences stored in chrome.storage.
    chrome.storage.sync.get(null, (storage) => {
      setAnalyticsEnabled(storage.analyticsEnabled)
      setBlockCounter(storage.blockCounter)
    })
  }, [])

  const saveOptions = () => {
    // Saves options to chrome.storage.sync.
    chrome.storage.sync.set(
      {
        analyticsEnabled: analyticsEnabled,
      },
      () => {
        // Update status to let user know options were saved.
        setStatus("Options saved.")
        const id = setTimeout(() => {
          setStatus('')
        }, 2000)
        return () => clearTimeout(id)
      }
    )
  }

  return (
    <div style={{minWidth: "250px"}}>
      <p style={{fontSize: "large"}}>
        Overlays blocked since install: {blockCounter}
      </p>
      <label>
        <input
          type="checkbox"
          checked={analyticsEnabled}
          onChange={(event) => setAnalyticsEnabled(event.target.checked)}
        />
        Enable Anonymous Blocking Statistics
      </label>
      <p>
          We don't collect any personal information. The blocking statistics are used to display the statistics you can see at <a href="https://www.accessibyebye.org/" target="_blank">AccessiByeBye</a>.
      </p>
      <div>{status}</div>
      <button style={{margin: "5px", marginTop: "10px"}} onClick={saveOptions}>Save</button>
    </div>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>,
  document.getElementById("root")
)
