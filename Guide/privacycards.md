# Not every frame is an incident.

Argus doesn't treat a single unusual frame as a confirmed hazard. Every potential incident passes through a temporal verification gate before an alert is dispatched.

### How confirmation works

**01 / DETECTED**
A potential hazard is identified in the current frame.

**02 / VERIFIED**
The same hazard is detected again in the next consecutive frame.

**03 / CONFIRMED**
The temporal voting threshold is satisfied and the incident is officially logged.

### Why this matters

Cameras constantly capture moments that can look dangerous in isolation — a worker crouching, motion blur, shadows, reflections, or a partially obstructed view. Argus evaluates consecutive frames to distinguish these transient anomalies from persistent hazards.

**2 of 3 consecutive frames must support the hazard before confirmation.**

### Verification state

`1 / 3`  →  `2 / 3`  →  `CONFIRMED`

Only after confirmation does Argus trigger the incident workflow: evidence capture, incident logging, dashboard update, and WhatsApp dispatch.

**Result:** fewer isolated visual anomalies turning into unnecessary alarms.


# When something happens, your team knows.

Argus turns a confirmed visual hazard into an actionable notification. Once an incident clears the verification gate, the system packages the evidence and sends it directly to the people responsible for responding.

### What the team receives

**HAZARD**
What happened — Fall, Fire/Smoke, No Helmet, Restricted Zone, and more.

**CONFIDENCE**
How strongly the model supports the classification.

**REASONING**
A concise basis explaining why the incident was confirmed.

**VISUAL EVIDENCE**
The captured incident frame attached to the alert.

### From camera to phone

`Camera Feed`
↓
`Vision Analysis`
↓
`Temporal Confirmation`
↓
`Incident Logged`
↓
`WhatsApp + Snapshot`

Typical time to alert: **~12–25 seconds**, depending on verification cycles and API round-trip latency.

The same confirmed incident simultaneously updates the dashboard, increments the relevant hazard counters, and enters the audit record.

**The goal isn't another dashboard notification. It's getting the right evidence to the right person while the incident is still actionable.**



# No camera replacement required.

Argus is designed to sit on top of the camera infrastructure you already have. Start with a browser camera for testing, connect existing RTSP CCTV feeds for industrial deployment, or move processing to an edge environment when production requirements demand it.

### Three ways to run Argus

**BROWSER CAMERA**
Use a standard browser-accessible camera for instant demonstrations, inspections, and testing.

`Camera → Browser → Argus`

**RTSP STREAM**
Connect existing industrial CCTV infrastructure without replacing the cameras already installed across the site.

`CCTV → RTSP → Argus`

**EDGE DEPLOYMENT**
Run Argus closer to the physical camera infrastructure for production environments where local processing and deployment flexibility matter.

`Camera → Edge → Argus`

### One intelligence layer. Multiple inputs.

The detection pipeline remains consistent regardless of how the video enters the system: frames are sampled, analyzed against structured safety criteria, temporally verified, and dispatched when confirmed.

**Start with one camera. Scale without rebuilding the surveillance layer.**
