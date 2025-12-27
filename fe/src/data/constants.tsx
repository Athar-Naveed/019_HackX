import {
  BlocksIcon,
  BoxIcon,
  Building2Icon,
  DotSquareIcon,
  Info,
  LucidePocket,
  Settings,
  UserCircle2,
} from "lucide-react";

// export const userDropdown = [
//   {
//     title: "Edit Profile",
//     icon: UserCircle2,
//     href: "#",
//   },
//   {
//     title: "Settings",
//     icon: Settings,
//     href: "#",
//   },
//   {
//     title: "Support",
//     icon: Info,
//     href: "#",
//   },
// ];

export const sidebarMenu = [
  // {
  //   title: "Owner",
  //   subList: [
  //     {
  //       title: "Add Employee/Owner",
  //       icon: UserCircle2, // 👈 only component reference
  //       href: "addEmployee",
  //     },
  //   ],
  // },
  {
    title: "Menu",
    subList: [
      { title: "Dashboard", icon: BlocksIcon, href: "dashboard" },
      {
        title: "Create a Dukaan",
        icon: Building2Icon,
        href: "createOrg",
      },
      { title: "Orders", icon: BoxIcon, href: "orders" },
      { title: "Inventory", icon: DotSquareIcon, href: "inventory" },
      // { title: "Pockets", icon: LucidePocket, href: "pockets" },
    ],
  },
  // {
  //   title: "Extras",
  //   subList: [{ title: "Notebook", icon: DotSquareIcon, href: "notebook" }],
  // },
];

export const orgTypes = [
  {
    title: "Sole Proprietorship",
    desc: "1. Owned and run by a single individual. \n\
\
2. No legal separation between owner and business. \n\
\
3. Simple to form but owner bears all liabilities.",
  },
  {
    title: "Partnership",
    desc: "Formed by two or more individuals. \n\
\
Governed by the Partnership Act, 1932. \n\
\
Types: \n\
\
1, General Partnership\n\
\
2. Limited Partnership\n\
\
3. Limited Liability Partnership (LLP)",
  },
  {
    title: "Private Limited Company",
    desc: "Registered under the Companies Act, 2017.\n\
\
1. Separate legal entity.\n\
\
2. Limited liability of shareholders.\n\
\
3. Cannot invite public to subscribe shares.",
  },
  {
    title: "Public Limited Company",
    desc: "Can offer shares to the public.\n\
\
Must comply with SECP regulations.\n\
\
Two types:\n\
\
1. Listed\n\
\
2. Unlisted",
  },
  {
    title: "Non-Profit / NGO",
    desc: "Registered under Section 42 of the Companies Act, 2017.\n\
\
1. Charitable or social purpose.\n\
\
2. Cannot distribute profit to members.",
  },
  {
    title: "Trust",
    desc: "Governed by the Trust Act, 1882.\n \
\
1. Established for a specific objective (e.g. education, religion).\n \
\
2. Assets held and managed by trustees.",
  },
  {
    title: "Society",
    desc: "Registered under the Societies Registration Act, 1860.\n\
\
Often used for cultural, literary, scientific or charitable purposes.",
  },
  {
    title: "Cooperative Society",
    desc: "Registered under the Cooperative Societies Act, 1925.\n\
\
Voluntary association for mutual benefit, like housing or credit societies.",
  },
  {
    title: "Government / Semi-Government Organization",
    desc: "Fully or partly owned by the state.\n\
\
Includes public sector corporations and autonomous bodies.",
  },
];

export const unitOptions = [
  { label: "kg", value: "kg" },
  { label: "g", value: "g" },
  { label: "liters", value: "liters" },
  { label: "pieces", value: "pieces" },
];

export const pocketOptions = [
  { label: "Personal", value: "Personal" },
  { label: "Business", value: "Business" },
];
export const orderStatusOptions = [
  { label: "Pending", value: "Pending" },
  { label: "Processing", value: "Processing" },
  { label: "In Transit", value: "In Transit" },
  { label: "Completed", value: "Completed" },
  { label: "Return", value: "Return" },
];

import { FeatureType, StatType, StepType } from "@/types";
import {
  Award,
  BarChart3,
  Bell,
  CheckCircle2,
  DollarSign,
  Download,
  ListTodo,
  PieChart,
  Settings2,
  Shield,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

export const features: FeatureType[] = [
  {
    icon: Wallet,
    title: "Expense Tracking",
    description:
      "Easily track and categorize your expenses with our intuitive interface. Get real-time updates on your spending habits.",
  },
  {
    icon: ListTodo,
    title: "Task Management",
    description:
      "Organize your tasks, set priorities, and never miss a deadline. Seamlessly integrate your to-dos with your financial goals.",
  },
  {
    icon: PieChart,
    title: "Budget Planning",
    description:
      "Create custom budgets, set spending limits, and receive alerts when you're approaching your threshold.",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description:
      "Get timely reminders for bill payments, task deadlines, and budget alerts to stay on top of your commitments.",
  },
  {
    icon: TrendingUp,
    title: "Financial Analytics",
    description:
      "Gain insights into your spending patterns with detailed reports and visualizations. Make informed decisions about your money.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your data is protected with bank-level security. We prioritize your privacy and never share your information.",
  },
];

export const steps: StepType[] = [
  {
    icon: Download,
    title: "1. Sign Up & Import",
    description:
      "Create your account and import your expenses from your bank or manually add them.",
  },
  {
    icon: Settings2,
    title: "2. Customize & Organize",
    description:
      "Set up your categories, budgets, and task lists according to your needs.",
  },
  {
    icon: BarChart3,
    title: "3. Track & Analyze",
    description:
      "Monitor your spending, complete tasks, and gain insights from detailed analytics.",
  },
];

export const stats: StatType[] = [
  {
    icon: Users,
    value: "50K+",
    label: "Active Users",
  },
  {
    icon: DollarSign,
    value: "$10M+",
    label: "Expenses Tracked",
  },
  {
    icon: CheckCircle2,
    value: "1M+",
    label: "Tasks Completed",
  },
  {
    icon: Award,
    value: "4.9/5",
    label: "User Rating",
  },
];
