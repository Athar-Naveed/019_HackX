export const stockSuggestions = [
  {
    title: "Invest in Systems Limited (SYS) - PSX",
    description:
      "Systems Limited shows strong growth potential in the technology sector. Consider allocating 5-10% of your portfolio to this PSX-listed company for long-term gains.",
  },
  {
    title: "Add Oil & Gas Development (OGDC) to Portfolio",
    description:
      "OGDC is a stable energy sector stock on PSX. Its consistent dividends and market position make it a reliable addition to your investment strategy.",
  },
  {
    title: "Explore Pakistan Petroleum Limited (PPL)",
    description:
      "PPL demonstrates solid performance in the energy market. This PSX stock could provide stability and moderate returns for conservative investors.",
  },
  {
    title: "Consider Lucky Cement (LUCK) Investment",
    description:
      "Lucky Cement has shown resilience in the cement sector. With Pakistan's infrastructure growth, this PSX stock offers promising dividend yields.",
  },
];

export const expenseSuggestions = [
  {
    title: "Control your monthly expenses",
    description:
      "Review your last 3 months' spending patterns. Identify non-essential expenses and create a budget to save 15-20% of your monthly income.",
  },
  {
    title: "Optimize subscription services",
    description:
      "Audit all your subscriptions (Netflix, gym, etc.). Cancel unused services and negotiate better rates for essential ones to free up cash flow.",
  },
  {
    title: "Reduce dining out expenses",
    description:
      "Limit restaurant meals to 2-3 times per week. Cook at home more often and pack office lunches to save significantly on food costs.",
  },
  {
    title: "Smart transportation choices",
    description:
      "Consider carpooling, public transport, or cycling for daily commutes. This can reduce transportation costs by 30-50% monthly.",
  },
];

export const financialPlanningSuggestions = [
  {
    title: "Build an emergency fund",
    description:
      "Aim to save 3-6 months of living expenses in a high-yield savings account. This provides security against unexpected financial setbacks.",
  },
  {
    title: "Diversify your investment portfolio",
    description:
      "Don't put all eggs in one basket. Spread investments across stocks, bonds, and mutual funds to minimize risk and maximize returns.",
  },
  {
    title: "Start retirement planning early",
    description:
      "Begin contributing to retirement accounts now. The power of compound interest will work in your favor over the long term.",
  },
  {
    title: "Track and improve credit score",
    description:
      "Monitor your credit score regularly and pay bills on time. A good credit score can save you thousands in interest rates.",
  },
];

interface Suggestion {
  title: string;
  description: string;
}

interface SuggestionSectionProps {
  title: string;
  suggestions: Suggestion[];
  icon: string;
}

const SuggestionSection: React.FC<SuggestionSectionProps> = ({
  title,
  suggestions,
  icon,
}) => (
  <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
    <div className="flex items-center mb-4">
      <span className="text-2xl mr-3">{icon}</span>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
    </div>
    <div className="space-y-4">
      {suggestions.map((suggestion, index) => (
        <div
          key={index}
          className="bg-neutral-900 rounded-lg p-4 border border-neutral-600 hover:border-blue-500 transition-colors"
        >
          <h4 className="text-lg font-medium text-blue-400 mb-2">
            {suggestion.title}
          </h4>
          <p className="text-neutral-300 text-sm leading-relaxed">
            {suggestion.description}
          </p>
        </div>
      ))}
    </div>
  </div>
);

const AiSuggest: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          AI Financial Recommendations
        </h2>
        <p className="text-neutral-400">
          Personalized suggestions to optimize your financial health
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        <SuggestionSection
          title="Stock Investments"
          suggestions={stockSuggestions}
          icon="📈"
        />
        <SuggestionSection
          title="Expense Management"
          suggestions={expenseSuggestions}
          icon="💰"
        />
        <SuggestionSection
          title="Financial Planning"
          suggestions={financialPlanningSuggestions}
          icon="🎯"
        />
      </div>
    </div>
  );
};

export default AiSuggest;
