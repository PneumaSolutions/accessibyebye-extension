/*
 * Courtsey of Pneuma Solutions.
 * Written by David Calvo.
 * Find out more at AccessiByeBye.org
 */

import { v4 as getUUID } from "uuid"

const analyticsCooldown = 0.5 // in minute
const analyticsEndpoint = "https://api.accessibyebye.org/analytics"

const theNaughtyList: Record<string, string[]> = {
  AccessiBe: ["*://*.acsbap.com/*", "*://*.acsbapp.com/*"],
  UserWay: ["*://*.userway.org/*"],
  AudioEye: ["*://*.audioeye.com/*"],
  EqualWeb: ["*://cdn.equalweb.com/*", "*://*.nagich.com/*", "*://*.nagich.co.il/*"],
  TruAbilities: ["*://*.truabilities.com/*"],
  MaxAccess: ["*://*.maxaccess.io/*"],
  User1st: ["*://*.user1st.info/*"],
  Accessibly: ["*://*.accessiblyapp.com/*"],
}

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    // Check if the blocked site is actually an overlay
    if (!isOverlay(details)) return { cancel: false }

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

// Determine whether the site we intercepted is actually an overlay or just the product website
function isOverlay(details: chrome.webRequest.WebRequestBodyDetails) {
  // Split up the URL we intercepted
  const blockedHostname = new URL(details.url).hostname
  const blockedSubdomain = blockedHostname.split(".")[0].toLowerCase()

  // Check if the subdomain we grabbed is www, or if there is no subdomain
  if (blockedSubdomain === "www" || !blockedHostname.split(".")[2]) return false
  // Not an overlay, just their product website
  else return true
}

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
    const lastBlockedHost = storage.lastBlockedHost
    const blockedHostname = new URL(details.url).hostname

    // If the host is different or we sent it more than <analyticsCooldown> minutes ago
    if (
      blockedHostname !== lastBlockedHost ||
      Date.now() > lastSentAt + 60000 * analyticsCooldown
    ) {
      // Send the analytics
      const data = {
        uuid: storage.UUID,
        hostname: details.initiator,
        cdn: blockedHostname,
      }
      console.log(data)
      const response = await postData(analyticsEndpoint, data)
      // Reset the cooldown if the server acknowledged
      if (response && response.ok) {
        chrome.storage.sync.set({ lastSentAt: Date.now() })
        chrome.storage.sync.set({ lastBlockedHost: blockedHostname })
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

// Helper function to POST data using fetch()
async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).catch((err) => {
    console.log(err + "\n Maybe the server is down?")
  })
  return response
}

// Initial setup
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    chrome.storage.sync.set({ UUID: getUUID() })
    chrome.storage.sync.set({ analyticsEnabled: true })
    chrome.storage.sync.set({ lastBlockedHost: "" })
    chrome.storage.sync.set({ lastSentAt: 0 })
    chrome.storage.sync.set({ blockCounter: 0 })
    chrome.tabs.create({ url: "https://www.accessibyebye.org/" })
  }
})
