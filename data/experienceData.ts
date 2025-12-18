export interface Experience {
  year: string;
  title: string;
  company: string;
  description: string[];
  tags: string[];
  logo: string;
}

export const experienceData: Experience[] = [
  {
    year: '2025',
    title: 'Product Manager',
    company: 'Product Space @ UC Davis',
    description: [
      'Leading client project integration with Dorsal.fyi.',
      'Previously served as VP of Engineering (March 2025) and Director of Engineering (July 2024).',
    ],
    tags: ['Product Management', 'Leadership', 'Client Work'],
    logo: '/productspace_logo.jpeg',
  },
  {
    year: '2025',
    title: 'Software Firmware Engineer',
    company: 'Formula Racing at UC Davis (FSAE)',
    description: [
      'Developing real-time telemetry data grapher using Python, PyQt5, and Matplotlib to visualize CAN messages.',
      'Integrated DBC parsing to interpret message IDs and plot key sensor data like RPM and throttle position.',
      'Optimized cross-platform Qt backend initialization for reliable macOS/Linux GUI rendering.',
    ],
    tags: ['Python', 'PyQt5', 'Matplotlib', 'Embedded Systems'],
    logo: '/frucd_logo.jpeg',
  },
  {
    year: '2025',
    title: 'Systems Engineering Intern',
    company: 'Northrop Grumman',
    description: [
      'Designed and deployed automated tools using Python, Go, Bash, and PowerShell to streamline mission system workflows.',
      'Analyzed network performance (CPU, I/O, memory) using CTEN software to identify bottlenecks in distributed nodes.',
      'Collaborated with cross-functional teams to ensure secure, maintainable code and documentation.',
    ],
    tags: ['Python', 'Go', 'Bash', 'Systems Engineering'],
    logo: '/northrop_grumman_logo.jpeg',
  },
  {
    year: '2024',
    title: 'Machine Learning Researcher',
    company: 'LARA Lab (UC Davis)',
    description: [
      'Conducting research on reinforcement learning (RL) for robotic manipulation using PPO.',
      'Developed a scalable pipeline for synchronizing multi-modal sensor data (force-feedback + vision).',
      'Leveraging Weights & Biases for experiment tracking to ensure reproducibility.',
    ],
    tags: ['Reinforcement Learning', 'Robotics', 'PPO', 'Python'],
    logo: '/lara_logo.jpeg',
  },
  {
    year: '2024',
    title: 'Project Manager & Developer',
    company: 'Aggie Sports Analytics',
    description: [
      'Led the development of a data-driven application to predict the 2024 NBA Draft order.',
      'Utilized AI/ML techniques with a React frontend and Flask backend.',
      'Previously built "HIKE", a fantasy chatbot using LangChain, StreamLit, and StatsModels.',
    ],
    tags: ['React', 'Flask', 'AI/ML', 'LangChain'],
    logo: '/aggiesportsanalytics_logo.jpeg',
  },
  {
    year: '2023',
    title: 'Technical Associate',
    company: 'Google Developer Student Club',
    description: [
      'Developed a Python data analysis program to detect malware based on file patterns.',
      'Trained multiple base models to identify "malware-infected" file signatures.',
      'Served as Marketing Director, boosting Instagram followers to 1,000+.',
    ],
    tags: ['Python', 'Security', 'Data Analysis'],
    logo: '/dock_icons/79fcce8afc269430bfc2d855d632f09a_Gmail_512x512x32.png', // Placeholder - no GDSC logo found
  },
];
