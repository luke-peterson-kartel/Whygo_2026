export interface DepartmentGoalMapping {
  department: string;
  departmentDisplayName: string;
  whygoNumber: number;
  goalText: string;
  connectionType: 'Primary' | 'Strong' | 'Enabler';
  connectionDescription: string;
  owner: string;
}

export const COMPANY_TO_DEPARTMENT_MAPPING: Record<string, DepartmentGoalMapping[]> = {
  // Company WhyGO #1: Product-Market Fit
  'Onboard 10 enterprise clients': [
    {
      department: 'sales',
      departmentDisplayName: 'Sales',
      whygoNumber: 1,
      goalText: 'Sign 18+ enterprise spec engagements across 5 verticals, convert 75%+ to paying clients, close $7M revenue',
      connectionType: 'Primary',
      connectionDescription: 'Direct ladder - Sales closes the enterprise clients that prove PMF',
      owner: 'Ben Kusin, CRO'
    },
    {
      department: 'sales',
      departmentDisplayName: 'Sales',
      whygoNumber: 2,
      goalText: 'Achieve 50+ NPS, publish 5 case studies, retain 90%+ of clients past spec period',
      connectionType: 'Strong',
      connectionDescription: 'Validates PMF through retention and referenceable clients',
      owner: 'Ben Kusin, CRO'
    },
    {
      department: 'production',
      departmentDisplayName: 'Production',
      whygoNumber: 1,
      goalText: 'Establish platform-tracked handoff system scaling from 6 to 20 active client engagements',
      connectionType: 'Strong',
      connectionDescription: 'Enables scaling to support enterprise client onboarding',
      owner: 'Wayan Palmieri, SVP Production'
    },
    {
      department: 'production',
      departmentDisplayName: 'Production',
      whygoNumber: 3,
      goalText: 'Scale Production capacity to support 20 clients with optimized client-to-producer ratio',
      connectionType: 'Strong',
      connectionDescription: 'Builds capacity for 10-20 client pipeline',
      owner: 'Wayan Palmieri, SVP Production'
    },
    {
      department: 'platform',
      departmentDisplayName: 'Platform Engineering',
      whygoNumber: 2,
      goalText: 'Implement technical controls for enterprise security and compliance certifications (SOC2)',
      connectionType: 'Enabler',
      connectionDescription: 'Required for enterprise sales approval',
      owner: 'Niels Hoffmann, CTO'
    }
  ],

  // Company WhyGO #2: Operational Excellence
  'Establish operational infrastructure': [
    {
      department: 'production',
      departmentDisplayName: 'Production',
      whygoNumber: 2,
      goalText: 'Achieve 50% production margin, 90%+ on-time delivery, growing client platform engagement',
      connectionType: 'Strong',
      connectionDescription: 'Direct ladder - identical outcomes to company goal',
      owner: 'Wayan Palmieri, SVP Production'
    },
    {
      department: 'sales',
      departmentDisplayName: 'Sales',
      whygoNumber: 3,
      goalText: 'Build scalable sales team, establish handoff discipline, deliver pipeline forecasting',
      connectionType: 'Strong',
      connectionDescription: 'Clean handoffs protect margin and enable capacity planning',
      owner: 'Ben Kusin, CRO'
    },
    {
      department: 'generative',
      departmentDisplayName: 'Generative Engineering',
      whygoNumber: 2,
      goalText: 'Maintain technical leadership through systematic R&D, robust QC, LoRA evaluation standards',
      connectionType: 'Strong',
      connectionDescription: 'Quality consistency enables premier experience and 100% brand accuracy',
      owner: 'Fill Isgro, SVP Generative'
    },
    {
      department: 'generative',
      departmentDisplayName: 'Generative Engineering',
      whygoNumber: 1,
      goalText: 'Document all roles with playbooks, load-test pod capacity, discover max concurrent clients',
      connectionType: 'Strong',
      connectionDescription: 'Documented roles ensure repeatable delivery and operational predictability',
      owner: 'Fill Isgro, SVP Generative'
    },
    {
      department: 'production',
      departmentDisplayName: 'Production',
      whygoNumber: 1,
      goalText: 'Establish platform-tracked handoff system across all four handoffs',
      connectionType: 'Strong',
      connectionDescription: 'Handoff discipline creates operational maturity',
      owner: 'Wayan Palmieri, SVP Production'
    }
  ],

  // Company WhyGO #3: Talent Engine
  'Build Discord community': [
    {
      department: 'community',
      departmentDisplayName: 'Community & Partnerships',
      whygoNumber: 1,
      goalText: 'Build 1,000+ member Discord with 5-tier pipeline delivering 20 Tier 5 talent',
      connectionType: 'Primary',
      connectionDescription: 'Direct ladder - Community builds Discord and talent pipeline',
      owner: 'Daniel Kalotov, SVP Community'
    },
    {
      department: 'community',
      departmentDisplayName: 'Community & Partnerships',
      whygoNumber: 2,
      goalText: 'Operate high-performing system with engagement, tier progression, platform utilization',
      connectionType: 'Strong',
      connectionDescription: 'Ensures sustainable, active talent pipeline',
      owner: 'Daniel Kalotov, SVP Community'
    },
    {
      department: 'generative',
      departmentDisplayName: 'Generative Engineering',
      whygoNumber: 1,
      goalText: 'Document all roles with playbooks approved as onboarding-ready',
      connectionType: 'Strong',
      connectionDescription: 'Playbooks enable Community to certify talent to right standards',
      owner: 'Fill Isgro, SVP Generative'
    },
    {
      department: 'generative',
      departmentDisplayName: 'Generative Engineering',
      whygoNumber: 3,
      goalText: 'Expand Generative Platform including Community Ecosystem infrastructure',
      connectionType: 'Strong',
      connectionDescription: 'Platform powers credits, challenges, certification pipeline',
      owner: 'Fill Isgro, SVP Generative'
    },
    {
      department: 'platform',
      departmentDisplayName: 'Platform Engineering',
      whygoNumber: 3,
      goalText: 'Deploy unified authentication enabling Community→Generative→Production journey',
      connectionType: 'Enabler',
      connectionDescription: 'SSO enables seamless talent progression from Discord to pod work',
      owner: 'Niels Hoffmann, CTO'
    }
  ],

  // Company WhyGO #4: Platform Infrastructure
  'Deploy the three-pillar': [
    {
      department: 'platform',
      departmentDisplayName: 'Platform Engineering',
      whygoNumber: 1,
      goalText: 'Deploy Enterprise Platform (Client Portal + Production Management + Generative integration)',
      connectionType: 'Primary',
      connectionDescription: 'Direct ladder - Platform builds and integrates three pillars',
      owner: 'Niels Hoffmann, CTO'
    },
    {
      department: 'production',
      departmentDisplayName: 'Production',
      whygoNumber: 1,
      goalText: 'Establish platform-tracked handoff system for 4 handoffs',
      connectionType: 'Strong',
      connectionDescription: 'Platform must track handoffs to scale without manual coordination',
      owner: 'Wayan Palmieri, SVP Production'
    },
    {
      department: 'generative',
      departmentDisplayName: 'Generative Engineering',
      whygoNumber: 3,
      goalText: 'Expand Generative Platform as one of three pillars with internal tools and Kartel Labs',
      connectionType: 'Strong',
      connectionDescription: 'Generative Platform is pillar #3; internal tools multiply capacity',
      owner: 'Fill Isgro, SVP Generative'
    }
  ]
};
