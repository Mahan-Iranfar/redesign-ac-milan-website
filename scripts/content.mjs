import fs from "node:fs";
const read = (n) => JSON.parse(fs.readFileSync(`public/data/${n}.json`));
const players = read("players"),
  fixtures = read("fixtures"),
  stories = read("stories"),
  legends = read("legends");
fs.mkdirSync(".content-cache", { recursive: true });
for (const f of fs.readdirSync(".content-cache")) {
  if (f.endsWith(".html")) fs.rmSync(".content-cache/" + f);
}
fs.cpSync("public", ".content-cache", { recursive: true });
const esc = (s) =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll('"', "&quot;");
const link = (to, text, cl = "text-link") =>
  `<a class="${cl}" href="${to}">${text}<span aria-hidden="true">↗</span></a>`;
const photo = (src, alt, cl = "") =>
  `<img class="${cl}" src="assets/${src}" alt="${alt}" loading="lazy" width="1600" height="1000">`;
const eyebrow = (s) => `<p class="eyebrow">${s}</p>`;
const sectionTitle = (small, title, to, label) =>
  `<div class="section-heading flex justify-between"><div>${eyebrow(small)}<h2>${title}</h2></div>${to ? link(to, label) : ""}</div>`;
const note = (
  s = "Official club portraits and roster identities · 2026/27 snapshot checked 30 October 2026. Independent concept.",
) => `<p class="demo-note">${s}</p>`;
const mark = () =>
  `<span class="official-club-mark"><img src="assets/teams/milan.png" alt="AC Milan crest" width="37" height="49"></span>`;
const head = (title, sub, kicker = "ClubSphere / AC Milan Edition") =>
  `<section class="page-head wrap">${eyebrow(kicker)}<h1>${title}</h1><p class="intro">${sub}</p></section>`;
