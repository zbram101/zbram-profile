export const workExp = [
  {
    "company": "Thermo Fisher Scientific",
    "role": "Senior Manager, AI Solutions",
    "additionalRole": "Previously Staff Software Engineer · Nov 2023 – Dec 2025",
    "aliases": [
      "thermo",
      "thermo fisher"
    ],
    "period": "Dec 2025 – Present",
    "current": true,
    "description": "Leads eight engineers delivering enterprise AI across business groups. Promoted on December 7, 2025, after serving as Staff Software Engineer from November 2023 to December 2025.",
    "highlights": [
      {
        "value": "2 → 8",
        "label": "team growth within one year"
      },
      {
        "value": "10,000",
        "label": "MCP users"
      },
      {
        "value": "200,000+",
        "label": "MCP tool calls in 2026 to date"
      }
    ],
    "responsibilities": [
      "Lead technical delivery across business groups for projects taken on within one quarter, with combined expected annual revenue of $10–15M.",
      "Scaled the engineering team from two to eight within one year to deliver enterprise AI solutions.",
      "Set technical direction for the team’s work on model routing, reusable agent architectures, and an AI gateway.",
      "Led rollout of a reusable Model Context Protocol (MCP) architecture and standards for development, deployment, and integration with internal and external clients; services supported 10,000 users and recorded 200,000+ tool calls in 2026 to date.",
      "Directed development of a custom context layer that achieved 90%+ accuracy in applying context to SQL query generation for data retrieval; broader rollout planned."
    ],
    "previousRoles": [
      {
        "role": "Staff Software Engineer",
        "period": "Nov 2023 – Dec 2025",
        "responsibilities": [
          "Led development of a field-service application combining instrument manuals and service history to recommend next actions, saving more than $1M annually in service visits.",
          "Built a multi-agent system to guide manufacturing decisions, supporting a 43% reduction in excess and obsolete (E&O) levels.",
          "Replaced Power BI reporting with multi-agent querying and analysis, reducing costs by 30% through lower Power BI licensing spend.",
          "Built a GenAI playground to compare model quality, execution time, and cost; developed stateful assistant orchestration using Jupyter notebooks.",
          "Worked closely with OpenAI teams on platform integration into Thermo Fisher workflows; presented AI solutions to the CFO, CTO, CIO, and other executives."
        ]
      }
    ]
  },
  {
    "company": "Globality",
    "role": "Senior Software Engineer",
    "period": "May 2021 – May 2023",
    "description": "Led engineering delivery, technical design standards, and the team roadmap for enterprise applications.",
    "image": "images/Glo.jpeg",
    "responsibilities": [
      "Managed the team’s product roadmap and delivery commitments, ran scrum meetings, and used reporting to improve team performance.",
      "Established a Technical Design Review process covering the full SDLC, platform changes, third-party applications, and business processes.",
      "Standardized feature releases with technical design, build design, test design, and supporting operational documentation.",
      "Added automated checks for code quality, test coverage, and package imports across projects.",
      "Created a support and intake process, and built administrative tools to help frontline teams investigate root causes and resolve client issues.",
      "Evaluated build-versus-buy options against cost, scalability, and business needs; implemented enterprise integrations and Active Directory-based onboarding."
    ]
  },
  {
    "company": "Kaiser Permanente",
    "role": "Software Engineer",
    "period": "Oct 2018 – Sep 2021",
    "description": "Built web applications and services, improved engineering quality, and championed test automation.",
    "image": "images/Kaiser.png",
    "responsibilities": [
      "Built Angular components and corresponding services for a single-page application.",
      "Developed and customized Adobe Experience Manager components to meet project requirements.",
      "Reviewed code, identified functional gaps, and resolved issues across the software development lifecycle.",
      "Designed service architectures with the team lead and translated designs into working code.",
      "Collaborated with product managers, UI/UX designers, technical specialists, and business stakeholders.",
      "Mentored developers and trained teams to maintain SSIS integrations; created a departmental training and internal certification program."
    ]
  },
  {
    "company": "Infostretch",
    "role": "Automation Engineer",
    "period": "Oct 2015 – Sep 2018",
    "description": "Built enterprise test automation and continuous delivery capabilities for Kaiser Permanente.",
    "image": "images/Kaiser.png",
    "responsibilities": [
      "Translated business requirements into test cases and automated approximately 94% of them.",
      "Built the KP testing framework to standardize testing across teams within the organization.",
      "Integrated automated tests into deployment workflows to give developers faster feedback.",
      "Developed CI/CD proofs of concept for deploying validated features across environments without manual intervention.",
      "Automated test-status updates in Quality Center so business stakeholders could monitor development progress.",
      "Investigated issues across frontend code, content, service data, and external dependencies."
    ]
  },
  {
    "company": "UST Global",
    "role": "Senior Systems Analyst (full time)",
    "period": "Oct 2014 – Sep 2015",
    "additionalRole": "Data Engineer (contract) · Jul 2013 – Oct 2014",
    "description": "Built data tools, integrations, and automation to reduce operational effort.",
    "image": "images/Anthem.jpeg",
    "responsibilities": [
      "Created a user interface for data modifications that reduced business change requests and saved the company nearly $300K per year.",
      "Wrote complex scripts to resolve data-quality issues, repair relationships between datasets, and generate correspondence.",
      "Trained an offshore team to handle analyzed data-change requests through development and testing.",
      "Created automation scripts to generate test data.",
      "Built SSIS packages for warehouse-to-data-mart transfers and processing vendor files delivered through FTP.",
      "Built reports from current data to support analytics and business decisions."
    ]
  }
];

