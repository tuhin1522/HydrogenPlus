export type Branch = {
  id: string;
  slug: string;
  name: string;
  city: string;
  address: string;
  tagline: string;
  description: string;
  batches: string[];
  classes: string[];
  teachers: string[];
  highlights: string[];
  contact: {
    phone: string;
    email: string;
    hours: string;
  };
};

export const branches: Branch[] = [
  {
    id: "dhaka-central",
    slug: "dhaka-central",
    name: "Dhaka Central Branch",
    city: "Dhaka",
    address: "House 18, Road 7, Dhanmondi",
    tagline: "The flagship campus for high-achievers.",
    description:
      "A premium branch for students preparing for school and college exams with focused mentoring, regular assessments, and parent updates.",
    batches: ["Morning Batch", "Evening Batch", "Weekend Revision Batch"],
    classes: ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "College Prep"],
    teachers: ["Mahmud Hasan", "Nadia Rahman", "Shafin Ahmed", "Farhana Akter"],
    highlights: [
      "Daily doubt-clearing sessions",
      "Practice tests every Friday",
      "Digital progress reports",
      "Dedicated counseling desk",
    ],
    contact: {
      phone: "+880 1712 111 222",
      email: "dhaka@hydrogenplus.com",
      hours: "7:30 AM - 8:30 PM",
    },
  },
  {
    id: "chattogram-campus",
    slug: "chattogram-campus",
    name: "Chattogram Campus",
    city: "Chattogram",
    address: "Level 3, GEC Circle, Chattogram",
    tagline: "Flexible learning for busy students and professionals.",
    description:
      "A modern campus designed for students who need structured revision, online support, and weekend coaching options.",
    batches: ["Weekday Batch", "Online Batch", "Crash Course Batch"],
    classes: ["Class 8", "Class 9", "Class 10", "HSC Admission"],
    teachers: ["Rafiq Khan", "Sadia Jahan", "Imran Chowdhury"],
    highlights: [
      "Hybrid class options",
      "Recorded lecture access",
      "Monthly mock exams",
      "Scholarship support",
    ],
    contact: {
      phone: "+880 1811 222 333",
      email: "ctg@hydrogenplus.com",
      hours: "8:00 AM - 9:00 PM",
    },
  },
  {
    id: "sylhet-hub",
    slug: "sylhet-hub",
    name: "Sylhet Learning Hub",
    city: "Sylhet",
    address: "12/A Amberkhana, Sylhet",
    tagline: "Small-group coaching with strong academic mentoring.",
    description:
      "A community-focused branch offering guided study plans, parent-teacher meetings, and subject-wise growth tracking.",
    batches: ["Foundation Batch", "Advanced Batch", "Holiday Sprint"],
    classes: ["Class 5", "Class 6", "Class 7", "Class 8", "Class 10"],
    teachers: ["Ayesha Rahman", "Tareq Islam", "Mina Akter"],
    highlights: [
      "Parent-teacher meetings every month",
      "Personalized lesson plans",
      "Strong attendance tracking",
      "Peer study circles",
    ],
    contact: {
      phone: "+880 1912 333 444",
      email: "sylhet@hydrogenplus.com",
      hours: "8:30 AM - 7:30 PM",
    },
  },
];

export type ExamItem = {
  title: string;
  date: string;
  branch: string;
  type: string;
  status: "Upcoming" | "Result Published";
  resultSummary?: string;
};

export const exams: ExamItem[] = [
  {
    title: "Monthly Assessment - Physics",
    date: "July 15, 2026",
    branch: "Dhaka Central",
    type: "Unit Test",
    status: "Upcoming",
  },
  {
    title: "Mid-Term Mathematics Review",
    date: "July 22, 2026",
    branch: "Chattogram Campus",
    type: "Mid-Term",
    status: "Upcoming",
  },
  {
    title: "Biology Final Result",
    date: "June 30, 2026",
    branch: "Sylhet Learning Hub",
    type: "Final Exam",
    status: "Result Published",
    resultSummary: "Average score improved by 12% compared to the previous assessment.",
  },
];
