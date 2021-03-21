/*
 * Courtsey of Pneuma Solutions.
 * Written by David Calvo.
 * Find out more at AccessiByeBye.org
*/

import { v4 as getUUID } from 'uuid'

const analyticsCooldown = 0.5 // in minute
const analyticsEndpoint = "https://api.accessibyebye.org/analytics"

const theNaughtyList: Record<string, string[]> = {
  "AccessiBe": [
    "*://*.acsbap.com/*",
    "*://*.acsbapp.com/*"
  ],
  "UserWay": [
    "*://cdn.userway.org/*"
  ],
  "AudioEye": [
    "*://ws.audioeye.com/*",
    "*://wsmcdn.audioeye.com/*"
  ],
  "EqualWeb": [
    "*://aacdn.nagich.com/*",
    "*://*.nagich.co.il/*"
  ],
  "TruAbilities": [
    "*://app.truabilities.com/*"
  ],
  "MaxAccess" : [
    "*://api.maxaccess.io/*"
  ],
  "User1st": [
    "*://fecdn.user1st.info/*"
  ]
}

chrome.webRequest.onBeforeRequest.addListener((details) => {
    // If enabled, send anonymous blocking statistics
    sendAnalytics(details)

    // Increment block counter
    chrome.storage.sync.get("blockCounter", (storage) => {
      const blockCounter: number = storage["blockCounter"]
      chrome.storage.sync.set({ blockCounter: blockCounter + 1 })
    })

    // AccessiByeBye!
    return { cancel: true }
  },
  {
    urls: Object.values(theNaughtyList).flat(),
  },
  ["blocking"]
)

// Send what site was using the overlay when we blocked it
async function sendAnalytics(details: chrome.webRequest.WebRequestBodyDetails) {
  if (await isAnalyticsEnabled()) {
    // Get the last time we sent analytics & UUID
    const storage = await new Promise<any>((resolve) => {
      chrome.storage.sync.get(null, (storage) => {
        resolve(storage)
      })
    })
    const lastSentAt = storage.lastSentAt

    // If we sent it more than <analyticsCooldown> minutes ago
    if (Date.now() > lastSentAt + 60000 * analyticsCooldown) {
      // Send the analytics
      const data = {
        uuid: storage.UUID,
        hostname: details.initiator,
        provider: getProvider(details.url)
      }
      console.log(data)
      const response = await postData(analyticsEndpoint, data)
      // Reset the cooldown if the server acknowledged
      if (response && response.ok) {
        chrome.storage.sync.set({ lastSentAt: Date.now() })
      }
    }
  }
}

// Checks the user's Chrome sync storage to see if they opted-out of anonymous analytics
async function isAnalyticsEnabled() {
  return new Promise<boolean>((resolve) => {
    chrome.storage.sync.get("analyticsEnabled", (storage) => {
      resolve(storage["analyticsEnabled"])
    })
  })
}

// Helper function to get which overlay provider we blocked
function getProvider(hostname: string | undefined) {
  if (hostname) {
    for (const [provider, patterns] of Object.entries(theNaughtyList)) {
      for (let pattern of patterns) {
        pattern = pattern.split('.')[1]
        if (hostname.includes(pattern)) {
          return provider
        }
      }
    }
  } else {
    return null
  }
}

// Helper function to POST data using fetch()
async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).catch((err) => { console.log(err + "\n Maybe the server is down?") })
  return response
}

// Initial setup
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    chrome.storage.sync.set({ UUID: getUUID() })
    chrome.storage.sync.set({ analyticsEnabled: true })
    chrome.storage.sync.set({ lastSentAt: 0 })
    chrome.storage.sync.set({ blockCounter: 0 })
    chrome.tabs.create({ url: "https://www.accessibyebye.org/" })
  }
})
