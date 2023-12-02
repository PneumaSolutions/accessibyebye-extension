import React, { useEffect, useState } from "react"
import ReactDOM from "react-dom"

const Popup = () => {
  const [tabId, setTabId] = useState<number | null>(null)
  const [isAllowedTab, setAllowedTab] = useState<boolean | null>(null)
  const [blockCounter, setBlockCounter] = useState<number>(0)

  useEffect(() => {
    // Restores settings state using the preferences stored in chrome.storage.
    chrome.storage.sync.get(null, (storage) => {
      setBlockCounter(storage.blockCounter)
    })
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      if (!tabs) {
        return
      }
      const tab = tabs[0]
      if (!tab) {
        return
      }
      const tabId = tab.id
      if (tabId === undefined || tabId === chrome.tabs.TAB_ID_NONE) {
        return
      }
      chrome.runtime.sendMessage({ type: "isAllowedTab", tabId }, (result) => {
        setTabId(tabId)
        setAllowedTab(result)
      })
    })
  }, [])

  return (
    <div style={{ minWidth: "250px" }}>
      <label>
        <input
          type="checkbox"
          disabled={tabId === null || isAllowedTab === null}
          checked={isAllowedTab || false}
          onChange={(event) => {
            if (isAllowedTab === null || tabId === null) {
              return
            }
            let newValue = event.target.checked
            if (newValue === isAllowedTab) {
              return
            }
            setAllowedTab(newValue)
            chrome.runtime.sendMessage({ type: "setAllowedTab", tabId, allowed: newValue }, () => {
              chrome.tabs.reload(tabId, { bypassCache: true })
            })
          }}
        />
        Allow overlays in the current tab
      </label>
      <p style={{ fontSize: "large" }}>
        Overlays blocked since install: {blockCounter}
      </p>
      <p>
        Brought to you by{" "}
        <a href="https://pneumasolutions.com/" target="_blank">
          Pneuma Solutions
        </a>
      </p>
    </div>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
)