export const skills = [
  {
    title: "Engineering leadership",
    skills: [
      { name: "Team growth & development", description: "Team scaling, mentoring, and technical training" },
      { name: "Cross-functional delivery", description: "AI initiatives across business groups and enterprise integrations" },
      { name: "Technical direction & design reviews", description: "Architecture decisions, engineering standards, and release quality" },
      { name: "Roadmap & delivery management", description: "Engineering priorities, delivery commitments, and build-versus-buy decisions" },
      { name: "Stakeholder & executive communication", description: "Business alignment and presentations to senior executives" },
      { name: "Support intake & operational processes", description: "Frontline support workflows and root-cause investigation" }
    ]
  },
  {
    title: "Applied AI",
    skills: [
      { name: "Agent architecture & orchestration", description: "Multi-agent systems, reusable agent architectures, Microsoft AutoGen, Jupyter notebooks" },
      { name: "MCP architecture & integration standards", description: "Model Context Protocol development, deployment, and client integration" },
      { name: "Model evaluation & routing", description: "Model comparison across quality, execution time, and cost; model routing" },
      { name: "Retrieval & context engineering", description: "RAG, Azure AI Search, and context for SQL query generation" },
      { name: "AI gateway architecture", description: "Technical direction for the team’s AI gateway" },
      { name: "AI platform integration", description: "OpenAI APIs and agents" }
    ]
  },
  {
    title: "Software engineering",
    skills: [
      { name: "API & service architecture", description: "REST APIs and microservices" },
      { name: "Web application development", description: "React, Angular, Adobe Experience Manager" },
      { name: "Programming languages", description: "Python, JavaScript, TypeScript, Go" },
      { name: "Engineering quality & automation", description: "Code reviews, automated quality checks, and test automation" }
    ]
  },
  {
    title: "Data & integration",
    skills: [
      { name: "Relational data systems", description: "PostgreSQL, Microsoft SQL Server, MySQL" },
      { name: "Data access & querying", description: "SQL, PL/SQL, Redis" },
      { name: "Data engineering & integration", description: "SQL Server Integration Services (SSIS), MuleSoft" }
    ]
  },
  {
    title: "Platforms & delivery",
    skills: [
      { name: "Container orchestration", description: "Kubernetes" },
      { name: "Continuous delivery", description: "Jenkins, CircleCI, Harness, Drone" },
      { name: "Version control & code review", description: "Git" }
    ]
  },
  {
    title: "Identity & access",
    skills: [
      { name: "Identity & access integration", description: "Microsoft Entra ID (formerly Azure AD)" }
    ]
  },
  {
    title: "Observability",
    skills: [
      { name: "Monitoring & visualization", description: "Grafana" }
    ]
  }
];

export const projects = [
    {
        title: "Smart Pin",
        visual: "smart-pin",
        status: "Stealth mode",
        description: "Building a smart pin. Currently in stealth mode, with more to share when it’s ready.",
        category: "Product development",
        link:null,
        accomplishments: []
    },
    {
        title: "Skirmesh",
        visual: "skirmesh",
        status: "Exited - Sold Equity",
        description: "Architected and redesigned the technical and product architecture to make it a viable product",
        category: "IRL Gaming SAAS",
        link:"https://play.skirmesh.net/public/home",
        accomplishments: [
          "Revamped the project with software engineering concepts like web sockets and APIs",
          "Aided in transforming the project into a money-making business",
          "Acquired initial customers to kickstart the project"
        ]
    },
    {
        title: "Fiji Fry House",
        visual: "fiji",
        status: "Active",
        description: "Managing IT infrastructure, online presence, and operational efficiency for a friend's restaurant",
        category: "Restaurant",
        link:"https://fijifryhouse.com/",
        accomplishments: [
          "Providing IT support and management for the restaurant",
          "Enhancing online presence for the restaurant",
          "Improving operational efficiency through IT solutions"
        ]
    },
    {
        title: "trytherapy.ai",
        visual: "therapy",
        status: "#2 on Product Hunt",
        description: "Built TherapyAI end to end, an iOS AI companion offering 24/7 conversations and personalized support to help people reflect, feel heard, and better understand their emotions",
        category: "iOS · AI Mental Wellness",
        link:"https://www.trytherapy.ai/",
        accomplishments: [
          "Created conversations that remember previous sessions, making support more personal over time",
          "Provided tailored guidance and exercises based on each person's needs",
          "Built a space to vent, explore feelings, and reflect on the roots of stress and anxiety",
          "Reached #2 on Product Hunt"
        ]
    },
    {
        title: "Context Platform",
        visual: "context",
        status: "Active — MVP",
        description: "Building a governed context platform that connects shared business definitions to AI-assisted data analysis, with validated queries and traceable answers.",
        category: "AI & Data Platform",
        link: "https://context.bharadwajramachandran.com",
        accomplishments: [
          "Built a versioned definition registry with independent reviews, release promotion, rollback, and an audit trail",
          "Connected conversational analysis to validated, read-only queries over AdventureWorks, with query evidence, Python analysis, and downloadable charts and CSVs",
          "Added interactive relationship exploration, API and MCP access, and publisher-only chat usage and estimated cost reporting",
          "Developed the MVP with React, TypeScript, FastAPI, and PostgreSQL, containerized with Docker and deployed on AWS ECS"
        ]
    },
    {
        title: "goLoadout",
        aliases: ["go loadout", "go loadouts", "goloadouts"],
        visual: "loadout",
        status: null,
        description: "Your tactical gaming identity follows you from the screen to the field.",
        category: "Gaming & Digital Identity",
        link: "https://goloadout.bharadwajramachandran.com/",
        accomplishments: [
          "Connecting real-life gaming with your online persona",
          "Putting your personal gaming identity at the center of the experience"
        ]
    }
  ];

