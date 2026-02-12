/**
 * Quiz Questions Seed Data
 *
 * Covers:
 *   "The Singularity Is Nearer" (SIN) by Ray Kurzweil — chapters sin_ch1 through sin_ch8
 *   "The Sovereign Individual" (SI) by Davidson & Rees-Mogg — chapters si_ch1 through si_ch11
 *   Cross-book comparison questions (bookRef: "cross", chapterRef: null)
 *
 * 126 questions total:
 *   SIN   — 52 questions
 *   SI    — 52 questions
 *   Cross — 22 questions
 *
 * ~70% multiple choice (mc), ~30% short answer (short)
 * ~30% beginner, ~50% intermediate, ~20% advanced
 */

export interface QuizQuestion {
  bookRef: "sin" | "si" | "cross";
  chapterRef: string | null;
  question_type: "mc" | "short";
  question_text: string;
  correct_answer: string;
  option_a?: string;
  option_b?: string;
  option_c?: string;
  option_d?: string;
  explanation: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export const quizQuestions: QuizQuestion[] = [
  // ============================================================
  // THE SINGULARITY IS NEARER (SIN) — 52 Questions
  // ============================================================

  // --- sin_ch1: Six Epochs & Law of Accelerating Returns ---
  {
    bookRef: "sin",
    chapterRef: "sin_ch1",
    question_type: "mc",
    question_text:
      "In Kurzweil's framework, which Epoch represents the merger of human technology with human intelligence?",
    correct_answer: "Epoch 5",
    option_a: "Epoch 3",
    option_b: "Epoch 4",
    option_c: "Epoch 5",
    option_d: "Epoch 6",
    explanation:
      "Epoch 5 describes the point at which technology and human intelligence merge, representing the Singularity itself. Epoch 4 covers technology as a separate force; Epoch 5 is where it fuses with biology.",
    difficulty: "beginner",
  },
  {
    bookRef: "sin",
    chapterRef: "sin_ch1",
    question_type: "mc",
    question_text:
      "The Law of Accelerating Returns predicts that the rate of technological progress is:",
    correct_answer:
      "Exponential, with the rate itself increasing over time",
    option_a: "Linear and steady across centuries",
    option_b: "Exponential, with the rate itself increasing over time",
    option_c: "Logarithmic, slowing as we approach physical limits",
    option_d: "Cyclical, alternating between fast and slow periods",
    explanation:
      "Kurzweil's Law of Accelerating Returns states that progress is not merely exponential but that the exponent itself grows. Each stage of evolution builds on the last, producing faster and faster progress.",
    difficulty: "intermediate",
  },
  {
    bookRef: "sin",
    chapterRef: "sin_ch1",
    question_type: "short",
    question_text:
      "Explain why Kurzweil argues that linear intuition causes people to underestimate future technological change.",
    correct_answer:
      "Humans evolved to think linearly because short-term local changes appear linear. But technology grows exponentially, so projecting current rates forward drastically underestimates compounding growth over decades.",
    explanation:
      "Our brains are wired by evolution to extrapolate linearly from recent experience. Exponential curves look almost flat at the start and then explode, so people chronically underpredict how fast technology will advance.",
    difficulty: "intermediate",
  },
  {
    bookRef: "sin",
    chapterRef: "sin_ch1",
    question_type: "mc",
    question_text:
      "Which of the following best describes the relationship between the Six Epochs?",
    correct_answer:
      "Each epoch's information-processing method becomes the substrate for the next epoch's emergence",
    option_a:
      "They are independent phases that happen to occur in chronological order",
    option_b:
      "Each epoch's information-processing method becomes the substrate for the next epoch's emergence",
    option_c:
      "Later epochs replace earlier ones entirely, making previous substrates obsolete",
    option_d:
      "The epochs describe social changes, not changes in information processing",
    explanation:
      "The epochs are nested: physics and chemistry (Epoch 1) gave rise to biology (Epoch 2), which evolved brains (Epoch 3), which created technology (Epoch 4). Each layer builds on rather than replaces the previous one.",
    difficulty: "intermediate",
  },
  {
    bookRef: "sin",
    chapterRef: "sin_ch1",
    question_type: "mc",
    question_text:
      "Kurzweil uses the price-performance trend of computation to argue that:",
    correct_answer:
      "Computing power per dollar has followed a consistent exponential curve across multiple technology paradigms",
    option_a:
      "Moore's Law will continue indefinitely with silicon-based chips",
    option_b:
      "Computing power per dollar has followed a consistent exponential curve across multiple technology paradigms",
    option_c:
      "Quantum computing is required for the Singularity to arrive on schedule",
    option_d:
      "The exponential trend began only with the invention of the transistor",
    explanation:
      "Kurzweil shows that exponential growth in computation predates Moore's Law and has persisted through electromechanical, relay, vacuum tube, transistor, and integrated circuit paradigms.",
    difficulty: "beginner",
  },
  {
    bookRef: "sin",
    chapterRef: "sin_ch1",
    question_type: "short",
    question_text:
      "What is Epoch 6 in Kurzweil's framework, and why does he consider it the ultimate destination of accelerating returns?",
    correct_answer:
      "Epoch 6 is 'The Universe Wakes Up,' where intelligence saturates matter and energy throughout the cosmos. It is the ultimate destination because exponential growth in computation eventually requires harnessing resources at a cosmic scale.",
    explanation:
      "Once intelligence has merged with technology and expanded beyond Earth, the logical conclusion of accelerating returns is that intelligence permeates all available matter and energy in the universe.",
    difficulty: "advanced",
  },
  {
    bookRef: "sin",
    chapterRef: "sin_ch1",
    question_type: "mc",
    question_text:
      "Which epoch corresponds to the emergence of biological life and DNA?",
    correct_answer: "Epoch 2",
    option_a: "Epoch 1",
    option_b: "Epoch 2",
    option_c: "Epoch 3",
    option_d: "Epoch 4",
    explanation:
      "Epoch 2 is defined by the evolution of biology and DNA, which enabled information to be stored and replicated in living organisms.",
    difficulty: "beginner",
  },

  // --- sin_ch2: AI, Neural Networks, AGI, BCIs ---
  {
    bookRef: "sin",
    chapterRef: "sin_ch2",
    question_type: "mc",
    question_text:
      "According to Kurzweil, what architectural insight made modern deep learning dramatically more capable than earlier neural networks?",
    correct_answer:
      "Adding many hidden layers (depth) plus massive training data and compute",
    option_a: "Switching from digital to analog computation",
    option_b:
      "Adding many hidden layers (depth) plus massive training data and compute",
    option_c: "Replacing backpropagation with genetic algorithms",
    option_d: "Modeling every individual biological neuron precisely",
    explanation:
      "Deep learning's breakthrough came from architectures with many hidden layers trained on large datasets with abundant compute. The basic idea of neural nets existed for decades, but depth, data, and compute transformed their performance.",
    difficulty: "beginner",
  },
  {
    bookRef: "sin",
    chapterRef: "sin_ch2",
    question_type: "mc",
    question_text:
      "Kurzweil discusses large language models (LLMs) primarily as evidence that:",
    correct_answer:
      "AI can acquire broad world knowledge and reasoning ability from pattern recognition at scale",
    option_a:
      "Symbolic AI has been proven superior to connectionist approaches",
    option_b:
      "AI can acquire broad world knowledge and reasoning ability from pattern recognition at scale",
    option_c:
      "True intelligence requires embodiment in a physical robot",
    option_d:
      "Language modeling is a dead end that cannot generalize beyond text",
    explanation:
      "Kurzweil sees LLMs as validating the idea that scaling neural networks produces emergent capabilities. Their ability to reason, translate, and generate creative content from training on text supports his broader thesis about AI progress.",
    difficulty: "intermediate",
  },
  {
    bookRef: "sin",
    chapterRef: "sin_ch2",
    question_type: "short",
    question_text:
      "How does Kurzweil define AGI, and what milestone does he use to mark its arrival?",
    correct_answer:
      "AGI is artificial general intelligence that matches or exceeds human-level performance across essentially all cognitive tasks. Kurzweil marks its arrival by an AI passing a valid Turing Test by 2029.",
    explanation:
      "Kurzweil treats the Turing Test as a practical, if imperfect, benchmark. AGI means the AI is not narrow; it can handle the full breadth of intellectual challenges a human can.",
    difficulty: "beginner",
  },
  {
    bookRef: "sin",
    chapterRef: "sin_ch2",
    question_type: "mc",
    question_text:
      "Brain-computer interfaces (BCIs) play a key role in Kurzweil's Singularity thesis because they:",
    correct_answer:
      "Enable direct augmentation of human cognition with AI, bridging biological and digital intelligence",
    option_a:
      "Are needed to prove that brains are simply biological computers",
    option_b:
      "Enable direct augmentation of human cognition with AI, bridging biological and digital intelligence",
    option_c:
      "Will replace all traditional computer interfaces like keyboards and screens",
    option_d: "Are the only way to treat neurological diseases",
    explanation:
      "BCIs are central to the merger of human and machine intelligence (Epoch 5). They allow humans to expand cognitive capacity by connecting directly to AI, which Kurzweil sees as the core of the Singularity transition.",
    difficulty: "intermediate",
  },
  {
    bookRef: "sin",
    chapterRef: "sin_ch2",
    question_type: "mc",
    question_text:
      "Kurzweil argues that the neocortex processes information using:",
    correct_answer:
      "A hierarchical system of pattern recognizers that can be modeled computationally",
    option_a: "A single centralized processor analogous to a CPU",
    option_b:
      "Quantum effects that cannot be replicated by classical computers",
    option_c:
      "A hierarchical system of pattern recognizers that can be modeled computationally",
    option_d:
      "Chemical signals that are fundamentally different from electrical computation",
    explanation:
      "Drawing on his earlier work, Kurzweil describes the neocortex as roughly 300 million pattern recognizers arranged hierarchically. This architecture inspired and validates deep learning approaches.",
    difficulty: "intermediate",
  },
  {
    bookRef: "sin",
    chapterRef: "sin_ch2",
    question_type: "short",
    question_text:
      "Why does Kurzweil believe that scaling current AI approaches will be sufficient to reach AGI rather than requiring a fundamentally new paradigm?",
    correct_answer:
      "Because exponential growth in compute, data, and architectural refinements has consistently produced emergent capabilities at each scale increase, and the pattern suggests continued scaling will close remaining gaps to human-level performance.",
    explanation:
      "Kurzweil points to the historical pattern where each order-of-magnitude increase in compute and data has unlocked qualitatively new abilities in AI systems, with no fundamental barrier requiring an entirely new approach.",
    difficulty: "advanced",
  },

  // --- sin_ch3: Consciousness, Identity, Mind Uploading ---
  {
    bookRef: "sin",
    chapterRef: "sin_ch3",
    question_type: "mc",
    question_text:
      "Kurzweil's position on consciousness in AI systems is best described as:",
    correct_answer:
      "Consciousness likely emerges from information processing complexity, so sufficiently advanced AI may be conscious",
    option_a: "Only biological neurons can produce consciousness",
    option_b:
      "Consciousness is irrelevant to intelligence and can be ignored",
    option_c:
      "Consciousness likely emerges from information processing complexity, so sufficiently advanced AI may be conscious",
    option_d:
      "We must solve the hard problem of consciousness before building AGI",
    explanation:
      "Kurzweil takes a functionalist view: if consciousness arises from the patterns and complexity of information processing rather than the specific substrate, then a sufficiently complex AI could be conscious.",
    difficulty: "intermediate",
  },
  {
    bookRef: "sin",
    chapterRef: "sin_ch3",
    question_type: "mc",
    question_text:
      "The 'hard problem of consciousness' as discussed by Kurzweil refers to:",
    correct_answer:
      "Explaining why and how subjective experience arises from physical processes",
    option_a:
      "Building hardware powerful enough to simulate a brain",
    option_b:
      "Explaining why and how subjective experience arises from physical processes",
    option_c: "Getting regulatory approval for mind uploading",
    option_d:
      "The difficulty of mapping every synapse in the human brain",
    explanation:
      "The hard problem, coined by philosopher David Chalmers, asks why physical information processing gives rise to subjective experience. Kurzweil acknowledges it as genuinely difficult but argues it does not block progress toward AI.",
    difficulty: "beginner",
  },
  {
    bookRef: "sin",
    chapterRef: "sin_ch3",
    question_type: "short",
    question_text:
      "What thought experiment does Kurzweil use to explore whether a gradually uploaded mind preserves personal identity?",
    correct_answer:
      "He considers a 'ship of Theseus' scenario where biological neurons are replaced one at a time with functionally identical digital components. The tension is whether the resulting entity is still 'you,' since at no single point does identity clearly break.",
    explanation:
      "This gradual replacement thought experiment highlights that identity may not be tied to specific atoms but to functional patterns. If each replacement preserves function and continuity of experience, the case for preserved identity is strong.",
    difficulty: "advanced",
  },
  {
    bookRef: "sin",
    chapterRef: "sin_ch3",
    question_type: "mc",
    question_text:
      "Mind uploading, as Kurzweil envisions it, would primarily involve:",
    correct_answer:
      "Scanning the brain at sufficient resolution to capture its functional organization and running that model on a computational substrate",
    option_a: "Transferring the physical neurons into a machine",
    option_b:
      "Scanning the brain at sufficient resolution to capture its functional organization and running that model on a computational substrate",
    option_c:
      "Training an AI on a person's written works until it mimics them",
    option_d:
      "Connecting a brain to the internet so it can exist in the cloud",
    explanation:
      "Uploading requires detailed scanning to capture the pattern of neural connections, then emulating that pattern computationally. The physical brain itself is not moved; its informational structure is replicated.",
    difficulty: "beginner",
  },
  {
    bookRef: "sin",
    chapterRef: "sin_ch3",
    question_type: "mc",
    question_text:
      "Kurzweil responds to the 'copy problem' in mind uploading by arguing that:",
    correct_answer:
      "Our biological identity already changes constantly at the molecular level, so continuity of pattern, not material, defines the self",
    option_a:
      "The copy would not truly be you, so uploading is pointless",
    option_b:
      "Only destructive uploading (destroying the original) preserves identity",
    option_c:
      "Our biological identity already changes constantly at the molecular level, so continuity of pattern, not material, defines the self",
    option_d: "The problem is unsolvable and should be ignored",
    explanation:
      "Kurzweil emphasizes that your atoms are replaced regularly through metabolism. You are not the same physical matter you were years ago, yet you consider yourself the same person, supporting pattern identity.",
    difficulty: "intermediate",
  },
  {
    bookRef: "sin",
    chapterRef: "sin_ch3",
    question_type: "short",
    question_text:
      "Why does Kurzweil believe that questions about machine consciousness will become increasingly urgent as AI advances?",
    correct_answer:
      "As AI systems become more sophisticated and exhibit behaviors associated with consciousness, society will face practical moral and legal questions about AI rights, personhood, and the ethics of shutting down potentially conscious systems.",
    explanation:
      "The question shifts from abstract philosophy to practical urgency when an AI can articulate its own experiences convincingly. We will need frameworks for evaluating claims of machine consciousness.",
    difficulty: "advanced",
  },

  // --- sin_ch4: Poverty Reduction, Quality of Life ---
  {
    bookRef: "sin",
    chapterRef: "sin_ch4",
    question_type: "mc",
    question_text:
      "Kurzweil argues that extreme poverty has declined dramatically primarily because:",
    correct_answer:
      "Exponential technology improvements have driven down the cost of basic necessities",
    option_a:
      "Government redistribution programs have been universally effective",
    option_b:
      "Exponential technology improvements have driven down the cost of basic necessities",
    option_c:
      "Population decline has reduced competition for resources",
    option_d:
      "Wealthy nations have donated enough aid to solve the problem",
    explanation:
      "Kurzweil emphasizes that technology-driven cost reductions in food, energy, communication, and healthcare have lifted billions out of poverty.",
    difficulty: "beginner",
  },
  {
    bookRef: "sin",
    chapterRef: "sin_ch4",
    question_type: "mc",
    question_text:
      "Kurzweil's argument about 'the democratization of technology' means that:",
    correct_answer:
      "Technologies that were once exclusive luxuries become cheap enough for widespread access within years",
    option_a:
      "Democratic governments should control all technology distribution",
    option_b:
      "Technologies that were once exclusive luxuries become cheap enough for widespread access within years",
    option_c:
      "Only democratic nations produce meaningful technology",
    option_d:
      "Technology should be put to a popular vote before deployment",
    explanation:
      "Cell phones, computing, GPS, and medical advances all started as expensive elite tools and rapidly became affordable to billions. Kurzweil sees this pattern continuing and accelerating.",
    difficulty: "beginner",
  },
  {
    bookRef: "sin",
    chapterRef: "sin_ch4",
    question_type: "short",
    question_text:
      "How does Kurzweil counter the criticism that technology primarily benefits the wealthy?",
    correct_answer:
      "He argues that while the wealthy adopt technologies first, exponential cost declines make those technologies rapidly available to everyone. A smartphone today gives a person in a developing nation more capability than a billionaire had 30 years ago.",
    explanation:
      "The key insight is that the time lag between elite adoption and mass access is shrinking. Technologies diffuse faster than ever, and the absolute quality of life available to ordinary people continues to rise.",
    difficulty: "intermediate",
  },
  {
    bookRef: "sin",
    chapterRef: "sin_ch4",
    question_type: "mc",
    question_text:
      "Which trend does Kurzweil cite as evidence that quality of life is improving despite popular pessimism?",
    correct_answer:
      "All of the above: declining child mortality, increasing literacy, expanded access to clean water",
    option_a: "Declining child mortality rates globally",
    option_b: "Increasing global literacy rates",
    option_c: "Expanded access to clean water and sanitation",
    option_d:
      "All of the above: declining child mortality, increasing literacy, expanded access to clean water",
    explanation:
      "Kurzweil marshals extensive data showing improvements across multiple dimensions of human well-being. He argues that negativity bias in media causes people to miss these broadly positive trends.",
    difficulty: "beginner",
  },
  {
    bookRef: "sin",
    chapterRef: "sin_ch4",
    question_type: "mc",
    question_text:
      "Kurzweil predicts that solar energy will meet global needs because:",
    correct_answer:
      "Solar energy's price-performance is on an exponential improvement curve similar to computing",
    option_a:
      "Governments will mandate 100% solar adoption through regulation",
    option_b:
      "Solar energy's price-performance is on an exponential improvement curve similar to computing",
    option_c:
      "Solar panels have already reached theoretical maximum efficiency",
    option_d:
      "Nuclear fusion will fail, leaving solar as the only option",
    explanation:
      "Solar energy costs have been falling exponentially, doubling in capacity roughly every two years. Kurzweil extrapolates this trend to predict solar will dominate global energy production.",
    difficulty: "intermediate",
  },
  {
    bookRef: "sin",
    chapterRef: "sin_ch4",
    question_type: "short",
    question_text:
      "What does Kurzweil mean by claiming that a person in poverty today has access to more information and services than a king did centuries ago?",
    correct_answer:
      "A person with a basic smartphone has access to the world's information, global communication, entertainment, navigation, and health resources that no amount of wealth could purchase in prior eras.",
    explanation:
      "This argument illustrates how technology changes the meaning of wealth itself. Raw dollar comparisons miss the fact that technological abundance provides capabilities that were literally impossible at any price in previous centuries.",
    difficulty: "intermediate",
  },

  // --- sin_ch5: Jobs, Creative Destruction, Automation ---
  {
    bookRef: "sin",
    chapterRef: "sin_ch5",
    question_type: "mc",
    question_text:
      "Kurzweil's view on AI-driven job displacement is that:",
    correct_answer:
      "Automation destroys old jobs but historically creates more new jobs, and this pattern will continue with some transitional challenges",
    option_a:
      "AI will permanently eliminate most jobs with no replacement",
    option_b:
      "Job displacement from AI is a myth and will not happen",
    option_c:
      "Automation destroys old jobs but historically creates more new jobs, and this pattern will continue with some transitional challenges",
    option_d: "Only blue-collar jobs are at risk from automation",
    explanation:
      "Kurzweil acknowledges real disruption but points to the historical pattern of creative destruction. He expects AI to follow this pattern while creating entirely new categories of work.",
    difficulty: "beginner",
  },
  {
    bookRef: "sin",
    chapterRef: "sin_ch5",
    question_type: "mc",
    question_text:
      "The concept of 'creative destruction' in the context of AI and employment refers to:",
    correct_answer:
      "The process by which new technologies destroy old industries while simultaneously creating new ones",
    option_a:
      "AI systems that can create art, destroying human creativity",
    option_b:
      "The deliberate destruction of jobs by corporations to increase profits",
    option_c:
      "The process by which new technologies destroy old industries while simultaneously creating new ones",
    option_d:
      "Government policies that creatively manage unemployment",
    explanation:
      "Creative destruction, a concept from economist Joseph Schumpeter, describes how innovation displaces old economic structures while building new ones. Kurzweil applies this to AI-era economics.",
    difficulty: "beginner",
  },
  {
    bookRef: "sin",
    chapterRef: "sin_ch5",
    question_type: "short",
    question_text:
      "What is Kurzweil's position on Universal Basic Income (UBI) as a response to automation-driven unemployment?",
    correct_answer:
      "Kurzweil sees UBI as one potentially necessary transitional measure during rapid job displacement. However, he believes the larger solution lies in the exponential decrease in the cost of living and the creation of new forms of meaningful work.",
    explanation:
      "Rather than treating UBI as a permanent solution, Kurzweil frames it as a bridge during transition periods. He is more optimistic about new job creation and falling costs making the problem less severe.",
    difficulty: "intermediate",
  },
  {
    bookRef: "sin",
    chapterRef: "sin_ch5",
    question_type: "mc",
    question_text:
      "Kurzweil argues that fears about technological unemployment have historically been:",
    correct_answer:
      "Understandable but ultimately wrong, as each wave of automation created more prosperity and new job categories",
    option_a:
      "Completely justified every time they have been raised",
    option_b: "Never raised before the modern AI era",
    option_c:
      "Understandable but ultimately wrong, as each wave of automation created more prosperity and new job categories",
    option_d: "Only relevant to manufacturing, not services",
    explanation:
      "From the Luddites opposing textile machinery to fears about ATMs and spreadsheets, predictions of permanent mass unemployment from automation have repeatedly proven overstated.",
    difficulty: "intermediate",
  },
  {
    bookRef: "sin",
    chapterRef: "sin_ch5",
    question_type: "mc",
    question_text:
      "Which key difference does Kurzweil identify between AI-driven automation and previous waves of technological change?",
    correct_answer:
      "AI can potentially automate cognitive and creative tasks, not just physical labor",
    option_a:
      "Previous waves only affected agriculture, while AI affects everything",
    option_b:
      "AI can potentially automate cognitive and creative tasks, not just physical labor",
    option_c:
      "AI changes happen slowly enough for workers to adapt easily",
    option_d: "AI automation will only affect developing nations",
    explanation:
      "While acknowledging historical parallels, Kurzweil notes that AI's ability to handle cognitive, creative, and knowledge work distinguishes it from earlier mechanical automation, creating bigger transitional challenges.",
    difficulty: "intermediate",
  },
  {
    bookRef: "sin",
    chapterRef: "sin_ch5",
    question_type: "short",
    question_text:
      "How does Kurzweil reconcile his optimism about AI job creation with the acknowledgment that the transition will cause real hardship for displaced workers?",
    correct_answer:
      "He argues that while the macro trend is positive, individual workers face real disruption. He advocates for education reform, social safety nets, and policies that help workers adapt during the transition period.",
    explanation:
      "Kurzweil's position distinguishes between aggregate outcomes (net positive) and individual experiences (potentially painful). He does not dismiss the hardship but frames it as a solvable transitional problem.",
    difficulty: "advanced",
  },

  // --- sin_ch6: Nanomedicine, CRISPR, Life Extension ---
  {
    bookRef: "sin",
    chapterRef: "sin_ch6",
    question_type: "mc",
    question_text:
      "Kurzweil's concept of 'longevity escape velocity' refers to:",
    correct_answer:
      "The point at which medical advances extend life expectancy by more than one year for every year that passes",
    option_a:
      "The speed at which nanobots must travel through the bloodstream",
    option_b:
      "The point at which medical advances extend life expectancy by more than one year for every year that passes",
    option_c: "The maximum theoretical lifespan of a human being",
    option_d:
      "The velocity needed to escape Earth's gravity for space colonization",
    explanation:
      "At longevity escape velocity, you gain more than a year of expected life for each year you survive. Kurzweil believes advancing biotechnology and nanomedicine will push us past this threshold.",
    difficulty: "beginner",
  },
  {
    bookRef: "sin",
    chapterRef: "sin_ch6",
    question_type: "mc",
    question_text:
      "Kurzweil envisions medical nanobots primarily as:",
    correct_answer:
      "Microscopic devices that patrol the body, repairing damage and fighting disease at the cellular level",
    option_a: "Replacements for all pharmaceutical drugs",
    option_b:
      "Microscopic devices that patrol the body, repairing damage and fighting disease at the cellular level",
    option_c:
      "Tools exclusively for brain enhancement, not physical health",
    option_d:
      "Devices too large to enter the bloodstream that work externally",
    explanation:
      "Nanobots in Kurzweil's vision are blood-cell-sized robots that can destroy pathogens, repair damaged DNA, clear arterial plaque, and reverse aging processes at the convergence of nanotechnology and medicine.",
    difficulty: "beginner",
  },
  {
    bookRef: "sin",
    chapterRef: "sin_ch6",
    question_type: "mc",
    question_text:
      "CRISPR gene editing is discussed by Kurzweil as significant because:",
    correct_answer:
      "It provides a precise, programmable tool for correcting genetic diseases and potentially enhancing human biology",
    option_a: "It was the first technology to prove that genes exist",
    option_b:
      "It provides a precise, programmable tool for correcting genetic diseases and potentially enhancing human biology",
    option_c: "It can only be used in plants, not humans",
    option_d: "It replaces the need for nanobots entirely",
    explanation:
      "CRISPR represents a near-term bridge to more advanced future interventions. Its ability to make targeted edits to the genome at relatively low cost accelerates progress in treating genetic diseases.",
    difficulty: "beginner",
  },
  {
    bookRef: "sin",
    chapterRef: "sin_ch6",
    question_type: "short",
    question_text:
      "Describe Kurzweil's 'three bridges' framework for life extension and how each bridge relates to the next.",
    correct_answer:
      "Bridge 1 is current medicine and lifestyle optimization to stay healthy for Bridge 2. Bridge 2 is the biotechnology revolution (gene therapies, CRISPR). Bridge 3 is the nanotechnology revolution (nanobots, molecular repair) making aging fully reversible. Each bridge buys time to reach the next.",
    explanation:
      "The three bridges framework turns life extension into a sequential strategy rather than a single leap: use today's best practices to survive long enough for tomorrow's breakthroughs.",
    difficulty: "intermediate",
  },
  {
    bookRef: "sin",
    chapterRef: "sin_ch6",
    question_type: "mc",
    question_text:
      "Kurzweil predicts that the cost of genome sequencing will:",
    correct_answer:
      "Continue falling exponentially, making personalized genomic medicine routine and affordable",
    option_a: "Plateau at current levels due to physical limits",
    option_b:
      "Continue falling exponentially, making personalized genomic medicine routine and affordable",
    option_c:
      "Increase as demand outstrips supply of sequencing equipment",
    option_d:
      "Become irrelevant once nanobots can repair DNA directly",
    explanation:
      "The cost of sequencing a human genome has fallen from billions to under a thousand dollars, following an exponential trend even faster than Moore's Law.",
    difficulty: "intermediate",
  },
  {
    bookRef: "sin",
    chapterRef: "sin_ch6",
    question_type: "short",
    question_text:
      "What ethical concerns does Kurzweil acknowledge about radical life extension, and how does he address them?",
    correct_answer:
      "He acknowledges concerns about overpopulation, resource strain, and social inequality. He argues that exponential technology improvements will also solve resource constraints, costs will fall to enable broad access, and people will adapt psychologically.",
    explanation:
      "Kurzweil does not dismiss ethical concerns but embeds them in his broader framework of exponential progress, believing the same forces driving life extension will address secondary problems it creates.",
    difficulty: "advanced",
  },

  // --- sin_ch7: Existential Risks, AI Alignment ---
  {
    bookRef: "sin",
    chapterRef: "sin_ch7",
    question_type: "mc",
    question_text:
      "Kurzweil acknowledges that the greatest existential risk from AI is:",
    correct_answer:
      "A superintelligent AI whose goals are not aligned with human values",
    option_a: "AI becoming too expensive for anyone to use",
    option_b:
      "A superintelligent AI whose goals are not aligned with human values",
    option_c: "AI systems consuming too much electricity",
    option_d: "AI making humans lazy and unproductive",
    explanation:
      "The alignment problem -- ensuring AI systems pursue goals compatible with human well-being -- is the core existential risk Kurzweil identifies. A misaligned superintelligence could be catastrophic.",
    difficulty: "beginner",
  },
  {
    bookRef: "sin",
    chapterRef: "sin_ch7",
    question_type: "mc",
    question_text:
      "Kurzweil's approach to AI safety differs from some other thinkers because he:",
    correct_answer:
      "Advocates for merging with AI rather than trying to contain it as a separate external force",
    option_a:
      "Believes AI should be banned entirely to prevent risks",
    option_b:
      "Thinks AI risks are entirely overstated and require no action",
    option_c:
      "Advocates for merging with AI rather than trying to contain it as a separate external force",
    option_d:
      "Argues that only government-run AI can be safe",
    explanation:
      "Rather than an adversarial framing (humans vs. AI), Kurzweil envisions humans merging with AI through BCIs. This makes 'us vs. them' less relevant because 'we' become the AI.",
    difficulty: "intermediate",
  },
  {
    bookRef: "sin",
    chapterRef: "sin_ch7",
    question_type: "short",
    question_text:
      "How does Kurzweil address biotech risks such as engineered pandemics in the context of accelerating technology?",
    correct_answer:
      "He acknowledges that exponential advances lower the barrier for creating engineered pathogens. However, he argues that defensive technologies (rapid vaccine development, AI-driven surveillance, nanobots) will advance at least as fast as offensive capabilities.",
    explanation:
      "This is an example of the dual-use dilemma in exponential technology. Kurzweil's optimism rests on the claim that defense tends to scale better than offense in biology, particularly when AI accelerates countermeasures.",
    difficulty: "advanced",
  },
  {
    bookRef: "sin",
    chapterRef: "sin_ch7",
    question_type: "mc",
    question_text:
      "The 'alignment problem' in AI safety refers to:",
    correct_answer:
      "Ensuring that an AI system's objectives genuinely reflect human values and intentions",
    option_a:
      "Making sure AI hardware components are physically aligned correctly",
    option_b:
      "Aligning international regulations on AI development",
    option_c:
      "Ensuring that an AI system's objectives genuinely reflect human values and intentions",
    option_d:
      "Aligning AI research funding with market demand",
    explanation:
      "The alignment problem is the technical and philosophical challenge of specifying goals for AI systems such that pursuing those goals leads to outcomes humans actually want.",
    difficulty: "beginner",
  },
  {
    bookRef: "sin",
    chapterRef: "sin_ch7",
    question_type: "mc",
    question_text:
      "Kurzweil responds to concerns about an AI 'intelligence explosion' by arguing that:",
    correct_answer:
      "Intelligence growth will be rapid but not instantaneous, giving humanity time to adapt and merge with AI",
    option_a: "An intelligence explosion is physically impossible",
    option_b:
      "Intelligence growth will be rapid but not instantaneous, giving humanity time to adapt and merge with AI",
    option_c:
      "We should not worry about it because AI will always remain below human level",
    option_d:
      "Only a single explosion event is possible, after which progress stops",
    explanation:
      "Unlike scenarios of sudden recursive self-improvement overnight, Kurzweil envisions rapid but observable growth following exponential curves, giving societies and individuals time to co-evolve with AI.",
    difficulty: "intermediate",
  },
  {
    bookRef: "sin",
    chapterRef: "sin_ch7",
    question_type: "mc",
    question_text:
      "Kurzweil argues that attempting to halt AI development to avoid risks would be:",
    correct_answer:
      "Both impractical and counterproductive, as it would push development underground and forfeit the benefits",
    option_a:
      "The wisest course of action given the stakes involved",
    option_b:
      "Possible if all nations cooperate through treaties",
    option_c:
      "Both impractical and counterproductive, as it would push development underground and forfeit the benefits",
    option_d: "Only necessary for military AI applications",
    explanation:
      "Kurzweil argues the knowledge enabling AI is too widely distributed to contain, and prohibition would drive research to less responsible actors while denying humanity the enormous benefits of AI.",
    difficulty: "intermediate",
  },

  // --- sin_ch8: Optimism, Critics, Predictions, The Singularity ---
  {
    bookRef: "sin",
    chapterRef: "sin_ch8",
    question_type: "mc",
    question_text:
      "Kurzweil's track record on technology predictions is characterized by:",
    correct_answer:
      "A majority of predictions being correct or essentially correct in timing, with some arriving later than expected",
    option_a: "Nearly all predictions being dramatically wrong",
    option_b:
      "A majority of predictions being correct or essentially correct in timing, with some arriving later than expected",
    option_c:
      "Predictions that were deliberately vague enough to always seem right",
    option_d:
      "A track record he refuses to discuss or be evaluated on",
    explanation:
      "Independent analyses of Kurzweil's predictions find roughly 86% correct or essentially correct. He addresses both hits and misses openly in this book.",
    difficulty: "beginner",
  },
  {
    bookRef: "sin",
    chapterRef: "sin_ch8",
    question_type: "mc",
    question_text:
      "When responding to critics who call him naively optimistic, Kurzweil argues that:",
    correct_answer:
      "His optimism is based on measurable exponential trends, not wishful thinking, and pessimists often rely on linear extrapolation",
    option_a: "Critics are always wrong about everything",
    option_b:
      "Pessimism is a form of mental illness that should be treated",
    option_c:
      "His optimism is based on measurable exponential trends, not wishful thinking, and pessimists often rely on linear extrapolation",
    option_d:
      "He admits he might be too optimistic but sees no alternative",
    explanation:
      "Kurzweil grounds his optimism in data: price-performance curves, adoption rates, and historical patterns. He argues that many critics project the future using linear thinking, which systematically underestimates exponential progress.",
    difficulty: "intermediate",
  },
  {
    bookRef: "sin",
    chapterRef: "sin_ch8",
    question_type: "short",
    question_text:
      "What prediction does Kurzweil make about the timing of the Singularity, and what does he mean by it?",
    correct_answer:
      "Kurzweil predicts the Singularity by 2045 -- the point at which AI vastly surpasses human intelligence and merges with human biology, fundamentally transforming civilization in ways impossible to predict from our current vantage point.",
    explanation:
      "The 2045 date is derived from extrapolating exponential trends in computation. The Singularity is not a single event but a phase transition after which change becomes incomprehensible to unaugmented minds.",
    difficulty: "beginner",
  },
  {
    bookRef: "sin",
    chapterRef: "sin_ch8",
    question_type: "mc",
    question_text:
      "Kurzweil addresses the criticism that 'the Singularity is a religion for nerds' by:",
    correct_answer:
      "Pointing out that his predictions are falsifiable and based on empirical trends, unlike religious claims",
    option_a: "Agreeing that it requires a kind of faith",
    option_b:
      "Pointing out that his predictions are falsifiable and based on empirical trends, unlike religious claims",
    option_c: "Ignoring the criticism entirely",
    option_d:
      "Arguing that religion and technology are the same thing",
    explanation:
      "Kurzweil distinguishes his framework from faith by emphasizing testability. His predictions have specific timelines that can be checked, and many earlier predictions have already been confirmed.",
    difficulty: "intermediate",
  },
  {
    bookRef: "sin",
    chapterRef: "sin_ch8",
    question_type: "short",
    question_text:
      "How does Kurzweil explain predictions he got wrong, and what does this reveal about his methodology?",
    correct_answer:
      "He acknowledges specific misses, often attributing them to timing errors rather than directional errors. This reveals his methodology is better at predicting what will happen than precisely when, since exponential trends can have variable starting points.",
    explanation:
      "The distinction between direction (what) and timing (when) is important: exponential trends are reliable in their general trajectory but can shift by a few years based on economic, regulatory, or technical factors.",
    difficulty: "advanced",
  },
  {
    bookRef: "sin",
    chapterRef: "sin_ch8",
    question_type: "mc",
    question_text:
      "Kurzweil frames his overall message in the book as:",
    correct_answer:
      "Cautious optimism grounded in data, acknowledging risks but emphasizing humanity's ability to navigate them",
    option_a:
      "Unconditional optimism with no acknowledgment of potential downsides",
    option_b:
      "Cautious optimism grounded in data, acknowledging risks but emphasizing humanity's ability to navigate them",
    option_c:
      "Deep pessimism about humanity's ability to handle powerful technology",
    option_d: "Neutral reporting of trends with no personal opinion",
    explanation:
      "Kurzweil devotes significant space to existential threats, alignment, and societal disruption. But his overall framework treats these as solvable challenges rather than inevitable catastrophes.",
    difficulty: "beginner",
  },

  // ============================================================
  // THE SOVEREIGN INDIVIDUAL (SI) — 52 Questions
  // ============================================================

  // --- si_ch1: Megapolitical Transitions ---
  {
    bookRef: "si",
    chapterRef: "si_ch1",
    question_type: "mc",
    question_text:
      "In 'The Sovereign Individual,' a 'megapolitical transition' refers to:",
    correct_answer:
      "A fundamental shift in the technology of violence and economic organization that restructures society",
    option_a:
      "A change in government through democratic elections",
    option_b:
      "A fundamental shift in the technology of violence and economic organization that restructures society",
    option_c:
      "A military coup that replaces one regime with another",
    option_d: "A recession that forces political reforms",
    explanation:
      "Megapolitical transitions are rare, civilizational-scale shifts driven by changes in how violence can be deployed and defended against. They reshape who holds power and what social institutions are viable.",
    difficulty: "beginner",
  },
  {
    bookRef: "si",
    chapterRef: "si_ch1",
    question_type: "mc",
    question_text:
      "The 'fourth stage' of human social organization described by Davidson and Rees-Mogg is:",
    correct_answer:
      "The Information Age, where digital technology undermines the nation-state",
    option_a:
      "The Agricultural Age, where farming enables permanent settlements",
    option_b:
      "The Industrial Age, where factories centralize production",
    option_c:
      "The Information Age, where digital technology undermines the nation-state",
    option_d:
      "The Space Age, where humanity colonizes other planets",
    explanation:
      "The four stages are: hunter-gatherer, agricultural, industrial, and information. Each transition was driven by changes in the technology of violence and production.",
    difficulty: "beginner",
  },
  {
    bookRef: "si",
    chapterRef: "si_ch1",
    question_type: "short",
    question_text:
      "Explain why the authors argue that understanding the 'logic of violence' is essential for predicting future political and economic structures.",
    correct_answer:
      "Because political and economic structures are shaped by who can deploy violence effectively and at what cost. When the technology of violence changes, institutions built around the old technology become obsolete.",
    explanation:
      "This is the foundational thesis: governments, borders, taxation, and social contracts all depend on the current balance of coercive power. Change that balance and everything downstream must adapt.",
    difficulty: "intermediate",
  },
  {
    bookRef: "si",
    chapterRef: "si_ch1",
    question_type: "mc",
    question_text:
      "The authors use the transition from feudalism to the nation-state to illustrate that:",
    correct_answer:
      "Changes in military technology (gunpowder, standing armies) made the feudal system economically and militarily unviable",
    option_a:
      "Democratic ideals alone drove the end of feudalism",
    option_b:
      "Changes in military technology (gunpowder, standing armies) made the feudal system economically and militarily unviable",
    option_c:
      "Feudalism ended because peasants organized peaceful protests",
    option_d:
      "The transition was smooth and welcomed by all parties",
    explanation:
      "Gunpowder and professional armies raised the scale of effective military force beyond what individual feudal lords could muster, favoring larger political units (nation-states).",
    difficulty: "intermediate",
  },
  {
    bookRef: "si",
    chapterRef: "si_ch1",
    question_type: "mc",
    question_text:
      "According to the book, the Information Age will most disrupt societies that:",
    correct_answer:
      "Depend heavily on the ability to tax and control geographically fixed populations and assets",
    option_a:
      "Have the most advanced technology sectors",
    option_b:
      "Depend heavily on the ability to tax and control geographically fixed populations and assets",
    option_c: "Are located in tropical climates",
    option_d: "Have the oldest democratic traditions",
    explanation:
      "Nation-states derive power from taxing people and assets within their borders. When wealth becomes digital and mobile, this power base erodes. Countries most dependent on this model face the greatest disruption.",
    difficulty: "intermediate",
  },

  // --- si_ch2: Violence Economics ---
  {
    bookRef: "si",
    chapterRef: "si_ch2",
    question_type: "mc",
    question_text:
      "The 'returns to violence' concept means that:",
    correct_answer:
      "Violence is more or less profitable depending on the technological and economic context",
    option_a:
      "Violence always produces negative returns for everyone involved",
    option_b:
      "Violence is more or less profitable depending on the technological and economic context",
    option_c:
      "Governments always earn positive returns from the use of force",
    option_d:
      "Violence only pays off in pre-industrial societies",
    explanation:
      "When it is cheap to seize assets by force and expensive to protect them, the returns to violence are high. When assets are hard to seize (digital, encrypted, mobile), the returns fall. This ratio shapes political institutions.",
    difficulty: "intermediate",
  },
  {
    bookRef: "si",
    chapterRef: "si_ch2",
    question_type: "mc",
    question_text:
      "Davidson and Rees-Mogg argue that throughout history, political organization has been determined primarily by:",
    correct_answer:
      "The cost-effectiveness of projecting and resisting violence with available technology",
    option_a:
      "The philosophical ideals of each era's intellectuals",
    option_b:
      "The cost-effectiveness of projecting and resisting violence with available technology",
    option_c:
      "Random chance and the personalities of individual leaders",
    option_d: "Religious institutions and their moral authority",
    explanation:
      "The central analytical framework holds that all political organization is downstream of the economics of coercion. Changes in the technology of violence precede and cause political change.",
    difficulty: "intermediate",
  },
  {
    bookRef: "si",
    chapterRef: "si_ch2",
    question_type: "short",
    question_text:
      "How does the information revolution change the returns to violence, according to the authors?",
    correct_answer:
      "It makes wealth intangible, encrypted, and mobile, so it becomes much harder for governments or anyone else to seize by force, dramatically reducing the returns to violence.",
    explanation:
      "When wealth exists as digital information protected by encryption, physical coercion cannot easily extract it. This undermines the economic basis for organized violence and the states built on it.",
    difficulty: "advanced",
  },
  {
    bookRef: "si",
    chapterRef: "si_ch2",
    question_type: "mc",
    question_text:
      "The nation-state's power derived from the industrial age because:",
    correct_answer:
      "Industrial economies created large, immobile assets like factories that required and funded centralized military protection",
    option_a:
      "People in the industrial era were more patriotic",
    option_b:
      "Industrial economies created large, immobile assets like factories that required and funded centralized military protection",
    option_c:
      "Industrial technology made governments more transparent",
    option_d: "Industrial nations had larger populations",
    explanation:
      "The concentration of wealth in factories, railroads, and cities created assets that could be taxed and needed protection, giving rise to powerful centralized states.",
    difficulty: "intermediate",
  },

  // --- si_ch3: Economics of Protection ---
  {
    bookRef: "si",
    chapterRef: "si_ch3",
    question_type: "mc",
    question_text:
      "The 'economics of protection' refers to:",
    correct_answer:
      "The costs and incentives involved in providing security, which determine the scale and nature of political entities",
    option_a:
      "How much individuals spend on home security systems",
    option_b:
      "The costs and incentives involved in providing security, which determine the scale and nature of political entities",
    option_c: "The insurance industry's business model",
    option_d: "Environmental protection economics",
    explanation:
      "This is the authors' framework for understanding why political entities form at particular scales depending on the cost of projecting and defending against violence.",
    difficulty: "intermediate",
  },
  {
    bookRef: "si",
    chapterRef: "si_ch3",
    question_type: "short",
    question_text:
      "How do the authors characterize the relationship between government and a protection racket?",
    correct_answer:
      "They argue governments, like protection rackets, extract payment (taxes) in exchange for protection. The distinction is largely one of scale and legitimacy, not fundamental nature.",
    explanation:
      "The authors provocatively compare taxation to a protection racket, arguing that the state's monopoly on legitimate violence functions similarly to organized crime's extortion at a larger, institutionalized scale.",
    difficulty: "advanced",
  },
  {
    bookRef: "si",
    chapterRef: "si_ch3",
    question_type: "mc",
    question_text:
      "Agricultural societies developed hierarchical states because:",
    correct_answer:
      "Farming created immovable, visible wealth (land and crops) that needed protection and could be easily taxed",
    option_a:
      "Farmers were naturally more hierarchical than hunter-gatherers",
    option_b:
      "Farming created immovable, visible wealth (land and crops) that needed protection and could be easily taxed",
    option_c:
      "Agricultural tools were useful as weapons",
    option_d:
      "Religious leaders demanded hierarchical governance",
    explanation:
      "The transition to agriculture created a fundamental vulnerability: crops and land cannot be hidden or moved, making them ideal targets for both raiders and tax collectors.",
    difficulty: "intermediate",
  },

  // --- si_ch4: Agricultural-to-Industrial Transition ---
  {
    bookRef: "si",
    chapterRef: "si_ch4",
    question_type: "mc",
    question_text:
      "How did gunpowder change political organization, according to the authors?",
    correct_answer:
      "It made feudal castles obsolete and enabled the rise of centralized nation-states with standing armies",
    option_a:
      "It made small groups more powerful than large states",
    option_b: "It had no real political impact",
    option_c:
      "It made feudal castles obsolete and enabled the rise of centralized nation-states with standing armies",
    option_d:
      "It strengthened the power of the Catholic Church",
    explanation:
      "Gunpowder-based cannons could breach castle walls, ending the defensive advantage that had sustained feudal lords, while musket-armed standing armies required the resources of larger, centralized states.",
    difficulty: "beginner",
  },
  {
    bookRef: "si",
    chapterRef: "si_ch4",
    question_type: "mc",
    question_text:
      "The printing press played a role in the fall of the medieval Church's power because:",
    correct_answer:
      "It decentralized access to information, undermining the Church's monopoly on knowledge and moral authority",
    option_a:
      "It made Bibles cheaper so everyone became more religious",
    option_b:
      "It decentralized access to information, undermining the Church's monopoly on knowledge and moral authority",
    option_c: "It had no impact on the Church",
    option_d:
      "It helped the Church spread its message more effectively",
    explanation:
      "The printing press is presented as an early information revolution that broke an institutional monopoly, analogous to how the internet undermines nation-states.",
    difficulty: "intermediate",
  },
  {
    bookRef: "si",
    chapterRef: "si_ch4",
    question_type: "short",
    question_text:
      "Why do the authors compare the coming transition to the fall of feudalism?",
    correct_answer:
      "Just as feudalism collapsed when gunpowder and the printing press changed the logic of violence, the nation-state will collapse as information technology changes that logic again. New technologies reshape the economics of protection, rendering existing political institutions obsolete.",
    explanation:
      "The authors draw a structural parallel: each time the technology of violence fundamentally shifts, the political institutions built around the old technology are dismantled and replaced.",
    difficulty: "intermediate",
  },

  // --- si_ch5: Death of the Nation-State ---
  {
    bookRef: "si",
    chapterRef: "si_ch5",
    question_type: "mc",
    question_text:
      "The authors predict the death of the nation-state primarily because:",
    correct_answer:
      "Information technology makes wealth intangible and mobile, undermining the state's ability to tax and control citizens",
    option_a: "Military conquest by a superpower",
    option_b:
      "Information technology makes wealth intangible and mobile, undermining the state's ability to tax and control citizens",
    option_c: "A global democratic revolution",
    option_d: "Climate change destroying infrastructure",
    explanation:
      "The core argument is that the nation-state depends on its ability to tax immobile, visible wealth, and the shift to digital, mobile wealth fatally undermines this power.",
    difficulty: "beginner",
  },
  {
    bookRef: "si",
    chapterRef: "si_ch5",
    question_type: "short",
    question_text:
      "What do the authors predict will happen to government budgets as the information revolution progresses?",
    correct_answer:
      "Government budgets will shrink dramatically as productive citizens move their income and assets beyond the reach of taxation, creating a fiscal crisis for traditional states.",
    explanation:
      "The authors foresee high earners exploiting digital tools to shelter wealth in low-tax jurisdictions, starving traditional governments of revenue.",
    difficulty: "intermediate",
  },
  {
    bookRef: "si",
    chapterRef: "si_ch5",
    question_type: "mc",
    question_text:
      "What will replace the nation-state, according to the authors?",
    correct_answer:
      "Competing jurisdictions that offer services in exchange for fees, like commercial entities",
    option_a: "A single world government",
    option_b: "Tribal warlords",
    option_c:
      "Competing jurisdictions that offer services in exchange for fees, like commercial entities",
    option_d: "Technology companies like Google and Apple",
    explanation:
      "The authors envision jurisdictional competition where governments must compete for productive citizens by offering efficient, low-cost services or lose them.",
    difficulty: "intermediate",
  },
  {
    bookRef: "si",
    chapterRef: "si_ch5",
    question_type: "mc",
    question_text:
      "What historical parallel do the authors draw for the decline of the nation-state?",
    correct_answer:
      "The decline of the medieval Church as a political power after the Reformation",
    option_a: "The fall of the Roman Empire",
    option_b:
      "The decline of the medieval Church as a political power after the Reformation",
    option_c: "The French Revolution",
    option_d: "The American Civil War",
    explanation:
      "The authors compare the coming decline to how the Church lost temporal power when information technology (the printing press) broke its monopoly on knowledge.",
    difficulty: "intermediate",
  },

  // --- si_ch6: Information Revolution / Cybereconomy ---
  {
    bookRef: "si",
    chapterRef: "si_ch6",
    question_type: "mc",
    question_text:
      "The 'cybereconomy' as described by Davidson and Rees-Mogg is:",
    correct_answer:
      "An economy operating primarily in cyberspace, beyond the reach of any single government's control",
    option_a: "An economy based on robots and automation",
    option_b:
      "An economy operating primarily in cyberspace, beyond the reach of any single government's control",
    option_c: "A government-regulated digital marketplace",
    option_d: "Online shopping through traditional retailers",
    explanation:
      "The cybereconomy is the emerging digital economic space where transactions, wealth, and commerce operate independently of nation-state boundaries and control.",
    difficulty: "beginner",
  },
  {
    bookRef: "si",
    chapterRef: "si_ch6",
    question_type: "mc",
    question_text:
      "The authors predict digital money will:",
    correct_answer:
      "Allow individuals to transact anonymously and avoid government taxation and surveillance",
    option_a: "Be controlled by central banks",
    option_b:
      "Allow individuals to transact anonymously and avoid government taxation and surveillance",
    option_c: "Be banned by all governments",
    option_d: "Only be used for small transactions",
    explanation:
      "The authors predicted (in 1997) that encrypted digital currency would enable individuals to move wealth beyond government oversight, a vision that anticipated aspects of cryptocurrency.",
    difficulty: "intermediate",
  },
  {
    bookRef: "si",
    chapterRef: "si_ch6",
    question_type: "short",
    question_text:
      "How did Davidson and Rees-Mogg anticipate cryptocurrency decades before Bitcoin?",
    correct_answer:
      "They predicted encrypted digital money enabling anonymous, borderless transactions beyond government control -- closely resembling what Bitcoin and other cryptocurrencies later became.",
    explanation:
      "Writing in 1997, the authors described a form of digital money with encryption and anonymity features strikingly similar to the cryptocurrency that emerged over a decade later.",
    difficulty: "advanced",
  },
  {
    bookRef: "si",
    chapterRef: "si_ch6",
    question_type: "mc",
    question_text:
      "The authors argue taxation in the cybereconomy will:",
    correct_answer:
      "Increasingly become voluntary as governments lose the ability to monitor digital transactions",
    option_a:
      "Increase to fund digital infrastructure",
    option_b:
      "Increasingly become voluntary as governments lose the ability to monitor digital transactions",
    option_c:
      "Be abolished by international agreement",
    option_d: "Remain unchanged from current rates",
    explanation:
      "Encrypted, borderless digital transactions will make involuntary taxation nearly impossible, forcing governments to compete on service quality and cost.",
    difficulty: "intermediate",
  },

  // --- si_ch7: Jurisdictional Competition ---
  {
    bookRef: "si",
    chapterRef: "si_ch7",
    question_type: "mc",
    question_text:
      "Jurisdictional competition means:",
    correct_answer:
      "Governments competing with each other to attract productive citizens by offering better services and lower taxes",
    option_a:
      "Legal disputes between courts in different countries",
    option_b:
      "Governments competing with each other to attract productive citizens by offering better services and lower taxes",
    option_c:
      "Competition between legal systems within a single country",
    option_d:
      "International sports competitions between nations",
    explanation:
      "Mobile, high-value individuals will 'shop' for the best governance, forcing governments to act more like service providers competing for customers.",
    difficulty: "beginner",
  },
  {
    bookRef: "si",
    chapterRef: "si_ch7",
    question_type: "short",
    question_text:
      "What modern examples illustrate the jurisdictional competition the authors predicted?",
    correct_answer:
      "Tax havens, digital nomad visas, special economic zones, and countries like Singapore, Dubai, and Estonia offering favorable terms to attract high-net-worth individuals and entrepreneurs.",
    explanation:
      "The trend toward jurisdictional competition is visible in countries and cities competing to attract talent and capital through tax incentives, residency programs, and business-friendly regulations.",
    difficulty: "intermediate",
  },
  {
    bookRef: "si",
    chapterRef: "si_ch7",
    question_type: "mc",
    question_text:
      "The authors predict social welfare programs will:",
    correct_answer:
      "Shrink because governments will be unable to fund them as productive citizens move to low-tax jurisdictions",
    option_a:
      "Expand globally through international cooperation",
    option_b:
      "Shrink because governments will be unable to fund them as productive citizens move to low-tax jurisdictions",
    option_c:
      "Be fully replaced by private charities",
    option_d:
      "Be funded by printing money indefinitely",
    explanation:
      "The tax base for welfare programs will erode as mobile earners choose jurisdictions with lower taxes, creating fiscal pressure to reduce benefits.",
    difficulty: "intermediate",
  },

  // --- si_ch8: Cognitive Elite / Sovereign Individuals ---
  {
    bookRef: "si",
    chapterRef: "si_ch8",
    question_type: "mc",
    question_text:
      "The 'Sovereign Individuals' in the authors' vision are:",
    correct_answer:
      "Highly skilled, mobile individuals who can operate independently of any single nation-state",
    option_a: "Heads of state and monarchs",
    option_b:
      "Highly skilled, mobile individuals who can operate independently of any single nation-state",
    option_c:
      "Military leaders who overthrow governments",
    option_d: "Founders of social media companies",
    explanation:
      "Sovereign Individuals are the cognitive elite who leverage information technology to earn location-independent income that is difficult for governments to tax or control.",
    difficulty: "beginner",
  },
  {
    bookRef: "si",
    chapterRef: "si_ch8",
    question_type: "mc",
    question_text:
      "The 'cognitive elite' refers to:",
    correct_answer:
      "People whose primary economic value comes from knowledge and intellectual skills rather than physical labor",
    option_a: "University professors and academics",
    option_b:
      "People whose primary economic value comes from knowledge and intellectual skills rather than physical labor",
    option_c: "People with the highest IQ scores",
    option_d: "Government bureaucrats and policymakers",
    explanation:
      "The cognitive elite are those whose work is primarily intellectual and can be performed anywhere, giving them leverage in a world of jurisdictional competition.",
    difficulty: "beginner",
  },
  {
    bookRef: "si",
    chapterRef: "si_ch8",
    question_type: "short",
    question_text:
      "What do the authors predict about economic inequality in the information age?",
    correct_answer:
      "Inequality will increase dramatically as the cognitive elite captures disproportionate returns, while those dependent on nation-state protections see their incomes stagnate or decline.",
    explanation:
      "The authors foresee skill premiums increasing enormously, benefiting those who can operate in the cybereconomy while leaving behind those tied to the declining industrial economy.",
    difficulty: "advanced",
  },
  {
    bookRef: "si",
    chapterRef: "si_ch8",
    question_type: "mc",
    question_text:
      "The authors view a sovereign individual withdrawing from the nation-state as:",
    correct_answer:
      "A rational economic response, like a customer leaving a business that charges too much for poor service",
    option_a: "Selfish and unpatriotic",
    option_b:
      "A rational economic response, like a customer leaving a business that charges too much for poor service",
    option_c: "Immoral but inevitable",
    option_d:
      "Something governments should prevent at all costs",
    explanation:
      "The authors frame jurisdictional exit as economically rational and morally defensible -- no one is obligated to remain in a jurisdiction that extracts more value than it provides.",
    difficulty: "intermediate",
  },

  // --- si_ch9: Nationalism, Reaction, and the New Luddites ---
  {
    bookRef: "si",
    chapterRef: "si_ch9",
    question_type: "mc",
    question_text:
      "The authors predict the backlash against the information revolution will include:",
    correct_answer:
      "A rise in nationalism, populism, and neo-Luddism as those left behind resist the new order",
    option_a:
      "Universal acceptance and enthusiasm for change",
    option_b:
      "A rise in nationalism, populism, and neo-Luddism as those left behind resist the new order",
    option_c:
      "Governments successfully banning disruptive technologies",
    option_d: "A return to feudalism",
    explanation:
      "The authors predicted that the transition would provoke intense resistance from those whose livelihoods and identities are tied to the nation-state system.",
    difficulty: "intermediate",
  },
  {
    bookRef: "si",
    chapterRef: "si_ch9",
    question_type: "short",
    question_text:
      "How have the authors' predictions about nationalist backlash held up since the book was published in 1997?",
    correct_answer:
      "Remarkably well -- the rise of populist movements, Brexit, and anti-globalization sentiments across Western democracies closely mirror what Davidson and Rees-Mogg predicted.",
    explanation:
      "The wave of populism and nationalism that swept through the West in the 2010s and 2020s aligns closely with their predictions about resistance to the decline of the nation-state.",
    difficulty: "advanced",
  },
  {
    bookRef: "si",
    chapterRef: "si_ch9",
    question_type: "mc",
    question_text:
      "The 'new Luddites' are people who:",
    correct_answer:
      "Resist technological change because it threatens their economic position and way of life",
    option_a:
      "Are computer programmers who prefer older technologies",
    option_b:
      "Resist technological change because it threatens their economic position and way of life",
    option_c: "Are environmental activists",
    option_d:
      "Study the original Luddite movement as historians",
    explanation:
      "The authors use the term to describe those who oppose the information revolution because they correctly perceive that it threatens their interests.",
    difficulty: "beginner",
  },
  {
    bookRef: "si",
    chapterRef: "si_ch9",
    question_type: "mc",
    question_text:
      "The authors predict nationalism and tribalism will increase during the transition because:",
    correct_answer:
      "People losing economic security and cultural identity turn to group identities as a source of meaning and solidarity",
    option_a:
      "Information technology inherently promotes nationalist feelings",
    option_b:
      "People losing economic security and cultural identity turn to group identities as a source of meaning and solidarity",
    option_c:
      "National governments will successfully strengthen patriotic education",
    option_d:
      "The cognitive elite will promote nationalism to maintain control",
    explanation:
      "When economic disruption undermines people's sense of security and purpose, tribal and national identities offer psychological comfort and a framework for understanding who is to blame.",
    difficulty: "intermediate",
  },
  {
    bookRef: "si",
    chapterRef: "si_ch9",
    question_type: "mc",
    question_text:
      "The authors argue that nationalist backlash will ultimately fail because:",
    correct_answer:
      "The underlying technological changes are too powerful to be reversed by political resistance",
    option_a:
      "International organizations will prevent it",
    option_b:
      "People will eventually embrace change willingly",
    option_c:
      "The underlying technological changes are too powerful to be reversed by political resistance",
    option_d:
      "Nationalist movements lack charismatic leaders",
    explanation:
      "Megapolitical forces are more powerful than any political movement; no amount of populist resistance can stop the underlying technological transformation.",
    difficulty: "intermediate",
  },

  // --- si_ch10: Democracy Vulnerabilities / Morality of Markets ---
  {
    bookRef: "si",
    chapterRef: "si_ch10",
    question_type: "mc",
    question_text:
      "The authors identify which core vulnerability of democratic systems?",
    correct_answer:
      "The incentive for politicians to make unsustainable promises funded by debt, knowing voters prefer benefits now and costs later",
    option_a:
      "The inability of democracies to conduct foreign policy",
    option_b:
      "The incentive for politicians to make unsustainable promises funded by debt, knowing voters prefer benefits now and costs later",
    option_c: "Democracies never innovate technologically",
    option_d:
      "Democratic citizens always make well-informed decisions",
    explanation:
      "Short electoral cycles create incentives to front-load benefits and defer costs, leading to accumulating debt and unfunded entitlements -- a structural vulnerability the information age will expose.",
    difficulty: "intermediate",
  },
  {
    bookRef: "si",
    chapterRef: "si_ch10",
    question_type: "mc",
    question_text:
      "Democratic welfare states are vulnerable to the information revolution because:",
    correct_answer:
      "Their funding model depends on taxing a captive population, which becomes impossible when wealth is mobile",
    option_a:
      "They invest too much in education and not enough in technology",
    option_b:
      "Their funding model depends on taxing a captive population, which becomes impossible when wealth is mobile",
    option_c:
      "Welfare recipients will all become sovereign individuals",
    option_d:
      "International organizations will replace welfare states",
    explanation:
      "Welfare states require massive, reliable tax revenue from citizens who cannot easily leave. When the highest earners can relocate their digital wealth to low-tax jurisdictions, the fiscal base collapses.",
    difficulty: "intermediate",
  },
  {
    bookRef: "si",
    chapterRef: "si_ch10",
    question_type: "short",
    question_text:
      "What do the authors predict about the fate of government pension and entitlement programs?",
    correct_answer:
      "They predict severe funding crises as the tax base erodes. As high-earners exit the system, the remaining population cannot fund the promises made, leading to dramatic benefit cuts or fiscal collapse.",
    explanation:
      "The authors see entitlement programs as structures that depend on growing revenue from captive taxpayers. When that assumption breaks down, the mathematics become unsustainable.",
    difficulty: "intermediate",
  },
  {
    bookRef: "si",
    chapterRef: "si_ch10",
    question_type: "mc",
    question_text:
      "The 'rational ignorance' of voters means:",
    correct_answer:
      "Any single voter has almost no impact on outcomes, so it is rational not to invest time in understanding complex policy",
    option_a:
      "Ignorant voters are easier for good politicians to guide",
    option_b:
      "Voters should not concern themselves with policy details",
    option_c:
      "Any single voter has almost no impact on outcomes, so it is rational not to invest time in understanding complex policy",
    option_d:
      "Democracy was designed to work without informed voters",
    explanation:
      "Rational ignorance explains why voters do not study policy: the cost of becoming informed exceeds the benefit of one vote among millions. Organized interest groups with concentrated stakes disproportionately influence policy.",
    difficulty: "advanced",
  },
  {
    bookRef: "si",
    chapterRef: "si_ch10",
    question_type: "mc",
    question_text:
      "The authors characterize the morality of free markets as:",
    correct_answer:
      "The most moral system because it is based on voluntary exchange rather than coercion",
    option_a:
      "Inherently immoral because markets create inequality",
    option_b:
      "Amoral -- markets have no moral dimension",
    option_c:
      "The most moral system because it is based on voluntary exchange rather than coercion",
    option_d:
      "Only moral when heavily regulated by government",
    explanation:
      "The authors argue that voluntary exchange is inherently moral because it requires mutual consent, unlike the coercive redistribution of the state.",
    difficulty: "intermediate",
  },

  // --- si_ch11: The Future / Putting It All Together ---
  {
    bookRef: "si",
    chapterRef: "si_ch11",
    question_type: "mc",
    question_text:
      "The authors' overall tone about the future is:",
    correct_answer:
      "Optimistic for those who adapt, but grim for those who cling to the dying nation-state system",
    option_a: "Uniformly optimistic for everyone",
    option_b:
      "Optimistic for those who adapt, but grim for those who cling to the dying nation-state system",
    option_c: "Completely pessimistic and dystopian",
    option_d: "Neutral and dispassionate",
    explanation:
      "The authors present a bifurcated future: exciting opportunities for sovereign individuals who embrace the transition, and economic decline for those who depend on industrial-age institutions.",
    difficulty: "beginner",
  },
  {
    bookRef: "si",
    chapterRef: "si_ch11",
    question_type: "short",
    question_text:
      "What practical advice do the authors give readers to prepare for the information age?",
    correct_answer:
      "Develop high-value cognitive skills, make income location-independent, diversify assets across jurisdictions, and reduce dependence on any single government.",
    explanation:
      "The authors counsel readers to become sovereign individuals by acquiring portable skills, establishing financial independence from any one state, and preparing for a world of jurisdictional competition.",
    difficulty: "intermediate",
  },
  {
    bookRef: "si",
    chapterRef: "si_ch11",
    question_type: "mc",
    question_text:
      "The transition period between the industrial age and information age will be:",
    correct_answer:
      "Turbulent and violent, with the dying nation-state system lashing out before eventually collapsing",
    option_a: "Smooth and peaceful",
    option_b:
      "Turbulent and violent, with the dying nation-state system lashing out before eventually collapsing",
    option_c: "Happening overnight without warning",
    option_d: "Taking thousands of years",
    explanation:
      "The authors warn that transitions between megapolitical eras have always been disruptive, and the current one will be no exception as threatened institutions fight to survive.",
    difficulty: "intermediate",
  },
  {
    bookRef: "si",
    chapterRef: "si_ch11",
    question_type: "mc",
    question_text:
      "According to the authors, the most important asset in the information age is:",
    correct_answer:
      "Human capital -- knowledge, skills, and the ability to generate income from ideas",
    option_a: "Land and real estate",
    option_b: "Gold and precious metals",
    option_c:
      "Human capital -- knowledge, skills, and the ability to generate income from ideas",
    option_d: "Military weapons and technology",
    explanation:
      "In a world where physical assets are less important and information is king, the most valuable asset is what you know and what you can do.",
    difficulty: "beginner",
  },
  {
    bookRef: "si",
    chapterRef: "si_ch11",
    question_type: "short",
    question_text:
      "How do the authors envision the governance structures that will replace nation-states?",
    correct_answer:
      "A patchwork of competing private and semi-private entities that sell governance services (security, dispute resolution, infrastructure) to mobile citizens who choose where to reside based on value for money.",
    explanation:
      "The authors foresee governance as a market where competing providers offer bundled services, and individuals select jurisdictions the way consumers choose products.",
    difficulty: "advanced",
  },
  {
    bookRef: "si",
    chapterRef: "si_ch11",
    question_type: "mc",
    question_text:
      "The book predicts governments will respond to fiscal pressure from wealth mobility by:",
    correct_answer:
      "Initially imposing capital controls and exit taxes, but ultimately being forced to reduce spending and compete for residents",
    option_a:
      "Smoothly transitioning to smaller-government models",
    option_b:
      "Initially imposing capital controls and exit taxes, but ultimately being forced to reduce spending and compete for residents",
    option_c:
      "Successfully preventing anyone from leaving their jurisdiction",
    option_d:
      "Printing unlimited money to replace lost tax revenue without consequences",
    explanation:
      "The authors predict a period of increasingly desperate government measures to retain taxpayers, followed by the inevitable acceptance that competitive governance is the only viable path.",
    difficulty: "intermediate",
  },
  {
    bookRef: "si",
    chapterRef: "si_ch11",
    question_type: "mc",
    question_text:
      "The authors' view of the information age overall is that it is:",
    correct_answer:
      "Neither utopian nor dystopian, but a complex transformation with clear winners and losers",
    option_a: "A perfect utopia for all humanity",
    option_b: "An inevitable apocalypse",
    option_c:
      "Neither utopian nor dystopian, but a complex transformation with clear winners and losers",
    option_d:
      "Essentially the same as the industrial age but with better gadgets",
    explanation:
      "The information age is liberating for those with skills and resources but deeply disruptive for those who depend on the industrial-era social contract.",
    difficulty: "intermediate",
  },

  // ============================================================
  // CROSS-BOOK COMPARISON QUESTIONS — 22 Questions
  // ============================================================

  {
    bookRef: "cross",
    chapterRef: null,
    question_type: "mc",
    question_text:
      "Both books predict that technology will fundamentally transform civilization, but they differ primarily in:",
    correct_answer:
      "Kurzweil focuses on the biology-technology merger while Davidson/Rees-Mogg focus on the state-individual power shift",
    option_a:
      "Their timelines, with SI predicting change much sooner",
    option_b:
      "Kurzweil focuses on the biology-technology merger while Davidson/Rees-Mogg focus on the state-individual power shift",
    option_c:
      "Their views on whether technology is good or bad for humanity",
    option_d: "Nothing -- the books make identical arguments",
    explanation:
      "Kurzweil's central narrative is about merging human biology with AI and transcending biological limits. Davidson/Rees-Mogg focus on how information technology redistributes power from states to individuals.",
    difficulty: "beginner",
  },
  {
    bookRef: "cross",
    chapterRef: null,
    question_type: "short",
    question_text:
      "Compare how Kurzweil (SIN) and Davidson/Rees-Mogg (SI) view the role of government in the technological future.",
    correct_answer:
      "Kurzweil sees government as potentially helpful in managing the transition (funding research, regulating risks). Davidson/Rees-Mogg view the nation-state as a coercive institution that will be rendered obsolete. Kurzweil is reform-minded; SI is fundamentally anti-statist.",
    explanation:
      "This is one of the sharpest contrasts. Kurzweil works within the existing institutional framework; SI predicts its collapse. Their differing views reflect different analytical starting points.",
    difficulty: "intermediate",
  },
  {
    bookRef: "cross",
    chapterRef: null,
    question_type: "mc",
    question_text:
      "On the topic of inequality, the two books' positions can best be summarized as:",
    correct_answer:
      "Kurzweil believes technology will reduce inequality through falling costs; SI predicts inequality will increase as the cognitive elite escapes taxation",
    option_a: "Both books predict inequality will disappear",
    option_b:
      "Both books predict inequality will increase dramatically",
    option_c:
      "Kurzweil believes technology will reduce inequality through falling costs; SI predicts inequality will increase as the cognitive elite escapes taxation",
    option_d: "Neither book addresses inequality",
    explanation:
      "This is a fundamental disagreement. Kurzweil's exponential cost reductions lift all boats; SI's logic of violence and mobile wealth concentrates gains among the cognitive elite.",
    difficulty: "intermediate",
  },
  {
    bookRef: "cross",
    chapterRef: null,
    question_type: "mc",
    question_text:
      "Both books would likely agree that:",
    correct_answer:
      "The pace of technological change will accelerate and disrupt existing institutions in ways most people underestimate",
    option_a:
      "Government regulation is the best tool for managing technological change",
    option_b:
      "Artificial intelligence will be the most important technology of the coming era",
    option_c:
      "The pace of technological change will accelerate and disrupt existing institutions in ways most people underestimate",
    option_d:
      "Democracy will emerge stronger from the information revolution",
    explanation:
      "Despite different frameworks and conclusions, both books share the conviction that technological change is accelerating, most people underestimate its impact, and existing institutions will be profoundly disrupted.",
    difficulty: "beginner",
  },
  {
    bookRef: "cross",
    chapterRef: null,
    question_type: "short",
    question_text:
      "How do the two books differ in their treatment of human identity and what it means to be human?",
    correct_answer:
      "Kurzweil directly grapples with identity through mind uploading and consciousness, asking whether enhanced humans are still 'human.' SI treats identity through citizenship and sovereignty, arguing identity will shift from national citizen to sovereign individual. SIN's questions are metaphysical; SI's are political.",
    explanation:
      "Both books challenge conventional identity but on entirely different axes. Kurzweil asks 'are you still you after uploading?' while SI asks 'are you still a citizen when you owe no allegiance to any state?'",
    difficulty: "advanced",
  },
  {
    bookRef: "cross",
    chapterRef: null,
    question_type: "mc",
    question_text:
      "Regarding existential risk, the two books differ in that:",
    correct_answer:
      "Kurzweil emphasizes AI alignment and biotech risks; SI emphasizes societal collapse and reactionary violence during the transition",
    option_a: "Only Kurzweil's book addresses existential risk",
    option_b:
      "Both books identify identical risks and solutions",
    option_c:
      "Kurzweil emphasizes AI alignment and biotech risks; SI emphasizes societal collapse and reactionary violence during the transition",
    option_d: "SI is more worried about AI than Kurzweil is",
    explanation:
      "Kurzweil's risks are technological (misaligned AI, engineered pandemics). SI's risks are sociopolitical (state collapse, reactionary violence). The books worry about different categories of catastrophe from the same technological change.",
    difficulty: "intermediate",
  },
  {
    bookRef: "cross",
    chapterRef: null,
    question_type: "mc",
    question_text:
      "Both books can be read as arguments for:",
    correct_answer:
      "Individuals proactively adapting to technological change rather than resisting it",
    option_a:
      "Slowing down technological progress to allow society to catch up",
    option_b:
      "Individuals proactively adapting to technological change rather than resisting it",
    option_c:
      "Strengthening government control over technology development",
    option_d: "Returning to simpler, pre-industrial ways of life",
    explanation:
      "Despite different frameworks, both books urge readers to anticipate and adapt. Kurzweil encourages embracing human-AI merger; SI encourages preparing for the decline of the nation-state. Both condemn passivity.",
    difficulty: "beginner",
  },
  {
    bookRef: "cross",
    chapterRef: null,
    question_type: "short",
    question_text:
      "Compare how each book's methodology might lead to blind spots in its predictions.",
    correct_answer:
      "Kurzweil's exponential trend extrapolation may blind him to political and institutional resistance that slows adoption. SI's analysis of violence economics may underestimate how technology creates abundance that defuses the conflicts they predict. Each book's blind spot is approximately the other's strength.",
    explanation:
      "Kurzweil accounts for technology supply but underweights political demand; SI accounts for political economy but underweights technological abundance. Reading both together compensates for their respective blind spots.",
    difficulty: "advanced",
  },
  {
    bookRef: "cross",
    chapterRef: null,
    question_type: "mc",
    question_text:
      "On the topic of encryption and privacy, the two books would likely agree that:",
    correct_answer:
      "Encryption is a transformative technology that will reshape the relationship between individuals and institutions",
    option_a: "Encryption should be banned for public safety",
    option_b:
      "Encryption is a transformative technology that will reshape the relationship between individuals and institutions",
    option_c:
      "Encryption is irrelevant to the future they describe",
    option_d:
      "Only governments should have access to strong encryption",
    explanation:
      "Kurzweil discusses encryption in the context of AI safety and data protection; SI sees it as the key technology enabling sovereign individuals to protect wealth from state seizure. Both treat it as profoundly important.",
    difficulty: "intermediate",
  },
  {
    bookRef: "cross",
    chapterRef: null,
    question_type: "mc",
    question_text:
      "If both books' predictions come true simultaneously, the most likely outcome would be:",
    correct_answer:
      "A world of extreme individual capability and autonomy coexisting with radical inequality and weakened nation-states",
    option_a:
      "A perfectly equal utopia managed by benevolent AI",
    option_b:
      "Complete societal collapse with no functioning institutions",
    option_c:
      "A world of extreme individual capability and autonomy coexisting with radical inequality and weakened nation-states",
    option_d:
      "A world identical to today but with faster computers",
    explanation:
      "Combining Kurzweil's human-AI merger with SI's sovereign individuals yields a world where augmented, autonomous individuals operate in a post-nation-state landscape with enormous capability gaps.",
    difficulty: "advanced",
  },
  {
    bookRef: "cross",
    chapterRef: null,
    question_type: "short",
    question_text:
      "How might Kurzweil's concept of 'longevity escape velocity' interact with SI's prediction of a cognitive elite?",
    correct_answer:
      "If radical life extension is achieved, the cognitive elite would have far more time to accumulate wealth, skills, and influence, potentially creating an effectively permanent overclass. This would intensify the inequality and social tensions both books describe.",
    explanation:
      "This synthesis shows how the two books' predictions could amplify each other. Long life plus mobile wealth plus cognitive advantage creates a compounding advantage neither book fully explores alone.",
    difficulty: "advanced",
  },
  {
    bookRef: "cross",
    chapterRef: null,
    question_type: "mc",
    question_text:
      "The most fundamental shared assumption between the two books is:",
    correct_answer:
      "Technology is the primary driver of large-scale social, economic, and political change",
    option_a: "Human nature is infinitely malleable",
    option_b:
      "Technology is the primary driver of large-scale social, economic, and political change",
    option_c:
      "All change is driven by great leaders and their decisions",
    option_d:
      "Economic markets always reach optimal outcomes",
    explanation:
      "Both books are technologically determinist at their core: they argue that technology shapes institutions, not the reverse. They differ in which technologies matter most and what outcomes they produce.",
    difficulty: "intermediate",
  },
  {
    bookRef: "cross",
    chapterRef: null,
    question_type: "mc",
    question_text:
      "A key tension between the books is that Kurzweil envisions AI creating abundance for all while SI predicts:",
    correct_answer:
      "That abundance will be captured disproportionately by those who can protect their assets from state redistribution",
    option_a: "That AI will never be developed",
    option_b:
      "That AI will only serve government interests",
    option_c:
      "That abundance will be captured disproportionately by those who can protect their assets from state redistribution",
    option_d:
      "That scarcity will increase as technology advances",
    explanation:
      "Kurzweil sees technology-driven abundance as broadly shared thanks to falling costs. SI sees the same abundance being captured by a mobile, sovereign elite who can evade the taxation that would fund redistribution.",
    difficulty: "intermediate",
  },
  {
    bookRef: "cross",
    chapterRef: null,
    question_type: "short",
    question_text:
      "Both books describe transitions creating 'winners and losers.' Compare who they are in each framework.",
    correct_answer:
      "In SIN, losers are mostly temporary (workers displaced before new jobs emerge), and winners include all of humanity through falling costs. In SI, winners are the cognitive elite who leverage skills globally; losers are average workers and welfare recipients permanently left behind. SI's losers are more permanent; SIN's are more transitional.",
    explanation:
      "This comparison reveals differing levels of optimism. Kurzweil sees mostly temporary losers in a broadly positive transition; SI sees a permanent restructuring into haves and have-nots.",
    difficulty: "advanced",
  },
  {
    bookRef: "cross",
    chapterRef: null,
    question_type: "mc",
    question_text:
      "A reader who finds both books persuasive would most logically conclude that:",
    correct_answer:
      "Developing high-value skills, embracing technological augmentation, and maintaining geographic and financial flexibility are essential strategies",
    option_a:
      "The future is so unpredictable that no preparation is possible",
    option_b:
      "Investing in real estate is the safest long-term strategy",
    option_c:
      "Developing high-value skills, embracing technological augmentation, and maintaining geographic and financial flexibility are essential strategies",
    option_d:
      "Lobbying for stronger government regulation is the most important action",
    explanation:
      "Combining both books' lessons: technology rewards capability (both books), augmented humans will have advantages (SIN), mobile individuals will have leverage (SI), and clinging to industrial-era assumptions is the riskiest strategy.",
    difficulty: "intermediate",
  },
  {
    bookRef: "cross",
    chapterRef: null,
    question_type: "mc",
    question_text:
      "How do the two books view the relationship between technology and freedom?",
    correct_answer:
      "Both see technology as liberating, but Kurzweil emphasizes liberation from biological limits while SI emphasizes liberation from political constraints",
    option_a: "Both see technology as a threat to freedom",
    option_b: "Only Kurzweil sees technology as liberating",
    option_c:
      "Both see technology as liberating, but Kurzweil emphasizes liberation from biological limits while SI emphasizes liberation from political constraints",
    option_d: "Neither book discusses freedom",
    explanation:
      "Both authors are techno-optimists who focus on different dimensions of liberation: Kurzweil on overcoming mortality and cognitive limits, the SI authors on escaping political coercion.",
    difficulty: "intermediate",
  },
  {
    bookRef: "cross",
    chapterRef: null,
    question_type: "mc",
    question_text:
      "Both books can be described as 'techno-determinist.' This means:",
    correct_answer:
      "Both argue that technological forces are the primary drivers of social, political, and economic change",
    option_a:
      "Both argue that technology should be determined by committee",
    option_b:
      "Both argue that technological forces are the primary drivers of social, political, and economic change",
    option_c: "Both argue that human choices determine technology",
    option_d: "Neither book is techno-determinist",
    explanation:
      "Techno-determinism is the view that technology shapes society more than society shapes technology. Both books place technological change as the primary causal force driving all other transformations.",
    difficulty: "intermediate",
  },
  {
    bookRef: "cross",
    chapterRef: null,
    question_type: "mc",
    question_text:
      "How do the two books differ in their treatment of exponential technological change?",
    correct_answer:
      "Kurzweil focuses on the pace of technological capability, while Davidson/Rees-Mogg focus on how technology shifts power structures",
    option_a: "Both focus exclusively on AI",
    option_b:
      "Kurzweil focuses on the pace of technological capability, while Davidson/Rees-Mogg focus on how technology shifts power structures",
    option_c:
      "Davidson/Rees-Mogg discuss exponential growth in more technical detail",
    option_d: "Neither book discusses exponential change",
    explanation:
      "Kurzweil is primarily concerned with what technology can do and how fast it improves, while the SI authors are more concerned with how technology redistributes power and reshapes institutions.",
    difficulty: "intermediate",
  },
  {
    bookRef: "cross",
    chapterRef: null,
    question_type: "mc",
    question_text:
      "How do the two books view digital money differently?",
    correct_answer:
      "SI emphasizes digital money as a tool for escaping state control, while Kurzweil discusses it as part of broader technological progress",
    option_a:
      "Both books see digital money primarily as a privacy tool",
    option_b: "Neither book discusses digital money",
    option_c:
      "SI emphasizes digital money as a tool for escaping state control, while Kurzweil discusses it as part of broader technological progress",
    option_d:
      "Kurzweil devotes more attention to digital currency than SI does",
    explanation:
      "Digital money is central to the SI thesis about undermining state power, while Kurzweil treats financial technology as just one aspect of the broader exponential transformation.",
    difficulty: "intermediate",
  },
  {
    bookRef: "cross",
    chapterRef: null,
    question_type: "short",
    question_text:
      "If you were writing a synthesis of both books, what would be the unified thesis?",
    correct_answer:
      "Technology is the primary force reshaping civilization; it will empower individuals, erode centralized institutions, and create both unprecedented opportunities and risks. Those who understand and adapt to exponential change will thrive, while those who resist will be left behind.",
    explanation:
      "A synthesis would emphasize the shared conviction that technological change is inexorable and transformative, combining Kurzweil's technological optimism with the SI authors' political realism.",
    difficulty: "advanced",
  },
  {
    bookRef: "cross",
    chapterRef: null,
    question_type: "mc",
    question_text:
      "Both books predict power will shift away from centralized institutions. The key difference in where they see power going is:",
    correct_answer:
      "Kurzweil sees power distributing broadly through technology democratization, while SI sees it concentrating in a small cognitive elite",
    option_a:
      "Both see power going to a single world government",
    option_b:
      "Both see power distributing equally to all people",
    option_c:
      "Kurzweil sees power distributing broadly through technology democratization, while SI sees it concentrating in a small cognitive elite",
    option_d: "Neither book discusses power distribution",
    explanation:
      "This is a fundamental philosophical difference: Kurzweil's egalitarian techno-utopianism versus the SI authors' vision of a new aristocracy based on cognitive ability.",
    difficulty: "advanced",
  },
  {
    bookRef: "cross",
    chapterRef: null,
    question_type: "mc",
    question_text:
      "Which book more accurately predicted developments in AI as of the mid-2020s?",
    correct_answer:
      "The Singularity Is Nearer, as Kurzweil's predictions about the pace of AI progress have been broadly validated by large language models",
    option_a:
      "The Sovereign Individual, because it predicted AI governance",
    option_b: "Neither book made predictions about AI",
    option_c:
      "The Singularity Is Nearer, as Kurzweil's predictions about the pace of AI progress have been broadly validated by large language models",
    option_d: "Both books were equally accurate about AI",
    explanation:
      "Kurzweil's predictions about AI capability timelines have been remarkably close to what happened with deep learning and LLMs, while the SI authors did not focus on AI specifically.",
    difficulty: "intermediate",
  },
];
