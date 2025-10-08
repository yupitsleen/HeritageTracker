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
];