export function projectAnswer(question) {
  const query = question.toLowerCase();
  const project = projects.find(item => [item.title, ...(item.aliases || [])].some(name => query.includes(name.toLowerCase())));
  if (!project) return null;
  return `**${project.title}**${project.status ? ` (${project.status})` : ''}\n\n${project.description}`
    + (project.accomplishments.length ? '\n\n' + project.accomplishments.map(item => `- ${item}`).join('\n') : '');
}

export const achievements = [
  { value: '2 → 8', title: 'An engineering team built to deliver', description: 'Grew the team from two to eight engineers within one year, delivering enterprise AI across business groups.' },
  { value: '200,000+', title: 'MCP tool calls in 2026 to date', description: 'Reusable MCP architecture and integration standards supported 10,000 users. Services recorded 200,000+ tool calls in 2026 to date.' },
  { value: '$10–15M', title: 'Combined expected annual revenue', description: 'Projects taken on within one quarter across business groups have combined expected annual revenue of $10–15M.' },
  { value: '90%+', title: 'Context applied to SQL query generation', description: 'A custom context layer achieved 90%+ accuracy in applying context to SQL query generation for data retrieval. Broader rollout is planned.' },
  { value: '43%', title: 'Reduction in excess & obsolete levels', description: 'A multi-agent system guided manufacturing decisions, supporting a 43% reduction in excess and obsolete (E&O) levels.' },
  { value: '>$1M', title: 'Annual field-service savings', description: 'An application combined instrument manuals and service history to recommend next actions, saving more than $1M annually in service visits.' },
  { value: '30%', title: 'Lower Power BI licensing spend', description: 'Replaced Power BI reporting with multi-agent querying and analysis, reducing costs by 30% through lower Power BI licensing spend.' }
];

export const contributions = [
  {
    title: 'Microsoft AutoGen', kind: 'Open-source contribution', status: 'Merged PR #2594',
    description: 'Contributed an assistant-agent example connecting function calling to Azure AI Search for RAG, with Azure Identity-based index-access checks.',
    link: 'https://github.com/microsoft/autogen/pull/2594'
  },
  {
    title: 'Model Hardware Standard (MHS)', kind: 'Technical project', status: 'Example implementation',
    description: 'Developed an example implementation using Model Hardware Standard (MHS).',
    link: null
  }
];

export const education = [
  {
    title: 'Professional Certificate in Machine Learning and Artificial Intelligence',
    institution: 'UC Berkeley Executive Education', period: 'Completed March 2026',
    credential: 'https://certificates.emeritus.org/43c23859-2970-4b28-8a66-d9f1887dc831'
  },
  { title: 'Bachelor’s degree in Computer Science', institution: 'Manav Bharti University', period: '2008–2012', credential: null }
];

export const profile = {
  name: 'Bharadwaj Ramachandran',
  summary: 'Senior Manager, AI Solutions at Thermo Fisher Scientific, with 12+ years across software engineering, enterprise automation, and data engineering. Leads eight engineers delivering AI across business groups, combining team development, technical direction, and executive communication.',
  biography: 'I build teams and reusable AI capabilities that connect engineering work to business priorities. My team leads model routing, agent architectures, an AI gateway, and MCP development, deployment, and integration standards for internal and external clients. My background spans enterprise applications, test automation, and data engineering.',
  workExp,
  projects,
  skills,
  achievements,
  contributions,
  education,
  resume: '/resume/Bharadwaj_Ramachandran_Portfolio_Resume.pdf',
  linkedin: 'https://linkedin.com/in/bharadwaj-ramachandran-51bb32a3',
  github: 'https://github.com/zbram101',
};
