const ha = {
  common: {
    appName: "Secure Ballot",
    tagline: "Dandamali na Zabe mai Kariya na Najeriya",
    loading: "Ana lodi...",
    error: "An sami kuskure",
    success: "Nasara",
    cancel: "Soke",
    save: "Ajiye",
    confirm: "Tabbatar",
    back: "Koma",
    next: "Na gaba",
    submit: "Aika",
    continue: "Ci gaba",
    search: "Bincika",
    filter: "Tace",
    sort: "Tsara",
    all: "Duka",
    none: "Babu",
    select: "Zaɓi",
    edit: "Gyara",
    delete: "Share",
    create: "Ƙirƙiri",
    update: "Sabunta",
    view: "Duba",
    close: "Rufe",
  },
  nav: {
    home: "Gida",
    about: "Game da mu",
    faq: "Tambayoyi",
    contact: "Tuntuɓi mu",
    login: "Shiga",
    register: "Yi rijista",
    dashboard: "Dashbod",
    results: "Sakamakon",
    vote: "Kada kuri'a",
    profile: "Bayani",
    settings: "Saituna",
    logout: "Fita",
  },
  home: {
    title: "Secure Ballot",
    subtitle: "Tsarin Zabe Mafi Aminci da Gaskiya a Najeriya",
    description:
      "Ƙarfafa dimokuradiyya ta hanyar zabe na dijital mai tsaro, gaskiya, da sauƙi ga Zaɓen Najeriya na 2027.",
    cta: {
      login: "Shiga don Kada Kuri'a",
      learnMore: "Ƙara Koyo",
      viewResults: "Duba Sakamakon Kai Tsaye",
    },
    features: {
      title: "Me ya sa za ka zaɓi Secure Ballot",
      security: {
        title: "Tsaro na Musamman",
        description: "An kare kuri'arka da tsarin ɓoye bayanai na soja da tabbatar da gaskiya ta hanyoyi da yawa.",
      },
      transparency: {
        title: "Cikakken Gaskiya",
        description:
          "Sakamakon nan take da lissafin bayanai marasa iya canzawa suna tabbatar da tsari mai adalci da buɗewa.",
      },
      accessibility: {
        title: "Sauƙi ga Kowa",
        description: "Kada kuri'a daga ko'ina da akwai intanet, tare da goyon baya ga duk manyan harsunan Najeriya.",
      },
      integrity: {
        title: "Tabbataccen Gaskiya",
        description: "Fasahar blockchain tana tabbatar da cewa ba za a iya canza ko wasa da kuri'unku ba.",
      },
    },
    countdown: {
      title: "Ƙidayar Zaɓe",
      days: "Kwanaki",
      hours: "Sa'o'i",
      minutes: "Mintoci",
      seconds: "Dakikoki",
      until: "kafin fara jefa kuri'a",
    },
    stats: {
      title: "Bayanai na Zaɓe",
      registeredVoters: "Masu Iya Kada Kuri'a",
      pollingUnits: "Wuraren Kada Kuri'a",
      constituencies: "Yankunan Zaɓe",
      states: "Jihohi + FCT",
    },
    elections: {
      title: "Zaɓi Zaɓenka",
      presidential: {
        title: "Zaɓen Shugaban Kasa",
        description: "Zaɓi shugaban kasa na gaba na Najeriya",
      },
      gubernatorial: {
        title: "Zaɓen Gwamna",
        description: "Zaɓi gwamnan jiharku",
      },
      houseOfReps: {
        title: "Zaɓen Majalisar Wakilai",
        description: "Zaɓi wakilin yankinku",
      },
      senatorial: {
        title: "Zaɓen Sanata",
        description: "Zaɓi sanatan jiharku",
      },
      votingPeriod: "Lokacin zaɓe: sati 3",
      voteNow: "Zaɓa Yanzu",
    },
    monitoring: {
      title: "Lura da Zaɓe na Lokaci-Lokaci",
      viewDetails: "Duba Cikakken Bayanai",
    },
    testimonials: {
      title: "An Amince da shi Daga Masana & Shugabanni",
      subtitle:
        "Duba abin da masanan tsaro na samar da bayanai da masu zabe masu matsayi suke cewa game da Secure Ballot.",
    },
    security: {
      title: "Tsaro na Matakin Kamfani",
      subtitle:
        "An kare zaɓenku da tabbatarwa ta hanyoyi da yawa, rufe bayanai daga farko zuwa karshe, da lissafin ayyuka masu kariya daga lalata.",
      mfa: {
        title: "Tabbatarwa ta Hanyoyi da Yawa",
        description: "Kare bayananku da NIN, VIN, da tabbatarwar OTP kafin zaɓa.",
      },
      encryption: {
        title: "Rufe Bayanai daga Farko zuwa Karshe",
        description: "An rufe duk bayanan da ECC & AES-256, tabbatar da zaɓenku ya kasance na sirri.",
      },
      auditLogs: {
        title: "Lissafin Ayyuka masu Kariya daga Lalata",
        description:
          "Kowane mataki na zaɓe an adana shi cikin tsaro kuma ba za a iya canza shi ba, tabbatar da gaskiyar zaɓe.",
      },
    },
  },
  login: {
    title: "Shiga don Zaɓa",
    subtitle: {
      credentials: "Shigar da NIN da VIN don tabbatar da kai",
      otp: "Shigar da OTP da aka aika zuwa wayarka da aka yi rajista",
    },
    nin: {
      label: "Lambar Katin Shaida na Kasa (NIN)",
      placeholder: "Shigar da NIN naka na lambobi 11",
      error: "NIN dole ne ya kasance lambobi 11",
    },
    vin: {
      label: "Lambar Katin Zaɓe (VIN)",
      placeholder: "Shigar da VIN naka na haruffa 19",
      error: "VIN dole ne ya kasance haruffa 19",
    },
    otp: {
      label: "Kalmar Wucewa ta Sau Daya (OTP)",
      placeholder: "Shigar da OTP na lambobi 6",
      help: "Shigar da lambar da aka aika zuwa wayarka da aka yi rajista",
      error: "OTP dole ne ya kasance lambobi 6",
      resend: "Sake aika OTP",
    },
    buttons: {
      continue: "Ci gaba",
      verify: "Tabbatar & Ci gaba",
    },
    userId: {
      title: "Lambar Asusunka",
      description: "Da fatan za a adana wannan lambar don amfani gaba. Za ka bukata idan ka tuntuɓi agajin mu.",
      notice: "Wannan sakon zai ɓace bayan 'yan dakika",
    },
    terms: "Ta ci gaba, ka amince da Ka'idojin Aiki na Secure Ballot da Manufar Sirri.",
  },
  dashboard: {
    welcome: "Barka da dawo",
    overview: "Takaitawa",
    candidates: "Takarar",
    statistics: "Bayanai",
    map: "Taswirar Zaɓe",
    back: "Koma Dashbod",
    totalVotes: "Jimlar Kuri'un da aka Jefa",
    voterTurnout: "Masu Zuwa Kada Kuri'a",
    statesReporting: "Jihohin da suka Bayar da Rahoto",
    timeRemaining: "Lokacin da ya Rage",
    leadingCandidate: "Jagoran Takarar",
    voteDistribution: "Rarraba Kuri'un",
    percentageBreakdown: "Kashi Cikin Dari",
    liveUpdates: "Sabuntawa na Kai Tsaye",
    votedElections: "Ka riga ka kada kuri'a a wannan zaɓen",
    selectCandidate: "Zaɓi dan takarar da za ka ba wa kuri'arka",
    voteCast: "An Jefa Kuri'a",
    confirmVote: "Tabbatar da Kuri'arka",
    confirmVoteDescription: "Kana gab da jefa kuri'arka. Ba za a iya canza wannan aiki ba.",
    cancel: "Soke",
    processing: "Ana aiwatarwa...",
    voteSuccess: "An Jefa Kuri'a Cikin Nasara",
    voteSuccessDescription: "An adana kuri'arka cikin tsaro. Mun gode da shiga zaɓen.",
    continue: "Ci gaba",
  },
  settings: {
    title: "Saituna",
    subtitle: "Sarrafa zaɓuɓɓukan asusunka da saituna na manhaja",
    tabs: {
      general: "Na Gaba",
      notifications: "Sanerwa",
      accessibility: "Sauƙin Shiga",
      privacy: "Sirri",
      language: "Harshe",
    },
    general: {
      title: "Saituna na Gaba",
      description: "Sarrafa asusunka na asali da zaɓuɓɓukan manhaja",
      language: {
        label: "Harshe",
        help: "Zaɓi harshen da kake so don fuskar manhaja",
      },
      theme: {
        label: "Jigo",
        light: "Haske",
        dark: "Duhu",
        system: "Na'urar",
      },
      timeZone: {
        label: "Lokacin Yanki",
        help: "Saita lokacin yankinku don nuna lokaci daidai",
      },
      updates: {
        label: "Sabuntawa na Atomatik",
        help: "Karɓi sabbin fasaloli da ingantattun tsaro kai tsaye",
      },
    },
    language: {
      title: "Saituna na Harshe",
      description: "Zaɓi harshen da kake so don manhaja",
      selectLanguage: "Zaɓi harshe",
      languageChanged: "An canza harshe cikin nasara",
    },
  },
  ai: {
    title: "Jagoran Secure Ballot",
    greeting:
      "Sannu! Ni ne Jagoran Secure Ballot, mataimakinka na AI. Yaya zan taimaka maka game da tsarin jefa kuri'a yau?",
    status: {
      online: "Yana kan layi",
      typing: "Yana rubutu...",
    },
    inputPlaceholder: "Tambaye kowane tambaya...",
    fallbackResponse:
      "Ban da bayani na musamman game da wannan ba, amma zan iya taimaka maka da tambayoyi game da tsarin jefa kuri'a, matakan tsaro, bayani game da 'yan takarar, da kuma taimako na fasaha. Don Allah za ka iya sake tambayarka?",
    suggestedQuestions: {
      howToVote: "Yaya zan jefa kuri'a?",
      isVoteSecure: "Shin kuri'ata tana da tsaro?",
      whoCandidates: "Su wane ne 'yan takarar?",
      whenVoting: "Yaushe ne lokacin jefa kuri'a?",
      changeVote: "Zan iya canza kuri'ata?",
      countVotes: "Yaya ake ƙidaya kuri'un?",
    },
    keywords: {
      how: "yaya",
      vote: "kuri'a",
      voting: "jefa kuri'a",
      cast: "jefa",
      requirements: "bukatun",
      need: "bukata",
      eligible: "cancanta",
      eligibility: "cancanta",
      where: "ina",
      when: "yaushe",
      time: "lokaci",
      period: "lokaci",
      change: "canza",
      verify: "tabbatar",
      confirmation: "tabbatarwa",
      security: "tsaro",
      secure: "tsaro",
      safe: "aminci",
      encryption: "ɓoye bayanai",
      encrypted: "an ɓoye",
      authentication: "tabbatar da gaskiya",
      verifyIdentity: "tabbatar da bayani",
      privacy: "sirri",
      anonymous: "ɓoye suna",
      secret: "asiri",
      audit: "bincike",
      log: "lissafi",
      track: "bi sawu",
      protect: "kare",
      attack: "farmaki",
      hack: "haka",
      platform: "dandamali",
      system: "tsari",
      infrastructure: "kayan aiki",
      accessibility: "sauƙin shiga",
      accessible: "mai sauƙin shiga",
      disability: "nakasa",
      backup: "madadin ajiya",
      disaster: "bala'i",
      recovery: "dawo da",
      test: "gwaji",
      securityTest: "gwajin tsaro",
      count: "ƙidaya",
      counting: "ƙidaya",
      results: "sakamakon",
      announce: "sanarwa",
      officialResults: "sakamakon hukuma",
      dispute: "gardama",
      challenge: "kalubale",
      contest: "hamayya",
      candidate: "dan takara",
      candidates: "yan takara",
      who: "wane",
      compare: "kwatanta",
      comparison: "kwatantawa",
      party: "jam'iyya",
      parties: "jam'iyyun",
      contact: "tuntuɓi",
      support: "taimako",
      help: "taimako",
      issue: "matsala",
      problem: "matsala",
      trouble: "wahala",
      feedback: "ra'ayi",
      suggestion: "shawarwari",
    },
    knowledge: {
      voting: {
        process:
          "Don jefa kuri'a, kana buƙatar shiga da NIN da VIN naka, tabbatar da bayananka da OTP, sannan ka zaɓi dan takaran da kake so. Za a adana kuri'arka cikin tsaro da ɓoye.",
        requirements:
          "Kana buƙatar Lambar Bayani ta Ƙasa (NIN) da Lambar Bayani ta Mai Jefa Kuri'a (VIN) don jefa kuri'a. Waɗannan dole su dace da bayanai a cikin bayanin masu jefa kuri'a na ƙasa.",
        eligibility:
          "Don samun damar jefa kuri'a, dole ka kasance ɗan Najeriya, da shekarunka 18 ko fiye, kuma ka yi rijista da INEC (Hukumar Zaɓe Mai Zaman Kanta ta Ƙasa).",
        where:
          "Kana iya jefa kuri'a ta intanet ta wannan dandamali mai tsaro daga ko'ina da akwai intanet. Ana iya samun damar shiga dandamali 24/7 a lokacin zaɓen na mako 3.",
        when: "Lokacin jefa kuri'a yana ɗaukar mako 3, farawa daga ranar zaɓen ta hukuma. Kana iya jefa kuri'a a kowane lokaci a cikin wannan lokaci.",
        change:
          "Da zarar an aika kuri'arka, ba za a iya canza ta ba. Don Allah tabbatar ka gamsu da zaɓinka kafin ka aika.",
        verify:
          "Bayan jefa kuri'a, za ka sami lambar rasit na musamman. Kana iya amfani da wannan lambar don tabbatar an ƙidaya kuri'arka daidai ba tare da bayyana wa wa ka ba kuri'a ba.",
      },
      security: {
        overview:
          "Secure Ballot yana amfani da tabbatar da gaskiya ta hanyoyi da yawa, ɓoye bayanai na cikakke da ECC & AES-256, da lissafin bayanai marasa iya canzawa don tabbatar da kuri'arka tana da tsaro da sirri.",
        encryption:
          "An kare kuri'arka da ɓoye bayanai na cikakke yana amfani da Elliptic Curve Cryptography (ECC) da AES-256, matakin tsaro iri ɗaya da manyan bankunan kuɗi ke amfani da shi.",
        authentication:
          "Muna amfani da tabbatar da gaskiya ta hanyoyi da yawa ciki har da NIN naka, VIN, da kalmar wucewa ta sau ɗaya (OTP) da aka aika zuwa lambar wayarka da aka yi rijista don tabbatar da bayananka.",
        privacy:
          "Kuri'arka tana cikakken ɓoye. Yayin da tsarin ke tabbatar da cancantarka ta jefa kuri'a, yana raba bayananka daga kuri'arka ta gaske don kiyaye sirrin kuri'a.",
        audit:
          "Kowane aiki a cikin tsarin jefa kuri'a ana adana shi a cikin lissafin bayanai marasa iya canzawa yana amfani da fasahar blockchain, yana ba da damar tabbatar da gaskiyar zaɓe ba tare da raba sirrin mai jefa kuri'a ba.",
        protection:
          "An kare tsarin daga barazanar intanet iri-iri ciki har da hare-haren DDoS, SQL injection, da man-in-the-middle ta hanyar matakan tsaro da yawa.",
      },
      technical: {
        platform:
          "An gina Secure Ballot a kan tsarin girgije mai rarraba aiki tare da tsarin madadin don tabbatar da aiki 99.99% a lokacin zaɓe.",
        accessibility:
          "An tsara dandamali don samun damar shiga ga duk masu jefa kuri'a, har da waɗanda suke da nakasa, kuma yana aiki a kan na'urori iri-iri ciki har da wayoyin hannu, allunan kwamfuta, da kwamfutoci.",
        backup:
          "Tsarin madadin ajiya da yawa da tsarin dawo da aiki bayan bala'i suna tabbatar da cewa ba za a rasa kuri'un ba, ko da kuwa akwai matsalolin fasaha masu girma.",
        testing:
          "Tsarin yana shiga gwajin tsaro mai tsanani, ciki har da gwajin shiga na kamfanonin tsaro na musamman da gwajin tsaro na jama'a.",
      },
      results: {
        counting:
          "Ana ƙidaya kuri'un kai tsaye ta hanyar tsarin yayin da ake jefa su, tare da sabuntawa na nan take zuwa dashbod na sakamakon.",
        verification:
          "Ana iya tabbatar da sakamakon zaɓe ta hanyar tabbatarwa ta fasahar ɓoye bayanai da ke tabbatar da gaskiyar kuri'a ba tare da bayyana kuri'un kowa ba.",
        announcement:
          "Ana sanar da sakamakon hukuma bayan ƙarewar lokacin jefa kuri'a kuma duk kuri'un an tabbatar da su ta hanyar Hukumar Zaɓe Mai Zaman Kanta ta Ƙasa.",
        disputes:
          "Duk gardamar game da sakamakon zaɓe ana iya magance ta ta hanyoyin da Hukumar INEC ta tanada, tare da cikakken gaskiya na tsarin.",
      },
      candidates: {
        information:
          "Kana iya duba cikakken bayani game da duk 'yan takara ciki har da jam'iyyarsu, tarihinsu, da muhimman matsayin manufarsu a sashen 'Yan Takara.",
        comparison:
          "Dandamali yana ba da damar kwatanta 'yan takara gefen-da-gefen don taimaka maka yin yanke shawara mai ilimi kafin jefa kuri'a.",
        parties:
          "Manyan jam'iyyun da ke shiga zaɓen sun haɗa da APC, PDP, LP, NNPP, da sauransu, kowannensu da 'yan takarar musamman ga matsayin daban-daban.",
      },
      support: {
        contact:
          "Idan kana buƙatar taimako, kana iya tuntuɓar ƙungiyar tallafin mu ta shafin Tuntuɓi, ta imel a support@secureballot.ng, ko ta waya a 0800-VOTE-HELP.",
        issues:
          "Ana iya magance matsalolin da aka saba kamar manta VIN ko NIN ta hanyar ziyartar ofishin INEC mafi kusa da takardun shaida.",
        feedback:
          "Muna maraba da ra'ayoyinku game da ƙayataccen jefa kuri'a. Don Allah yi amfani da fom ɗin ra'ayi a sashen Tuntuɓi don raba tunaninka.",
      },
    },
  },
  realTimeMonitoring: {
    title: "Kulawa na Zaɓe na Nan Take",
    subtitle: "Kasance da bayani tare da sabuntawa na dakika-bayan-dakika na Zaɓen Najeriya na 2025",
    liveUpdates: "Sabuntawa na Kai Tsaye",
    liveData: "Bayanai na Kai Tsaye",
    lastUpdated: "An sabunta na ƙarshe",
    totalVotes: "Jimlar Kuri'un da aka Ƙidaya",
    voterTurnout: "masu zuwa jefa kuri'a",
    leadingParty: "Jam'iyyar da ke Gaba",
    pollingUnitsReporting: "Wuraren Jefa Kuri'a da ke Bayar da Rahoto",
    reported: "an bayar da rahoto",
    total: "jimla",
    viewDetailedStats: "Duba Cikakken Bayanai",
    usersMonitoring: "masu amfani suna kallon sakamakon kai tsaye",
    howItWorks: {
      title: "Yadda Tsarinmu na Nan Take ke Aiki",
      description:
        "Dandamalinmu na kulawa na zaɓe mai ci gaba yana bayar da sabuntawa nan take ta hanyar hanyar sadarwa mai tsaro, mai rarraba aiki na wuraren jefa kuri'a da aka tabbatar a duk Najeriya.",
      secureData: {
        title: "Isar da Bayanai Mai Tsaro",
        description:
          "Ana isar da sakamakon cikin tsaro daga wuraren jefa kuri'a ta hanyoyin sadarwa masu ɓoye, tabbatar da gaskiyar bayanai da kare su daga shiga.",
      },
      realTimeProcessing: {
        title: "Aiwatarwa na Nan Take",
        description:
          "Tsarinmu yana aiwatar da bayanai da ke shigowa cikin dakiku, sabunta ƙidayar kuri'un, kashi na masu zuwa jefa kuri'a, da 'yan takara da ke gaba a duk gasar.",
      },
      continuousUpdates: {
        title: "Sabuntawa Mai Ci Gaba",
        description:
          "Dashbod yana sabuntawa kai tsaye kowace dakika 60, tare da sabuntawa na hannu don samun sabuntawa nan take na jimlar kuri'un, masu zuwa jefa kuri'a, da sakamakon.",
      },
      verifiedResults: {
        title: "Sakamakon da aka Tabbatar",
        description:
          "Duk bayanai ana tabbatar da su ta hanyar tsarin tabbatarwa mai mataki da yawa kafin a nuna su, tabbatar da inganci da abin dogaro.",
      },
    },
  },
  languages: {
    en: "Turanci",
    ha: "Hausa",
    yo: "Yoruba",
    ig: "Igbo",
    pcm: "Pidgin",
  },
}

export default ha
