import { LucideIcon, Package, TrendingUp, Sparkles, Server, Users } from 'lucide-react';
import { ProductionCustomContent } from '@/components/department/custom/production/ProductionCustomContent';
import { SalesCustomContent } from '@/components/department/custom/sales/SalesCustomContent';
import { CommunityCustomContent } from '@/components/department/custom/community/CommunityCustomContent';
import { PlatformCustomContent } from '@/components/department/custom/platform/PlatformCustomContent';
import { GenerativeCustomContent } from '@/components/department/custom/generative/GenerativeCustomContent';

export interface DepartmentConfig {
  name: string;
  displayName: string;
  icon: LucideIcon;
  colorScheme: string;
  description: string;
  customSections?: React.ComponentType;
}

export const DEPARTMENT_CONFIGS: Record<string, DepartmentConfig> = {
  production: {
    name: 'production',
    displayName: 'Production',
    icon: Package,
    colorScheme: 'from-orange-600 to-amber-700',
    description: 'Platform-tracked handoff systems scaling from 6 to 20 active client engagements',
    customSections: ProductionCustomContent,
  },
  sales: {
    name: 'sales',
    displayName: 'Sales',
    icon: TrendingUp,
    colorScheme: 'from-green-600 to-emerald-700',
    description: 'Enterprise client acquisition and revenue growth',
    customSections: SalesCustomContent,
  },
  generative: {
    name: 'generative',
    displayName: 'Generative',
    icon: Sparkles,
    colorScheme: 'from-purple-600 to-violet-700',
    description: 'AI content generation and technical pod operations',
    customSections: GenerativeCustomContent,
  },
  platform: {
    name: 'platform',
    displayName: 'Platform',
    icon: Server,
    colorScheme: 'from-teal-600 to-cyan-700',
    description: 'Three-pillar platform infrastructure and integration',
    customSections: PlatformCustomContent,
  },
  community: {
    name: 'community',
    displayName: 'Community',
    icon: Users,
    colorScheme: 'from-blue-600 to-indigo-700',
    description: 'Discord community and talent pipeline development',
    customSections: CommunityCustomContent,
  },
};
