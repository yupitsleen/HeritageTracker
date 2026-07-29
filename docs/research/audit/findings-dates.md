# Date fact-check — slice-dates.json

**Checked: 146 | Confirmed/consistent with documented record: 136 | Flagged: 8 | Could not verify: 2**

Batch references used: Wikipedia "Destruction of cultural heritage during the Israeli invasion of the Gaza Strip", UNESCO Gaza damage assessment (164 verified sites as of 2026-03; no per-site dates published), gigaza.org war-damage database, Institute for Palestine Studies cultural/education sector databases. Differences of ≤3 days ignored per instructions.

## Flagged

| site-id | field | claimed | found | evidence-url | severity |
|---|---|---|---|---|---|
| ibn-uthman-mosque | dateDestroyed | 2024-07-15 | 2024-07-03 (destroyed by airstrikes, reported 3–4 July 2024) | https://www.middleeastmonitor.com/20240704-israel-destroys-second-largest-historical-mosque-in-gaza/ | wrong |
| holy-family-church-gaza | dateDestroyed | 2024-07-07 | 2025-07-17 (tank/misfired-munition strike, 3 killed) | https://www.cnn.com/2025/07/17/middleeast/pope-leo-israel-strike-gaza-church-intl | wrong (year) |
| qasr-al-basha | dateDestroyed | 2023-11-15 | December 2023 (missile strike during Gaza City ground fighting) | https://www.aa.com.tr/en/middle-east/israel-destroys-gaza-s-historical-palace-with-over-20-000-artifacts-looted/3745846 | wrong (month) |
| hammam-al-samra | dateDestroyed | 2024-02-10 | December 2023 | https://en.wikipedia.org/wiki/Destruction_of_cultural_heritage_during_the_Israeli_invasion_of_the_Gaza_Strip | wrong (month/year) |
| hammam-al-samra | status | damaged | described as destroyed in batch sources | https://en.wikipedia.org/wiki/Destruction_of_cultural_heritage_during_the_Israeli_invasion_of_the_Gaza_Strip | minor |
| shababeek-art-center | dateDestroyed | 2023-11-08 | late March 2024 (building leveled during two-week Al-Shifa raid; Nov 2023 caused only partial 3rd-floor damage) | https://www.theartnewspaper.com/2024/04/09/gazan-art-centre-destroyed-during-israels-raid-on-al-shifa-hospital | wrong (month/year) |
| samir-mansour-bookshop | dateDestroyed | 2023-10-17 | 2023-10-10 (bombed; second destruction after May 2021) | https://voices.uchicago.edu/scholasticide/timeline | minor (7 days) |
| al-israa-university | yearBuilt | 2000 | 2014 (established; Gaza's youngest university) | https://en.wikipedia.org/wiki/Israa_University_(Palestine) | wrong |
| abasan-mosaics | yearBuilt | "BCE 300 (Byzantine period, 4th–7th century CE)" | Byzantine-era mosaic floor, 4th–7th century CE — "300 BCE" self-contradicts the stated era | https://en.wikipedia.org/wiki/Destruction_of_cultural_heritage_during_the_Israeli_invasion_of_the_Gaza_Strip | minor (internal contradiction) |

Notes on near-misses (not flagged): ibn-othman-mosque claims 2024-07-01 vs actual 2024-07-03 — within tolerance. Central Archives 2023-11-29 (municipality announcement date) vs Wikipedia "Dec 2023" — kept. Ard-al-Moharbeen 2023-10-08 matches first-strike date exactly; "destroyed" supported by Dec 2023–Jan 2024 reporting. Great Mosque of Khan Yunis (Aug 2024), Bani Saleh (Aug 2024), Al-Aqsa University Library (May 2024), EBAF storage (2025-09-14), Gaza War Cemetery (2025), Israa demolition (2024-01-17), Abu Hussein school (2024-10-17), Al-Sardi school (2024-06-06), Al-Faruq Khan Yunis (2024-10-25, gigaza.org), Shuhada al-Aqsa Deir al-Balah (2024-10-06), hospital dates (Shifa 2024-03-18 raid, Ahli 2023-10-17, Nasser 2024-02-15, Kamal Adwan 2024-12-27, Indonesian 2023-11-20), and all 1948 / 1967 / 2008-09 / 2014 entries check out against the documented record.

## Could not verify

- gaza-center-culture-arts — no independent source located naming this center's destruction (only aggregate "32 cultural centres destroyed" counts).
- al-shuhada-mosque-khan-yunis — plausible within ministry aggregate mosque lists, but no source located naming this mosque or the 2023-12-11 date.

Additionally, ~30 entries carry day-precision ISO dates no source states at day precision (2023-12-06 library cluster: enaim, al-nahda, al-shorouq-al-daem, lubbud, kanaan, shahwan, ibrahim-abu-shaar; historic-house entries: al-mahatta, khader-tarazi, al-shawa, subat-al-alami, sabil-ar-rifaiya, dar-assaada, hani-saba, raghib-al-alami; collections A–D; byzantine-church-jabaliya). Events are documented (UNESCO 164-site list, Heritage for Peace, Librarians & Archivists with Palestine) but only to month/period precision — dates uncorroborated, not contradicted.

## Bonus

**Likely duplicate records (conflicting data, same site):**
- ibn-uthman-mosque vs ibn-othman-mosque — same Shuja'iyya mosque (built 1394–1426); dates 2024-07-15 vs 2024-07-01, built "1399-1400" vs "15th century". Merge; correct date 2024-07-03.
- blakhiyya-archaeological-site vs anthedon-harbour — Tell Blakhiyah IS the Anthedon harbour site; dates conflict (2024-01-15 vs 2023-12-01). Merge.
- islamic-university-central-library (2023-10-09) vs islamic-university-gaza-library (2008-12-29) — same building, two wars; fine if intentional, but names near-identical.

**Notable missing sites encountered:** Deir el-Balah (CWGC) War Cemetery (damaged; on Wikipedia's list), Al-Fakhoora UNRWA school (2023-11-18), Al-Tabin school (2024-08-10), Gaza Baptist Church (damaged 2023). Also note Katib al-Wilaya mosque (present) was damaged in the 2023-10-19 St. Porphyrius compound strike.

**Bulk sources for future checks:**
- https://gigaza.org/en/war-damage/ — per-site pages with exact strike dates (confirmed al-Faruq Khan Yunis to the day)
- https://gazacultrualsector.palestine-studies.org and https://gazaeducationsector.palestine-studies.org — IPS per-site destruction databases
- https://www.unesco.org/en/gaza/assessment — authoritative 164-site verified list (names + governorates, no per-site dates)
- https://en.wikipedia.org/wiki/Destruction_of_cultural_heritage_during_the_Israeli_invasion_of_the_Gaza_Strip — best single cross-reference
