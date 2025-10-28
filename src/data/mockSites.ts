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
    lastUpdated: "2024-05-27", // Based on UNESCO assessment date
    description:
      "Gaza's oldest and largest mosque, originally a Byzantine church converted in the 7th century. The mosque housed rare Islamic manuscripts and served as a center of learning for centuries.",
    historicalSignificance:
      "One of the oldest mosques in Palestine, with a history spanning over 1,400 years. It represents continuous religious and cultural heritage from Byzantine, Islamic, Crusader, Mamluk, and Ottoman periods.",
    culturalValue:
      "Contained 62 rare manuscripts including handwritten Qurans and Islamic scholarly texts. The building itself was an architectural masterpiece blending multiple historical periods.",
    verifiedBy: ["UNESCO", "Heritage for Peace", "Forensic Architecture"],
    // Images need to be sourced with proper attribution
    // Example structure:
    // images: {
    //   before: {
    //     url: "/images/great-omari-before.jpg",
    //     credit: "Photographer Name / Organization",
    //     license: "CC BY-SA 4.0",
    //     sourceUrl: "https://...",
    //     date: "2023-01-15"
    //   }
    // },
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
    lastUpdated: "2024-05-27", // Based on UNESCO assessment date
    description:
      "One of the oldest churches in the world, built in 425 CE and named after Saint Porphyrius, Bishop of Gaza. The church served Gaza's small Christian community and was a rare example of early Byzantine architecture.",
    historicalSignificance:
      "Third-oldest church in the world still in use before the conflict. Contains the tomb of Saint Porphyrius and represents 1,600 years of continuous Christian presence in Gaza.",
    culturalValue:
      "Irreplaceable Byzantine-era mosaics, ancient religious artifacts, and architectural elements. Served as a sanctuary and community center for Gaza's Christian minority.",
    verifiedBy: ["UNESCO", "Heritage for Peace"],
    // Images need to be sourced with proper attribution
    // images: {
    //   before: {
    //     url: "/images/st-porphyrius-before.jpg",
    //     credit: "Photographer Name / Organization",
    //     license: "CC BY-SA 4.0",
    //   },
    //   after: {
    //     url: "/images/st-porphyrius-after.jpg",
    //     credit: "Photographer Name / Organization",
    //     license: "CC BY-SA 4.0",
    //   },
    // },
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
    lastUpdated: "2024-05-27", // Based on UNESCO assessment date
    description:
      "Ancient seaport and settlement site with continuous occupation from the Iron Age through the Islamic period. Contained over 4,000 archaeological objects including pottery, coins, and architectural remains.",
    historicalSignificance:
      "One of the most important archaeological sites in Gaza, documenting nearly 2,000 years of Mediterranean trade and cultural exchange. Provided crucial evidence of Philistine, Greek, Roman, Byzantine, and Islamic civilizations.",
    culturalValue:
      "Irreplaceable archaeological artifacts spanning multiple civilizations. The site was crucial for understanding ancient Gaza's role as a major port city and cultural crossroads.",
    verifiedBy: ["UNESCO", "Forensic Architecture", "Heritage for Peace"],
    // Images need to be sourced with proper attribution
    // images: {
    //   before: {
    //     url: "/images/blakhiyya-before.jpg",
    //     credit: "Photographer Name / Organization",
    //     license: "CC BY-SA 4.0",
    //   },
    //   satellite: {
    //     url: "/images/blakhiyya-satellite.jpg",
    //     credit: "Photographer Name / Organization",
    //     license: "CC BY-SA 4.0",
    //   },
    // },
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
    lastUpdated: "2024-05-27", // Based on UNESCO assessment date
    description:
      "A 13th-century Mamluk palace that served as the residence of Napoleon Bonaparte during his 1799 Gaza campaign. Later converted into a museum showcasing Gaza's history with collections of pottery, coins, and historical artifacts.",
    historicalSignificance:
      "The palace represents Mamluk architectural heritage and served as an important administrative center throughout various historical periods. Its connection to Napoleon's campaign made it a landmark of international historical significance.",
    culturalValue:
      "Housed museum collections documenting Gaza's history from ancient to modern times. The building itself was an architectural treasure featuring distinctive Mamluk stonework and vaulted chambers.",
    verifiedBy: ["UNESCO", "Heritage for Peace"],
    // Images need to be sourced with proper attribution
    // images: {
    //   before: {
    //     url: "/images/qasr-al-basha-before.jpg",
    //     credit: "Photographer Name / Organization",
    //     license: "CC BY-SA 4.0",
    //   },
    //   after: {
    //     url: "/images/qasr-al-basha-after.jpg",
    //     credit: "Photographer Name / Organization",
    //     license: "CC BY-SA 4.0",
    //   },
    // },
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
    lastUpdated: "2024-05-27", // Based on UNESCO assessment date
    description:
      "A historic Ottoman bathhouse representing traditional Islamic bathing culture and social architecture. The hammam featured distinctive domed chambers, intricate stonework, and a sophisticated water heating system.",
    historicalSignificance:
      "One of the last remaining examples of Ottoman public bath architecture in Gaza. These bathhouses served as important social and cultural centers in Islamic cities for centuries.",
    culturalValue:
      "The hammam represents traditional Ottoman architectural techniques and social customs. Its preservation was crucial for understanding daily life and public health practices in historic Gaza.",
    verifiedBy: ["Heritage for Peace", "Forensic Architecture"],
    // Images need to be sourced with proper attribution
    // images: {
    //   before: {
    //     url: "/images/hammam-al-samra-before.jpg",
    //     credit: "Photographer Name / Organization",
    //     license: "CC BY-SA 4.0",
    //   },
    //   after: {
    //     url: "/images/hammam-al-samra-after.jpg",
    //     credit: "Photographer Name / Organization",
    //     license: "CC BY-SA 4.0",
    //   },
    // },
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
    lastUpdated: "2024-05-27", // Based on UNESCO assessment date
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
  // commenting out because its an outler at this time and makes the timeline data harder to see
  // {
  //   id: "ibn-uthman-mosque",
  //   name: "Ibn Uthman Mosque",
  //   nameArabic: "مسجد ابن عثمان",
  //   type: "mosque",
  //   yearBuilt: "1399-1400 (14th century)",
  //   yearBuiltIslamic: "802 AH",
  //   coordinates: [31.5203, 34.4668],
  //   status: "destroyed",
  //   dateDestroyed: "2024-07-15", // Estimated July 2024
  //   dateDestroyedIslamic: "9 Muharram 1446 AH", // Manually verified with Islamic calendar converter
  //   description:
  //     "The second largest archaeological mosque in the Gaza Strip, located along Suq Street in the Turukman Quarter of the Shuja'iyya district. The mosque covered 2,000 square meters with a 400 square meter main courtyard and featured two gates overlooking the Shuja'iyya market.",
  //   historicalSignificance:
  //     "Built between 1399-1400 CE during the Mamluk period, this mosque represented significant Islamic architectural heritage in Gaza. It was an important religious center in the Shuja'iyya neighborhood for over 600 years before its destruction.",
  //   culturalValue:
  //     "The Ibn Uthman Mosque was the second most important archaeological mosque in Gaza after the Great Omari Mosque. Its loss represents a significant blow to Gaza's Islamic architectural heritage and the cultural identity of the Shuja'iyya community.",
  //   verifiedBy: ["UNESCO", "Heritage for Peace"],
  //   sources: [
  //     {
  //       organization: "UNESCO",
  //       title: "Preliminary Damage Assessment of Cultural Sites in Gaza",
  //       url: "https://www.unesco.org/en/gaza/assessment",
  //       date: "2024-05-28",
  //       type: "official",
  //     },
  //     {
  //       organization: "Middle East Monitor",
  //       title: "Israel destroys second largest historical mosque in Gaza",
  //       url: "https://www.middleeastmonitor.com/20240704-israel-destroys-second-largest-historical-mosque-in-gaza/",
  //       date: "2024-07-04",
  //       type: "journalism",
  //     },
  //   ],
  // },
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
    lastUpdated: "2024-05-27", // Based on UNESCO assessment date
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
    coordinates: [31.5333, 34.5],
    status: "destroyed",
    dateDestroyed: "2023-11-20", // Estimated November 2023
    dateDestroyedIslamic: "7 Jumada al-Ula 1445 AH", // Manually verified with Islamic calendar converter
    lastUpdated: "2024-05-27", // Based on UNESCO assessment date
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
    lastUpdated: "2024-05-27", // Based on UNESCO assessment date
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
    lastUpdated: "2024-05-27", // Based on UNESCO assessment date
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
    lastUpdated: "2024-05-27", // Based on UNESCO assessment date
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
    lastUpdated: "2024-05-27", // Based on UNESCO assessment date
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
    lastUpdated: "2024-05-27", // Based on UNESCO assessment date
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
    lastUpdated: "2024-05-27", // Based on UNESCO assessment date
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
    lastUpdated: "2024-05-27", // Based on UNESCO assessment date
    description:
      "One of the oldest and largest monasteries in the Middle East, founded around 340 CE by Saint Hilarion, a native of Gaza and key figure in Palestinian monasticism. The archaeological site at Tell Umm el-'Amr spans a large area with intricate Byzantine-era mosaics and church ruins.",
    historicalSignificance:
      "Founded by Saint Hilarion, considered one of the fathers of Palestinian monasticism. The monastery was a major center of early Christian monastic life and represents 1,700 years of continuous religious heritage. The site contains exceptional Byzantine architecture and mosaics documenting early Christian presence in Gaza.",
    culturalValue:
      "UNESCO granted enhanced protection (highest level of immunity) in December 2023, followed by World Heritage in Danger status in July 2024. The monastery's surrounding areas sustained damage including roads and infrastructure, threatening this irreplaceable archaeological treasure. The site features extensive Byzantine mosaics and architectural remains.",
    verifiedBy: ["UNESCO", "British Council", "Aliph Foundation"],
    // Images need to be sourced with proper attribution
    // images: {
    //   before: {
    //     url: "/images/saint-hilarion-before.jpg",
    //     credit: "Photographer Name / Organization",
    //     license: "CC BY-SA 4.0",
    //   },
    // },
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
    lastUpdated: "2024-05-27", // Based on UNESCO assessment date
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
    // images: {
    //   before: {
    //     url: "/images/ard-al-moharbeen-before.jpg",
    //     credit: "Photographer Name / Organization",
    //     license: "CC BY-SA 4.0",
    //   },
    //   satellite: {
    //     url: "/images/ard-al-moharbeen-satellite.jpg",
    //     credit: "Photographer Name / Organization",
    //     license: "CC BY-SA 4.0",
    //   },
    // },
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
    lastUpdated: "2024-05-27", // Based on UNESCO assessment date
    description:
      "A national museum housed within Al-Israa University, containing more than 3,000 rare archaeological artifacts spanning Gaza's history. The university was the last remaining higher education institution in Gaza when it was destroyed. Before demolition, occupying forces looted the museum's entire collection of artifacts.",
    historicalSignificance:
      "Al-Israa University was established in 2014 and became a center for higher education in southern Gaza. Its museum represented an important repository of Palestinian cultural heritage, documenting Gaza's archaeological and historical legacy. The university's destruction marked the complete elimination of all universities in Gaza.",
    culturalValue:
      "The museum's 3,000+ artifacts were looted by Israeli forces before the university building was demolished by explosives on January 17, 2024, after 70 days of occupation. University vice president Ahmed Alhussaina stated that such widespread destruction represents a deliberate act aimed at erasing Palestinian cultural memory and archaeological heritage. The loss includes irreplaceable historical artifacts and educational resources.",
    verifiedBy: ["PEN America", "Al-Israa University"],
    // Images need to be sourced with proper attribution
    // images: {
    //   before: {
    //     url: "/images/israa-university-before.jpg",
    //     credit: "Photographer Name / Organization",
    //     license: "CC BY-SA 4.0",
    //   },
    //   after: {
    //     url: "/images/israa-university-after.jpg",
    //     credit: "Photographer Name / Organization",
    //     license: "CC BY-SA 4.0",
    //   },
    // },
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
    lastUpdated: "2024-05-27", // Based on UNESCO assessment date
    description:
      "A museum in Rafah housing a 30-year collection of ancient coins, copper plates, jewelry, and archaeological artifacts from southern Gaza. The museum served as an important cultural institution documenting the heritage of the Rafah region.",
    historicalSignificance:
      "The Rafah Museum preserved archaeological evidence of southern Gaza's history, with collections spanning thousands of years. It was particularly important for communities in the southernmost part of the Gaza Strip.",
    culturalValue:
      "The museum was destroyed on October 11, 2023, just days after the conflict began. The loss of its 30-year collection, including rare coins, ancient jewelry, and copper artifacts, represents an irreplaceable loss to understanding Rafah's archaeological heritage.",
    verifiedBy: ["UNESCO", "Heritage for Peace"],
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
    lastUpdated: "2024-05-27", // Based on UNESCO assessment date
    description:
      "An ancient mosque in Jabaliya with 7th-century origins, representing one of the oldest Islamic religious structures in northern Gaza. The mosque served as a central place of worship for the Jabaliya community.",
    historicalSignificance:
      "With foundations dating to the early Islamic period, the Omari Mosque of Jabaliya represented over 1,400 years of continuous Islamic worship and community gathering in northern Gaza.",
    culturalValue:
      "The mosque was completely obliterated in late October 2023, as documented by Heritage for Peace. Its destruction represents the loss of a major religious and cultural landmark for the Jabaliya refugee camp community.",
    verifiedBy: ["UNESCO", "Heritage for Peace"],
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
    lastUpdated: "2024-05-27", // Based on UNESCO assessment date
    description:
      "A 17th-century Ottoman residential palace built in 1661, representing traditional Ottoman domestic architecture in Gaza. The palace featured distinctive stonework, vaulted rooms, and traditional courtyard design.",
    historicalSignificance:
      "Built during the Ottoman period, Al-Saqqa Palace is one of the oldest surviving residential structures in Gaza City, documenting over 360 years of urban architectural history and Ottoman building traditions.",
    culturalValue:
      "The palace represents an important example of Ottoman domestic architecture and social organization. Its damage threatens the preservation of traditional building techniques and historical residential patterns in old Gaza.",
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
    lastUpdated: "2024-05-27", // Based on UNESCO assessment date
    description:
      "A historic 19th-century house in Gaza City that was repurposed as the Goethe Institute cultural center. The building represented traditional Gazan residential architecture and served as a hub for German-Palestinian cultural exchange.",
    historicalSignificance:
      "The house is approximately 200 years old and represents traditional 19th-century Palestinian architecture. Its use as the Goethe Institute made it an important site for international cultural dialogue and educational programs.",
    culturalValue:
      "The building served dual significance: as a historic architectural monument and as an active cultural institution promoting arts, language, and cross-cultural understanding. Its damage impacts both heritage preservation and contemporary cultural programming.",
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
    lastUpdated: "2024-05-27", // Based on UNESCO assessment date
    description:
      "A historic covered market dating to the Mamluk period (14th century), featuring traditional vaulted stone architecture. The market was a central commercial hub in Gaza's old city, with shops selling traditional crafts, textiles, and goods.",
    historicalSignificance:
      "Al-Qissariya Market represents over 600 years of continuous commercial activity in Gaza City. The name 'Qissariya' derives from the Arabic term for covered markets, reflecting Byzantine and Islamic trading traditions.",
    culturalValue:
      "The market was not only an architectural monument but a living cultural space where traditional crafts, commerce, and social interaction continued for centuries. Its destruction represents the loss of both physical heritage and intangible cultural practices.",
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
    lastUpdated: "2024-05-27", // Based on UNESCO assessment date
    description:
      "A Commonwealth War Graves Commission cemetery containing the graves of soldiers from World War I and II, primarily from the British Empire forces. The cemetery includes over 3,200 burials and commemorates those who died in the Palestine campaigns.",
    historicalSignificance:
      "Established in 1917 following World War I battles in Gaza, the cemetery is an important memorial to soldiers from multiple nations who died during the Palestine campaigns. It represents a significant site of international war remembrance.",
    culturalValue:
      "The cemetery is protected under international law as a war grave site. Damage to the cemetery affects graves of soldiers from the UK, Australia, New Zealand, India, and other Commonwealth nations, impacting international heritage and remembrance.",
    verifiedBy: ["UNESCO", "Commonwealth War Graves Commission"],
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
    lastUpdated: "2024-05-27", // Based on UNESCO assessment date
    description:
      "A small museum housed within a hotel in northern Gaza, established in 2008. The museum contained local archaeological artifacts and cultural objects documenting Gaza's heritage.",
    historicalSignificance:
      "Though established relatively recently, the museum served an important educational role in northern Gaza, providing public access to archaeological and cultural heritage.",
    culturalValue:
      "The museum's damage on November 3, 2023, represents the loss of both the collection and a community cultural resource. Small regional museums like this are crucial for local heritage education and community identity.",
    verifiedBy: ["Heritage for Peace"],
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
    lastUpdated: "2024-05-27", // Based on UNESCO assessment date
    description:
      "A regional museum in Deir al-Balah, central Gaza, housing archaeological artifacts from the surrounding area including pottery, ancient tools, and historical objects documenting local heritage.",
    historicalSignificance:
      "The museum served the central Gaza region, preserving and exhibiting archaeological finds from Deir al-Balah and nearby areas, some dating back thousands of years to Bronze Age and Iron Age settlements.",
    culturalValue:
      "The museum's damage represents the loss of irreplaceable regional artifacts and an important cultural institution for central Gaza communities. Its collections provided crucial links to understanding the area's ancient history.",
    verifiedBy: ["Heritage for Peace", "UNESCO"],
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
    lastUpdated: "2024-05-27", // Based on UNESCO assessment date
    description:
      "An Iron Age archaeological site in southern Gaza dating from 1200-500 BCE. The tell (ancient settlement mound) contains evidence of Philistine and later period occupation, with pottery, tools, and architectural remains.",
    historicalSignificance:
      "Tell Ruqeish provides crucial evidence of Iron Age settlement patterns in southern Gaza. The site helps document the Philistine period and subsequent cultural transitions in the region during the first millennium BCE.",
    culturalValue:
      "The site was subject to maritime archaeological survey by the Honor Frost Foundation in 2022. Damage to Tell Ruqeish impacts our understanding of ancient Gaza's coastal settlements and Iron Age cultural development.",
    verifiedBy: ["Heritage for Peace", "Forensic Architecture"],
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
    lastUpdated: "2024-05-27", // Based on UNESCO assessment date
    description:
      "A beloved community bookshop in Gaza City, restored and reopened in 2021 after previous destruction. The bookshop served as a cultural hub, providing books, educational materials, and a gathering space for Gaza's literary community.",
    historicalSignificance:
      "The bookshop was previously destroyed in 2021 and painstakingly restored by owner Samir Mansour with community support. Its reopening represented resilience and the importance of literacy and culture in Gaza.",
    culturalValue:
      "The destruction of Samir Mansour Bookshop for a second time in October 2023 represents not only the loss of thousands of books and educational resources, but the erasure of a vital community cultural space and symbol of resilience.",
    verifiedBy: ["Heritage for Peace"],
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
    lastUpdated: "2024-05-27", // Based on UNESCO assessment date
    description:
      "An Ottoman-era domed building housing a manuscript center with rare Islamic texts and historical documents. The center specialized in the preservation and study of Arabic manuscripts and historical records.",
    historicalSignificance:
      "The building dates to the Ottoman period and served as an important repository for Islamic scholarship and historical documentation. The manuscript center preserved rare texts crucial for understanding regional intellectual history.",
    culturalValue:
      "The destruction of Dar As-Sa'ada resulted in the loss of irreplaceable manuscripts, historical documents, and scholarly texts. UNESCO verified this site as one of the damaged cultural properties in Gaza.",
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
    lastUpdated: "2024-05-27", // Based on UNESCO assessment date
    description:
      "A historic Ottoman-era building in Gaza City's old quarter, representing traditional Palestinian architecture and urban design from the Ottoman period.",
    historicalSignificance:
      "The building exemplifies Ottoman-period construction techniques and architectural styles in Gaza. It forms part of the historic fabric of Gaza City's old town.",
    culturalValue:
      "Subat Al-Alami is one of several historic buildings that collectively document Gaza's Ottoman heritage. Its damage contributes to the degradation of the old city's historic character and architectural continuity.",
    verifiedBy: ["UNESCO"],
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
    lastUpdated: "2024-05-27", // Based on UNESCO assessment date
    description:
      "A historic Ottoman-era sabil (public water fountain), representing traditional Islamic charitable architecture. Sabils were public fountains providing free water to travelers and residents, embodying Islamic principles of charity and community service.",
    historicalSignificance:
      "Sabils were important features of Islamic cities, demonstrating architectural beauty combined with social welfare. This sabil represents Ottoman-era urban planning and the tradition of waqf (charitable endowment) in Gaza.",
    culturalValue:
      "The sabil is both an architectural monument and a symbol of communal care and Islamic urban traditions. Its damage threatens the preservation of this unique type of Ottoman public architecture.",
    verifiedBy: ["UNESCO"],
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
    lastUpdated: "2024-05-27", // Based on UNESCO assessment date
    description:
      "A 19th-century historic house in Gaza City representing traditional Palestinian residential architecture. The house features characteristic stonework, arched windows, and courtyard design typical of upper-class Gaza homes.",
    historicalSignificance:
      "The Khader Tarazi House is approximately 150-200 years old and represents the architectural heritage of Gaza's notable families. It exemplifies traditional building techniques and social organization of 19th-century Gaza.",
    culturalValue:
      "Historic houses like this are crucial for understanding daily life, social structures, and architectural evolution in Ottoman and late Ottoman-period Gaza. The building's damage threatens preservation of traditional domestic architecture.",
    verifiedBy: ["UNESCO"],
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
    lastUpdated: "2024-05-27", // Based on UNESCO assessment date
    description:
      "A government storage facility in the Sheikh Radwan neighborhood housing archaeological artifacts and antiquities pending study, conservation, or museum display. The facility contained objects from various excavations across Gaza.",
    historicalSignificance:
      "The facility served as a central repository for Gaza's archaeological collections, containing artifacts from multiple periods and sites. It was crucial infrastructure for heritage management and archaeological research.",
    culturalValue:
      "The destruction of the storage facility on October 25, 2023, represents catastrophic loss of unstudied and uncatalogued artifacts. Many objects in storage had not yet been fully documented, photographed, or researched, making this loss especially devastating for Gaza's archaeology.",
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
    lastUpdated: "2024-05-27", // Based on UNESCO assessment date
    description:
      "A Mamluk-era mosque in Gaza City dating to the 13th or 14th century, featuring traditional Mamluk architectural elements including stonework and arched prayer halls.",
    historicalSignificance:
      "The mosque represents Mamluk architectural heritage in Gaza, a period of significant cultural and architectural development. Mamluk mosques are characterized by distinctive architectural features and stone craftsmanship.",
    culturalValue:
      "Zofor Domri Mosque is one of several important Mamluk-period religious structures in Gaza. Its damage contributes to the erosion of Gaza's medieval Islamic architectural heritage.",
    verifiedBy: ["UNESCO"],
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
    lastUpdated: "2024-05-27", // Based on UNESCO assessment date
    description:
      "A cultural museum in Khan Younis housing collections of traditional crafts, historical artifacts, and cultural objects documenting southern Gaza's heritage and Bedouin traditions.",
    historicalSignificance:
      "The Akkad Museum served the Khan Younis region, preserving and presenting the cultural heritage of southern Gaza, including Bedouin material culture and traditional crafts unique to the area.",
    culturalValue:
      "The museum's destruction in January 2024 represents the loss of important collections documenting southern Gaza's distinct cultural traditions, including textiles, jewelry, household items, and agricultural tools specific to the region.",
    verifiedBy: ["Heritage for Peace"],
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
    lastUpdated: "2024-05-27", // Based on UNESCO assessment date
    description:
      "A contemporary art center established in 2010, dedicated to promoting Palestinian contemporary art, providing exhibition space, artist residencies, and cultural programming for Gaza's artistic community.",
    historicalSignificance:
      "Shababeek Center was one of Gaza's few dedicated contemporary art spaces, serving as a crucial platform for emerging and established Palestinian artists to create, exhibit, and engage with international art networks.",
    culturalValue:
      "The center's destruction represents the loss not only of a physical space but of a vital cultural institution supporting living artistic practice. The loss impacts Gaza's contemporary cultural production and artists' ability to sustain creative work.",
    verifiedBy: ["Heritage for Peace"],
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
    lastUpdated: "2024-05-27", // Based on UNESCO assessment date
    description:
      "An early 20th-century historic building near the former railway station in Gaza City. The house represents the architectural style of the late Ottoman and British Mandate periods.",
    historicalSignificance:
      "Al-Mahatta House is associated with Gaza's railway era, when the city was connected by rail to Egypt and the broader region. The building documents early 20th-century urban development and architectural transitions.",
    culturalValue:
      "The house is one of fewer surviving examples of early 20th-century architecture in Gaza, representing a transitional period between Ottoman and Mandate-era building styles. Its damage threatens preservation of this architectural period.",
    verifiedBy: ["Heritage for Peace"],
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
    lastUpdated: "2024-05-27", // Based on UNESCO assessment date
    description:
      "A Mamluk-era mosque dating to the 14th century, named after the Ottoman administrative position of Katib Wilaya (provincial secretary). The mosque features characteristic Mamluk stonework and architectural details.",
    historicalSignificance:
      "The mosque represents over 600 years of Islamic heritage in Gaza and exemplifies Mamluk religious architecture. Its name reflects the Ottoman administrative system that governed Gaza for centuries.",
    culturalValue:
      "Katib Wilaya Mosque is one of Gaza's important medieval mosques, contributing to the historic character of Gaza City's old quarter. Its heavy damage threatens the preservation of Mamluk architectural heritage.",
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
    lastUpdated: "2024-05-27", // Based on UNESCO assessment date
    description:
      "A community cultural center in the Al-Zeitoun neighborhood of Gaza City, established in 1995. The center provided library services, cultural programming, and educational activities for the local community.",
    historicalSignificance:
      "The center served the Al-Zeitoun neighborhood for nearly 30 years, providing cultural and educational resources to one of Gaza City's most populous areas.",
    culturalValue:
      "Al-Zeitoun Cultural Center's destruction early in the conflict represents the loss of an important community institution that fostered education, literacy, and cultural engagement in eastern Gaza City.",
    verifiedBy: ["Heritage for Peace"],
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
    lastUpdated: "2024-05-27", // Based on UNESCO assessment date
    description:
      "A historic 19th-century house belonging to the prominent Al-Shawa family, one of Gaza's most notable families. The house represents traditional Palestinian elite residential architecture.",
    historicalSignificance:
      "The Al-Shawa family produced several mayors of Gaza and prominent public figures. The house documents the architectural and social history of Gaza's leading families during the Ottoman and British Mandate periods.",
    culturalValue:
      "As one of the historic family residences of Gaza's elite, the house is architecturally and historically significant. Its damage threatens preservation of 19th-century upper-class domestic architecture and the material heritage of Gaza's notable families.",
    verifiedBy: ["Heritage for Peace"],
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
    lastUpdated: "2024-05-27", // Based on UNESCO assessment date
    description:
      "A British Mandate-era courthouse built in the 1930s, representing colonial administrative architecture in Gaza. The building features Mandate-period architectural style with characteristic arched windows and stone facades.",
    historicalSignificance:
      "Built during the British Mandate (1920-1948), the courthouse represents the legal and administrative infrastructure of that period. It documents the transition from Ottoman to British to Palestinian governance in Gaza.",
    culturalValue:
      "The courthouse is one of few remaining examples of British Mandate architecture in Gaza. Its damage threatens preservation of this distinct architectural period and its role in Gaza's modern legal and administrative history.",
    verifiedBy: ["Heritage for Peace"],
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
    lastUpdated: "2024-05-27", // Based on UNESCO assessment date
    description:
      "The historic old market of Khan Yunis, dating to the Ottoman period. The market featured traditional covered stalls, stone archways, and commercial buildings serving the southern Gaza region for centuries.",
    historicalSignificance:
      "Khan Yunis was established as a caravanserai (khan) during the Mamluk period and grew into a major town. The old market represents centuries of commercial activity and traditional trading practices in southern Gaza.",
    culturalValue:
      "The market was not only a historic architectural ensemble but a living cultural space where traditional commerce, crafts, and social interaction continued. Its heavy damage represents both architectural loss and the disruption of intangible cultural practices.",
    verifiedBy: ["Heritage for Peace"],
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
    lastUpdated: "2024-05-27", // Based on UNESCO assessment date
    description:
      "A historic Islamic cemetery dating from the 15th century, named after Sheikh Radwan, a revered Islamic scholar and saint. The cemetery contains historic graves, tombs, and mausoleums of important religious and community figures.",
    historicalSignificance:
      "The cemetery honors Sheikh Radwan, after whom the entire neighborhood is named. It serves as a burial site for generations of Gaza's families and contains tombs of notable scholars, community leaders, and ordinary residents spanning over 500 years.",
    culturalValue:
      "Historic cemeteries are important cultural heritage sites preserving genealogical records, funerary architecture, and community memory. Damage to Sheikh Radwan Cemetery threatens both physical monuments and the continuity of cultural and familial connections.",
    verifiedBy: ["Heritage for Peace"],
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
    lastUpdated: "2024-05-27", // Based on UNESCO assessment date
    description:
      "Al-Muntar Hill is an ancient tell (settlement mound) with archaeological layers spanning thousands of years. Napoleon Bonaparte's forces fortified the hilltop during the 1799 Gaza campaign. The site offers strategic views over Gaza and has been continuously significant from ancient to modern times.",
    historicalSignificance:
      "The site combines ancient archaeological value with Napoleonic military history. Napoleon used this strategic position during his Egyptian and Syrian campaigns. The tell contains archaeological evidence from multiple periods of Gaza's history.",
    culturalValue:
      "Al-Muntar Hill represents both archaeological heritage (ancient settlement layers) and modern historical significance (Napoleonic fortifications). Damage to the site affects understanding of Gaza's long history from antiquity through the Napoleonic era.",
    verifiedBy: ["Heritage for Peace"],
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
    lastUpdated: "2024-05-27", // Based on UNESCO assessment date
    description:
      "A historic Mamluk-era mosque dating to the 13th century, located in Gaza City's old quarter. The mosque featured traditional Mamluk architectural elements including intricate stonework and vaulted prayer halls.",
    historicalSignificance:
      "Al-Katib Mosque represents over 700 years of Islamic worship in Gaza. The mosque is named after 'Katib' (scribe), reflecting the historical importance of literacy and scholarship in Islamic culture.",
    culturalValue:
      "The mosque's destruction represents the loss of significant Mamluk religious architecture and a community worship space that served Gaza's residents for seven centuries. It was one of several important medieval mosques in Gaza's historic core.",
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
        date: "2023-12-08",
        type: "documentation",
      },
    ],
  },
];
