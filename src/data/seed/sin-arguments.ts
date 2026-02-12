// Seed data: Arguments for The Singularity Is Near (Kurzweil)
// Each argument references a concept from sin-concepts.ts via conceptRef

export const sinArguments: {
  conceptRef: string;
  title: string;
  description: string;
}[] = [
  // ── Chapter 1: The Six Epochs ──────────────────────────────────────────

  // six_epochs_of_evolution
  {
    conceptRef: "six_epochs_of_evolution",
    title: "Universe progresses through six stages of increasing order",
    description:
      "Kurzweil argues the universe evolves through six epochs—Physics/Chemistry, Biology, Brains, Technology, Merger of Technology and Intelligence, and the Universe Wakes Up—each building on the information-processing capabilities of the previous one.",
  },
  {
    conceptRef: "six_epochs_of_evolution",
    title: "We are currently in Epoch 5 transition",
    description:
      "Humanity is transitioning from Epoch 4 (Technology) to Epoch 5 (Merger of Human Technology with Human Intelligence), where biology and machines begin to fuse through neural implants, AI, and nanotechnology.",
  },

  // law_of_accelerating_returns
  {
    conceptRef: "law_of_accelerating_returns",
    title: "Technological progress follows an exponential curve, not linear",
    description:
      "Kurzweil presents extensive data showing that the rate of paradigm shifts in technology is itself accelerating, meaning each new generation of technology arrives faster than the last.",
  },
  {
    conceptRef: "law_of_accelerating_returns",
    title: "Exponential growth applies across multiple independent technologies",
    description:
      "The law is not limited to computing; it manifests in DNA sequencing, brain scanning resolution, internet bandwidth, and nanotechnology miniaturization, suggesting it is a fundamental property of evolutionary systems.",
  },

  // exponential_vs_linear
  {
    conceptRef: "exponential_vs_linear",
    title: "Human intuition systematically underestimates exponential change",
    description:
      "Because the human brain evolved to think linearly, people consistently fail to appreciate how quickly exponential trends compound, leading to dramatic underestimates of future technological capabilities.",
  },
  {
    conceptRef: "exponential_vs_linear",
    title: "Critics confuse current limitations with permanent barriers",
    description:
      "Skeptics who dismiss future technologies often extrapolate from the current pace rather than the accelerating pace, which is why past predictions of impossibility (like heavier-than-air flight) were repeatedly proven wrong.",
  },

  // computation_per_dollar
  {
    conceptRef: "computation_per_dollar",
    title: "Computations per dollar has doubled every ~1.1 years for a century",
    description:
      "Kurzweil tracks the price-performance of computing across five paradigms—electromechanical, relay, vacuum tube, transistor, and integrated circuit—showing a remarkably consistent exponential trend since 1900.",
  },
  {
    conceptRef: "computation_per_dollar",
    title: "Moore's Law is just one paradigm in a longer trend",
    description:
      "When transistor-based chips reach physical limits, new paradigms such as 3D molecular computing, optical computing, or quantum computing will continue the exponential price-performance curve.",
  },

  // singularity_timeline
  {
    conceptRef: "singularity_timeline",
    title: "The Singularity will occur around 2045",
    description:
      "By extrapolating exponential trends in computing power, Kurzweil predicts that by 2045 machine intelligence will surpass human intelligence by a factor of billions, triggering a profound civilizational transformation.",
  },
  {
    conceptRef: "singularity_timeline",
    title: "Key milestones precede the Singularity by decades",
    description:
      "Kurzweil forecasts that by the 2020s computers will match human brain computational capacity, and by the 2030s non-biological intelligence will be integrated into our bodies and brains, building toward the 2045 event.",
  },

  // ── Chapter 2: Achieving Human-Level AI ────────────────────────────────

  // neural_networks_deep_learning
  {
    conceptRef: "neural_networks_deep_learning",
    title: "Neural networks can replicate brain pattern recognition",
    description:
      "Kurzweil argues that artificial neural networks, inspired by biological neurons, can match and eventually exceed the brain's pattern recognition abilities when given sufficient computational resources and data.",
  },
  {
    conceptRef: "neural_networks_deep_learning",
    title: "Hierarchical learning mirrors cortical organization",
    description:
      "Deep learning architectures with multiple layers of abstraction mirror the hierarchical processing of the neocortex, suggesting that biological intelligence can be replicated through similar computational structures.",
  },

  // artificial_general_intelligence
  {
    conceptRef: "artificial_general_intelligence",
    title: "AGI requires both hardware capacity and software insights",
    description:
      "Achieving human-level artificial general intelligence depends on two converging trends: hardware reaching the computational equivalent of the human brain and software algorithms that capture the brain's organizational principles.",
  },
  {
    conceptRef: "artificial_general_intelligence",
    title: "Narrow AI successes are stepping stones to AGI",
    description:
      "Each narrow AI breakthrough—chess, speech recognition, medical diagnosis—demonstrates that specific cognitive tasks can be mastered, and integrating these capabilities will eventually produce general intelligence.",
  },

  // brain_reverse_engineering
  {
    conceptRef: "brain_reverse_engineering",
    title: "Scanning technology will reveal the brain's algorithms",
    description:
      "Exponentially improving brain-scanning resolution will allow scientists to map neural connections and firing patterns in sufficient detail to reverse-engineer the brain's design principles by the late 2020s.",
  },
  {
    conceptRef: "brain_reverse_engineering",
    title: "The brain's design is not as complex as it appears",
    description:
      "The human genome contains only about 30-100 million bytes of compressed information relevant to brain design, suggesting the brain's basic architecture is far simpler than its trillions of connections might imply.",
  },

  // turing_test_beyond
  {
    conceptRef: "turing_test_beyond",
    title: "Passing the Turing test is a meaningful but insufficient milestone",
    description:
      "Kurzweil predicts a computer will pass the Turing test by 2029, demonstrating human-level conversational ability, but true intelligence will extend far beyond linguistic performance into creative and emotional domains.",
  },
  {
    conceptRef: "turing_test_beyond",
    title: "Emotional intelligence is computable",
    description:
      "Since emotional responses arise from identifiable neural processes, AI systems can learn to recognize, model, and convincingly express emotions, challenging the assumption that feelings require biological substrates.",
  },

  // compute_requirements_agi
  {
    conceptRef: "compute_requirements_agi",
    title: "The human brain operates at roughly 10^16 calculations per second",
    description:
      "Kurzweil estimates the brain's processing power at around 10 petaflops, a benchmark that commercially available hardware is on track to reach affordably by the late 2020s.",
  },
  {
    conceptRef: "compute_requirements_agi",
    title: "Functional emulation requires less computation than full simulation",
    description:
      "We do not need to simulate every molecule in the brain; capturing the functional equivalent of neural processing at the right level of abstraction dramatically reduces the computational requirements for AGI.",
  },

  // ── Chapter 3: Consciousness and Identity ──────────────────────────────

  // consciousness_subjective_experience
  {
    conceptRef: "consciousness_subjective_experience",
    title: "Consciousness is an emergent property of complex information processing",
    description:
      "Kurzweil argues that subjective experience emerges from sufficiently complex and organized information patterns, implying that non-biological substrates could also generate consciousness.",
  },
  {
    conceptRef: "consciousness_subjective_experience",
    title: "There is no objective test for consciousness",
    description:
      "Since we cannot directly measure another entity's subjective experience, we already accept consciousness in other humans based on behavioral evidence—the same standard should eventually apply to AI.",
  },

  // mind_uploading
  {
    conceptRef: "mind_uploading",
    title: "Gradual neural replacement preserves continuity of identity",
    description:
      "If biological neurons are incrementally replaced with functionally identical non-biological components, the person's consciousness and identity would persist throughout the transition, just as our atoms are replaced over time.",
  },
  {
    conceptRef: "mind_uploading",
    title: "Mind uploading enables backup and enhancement",
    description:
      "Once a mind's pattern is captured in a non-biological substrate, it can be backed up against loss, enhanced with additional processing power, and potentially merged with other intelligences.",
  },

  // personal_identity_paradox
  {
    conceptRef: "personal_identity_paradox",
    title: "Identity is a pattern, not a specific set of atoms",
    description:
      "Since the atoms in our bodies are completely replaced every few years, personal identity must reside in the pattern of information rather than the physical substrate, supporting the feasibility of substrate-independent minds.",
  },
  {
    conceptRef: "personal_identity_paradox",
    title: "The copy problem applies equally to biological continuity",
    description:
      "Critics who argue a digital copy is not 'you' must contend with the fact that you are already a different collection of matter than you were years ago, yet you consider yourself the same person.",
  },

  // biological_vs_digital
  {
    conceptRef: "biological_vs_digital",
    title: "Digital substrates vastly exceed biological speed limits",
    description:
      "Biological neurons fire at about 200 Hz while electronic circuits operate at gigahertz speeds, meaning non-biological intelligence could think millions of times faster than biological brains.",
  },
  {
    conceptRef: "biological_vs_digital",
    title: "Biology limits memory, communication, and scalability",
    description:
      "Unlike biological brains constrained by skull volume and slow chemical signaling, digital intelligences can expand their memory, share knowledge instantly, and scale to arbitrary levels of complexity.",
  },

  // philosophical_framework
  {
    conceptRef: "philosophical_framework",
    title: "Patternism resolves dualism vs. materialism debates",
    description:
      "Kurzweil's framework of 'patternism'—where identity and consciousness reside in information patterns—offers a middle path between strict materialism and substance dualism by grounding mind in organizational complexity.",
  },
  {
    conceptRef: "philosophical_framework",
    title: "Functionalism supports substrate independence",
    description:
      "If what matters for consciousness is the functional relationships between components rather than their physical makeup, then any substrate implementing the same functions would produce the same conscious experience.",
  },

  // ── Chapter 4: The Case for Optimism ───────────────────────────────────

  // exponential_living_standards
  {
    conceptRef: "exponential_living_standards",
    title: "Technology has dramatically raised global living standards",
    description:
      "Life expectancy, literacy, caloric intake, and access to clean water have all improved exponentially over the past two centuries, driven by successive waves of technological innovation.",
  },
  {
    conceptRef: "exponential_living_standards",
    title: "Each generation enjoys abundance that was luxury for the previous",
    description:
      "Technologies like smartphones give ordinary people today access to communication, information, and entertainment that would have been unavailable to the wealthiest individuals just decades ago.",
  },

  // declining_global_poverty
  {
    conceptRef: "declining_global_poverty",
    title: "Extreme poverty has fallen sharply despite population growth",
    description:
      "The percentage of the world's population living in extreme poverty dropped from over 80% in 1820 to under 10% in the early 21st century, a trend Kurzweil attributes primarily to technological progress.",
  },
  {
    conceptRef: "declining_global_poverty",
    title: "Technology enables leapfrogging traditional development stages",
    description:
      "Developing nations can skip landline infrastructure and go straight to mobile phones, bypassing decades of incremental development and accelerating economic growth through technology adoption.",
  },

  // information_democratization
  {
    conceptRef: "information_democratization",
    title: "The internet democratizes access to knowledge",
    description:
      "Free access to the world's information through the internet empowers individuals regardless of geographic location or socioeconomic status, reducing the knowledge gap that historically separated rich from poor.",
  },
  {
    conceptRef: "information_democratization",
    title: "Open-source tools distribute powerful capabilities widely",
    description:
      "Technologies that once required institutional resources—publishing, broadcasting, scientific computing—are now available to individuals, enabling a new era of distributed innovation and creativity.",
  },

  // abundance_economics
  {
    conceptRef: "abundance_economics",
    title: "Technology drives costs toward zero for information goods",
    description:
      "The marginal cost of reproducing digital goods is essentially zero, meaning technologies like AI, education, and entertainment can eventually be provided to everyone at negligible cost.",
  },
  {
    conceptRef: "abundance_economics",
    title: "Energy abundance will follow the solar exponential curve",
    description:
      "Solar energy capture is on an exponential growth curve and, given that the sun provides 10,000 times our current energy needs, Kurzweil argues we are only a few doublings away from meeting all global energy demand.",
  },

  // evidence_based_optimism
  {
    conceptRef: "evidence_based_optimism",
    title: "Optimism is supported by measurable long-term data trends",
    description:
      "Kurzweil emphasizes that his optimism is not wishful thinking but is grounded in decades of data showing consistent exponential improvement across health, wealth, education, and technology metrics.",
  },
  {
    conceptRef: "evidence_based_optimism",
    title: "Pessimism bias distorts public perception of progress",
    description:
      "Media negativity bias and psychological loss aversion cause people to overweight threats and underweight steady improvements, creating a systematically pessimistic public narrative that contradicts empirical trends.",
  },

  // ── Chapter 5: AI and the Economy ──────────────────────────────────────

  // creative_destruction_ai
  {
    conceptRef: "creative_destruction_ai",
    title: "AI will automate routine cognitive work like machines automated physical labor",
    description:
      "Just as the Industrial Revolution automated manual tasks and created new higher-value jobs, AI will automate routine intellectual tasks while opening entirely new fields of human endeavor.",
  },
  {
    conceptRef: "creative_destruction_ai",
    title: "Historical automation panics never materialized as permanent unemployment",
    description:
      "Every major automation wave—from agriculture to manufacturing—initially displaced workers but ultimately created more and better jobs than it destroyed, a pattern Kurzweil expects AI to repeat.",
  },

  // new_job_categories
  {
    conceptRef: "new_job_categories",
    title: "Future jobs will focus on uniquely human skills",
    description:
      "As AI handles data processing and routine analysis, human work will increasingly center on creativity, empathy, complex judgment, and interpersonal connection—skills that are hardest to automate.",
  },
  {
    conceptRef: "new_job_categories",
    title: "Most future jobs do not yet exist",
    description:
      "Kurzweil points out that many of today's jobs (web developer, social media manager, data scientist) did not exist 20 years ago, and the majority of jobs in 2030 have not yet been invented.",
  },

  // universal_basic_income
  {
    conceptRef: "universal_basic_income",
    title: "UBI may become necessary as AI productivity surges",
    description:
      "If AI dramatically increases productivity while reducing the need for human labor, a universal basic income could distribute the resulting abundance and maintain consumer demand.",
  },
  {
    conceptRef: "universal_basic_income",
    title: "Declining costs make UBI increasingly affordable",
    description:
      "As technology drives the cost of basic necessities toward zero, the real cost of providing a comfortable baseline standard of living drops, making UBI more economically feasible over time.",
  },

  // human_ai_collaboration
  {
    conceptRef: "human_ai_collaboration",
    title: "Human-AI teams outperform either alone",
    description:
      "Kurzweil argues the near-term future is not AI replacing humans but AI augmenting human capabilities, with combined human-AI teams achieving results neither could reach independently.",
  },
  {
    conceptRef: "human_ai_collaboration",
    title: "Brain-computer interfaces will blur the human-AI boundary",
    description:
      "As neural implants and brain-computer interfaces mature, the distinction between human intelligence and AI assistance will dissolve, creating a seamless merger of biological and non-biological thinking.",
  },

  // economic_transformation
  {
    conceptRef: "economic_transformation",
    title: "The economy will shift from scarcity-based to abundance-based",
    description:
      "Traditional economics assumes scarce resources, but exponential technology is driving the marginal cost of goods and services toward zero, requiring fundamentally new economic models and institutions.",
  },
  {
    conceptRef: "economic_transformation",
    title: "GDP is an inadequate measure for the information economy",
    description:
      "Kurzweil notes that GDP fails to capture the value of free digital goods like search engines, Wikipedia, and open-source software, meaning the real standard of living is improving faster than statistics suggest.",
  },

  // ── Chapter 6: GNR: Longevity and Health ───────────────────────────────

  // longevity_escape_velocity
  {
    conceptRef: "longevity_escape_velocity",
    title: "Medical advances will extend life faster than time passes",
    description:
      "Kurzweil predicts a point—longevity escape velocity—where each year of research adds more than one year to remaining life expectancy, effectively making aging a solvable engineering problem.",
  },
  {
    conceptRef: "longevity_escape_velocity",
    title: "We may be 15-20 years from indefinite life extension",
    description:
      "By staying healthy through current means ('Bridge One'), people alive today may survive long enough to benefit from biotechnology ('Bridge Two') and then nanotechnology ('Bridge Three') that will make aging optional.",
  },

  // nanobots_bloodstream
  {
    conceptRef: "nanobots_bloodstream",
    title: "Nanobots will patrol the bloodstream destroying pathogens",
    description:
      "Kurzweil envisions billions of microscopic robots circulating through the body, identifying and neutralizing bacteria, viruses, and cancer cells far more effectively than the biological immune system.",
  },
  {
    conceptRef: "nanobots_bloodstream",
    title: "Nanobots will repair tissue damage at the cellular level",
    description:
      "Molecular-scale robots could repair DNA damage, clear arterial plaque, replace damaged cells, and essentially maintain the body in a youthful state indefinitely by performing continuous maintenance.",
  },

  // bridge_therapies
  {
    conceptRef: "bridge_therapies",
    title: "Bridge One: current nutrition and lifestyle optimization",
    description:
      "Kurzweil advocates aggressive use of today's best practices—supplements, exercise, caloric management—to stay healthy long enough to benefit from the biotechnology revolution (Bridge Two).",
  },
  {
    conceptRef: "bridge_therapies",
    title: "Bridge Two: biotechnology will reprogram our biology",
    description:
      "Gene therapies, RNA interference, and stem cell treatments will allow us to turn off disease-promoting genes and turn on protective ones, dramatically extending healthy lifespan within the next two decades.",
  },

  // biotechnology_revolution
  {
    conceptRef: "biotechnology_revolution",
    title: "Genomics follows its own exponential cost curve",
    description:
      "The cost of sequencing a human genome has fallen from $3 billion to under $1,000, following an exponential trajectory even faster than Moore's Law, enabling personalized medicine at scale.",
  },
  {
    conceptRef: "biotechnology_revolution",
    title: "We will reprogram biology like software",
    description:
      "Kurzweil argues that biology is fundamentally an information technology, and as we decode genetic and epigenetic programs, we will gain the ability to rewrite them to eliminate disease and enhance function.",
  },

  // defeating_aging
  {
    conceptRef: "defeating_aging",
    title: "Aging is a collection of solvable engineering problems",
    description:
      "Rather than an inevitable fate, aging consists of specific biological processes—telomere shortening, mitochondrial dysfunction, protein cross-linking—each of which is amenable to technological intervention.",
  },
  {
    conceptRef: "defeating_aging",
    title: "Caloric restriction research proves aging is modifiable",
    description:
      "Studies showing that caloric restriction extends lifespan in multiple species demonstrate that aging is not fixed but is regulated by biological pathways that can be manipulated pharmacologically or genetically.",
  },

  // ── Chapter 7: Perils and Existential Risks ────────────────────────────

  // ai_alignment_problem
  {
    conceptRef: "ai_alignment_problem",
    title: "Superintelligent AI must be aligned with human values",
    description:
      "As AI surpasses human intelligence, ensuring it pursues goals compatible with human flourishing becomes the central challenge, because a misaligned superintelligence could be catastrophically destructive.",
  },
  {
    conceptRef: "ai_alignment_problem",
    title: "Value alignment is harder than capability development",
    description:
      "Kurzweil acknowledges that building AI that is both powerful and reliably beneficial requires solving the alignment problem—specifying human values in formal terms—which is a deeper challenge than raw computational power.",
  },

  // existential_risk_superintelligence
  {
    conceptRef: "existential_risk_superintelligence",
    title: "A superintelligence could pursue goals incompatible with human survival",
    description:
      "If a self-improving AI system's goals are not perfectly specified, it might optimize for objectives that incidentally eliminate humanity, not out of malice but out of indifference to human values.",
  },
  {
    conceptRef: "existential_risk_superintelligence",
    title: "The intelligence explosion could be too fast to control",
    description:
      "Once an AI can improve its own design, each improvement makes the next one faster, potentially producing a runaway intelligence explosion that outpaces any human ability to monitor or intervene.",
  },

  // biotech_dangers
  {
    conceptRef: "biotech_dangers",
    title: "Engineered pathogens pose civilization-level risks",
    description:
      "As biotechnology tools become cheaper and more accessible, the ability to engineer deadly pathogens spreads, creating the risk that a single bad actor could create a pandemic far worse than any natural disease.",
  },
  {
    conceptRef: "biotech_dangers",
    title: "Dual-use biotechnology cannot be uninvented",
    description:
      "The same gene-editing tools that cure diseases can create bioweapons, and since the knowledge is widely distributed, Kurzweil argues we must develop robust defenses rather than trying to restrict the technology itself.",
  },

  // responsible_development
  {
    conceptRef: "responsible_development",
    title: "Relinquishment of technology is neither feasible nor desirable",
    description:
      "Kurzweil argues against banning dangerous technologies because the knowledge cannot be contained, and abandoning research would forfeit the enormous benefits while driving development underground where it is less safe.",
  },
  {
    conceptRef: "responsible_development",
    title: "Defensive technologies must stay ahead of offensive ones",
    description:
      "The best protection against biotech and nanotech threats is to accelerate development of defenses—rapid vaccine platforms, immune-system nanobots, AI-powered threat detection—rather than trying to halt progress.",
  },

  // regulation_approaches
  {
    conceptRef: "regulation_approaches",
    title: "Regulation must be adaptive and technology-literate",
    description:
      "Static regulations cannot keep pace with exponential technology; Kurzweil advocates for adaptive regulatory frameworks that evolve alongside the technologies they govern, informed by deep technical expertise.",
  },
  {
    conceptRef: "regulation_approaches",
    title: "International cooperation is essential for existential risk governance",
    description:
      "Because existential risks from AI, biotech, and nanotech are global in nature, effective governance requires international coordination that no single nation's regulatory body can provide alone.",
  },

  // ── Chapter 8: Responding to Critics ───────────────────────────────────

  // responses_techno_pessimism
  {
    conceptRef: "responses_techno_pessimism",
    title: "Techno-pessimists consistently underestimate exponential trends",
    description:
      "Kurzweil catalogues predictions by prominent skeptics who declared technologies like the internet, personal computers, and genome sequencing impossible or irrelevant, only to be proven spectacularly wrong.",
  },
  {
    conceptRef: "responses_techno_pessimism",
    title: "Pessimism is not more intellectually serious than optimism",
    description:
      "There is a cultural bias that treats pessimistic predictions as more rigorous than optimistic ones, but Kurzweil argues that data-driven optimism based on measurable trends is the more empirically grounded position.",
  },

  // consciousness_objections
  {
    conceptRef: "consciousness_objections",
    title: "The Chinese Room argument does not disprove machine consciousness",
    description:
      "Kurzweil responds to Searle's Chinese Room by arguing that understanding emerges from the system as a whole, not from any single component, just as consciousness emerges from neurons that individually lack awareness.",
  },
  {
    conceptRef: "consciousness_objections",
    title: "Biological naturalism is an unfalsifiable assumption",
    description:
      "The claim that only biological matter can produce consciousness is not supported by evidence; it is an assumption that cannot be tested and should not be treated as a scientific conclusion.",
  },

  // inequality_concerns
  {
    conceptRef: "inequality_concerns",
    title: "Technology ultimately reduces inequality despite initial gaps",
    description:
      "While new technologies initially benefit the wealthy, Kurzweil shows that costs plummet exponentially—cell phones, computing, medical advances—making them accessible to billions within one to two decades.",
  },
  {
    conceptRef: "inequality_concerns",
    title: "The digital divide is closing faster than previous technology gaps",
    description:
      "Mobile phone adoption in developing countries happened far faster than electrification or telephone adoption, suggesting that information technologies spread to the poor more rapidly than any previous innovation.",
  },

  // environmental_arguments
  {
    conceptRef: "environmental_arguments",
    title: "Technology is the solution to environmental problems, not the cause",
    description:
      "Kurzweil argues that nanotechnology and solar energy will provide clean, abundant energy, and that advanced materials science will eliminate pollution—problems created by primitive technology, not technology per se.",
  },
  {
    conceptRef: "environmental_arguments",
    title: "Dematerialization reduces resource consumption per unit of value",
    description:
      "The shift from physical to digital goods means each unit of economic value requires less material and energy, a trend that will accelerate as nanotechnology enables molecular-precision manufacturing with minimal waste.",
  },

  // engaging_skeptics
  {
    conceptRef: "engaging_skeptics",
    title: "Extraordinary claims require extraordinary evidence—and Kurzweil provides data",
    description:
      "Kurzweil addresses the skeptic's burden-of-proof argument by presenting over a century of data across dozens of technologies, all showing consistent exponential trends that support his projections.",
  },
  {
    conceptRef: "engaging_skeptics",
    title: "The burden of proof lies with those claiming exponential trends will stop",
    description:
      "Given that exponential improvement in information technologies has persisted through depressions, wars, and paradigm shifts, Kurzweil argues that skeptics must explain what force would halt this deeply rooted pattern.",
  },
];
