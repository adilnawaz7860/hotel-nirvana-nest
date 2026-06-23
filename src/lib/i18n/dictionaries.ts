export const LOCALES = ["en", "hi"] as const;
export type Locale = (typeof LOCALES)[number];

export const dictionaries = {
  en: {
    nav: {
      home: "Home",
      rooms: "Rooms",
      restaurant: "Restaurant",
      gallery: "Gallery",
      about: "About",
      contact: "Contact",
      reviews: "Reviews",
      faq: "FAQ",
      bookNow: "Book Now",
      login: "Login",
      register: "Register",
      dashboard: "Dashboard",
      logout: "Logout",
    },
    hero: {
      eyebrow: "Gomti Nagar, Lucknow",
      title: "An Address of Quiet Luxury",
      subtitle:
        "Discover refined rooms, attentive service and a celebrated restaurant at Hotel Nirvana Nest.",
      checkIn: "Check-In",
      checkOut: "Check-Out",
      guests: "Guests",
      checkAvailability: "Check Availability",
    },
    footer: {
      address: "Address",
      contact: "Contact",
      quickLinks: "Quick Links",
      followUs: "Follow Us",
      rights: "All rights reserved.",
    },
    common: {
      viewAll: "View All",
      bookNow: "Book Now",
      learnMore: "Learn More",
      perNight: "/ night",
      loading: "Loading...",
    },
  },
  hi: {
    nav: {
      home: "होम",
      rooms: "कमरे",
      restaurant: "रेस्टोरेंट",
      gallery: "गैलरी",
      about: "हमारे बारे में",
      contact: "संपर्क करें",
      reviews: "रिव्यूज़",
      faq: "सामान्य प्रश्न",
      bookNow: "बुक करें",
      login: "लॉगिन",
      register: "रजिस्टर करें",
      dashboard: "डैशबोर्ड",
      logout: "लॉगआउट",
    },
    hero: {
      eyebrow: "गोमती नगर, लखनऊ",
      title: "शांत विलासिता का एक पता",
      subtitle:
        "होटल निर्वाण नेस्ट में उत्कृष्ट कमरे, आत्मीय सेवा और प्रसिद्ध रेस्टोरेंट का अनुभव करें।",
      checkIn: "चेक-इन",
      checkOut: "चेक-आउट",
      guests: "मेहमान",
      checkAvailability: "उपलब्धता देखें",
    },
    footer: {
      address: "पता",
      contact: "संपर्क",
      quickLinks: "क्विक लिंक्स",
      followUs: "हमें फॉलो करें",
      rights: "सर्वाधिकार सुरक्षित।",
    },
    common: {
      viewAll: "सभी देखें",
      bookNow: "बुक करें",
      learnMore: "अधिक जानें",
      perNight: "/ रात",
      loading: "लोड हो रहा है...",
    },
  },
} as const;

export type Dictionary = typeof dictionaries.en;