const navItems = [
  ["index.html", "Home"],
  ["club.html", "The Club"],
  ["squad.html", "The Squad"],
  ["fixtures.html", "Matchday"],
  ["news.html", "Stories"],
  ["fan-zone.html", "Fan Zone"],
];
const allPages = [
  ...navItems,
  ["history.html", "History & Heritage"],
  ["honours.html", "Honours"],
  ["legends.html", "Legends"],
  ["stadium.html", "San Siro"],
  ["academy.html", "Academy"],
  ["partners.html", "Partners"],
  ["contact.html", "Contact"],
];
function shell(file, title, body) {
  let active = file.startsWith("player-")
    ? "squad.html"
    : file.startsWith("article-")
      ? "news.html"
      : file.startsWith("match-")
        ? "fixtures.html"
        : file;
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#08090B"><meta name="description" content="${esc(title)} — ClubSphere, an independent football design concept inspired by AC Milan."><title>${esc(title)} · ClubSphere</title><link rel="preload" href="assets/bebas-neue.woff2" as="font" type="font/woff2" crossorigin><link rel="icon" href="assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="assets/utilities.css"><link rel="stylesheet" href="assets/style.css"><script type="module" src="js/main.js"></script></head><body><a class="skip" href="#main">Skip to content</a><header class="site-header"><a class="brand" href="index.html" aria-label="ClubSphere home">${mark()}<span>CLUBSPHERE<small>AC MILAN EDITION</small></span></a><nav class="desktop-nav" aria-label="Primary">${navItems
    .slice(1)
    .map(
      ([u, t]) =>
        `<a href="${u}" ${active === u ? 'aria-current="page"' : ""}>${t}</a>`,
    )
    .join(
      "",
    )}</nav><button class="menu-toggle" aria-label="Open all pages" aria-controls="site-menu" aria-expanded="false">MENU <span aria-hidden="true">☰</span></button></header><dialog id="site-menu" class="menu-dialog"><div class="menu-top"><span>EXPLORE CLUBSPHERE</span><button data-close-menu aria-label="Close menu">Close ×</button></div><nav aria-label="All pages">${allPages.map(([u, t], i) => `<a href="${u}"><small>${String(i + 1).padStart(2, "0")}</small>${t}<span>↗</span></a>`).join("")}</nav><p>Independent concept. A shared passion.</p></dialog><main id="main">${body}</main><footer><div class="wrap"><div class="footer-top"><a class="brand" href="index.html">${mark()}<span>CLUBSPHERE<small>AC MILAN EDITION</small></span></a><p>One city. Two colours.<br>An identity without borders.</p><a class="text-link" href="#main">Back to top ↑</a></div><div class="footer-links">${allPages
    .slice(1)
    .map(([u, t]) => `<a href="${u}">${t}</a>`)
    .join(
      "",
    )}</div><div class="footer-bottom"><p>Independent concept project. Not affiliated with or endorsed by AC Milan.</p><a href="credits.html">Sources, credits & privacy</a><span>© 2026 ClubSphere concept</span></div></div></footer><dialog class="lightbox" id="lightbox"><button data-close-lightbox aria-label="Close image">×</button><img alt=""><p></p></dialog></body></html>`;
}
function write(file, title, body) {
  fs.writeFileSync(`.content-cache/${file}`, shell(file, title, body));
}
function playerArt(p) {
  return `<div class="player-art official-portrait"><span class="shirt-number">${p.number}</span><img class="portrait-front" src="assets/${p.image}" alt="${esc(p.first + " " + p.last)} — official AC Milan portrait" loading="lazy" width="850" height="850"><img class="portrait-hover" src="assets/${p.hoverImage}" alt="" aria-hidden="true" loading="lazy" width="850" height="850"><span class="art-caption">AC MILAN / 2026–27</span></div>`;
}
const playerCard = (p) =>
  `<a href="player-${p.id}.html" class="player-card" data-position="${p.position}">${playerArt(p)}<div class="player-meta"><small>${p.position} / ${p.nationality}</small><h3>${p.first}<br><strong>${p.last}</strong></h3><span aria-hidden="true">↗</span></div></a>`;
const storyCard = (s, i = 0) =>
  `<article class="story-card ${i === 0 ? "lead" : ""}" data-category="${s.category}"><a href="article-${s.id}.html">${photo(s.image, "Atmospheric football photograph")}<div class="story-copy">${eyebrow(s.category + " <span>•</span> " + new Date(s.date + "T12:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }))}<h3>${s.title}</h3><p>${s.intro}</p><span class="story-arrow" aria-hidden="true">↗</span></div></a></article>`;
const teamAssets = read("official-assets-extra").teams;
const badge = (team) =>
  `<span class="team-badge real-crest"><img src="${teamAssets[team.toLowerCase()].local_path}" alt="${team} crest" width="64" height="72" loading="lazy"></span>`;
const fixtureRow = (m) =>
  `<a class="fixture-row" href="match-${m.id}.html" data-competition="${m.competition}" data-month="${m.date.slice(0, 7)}" data-status="${m.status}"><div class="fixture-date">${new Date(m.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", timeZone: "UTC" })}<small>${m.competition} / ${m.home ? "Home" : "Away"}</small></div><div class="fixture-teams">${m.home ? badge("Milan") + "<b>Milan</b>" : badge(m.opponent) + `<b>${m.opponent}</b>`}<strong>${m.score || "VS"}</strong>${m.home ? `<b>${m.opponent}</b>` + badge(m.opponent) : "<b>Milan</b>" + badge("Milan")}</div><div class="fixture-status">${m.status}<small>${m.venue} · ${new Date(m.date).toISOString().slice(11, 16)} UTC</small></div><span aria-hidden="true">↗</span></a>`;
const stats = () =>
  `<div class="trophy-grid"><div><svg class="trophy-symbol" viewBox="0 0 60 70" aria-hidden="true"><path d="M16 8h28v18c0 14-28 14-28 0V8zm0 6H7v10c0 9 9 12 14 12m23-22h9v10c0 9-9 12-14 12M30 38v19M19 61h22M23 57h14" fill="none" stroke="currentColor" stroke-width="3"/></svg><strong data-count="19">19</strong><span>Italian league titles</span></div><div><svg class="trophy-symbol" viewBox="0 0 60 70" aria-hidden="true"><path d="M16 8h28v18c0 14-28 14-28 0V8zm0 6H7v10c0 9 9 12 14 12m23-22h9v10c0 9-9 12-14 12M30 38v19M19 61h22M23 57h14" fill="none" stroke="currentColor" stroke-width="3"/></svg><strong data-count="7">7</strong><span>European Cups</span></div><div><svg class="trophy-symbol" viewBox="0 0 60 70" aria-hidden="true"><path d="M16 8h28v18c0 14-28 14-28 0V8zm0 6H7v10c0 9 9 12 14 12m23-22h9v10c0 9-9 12-14 12M30 38v19M19 61h22M23 57h14" fill="none" stroke="currentColor" stroke-width="3"/></svg><strong data-count="5">5</strong><span>UEFA Super Cups</span></div><div><svg class="trophy-symbol" viewBox="0 0 60 70" aria-hidden="true"><path d="M16 8h28v18c0 14-28 14-28 0V8zm0 6H7v10c0 9 9 12 14 12m23-22h9v10c0 9-9 12-14 12M30 38v19M19 61h22M23 57h14" fill="none" stroke="currentColor" stroke-width="3"/></svg><strong data-count="1">1</strong><span>FIFA Club World Cup</span></div></div>`;
const source = (url, label = "Historical source: AC Milan") =>
  `<p class="source"><a href="${url}" target="_blank" rel="noopener noreferrer">${label} ↗</a></p>`;
const pitch = () =>
  `<div class="pitch" aria-label="Illustrative formation"><div class="pitch-center"></div><div class="penalty top"></div><div class="penalty bottom"></div>${Array.from({ length: 11 }, (_, i) => `<span class="position-marker" data-marker="${i}">${i + 1}</span>`).join("")}</div>`;
const gallery = () =>
  `<div class="gallery">${["stadium.jpg", "pitch.jpg", "architecture.jpg"].map((x, i) => `<button class="gallery-button" data-gallery="assets/${x}" data-caption="${["San Siro at dusk — Daniele Simon / Unsplash", "Football on grass — Marcel Strauß / Unsplash", "San Siro exterior — Pierre Antona / Unsplash"][i]}">${photo(x, "Atmospheric football reference " + (i + 1))}<span>View image ↗</span></button>`).join("")}</div>`;
write(
  "index.html",
  "Built on legacy. Driven by passion.",
  `<section class="hero"><img class="hero-photo" src="assets/stadium.jpg" alt="Football stadium illuminated for an evening match" fetchpriority="high" width="1800" height="1200"><div class="hero-shade"></div><div class="hero-topline"><span>EST. 1899 · MILANO, ITALIA</span><span>AN INDEPENDENT FOOTBALL EXPERIENCE</span></div><div class="hero-content"><p class="eyebrow"><i></i> THE ROSSONERI SPIRIT</p><h1>BUILT ON LEGACY.<br>DRIVEN BY <em>PASSION.</em></h1><div class="hero-bottom"><p>More than a century of football.<br>One identity that transcends generations.</p>${link("history.html", "Discover the legacy", "button red")}</div></div><div class="hero-foot"><a href="#next-match">SCROLL TO EXPLORE ↓</a><span>01 — THE IDENTITY</span><span>MILANO / 45.4642° N</span></div></section><section id="next-match" class="next-match wrap"><div>${eyebrow("NEXT CHAPTER / ILLUSTRATIVE FIXTURE")}<span class="match-small">League · 08 Nov 2026 · 19:45 UTC</span></div><div class="next-teams">${badge("Milan")}<b>MILAN</b><span class="muted">VS</span><b>TORINO</b>${badge("Torino")}</div><div class="countdown" data-countdown="2026-11-08T19:45:00Z" aria-live="off">08 NOV · SAN SIRO</div>${link("match-milan-torino.html", "Match center")}</section><section class="identity wrap section"><div class="identity-image">${photo("pitch.jpg", "Football pitch and the culture of the game")}<span class="image-tag">A COLOUR. A CULTURE. A WAY OF LIFE.</span></div><div class="identity-copy">${eyebrow("01 / OUR DNA")}<h2>NOT JUST<br>A CLUB.<br><em>A FEELING.</em></h2><p>Some stories are bigger than the game. Born in Milan in 1899, the Rossoneri identity connects a city, its people, and generations of football dreams.</p>${link("club.html", "This is Milan")}<div class="identity-facts"><span><b>1899</b>THE BEGINNING</span><span><b>ROSSONERI</b>RED & BLACK. ALWAYS.</span></div></div></section><section class="section squad-section"><div class="wrap">${sectionTitle("02 / THE NEXT GENERATION", "MADE TO MAKE<br>A DIFFERENCE.", "squad.html", "Meet the squad")}${note()}<div class="carousel-controls"><button data-carousel-prev="players" aria-label="Previous players">←</button><button data-carousel-next="players" aria-label="Next players">→</button></div><div class="player-track" id="players">${[
    "christian-pulisic",
    "mike-maignan",
    "luka-modric",
    "fikayo-tomori",
    "goncalo-ramos",
  ]
    .map((id) => players.find((p) => p.id === id))
    .filter(Boolean)
    .map(playerCard)
    .join(
      "",
    )}</div></div></section><section class="wrap section">${sectionTitle("03 / INSIDE THE STORY", "BEYOND THE<br>FINAL WHISTLE.", "news.html", "All stories")}<div class="stories-grid">${stories.slice(0, 3).map(storyCard).join("")}</div>${note("Original concept editorials. Not official club news.")}</section><section class="honours-section section"><div class="wrap">${sectionTitle("04 / A LEGACY OF GLORY", "HISTORY DOESN’T<br>HAPPEN BY CHANCE.", "honours.html", "Explore the honours")}${stats()}<p class="caption">Selected honours through July 2024. A historical snapshot, not a live trophy total.</p></div></section><section class="stadium-feature"><img src="assets/stadium.jpg" alt="San Siro stadium at dusk" loading="lazy"><div class="wrap"><p class="eyebrow">05 / THE CATHEDRAL OF FOOTBALL</p><h2>SOME PLACES<br>GIVE YOU<br><em>GOOSEBUMPS.</em></h2><div class="stadium-feature-bottom"><p>San Siro. A stage for extraordinary nights.<br>Explore the architecture of belonging.</p>${link("stadium.html", "Step inside the story", "button light")}</div></div></section><section class="wrap section">${sectionTitle("06 / FOREVER ROSSONERI", "LEGENDS<br>NEVER FADE.", "legends.html", "Enter the exhibition")}<div class="legends-preview">${legends
    .slice(0, 3)
    .map(
      (l, i) =>
        `<a class="legend-preview" href="legend-${l.id}.html"><img class="legend-preview-photo" src="assets/${l.image}" alt="${esc(l.name)}" loading="lazy"><span class="legend-index">0${i + 1}</span><p>${l.era}</p><h3>${l.name}</h3><span>${l.title} ↗</span></a>`,
    )
    .join(
      "",
    )}</div></section><section class="fan-teaser wrap"><div>${eyebrow("07 / YOUR COLOURS. YOUR CLUB.")}<h2>PASSION IS<br>A PARTICIPATION SPORT.</h2><p>Test your knowledge. Build your formation. Find your favourite.</p></div>${link("fan-zone.html", "Enter the Fan Zone", "button red")}</section><section class="closing wrap"><p class="eyebrow">THE STORY IS STILL BEING WRITTEN</p><h2>THE LEGACY<br><em>CONTINUES.</em></h2>${link("club.html", "Be part of the story", "button outline")}</section>`,
);
write(
  "club.html",
  "The Club",
  head(
    "ONE CITY.<br>AN ENDLESS IDENTITY.",
    "A portrait of football, belonging and the spirit of Milan.",
    "The Club / 01",
  ) +
    `<section class="wrap editorial-split"><div class="large-figure">18<span>99</span></div><div><h2>Born in Milan.<br>Known around the world.</h2><p>AC Milan was founded on 16 December 1899. The red and black identity became a lasting symbol of a club whose story spans generations.</p><p>ClubSphere is an independent interpretation of that heritage: a place to explore pivotal moments, meet the legends and understand the culture around the game.</p>${source("https://www.acmilan.com/en/club/history")}${link("history.html", "Follow the timeline")}</div></section><section class="wrap section">${photo("architecture.jpg", "Architectural atmosphere reference", "wide-image")}<div class="three-columns grid gap-8"><article>${eyebrow("01 / BELONGING")}<h3>A shared language.</h3><p>Colours turn strangers into a community. The match is where the connection becomes visible.</p></article><article>${eyebrow("02 / AMBITION")}<h3>Always looking forward.</h3><p>Tradition becomes meaningful when it gives the next generation something to build upon.</p></article><article>${eyebrow("03 / EXPRESSION")}<h3>The Milanese spirit.</h3><p>This design pairs football’s intensity with an editorial sensibility inspired by the city.</p></article></div></section>`,
);
const years = [
  [
    "1899",
    "The first chapter",
    "Founded on 16 December, Milan begins a story in red and black.",
  ],
  [
    "1901",
    "The first championship",
    "Milan wins its first Italian league title. An early ambition becomes an achievement.",
  ],
  [
    "1926",
    "A new home",
    "San Siro opens on 19 September. A stadium begins its own extraordinary story.",
  ],
  [
    "1963",
    "Europe, for the first time",
    "At Wembley, Milan wins its first European Cup.",
  ],
  [
    "1989",
    "A new football language",
    "Arrigo Sacchi’s Milan wins the European Cup, repeating the achievement in 1990.",
  ],
  [
    "1994",
    "A night in Athens",
    "Fabio Capello’s team wins the European final against Barcelona.",
  ],
  [
    "2007",
    "The seventh European crown",
    "Milan wins in Athens again, bringing its European Cup and Champions League collection to seven.",
  ],
];
write(
  "history.html",
  "History & Heritage",
  head(
    "TIME PASSES.<br>LEGACY REMAINS.",
    "Explore the moments that shaped the Rossoneri story.",
    "The archive / 1899—2007",
  ) +
    `<nav class="timeline-nav wrap" aria-label="Jump to year">${years.map((y) => `<a href="#year-${y[0]}">${y[0]}</a>`).join("")}</nav><div class="timeline wrap">${years.map((y, i) => `<section id="year-${y[0]}" class="timeline-event reveal"><span class="year">${y[0]}</span><div>${eyebrow("CHAPTER " + String(i + 1).padStart(2, "0"))}<h2>${y[1]}</h2><p>${y[2]}</p><details><summary>Inside this chapter</summary><p>${i === 2 ? "The venue was initiated by Piero Pirelli and designed for football, without an athletics track." : "This chapter is part of a historical selection, not an exhaustive club chronology. Explore the official archive for deeper accounts and contemporary records."}</p>${source(i === 2 ? "https://www.acmilan.com/en/club/venues/san-siro" : "https://www.acmilan.com/en/club/history", "Read the official archive")}</details></div></section>`).join("")}</div><section class="wrap section">${eyebrow("CONTINUE THE JOURNEY")}${link("legends.html", "Meet the people behind the moments", "button red")}</section>`,
);
write(
  "honours.html",
  "Honours & Trophies",
  head(
    "THE WEIGHT<br>OF GREATNESS.",
    "Selected honours through July 2024. A permanent record of extraordinary teams, not a live total.",
    "The trophy room",
  ) +
    `<section class="honours-section"><div class="wrap">${stats()}</div></section><section class="wrap section">${sectionTitle("SEVEN NIGHTS / ONE CONTINENT", "KINGS OF EUROPE.")}<div class="europe-years">${["1963", "1969", "1989", "1990", "1994", "2003", "2007"].map((y, i) => `<div><span>0${i + 1}</span><strong>${y}</strong><p>European Cup /<br>Champions League</p></div>`).join("")}</div>${source("https://www.acmilan.com/en/club/palmares/uefa-champions-league")}${source("https://www.acmilan.com/en/news/articles/club/2024-07-16/125-years-of-ac-milan-the-program-of-initiatives", "Source for July 2024 honours snapshot")}</section>`,
);
write(
  "squad.html",
  "The Squad",
  head(
    "INDIVIDUAL TALENT.<br>COLLECTIVE IDENTITY.",
    "The Rossoneri, in their own colours. Official club portraits and player identities from the 2026/27 directory.",
    "First team / 2026–27",
  ) +
    `<section class="wrap section compact">${note("Roster snapshot from acmilan.com, checked 30 October 2026. Hover or keyboard-focus a card to see the alternate official portrait.")}<div class="filter-bar" role="group" aria-label="Filter squad">${["All Players", "Goalkeepers", "Defenders", "Midfielders", "Forwards"].map((x, i) => `<button data-player-filter="${x}" aria-pressed="${i === 0}">${x}</button>`).join("")}</div><p class="sr-only" id="squad-count" aria-live="polite"></p><div class="squad-grid">${players.map(playerCard).join("")}</div></section>`,
);
players.forEach((p, i) =>
  write(
    `player-${p.id}.html`,
    p.first + " " + p.last,
    `<section class="profile-hero wrap"><div>${eyebrow("FIRST TEAM / " + p.position)}<h1>${p.first}<br><em>${p.last}</em></h1><p>${p.nationality} <span class="dot">•</span> No. ${p.number} <span class="dot">•</span> ${p.season}</p>${note("Official AC Milan portrait and roster identity. Snapshot checked 30 October 2026.")}${link("squad.html", "Back to the squad")}</div><div class="profile-portrait-control">${playerArt(p)}<button type="button" class="button outline portrait-switch" aria-pressed="false">Switch portrait ↔</button></div></section><section class="wrap editorial-split section"><div><h2>THE PERSON<br>BEHIND THE NUMBER.</h2><p>${p.bio}</p>${source(p.source, "View official player biography and statistics")}</div><div class="stat-panel identity-panel"><div><strong>${p.number}</strong><span>Shirt number</span></div><div><strong>${p.season}</strong><span>Official directory season</span></div><div><strong>${p.nationality}</strong><span>Nationality listed by the club</span></div><p>No unverified season statistics are displayed. Use the official profile for current figures.</p></div></section><section class="wrap section compact"><h2>TWO SIDES.<br>ONE IDENTITY.</h2><p>Official portrait series from AC Milan. Open either image for a closer look.</p><div class="gallery player-gallery">${[p.image, p.hoverImage].map((img, j) => `<button class="gallery-button" data-gallery="assets/${img}" data-caption="${esc(p.first + " " + p.last)} — ${j ? "alternate" : "front"} portrait. Source: AC Milan. Rights reserved."><img src="assets/${img}" alt="${esc(p.first + " " + p.last)} ${j ? "alternate" : "front"} portrait" loading="lazy" width="850" height="850"><span>View portrait ↗</span></button>`).join("")}</div></section><section class="wrap section"><h2>RELATED READING.</h2><div class="stories-grid two">${stories.slice(0, 2).map(storyCard).join("")}</div>${link(`player-${players[(i + 1) % players.length].id}.html`, "Next player: " + players[(i + 1) % players.length].first + " " + players[(i + 1) % players.length].last, "button outline")}</section>`,
  ),
);
write(
  "fixtures.html",
  "Fixtures & Results",
  head(
    "EVERY MATCH.<br>A NEW CHAPTER.",
    "An interactive schedule demonstrating the matchday experience. All fixtures and results are illustrative.",
    "Matchday / Static demonstration",
  ) +
    `<section class="wrap section compact"><div class="fixture-filters"><label>Competition<select id="competition"><option value="all">All competitions</option><option>League</option><option>European</option><option>Cup</option></select></label><label>Month<select id="month"><option value="all">All months</option><option value="2026-09">September 2026</option><option value="2026-10">October 2026</option><option value="2026-11">November 2026</option><option value="2026-12">December 2026</option></select></label><label>Match status<select id="status"><option value="all">All matches</option><option value="Scheduled">Scheduled</option><option value="Full time">Results</option></select></label><button id="reset-fixtures" class="button outline">Reset filters</button></div><div id="fixture-list">${fixtures.map(fixtureRow).join("")}</div><p id="fixture-empty" hidden>No matches match these filters. Try another month or competition.</p><p id="fixture-count" aria-live="polite"></p>${note("Static demo. Times are shown in UTC. No live scores, official scheduling or ticket sales.")}</section>`,
);
fixtures.forEach((m) =>
  write(
    `match-${m.id}.html`,
    `${m.home ? "Milan" : m.opponent} vs ${m.home ? m.opponent : "Milan"}`,
    head(
      "THE MATCH CENTER.",
      "Illustrative match experience. The score, events, statistics and lineups are fictional.",
      "Matchday / " + m.competition,
    ) +
      `<section class="match-score wrap">${eyebrow(m.status + " / " + m.venue)}<div class="scoreline"><div>${badge(m.home ? "Milan" : m.opponent)}<h2>${m.home ? "Milan" : m.opponent}</h2></div><strong>${m.score || "VS"}</strong><div>${badge(m.home ? m.opponent : "Milan")}<h2>${m.home ? m.opponent : "Milan"}</h2></div></div><p>${new Date(m.date).toUTCString()}</p>${m.score ? "" : `<div data-countdown="${m.date}"></div>`}</section><section class="wrap section"><div class="filter-bar" role="group" aria-label="Match information"><button data-match-tab="overview" aria-pressed="true">Overview</button><button data-match-tab="lineups" aria-pressed="false">Lineups</button><button data-match-tab="statistics" aria-pressed="false">Statistics</button></div><div data-match-panel="overview"><h2>${m.score ? "THE STORY OF THE GAME." : "BEFORE THE FIRST WHISTLE."}</h2>${m.score ? `<ol class="match-events"><li><time>12′</time><div><b>Goal / Concept Milan</b><p>The illustrative striker finds space in the area.</p></div></li><li><time>38′</time><div><b>Yellow card / Opposition</b><p>A late challenge interrupts the transition.</p></div></li><li><time>64′</time><div><b>Substitution / Concept Milan</b><p>An illustrative substitute enters for fresh energy.</p></div></li><li><time>90′</time><div><b>Full time</b><p>Illustrative result: ${m.score}. Selected demo events, not a complete scoring log.</p></div></li></ol>` : `<p>A fictional fixture preview exploring how a club can make match information easy to understand. No result or live events are available.</p><div class="three-columns grid gap-8"><article><h3>The setting</h3><p>${m.venue}. ${m.home ? "Home" : "Away"} fixture in the illustrative ${m.competition.toLowerCase()} schedule.</p></article><article><h3>The approach</h3><p>Explore the formation tab for a concept 4–3–3 and a sample squad list.</p></article><article><h3>Follow the calendar</h3><p>This schedule is static. It does not update when an actual match is played.</p></article></div>`}</div><div data-match-panel="lineups" hidden><div class="editorial-split"><div data-formation-static="4-3-3">${pitch()}</div><div><h2>CONCEPT XI / 4–3–3</h2>${note("Illustrative tactical roles only; this is not an official match lineup.")}<ol class="lineup-list">${["Goalkeeper · example slot", "Right back · example slot", "Centre back · example slot", "Centre back · example slot", "Left back · example slot", "Central midfield · example slot", "Central midfield · example slot", "Central midfield · example slot", "Right wing · example slot", "Striker · example slot", "Left wing · example slot"].map((x) => `<li>${x}</li>`).join("")}</ol></div></div></div><div data-match-panel="statistics" hidden><h2>${m.score ? "THE GAME IN NUMBERS." : "THE NUMBERS COME LATER."}</h2>${
        m.score
          ? `<p>Illustrative match statistics, Milan / opposition.</p>${[
              [58, 42, "Possession %"],
              [14, 8, "Shots"],
              [6, 3, "Shots on target"],
              [7, 4, "Corners"],
            ]
              .map(
                ([a, b, l]) =>
                  `<div class="stat-bar"><div><b>${a}</b><span>${l}</span><b>${b}</b></div><div class="bar"><i style="width:${(a / (a + b)) * 100}%"></i></div></div>`,
              )
              .join("")}`
          : "<p>No match statistics are available for a scheduled demo fixture. Explore a completed fixture to see the sample statistical interface.</p>"
      }</div></section>`,
  ),
);
write(
  "news.html",
  "News & Stories",
  head(
    "THE STORIES<br>THAT STAY WITH YOU.",
    "An independent editorial journal about identity, football and the moments between matches.",
    "The Journal / Concept editorials",
  ) +
    `<section class="wrap section compact"><div class="filter-bar" aria-label="Story categories">${["All", "Culture", "On the pitch", "Matchday", "Academy"].map((s, i) => `<button data-story-filter="${s}" aria-pressed="${i === 0}">${s}</button>`).join("")}</div><div class="stories-grid archive">${stories.map(storyCard).join("")}</div><p id="story-count" aria-live="polite"></p></section>`,
);
stories.forEach((s, i) =>
  write(
    `article-${s.id}.html`,
    s.title,
    `<article><header class="article-head wrap">${eyebrow(s.category + " / " + s.date)}<h1>${s.title}</h1><p class="intro">${s.intro}</p><p class="caption">ClubSphere editorial desk · Independent concept writing · 2 min read</p></header><div class="wrap">${photo(s.image, "Atmospheric football reference", "article-image")}</div><div class="article-body">${note("Original editorial concept. Not official club reporting.")}<p class="dropcap">${s.paragraphs[0]}</p>${s.paragraphs
      .slice(1)
      .map((p) => `<p>${p}</p>`)
      .join(
        "",
      )}<blockquote>Football is played for ninety minutes.<br>Belonging lasts much longer.</blockquote><p class="caption">ClubSphere editorial interpretation</p><button class="button outline" data-copy-link>Copy article link ↗</button><p data-copy-status aria-live="polite"></p></div></article><section class="wrap section">${sectionTitle("KEEP READING", "ANOTHER PERSPECTIVE.")}<div class="stories-grid two">${stories
      .filter((x) => x.id !== s.id)
      .slice(0, 2)
      .map(storyCard)
      .join("")}</div></section>`,
  ),
);
write(
  "legends.html",
  "Legends — A Curated Tribute",
  head(
    "THEY PLAYED.<br>WE REMEMBER.",
    "A curated tribute to the people who made the shirt unforgettable. This selection is not the official Hall of Fame roster.",
    "Legends / The permanent collection",
  ) +
    `<section class="wrap legend-list">${legends.map((l, i) => `<a href="legend-${l.id}.html" class="legend-row"><img class="legend-row-photo" src="assets/${l.image}" alt="${esc(l.name)}" loading="lazy"><div><p>${l.era}</p><h2>${l.name}</h2></div><span>${l.title}</span><b>↗</b></a>`).join("")}</section>`,
);
legends.forEach((l, i) =>
  write(
    `legend-${l.id}.html`,
    l.name,
    `<section class="legend-hero wrap"><div class="legend-monogram legend-real-photo"><img src="assets/${l.image}" alt="${esc(l.name)} — AC Milan archive" width="800" height="1000"></div><div>${eyebrow("THE PERMANENT COLLECTION / 0" + (i + 1))}<h1>${l.name}</h1><p class="serif">${l.title}</p><p>Milan era · ${l.era}</p>${note("Archive portrait sourced from AC Milan. Image rights remain with the original rights holder.")}</div></section><section class="wrap editorial-split section"><h2>A NAME.<br>A LASTING IMPRESSION.</h2><div><p class="intro">${l.bio}</p><h3>Signature chapter</h3><p>${l.moment}</p><h3>In the collective memory</h3><p>Explore the club’s historical archive for the full career record, contemporary photographs and the wider story behind this tribute.</p>${source(l.source || "https://www.acmilan.com/en/club/history", "Explore the official club archive")}${link(`legend-${legends[(i + 1) % legends.length].id}.html`, "Next legend: " + legends[(i + 1) % legends.length].name)}</div></section>`,
  ),
);
write(
  "stadium.html",
  "San Siro — The Stadium Experience",
  `<section class="stadium-feature stadium-page"><img src="assets/stadium.jpg" alt="San Siro stadium at dusk"><div class="wrap">${eyebrow("MILANO / THE STADIUM CHAPTER")}<h1>A PLACE.<br>A THOUSAND<br><em>EMOTIONS.</em></h1><p>San Siro. Since 1926.</p><p class="caption">San Siro photographed by Daniele Simon. Explore its history below.</p></div></section><section class="wrap editorial-split section"><h2>BUILT FOR<br>THE BEAUTIFUL GAME.</h2><div><p>Inaugurated on 19 September 1926, San Siro was conceived as a football ground without an athletics track. Piero Pirelli initiated the project in 1925.</p><p>Inter began sharing the stadium in the 1947–48 season. Its architecture evolved as the scale of the game grew, including a second tier in 1955.</p>${source("https://www.acmilan.com/en/club/venues/san-siro")}</div></section><section class="wrap section compact"><h2>EXPLORE THE ATMOSPHERE.</h2><p>Select a point on this conceptual stadium illustration. It is not an official seating or ticketing map.</p><div class="stadium-map"><div class="stadium-oval"><div class="stadium-grass"></div></div>${[
    ["roof", 50, 14, "Roof & structure"],
    ["stands", 21, 45, "The stands"],
    ["pitch", 55, 65, "The pitch"],
  ]
    .map(
      ([id, x, y, t]) =>
        `<button class="hotspot" style="left:${x}%;top:${y}%" data-hotspot="${id}" aria-label="${t}" aria-pressed="false">+</button>`,
    )
    .join(
      "",
    )}</div><div id="hotspot-info" class="hotspot-info" aria-live="polite"><h3>A theatre of football</h3><p>Choose a marker to explore the design of a matchday experience.</p></div>${gallery()}</section><section class="wrap section"><div class="visit-panel"><h2>PLAN A REAL VISIT.</h2><p>Tour times, accessibility arrangements and entry conditions can change. Check the official stadium website before travelling. ClubSphere does not sell tickets or take bookings.</p>${link("https://sansirostadium.com/?lang=en", "Official stadium information", "button red")}</div></section>`,
);
write(
  "academy.html",
  "Academy — The Next Generation",
  head(
    "THE FUTURE<br>STARTS WITH A TOUCH.",
    "An illustrative development philosophy. This page is a concept, not an AC Milan programme or registration offer.",
    "Academy / Concept pathway",
  ) +
    `<section class="wrap">${photo("pitch.jpg", "Football training atmosphere", "wide-image")}</section><section class="wrap section"><div class="three-columns grid gap-8"><article>${eyebrow("01 / FOUNDATION")}<h2>EXPLORE.</h2><p>Ball familiarity, coordination and confidence. Small games encourage curiosity and make learning enjoyable.</p></article><article>${eyebrow("02 / DEVELOPMENT")}<h2>UNDERSTAND.</h2><p>Decision-making, awareness and teamwork. Players learn to see options and explain their choices.</p></article><article>${eyebrow("03 / PROGRESSION")}<h2>EXPRESS.</h2><p>Individual strengths meet collective responsibility. Reflection matters as much as the result.</p></article></div><div class="faq"><details><summary>Is this an official academy programme?</summary><p>No. This is an illustrative page showing how a development pathway could be explained.</p></details><details><summary>Can I register here?</summary><p>No registrations are collected. The official AC Milan website provides information about actual programmes.</p></details><details><summary>What does the pathway demonstrate?</summary><p>A clear progression from confidence with the ball to understanding the game and expressing individual strengths.</p></details></div>${link("https://www.acmilan.com/en/academy", "Explore the official Milan Academy", "button outline")}</section>`,
);
write(
  "fan-zone.html",
  "Fan Zone",
  head(
    "LESS SPECTATING.<br>MORE PARTICIPATING.",
    "Your football knowledge. Your system. Your colours. Three experiences, built entirely in your browser.",
    "Fan Zone / Play your part",
  ) +
    `<nav class="wrap filter-bar" aria-label="Fan experiences"><a href="#quiz">01 / Legends quiz</a><a href="#formation">02 / Formation explorer</a><a href="#favourite">03 / Your favourite</a></nav><section class="wrap section fan-module" id="quiz">${eyebrow("01 / KNOW YOUR HISTORY")}<div class="editorial-split"><div><h2>HOW DEEP<br>IS YOUR RED?</h2><p>Five questions from the club’s history. Choose an answer, see the explanation and move to the next chapter.</p></div><div class="quiz-box"><div class="quiz-progress"><span id="quiz-progress">Question 1 of 5</span><progress id="quiz-meter" value="0" max="5">0/5</progress></div><h3 id="quiz-question"></h3><div id="quiz-answers"></div><p id="quiz-feedback" aria-live="polite"></p><button id="quiz-next" class="button red" hidden>Next question →</button><button id="quiz-restart" class="button outline" hidden>Play again ↻</button></div></div></section><section class="wrap section fan-module" id="formation">${eyebrow("02 / THINK LIKE A COACH")}<div class="editorial-split"><div><h2>YOUR SYSTEM.<br>YOUR CALL.</h2><p>Switch formations to explore how the positions change. Markers represent roles, not real players.</p><label class="select-label">Choose a formation<select id="formation-select"><option>4-3-3</option><option>4-2-3-1</option><option>3-5-2</option><option>4-4-2</option></select></label><p id="formation-description" aria-live="polite"></p></div><div id="formation-pitch">${pitch()}</div></div></section><section class="wrap section fan-module" id="favourite">${eyebrow("03 / WEAR YOUR CHOICE")}<div class="editorial-split"><div><h2>A PERSONAL<br>CONNECTION.</h2><p>Pick a Rossoneri player to make your own fan card. Your choice is stored only in this browser.</p><label class="select-label">Favourite player<select id="favourite-select">${players.map((p) => `<option value="${p.id}">${p.first} ${p.last}</option>`).join("")}</select></label><button id="save-favourite" class="button red">Save my favourite</button><button id="clear-favourite" class="text-button">Clear saved choice</button><p id="favourite-status" aria-live="polite"></p></div><div id="fan-card" class="fan-card"></div></div></section>`,
);
write(
  "partners.html",
  "Creative Partnerships",
  head(
    "SHARED AMBITION.<br>NEW POSSIBILITIES.",
    "A demonstration of a partnership storytelling page. No brands shown here are AC Milan sponsors or ClubSphere clients.",
    "Partnerships / Concept only",
  ) +
    `<section class="wrap section compact"><div class="partner-statement"><span class="serif">Great partnerships start<br>with a shared point of view.</span></div><div class="three-columns grid gap-8"><article>${eyebrow("01 / DESIGN & CULTURE")}<h3>Beyond the badge.</h3><p>Editorial collaborations can connect a football identity with the creative life of its city.</p></article><article>${eyebrow("02 / TECHNOLOGY")}<h3>Closer to the game.</h3><p>Thoughtful digital experiences can make archives, match information and fan participation more accessible.</p></article><article>${eyebrow("03 / COMMUNITY")}<h3>A lasting contribution.</h3><p>Purposeful projects put the experience of supporters first and give a collaboration something meaningful to say.</p></article></div>${link("contact.html", "Prepare a collaboration brief", "button red")}</section>`,
);
write(
  "contact.html",
  "Start a Conversation",
  head(
    "LET’S BUILD<br>THE NEXT CHAPTER.",
    "Prepare a collaboration brief for the creator of this concept. The form creates a local text file; nothing is submitted or sent.",
    "Contact / Local brief builder",
  ) +
    `<section class="wrap editorial-split section compact"><div><h2>AN IDEA WORTH<br>EXPLORING?</h2><p>ClubSphere demonstrates how a distinctive identity can become a complete digital experience. Use the brief builder to outline your club, athlete or creative project.</p><p>No personal information leaves your browser. Download the brief, review it, and share it through your preferred channel.</p><p class="caption">This is not an AC Milan contact service.</p></div><form id="brief-form"><label>Your name<input name="name" required maxlength="100" autocomplete="name" placeholder="How should we address you?"></label><label>Project type<select name="type"><option>Football club website</option><option>Athlete portfolio</option><option>Editorial experience</option><option>Creative collaboration</option></select></label><label>Project outline<textarea name="message" required minlength="20" maxlength="4000" rows="5" placeholder="Tell us about your goals, audience and timeline."></textarea></label><button class="button red" type="submit">Download my brief ↓</button><p id="brief-status" aria-live="polite"></p></form></section>`,
);
write(
  "404.html",
  "Page Not Found",
  `<section class="wrap error-page">${eyebrow("OUTSIDE THE TOUCHLINE")}<span class="error-number">404</span><h1>THIS BALL<br>WENT OUT OF PLAY.</h1><p>The page you’re looking for isn’t here. Let’s get you back in the game.</p>${link("index.html", "Back to home", "button red")}${link("fixtures.html", "Explore matchday", "button outline")}</section>`,
);
write(
  "credits.html",
  "Sources, Credits & Privacy",
  head(
    "THE DETAILS<br>BEHIND THE EXPERIENCE.",
    "Transparent sources, honest demonstration data and local-only interactions.",
    "Project notes",
  ) +
    `<section class="article-body"><h2>Independent by design</h2><p>Independent concept project. Not affiliated with or endorsed by AC Milan. ClubSphere uses official club-sourced player portraits, archive images and team crests in an independent concept presentation. Club names are used for historical and editorial identification.</p><h2>What is fictional?</h2><p>Player names, numbers, nationalities and portraits come from the official 2026/27 directory. Fixtures, match events and results remain fictional. Academy pathways and partnership concepts are illustrative. Articles are original concept editorials, not club news. The roster is a dated snapshot; no live data is claimed.</p><h2>Historical sources</h2>${source("https://www.acmilan.com/en/club/history", "Club history")}${source("https://www.acmilan.com/en/club/palmares/uefa-champions-league", "European honours")}${source("https://www.acmilan.com/en/news/articles/club/2024-07-16/125-years-of-ac-milan-the-program-of-initiatives", "Honours snapshot, July 2024")}${source("https://www.acmilan.com/en/club/venues/san-siro", "San Siro history")}<p>Legend biographies are concise paraphrases of the official AC Milan archive and UEFA profiles. The complete source list is included in the project README.</p><h2>Photography & assets</h2><p>Bundled football photographs are atmospheric references from Unsplash, not representations of named fictional players. Full asset credits accompany the source code. Official player portraits, alternate hover poses, legends images and crests are included with exact source URLs in the asset manifests. These assets remain copyrighted; their inclusion does not grant a redistribution license.</p><h2>Your privacy</h2><p>The favourite-player feature saves a player identifier in localStorage on this device. Use “Clear saved choice” to remove it. Quiz answers are held in memory. Contact briefs download locally. There are no accounts, analytics, tracking cookies or form transmissions.</p><h2>Accessibility</h2><p>Keyboard navigation, visible focus, reduced motion, semantic landmarks and descriptive labels are built into the experience. This is not a claim of audited WCAG certification.</p></section>`,
);
console.log(
  `Generated ${fs.readdirSync(".content-cache").filter((x) => x.endsWith(".html")).length} static HTML pages.`,
);
