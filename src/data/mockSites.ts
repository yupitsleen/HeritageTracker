import type { Site } from "../types";

/**
 * Mock data: 3 sample Gaza heritage sites for development
 * Using real sites from our research for realistic testing
 */
export const mockSites: Site[] = [
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
    sourceAssessmentDate: "2024-05-27", // Based on UNESCO assessment date
    lastUpdated: "2025-09-30",
    description:
      "Gaza's oldest and largest mosque, originally a Byzantine church converted in the 7th century. The mosque housed rare Islamic manuscripts and served as a center of learning for centuries.",
    historicalSignificance:
      "One of the oldest mosques in Palestine, with a history spanning over 1,400 years. It represents continuous religious and cultural heritage from Byzantine, Islamic, Crusader, Mamluk, and Ottoman periods.",
    culturalValue:
      "Contained 62 rare manuscripts including handwritten Qurans and Islamic scholarly texts. The building itself was an architectural masterpiece blending multiple historical periods.",
    verifiedBy: ["UNESCO", "Heritage for Peace", "Forensic Architecture"],
    images: {
      before: {
        url: "/images/sites/great-omari-mosque-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/great-omari-mosque-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
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
    sourceAssessmentDate: "2024-05-27", // Based on UNESCO assessment date
    lastUpdated: "2025-09-30",
    description:
      "One of the oldest churches in the world, built in 425 CE and named after Saint Porphyrius, Bishop of Gaza. The church served Gaza's small Christian community and was a rare example of early Byzantine architecture.",
    historicalSignificance:
      "Third-oldest church in the world still in use before the conflict. Contains the tomb of Saint Porphyrius and represents 1,600 years of continuous Christian presence in Gaza.",
    culturalValue:
      "Irreplaceable Byzantine-era mosaics, ancient religious artifacts, and architectural elements. Served as a sanctuary and community center for Gaza's Christian minority.",
    verifiedBy: ["UNESCO", "Heritage for Peace"],
    // Images need to be sourced with proper attribution
    images: {
      before: {
        url: "/images/sites/church-st-porphyrius-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/church-st-porphyrius-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
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
    sourceAssessmentDate: "2024-05-27", // Based on UNESCO assessment date
    lastUpdated: "2025-09-30",
    description:
      "Ancient seaport and settlement site with continuous occupation from the Iron Age through the Islamic period. Contained over 4,000 archaeological objects including pottery, coins, and architectural remains.",
    historicalSignificance:
      "One of the most important archaeological sites in Gaza, documenting nearly 2,000 years of Mediterranean trade and cultural exchange. Provided crucial evidence of Philistine, Greek, Roman, Byzantine, and Islamic civilizations.",
    culturalValue:
      "Irreplaceable archaeological artifacts spanning multiple civilizations. The site was crucial for understanding ancient Gaza's role as a major port city and cultural crossroads.",
    verifiedBy: ["UNESCO", "Forensic Architecture", "Heritage for Peace"],
    // Images need to be sourced with proper attribution
    images: {
      before: {
        url: "/images/sites/blakhiyya-archaeological-site-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/blakhiyya-archaeological-site-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
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
    coordinates: [31.505, 34.462], // Gaza City [lat, lng]
    status: "heavily-damaged",
    dateDestroyed: "2023-11-15",
    dateDestroyedIslamic: "1 Jumada al-Ula 1445 AH",
    sourceAssessmentDate: "2024-05-27", // Based on UNESCO assessment date
    lastUpdated: "2025-09-30",
    description:
      "A 13th-century Mamluk palace that served as the residence of Napoleon Bonaparte during his 1799 Gaza campaign. Later converted into a museum showcasing Gaza's history with collections of pottery, coins, and historical artifacts.",
    historicalSignificance:
      "The palace represents Mamluk architectural heritage and served as an important administrative center throughout various historical periods. Its connection to Napoleon's campaign made it a landmark of international historical significance.",
    culturalValue:
      "Housed museum collections documenting Gaza's history from ancient to modern times. The building itself was an architectural treasure featuring distinctive Mamluk stonework and vaulted chambers.",
    verifiedBy: ["UNESCO", "Heritage for Peace"],
    // Images need to be sourced with proper attribution
    images: {
      before: {
        url: "/images/sites/qasr-al-basha-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/qasr-al-basha-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
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
    coordinates: [31.512, 34.471], // Gaza City [lat, lng]
    status: "damaged",
    dateDestroyed: "2024-02-10",
    dateDestroyedIslamic: "1 Sha'ban 1445 AH",
    sourceAssessmentDate: "2024-05-27", // Based on UNESCO assessment date
    lastUpdated: "2025-09-30",
    description:
      "A historic Ottoman bathhouse representing traditional Islamic bathing culture and social architecture. The hammam featured distinctive domed chambers, intricate stonework, and a sophisticated water heating system.",
    historicalSignificance:
      "One of the last remaining examples of Ottoman public bath architecture in Gaza. These bathhouses served as important social and cultural centers in Islamic cities for centuries.",
    culturalValue:
      "The hammam represents traditional Ottoman architectural techniques and social customs. Its preservation was crucial for understanding daily life and public health practices in historic Gaza.",
    verifiedBy: ["Heritage for Peace", "Forensic Architecture"],
    // Images need to be sourced with proper attribution
    images: {
      before: {
        url: "/images/sites/hammam-al-samra-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/hammam-al-samra-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
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
    sourceAssessmentDate: "2024-05-27", // Based on UNESCO assessment date
    lastUpdated: "2025-09-30",
    description:
      "One of the largest and oldest mosques in Gaza, located in the ad-Darrāj Quarter of the Old City. The mosque is named after Hashim ibn Abd al-Manaf, the great-grandfather of Prophet Muhammad, whose tomb is believed to be located under the mosque's dome.",
    historicalSignificance:
      "The site has held religious significance since at least the 12th century CE. The current building was constructed in 1850 on the orders of Ottoman Sultan Abdul Majid. According to Muslim tradition, Hashim ibn Abd al-Manaf died in Gaza during a trading voyage, making this site a place of pilgrimage.",
    culturalValue:
      "The mosque served as an important religious and cultural landmark in Gaza's Old City. Its connection to the Prophet Muhammad's family made it a significant site for Islamic heritage. The building was damaged by an Israeli airstrike in October 2023.",
    verifiedBy: ["UNESCO", "Heritage for Peace"],
    images: {
      before: {
        url: "/images/sites/sayed-al-hashim-mosque-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/sayed-al-hashim-mosque-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
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
    dateDestroyed: "2024-07-15",
    dateDestroyedIslamic: "9 Muharram 1446 AH",
    sourceAssessmentDate: "2024-07-04",
    lastUpdated: "2025-11-15",
    description:
      "The second largest archaeological mosque in the Gaza Strip, located along Suq Street in the Turukman Quarter of the Shuja'iyya district. The mosque covered 2,000 square meters with a 400 square meter main courtyard and featured two gates overlooking the Shuja'iyya market.",
    historicalSignificance:
      "Built between 1399-1400 CE during the Mamluk period, this mosque represented significant Islamic architectural heritage in Gaza. It was an important religious center in the Shuja'iyya neighborhood for over 600 years before its destruction.",
    culturalValue:
      "The Ibn Uthman Mosque was the second most important archaeological mosque in Gaza after the Great Omari Mosque. Its loss represents a significant blow to Gaza's Islamic architectural heritage and the cultural identity of the Shuja'iyya community.",
    verifiedBy: ["UNESCO", "Heritage for Peace"],
    images: {
      before: {
        url: "/images/sites/ibn-uthman-mosque-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/ibn-uthman-mosque-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
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
    sourceAssessmentDate: "2024-05-27", // Based on UNESCO assessment date
    lastUpdated: "2025-09-30",
    description:
      "A Mamluk-era mosque situated in the midst of a cemetery in the Tuffah neighborhood of Gaza City. The mosque contains the tomb of Sheikh Ali ibn Marwan, a holy man from the Hasani family who came from Morocco and died in Gaza in 1314 CE.",
    historicalSignificance:
      "Completed in 1324 CE during the Mamluk period, this mosque represents 700 years of Islamic heritage in Gaza. The Hasani family's connection to Morocco illustrates historical migration patterns and cultural exchange between North Africa and Palestine.",
    culturalValue:
      "The mosque served as both a place of worship and a memorial site honoring Sheikh Ali ibn Marwan. Its location within a cemetery made it an important spiritual center for the local community. UNESCO confirmed the mosque as one of more than 100 damaged cultural properties based on satellite imagery.",
    verifiedBy: ["UNESCO", "Heritage for Peace"],
    images: {
      before: {
        url: "/images/sites/ibn-marwan-mosque-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/ibn-marwan-mosque-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
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
    coordinates: [31.5333, 34.5],
    status: "destroyed",
    dateDestroyed: "2023-11-20", // Estimated November 2023
    dateDestroyedIslamic: "7 Jumada al-Ula 1445 AH", // Manually verified with Islamic calendar converter
    sourceAssessmentDate: "2024-05-27", // Based on UNESCO assessment date
    lastUpdated: "2025-09-30",
    description:
      "A 5th-century Byzantine church and monastery built in 444 CE during the reign of Emperor Theodosius II. The site spanned 850 square meters with 400 square meters of colorful mosaic floors depicting animals, hunting scenes, and palm trees. The church walls were adorned with 16 religious texts written in ancient Greek.",
    historicalSignificance:
      "Discovered in 1997 and reopened to the public in January 2022 after extensive restoration involving international partners. The church represents early Christian presence in Gaza and contains exceptionally well-preserved Byzantine-era mosaics and Greek inscriptions from the 5th century.",
    culturalValue:
      "The church was completely destroyed by shelling in November 2023, though archaeologist Fadel Al Utol reported in January 2025 that the mosaics remained intact beneath debris. This site represented irreplaceable Byzantine artistic and religious heritage, with over 1,500 years of history.",
    verifiedBy: ["UNESCO", "Heritage for Peace"],
    images: {
      before: {
        url: "/images/sites/byzantine-church-jabaliya-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/byzantine-church-jabaliya-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
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
    sourceAssessmentDate: "2024-05-27", // Based on UNESCO assessment date
    lastUpdated: "2025-09-30",
    description:
      "A cultural museum in al-Qarara, near Khan Younis, dedicated to teaching about Gaza's heritage and preserving the cultural identity of southern Gaza. The museum served as an educational center for local communities.",
    historicalSignificance:
      "The museum documented the history and cultural traditions of the Khan Younis region, providing educational resources for understanding Gaza's heritage. It was particularly important for southern Gaza communities.",
    culturalValue:
      "The museum's destruction early in the conflict represents the loss of irreplaceable artifacts and educational resources documenting southern Gaza's cultural heritage. Its collection focused on traditional life, crafts, and historical artifacts from the region.",
    verifiedBy: ["UNESCO", "Heritage for Peace"],
    images: {
      before: {
        url: "/images/sites/al-qarara-cultural-museum-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/al-qarara-cultural-museum-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
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
    sourceAssessmentDate: "2024-05-27", // Based on UNESCO assessment date
    lastUpdated: "2025-09-30",
    description:
      "A major cultural center in Gaza City built in 1985, housing a theatre and a library containing tens of thousands of books. The center served as a hub for arts, culture, and education in Gaza.",
    historicalSignificance:
      "Named after Rashad al-Shawa, a prominent Gaza mayor, the center represented Gaza's commitment to culture and education. It hosted theatrical performances, cultural events, and provided library resources for researchers and students.",
    culturalValue:
      "The destruction of the Rashad Shawa Cultural Center resulted in the loss of tens of thousands of books and irreplaceable cultural resources. The center was a vital institution for Gaza's intellectual and artistic community, and its loss significantly impacted educational and cultural life.",
    verifiedBy: ["UNESCO", "Heritage for Peace"],
    images: {
      before: {
        url: "/images/sites/rashad-shawa-cultural-center-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/rashad-shawa-cultural-center-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
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
    sourceAssessmentDate: "2024-05-27", // Based on UNESCO assessment date
    lastUpdated: "2025-09-30",
    description:
      "An ancient seaport located at Tell Iblakhiye, 2 kilometers north of Gaza's main port near the Beach Refugee Camp. The archaeological site was inhabited from the Mycenaean to Byzantine period, with its heyday during the Hellenistic period when it became an independent city.",
    historicalSignificance:
      "Listed as a UNESCO Tentative World Heritage Site in April 2012, Anthedon represents a clear example of ancient Mediterranean seaports. The site contains a Roman temple, villas, parts of city walls, and port structures, documenting the ancient trade route linking Europe with the Levant during Phoenician, Roman, and Hellenistic periods.",
    culturalValue:
      "Anthedon provided crucial archaeological evidence of Gaza's role as a major Mediterranean port city for over 1,500 years. The complete destruction of this UNESCO-recognized site represents an irreplaceable loss to understanding ancient maritime trade and cultural exchange in the Eastern Mediterranean.",
    verifiedBy: ["UNESCO", "Heritage for Peace", "Forensic Architecture"],
    images: {
      before: {
        url: "/images/sites/anthedon-harbour-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/anthedon-harbour-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
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
    sourceAssessmentDate: "2024-05-27", // Based on UNESCO assessment date
    lastUpdated: "2025-09-30",
    description:
      "A major Bronze Age settlement located at the mouth of Wadi Ghazzah, 1.8 kilometers inland from the Mediterranean coast, south of Gaza City. The site was inhabited during 2000-1800 BCE and sits on the main land route between ancient Egypt and the Levant.",
    historicalSignificance:
      "Excavated in 1930-1934 by British archaeologist Sir Flinders Petrie, Tell el-Ajjul yielded three hoards of Bronze Age gold jewellery considered among the greatest Bronze Age finds in the Levant. The site is one of the proposed locations for the ancient city of Sharuhen mentioned in historical texts.",
    culturalValue:
      "Tell el-Ajjul provided irreplaceable evidence of Bronze Age trade, craftsmanship, and settlement patterns. The site's strategic location between Egypt and the Levant made it crucial for understanding ancient Near Eastern commerce and cultural exchange. Its damage represents a significant loss to Bronze Age archaeology.",
    verifiedBy: ["UNESCO", "Heritage for Peace"],
    images: {
      before: {
        url: "/images/sites/tell-el-ajjul-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/tell-el-ajjul-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
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
    sourceAssessmentDate: "2024-05-27", // Based on UNESCO assessment date
    lastUpdated: "2025-09-30",
    description:
      "The oldest and largest Egyptian colony in the Southern Levant, located in the al-Zahra neighborhood 5 kilometers south of Gaza City. The site covers 12-20 acres and rises more than 10 meters above the coastal plain, containing exceptionally well-preserved Early Bronze Age mud-brick architecture.",
    historicalSignificance:
      "Tell es-Sakan was inhabited from 3300-3000 BCE as an Egyptian colony, then abandoned and reoccupied as a Canaanite city from 2600-2250 BCE. Discovered by chance in 1998 during housing construction, the site had remained undetected under sand dunes despite previous surveys. It represents the earliest phase of Egyptian expansion into the Levant.",
    culturalValue:
      "As the largest archaeological site in the Gaza Strip, Tell es-Sakan provided unique evidence of Early Bronze Age Egyptian colonial architecture and the transition from Egyptian to Canaanite occupation. The site's exceptional preservation made it invaluable for understanding early urbanism and Egyptian-Levantine relations over 5,000 years ago.",
    verifiedBy: ["UNESCO", "Heritage for Peace"],
    images: {
      before: {
        url: "/images/sites/tell-es-sakan-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/tell-es-sakan-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
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
    sourceAssessmentDate: "2024-05-27", // Based on UNESCO assessment date
    lastUpdated: "2025-09-30",
    description:
      "The Central Archives housed within the administrative buildings of Gaza City Municipality in Palestine Square. The archives contained materials documenting Palestinian lives going back 150 years, urban development plans, documents relating to ancient buildings of historical value, and handwritten materials from well-known national figures.",
    historicalSignificance:
      "The Central Archives represented 150 years of Palestinian documentary heritage and institutional memory. The collection included irreplaceable administrative records, historical documents, and urban planning materials crucial for understanding Gaza's modern development.",
    culturalValue:
      "The destruction of the Central Archives by fire in late November 2023 represents the erasure of a large part of Palestinian memory and historical documentation. A UN investigation concluded that 'the interior of the building was likely set ablaze' by Israeli forces. The loss of these documents makes it significantly more difficult to reconstruct property ownership, urban history, and administrative continuity.",
    verifiedBy: ["ICOM UK", "International Council on Archives"],
    images: {
      before: {
        url: "/images/sites/central-archives-gaza-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/central-archives-gaza-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
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
    sourceAssessmentDate: "2024-05-27", // Based on UNESCO assessment date
    lastUpdated: "2025-09-30",
    description:
      "One of the oldest and largest monasteries in the Middle East, founded around 340 CE by Saint Hilarion, a native of Gaza and key figure in Palestinian monasticism. The archaeological site at Tell Umm el-'Amr spans a large area with intricate Byzantine-era mosaics and church ruins.",
    historicalSignificance:
      "Founded by Saint Hilarion, considered one of the fathers of Palestinian monasticism. The monastery was a major center of early Christian monastic life and represents 1,700 years of continuous religious heritage. The site contains exceptional Byzantine architecture and mosaics documenting early Christian presence in Gaza.",
    culturalValue:
      "UNESCO granted enhanced protection (highest level of immunity) in December 2023, followed by World Heritage in Danger status in July 2024. The monastery's surrounding areas sustained damage including roads and infrastructure, threatening this irreplaceable archaeological treasure. The site features extensive Byzantine mosaics and architectural remains.",
    verifiedBy: ["UNESCO", "British Council", "Aliph Foundation"],
    images: {
      before: {
        url: "/images/sites/saint-hilarion-monastery-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/saint-hilarion-monastery-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
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
    coordinates: [31.533, 34.5], // Jabaliya (approximate)
    status: "destroyed",
    dateDestroyed: "2023-10-08",
    dateDestroyedIslamic: "23 Rabi' al-Awwal 1445 AH",
    sourceAssessmentDate: "2024-05-27", // Based on UNESCO assessment date
    lastUpdated: "2025-09-30",
    description:
      "The largest Roman cemetery discovered in Gaza, with 125+ tombs excavated from an area of 4,000 square meters. The necropolis was discovered in February 2022 during construction work and featured remarkable artifacts including two rare lead sarcophagi - one engraved with grape harvest motifs, the other with dolphins swimming in water.",
    historicalSignificance:
      "This cemetery was in use from the 1st century BCE to the 2nd century CE and represents Gaza's importance as a Roman-era city. The discovery in 2022 was considered one of the most significant archaeological finds in recent Palestinian history, providing crucial evidence of Roman burial practices and artistic traditions in the region.",
    culturalValue:
      "The site was almost completely destroyed just one day after the conflict began on October 8, 2023, when researchers found rocket damage. UNESCO confirmed the destruction in January 2024. A 2025 report documented severe damage from bombs and bulldozers. The loss of this recently discovered site, with its rare lead sarcophagi and extensive tomb collection, represents an irreplaceable loss to Roman-era archaeology.",
    verifiedBy: [
      "UNESCO",
      "Ministry of Tourism and Antiquities",
      "Centre for Cultural Heritage Preservation",
    ],
    // Images need to be sourced with proper attribution
    images: {
      before: {
        url: "/images/sites/ard-al-moharbeen-cemetery-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/ard-al-moharbeen-cemetery-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
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
    coordinates: [31.48, 34.45], // South of Gaza City (approximate)
    status: "destroyed",
    dateDestroyed: "2024-01-17",
    dateDestroyedIslamic: "6 Rajab 1445 AH",
    sourceAssessmentDate: "2024-05-27", // Based on UNESCO assessment date
    lastUpdated: "2025-09-30",
    description:
      "A national museum housed within Al-Israa University, containing more than 3,000 rare archaeological artifacts spanning Gaza's history. The university was the last remaining higher education institution in Gaza when it was destroyed. Before demolition, occupying forces looted the museum's entire collection of artifacts.",
    historicalSignificance:
      "Al-Israa University was established in 2014 and became a center for higher education in southern Gaza. Its museum represented an important repository of Palestinian cultural heritage, documenting Gaza's archaeological and historical legacy. The university's destruction marked the complete elimination of all universities in Gaza.",
    culturalValue:
      "The museum's 3,000+ artifacts were looted by Israeli forces before the university building was demolished by explosives on January 17, 2024, after 70 days of occupation. University vice president Ahmed Alhussaina stated that such widespread destruction represents a deliberate act aimed at erasing Palestinian cultural memory and archaeological heritage. The loss includes irreplaceable historical artifacts and educational resources.",
    verifiedBy: ["PEN America", "Al-Israa University"],
    images: {
      before: {
        url: "/images/sites/israa-university-museum-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/israa-university-museum-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
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
  {
    id: "rafah-museum",
    name: "Rafah Museum",
    nameArabic: "متحف رفح",
    type: "museum",
    yearBuilt: "1990s",
    coordinates: [31.2889, 34.2463], // Rafah
    status: "destroyed",
    dateDestroyed: "2023-10-11",
    dateDestroyedIslamic: "25 Rabi' al-Awwal 1445 AH",
    sourceAssessmentDate: "2024-05-27", // Based on UNESCO assessment date
    lastUpdated: "2025-09-30",
    description:
      "A museum in Rafah housing a 30-year collection of ancient coins, copper plates, jewelry, and archaeological artifacts from southern Gaza. The museum served as an important cultural institution documenting the heritage of the Rafah region.",
    historicalSignificance:
      "The Rafah Museum preserved archaeological evidence of southern Gaza's history, with collections spanning thousands of years. It was particularly important for communities in the southernmost part of the Gaza Strip.",
    culturalValue:
      "The museum was destroyed on October 11, 2023, just days after the conflict began. The loss of its 30-year collection, including rare coins, ancient jewelry, and copper artifacts, represents an irreplaceable loss to understanding Rafah's archaeological heritage.",
    verifiedBy: ["UNESCO", "Heritage for Peace"],
    images: {
      before: {
        url: "/images/sites/rafah-museum-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/rafah-museum-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
    sources: [
      {
        organization: "Al Jazeera",
        title: "A cultural genocide: Gaza's heritage sites destroyed",
        url: "https://www.aljazeera.com/news/2024/1/14/a-cultural-genocide-which-of-gazas-heritage-sites-have-been-destroyed",
        date: "2024-01-14",
        type: "journalism",
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
    id: "omari-mosque-jabaliya",
    name: "Omari Mosque of Jabaliya",
    nameArabic: "جامع العمري جباليا",
    type: "mosque",
    yearBuilt: "7th century",
    yearBuiltIslamic: "1st century AH",
    coordinates: [31.5316, 34.4833], // Jabaliya
    status: "destroyed",
    dateDestroyed: "2023-10-31",
    dateDestroyedIslamic: "16 Rabi' al-Thani 1445 AH",
    sourceAssessmentDate: "2024-05-27", // Based on UNESCO assessment date
    lastUpdated: "2025-09-30",
    description:
      "An ancient mosque in Jabaliya with 7th-century origins, representing one of the oldest Islamic religious structures in northern Gaza. The mosque served as a central place of worship for the Jabaliya community.",
    historicalSignificance:
      "With foundations dating to the early Islamic period, the Omari Mosque of Jabaliya represented over 1,400 years of continuous Islamic worship and community gathering in northern Gaza.",
    culturalValue:
      "The mosque was completely obliterated in late October 2023, as documented by Heritage for Peace. Its destruction represents the loss of a major religious and cultural landmark for the Jabaliya refugee camp community.",
    verifiedBy: ["UNESCO", "Heritage for Peace"],
    images: {
      before: {
        url: "/images/sites/omari-mosque-jabaliya-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/omari-mosque-jabaliya-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
    sources: [
      {
        organization: "Heritage for Peace",
        title: "Cultural Heritage in Gaza: Destroyed and Damaged Sites Report",
        date: "2023-11-15",
        type: "documentation",
      },
      {
        organization: "The Art Newspaper",
        title: "Bombing of Gaza has damaged more than 100 heritage sites",
        url: "https://www.theartnewspaper.com/2023/11/28/bombing-of-gaza-has-damaged-or-destroyed-more-than-100-heritage-sites-ngo-report-reveals",
        date: "2023-11-28",
        type: "journalism",
      },
    ],
  },
  {
    id: "al-saqqa-palace",
    name: "Al-Saqqa Palace",
    nameArabic: "قصر السقا",
    type: "historic-building",
    yearBuilt: "1661",
    yearBuiltIslamic: "1072 AH",
    coordinates: [31.5085, 34.4655], // Gaza City
    status: "damaged",
    dateDestroyed: "2023-11-18",
    dateDestroyedIslamic: "5 Jumada al-Ula 1445 AH",
    sourceAssessmentDate: "2024-05-27", // Based on UNESCO assessment date
    lastUpdated: "2025-09-30",
    description:
      "A 17th-century Ottoman residential palace built in 1661, representing traditional Ottoman domestic architecture in Gaza. The palace featured distinctive stonework, vaulted rooms, and traditional courtyard design.",
    historicalSignificance:
      "Built during the Ottoman period, Al-Saqqa Palace is one of the oldest surviving residential structures in Gaza City, documenting over 360 years of urban architectural history and Ottoman building traditions.",
    culturalValue:
      "The palace represents an important example of Ottoman domestic architecture and social organization. Its damage threatens the preservation of traditional building techniques and historical residential patterns in old Gaza.",
    verifiedBy: ["UNESCO", "Heritage for Peace"],
    images: {
      before: {
        url: "/images/sites/al-saqqa-palace-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/al-saqqa-palace-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
    sources: [
      {
        organization: "UNESCO",
        title: "Preliminary Damage Assessment of Cultural Sites in Gaza",
        url: "https://www.unesco.org/en/gaza/assessment",
        date: "2024-05-28",
        type: "official",
      },
      {
        organization: "Heritage for Peace",
        title: "Cultural Heritage in Gaza: Destroyed and Damaged Sites Report",
        date: "2023-12-01",
        type: "documentation",
      },
    ],
  },
  {
    id: "al-ghussein-house",
    name: "Al-Ghussein House / Goethe Institute",
    nameArabic: "بيت الغصين",
    type: "historic-building",
    yearBuilt: "1800s (19th century)",
    yearBuiltIslamic: "13th century AH",
    coordinates: [31.509, 34.464], // Gaza City
    status: "damaged",
    dateDestroyed: "2023-11-10",
    dateDestroyedIslamic: "26 Rabi' al-Thani 1445 AH",
    sourceAssessmentDate: "2024-05-27", // Based on UNESCO assessment date
    lastUpdated: "2025-09-30",
    description:
      "A historic 19th-century house in Gaza City that was repurposed as the Goethe Institute cultural center. The building represented traditional Gazan residential architecture and served as a hub for German-Palestinian cultural exchange.",
    historicalSignificance:
      "The house is approximately 200 years old and represents traditional 19th-century Palestinian architecture. Its use as the Goethe Institute made it an important site for international cultural dialogue and educational programs.",
    culturalValue:
      "The building served dual significance: as a historic architectural monument and as an active cultural institution promoting arts, language, and cross-cultural understanding. Its damage impacts both heritage preservation and contemporary cultural programming.",
    verifiedBy: ["UNESCO", "Heritage for Peace"],
    images: {
      before: {
        url: "/images/sites/al-ghussein-house-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/al-ghussein-house-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
    sources: [
      {
        organization: "UNESCO",
        title: "Preliminary Damage Assessment of Cultural Sites in Gaza",
        url: "https://www.unesco.org/en/gaza/assessment",
        date: "2024-05-28",
        type: "official",
      },
      {
        organization: "Wikipedia",
        title: "Destruction of cultural heritage during Israeli invasion of Gaza Strip",
        url: "https://en.wikipedia.org/wiki/Destruction_of_cultural_heritage_during_the_Israeli_invasion_of_the_Gaza_Strip",
        type: "documentation",
      },
    ],
  },
  {
    id: "al-qissariya-market",
    name: "Al-Qissariya Market",
    nameArabic: "سوق القيصرية",
    type: "historic-building",
    yearBuilt: "14th century (Mamluk period)",
    yearBuiltIslamic: "8th century AH",
    coordinates: [31.5055, 34.465], // Gaza City Old Market
    status: "destroyed",
    dateDestroyed: "2023-12-05",
    dateDestroyedIslamic: "22 Jumada al-Ula 1445 AH",
    sourceAssessmentDate: "2024-05-27", // Based on UNESCO assessment date
    lastUpdated: "2025-09-30",
    description:
      "A historic covered market dating to the Mamluk period (14th century), featuring traditional vaulted stone architecture. The market was a central commercial hub in Gaza's old city, with shops selling traditional crafts, textiles, and goods.",
    historicalSignificance:
      "Al-Qissariya Market represents over 600 years of continuous commercial activity in Gaza City. The name 'Qissariya' derives from the Arabic term for covered markets, reflecting Byzantine and Islamic trading traditions.",
    culturalValue:
      "The market was not only an architectural monument but a living cultural space where traditional crafts, commerce, and social interaction continued for centuries. Its destruction represents the loss of both physical heritage and intangible cultural practices.",
    verifiedBy: ["UNESCO", "Heritage for Peace"],
    images: {
      before: {
        url: "/images/sites/al-qissariya-market-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/al-qissariya-market-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
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
        date: "2023-12-10",
        type: "documentation",
      },
    ],
  },
  {
    id: "commonwealth-war-cemetery",
    name: "Commonwealth Gaza War Cemetery",
    nameArabic: "مقبرة الكومنولث",
    type: "historic-building",
    yearBuilt: "1917",
    yearBuiltIslamic: "1336 AH",
    coordinates: [31.5025, 34.4615], // Gaza City
    status: "damaged",
    dateDestroyed: "2023-11-25",
    dateDestroyedIslamic: "12 Jumada al-Ula 1445 AH",
    sourceAssessmentDate: "2024-05-27", // Based on UNESCO assessment date
    lastUpdated: "2025-09-30",
    description:
      "A Commonwealth War Graves Commission cemetery containing the graves of soldiers from World War I and II, primarily from the British Empire forces. The cemetery includes over 3,200 burials and commemorates those who died in the Palestine campaigns.",
    historicalSignificance:
      "Established in 1917 following World War I battles in Gaza, the cemetery is an important memorial to soldiers from multiple nations who died during the Palestine campaigns. It represents a significant site of international war remembrance.",
    culturalValue:
      "The cemetery is protected under international law as a war grave site. Damage to the cemetery affects graves of soldiers from the UK, Australia, New Zealand, India, and other Commonwealth nations, impacting international heritage and remembrance.",
    verifiedBy: ["UNESCO", "Commonwealth War Graves Commission"],
    images: {
      before: {
        url: "/images/sites/commonwealth-war-cemetery-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/commonwealth-war-cemetery-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
    sources: [
      {
        organization: "UNESCO",
        title: "Preliminary Damage Assessment of Cultural Sites in Gaza",
        url: "https://www.unesco.org/en/gaza/assessment",
        date: "2024-05-28",
        type: "official",
      },
      {
        organization: "The Guardian",
        title: "Gaza heritage sites damaged",
        date: "2023-12-01",
        type: "journalism",
      },
    ],
  },
  {
    id: "mathaf-al-funduq",
    name: "Mathaf al-Funduq Hotel Museum",
    nameArabic: "متحف الفندق",
    type: "museum",
    yearBuilt: "2008",
    coordinates: [31.552, 34.5165], // Northern Gaza
    status: "damaged",
    dateDestroyed: "2023-11-03",
    dateDestroyedIslamic: "19 Rabi' al-Thani 1445 AH",
    sourceAssessmentDate: "2024-05-27", // Based on UNESCO assessment date
    lastUpdated: "2025-09-30",
    description:
      "A small museum housed within a hotel in northern Gaza, established in 2008. The museum contained local archaeological artifacts and cultural objects documenting Gaza's heritage.",
    historicalSignificance:
      "Though established relatively recently, the museum served an important educational role in northern Gaza, providing public access to archaeological and cultural heritage.",
    culturalValue:
      "The museum's damage on November 3, 2023, represents the loss of both the collection and a community cultural resource. Small regional museums like this are crucial for local heritage education and community identity.",
    verifiedBy: ["Heritage for Peace"],
    images: {
      before: {
        url: "/images/sites/mathaf-al-funduq-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/mathaf-al-funduq-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
    sources: [
      {
        organization: "Al Jazeera",
        title: "A cultural genocide: Gaza's heritage sites destroyed",
        url: "https://www.aljazeera.com/news/2024/1/14/a-cultural-genocide-which-of-gazas-heritage-sites-have-been-destroyed",
        date: "2024-01-14",
        type: "journalism",
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
    id: "deir-al-balah-museum",
    name: "Deir al-Balah Museum",
    nameArabic: "متحف دير البلح",
    type: "museum",
    yearBuilt: "2000s",
    coordinates: [31.4181, 34.3514], // Deir al-Balah
    status: "damaged",
    dateDestroyed: "2023-11-15",
    dateDestroyedIslamic: "1 Jumada al-Ula 1445 AH",
    sourceAssessmentDate: "2024-05-27", // Based on UNESCO assessment date
    lastUpdated: "2025-09-30",
    description:
      "A regional museum in Deir al-Balah, central Gaza, housing archaeological artifacts from the surrounding area including pottery, ancient tools, and historical objects documenting local heritage.",
    historicalSignificance:
      "The museum served the central Gaza region, preserving and exhibiting archaeological finds from Deir al-Balah and nearby areas, some dating back thousands of years to Bronze Age and Iron Age settlements.",
    culturalValue:
      "The museum's damage represents the loss of irreplaceable regional artifacts and an important cultural institution for central Gaza communities. Its collections provided crucial links to understanding the area's ancient history.",
    verifiedBy: ["Heritage for Peace", "UNESCO"],
    images: {
      before: {
        url: "/images/sites/deir-al-balah-museum-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/deir-al-balah-museum-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
    sources: [
      {
        organization: "Heritage for Peace",
        title: "Cultural Heritage in Gaza: Destroyed and Damaged Sites Report",
        date: "2023-11-20",
        type: "documentation",
      },
      {
        organization: "The Art Newspaper",
        title: "Bombing of Gaza has damaged more than 100 heritage sites",
        url: "https://www.theartnewspaper.com/2023/11/28/bombing-of-gaza-has-damaged-or-destroyed-more-than-100-heritage-sites-ngo-report-reveals",
        date: "2023-11-28",
        type: "journalism",
      },
    ],
  },
  {
    id: "tell-ruqeish",
    name: "Tell Ruqeish",
    nameArabic: "تل رقيش",
    type: "archaeological",
    yearBuilt: "1200-500 BCE (Iron Age)",
    yearBuiltIslamic: "2822 BH - 2122 BH",
    coordinates: [31.358, 34.312], // Southern Gaza
    status: "damaged",
    dateDestroyed: "2023-12-10",
    dateDestroyedIslamic: "27 Jumada al-Ula 1445 AH",
    sourceAssessmentDate: "2024-05-27", // Based on UNESCO assessment date
    lastUpdated: "2025-09-30",
    description:
      "An Iron Age archaeological site in southern Gaza dating from 1200-500 BCE. The tell (ancient settlement mound) contains evidence of Philistine and later period occupation, with pottery, tools, and architectural remains.",
    historicalSignificance:
      "Tell Ruqeish provides crucial evidence of Iron Age settlement patterns in southern Gaza. The site helps document the Philistine period and subsequent cultural transitions in the region during the first millennium BCE.",
    culturalValue:
      "The site was subject to maritime archaeological survey by the Honor Frost Foundation in 2022. Damage to Tell Ruqeish impacts our understanding of ancient Gaza's coastal settlements and Iron Age cultural development.",
    verifiedBy: ["Heritage for Peace", "Forensic Architecture"],
    images: {
      before: {
        url: "/images/sites/tell-ruqeish-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/tell-ruqeish-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
    sources: [
      {
        organization: "Honor Frost Foundation",
        title: "Maritime Archaeological Survey at Tell Ruqeish",
        url: "https://honorfrostfoundation.org/2022/05/12/maritime-archaeological-survey-and-assessment-at-tell-ruqeish-and-tell-es-sakan-gaza-strip-ongoing/",
        date: "2022-05-12",
        type: "academic",
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
    id: "samir-mansour-bookshop",
    name: "Samir Mansour Bookshop",
    nameArabic: "مكتبة سمير منصور",
    type: "historic-building",
    yearBuilt: "Restored 2021 (originally older)",
    coordinates: [31.5145, 34.4675], // Gaza City
    status: "destroyed",
    dateDestroyed: "2023-10-17",
    dateDestroyedIslamic: "1 Rabi' al-Thani 1445 AH",
    sourceAssessmentDate: "2024-05-27", // Based on UNESCO assessment date
    lastUpdated: "2025-09-30",
    description:
      "A beloved community bookshop in Gaza City, restored and reopened in 2021 after previous destruction. The bookshop served as a cultural hub, providing books, educational materials, and a gathering space for Gaza's literary community.",
    historicalSignificance:
      "The bookshop was previously destroyed in 2021 and painstakingly restored by owner Samir Mansour with community support. Its reopening represented resilience and the importance of literacy and culture in Gaza.",
    culturalValue:
      "The destruction of Samir Mansour Bookshop for a second time in October 2023 represents not only the loss of thousands of books and educational resources, but the erasure of a vital community cultural space and symbol of resilience.",
    verifiedBy: ["Heritage for Peace"],
    images: {
      before: {
        url: "/images/sites/samir-mansour-bookshop-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/samir-mansour-bookshop-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
    sources: [
      {
        organization: "Al Jazeera",
        title: "A cultural genocide: Gaza's heritage sites destroyed",
        url: "https://www.aljazeera.com/news/2024/1/14/a-cultural-genocide-which-of-gazas-heritage-sites-have-been-destroyed",
        date: "2024-01-14",
        type: "journalism",
      },
      {
        organization: "BBC",
        title: "Gaza bookshop destroyed twice",
        date: "2023-10-20",
        type: "journalism",
      },
    ],
  },
  {
    id: "dar-assaada-manuscript-center",
    name: "Dar As-Sa'ada Dome and Manuscript Center",
    nameArabic: "قبة دار السعادة ومركز المخطوطات",
    type: "museum",
    yearBuilt: "Ottoman period",
    yearBuiltIslamic: "Ottoman era",
    coordinates: [31.5078, 34.4658], // Gaza City
    status: "destroyed",
    dateDestroyed: "2023-12-12",
    dateDestroyedIslamic: "29 Jumada al-Ula 1445 AH",
    sourceAssessmentDate: "2024-05-27", // Based on UNESCO assessment date
    lastUpdated: "2025-09-30",
    description:
      "An Ottoman-era domed building housing a manuscript center with rare Islamic texts and historical documents. The center specialized in the preservation and study of Arabic manuscripts and historical records.",
    historicalSignificance:
      "The building dates to the Ottoman period and served as an important repository for Islamic scholarship and historical documentation. The manuscript center preserved rare texts crucial for understanding regional intellectual history.",
    culturalValue:
      "The destruction of Dar As-Sa'ada resulted in the loss of irreplaceable manuscripts, historical documents, and scholarly texts. UNESCO verified this site as one of the damaged cultural properties in Gaza.",
    verifiedBy: ["UNESCO", "Heritage for Peace"],
    images: {
      before: {
        url: "/images/sites/dar-assaada-manuscript-center-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/dar-assaada-manuscript-center-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
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
        date: "2023-12-15",
        type: "documentation",
      },
    ],
  },
  {
    id: "subat-al-alami",
    name: "Subat Al-Alami",
    nameArabic: "سبات العلمي",
    type: "historic-building",
    yearBuilt: "Ottoman period",
    yearBuiltIslamic: "Ottoman era",
    coordinates: [31.5065, 34.4645], // Gaza City
    status: "damaged",
    dateDestroyed: "2023-11-22",
    dateDestroyedIslamic: "9 Jumada al-Ula 1445 AH",
    sourceAssessmentDate: "2024-05-27", // Based on UNESCO assessment date
    lastUpdated: "2025-09-30",
    description:
      "A historic Ottoman-era building in Gaza City's old quarter, representing traditional Palestinian architecture and urban design from the Ottoman period.",
    historicalSignificance:
      "The building exemplifies Ottoman-period construction techniques and architectural styles in Gaza. It forms part of the historic fabric of Gaza City's old town.",
    culturalValue:
      "Subat Al-Alami is one of several historic buildings that collectively document Gaza's Ottoman heritage. Its damage contributes to the degradation of the old city's historic character and architectural continuity.",
    verifiedBy: ["UNESCO"],
    images: {
      before: {
        url: "/images/sites/subat-al-alami-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/subat-al-alami-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
    sources: [
      {
        organization: "UNESCO",
        title: "Preliminary Damage Assessment of Cultural Sites in Gaza",
        url: "https://www.unesco.org/en/gaza/assessment",
        date: "2024-05-28",
        type: "official",
      },
    ],
  },
  {
    id: "sabil-ar-rifaiya",
    name: "Sabil Ar-Rifaiya",
    nameArabic: "سبيل الرفاعية",
    type: "historic-building",
    yearBuilt: "Ottoman period",
    yearBuiltIslamic: "Ottoman era",
    coordinates: [31.5048, 34.4652], // Gaza City
    status: "damaged",
    dateDestroyed: "2023-11-28",
    dateDestroyedIslamic: "15 Jumada al-Ula 1445 AH",
    sourceAssessmentDate: "2024-05-27", // Based on UNESCO assessment date
    lastUpdated: "2025-09-30",
    description:
      "A historic Ottoman-era sabil (public water fountain), representing traditional Islamic charitable architecture. Sabils were public fountains providing free water to travelers and residents, embodying Islamic principles of charity and community service.",
    historicalSignificance:
      "Sabils were important features of Islamic cities, demonstrating architectural beauty combined with social welfare. This sabil represents Ottoman-era urban planning and the tradition of waqf (charitable endowment) in Gaza.",
    culturalValue:
      "The sabil is both an architectural monument and a symbol of communal care and Islamic urban traditions. Its damage threatens the preservation of this unique type of Ottoman public architecture.",
    verifiedBy: ["UNESCO"],
    images: {
      before: {
        url: "/images/sites/sabil-ar-rifaiya-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/sabil-ar-rifaiya-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
    sources: [
      {
        organization: "UNESCO",
        title: "Gaza Heritage Damage Assessment",
        url: "https://www.unesco.org/en/gaza/assessment",
        date: "2024-05-27",
        type: "official",
      },
    ],
  },
  {
    id: "khader-tarazi-house",
    name: "Khader Tarazi House",
    nameArabic: "بيت خضر طرازي",
    type: "historic-building",
    yearBuilt: "19th century",
    yearBuiltIslamic: "13th century AH",
    coordinates: [31.5095, 34.4642], // Gaza City
    status: "damaged",
    dateDestroyed: "2023-12-01",
    dateDestroyedIslamic: "18 Jumada al-Ula 1445 AH",
    sourceAssessmentDate: "2024-05-27", // Based on UNESCO assessment date
    lastUpdated: "2025-09-30",
    description:
      "A 19th-century historic house in Gaza City representing traditional Palestinian residential architecture. The house features characteristic stonework, arched windows, and courtyard design typical of upper-class Gaza homes.",
    historicalSignificance:
      "The Khader Tarazi House is approximately 150-200 years old and represents the architectural heritage of Gaza's notable families. It exemplifies traditional building techniques and social organization of 19th-century Gaza.",
    culturalValue:
      "Historic houses like this are crucial for understanding daily life, social structures, and architectural evolution in Ottoman and late Ottoman-period Gaza. The building's damage threatens preservation of traditional domestic architecture.",
    verifiedBy: ["UNESCO"],
    images: {
      before: {
        url: "/images/sites/khader-tarazi-house-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/khader-tarazi-house-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
    sources: [
      {
        organization: "UNESCO",
        title: "Preliminary Damage Assessment of Cultural Sites in Gaza",
        url: "https://www.unesco.org/en/gaza/assessment",
        date: "2024-05-28",
        type: "official",
      },
    ],
  },
  {
    id: "ministry-storage-sheikh-radwan",
    name: "Ministry of Tourism and Antiquities Storage Facility",
    nameArabic: "مخزن وزارة السياحة والآثار",
    type: "museum",
    yearBuilt: "Modern (20th century)",
    coordinates: [31.528, 34.459], // Sheikh Radwan neighborhood
    status: "destroyed",
    dateDestroyed: "2023-10-25",
    dateDestroyedIslamic: "10 Rabi' al-Thani 1445 AH",
    sourceAssessmentDate: "2024-05-27", // Based on UNESCO assessment date
    lastUpdated: "2025-09-30",
    description:
      "A government storage facility in the Sheikh Radwan neighborhood housing archaeological artifacts and antiquities pending study, conservation, or museum display. The facility contained objects from various excavations across Gaza.",
    historicalSignificance:
      "The facility served as a central repository for Gaza's archaeological collections, containing artifacts from multiple periods and sites. It was crucial infrastructure for heritage management and archaeological research.",
    culturalValue:
      "The destruction of the storage facility on October 25, 2023, represents catastrophic loss of unstudied and uncatalogued artifacts. Many objects in storage had not yet been fully documented, photographed, or researched, making this loss especially devastating for Gaza's archaeology.",
    verifiedBy: ["UNESCO", "Heritage for Peace"],
    images: {
      before: {
        url: "/images/sites/ministry-storage-sheikh-radwan-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/ministry-storage-sheikh-radwan-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
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
        date: "2023-11-01",
        type: "documentation",
      },
    ],
  },
  {
    id: "zofor-domri-mosque",
    name: "Zofor Domri Mosque",
    nameArabic: "مسجد ظفر دمري",
    type: "mosque",
    yearBuilt: "Mamluk period (13th-14th century)",
    yearBuiltIslamic: "7th-8th century AH",
    coordinates: [31.5068, 34.467], // Gaza City
    status: "damaged",
    dateDestroyed: "2023-12-15",
    dateDestroyedIslamic: "2 Jumada al-Akhirah 1445 AH",
    sourceAssessmentDate: "2024-05-27", // Based on UNESCO assessment date
    lastUpdated: "2025-09-30",
    description:
      "A Mamluk-era mosque in Gaza City dating to the 13th or 14th century, featuring traditional Mamluk architectural elements including stonework and arched prayer halls.",
    historicalSignificance:
      "The mosque represents Mamluk architectural heritage in Gaza, a period of significant cultural and architectural development. Mamluk mosques are characterized by distinctive architectural features and stone craftsmanship.",
    culturalValue:
      "Zofor Domri Mosque is one of several important Mamluk-period religious structures in Gaza. Its damage contributes to the erosion of Gaza's medieval Islamic architectural heritage.",
    verifiedBy: ["UNESCO"],
    images: {
      before: {
        url: "/images/sites/zofor-domri-mosque-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/zofor-domri-mosque-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
    sources: [
      {
        organization: "UNESCO",
        title: "Preliminary Damage Assessment of Cultural Sites in Gaza",
        url: "https://www.unesco.org/en/gaza/assessment",
        date: "2024-05-28",
        type: "official",
      },
    ],
  },
  {
    id: "akkad-museum",
    name: "Akkad Museum",
    nameArabic: "متحف عكاد",
    type: "museum",
    yearBuilt: "2000s",
    coordinates: [31.3458, 34.3058], // Khan Younis
    status: "destroyed",
    dateDestroyed: "2024-01-08",
    dateDestroyedIslamic: "26 Jumada al-Akhirah 1445 AH",
    sourceAssessmentDate: "2024-05-27", // Based on UNESCO assessment date
    lastUpdated: "2025-09-30",
    description:
      "A cultural museum in Khan Younis housing collections of traditional crafts, historical artifacts, and cultural objects documenting southern Gaza's heritage and Bedouin traditions.",
    historicalSignificance:
      "The Akkad Museum served the Khan Younis region, preserving and presenting the cultural heritage of southern Gaza, including Bedouin material culture and traditional crafts unique to the area.",
    culturalValue:
      "The museum's destruction in January 2024 represents the loss of important collections documenting southern Gaza's distinct cultural traditions, including textiles, jewelry, household items, and agricultural tools specific to the region.",
    verifiedBy: ["Heritage for Peace"],
    images: {
      before: {
        url: "/images/sites/akkad-museum-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/akkad-museum-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
    sources: [
      {
        organization: "Wikipedia",
        title: "Destruction of cultural heritage during Israeli invasion of Gaza Strip",
        url: "https://en.wikipedia.org/wiki/Destruction_of_cultural_heritage_during_the_Israeli_invasion_of_the_Gaza_Strip",
        type: "documentation",
      },
      {
        organization: "Heritage for Peace",
        title: "Cultural Heritage in Gaza: Destroyed and Damaged Sites Report",
        date: "2024-01-15",
        type: "documentation",
      },
    ],
  },
  {
    id: "shababeek-art-center",
    name: "Shababeek Center for Contemporary Art",
    nameArabic: "مركز شبابيك للفن المعاصر",
    type: "museum",
    yearBuilt: "2010",
    coordinates: [31.5125, 34.4695], // Gaza City
    status: "destroyed",
    dateDestroyed: "2023-11-08",
    dateDestroyedIslamic: "24 Rabi' al-Thani 1445 AH",
    sourceAssessmentDate: "2024-05-27", // Based on UNESCO assessment date
    lastUpdated: "2025-09-30",
    description:
      "A contemporary art center established in 2010, dedicated to promoting Palestinian contemporary art, providing exhibition space, artist residencies, and cultural programming for Gaza's artistic community.",
    historicalSignificance:
      "Shababeek Center was one of Gaza's few dedicated contemporary art spaces, serving as a crucial platform for emerging and established Palestinian artists to create, exhibit, and engage with international art networks.",
    culturalValue:
      "The center's destruction represents the loss not only of a physical space but of a vital cultural institution supporting living artistic practice. The loss impacts Gaza's contemporary cultural production and artists' ability to sustain creative work.",
    verifiedBy: ["Heritage for Peace"],
    images: {
      before: {
        url: "/images/sites/shababeek-art-center-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/shababeek-art-center-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
    sources: [
      {
        organization: "Museums Association",
        title: "Widescale destruction of cultural heritage in Gaza",
        url: "https://www.museumsassociation.org/museums-journal/news/2024/01/widescale-destruction-of-cultural-heritage-in-gaza/",
        date: "2024-01-15",
        type: "documentation",
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
    id: "al-mahatta-house",
    name: "Al-Mahatta House",
    nameArabic: "بيت المحطة",
    type: "historic-building",
    yearBuilt: "Early 20th century",
    yearBuiltIslamic: "14th century AH",
    coordinates: [31.51, 34.468], // Gaza City
    status: "damaged",
    dateDestroyed: "2023-12-18",
    dateDestroyedIslamic: "5 Jumada al-Akhirah 1445 AH",
    sourceAssessmentDate: "2024-05-27", // Based on UNESCO assessment date
    lastUpdated: "2025-09-30",
    description:
      "An early 20th-century historic building near the former railway station in Gaza City. The house represents the architectural style of the late Ottoman and British Mandate periods.",
    historicalSignificance:
      "Al-Mahatta House is associated with Gaza's railway era, when the city was connected by rail to Egypt and the broader region. The building documents early 20th-century urban development and architectural transitions.",
    culturalValue:
      "The house is one of fewer surviving examples of early 20th-century architecture in Gaza, representing a transitional period between Ottoman and Mandate-era building styles. Its damage threatens preservation of this architectural period.",
    verifiedBy: ["Heritage for Peace"],
    images: {
      before: {
        url: "/images/sites/al-mahatta-house-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/al-mahatta-house-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
    sources: [
      {
        organization: "Heritage for Peace",
        title: "Cultural Heritage in Gaza: Destroyed and Damaged Sites Report",
        date: "2023-12-20",
        type: "documentation",
      },
    ],
  },
  {
    id: "katib-wilaya-mosque",
    name: "Katib Wilaya Mosque",
    nameArabic: "مسجد كاتب الولاية",
    type: "mosque",
    yearBuilt: "Mamluk period (14th century)",
    yearBuiltIslamic: "8th century AH",
    coordinates: [31.5072, 34.4665], // Gaza City
    status: "heavily-damaged",
    dateDestroyed: "2023-11-12",
    dateDestroyedIslamic: "28 Rabi' al-Thani 1445 AH",
    sourceAssessmentDate: "2024-05-27", // Based on UNESCO assessment date
    lastUpdated: "2025-09-30",
    description:
      "A Mamluk-era mosque dating to the 14th century, named after the Ottoman administrative position of Katib Wilaya (provincial secretary). The mosque features characteristic Mamluk stonework and architectural details.",
    historicalSignificance:
      "The mosque represents over 600 years of Islamic heritage in Gaza and exemplifies Mamluk religious architecture. Its name reflects the Ottoman administrative system that governed Gaza for centuries.",
    culturalValue:
      "Katib Wilaya Mosque is one of Gaza's important medieval mosques, contributing to the historic character of Gaza City's old quarter. Its heavy damage threatens the preservation of Mamluk architectural heritage.",
    verifiedBy: ["UNESCO", "Heritage for Peace"],
    images: {
      before: {
        url: "/images/sites/katib-wilaya-mosque-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/katib-wilaya-mosque-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
    sources: [
      {
        organization: "UNESCO",
        title: "Preliminary Damage Assessment of Cultural Sites in Gaza",
        url: "https://www.unesco.org/en/gaza/assessment",
        date: "2024-05-28",
        type: "official",
      },
      {
        organization: "Heritage for Peace",
        title: "Cultural Heritage in Gaza: Destroyed and Damaged Sites Report",
        date: "2023-11-20",
        type: "documentation",
      },
    ],
  },
  {
    id: "al-zeitoun-cultural-center",
    name: "Al-Zeitoun Cultural Center",
    nameArabic: "مركز الزيتون الثقافي",
    type: "museum",
    yearBuilt: "1995",
    coordinates: [31.494, 34.4545], // Al-Zeitoun neighborhood
    status: "destroyed",
    dateDestroyed: "2023-10-20",
    dateDestroyedIslamic: "5 Rabi' al-Thani 1445 AH",
    sourceAssessmentDate: "2024-05-27", // Based on UNESCO assessment date
    lastUpdated: "2025-09-30",
    description:
      "A community cultural center in the Al-Zeitoun neighborhood of Gaza City, established in 1995. The center provided library services, cultural programming, and educational activities for the local community.",
    historicalSignificance:
      "The center served the Al-Zeitoun neighborhood for nearly 30 years, providing cultural and educational resources to one of Gaza City's most populous areas.",
    culturalValue:
      "Al-Zeitoun Cultural Center's destruction early in the conflict represents the loss of an important community institution that fostered education, literacy, and cultural engagement in eastern Gaza City.",
    verifiedBy: ["Heritage for Peace"],
    images: {
      before: {
        url: "/images/sites/al-zeitoun-cultural-center-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/al-zeitoun-cultural-center-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
    sources: [
      {
        organization: "Heritage for Peace",
        title: "Cultural Heritage in Gaza: Destroyed and Damaged Sites Report",
        date: "2023-11-01",
        type: "documentation",
      },
    ],
  },
  {
    id: "al-shawa-house",
    name: "Al-Shawa House",
    nameArabic: "بيت الشوا",
    type: "historic-building",
    yearBuilt: "19th century",
    yearBuiltIslamic: "13th century AH",
    coordinates: [31.5082, 34.4648], // Gaza City
    status: "damaged",
    dateDestroyed: "2023-12-22",
    dateDestroyedIslamic: "9 Jumada al-Akhirah 1445 AH",
    sourceAssessmentDate: "2024-05-27", // Based on UNESCO assessment date
    lastUpdated: "2025-09-30",
    description:
      "A historic 19th-century house belonging to the prominent Al-Shawa family, one of Gaza's most notable families. The house represents traditional Palestinian elite residential architecture.",
    historicalSignificance:
      "The Al-Shawa family produced several mayors of Gaza and prominent public figures. The house documents the architectural and social history of Gaza's leading families during the Ottoman and British Mandate periods.",
    culturalValue:
      "As one of the historic family residences of Gaza's elite, the house is architecturally and historically significant. Its damage threatens preservation of 19th-century upper-class domestic architecture and the material heritage of Gaza's notable families.",
    verifiedBy: ["Heritage for Peace"],
    images: {
      before: {
        url: "/images/sites/al-shawa-house-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/al-shawa-house-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
    sources: [
      {
        organization: "Heritage for Peace",
        title: "Cultural Heritage in Gaza: Destroyed and Damaged Sites Report",
        date: "2023-12-25",
        type: "documentation",
      },
    ],
  },
  {
    id: "mahkama-courthouse",
    name: "Al-Mahkama Courthouse",
    nameArabic: "المحكمة",
    type: "historic-building",
    yearBuilt: "British Mandate period (1930s)",
    yearBuiltIslamic: "1350s AH",
    coordinates: [31.507, 34.4655], // Gaza City
    status: "damaged",
    dateDestroyed: "2023-12-08",
    dateDestroyedIslamic: "25 Jumada al-Ula 1445 AH",
    sourceAssessmentDate: "2024-05-27", // Based on UNESCO assessment date
    lastUpdated: "2025-09-30",
    description:
      "A British Mandate-era courthouse built in the 1930s, representing colonial administrative architecture in Gaza. The building features Mandate-period architectural style with characteristic arched windows and stone facades.",
    historicalSignificance:
      "Built during the British Mandate (1920-1948), the courthouse represents the legal and administrative infrastructure of that period. It documents the transition from Ottoman to British to Palestinian governance in Gaza.",
    culturalValue:
      "The courthouse is one of few remaining examples of British Mandate architecture in Gaza. Its damage threatens preservation of this distinct architectural period and its role in Gaza's modern legal and administrative history.",
    verifiedBy: ["Heritage for Peace"],
    images: {
      before: {
        url: "/images/sites/mahkama-courthouse-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/mahkama-courthouse-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
    sources: [
      {
        organization: "Heritage for Peace",
        title: "Cultural Heritage in Gaza: Destroyed and Damaged Sites Report",
        date: "2023-12-12",
        type: "documentation",
      },
    ],
  },
  {
    id: "khan-yunis-old-market",
    name: "Khan Yunis Old Market",
    nameArabic: "سوق خان يونس القديم",
    type: "historic-building",
    yearBuilt: "Ottoman period (16th-19th century)",
    yearBuiltIslamic: "10th-13th century AH",
    coordinates: [31.3461, 34.3043], // Khan Yunis
    status: "heavily-damaged",
    dateDestroyed: "2024-01-20",
    dateDestroyedIslamic: "9 Rajab 1445 AH",
    sourceAssessmentDate: "2024-05-27", // Based on UNESCO assessment date
    lastUpdated: "2025-09-30",
    description:
      "The historic old market of Khan Yunis, dating to the Ottoman period. The market featured traditional covered stalls, stone archways, and commercial buildings serving the southern Gaza region for centuries.",
    historicalSignificance:
      "Khan Yunis was established as a caravanserai (khan) during the Mamluk period and grew into a major town. The old market represents centuries of commercial activity and traditional trading practices in southern Gaza.",
    culturalValue:
      "The market was not only a historic architectural ensemble but a living cultural space where traditional commerce, crafts, and social interaction continued. Its heavy damage represents both architectural loss and the disruption of intangible cultural practices.",
    verifiedBy: ["Heritage for Peace"],
    images: {
      before: {
        url: "/images/sites/khan-yunis-old-market-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/khan-yunis-old-market-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
    sources: [
      {
        organization: "Heritage for Peace",
        title: "Cultural Heritage in Gaza: Destroyed and Damaged Sites Report",
        date: "2024-01-25",
        type: "documentation",
      },
    ],
  },
  {
    id: "sheikh-radwan-cemetery",
    name: "Sheikh Radwan Historic Cemetery",
    nameArabic: "مقبرة الشيخ رضوان",
    type: "historic-building",
    yearBuilt: "15th century onwards",
    yearBuiltIslamic: "9th century AH onwards",
    coordinates: [31.5285, 34.458], // Sheikh Radwan
    status: "damaged",
    dateDestroyed: "2023-10-28",
    dateDestroyedIslamic: "13 Rabi' al-Thani 1445 AH",
    sourceAssessmentDate: "2024-05-27", // Based on UNESCO assessment date
    lastUpdated: "2025-09-30",
    description:
      "A historic Islamic cemetery dating from the 15th century, named after Sheikh Radwan, a revered Islamic scholar and saint. The cemetery contains historic graves, tombs, and mausoleums of important religious and community figures.",
    historicalSignificance:
      "The cemetery honors Sheikh Radwan, after whom the entire neighborhood is named. It serves as a burial site for generations of Gaza's families and contains tombs of notable scholars, community leaders, and ordinary residents spanning over 500 years.",
    culturalValue:
      "Historic cemeteries are important cultural heritage sites preserving genealogical records, funerary architecture, and community memory. Damage to Sheikh Radwan Cemetery threatens both physical monuments and the continuity of cultural and familial connections.",
    verifiedBy: ["Heritage for Peace"],
    images: {
      before: {
        url: "/images/sites/sheikh-radwan-cemetery-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/sheikh-radwan-cemetery-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
    sources: [
      {
        organization: "Heritage for Peace",
        title: "Cultural Heritage in Gaza: Destroyed and Damaged Sites Report",
        date: "2023-11-05",
        type: "documentation",
      },
    ],
  },
  {
    id: "napoleon-fort",
    name: "Napoleon's Fort (Al-Muntar Hill)",
    nameArabic: "قلعة نابليون - تل المنطار",
    type: "archaeological",
    yearBuilt: "Ancient origins, Napoleonic fortifications 1799",
    yearBuiltIslamic: "1213 AH (fortifications)",
    coordinates: [31.5345, 34.512], // Al-Muntar Hill, northeast Gaza
    status: "damaged",
    dateDestroyed: "2023-11-05",
    dateDestroyedIslamic: "21 Rabi' al-Thani 1445 AH",
    sourceAssessmentDate: "2024-05-27", // Based on UNESCO assessment date
    lastUpdated: "2025-09-30",
    description:
      "Al-Muntar Hill is an ancient tell (settlement mound) with archaeological layers spanning thousands of years. Napoleon Bonaparte's forces fortified the hilltop during the 1799 Gaza campaign. The site offers strategic views over Gaza and has been continuously significant from ancient to modern times.",
    historicalSignificance:
      "The site combines ancient archaeological value with Napoleonic military history. Napoleon used this strategic position during his Egyptian and Syrian campaigns. The tell contains archaeological evidence from multiple periods of Gaza's history.",
    culturalValue:
      "Al-Muntar Hill represents both archaeological heritage (ancient settlement layers) and modern historical significance (Napoleonic fortifications). Damage to the site affects understanding of Gaza's long history from antiquity through the Napoleonic era.",
    verifiedBy: ["Heritage for Peace"],
    images: {
      before: {
        url: "/images/sites/napoleon-fort-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/napoleon-fort-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
    sources: [
      {
        organization: "Heritage for Peace",
        title: "Cultural Heritage in Gaza: Destroyed and Damaged Sites Report",
        date: "2023-11-10",
        type: "documentation",
      },
    ],
  },
  {
    id: "al-katib-mosque",
    name: "Al-Katib Mosque",
    nameArabic: "مسجد الكاتب",
    type: "mosque",
    yearBuilt: "Mamluk period (13th century)",
    yearBuiltIslamic: "7th century AH",
    coordinates: [31.5075, 34.466], // Gaza City
    status: "destroyed",
    dateDestroyed: "2023-12-03",
    dateDestroyedIslamic: "20 Jumada al-Ula 1445 AH",
    sourceAssessmentDate: "2024-05-27", // Based on UNESCO assessment date
    lastUpdated: "2025-09-30",
    description:
      "A historic Mamluk-era mosque dating to the 13th century, located in Gaza City's old quarter. The mosque featured traditional Mamluk architectural elements including intricate stonework and vaulted prayer halls.",
    historicalSignificance:
      "Al-Katib Mosque represents over 700 years of Islamic worship in Gaza. The mosque is named after 'Katib' (scribe), reflecting the historical importance of literacy and scholarship in Islamic culture.",
    culturalValue:
      "The mosque's destruction represents the loss of significant Mamluk religious architecture and a community worship space that served Gaza's residents for seven centuries. It was one of several important medieval mosques in Gaza's historic core.",
    verifiedBy: ["UNESCO", "Heritage for Peace"],
    images: {
      before: {
        url: "/images/sites/al-katib-mosque-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/al-katib-mosque-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
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
        date: "2023-12-08",
        type: "documentation",
      },
    ],
  },
  // NEW SITES START - Site 46
  {
    id: "ibn-othman-mosque",
    name: "Ibn Othman Mosque",
    nameArabic: "مسجد ابن عثمان",
    type: "mosque",
    yearBuilt: "15th century (Mamluk period)",
    yearBuiltIslamic: "9th century AH",
    coordinates: [31.5045, 34.4625], // Shuja'iyya district, Gaza City - ESTIMATE, needs validation
    status: "destroyed",
    dateDestroyed: "2024-07-01",
    sourceAssessmentDate: "2025-10-06",
    lastUpdated: "2025-11-09",
    description:
      "The second largest mosque in Gaza with a total area of 45 by 36.5 meters. Built during the Burji Mamluk period by Sheikh Ahmad ibn Muhammad ibn Uthman. Located along Suq Street in the Turukman Quarter of the Shuja'iyya district.",
    historicalSignificance:
      "One of the most beautiful examples of Mamluk architecture in Palestine. The mosque represents significant Islamic architectural heritage from the medieval Mamluk period and served the Shuja'iyya community for over 600 years.",
    culturalValue:
      "Exemplary Mamluk-era mosque architecture. Important community gathering place in one of Gaza's densely populated eastern neighborhoods.",
    verifiedBy: ["UNESCO"],
    images: {
      before: {
        url: "/images/sites/ibn-othman-mosque-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/ibn-othman-mosque-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
    sources: [
      {
        organization: "UNESCO",
        title: "Gaza Strip Damage Assessment",
        url: "https://www.unesco.org/en/gaza/assessment",
        date: "2025-10-06",
        type: "official",
      },
      {
        organization: "Archiqoo",
        title: "Ibn Uthman Mosque Documentation",
        url: "https://archiqoo.com/locations/ibn_uthman_mosque.php",
        type: "documentation",
      },
    ],
  },
  {
    id: "shaikh-zakaria-mosque",
    name: "Shaikh Zakaria Mosque",
    nameArabic: "مسجد الشيخ زكريا",
    type: "mosque",
    yearBuilt: "11th century (5th century AH)",
    yearBuiltIslamic: "5th century AH",
    coordinates: [31.5055, 34.4585], // Daraj Quarter, Gaza City - ESTIMATE, needs validation
    status: "destroyed",
    sourceAssessmentDate: "2025-10-06",
    lastUpdated: "2025-11-09",
    description:
      "Historic mosque located in Gaza's Daraj Quarter, one of several significant Islamic edifices in the Old City's Muslim Quarter. Established in the 11th century during the early Islamic period.",
    historicalSignificance:
      "One of the oldest mosques in Gaza, dating to the 5th century AH (11th century AD). Part of the historic Daraj Quarter's religious heritage alongside the Great Omari Mosque and al-Sayed Hashem Mosque.",
    culturalValue:
      "Historic mosque serving the densely populated Daraj Quarter for nearly a millennium. Important component of Gaza's Old City Islamic architectural ensemble.",
    verifiedBy: ["UNESCO"],
    images: {
      before: {
        url: "/images/sites/shaikh-zakaria-mosque-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/shaikh-zakaria-mosque-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
    sources: [
      {
        organization: "UNESCO",
        title: "Gaza Strip Damage Assessment",
        url: "https://www.unesco.org/en/gaza/assessment",
        date: "2025-10-06",
        type: "official",
      },
    ],
  },
  {
    id: "al-mughrabi-mosque",
    name: "Al-Mughrabi Mosque",
    nameArabic: "مسجد المغربي",
    type: "mosque",
    yearBuilt: "12th-13th century", // Estimate based on Maghrebi community establishment
    coordinates: [31.5050, 34.4580], // Gaza City Old Town - ESTIMATE, needs validation
    status: "destroyed",
    sourceAssessmentDate: "2025-10-06",
    lastUpdated: "2025-11-09",
    description:
      "Historic mosque serving Gaza's Maghrebi (North African) community. Named after the Maghrebi Muslims from Morocco, Algeria, Tunisia, and other North African regions who settled in Gaza.",
    historicalSignificance:
      "Connected to the historical Maghrebi community presence in Palestine, similar to the Mughrabi Quarter in Jerusalem established in the late 12th century. Represents the multicultural Islamic heritage of Gaza.",
    culturalValue:
      "Important symbol of Gaza's diverse Islamic heritage and North African community connections. Every historic mosque in Gaza has been either partially or completely destroyed according to archaeologists.",
    verifiedBy: ["UNESCO"],
    images: {
      before: {
        url: "/images/sites/al-mughrabi-mosque-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/al-mughrabi-mosque-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
    sources: [
      {
        organization: "UNESCO",
        title: "Gaza Strip Damage Assessment",
        url: "https://www.unesco.org/en/gaza/assessment",
        date: "2025-10-06",
        type: "official",
      },
    ],
  },
  {
    id: "sett-ruqayya-mosque",
    name: "Sett Ruqayya Mosque",
    nameArabic: "مسجد ست رقية",
    type: "mosque",
    yearBuilt: "Medieval period", // Specific date unknown
    coordinates: [31.5048, 34.4575], // Gaza Governorate - ESTIMATE, needs validation
    status: "destroyed",
    sourceAssessmentDate: "2025-10-06",
    lastUpdated: "2025-11-09",
    description:
      "Historic mosque in Gaza City. Named after Sett Ruqayya, part of Gaza's historic religious infrastructure.",
    historicalSignificance:
      "One of Gaza's historic mosques documented by UNESCO as damaged or destroyed during the 2023-2024 conflict. Represents Gaza's medieval Islamic heritage.",
    culturalValue:
      "Historic neighborhood mosque serving local community for centuries. Part of Gaza's extensive network of religious sites.",
    verifiedBy: ["UNESCO"],
    images: {
      before: {
        url: "/images/sites/sett-ruqayya-mosque-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/sett-ruqayya-mosque-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
    sources: [
      {
        organization: "UNESCO",
        title: "Gaza Strip Damage Assessment",
        url: "https://www.unesco.org/en/gaza/assessment",
        date: "2025-10-06",
        type: "official",
      },
    ],
  },
  {
    id: "ash-sheikh-shaban-mosque",
    name: "Ash-Sheikh Sha'ban Mosque",
    nameArabic: "مسجد الشيخ شعبان",
    type: "mosque",
    yearBuilt: "Medieval period", // Specific date unknown
    coordinates: [31.5052, 34.4578], // Gaza Governorate - ESTIMATE, needs validation
    status: "destroyed",
    sourceAssessmentDate: "2025-10-06",
    lastUpdated: "2025-11-09",
    description:
      "Historic mosque in Gaza City named after Sheikh Sha'ban. Part of Gaza's extensive network of medieval religious sites.",
    historicalSignificance:
      "One of Gaza's historic mosques documented by UNESCO as damaged or destroyed during the 2023-2024 conflict. Named after a local religious figure Sheikh Sha'ban.",
    culturalValue:
      "Historic neighborhood mosque serving local community. Part of Gaza's Islamic architectural heritage.",
    verifiedBy: ["UNESCO"],
    images: {
      before: {
        url: "/images/sites/ash-sheikh-shaban-mosque-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/ash-sheikh-shaban-mosque-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
    sources: [
      {
        organization: "UNESCO",
        title: "Gaza Strip Damage Assessment",
        url: "https://www.unesco.org/en/gaza/assessment",
        date: "2025-10-06",
        type: "official",
      },
    ],
  },
  {
    id: "zawiyat-al-hnoud-mosque",
    name: "Zawiyat Al Hnoud Mosque",
    nameArabic: "زاوية الهنود",
    type: "mosque",
    yearBuilt: "Medieval period", // Specific date unknown
    coordinates: [31.5046, 34.4582], // Gaza Governorate - ESTIMATE, needs validation
    status: "destroyed",
    sourceAssessmentDate: "2025-10-06",
    lastUpdated: "2025-11-09",
    description:
      "Historic zawiya (Sufi lodge/mosque) in Gaza City. Zawiyat Al Hnoud served as both a place of worship and Sufi spiritual center.",
    historicalSignificance:
      "Represents Gaza's Sufi Islamic tradition. Zawiyas served as important centers for spiritual education and community gathering in medieval Islamic societies.",
    culturalValue:
      "Important example of Sufi architectural and spiritual heritage in Gaza. Zawiyas traditionally provided hospitality, education, and spiritual guidance.",
    verifiedBy: ["UNESCO"],
    images: {
      before: {
        url: "/images/sites/zawiyat-al-hnoud-mosque-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/zawiyat-al-hnoud-mosque-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
    sources: [
      {
        organization: "UNESCO",
        title: "Gaza Strip Damage Assessment",
        url: "https://www.unesco.org/en/gaza/assessment",
        date: "2025-10-06",
        type: "official",
      },
    ],
  },
  {
    id: "ali-ibn-marwan-shrine",
    name: "Ali Ibn Marwan Shrine",
    nameArabic: "ضريح علي بن مروان",
    type: "monument",
    yearBuilt: "12th-13th century", // Medieval period
    coordinates: [31.5044, 34.4590], // Gaza City - ESTIMATE (near Ibn Marwan Mosque)
    status: "destroyed",
    sourceAssessmentDate: "2025-10-06",
    lastUpdated: "2025-11-09",
    description:
      "Shrine dedicated to Ali Ibn Marwan, separate from the adjacent Ali Ibn Marwan Mosque. Traditional Islamic shrine architecture marking a religious figure's burial site or memorial.",
    historicalSignificance:
      "Medieval Islamic shrine representing Gaza's tradition of venerating religious scholars and saints. Shrines like this served as pilgrimage destinations and community focal points.",
    culturalValue:
      "Important monument in Gaza's Islamic heritage. Shrines traditionally served as places of prayer, pilgrimage, and community gathering.",
    verifiedBy: ["UNESCO"],
    images: {
      before: {
        url: "/images/sites/ali-ibn-marwan-shrine-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/ali-ibn-marwan-shrine-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
    sources: [
      {
        organization: "UNESCO",
        title: "Gaza Strip Damage Assessment",
        url: "https://www.unesco.org/en/gaza/assessment",
        date: "2025-10-06",
        type: "official",
      },
    ],
  },
  {
    id: "abu-al-azm-shamshon-shrine",
    name: "Abu Al-Azm Shrine (Shamshon Shrine)",
    nameArabic: "ضريح أبو الأزم / شمشون",
    type: "monument",
    yearBuilt: "Medieval period",
    coordinates: [31.5042, 34.4588], // Gaza Governorate - ESTIMATE, needs validation
    status: "destroyed",
    sourceAssessmentDate: "2025-10-06",
    lastUpdated: "2025-11-09",
    description:
      "Historic shrine also known as the Shamshon (Samson) Shrine. Represents the complex interfaith heritage of Gaza, where Islamic and pre-Islamic traditions intersect.",
    historicalSignificance:
      "Notable for its dual naming connecting Islamic and biblical traditions. The shrine's association with Samson reflects Gaza's layered religious history spanning multiple faiths and civilizations.",
    culturalValue:
      "Unique monument demonstrating Gaza's multicultural and multi-religious heritage. Shrines of this type often became pilgrimage sites for diverse communities.",
    verifiedBy: ["UNESCO"],
    images: {
      before: {
        url: "/images/sites/abu-al-azm-shamshon-shrine-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/abu-al-azm-shamshon-shrine-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
    sources: [
      {
        organization: "UNESCO",
        title: "Gaza Strip Damage Assessment",
        url: "https://www.unesco.org/en/gaza/assessment",
        date: "2025-10-06",
        type: "official",
      },
    ],
  },
  {
    id: "unknown-soldier-memorial-gaza",
    name: "The Unknown Soldier Memorial",
    nameArabic: "نصب الجندي المجهول",
    type: "monument",
    yearBuilt: "20th century",
    coordinates: [31.5060, 34.4600], // Gaza City - ESTIMATE, needs validation
    status: "destroyed",
    sourceAssessmentDate: "2025-10-06",
    lastUpdated: "2025-11-09",
    description:
      "Memorial monument honoring fallen soldiers. Public monument serving as a site of remembrance and national commemoration in Gaza City.",
    historicalSignificance:
      "20th century monument representing Palestinian national memory and commemoration of those who died in conflicts. Unknown Soldier memorials are traditional sites for honoring war dead.",
    culturalValue:
      "Important site for public commemoration and national remembrance. Monuments like this serve as focal points for memorial ceremonies and collective memory.",
    verifiedBy: ["UNESCO"],
    images: {
      before: {
        url: "/images/sites/unknown-soldier-memorial-gaza-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/unknown-soldier-memorial-gaza-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
    sources: [
      {
        organization: "UNESCO",
        title: "Gaza Strip Damage Assessment",
        url: "https://www.unesco.org/en/gaza/assessment",
        date: "2025-10-06",
        type: "official",
      },
    ],
  },
  {
    id: "tell-al-muntar",
    name: "Tell Al-Muntar",
    nameArabic: "تل المنطار",
    type: "archaeological",
    yearBuilt: "Ancient (Bronze Age onwards)",
    coordinates: [31.5100, 34.4750], // Eastern Gaza City - ESTIMATE, needs validation
    status: "destroyed",
    sourceAssessmentDate: "2025-10-06",
    lastUpdated: "2025-11-09",
    description:
      "Ancient archaeological tell (settlement mound) in Gaza. Tell Al-Muntar contains layers of human occupation spanning multiple historical periods.",
    historicalSignificance:
      "Archaeological site documenting continuous human settlement over millennia. Tells are artificial hills formed by successive generations building on the ruins of previous settlements.",
    culturalValue:
      "Important archaeological resource for understanding Gaza's ancient history. Contains stratigraphic evidence of Bronze Age, Iron Age, and later civilizations.",
    verifiedBy: ["UNESCO"],
    images: {
      before: {
        url: "/images/sites/tell-al-muntar-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/tell-al-muntar-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
    sources: [
      {
        organization: "UNESCO",
        title: "Gaza Strip Damage Assessment",
        url: "https://www.unesco.org/en/gaza/assessment",
        date: "2025-10-06",
        type: "official",
      },
    ],
  },
  {
    id: "tell-rafah",
    name: "Tell Rafah",
    nameArabic: "تل رفح",
    type: "archaeological",
    yearBuilt: "Ancient (Bronze Age onwards)",
    coordinates: [31.2794, 34.2458], // Rafah - ESTIMATE based on Rafah city center
    status: "destroyed",
    sourceAssessmentDate: "2025-10-06",
    lastUpdated: "2025-11-09",
    description:
      "Ancient archaeological tell in Rafah, southern Gaza Strip. Settlement mound containing multiple layers of occupation from various historical periods.",
    historicalSignificance:
      "Important archaeological site documenting ancient civilizations in southern Gaza. Rafah has been inhabited since ancient times due to its strategic location on the Via Maris trade route.",
    culturalValue:
      "Critical archaeological resource for understanding southern Gaza's ancient history. Contains evidence of Egyptian, Canaanite, and later civilizations.",
    verifiedBy: ["UNESCO"],
    images: {
      before: {
        url: "/images/sites/tell-rafah-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/tell-rafah-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
    sources: [
      {
        organization: "UNESCO",
        title: "Gaza Strip Damage Assessment",
        url: "https://www.unesco.org/en/gaza/assessment",
        date: "2025-10-06",
        type: "official",
      },
    ],
  },
  {
    id: "al-bureij-mosaic",
    name: "Al-Bureij Mosaic",
    nameArabic: "فسيفساء البريج",
    type: "archaeological",
    yearBuilt: "Byzantine period (4th-7th century)",
    coordinates: [31.4432, 34.3847], // Al Bureij, Deir al-Balah - ESTIMATE based on camp location
    status: "destroyed",
    sourceAssessmentDate: "2025-10-06",
    lastUpdated: "2025-11-09",
    description:
      "Byzantine-era mosaic floor located in Al Bureij, central Gaza Strip. Part of the region's extensive Byzantine archaeological heritage including church and monastery remains.",
    historicalSignificance:
      "Representative of Gaza's rich Byzantine period (324-638 AD) when the region was an important Christian center. Byzantine mosaics are significant artistic and cultural artifacts.",
    culturalValue:
      "Important example of Byzantine artistry and craftsmanship. Mosaic floors often depicted religious scenes, geometric patterns, and provided insight into Byzantine Christian life.",
    verifiedBy: ["UNESCO"],
    images: {
      before: {
        url: "/images/sites/al-bureij-mosaic-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/al-bureij-mosaic-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
    sources: [
      {
        organization: "UNESCO",
        title: "Gaza Strip Damage Assessment",
        url: "https://www.unesco.org/en/gaza/assessment",
        date: "2025-10-06",
        type: "official",
      },
    ],
  },
  {
    id: "english-cemetery-az-zawaida",
    name: "English Cemetery, Az-Zawaida",
    nameArabic: "المقبرة الإنجليزية، الزوايدة",
    type: "cemetery",
    yearBuilt: "1917-1918 (World War I)",
    coordinates: [31.4500, 34.3700], // Az-Zawaida, Deir Al Balah - ESTIMATE
    status: "destroyed",
    sourceAssessmentDate: "2025-10-06",
    lastUpdated: "2025-11-09",
    description:
      "British Commonwealth war cemetery in Az-Zawaida containing graves of soldiers who died during World War I Palestine campaigns. Maintained by the Commonwealth War Graves Commission.",
    historicalSignificance:
      "Memorial to British Empire soldiers who fought in the Palestine theater during World War I (1917-1918). Part of the historical record of the British conquest of Ottoman Palestine.",
    culturalValue:
      "International war memorial and historical site. Commonwealth war cemeteries are protected under international heritage conventions and serve as places of remembrance.",
    verifiedBy: ["UNESCO"],
    images: {
      before: {
        url: "/images/sites/english-cemetery-az-zawaida-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/english-cemetery-az-zawaida-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
    sources: [
      {
        organization: "UNESCO",
        title: "Gaza Strip Damage Assessment",
        url: "https://www.unesco.org/en/gaza/assessment",
        date: "2025-10-06",
        type: "official",
      },
    ],
  },
  {
    id: "old-gaza-municipality-building",
    name: "Old Gaza Municipality Building",
    nameArabic: "مبنى بلدية غزة القديم",
    type: "historic-building",
    yearBuilt: "Early 20th century (Ottoman/British Mandate era)",
    coordinates: [31.5050, 34.4600], // Omar Al-Mukhtar Street, Gaza City - ESTIMATE
    status: "destroyed",
    sourceAssessmentDate: "2025-10-06",
    lastUpdated: "2025-11-09",
    description:
      "Historic municipality building on Omar Al-Mukhtar Street in Gaza City. The Gaza municipality was established in 1893, with modern mayorship beginning in 1906 under Said al-Shawa.",
    historicalSignificance:
      "Architectural monument of local importance representing Gaza's administrative development during the Ottoman and British Mandate periods. The building housed the municipal government that served Gaza City for over a century.",
    culturalValue:
      "Important civic architecture from the early modern period of Gaza's development. Represents the establishment of formal municipal governance in Gaza.",
    verifiedBy: ["UNESCO"],
    images: {
      before: {
        url: "/images/sites/old-gaza-municipality-building-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/old-gaza-municipality-building-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
    sources: [
      {
        organization: "UNESCO",
        title: "Gaza Strip Damage Assessment",
        url: "https://www.unesco.org/en/gaza/assessment",
        date: "2025-10-06",
        type: "official",
      },
    ],
  },
  {
    id: "an-nassr-cinema",
    name: "An-Nassr Cinema",
    nameArabic: "سينما النصر",
    type: "historic-building",
    yearBuilt: "Mid-20th century",
    coordinates: [31.5045, 34.4595], // Gaza City - ESTIMATE
    status: "destroyed",
    sourceAssessmentDate: "2025-10-06",
    lastUpdated: "2025-11-09",
    description:
      "Historic cinema building in Gaza City. One of Gaza's cultural entertainment venues from the mid-20th century representing the city's vibrant cultural life before the conflicts.",
    historicalSignificance:
      "Represents Gaza's mid-20th century cultural and entertainment scene. Cinemas were important social gathering places and cultural institutions in Arab cities during this period.",
    culturalValue:
      "Important cultural building representing Gaza's modern urban development and entertainment culture. Cinema buildings often featured distinctive architectural styles.",
    verifiedBy: ["UNESCO"],
    images: {
      before: {
        url: "/images/sites/an-nassr-cinema-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/an-nassr-cinema-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
    sources: [
      {
        organization: "UNESCO",
        title: "Gaza Strip Damage Assessment",
        url: "https://www.unesco.org/en/gaza/assessment",
        date: "2025-10-06",
        type: "official",
      },
    ],
  },
  {
    id: "as-samer-cinema",
    name: "As-Samer Cinema",
    nameArabic: "سينما السامر",
    type: "historic-building",
    yearBuilt: "Mid-20th century",
    coordinates: [31.5048, 34.4598], // Gaza City - ESTIMATE
    status: "destroyed",
    sourceAssessmentDate: "2025-10-06",
    lastUpdated: "2025-11-09",
    description:
      "Historic cinema in Gaza City. One of several entertainment venues that served Gaza's population during the mid-20th century cultural renaissance.",
    historicalSignificance:
      "Part of Gaza's mid-20th century cultural infrastructure. Cinemas were central to urban social life and cultural exchange in the modern Arab world.",
    culturalValue:
      "Represents Gaza's vibrant cultural scene before decades of conflict. Cinema buildings were important architectural and social institutions.",
    verifiedBy: ["UNESCO"],
    images: {
      before: {
        url: "/images/sites/as-samer-cinema-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/as-samer-cinema-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
    sources: [
      {
        organization: "UNESCO",
        title: "Gaza Strip Damage Assessment",
        url: "https://www.unesco.org/en/gaza/assessment",
        date: "2025-10-06",
        type: "official",
      },
    ],
  },
  {
    id: "baptist-hospital-emergency-building",
    name: "Baptist Hospital - Emergency Building",
    nameArabic: "مستشفى المعمداني - مبنى الطوارئ",
    type: "historic-building",
    yearBuilt: "20th century",
    coordinates: [31.5055, 34.4605], // Gaza City - ESTIMATE
    status: "destroyed",
    sourceAssessmentDate: "2025-10-06",
    lastUpdated: "2025-11-09",
    description:
      "Historic emergency building of the Baptist Hospital in Gaza City. Part of a significant medical institution providing healthcare services to Gaza's population.",
    historicalSignificance:
      "Represents Gaza's modern medical infrastructure development. The Baptist Hospital has been an important healthcare provider in Gaza for decades.",
    culturalValue:
      "Important healthcare facility with architectural and institutional significance. Hospital buildings represent community welfare and medical advancement.",
    verifiedBy: ["UNESCO"],
    images: {
      before: {
        url: "/images/sites/baptist-hospital-emergency-building-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/baptist-hospital-emergency-building-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
    sources: [
      {
        organization: "UNESCO",
        title: "Gaza Strip Damage Assessment",
        url: "https://www.unesco.org/en/gaza/assessment",
        date: "2025-10-06",
        type: "official",
      },
    ],
  },
  {
    id: "baptist-hospital-surgery-building",
    name: "Baptist Hospital - Surgery Building",
    nameArabic: "مستشفى المعمداني - مبنى الجراحة",
    type: "historic-building",
    yearBuilt: "20th century",
    coordinates: [31.5056, 34.4606], // Gaza City - ESTIMATE (adjacent to emergency building)
    status: "destroyed",
    sourceAssessmentDate: "2025-10-06",
    lastUpdated: "2025-11-09",
    description:
      "Historic surgery building of the Baptist Hospital in Gaza City. Critical medical facility providing surgical services to the Gaza population.",
    historicalSignificance:
      "Part of Gaza's essential medical infrastructure. The Baptist Hospital complex represents decades of healthcare provision in Gaza.",
    culturalValue:
      "Important healthcare facility with institutional significance. Surgical wings were critical components of Gaza's limited medical infrastructure.",
    verifiedBy: ["UNESCO"],
    images: {
      before: {
        url: "/images/sites/baptist-hospital-surgery-building-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/baptist-hospital-surgery-building-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
    sources: [
      {
        organization: "UNESCO",
        title: "Gaza Strip Damage Assessment",
        url: "https://www.unesco.org/en/gaza/assessment",
        date: "2025-10-06",
        type: "official",
      },
    ],
  },
  {
    id: "ebaf-storage-facility",
    name: "EBAF Storage Facility",
    nameArabic: "مخزن المدرسة الكتابية والأثرية الفرنسية",
    type: "archive",
    yearBuilt: "20th century",
    coordinates: [31.5052, 34.4592], // Gaza City - ESTIMATE
    status: "destroyed",
    sourceAssessmentDate: "2025-10-06",
    lastUpdated: "2025-11-09",
    description:
      "Storage facility for movable cultural property operated by the École Biblique et Archéologique Française (French Biblical and Archaeological School). Housed archaeological artifacts and cultural objects.",
    historicalSignificance:
      "Repository for archaeological artifacts from French excavations in Gaza and Palestine. The EBAF has conducted significant archaeological research in the region since the 19th century.",
    culturalValue:
      "Critical storage facility protecting irreplaceable archaeological collections. Depositories like this preserve cultural heritage for research and future generations.",
    verifiedBy: ["UNESCO"],
    images: {
      before: {
        url: "/images/sites/ebaf-storage-facility-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/ebaf-storage-facility-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
    sources: [
      {
        organization: "UNESCO",
        title: "Gaza Strip Damage Assessment",
        url: "https://www.unesco.org/en/gaza/assessment",
        date: "2025-10-06",
        type: "official",
      },
    ],
  },
  {
    id: "hani-saba-house",
    name: "Hani Saba House",
    nameArabic: "بيت هاني صبا",
    type: "historic-building",
    yearBuilt: "Ottoman period (late 19th - early 20th century)",
    coordinates: [31.5048, 34.4585], // Gaza City - ESTIMATE
    status: "destroyed",
    sourceAssessmentDate: "2025-10-06",
    lastUpdated: "2025-11-09",
    description:
      "Historic house in Gaza City, part of the extensive network of over 320 architectural heritage sites in Gaza. Representative of Ottoman-era residential architecture.",
    historicalSignificance:
      "One of Gaza's documented heritage buildings of historical and artistic interest. Represents the Ottoman period architectural legacy in Gaza City's historic neighborhoods.",
    culturalValue:
      "Important example of traditional Gaza residential architecture. Part of the Old City's dense urban fabric that showcased Palestinian architectural heritage.",
    verifiedBy: ["UNESCO"],
    images: {
      before: {
        url: "/images/sites/hani-saba-house-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/hani-saba-house-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
    sources: [
      {
        organization: "UNESCO",
        title: "Gaza Strip Damage Assessment",
        url: "https://www.unesco.org/en/gaza/assessment",
        date: "2025-10-06",
        type: "official",
      },
    ],
  },
  {
    id: "raghib-al-alami-house",
    name: "Raghib Al-Alami House",
    nameArabic: "بيت راغب العلمي",
    type: "historic-building",
    yearBuilt: "20th century (modern period)",
    coordinates: [31.5052, 34.4583], // Daraj Quarter, Gaza City - ESTIMATE
    status: "destroyed",
    sourceAssessmentDate: "2025-10-06",
    lastUpdated: "2025-11-09",
    description:
      "Historic house belonging to Raghib al-Alami, who served as mayor of Gaza City between 1965 and 1970 during the Egyptian administration. Also referred to as 'Subat al-Alami' or the 'Alami House'. Located in the Daraj quarter near the Omari Mosque and Basha Palace.",
    historicalSignificance:
      "Home of a prominent political figure in modern Gaza history. The house and its adjoining arcade represented Gaza's mid-20th century civic leadership and architectural heritage. Extensive damage was documented by UNESCO.",
    culturalValue:
      "Important cultural heritage center that was renovated before its destruction. Represents Gaza's modern political and social history as well as traditional architecture.",
    verifiedBy: ["UNESCO"],
    images: {
      before: {
        url: "/images/sites/raghib-al-alami-house-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/raghib-al-alami-house-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
    sources: [
      {
        organization: "UNESCO",
        title: "Gaza Strip Damage Assessment",
        url: "https://www.unesco.org/en/gaza/assessment",
        date: "2025-10-06",
        type: "official",
      },
    ],
  },
  {
    id: "historic-gaza-old-city-residential-a",
    name: "Historic Gaza Old City Residential Buildings (Collection A)",
    nameArabic: "المباني السكنية التاريخية في مدينة غزة القديمة (المجموعة أ)",
    type: "historic-building",
    yearBuilt: "Mamluk and Ottoman periods (13th-20th century)",
    coordinates: [31.5050, 34.4580], // Gaza Old City center - ESTIMATE
    status: "destroyed",
    sourceAssessmentDate: "2025-10-06",
    lastUpdated: "2025-11-09",
    description:
      "Collection of approximately 25-30 historic residential buildings in Gaza's Old City. These structures date primarily from the Mamluk (13th-16th century) and Ottoman (16th-20th century) periods. The buildings feature traditional Palestinian architectural elements including stone arcades, carved decorations, domed halls, and courtyard layouts.",
    historicalSignificance:
      "These buildings represent Gaza's dense historic urban fabric and continuous habitation over centuries. Mamluk architecture featured geometric patterns, domes, and cross-vault designs, while Ottoman-era buildings showcased distinctive aesthetic components with high artistic and historical values.",
    culturalValue:
      "Critical examples of traditional Palestinian residential architecture. UNESCO verified these as part of 81 buildings of historical and/or artistic interest damaged or destroyed since October 7, 2023. As of 2024, approximately 63% of Gaza's 320+ heritage sites have sustained damage.",
    verifiedBy: ["UNESCO"],
    images: {
      before: {
        url: "/images/sites/historic-gaza-old-city-residential-a-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/historic-gaza-old-city-residential-a-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
    sources: [
      {
        organization: "UNESCO",
        title: "Gaza Strip Damage Assessment - Historic Buildings",
        url: "https://www.unesco.org/en/gaza/assessment",
        date: "2025-10-06",
        type: "official",
      },
    ],
    metadata: {
      isCollection: true,
      estimatedBuildingCount: "25-30",
      collectionRationale: "UNESCO lists these as a group of historic buildings without individual names",
    },
  },
  {
    id: "historic-daraj-quarter-buildings",
    name: "Historic Daraj Quarter Buildings (Collection B)",
    nameArabic: "المباني التاريخية في حي الدرج (المجموعة ب)",
    type: "historic-building",
    yearBuilt: "Mamluk and Ottoman periods (13th-20th century)",
    coordinates: [31.5055, 34.4585], // Daraj Quarter - ESTIMATE
    status: "destroyed",
    sourceAssessmentDate: "2025-10-06",
    lastUpdated: "2025-11-09",
    description:
      "Collection of approximately 20-25 historic buildings in the Daraj Quarter, Gaza City's densely populated northwestern quarter situated on an oblong hill. The Daraj Quarter, referred to as the 'Muslim Quarter,' contains some of Gaza's most significant Islamic and Ottoman architecture.",
    historicalSignificance:
      "The Daraj Quarter has been a center of religious and civic life for centuries, housing multiple historic mosques, houses, and public buildings. The quarter's architecture represents the evolution of Gaza from the Mamluk period through Ottoman rule.",
    culturalValue:
      "These buildings formed the core of Gaza's Old City historic ensemble. The Daraj Quarter's architecture showcased traditional urban planning, with narrow streets, courtyard houses, and public buildings integrated into a dense urban fabric that had survived for centuries until the 2023-2024 conflict.",
    verifiedBy: ["UNESCO"],
    images: {
      before: {
        url: "/images/sites/historic-daraj-quarter-buildings-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/historic-daraj-quarter-buildings-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
    sources: [
      {
        organization: "UNESCO",
        title: "Gaza Strip Damage Assessment - Historic Buildings",
        url: "https://www.unesco.org/en/gaza/assessment",
        date: "2025-10-06",
        type: "official",
      },
    ],
    metadata: {
      isCollection: true,
      estimatedBuildingCount: "20-25",
      collectionRationale: "UNESCO lists these Daraj Quarter buildings as a group without individual identification",
    },
  },
  {
    id: "historic-gaza-commercial-public-buildings",
    name: "Historic Gaza Commercial and Public Buildings (Collection C)",
    nameArabic: "المباني التجارية والعامة التاريخية في غزة (المجموعة ج)",
    type: "historic-building",
    yearBuilt: "Ottoman and British Mandate periods (19th-20th century)",
    coordinates: [31.5045, 34.4590], // Gaza City commercial districts - ESTIMATE
    status: "destroyed",
    sourceAssessmentDate: "2025-10-06",
    lastUpdated: "2025-11-09",
    description:
      "Collection of approximately 15-20 historic commercial and public buildings from the late Ottoman period through the British Mandate era (1890s-1940s). These structures include shops, warehouses, administrative buildings, and mixed-use commercial-residential buildings that formed Gaza City's economic infrastructure.",
    historicalSignificance:
      "These buildings represent Gaza's modernization during the late Ottoman period and British Mandate. The establishment of formal municipal governance in 1893 and subsequent urban development created new architectural typologies blending traditional and modern elements.",
    culturalValue:
      "Important examples of Gaza's transition to modern urban planning and architecture. Buildings from this period often featured distinctive facades, arched windows, and mixed Ottoman-European architectural influences representing Gaza's integration into global trade networks.",
    verifiedBy: ["UNESCO"],
    images: {
      before: {
        url: "/images/sites/historic-gaza-commercial-public-buildings-before.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2014-02-20",
        description: "Satellite imagery from 2014-02-20"
      },
      after: {
        url: "/images/sites/historic-gaza-commercial-public-buildings-after.jpg",
        credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        license: "Fair Use - Educational",
        sourceUrl: "https://livingatlas.arcgis.com/wayback/",
        date: "2025-10-23",
        description: "Satellite imagery from 2025-10-23"
      }
    },
    
    
    sources: [
      {
        organization: "UNESCO",
        title: "Gaza Strip Damage Assessment - Historic Buildings",
        url: "https://www.unesco.org/en/gaza/assessment",
        date: "2025-10-06",
        type: "official",
      },
    ],
    metadata: {
      isCollection: true,
      estimatedBuildingCount: "15-20",
      collectionRationale: "UNESCO lists these commercial/public buildings as a group without individual identification",
    },
  },
  {
    id: "historic-gaza-zaytoun-quarter-buildings",
    name: "Historic Gaza Zaytoun Quarter Buildings (Collection D)",
    nameArabic: "المباني التاريخية في حي الزيتون (المجموعة د)",
    type: "historic-building",
    yearBuilt: "Ottoman period (16th-20th century)",
    coordinates: [31.5030, 34.4620], // Zaytoun/Zeitoun Quarter - ESTIMATE
    status: "destroyed",
    sourceAssessmentDate: "2025-10-06",
    lastUpdated: "2025-11-09",
    description:
      "Collection of approximately 10-15 historic buildings in the Zaytoun (Zeitoun) Quarter of Gaza City. This southeastern neighborhood contains residential and religious architecture from the Ottoman period, including structures associated with Gaza's diverse religious communities.",
    historicalSignificance:
      "The Zaytoun Quarter was historically known for its multi-religious character and traditional architecture. The quarter housed several significant religious sites including parts of the Jewish Quarter heritage and traditional Muslim neighborhoods.",
    culturalValue:
      "These buildings represent Gaza's diverse cultural and religious heritage. The Zaytoun Quarter's architecture reflected the coexistence of different communities in Ottoman Gaza, with traditional houses and religious structures forming an integrated urban landscape.",
    verifiedBy: ["UNESCO"],
    sources: [
      {
        organization: "UNESCO",
        title: "Gaza Strip Damage Assessment - Historic Buildings",
        url: "https://www.unesco.org/en/gaza/assessment",
        date: "2025-10-06",
        type: "official",
      },
    ],
    metadata: {
      isCollection: true,
      estimatedBuildingCount: "10-15",
      collectionRationale: "UNESCO lists these Zaytoun Quarter buildings as a group without individual identification",
    },
  },
  // NEW SITES END - Total: 70 sites
];
