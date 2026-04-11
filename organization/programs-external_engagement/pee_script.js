const D = [
  {
    id: 0,
    short: "Programs &\nCommunity",
    color: "#993C1D",
    light: "#FAECE7",
    dark: "#712B13",
    subs: [
      {
        name: "Programs\nManagement",
        keys: ["Programs Director"],
        roles: [
          "Livelihood Coordinator",
          "Education Coordinator",
          "Health Coordinator",
          "Field Officers"
        ]
      },
      {
        name: "Community\nEngagement",
        keys: ["Engagement Lead"],
        roles: [
          "Community Organizer",
          "Volunteer Engagement Officer"
        ]
      }
    ]
  },
  {
    id: 1,
    short: "Communications\n& Advocacy",
    color: "#185FA5",
    light: "#E6F1FB",
    dark: "#0C447C",
    subs: [
      {
        name: "Communications",
        keys: ["Communications Director"],
        roles: [
          "Social Media Manager",
          "Content Creator",
          "Graphic Designer"
        ]
      },
      {
        name: "Advocacy",
        keys: ["Advocacy Lead"],
        roles: [
          "Campaign Officer",
          "Public Relations Officer"
        ]
      }
    ]
  },
  {
    id: 2,
    short: "Partnerships &\nResources",
    color: "#0F6E56",
    light: "#E1F5EE",
    dark: "#085041",
    subs: [
      {
        name: "Partnerships",
        keys: ["Partnerships Director"],
        roles: [
          "Corporate Liaison",
          "Sponsorship Coordinator"
        ]
      },
      {
        name: "Resource\nDevelopment",
        keys: ["Fundraising Lead"],
        roles: [
          "Grant Writer",
          "Fundraising Officer"
        ]
      }
    ]
  }
];

// reuse ALL logic from your OT script
// only change SVG ID

const svg = document.getElementById("pee-chart");

/* KEEP EVERYTHING ELSE EXACTLY THE SAME FROM YOUR ORIGINAL SCRIPT */