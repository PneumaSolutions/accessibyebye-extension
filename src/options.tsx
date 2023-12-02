import React, { useEffect, useState } from "react"
import ReactDOM from "react-dom"

import theNaughtyList from "./providers"

const Options = () => {
  const [allowedProviders, setAllowedProviders] = useState<Record<string, boolean> | null>(null)
  const [analyticsEnabled, setAnalyticsEnabled] = useState<boolean | null>(null)
  const [blockCounter, setBlockCounter] = useState<number>(0)

  useEffect(() => {
    // Restores settings state using the preferences stored in chrome.storage.
    chrome.storage.sync.get(null, (storage) => {
      setAllowedProviders(storage.allowedProviders || {})
      setAnalyticsEnabled(storage.analyticsEnabled)
      setBlockCounter(storage.blockCounter)
    })
  }, [])

  return (
    <div style={{ minWidth: "250px" }}>
      <p style={{ fontSize: "large" }}>
        Overlays blocked since install: {blockCounter}
      </p>
      {Object.keys(theNaughtyList).map((provider) => {
        return (
          <div>
            <label>
              <input
                type="checkbox"
                checked={(allowedProviders || {})[provider] || false}
                disabled={allowedProviders === null}
                onChange={(event) => {
                  if (allowedProviders === null) {
                    return
                  }
                  let oldValue = allowedProviders[provider] || false
                  let newValue = event.target.checked
                  if (newValue === oldValue) {
                    return
                  }
                  let newSetting = { ...allowedProviders }
                  newSetting[provider] = newValue
                  setAllowedProviders(newSetting)
                  chrome.storage.sync.set({ allowedProviders: newSetting })
                }}
              />
              {`Allow ${provider}`}
            </label>
          </div>
        )
      })}
      <div>
        <label>
          <input
            type="checkbox"
            checked={analyticsEnabled || false}
            disabled={analyticsEnabled === null}
            onChange={(event) => {
              if (analyticsEnabled === null) {
                return
              }
              let newValue = event.target.checked
              if (newValue === analyticsEnabled) {
                return
              }
              setAnalyticsEnabled(newValue)
              chrome.storage.sync.set({ analyticsEnabled: newValue })
            }}
          />
          Enable anonymous blocking statistics
        </label>
      </div>
      <p>
        We don't collect any personal information. The blocking statistics are
        used to display the statistics you can see at{" "}
        <a href="https://www.accessibyebye.org/" target="_blank">
          AccessiByeBye
        </a>
        .
      </p>
    </div>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>,
  document.getElementById("root")
)
