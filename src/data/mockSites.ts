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
    coordinates: [31.5069, 34.4668], // Gaza City [lat, lng]
    status: "destroyed",
    dateDestroyed: "2023-12-07",
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
    coordinates: [31.5203, 34.4547], // [lat, lng]
    status: "heavily-damaged",
    dateDestroyed: "2023-10-19",
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
    coordinates: [31.2656, 34.2945], // [lat, lng]
    status: "destroyed",
    dateDestroyed: "2024-01-15",
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
];
