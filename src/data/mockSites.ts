import type { GazaSite } from "../types";

/**
 * Mock data: 3 sample Gaza heritage sites for development
 * Using real sites from our research for realistic testing
 */
export const mockSites: GazaSite[] = [
  {
    id: "great-omari-mosque",
    name: "Great Omari Mosque",
    nameArabic: "جامع العمري الكبير",
    type: "mosque",
    yearBuilt: "7th century",
    yearBuiltIslamic: "1st century AH",
    coordinates: [31.5069, 34.4668], // Gaza City [lat, lng]
    status: "destroyed",
    dateDestroyed: "2023-12-07",
    dateDestroyedIslamic: "22 Jumada al-Ula 1445 AH",
    description:
      "Gaza's oldest and largest mosque, originally a Byzantine church converted in the 7th century. The mosque housed rare Islamic manuscripts and served as a center of learning for centuries.",
    historicalSignificance:
      "One of the oldest mosques in Palestine, with a history spanning over 1,400 years. It represents continuous religious and cultural heritage from Byzantine, Islamic, Crusader, Mamluk, and Ottoman periods.",
    culturalValue:
      "Contained 62 rare manuscripts including handwritten Qurans and Islamic scholarly texts. The building itself was an architectural masterpiece blending multiple historical periods.",
    verifiedBy: ["UNESCO", "Heritage for Peace", "Forensic Architecture"],
    images: {
      before: "/images/great-omari-before.jpg",
      after: "/images/great-omari-after.jpg",
      satellite: "/images/great-omari-satellite.jpg",
    },
    sources: [
      {
        organization: "UNESCO",
        title: "Gaza Heritage Damage Assessment",
        url: "https://www.unesco.org/en/articles/damaged-cultural-sites-gaza",
        date: "2024-05-27",
        type: "official",
      },
      {
        organization: "Heritage for Peace",
        title: "Cultural Heritage in Gaza: Destroyed and Damaged Sites Report",
        date: "2023-11-15",
        type: "documentation",
      },
    ],
  },
  {
    id: "church-st-porphyrius",
    name: "Church of St. Porphyrius",
    nameArabic: "كنيسة القديس برفيريوس",
    type: "church",
    yearBuilt: "5th century (425 CE)",
    yearBuiltIslamic: "197 BH (Before Hijra)",
    coordinates: [31.5203, 34.4547], // [lat, lng]
    status: "heavily-damaged",
    dateDestroyed: "2023-10-19",
    dateDestroyedIslamic: "3 Rabi' al-Thani 1445 AH",
    description:
      "One of the oldest churches in the world, built in 425 CE and named after Saint Porphyrius, Bishop of Gaza. The church served Gaza's small Christian community and was a rare example of early Byzantine architecture.",
    historicalSignificance:
      "Third-oldest church in the world still in use before the conflict. Contains the tomb of Saint Porphyrius and represents 1,600 years of continuous Christian presence in Gaza.",
    culturalValue:
      "Irreplaceable Byzantine-era mosaics, ancient religious artifacts, and architectural elements. Served as a sanctuary and community center for Gaza's Christian minority.",
    verifiedBy: ["UNESCO", "Heritage for Peace"],
    images: {
      before: "/images/st-porphyrius-before.jpg",
      after: "/images/st-porphyrius-after.jpg",
    },
    sources: [
      {
        organization: "UNESCO",
        title: "Gaza Heritage Damage Assessment",
        url: "https://www.unesco.org/en/articles/damaged-cultural-sites-gaza",
        date: "2024-05-27",
        type: "official",
      },
      {
        organization: "Al Jazeera",
        title: "Israeli strike damages historic Gaza church",
        url: "https://www.aljazeera.com/news/2023/10/20/israeli-strike-damages-historic-gaza-church",
        date: "2023-10-20",
        type: "journalism",
      },
    ],
  },
  {
    id: "blakhiyya-archaeological-site",
    name: "Blakhiyya Archaeological Site",
    nameArabic: "موقع البلاخية الأثري",
    type: "archaeological",
    yearBuilt: "800 BCE - 1100 CE",
    yearBuiltIslamic: "1422 BH - 493 AH",
    coordinates: [31.2656, 34.2945], // [lat, lng]
    status: "destroyed",
    dateDestroyed: "2024-01-15",
    dateDestroyedIslamic: "4 Rajab 1445 AH",
    description:
      "Ancient seaport and settlement site with continuous occupation from the Iron Age through the Islamic period. Contained over 4,000 archaeological objects including pottery, coins, and architectural remains.",
    historicalSignificance:
      "One of the most important archaeological sites in Gaza, documenting nearly 2,000 years of Mediterranean trade and cultural exchange. Provided crucial evidence of Philistine, Greek, Roman, Byzantine, and Islamic civilizations.",
    culturalValue:
      "Irreplaceable archaeological artifacts spanning multiple civilizations. The site was crucial for understanding ancient Gaza's role as a major port city and cultural crossroads.",
    verifiedBy: ["UNESCO", "Forensic Architecture", "Heritage for Peace"],
    images: {
      before: "/images/blakhiyya-before.jpg",
      satellite: "/images/blakhiyya-satellite.jpg",
    },
    sources: [
      {
        organization: "UNESCO",
        title: "Gaza Heritage Damage Assessment",
        url: "https://www.unesco.org/en/articles/damaged-cultural-sites-gaza",
        date: "2024-05-27",
        type: "official",
      },
      {
        organization: "Forensic Architecture",
        title: "Gaza Platform: Archaeological Sites",
        url: "https://forensic-architecture.org/investigation/gaza-platform",
        date: "2024-03-10",
        type: "documentation",
      },
    ],
  },
  {
    id: "qasr-al-basha",
    name: "Qasr Al-Basha",
    nameArabic: "قصر الباشا",
    type: "museum",
    yearBuilt: "13th century (Mamluk period)",
    yearBuiltIslamic: "7th century AH",
    coordinates: [31.5050, 34.4620], // Gaza City [lat, lng]
    status: "heavily-damaged",
    dateDestroyed: "2023-11-15",
    dateDestroyedIslamic: "1 Jumada al-Ula 1445 AH",
    description:
      "A 13th-century Mamluk palace that served as the residence of Napoleon Bonaparte during his 1799 Gaza campaign. Later converted into a museum showcasing Gaza's history with collections of pottery, coins, and historical artifacts.",
    historicalSignificance:
      "The palace represents Mamluk architectural heritage and served as an important administrative center throughout various historical periods. Its connection to Napoleon's campaign made it a landmark of international historical significance.",
    culturalValue:
      "Housed museum collections documenting Gaza's history from ancient to modern times. The building itself was an architectural treasure featuring distinctive Mamluk stonework and vaulted chambers.",
    verifiedBy: ["UNESCO", "Heritage for Peace"],
    images: {
      before: "/images/qasr-al-basha-before.jpg",
      after: "/images/qasr-al-basha-after.jpg",
    },
    sources: [
      {
        organization: "UNESCO",
        title: "Gaza Heritage Damage Assessment",
        url: "https://www.unesco.org/en/articles/damaged-cultural-sites-gaza",
        date: "2024-05-27",
        type: "official",
      },
      {
        organization: "Heritage for Peace",
        title: "Cultural Heritage in Gaza: Destroyed and Damaged Sites Report",
        date: "2023-11-15",
        type: "documentation",
      },
    ],
  },
  {
    id: "hammam-al-samra",
    name: "Hammam al-Samra",
    nameArabic: "حمام السمرة",
    type: "historic-building",
    yearBuilt: "Ottoman period (16th century)",
    yearBuiltIslamic: "10th century AH",
    coordinates: [31.5120, 34.4710], // Gaza City [lat, lng]
    status: "damaged",
    dateDestroyed: "2024-02-10",
    dateDestroyedIslamic: "1 Sha'ban 1445 AH",
    description:
      "A historic Ottoman bathhouse representing traditional Islamic bathing culture and social architecture. The hammam featured distinctive domed chambers, intricate stonework, and a sophisticated water heating system.",
    historicalSignificance:
      "One of the last remaining examples of Ottoman public bath architecture in Gaza. These bathhouses served as important social and cultural centers in Islamic cities for centuries.",
    culturalValue:
      "The hammam represents traditional Ottoman architectural techniques and social customs. Its preservation was crucial for understanding daily life and public health practices in historic Gaza.",
    verifiedBy: ["Heritage for Peace", "Forensic Architecture"],
    images: {
      before: "/images/hammam-al-samra-before.jpg",
      after: "/images/hammam-al-samra-after.jpg",
    },
    sources: [
      {
        organization: "Heritage for Peace",
        title: "Cultural Heritage in Gaza: Destroyed and Damaged Sites Report",
        date: "2024-02-15",
        type: "documentation",
      },
      {
        organization: "Forensic Architecture",
        title: "Gaza Platform: Historic Buildings",
        url: "https://forensic-architecture.org/investigation/gaza-platform",
        date: "2024-03-10",
        type: "documentation",
      },
    ],
  },
  {
    id: "sayed-al-hashim-mosque",
    name: "Sayed al-Hashim Mosque",
    nameArabic: "مسجد السيد هاشم",
    type: "mosque",
    yearBuilt: "1850 (current building), site since 12th century",
    yearBuiltIslamic: "1267 AH (current), site since 6th century AH",
    coordinates: [31.50806, 34.4633],
    status: "damaged",
    dateDestroyed: "2023-10-15", // Estimated October 2023
    dateDestroyedIslamic: "29 Rabi' al-Awwal 1445 AH", // Manually verified with Islamic calendar converter
    description:
      "One of the largest and oldest mosques in Gaza, located in the ad-Darrāj Quarter of the Old City. The mosque is named after Hashim ibn Abd al-Manaf, the great-grandfather of Prophet Muhammad, whose tomb is believed to be located under the mosque's dome.",
    historicalSignificance:
      "The site has held religious significance since at least the 12th century CE. The current building was constructed in 1850 on the orders of Ottoman Sultan Abdul Majid. According to Muslim tradition, Hashim ibn Abd al-Manaf died in Gaza during a trading voyage, making this site a place of pilgrimage.",
    culturalValue:
      "The mosque served as an important religious and cultural landmark in Gaza's Old City. Its connection to the Prophet Muhammad's family made it a significant site for Islamic heritage. The building was damaged by an Israeli airstrike in October 2023.",
    verifiedBy: ["UNESCO", "Heritage for Peace"],
    sources: [
      {
        organization: "UNESCO",
        title: "Gaza Heritage Damage Assessment",
        url: "https://www.unesco.org/en/gaza/assessment",
        date: "2024-05-27",
        type: "official",
      },
      {
        organization: "Heritage for Peace",
        title: "Cultural Heritage in Gaza: Destroyed and Damaged Sites Report",
        date: "2023-11-15",
        type: "documentation",
      },
    ],
  },
  {
    id: "ibn-uthman-mosque",
    name: "Ibn Uthman Mosque",
    nameArabic: "مسجد ابن عثمان",
    type: "mosque",
    yearBuilt: "1399-1400 (14th century)",
    yearBuiltIslamic: "802 AH",
    coordinates: [31.5203, 34.4668],
    status: "destroyed",
    dateDestroyed: "2024-07-15", // Estimated July 2024
    dateDestroyedIslamic: "9 Muharram 1446 AH", // Manually verified with Islamic calendar converter
    description:
      "The second largest archaeological mosque in the Gaza Strip, located along Suq Street in the Turukman Quarter of the Shuja'iyya district. The mosque covered 2,000 square meters with a 400 square meter main courtyard and featured two gates overlooking the Shuja'iyya market.",
    historicalSignificance:
      "Built between 1399-1400 CE during the Mamluk period, this mosque represented significant Islamic architectural heritage in Gaza. It was an important religious center in the Shuja'iyya neighborhood for over 600 years before its destruction.",
    culturalValue:
      "The Ibn Uthman Mosque was the second most important archaeological mosque in Gaza after the Great Omari Mosque. Its loss represents a significant blow to Gaza's Islamic architectural heritage and the cultural identity of the Shuja'iyya community.",
    verifiedBy: ["UNESCO", "Heritage for Peace"],
    sources: [
      {
        organization: "UNESCO",
        title: "Preliminary Damage Assessment of Cultural Sites in Gaza",
        url: "https://www.unesco.org/en/gaza/assessment",
        date: "2024-05-28",
        type: "official",
      },
      {
        organization: "Middle East Monitor",
        title: "Israel destroys second largest historical mosque in Gaza",
        url: "https://www.middleeastmonitor.com/20240704-israel-destroys-second-largest-historical-mosque-in-gaza/",
        date: "2024-07-04",
        type: "journalism",
      },
    ],
  },
  {
    id: "ibn-marwan-mosque",
    name: "Ibn Marwan Mosque",
    nameArabic: "مسجد ابن مروان",
    type: "mosque",
    yearBuilt: "1324 (Mamluk era)",
    yearBuiltIslamic: "724 AH",
    coordinates: [31.5073, 34.4703],
    status: "damaged",
    dateDestroyed: "2023-11-01", // Estimated late 2023
    dateDestroyedIslamic: "17 Rabi' al-Thani 1445 AH", // Manually verified with Islamic calendar converter
    description:
      "A Mamluk-era mosque situated in the midst of a cemetery in the Tuffah neighborhood of Gaza City. The mosque contains the tomb of Sheikh Ali ibn Marwan, a holy man from the Hasani family who came from Morocco and died in Gaza in 1314 CE.",
    historicalSignificance:
      "Completed in 1324 CE during the Mamluk period, this mosque represents 700 years of Islamic heritage in Gaza. The Hasani family's connection to Morocco illustrates historical migration patterns and cultural exchange between North Africa and Palestine.",
    culturalValue:
      "The mosque served as both a place of worship and a memorial site honoring Sheikh Ali ibn Marwan. Its location within a cemetery made it an important spiritual center for the local community. UNESCO confirmed the mosque as one of more than 100 damaged cultural properties based on satellite imagery.",
    verifiedBy: ["UNESCO", "Heritage for Peace"],
    sources: [
      {
        organization: "UNESCO",
        title: "Preliminary Damage Assessment of Cultural Sites in Gaza",
        url: "https://www.unesco.org/en/gaza/assessment",
        date: "2024-05-28",
        type: "official",
      },
      {
        organization: "Museum With No Frontiers",
        title: "Mosque of Ali Ibn Marwan Documentation",
        type: "documentation",
      },
    ],
  },
  {
    id: "byzantine-church-jabaliya",
    name: "Byzantine Church of Jabaliya",
    nameArabic: "كنيسة جباليا البيزنطية",
    type: "church",
    yearBuilt: "444 CE (5th century)",
    yearBuiltIslamic: "183 BH (Before Hijra)",
    coordinates: [31.5333, 34.5000],
    status: "destroyed",
    dateDestroyed: "2023-11-20", // Estimated November 2023
    dateDestroyedIslamic: "7 Jumada al-Ula 1445 AH", // Manually verified with Islamic calendar converter
    description:
      "A 5th-century Byzantine church and monastery built in 444 CE during the reign of Emperor Theodosius II. The site spanned 850 square meters with 400 square meters of colorful mosaic floors depicting animals, hunting scenes, and palm trees. The church walls were adorned with 16 religious texts written in ancient Greek.",
    historicalSignificance:
      "Discovered in 1997 and reopened to the public in January 2022 after extensive restoration involving international partners. The church represents early Christian presence in Gaza and contains exceptionally well-preserved Byzantine-era mosaics and Greek inscriptions from the 5th century.",
    culturalValue:
      "The church was completely destroyed by shelling in November 2023, though archaeologist Fadel Al Utol reported in January 2025 that the mosaics remained intact beneath debris. This site represented irreplaceable Byzantine artistic and religious heritage, with over 1,500 years of history.",
    verifiedBy: ["UNESCO", "Heritage for Peace"],
    sources: [
      {
        organization: "Heritage for Peace",
        title: "Impact on Cultural Heritage Sites Report - Jabaliya Church",
        date: "2023-11-28",
        type: "documentation",
      },
      {
        organization: "Times of Israel",
        title: "Restored 5th-century Byzantine church reopens in Gaza",
        url: "https://www.timesofisrael.com/restored-5th-century-byzantine-church-reopens-in-gaza/",
        date: "2022-01-28",
        type: "journalism",
      },
    ],
  },
  {
    id: "al-qarara-cultural-museum",
    name: "Al Qarara Cultural Museum",
    nameArabic: "متحف القرارة الثقافي",
    type: "museum",
    yearBuilt: "20th century",
    coordinates: [31.3705, 34.3265],
    status: "destroyed",
    dateDestroyed: "2023-10-10", // Estimated early October 2023
    dateDestroyedIslamic: "24 Rabi' al-Awwal 1445 AH", // Manually verified with Islamic calendar converter
    description:
      "A cultural museum in al-Qarara, near Khan Younis, dedicated to teaching about Gaza's heritage and preserving the cultural identity of southern Gaza. The museum served as an educational center for local communities.",
    historicalSignificance:
      "The museum documented the history and cultural traditions of the Khan Younis region, providing educational resources for understanding Gaza's heritage. It was particularly important for southern Gaza communities.",
    culturalValue:
      "The museum's destruction early in the conflict represents the loss of irreplaceable artifacts and educational resources documenting southern Gaza's cultural heritage. Its collection focused on traditional life, crafts, and historical artifacts from the region.",
    verifiedBy: ["UNESCO", "Heritage for Peace"],
    sources: [
      {
        organization: "UNESCO",
        title: "Gaza Heritage Damage Assessment",
        url: "https://www.unesco.org/en/gaza/assessment",
        date: "2024-05-27",
        type: "official",
      },
      {
        organization: "Heritage for Peace",
        title: "Cultural Heritage in Gaza: Destroyed and Damaged Sites Report",
        date: "2023-11-15",
        type: "documentation",
      },
    ],
  },
  {
    id: "rashad-shawa-cultural-center",
    name: "Rashad Shawa Cultural Center",
    nameArabic: "مركز رشاد الشوا الثقافي",
    type: "museum",
    yearBuilt: "1985",
    coordinates: [31.5203, 34.4668],
    status: "destroyed",
    dateDestroyed: "2023-11-25",
    dateDestroyedIslamic: "12 Jumada al-Ula 1445 AH", // Manually verified with Islamic calendar converter
    description:
      "A major cultural center in Gaza City built in 1985, housing a theatre and a library containing tens of thousands of books. The center served as a hub for arts, culture, and education in Gaza.",
    historicalSignificance:
      "Named after Rashad al-Shawa, a prominent Gaza mayor, the center represented Gaza's commitment to culture and education. It hosted theatrical performances, cultural events, and provided library resources for researchers and students.",
    culturalValue:
      "The destruction of the Rashad Shawa Cultural Center resulted in the loss of tens of thousands of books and irreplaceable cultural resources. The center was a vital institution for Gaza's intellectual and artistic community, and its loss significantly impacted educational and cultural life.",
    verifiedBy: ["UNESCO", "Heritage for Peace"],
    sources: [
      {
        organization: "UNESCO",
        title: "Gaza Heritage Damage Assessment",
        url: "https://www.unesco.org/en/gaza/assessment",
        date: "2024-05-27",
        type: "official",
      },
      {
        organization: "Museums Association",
        title: "Widescale destruction of cultural heritage in Gaza",
        url: "https://www.museumsassociation.org/museums-journal/news/2024/01/widescale-destruction-of-cultural-heritage-in-gaza/",
        date: "2024-01-15",
        type: "documentation",
      },
    ],
  },
  {
    id: "anthedon-harbour",
    name: "Anthedon Harbour",
    nameArabic: "ميناء أنثيدون الأثري",
    type: "archaeological",
    yearBuilt: "800 BCE - Byzantine period",
    yearBuiltIslamic: "1422 BH - 11 AH",
    coordinates: [31.567, 34.475],
    status: "destroyed",
    dateDestroyed: "2023-12-01", // Estimated late 2023
    dateDestroyedIslamic: "18 Jumada al-Ula 1445 AH", // Manually verified with Islamic calendar converter
    description:
      "An ancient seaport located at Tell Iblakhiye, 2 kilometers north of Gaza's main port near the Beach Refugee Camp. The archaeological site was inhabited from the Mycenaean to Byzantine period, with its heyday during the Hellenistic period when it became an independent city.",
    historicalSignificance:
      "Listed as a UNESCO Tentative World Heritage Site in April 2012, Anthedon represents a clear example of ancient Mediterranean seaports. The site contains a Roman temple, villas, parts of city walls, and port structures, documenting the ancient trade route linking Europe with the Levant during Phoenician, Roman, and Hellenistic periods.",
    culturalValue:
      "Anthedon provided crucial archaeological evidence of Gaza's role as a major Mediterranean port city for over 1,500 years. The complete destruction of this UNESCO-recognized site represents an irreplaceable loss to understanding ancient maritime trade and cultural exchange in the Eastern Mediterranean.",
    verifiedBy: ["UNESCO", "Heritage for Peace", "Forensic Architecture"],
    sources: [
      {
        organization: "UNESCO",
        title: "Anthedon Harbour - Tentative World Heritage Site",
        url: "https://whc.unesco.org/en/tentativelists/5719/",
        date: "2012-04-02",
        type: "official",
      },
      {
        organization: "Heritage for Peace",
        title: "Cultural Heritage in Gaza: Destroyed and Damaged Sites Report",
        date: "2023-12-15",
        type: "documentation",
      },
    ],
  },
  {
    id: "tell-el-ajjul",
    name: "Tell el-Ajjul",
    nameArabic: "تل العجول",
    type: "archaeological",
    yearBuilt: "2000-1800 BCE",
    yearBuiltIslamic: "3622 BH - 3422 BH",
    coordinates: [31.4677, 34.4043],
    status: "damaged",
    dateDestroyed: "2023-11-01", // Estimated late 2023
    dateDestroyedIslamic: "17 Rabi' al-Thani 1445 AH", // Manually verified with Islamic calendar converter
    description:
      "A major Bronze Age settlement located at the mouth of Wadi Ghazzah, 1.8 kilometers inland from the Mediterranean coast, south of Gaza City. The site was inhabited during 2000-1800 BCE and sits on the main land route between ancient Egypt and the Levant.",
    historicalSignificance:
      "Excavated in 1930-1934 by British archaeologist Sir Flinders Petrie, Tell el-Ajjul yielded three hoards of Bronze Age gold jewellery considered among the greatest Bronze Age finds in the Levant. The site is one of the proposed locations for the ancient city of Sharuhen mentioned in historical texts.",
    culturalValue:
      "Tell el-Ajjul provided irreplaceable evidence of Bronze Age trade, craftsmanship, and settlement patterns. The site's strategic location between Egypt and the Levant made it crucial for understanding ancient Near Eastern commerce and cultural exchange. Its damage represents a significant loss to Bronze Age archaeology.",
    verifiedBy: ["UNESCO", "Heritage for Peace"],
    sources: [
      {
        organization: "UNESCO",
        title: "Preliminary Damage Assessment of Archaeological Sites in Gaza",
        url: "https://www.unesco.org/en/gaza/assessment",
        date: "2024-05-27",
        type: "official",
      },
      {
        organization: "Britannica",
        title: "Tall al-ʿAjjul Archaeological Site",
        url: "https://www.britannica.com/place/Tall-al-Ajjul",
        type: "academic",
      },
    ],
  },
  {
    id: "tell-es-sakan",
    name: "Tell es-Sakan",
    nameArabic: "تل السكن",
    type: "archaeological",
    yearBuilt: "3300-2300 BCE",
    yearBuiltIslamic: "4922 BH - 3922 BH",
    coordinates: [31.4758, 34.4046],
    status: "damaged",
    dateDestroyed: "2023-12-01", // Estimated late 2023
    dateDestroyedIslamic: "18 Jumada al-Ula 1445 AH", // Manually verified with Islamic calendar converter
    description:
      "The oldest and largest Egyptian colony in the Southern Levant, located in the al-Zahra neighborhood 5 kilometers south of Gaza City. The site covers 12-20 acres and rises more than 10 meters above the coastal plain, containing exceptionally well-preserved Early Bronze Age mud-brick architecture.",
    historicalSignificance:
      "Tell es-Sakan was inhabited from 3300-3000 BCE as an Egyptian colony, then abandoned and reoccupied as a Canaanite city from 2600-2250 BCE. Discovered by chance in 1998 during housing construction, the site had remained undetected under sand dunes despite previous surveys. It represents the earliest phase of Egyptian expansion into the Levant.",
    culturalValue:
      "As the largest archaeological site in the Gaza Strip, Tell es-Sakan provided unique evidence of Early Bronze Age Egyptian colonial architecture and the transition from Egyptian to Canaanite occupation. The site's exceptional preservation made it invaluable for understanding early urbanism and Egyptian-Levantine relations over 5,000 years ago.",
    verifiedBy: ["UNESCO", "Heritage for Peace"],
    sources: [
      {
        organization: "UNESCO",
        title: "Preliminary Damage Assessment of Archaeological Sites in Gaza",
        url: "https://www.unesco.org/en/gaza/assessment",
        date: "2024-05-27",
        type: "official",
      },
      {
        organization: "Honor Frost Foundation",
        title: "Maritime Archaeological Survey at Tell es-Sakan",
        url: "https://honorfrostfoundation.org/2022/05/12/maritime-archaeological-survey-and-assessment-at-tell-ruqeish-and-tell-es-sakan-gaza-strip-ongoing/",
        date: "2022-05-12",
        type: "academic",
      },
    ],
  },
  {
    id: "central-archives-gaza",
    name: "Central Archives of Gaza City",
    nameArabic: "الأرشيف المركزي لمدينة غزة",
    type: "historic-building",
    yearBuilt: "20th century",
    coordinates: [31.5203, 34.4668],
    status: "destroyed",
    dateDestroyed: "2023-11-29",
    dateDestroyedIslamic: "16 Jumada al-Ula 1445 AH", // Manually verified with Islamic calendar converter
    description:
      "The Central Archives housed within the administrative buildings of Gaza City Municipality in Palestine Square. The archives contained materials documenting Palestinian lives going back 150 years, urban development plans, documents relating to ancient buildings of historical value, and handwritten materials from well-known national figures.",
    historicalSignificance:
      "The Central Archives represented 150 years of Palestinian documentary heritage and institutional memory. The collection included irreplaceable administrative records, historical documents, and urban planning materials crucial for understanding Gaza's modern development.",
    culturalValue:
      "The destruction of the Central Archives by fire in late November 2023 represents the erasure of a large part of Palestinian memory and historical documentation. A UN investigation concluded that 'the interior of the building was likely set ablaze' by Israeli forces. The loss of these documents makes it significantly more difficult to reconstruct property ownership, urban history, and administrative continuity.",
    verifiedBy: ["ICOM UK", "International Council on Archives"],
    sources: [
      {
        organization: "International Council on Archives",
        title: "Statement on the Destruction of the Central Archives of the Municipality of Gaza",
        url: "https://www.ica.org/statement-of-the-international-council-on-archives-on-the-destruction-of-the-central-archives-of-the-municipality-of-gaza/",
        date: "2023-12-05",
        type: "official",
      },
      {
        organization: "ICOM UK",
        title: "Central Archives of Gaza City Destroyed",
        url: "https://uk.icom.museum/central-archives-of-gaza-city-destroyed/",
        date: "2023-11-30",
        type: "official",
      },
    ],
  },
  {
    id: "saint-hilarion-monastery",
    name: "Saint Hilarion Monastery",
    nameArabic: "دير القديس هيلاريون",
    type: "church",
    yearBuilt: "340 CE (4th century)",
    yearBuiltIslamic: "282 BH (Before Hijra)",
    coordinates: [31.4473, 34.3664], // Tell Umm el-'Amr, Nuseirat
    status: "damaged",
    dateDestroyed: "2023-12-14",
    dateDestroyedIslamic: "1 Jumada al-Akhirah 1445 AH",
    description:
      "One of the oldest and largest monasteries in the Middle East, founded around 340 CE by Saint Hilarion, a native of Gaza and key figure in Palestinian monasticism. The archaeological site at Tell Umm el-'Amr spans a large area with intricate Byzantine-era mosaics and church ruins.",
    historicalSignificance:
      "Founded by Saint Hilarion, considered one of the fathers of Palestinian monasticism. The monastery was a major center of early Christian monastic life and represents 1,700 years of continuous religious heritage. The site contains exceptional Byzantine architecture and mosaics documenting early Christian presence in Gaza.",
    culturalValue:
      "UNESCO granted enhanced protection (highest level of immunity) in December 2023, followed by World Heritage in Danger status in July 2024. The monastery's surrounding areas sustained damage including roads and infrastructure, threatening this irreplaceable archaeological treasure. The site features extensive Byzantine mosaics and architectural remains.",
    verifiedBy: ["UNESCO", "British Council", "Aliph Foundation"],
    images: {
      before: "/images/saint-hilarion-before.jpg",
    },
    sources: [
      {
        organization: "UNESCO",
        title: "Gaza: UNESCO grants enhanced provisional protection to Saint Hilarion Monastery",
        url: "https://www.unesco.org/en/articles/gaza-unesco-grants-enhanced-provisional-protection-saint-hilarion-monastery",
        date: "2023-12-18",
        type: "official",
      },
      {
        organization: "Hyperallergic",
        title: "1,700-Year-Old Gaza Monastery Designated World Heritage in Danger",
        url: "https://hyperallergic.com/942804/1700-year-old-saint-hilarion-gaza-monastery-designated-world-heritage-in-danger/",
        date: "2024-07-26",
        type: "journalism",
      },
    ],
  },
  {
    id: "ard-al-moharbeen-cemetery",
    name: "Ard-al-Moharbeen Roman Cemetery",
    nameArabic: "مقبرة أرض المحاربين الرومانية",
    type: "archaeological",
    yearBuilt: "1st century BCE - 2nd century CE",
    yearBuiltIslamic: "722 BH - 478 BH",
    coordinates: [31.533, 34.500], // Jabaliya (approximate)
    status: "destroyed",
    dateDestroyed: "2023-10-08",
    dateDestroyedIslamic: "23 Rabi' al-Awwal 1445 AH",
    description:
      "The largest Roman cemetery discovered in Gaza, with 125+ tombs excavated from an area of 4,000 square meters. The necropolis was discovered in February 2022 during construction work and featured remarkable artifacts including two rare lead sarcophagi - one engraved with grape harvest motifs, the other with dolphins swimming in water.",
    historicalSignificance:
      "This cemetery was in use from the 1st century BCE to the 2nd century CE and represents Gaza's importance as a Roman-era city. The discovery in 2022 was considered one of the most significant archaeological finds in recent Palestinian history, providing crucial evidence of Roman burial practices and artistic traditions in the region.",
    culturalValue:
      "The site was almost completely destroyed just one day after the conflict began on October 8, 2023, when researchers found rocket damage. UNESCO confirmed the destruction in January 2024. A 2025 report documented severe damage from bombs and bulldozers. The loss of this recently discovered site, with its rare lead sarcophagi and extensive tomb collection, represents an irreplaceable loss to Roman-era archaeology.",
    verifiedBy: ["UNESCO", "Ministry of Tourism and Antiquities", "Centre for Cultural Heritage Preservation"],
    images: {
      before: "/images/ard-al-moharbeen-before.jpg",
      satellite: "/images/ard-al-moharbeen-satellite.jpg",
    },
    sources: [
      {
        organization: "UNESCO",
        title: "Preliminary Damage Assessment - Ard-al-Moharbeen Necropolis",
        url: "https://www.unesco.org/en/gaza/assessment",
        date: "2024-01-15",
        type: "official",
      },
      {
        organization: "Al Jazeera",
        title: "Four tombs unearthed at Roman-era cemetery in Gaza",
        url: "https://www.aljazeera.com/news/2023/9/25/four-tombs-unearthed-at-roman-era-cemetery-in-gaza",
        date: "2023-09-25",
        type: "journalism",
      },
    ],
  },
  {
    id: "israa-university-museum",
    name: "Al-Israa University Museum",
    nameArabic: "متحف جامعة الإسراء",
    type: "museum",
    yearBuilt: "2014",
    coordinates: [31.480, 34.450], // South of Gaza City (approximate)
    status: "destroyed",
    dateDestroyed: "2024-01-17",
    dateDestroyedIslamic: "6 Rajab 1445 AH",
    description:
      "A national museum housed within Al-Israa University, containing more than 3,000 rare archaeological artifacts spanning Gaza's history. The university was the last remaining higher education institution in Gaza when it was destroyed. Before demolition, occupying forces looted the museum's entire collection of artifacts.",
    historicalSignificance:
      "Al-Israa University was established in 2014 and became a center for higher education in southern Gaza. Its museum represented an important repository of Palestinian cultural heritage, documenting Gaza's archaeological and historical legacy. The university's destruction marked the complete elimination of all universities in Gaza.",
    culturalValue:
      "The museum's 3,000+ artifacts were looted by Israeli forces before the university building was demolished by explosives on January 17, 2024, after 70 days of occupation. University vice president Ahmed Alhussaina stated that such widespread destruction represents a deliberate act aimed at erasing Palestinian cultural memory and archaeological heritage. The loss includes irreplaceable historical artifacts and educational resources.",
    verifiedBy: ["PEN America", "Al-Israa University"],
    images: {
      before: "/images/israa-university-before.jpg",
      after: "/images/israa-university-after.jpg",
    },
    sources: [
      {
        organization: "PEN America",
        title: "Gaza Cultural Heritage Destruction Report",
        url: "https://www.finestresullarte.info/en/news/gaza-the-silent-massacre-a-report-lists-destroyed-cultural-heritage",
        date: "2024-02-01",
        type: "documentation",
      },
      {
        organization: "WAFA News Agency",
        title: "Occupation forces destroy key facilities of Al-Israa University in Gaza",
        url: "https://english.wafa.ps/Pages/Details/140840",
        date: "2024-01-17",
        type: "journalism",
      },
    ],
  },
];
