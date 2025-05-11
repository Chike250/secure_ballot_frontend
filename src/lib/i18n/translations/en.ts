const en = {
  common: {
    appName: "Secure Ballot",
    tagline: "Nigeria's Secure Voting Platform",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    cancel: "Cancel",
    save: "Save",
    confirm: "Confirm",
    back: "Back",
    next: "Next",
    submit: "Submit",
    continue: "Continue",
    search: "Search",
    filter: "Filter",
    sort: "Sort",
    all: "All",
    none: "None",
    select: "Select",
    edit: "Edit",
    delete: "Delete",
    view: "View",
    create: "Create",
    update: "Update",
    close: "Close",
  },
  nav: {
    home: "Home",
    about: "About",
    faq: "FAQ",
    contact: "Contact",
    login: "Login",
    register: "Register",
    dashboard: "Dashboard",
    results: "Results",
    vote: "Vote",
    profile: "Profile",
    settings: "Settings",
    logout: "Logout",
  },
  home: {
    title: "Secure Ballot",
    subtitle: "Nigeria's Most Secure and Transparent Voting Platform",
    description:
      "Empowering democracy through secure, transparent, and accessible digital voting for the 2027 Nigerian General Elections.",
    cta: {
      login: "Login to Vote",
      learnMore: "Learn More",
      viewResults: "View Live Results",
    },
    features: {
      title: "Why Choose Secure Ballot",
      security: {
        title: "Enterprise-Grade Security",
        description: "Your vote is protected by military-grade encryption and multi-factor authentication.",
      },
      transparency: {
        title: "Complete Transparency",
        description: "Real-time results and tamper-proof audit logs ensure a fair and open process.",
      },
      accessibility: {
        title: "Accessible to All",
        description: "Vote from anywhere with internet access, with support for all major Nigerian languages.",
      },
      integrity: {
        title: "Guaranteed Integrity",
        description: "Blockchain technology ensures votes cannot be altered or manipulated.",
      },
    },
    countdown: {
      title: "Election Countdown",
      days: "Days",
      hours: "Hours",
      minutes: "Minutes",
      seconds: "Seconds",
      until: "until voting begins",
    },
    stats: {
      title: "Election Statistics",
      registeredVoters: "Registered Voters",
      pollingUnits: "Polling Units",
      constituencies: "Constituencies",
      states: "States + FCT",
    },
    hero: {
      title: "Nigeria's Most Secure Voting Platform",
      subtitle: "Vote securely, transparently, and confidently in the 2027 Nigerian General Elections.",
      loginButton: "Login to Vote",
      statsButton: "View Live Stats",
    },
    elections: {
      title: "Select Your Election",
      presidential: {
        title: "Presidential Election",
        description: "Vote for Nigeria's next president",
      },
      gubernatorial: {
        title: "Gubernatorial Election",
        description: "Vote for your state governor",
      },
      houseOfReps: {
        title: "House of Representatives",
        description: "Vote for your local representative",
      },
      senatorial: {
        title: "Senatorial Election",
        description: "Vote for your state senator",
      },
      votingPeriod: "Voting Period: 3 weeks",
      voteNow: "Vote Now",
    },
    monitoring: {
      title: "Real-Time Election Monitoring",
      viewDetails: "View Detailed Statistics",
    },
    testimonials: {
      title: "Trusted by Experts & Leaders",
      subtitle: "See what cybersecurity experts and high-profile voters are saying about Secure Ballot.",
    },
    security: {
      title: "Enterprise-Grade Security",
      subtitle:
        "Your vote is protected with multi-factor authentication, end-to-end encryption, and tamper-proof audit logs.",
      mfa: {
        title: "Multi-Factor Authentication",
        description: "Secure your identity with NIN, VIN, and OTP verification before casting your vote.",
      },
      encryption: {
        title: "End-to-End Encryption",
        description: "All data is secured using ECC & AES-256 encryption, ensuring your vote remains confidential.",
      },
      auditLogs: {
        title: "Tamper-Proof Audit Logs",
        description: "Every vote action is securely logged and cannot be altered, ensuring election integrity.",
      },
    },
  },
  login: {
    title: "Login to Vote",
    subtitle: {
      credentials: "Enter your NIN and VIN to authenticate",
      otp: "Enter the OTP sent to your registered phone",
    },
    nin: {
      label: "National Identification Number (NIN)",
      placeholder: "Enter your 11-digit NIN",
      error: "NIN must be exactly 11 digits",
    },
    vin: {
      label: "Voter Identification Number (VIN)",
      placeholder: "Enter your 19-character VIN",
      error: "VIN must be exactly 19 characters",
    },
    otp: {
      label: "One-Time Password (OTP)",
      placeholder: "Enter 6-digit OTP",
      help: "Enter the 6-digit code sent to your registered phone number",
      error: "OTP must be exactly 6 digits",
      resend: "Resend OTP",
    },
    buttons: {
      continue: "Continue",
      verify: "Verify & Continue",
    },
    userId: {
      title: "Your Unique User ID",
      description: "Please save this ID for reference. You'll need it if you contact support.",
      notice: "This notification will disappear in a few seconds",
    },
    terms: "By continuing, you agree to Secure Ballot's Terms of Service and Privacy Policy.",
  },
  dashboard: {
    welcome: "Welcome back",
    overview: "Overview",
    candidates: "Candidates",
    statistics: "Statistics",
    map: "Electoral Map",
    back: "Back to Dashboard",
    totalVotes: "Total Votes Cast",
    voterTurnout: "Voter Turnout",
    statesReporting: "States Reporting",
    timeRemaining: "Time Remaining",
    leadingCandidate: "Leading Candidate",
    voteDistribution: "Vote Distribution",
    percentageBreakdown: "Percentage Breakdown",
    liveUpdates: "Live Updates",
    votedElections: "You have already voted in this election",
    selectCandidate: "Select a candidate to cast your vote",
    voteCast: "Vote Cast",
    confirmVote: "Confirm Your Vote",
    confirmVoteDescription: "You are about to cast your vote. This action cannot be undone.",
    cancel: "Cancel",
    processing: "Processing...",
    voteSuccess: "Vote Successfully Cast",
    voteSuccessDescription: "Your vote has been securely recorded. Thank you for participating.",
    continue: "Continue",
    stats: {
      totalVotes: "Total Votes Cast",
      voterTurnout: "Voter Turnout",
      statesReporting: "States Reporting",
      timeRemaining: "Time Remaining",
      including: "Including FCT",
      days: "days",
      votingPeriod: "In 3-week voting period",
    },
    charts: {
      voteDistribution: "Vote Distribution",
      votesByParty: "Votes by political party",
      percentageBreakdown: "Percentage Breakdown",
      voteShare: "Vote share by political party",
    },
    liveUpdates: {
      title: "Live Updates",
      subtitle: "Real-time election news and announcements",
      live: "Live",
    },
    candidateSection: {
      title: "Candidates",
      alreadyVoted: "You have already voted in this election",
      selectCandidate: "Select a candidate to cast your vote",
      voteCast: "Vote Cast",
      search: "Search candidates by name or party...",
      noResults: "No candidates found",
      tryDifferent: "Try a different search term",
      clearSearch: "Clear search",
      comparison: "Candidate Comparison",
      compareSideBySide: "Compare candidates side by side",
      candidate: "Candidate",
      party: "Party",
      keyPolicies: "Key Policies",
      currentVotes: "Current Votes",
      percentage: "Percentage",
    },
    voteConfirmation: {
      title: "Confirm Your Vote",
      description: "You are about to cast your vote. This action cannot be undone.",
      processing: "Processing...",
      confirmVote: "Confirm Vote",
    },
    voteSuccess: {
      title: "Vote Successfully Cast",
      description: "Your vote has been securely recorded. Thank you for participating in the election.",
      message: "You can still vote in other elections. Your vote is anonymous and secure.",
    },
  },
  settings: {
    title: "Settings",
    subtitle: "Manage your account preferences and application settings",
    tabs: {
      general: "General",
      notifications: "Notifications",
      accessibility: "Accessibility",
      privacy: "Privacy",
      language: "Language",
    },
    general: {
      title: "General Settings",
      description: "Manage your basic account and application preferences",
      language: {
        label: "Language",
        help: "Choose your preferred language for the application interface",
      },
      theme: {
        label: "Theme",
        light: "Light",
        dark: "Dark",
        system: "System",
      },
      timeZone: {
        label: "Time Zone",
        help: "Set your local time zone for accurate time display",
      },
      updates: {
        label: "Automatic Updates",
        help: "Receive the latest features and security improvements automatically",
      },
    },
    language: {
      title: "Language Settings",
      description: "Choose your preferred language for the application",
      selectLanguage: "Select language",
      languageChanged: "Language changed successfully",
    },
  },
  languages: {
    en: "English",
    ha: "Hausa",
    yo: "Yoruba",
    ig: "Igbo",
    pcm: "Nigerian Pidgin",
  },
  ai: {
    title: "Secure Ballot Guide",
    greeting: "Hello! I'm Secure Ballot Guide, your AI assistant. How can I help you with the voting process today?",
    status: {
      online: "Online",
      typing: "Typing...",
    },
    inputPlaceholder: "Ask any question...",
    fallbackResponse:
      "I don't have specific information about that, but I can help you with questions about voting procedures, security measures, candidate information, and technical support. Could you please rephrase your question?",
    suggestedQuestions: {
      howToVote: "How do I vote?",
      isVoteSecure: "Is my vote secure?",
      whoCandidates: "Who are the candidates?",
      whenVoting: "When is the voting period?",
      changeVote: "Can I change my vote?",
      countVotes: "How are votes counted?",
    },
    keywords: {
      how: "how",
      vote: "vote",
      voting: "voting",
      cast: "cast",
      requirements: "requirements",
      need: "need",
      eligible: "eligible",
      eligibility: "eligibility",
      where: "where",
      when: "when",
      time: "time",
      period: "period",
      change: "change",
      verify: "verify",
      confirmation: "confirmation",
      security: "security",
      secure: "secure",
      safe: "safe",
      encryption: "encryption",
      encrypted: "encrypted",
      authentication: "authentication",
      verifyIdentity: "verify identity",
      privacy: "privacy",
      anonymous: "anonymous",
      secret: "secret",
      audit: "audit",
      log: "log",
      track: "track",
      protect: "protect",
      attack: "attack",
      hack: "hack",
      platform: "platform",
      system: "system",
      infrastructure: "infrastructure",
      accessibility: "accessibility",
      accessible: "accessible",
      disability: "disability",
      backup: "backup",
      disaster: "disaster",
      recovery: "recovery",
      test: "test",
      securityTest: "security test",
      count: "count",
      counting: "counting",
      results: "results",
      announce: "announce",
      officialResults: "official results",
      dispute: "dispute",
      challenge: "challenge",
      contest: "contest",
      candidate: "candidate",
      candidates: "candidates",
      who: "who",
      compare: "compare",
      comparison: "comparison",
      party: "party",
      parties: "parties",
      contact: "contact",
      support: "support",
      help: "help",
      issue: "issue",
      problem: "problem",
      trouble: "trouble",
      feedback: "feedback",
      suggestion: "suggestion",
    },
    knowledge: {
      voting: {
        process:
          "To vote, you need to login with your NIN and VIN, verify your identity with an OTP, then select your preferred candidate. Your vote will be securely recorded and encrypted.",
        requirements:
          "You need a valid National Identification Number (NIN) and Voter Identification Number (VIN) to vote. These must match the records in the national voter database.",
        eligibility:
          "To be eligible to vote, you must be a Nigerian citizen, at least 18 years old, and registered with INEC (Independent National Electoral Commission).",
        where:
          "You can vote online through this secure platform from anywhere with internet access. The platform is accessible 24/7 during the 3-week voting period.",
        when: "The voting period lasts for 3 weeks, starting from the official election date. You can vote at any time during this period.",
        change:
          "Once your vote is submitted, it cannot be changed. Please make sure you're confident in your choice before submitting.",
        verify:
          "After voting, you'll receive a unique receipt code. You can use this code to verify that your vote was counted correctly without revealing who you voted for.",
      },
      security: {
        overview:
          "Secure Ballot uses multi-factor authentication, end-to-end encryption with ECC & AES-256, and tamper-proof audit logs to ensure your vote is secure and confidential.",
        encryption:
          "Your vote is protected with end-to-end encryption using Elliptic Curve Cryptography (ECC) and AES-256 standards, the same level of security used by major financial institutions.",
        authentication:
          "We use multi-factor authentication including your NIN, VIN, and a one-time password (OTP) sent to your registered phone number to verify your identity.",
        privacy:
          "Your vote is completely anonymous. While the system verifies your eligibility to vote, it separates your identity from your actual vote to maintain ballot secrecy.",
        audit:
          "Every action in the voting process is recorded in tamper-proof audit logs using blockchain technology, allowing for verification of election integrity without compromising voter privacy.",
        protection:
          "The system is protected against various cyber threats including DDoS attacks, SQL injection, and man-in-the-middle attacks through multiple security layers.",
      },
      technical: {
        platform:
          "Secure Ballot is built on a distributed cloud infrastructure with redundant systems to ensure 99.99% uptime during the election period.",
        accessibility:
          "The platform is designed to be accessible to all voters, including those with disabilities, and works on various devices including smartphones, tablets, and computers.",
        backup:
          "Multiple backup systems and disaster recovery protocols ensure that no votes are lost, even in the event of major technical issues.",
        testing:
          "The system undergoes rigorous security testing, including penetration testing by independent cybersecurity firms and public security audits.",
      },
      results: {
        counting:
          "Votes are counted automatically by the system as they are cast, with real-time updates to the results dashboard.",
        verification:
          "Election results can be independently verified through cryptographic proofs that confirm vote integrity without revealing individual votes.",
        announcement:
          "Official results are announced after the voting period ends and all votes have been verified by the Independent National Electoral Commission.",
        disputes:
          "Any disputes about the election results can be addressed through the official channels provided by INEC, with full transparency of the process.",
      },
      candidates: {
        information:
          "You can view detailed information about all candidates including their party affiliation, background, and key policy positions in the Candidates section.",
        comparison:
          "The platform allows you to compare candidates side by side to help you make an informed decision before voting.",
        parties:
          "Major parties participating in the election include APC, PDP, LP, NNPP, and others, each with their own candidates for various positions.",
      },
      support: {
        contact:
          "If you need assistance, you can contact our support team through the Contact page, by email at support@secureballot.ng, or by phone at 0800-VOTE-HELP.",
        issues:
          "Common issues such as forgotten VIN or NIN can be resolved by visiting the nearest INEC office with your identification documents.",
        feedback:
          "We welcome your feedback on the voting experience. Please use the feedback form in the Contact section to share your thoughts.",
      },
    },
  },
  realTimeMonitoring: {
    title: "Real-Time Election Monitoring",
    subtitle: "Stay informed with second-by-second updates on Nigeria's 2025 General Elections",
    liveUpdates: "Live Updates",
    liveData: "Live Data",
    lastUpdated: "Last updated",
    totalVotes: "Total Votes Counted",
    voterTurnout: "voter turnout",
    leadingParty: "Leading Party",
    pollingUnitsReporting: "Polling Units Reporting",
    reported: "reported",
    total: "total",
    viewDetailedStats: "View Detailed Statistics",
    usersMonitoring: "users monitoring live results",
    howItWorks: {
      title: "How Our Real-Time System Works",
      description:
        "Our advanced election monitoring platform delivers instant updates through a secure, distributed network of verified polling stations across Nigeria.",
      secureData: {
        title: "Secure Data Transmission",
        description:
          "Results are transmitted securely from polling units via encrypted channels, ensuring data integrity and protection from interference.",
      },
      realTimeProcessing: {
        title: "Real-Time Processing",
        description:
          "Our system processes incoming data within seconds, updating vote counts, turnout percentages, and leading candidates across all races.",
      },
      continuousUpdates: {
        title: "Continuous Updates",
        description:
          "The dashboard refreshes automatically every 60 seconds, with manual refresh available for immediate updates on total votes, turnout, and results.",
      },
      verifiedResults: {
        title: "Verified Results",
        description:
          "All data is verified through our multi-layer authentication system before being displayed, ensuring accuracy and reliability.",
      },
    },
  },
}

export default en
