/**
 * Educational content for the Workplace Harassment knowledge universe.
 *
 * Everything the site teaches lives here: the 12 presentation topics, the
 * overview, their sub-topics, keywords, examples and printable-poster
 * summaries. No UI component hard-codes teaching text, so the content can be
 * reviewed, corrected or translated in one place.
 */

export type TopicLevel = 'central' | 'main' | 'sub'

export interface TopicPoint {
  label: string
  text: string
}

export interface Topic {
  id: string
  /** Full heading used in panels and on the poster. */
  title: string
  /** Compact title used in the 3D labels and the sidebar tree. */
  navTitle: string
  level: TopicLevel
  parentId: string | null
  /** 0 = overview, 1–12 = guided presentation order, null = sub-topic. */
  index: number | null
  kicker: string
  /** Lead paragraph for the information panel. */
  definition: string
  /** One-line summary used on the printable A3 poster. */
  summary: string
  points: TopicPoint[]
  keywords: string[]
  example?: string
  note?: string
  /** Sort order inside its level / among siblings. */
  order: number
}

export const TOPICS: Topic[] = [
  {
    id: 'overview',
    title: 'Workplace Harassment',
    navTitle: 'Workplace Harassment',
    level: 'central',
    parentId: null,
    index: 0,
    kicker: 'Overview',
    definition:
      'Workplace harassment is any unwelcome behaviour — spoken, physical, psychological or sexual — that humiliates, intimidates, excludes or discriminates against a person at work. It attacks dignity rather than performance, which is why it is treated as a safety issue and not as a personality clash.',
    summary:
      'Unwelcome conduct that harms dignity and safety at work — and the law and culture that answer it.',
    points: [
      {
        label: 'Why it matters',
        text: 'Harassment damages mental health, confidence and careers, and it quietly drains productivity and trust from whole teams.',
      },
      {
        label: 'Not only extremes',
        text: 'It grows from repeated small acts — jokes, exclusion, shouting, unwanted messages — long before it looks dramatic.',
      },
      {
        label: 'Shared responsibility',
        text: 'Employers carry a legal duty of care; colleagues carry a moral one. Both decide whether people feel safe to speak.',
      },
    ],
    keywords: ['Dignity at work', 'Unwelcome conduct', 'Safe workplace'],
    note:
      'This presentation covers harassment broadly and explains the POSH Act, 2013, which specifically addresses sexual harassment of women at the workplace.',
    order: 0,
  },

  /* ------------------------------------------------------------------ 1 */
  {
    id: 'introduction',
    title: 'Introduction to Workplace Harassment',
    navTitle: 'Introduction',
    level: 'main',
    parentId: 'overview',
    index: 1,
    kicker: 'Foundations',
    definition:
      'A workplace is a relationship of dependence: income, growth and reputation rest on how others treat us. Harassment exploits that dependence through conduct that is unwelcome, repeated or severe, and damaging to the person on the receiving end.',
    summary:
      'What harassment means, why a respectful environment is the baseline rather than a bonus.',
    points: [
      {
        label: 'Meaning',
        text: 'Unwelcome conduct that a reasonable person would find offensive, hostile or intimidating — including a single serious act.',
      },
      {
        label: 'Respect is the baseline',
        text: 'Courtesy is not optional etiquette; it is the operating condition of good work and equal opportunity.',
      },
      {
        label: 'Why we discuss it',
        text: 'Awareness turns silence into recognition. Naming the behaviour is the first step towards preventing it.',
      },
    ],
    keywords: ['Unwelcome conduct', 'Reasonable person', 'Respect'],
    order: 1,
  },
  {
    id: 'definition-scope',
    title: 'Definition & Scope',
    navTitle: 'Definition & Scope',
    level: 'sub',
    parentId: 'introduction',
    index: null,
    kicker: 'Sub-topic · Introduction',
    definition:
      'The test of harassment is the experience of the person facing it, not the intention of the person doing it. A single severe act can qualify; so can a pattern of small acts that together create a hostile environment.',
    summary: 'The unwelcome-conduct test and who it protects.',
    points: [
      {
        label: 'Unwelcome, not unintended',
        text: '“It was only a joke” is not a defence: what matters is whether the conduct was welcome to the person receiving it.',
      },
      {
        label: 'Who is covered',
        text: 'Interns, contract and gig staff, remote workers, visitors and clients — not only permanent employees.',
      },
    ],
    keywords: ['Unwelcome', 'Hostile environment', 'Coverage'],
    order: 1,
  },
  {
    id: 'why-it-matters',
    title: 'Why It Matters',
    navTitle: 'Why It Matters',
    level: 'sub',
    parentId: 'introduction',
    index: null,
    kicker: 'Sub-topic · Introduction',
    definition:
      'Dignity at work is not a reward for good behaviour; it is the condition that makes good work possible. When harassment is tolerated, the cost moves from one person to the entire organisation.',
    summary: 'The human and organisational cost of tolerating harassment.',
    points: [
      {
        label: 'Silence is expensive',
        text: 'Unresolved incidents drive absenteeism, resignations and the loss of experienced people who simply leave.',
      },
      {
        label: 'Culture compounds',
        text: 'Every tolerated incident teaches a team what is acceptable, and the behaviour spreads.',
      },
    ],
    keywords: ['Cost', 'Attrition', 'Culture'],
    order: 2,
  },

  /* ------------------------------------------------------------------ 2 */
  {
    id: 'types',
    title: 'Types of Workplace Harassment',
    navTitle: 'Types',
    level: 'main',
    parentId: 'overview',
    index: 2,
    kicker: 'Forms',
    definition:
      'Harassment takes many forms, and most real cases mix several of them. What the forms share is their effect: a person is made to feel unsafe, small or unwelcome at work.',
    summary:
      'Verbal, physical, psychological, bullying, discriminatory and sexual harassment — with examples.',
    points: [
      {
        label: 'Verbal',
        text: 'Insults, slurs, humiliating jokes or threats, in person, on calls or in chat groups.',
      },
      {
        label: 'Physical',
        text: 'Unwanted touching, blocking movement, throwing objects, aggressive gestures.',
      },
      {
        label: 'Psychological',
        text: 'Isolation, constant undermining, gaslighting, impossible deadlines set to fail someone.',
      },
      {
        label: 'Bullying & intimidation',
        text: 'Repeated shouting, public humiliation, threats about appraisals, shifts or contracts.',
      },
      {
        label: 'Discrimination',
        text: 'Unequal treatment because of gender, caste, religion, disability, age, pregnancy or language.',
      },
      {
        label: 'Sexual harassment',
        text: 'Unwelcome sexual remarks, demands for favours, explicit material, unwanted physical contact.',
      },
    ],
    keywords: ['Verbal', 'Physical', 'Psychological', 'Bullying', 'Discrimination', 'Sexual'],
    example:
      'A team lead mocks a junior colleague’s accent in every group call. In one behaviour it combines verbal harassment and bullying.',
    order: 2,
  },
  {
    id: 'verbal-physical',
    title: 'Verbal & Physical Harassment',
    navTitle: 'Verbal & Physical',
    level: 'sub',
    parentId: 'types',
    index: null,
    kicker: 'Sub-topic · Types',
    definition:
      'Verbal and physical harassment are the most visible forms, and the easiest for bystanders to dismiss as “just how the team talks”. Both escalate when nobody intervenes.',
    summary: 'Insults, threats, unwanted touch and aggressive gestures.',
    points: [
      {
        label: 'Verbal',
        text: 'Mocking, slurs, personal attacks, threats, rumour-spreading — in meetings, calls and messaging groups.',
      },
      {
        label: 'Physical',
        text: 'Unwanted touching, standing too close, blocking a doorway, throwing or slamming objects near a person.',
      },
    ],
    keywords: ['Insults', 'Threats', 'Unwanted touch'],
    order: 1,
  },
  {
    id: 'psychological-bullying',
    title: 'Psychological Harassment & Bullying',
    navTitle: 'Psychological & Bullying',
    level: 'sub',
    parentId: 'types',
    index: null,
    kicker: 'Sub-topic · Types',
    definition:
      'Psychological harassment is conduct that damages a person’s confidence and standing without leaving a visible mark. Because there is no incident to photograph, it is often the hardest form to prove and the last to be reported.',
    summary: 'Undermining, isolation and repeated public humiliation.',
    points: [
      {
        label: 'Isolation',
        text: 'Excluding someone from meetings, information and informal channels so their work becomes impossible.',
      },
      {
        label: 'Undermining',
        text: 'Constant criticism, credit-taking, shifting targets and setting deadlines designed to fail.',
      },
    ],
    keywords: ['Gaslighting', 'Isolation', 'Humiliation'],
    order: 2,
  },
  {
    id: 'discrimination',
    title: 'Discriminatory Harassment',
    navTitle: 'Discrimination',
    level: 'sub',
    parentId: 'types',
    index: null,
    kicker: 'Sub-topic · Types',
    definition:
      'Discriminatory harassment treats a person as a member of a group rather than as a colleague: their gender, caste, religion, region, language, disability, age or pregnancy becomes the reason they are excluded or demeaned.',
    summary: 'Harassment rooted in gender, caste, religion, disability and more.',
    points: [
      {
        label: 'Everyday examples',
        text: 'Jokes about a colleague’s caste or region, refusing to assign client work to a pregnant employee, mocking a disability.',
      },
      {
        label: 'Legal overlap',
        text: 'Articles 14 and 15 of the Constitution prohibit discrimination, and service rules or company policy may add further protections.',
      },
    ],
    keywords: ['Equality', 'Caste', 'Gender', 'Disability'],
    order: 3,
  },
  {
    id: 'sexual-harassment',
    title: 'Sexual Harassment',
    navTitle: 'Sexual Harassment',
    level: 'sub',
    parentId: 'types',
    index: null,
    kicker: 'Sub-topic · Types',
    definition:
      'Sexual harassment is any unwelcome conduct of a sexual nature. It does not require physical contact, a repeated pattern, or a direct threat — it requires that the conduct is unwelcome and of a sexual nature.',
    summary: 'Unwelcome conduct of a sexual nature, in or around the workplace.',
    points: [
      {
        label: 'It includes',
        text: 'Sexually coloured remarks, requests for sexual favours, showing pornography, unwanted messages, stalking and unwanted touch.',
      },
      {
        label: 'It also includes',
        text: 'A hostile environment — conduct that creates an intimidating or offensive atmosphere, even with no demand attached.',
      },
    ],
    keywords: ['Unwelcome', 'Sexual nature', 'Hostile environment', 'POSH'],
    order: 4,
  },

  /* ------------------------------------------------------------------ 3 */
  {
    id: 'causes',
    title: 'Causes of Workplace Harassment',
    navTitle: 'Causes',
    level: 'main',
    parentId: 'overview',
    index: 3,
    kicker: 'Root causes',
    definition:
      'Harassment rarely comes from a single “bad apple”. It grows where power is unchecked, awareness is low, and the cost of complaining is higher than the cost of staying silent.',
    summary:
      'Misused authority, power imbalance, weak complaint systems and cultures that reward silence.',
    points: [
      {
        label: 'Misuse of authority',
        text: 'Supervisors who control appraisals, shifts or contracts can use that control as leverage.',
      },
      {
        label: 'Lack of awareness',
        text: 'Managers may not recognise that “strict” behaviour has crossed into harassment; employees may not know their rights.',
      },
      {
        label: 'Power imbalance',
        text: 'Interns, contract staff and juniors depend on the harasser for pay, references and progression.',
      },
      {
        label: 'Poor workplace culture',
        text: 'Jokes normalise contempt, hierarchy silences dissent, and “high pressure” is used to excuse aggression.',
      },
      {
        label: 'Weak complaint mechanisms',
        text: 'No committee, no written policy, no trusted person to approach — so incidents never surface.',
      },
      {
        label: 'Lack of accountability',
        text: 'When complaints end in no action, the organisation teaches everyone that the behaviour is acceptable.',
      },
    ],
    keywords: ['Power', 'Awareness', 'Culture', 'Accountability'],
    order: 3,
  },
  {
    id: 'power-imbalance',
    title: 'Power Imbalance',
    navTitle: 'Power Imbalance',
    level: 'sub',
    parentId: 'causes',
    index: null,
    kicker: 'Sub-topic · Causes',
    definition:
      'Harassment follows dependency. Where one person controls another’s work, pay, visa, shift or appraisal, speaking up feels like risking the job itself.',
    summary: 'Why dependency makes silence feel like the rational choice.',
    points: [
      {
        label: 'Who is vulnerable',
        text: 'Interns, probationers, contract and domestic workers, and anyone whose role is “at the manager’s discretion”.',
      },
      {
        label: 'The lever',
        text: 'Threats are rarely explicit; a hint about appraisals or contract renewal is enough to silence someone.',
      },
    ],
    keywords: ['Dependency', 'Leverage', 'Vulnerability'],
    order: 1,
  },
  {
    id: 'culture-awareness',
    title: 'Culture & Awareness',
    navTitle: 'Culture & Awareness',
    level: 'sub',
    parentId: 'causes',
    index: null,
    kicker: 'Sub-topic · Causes',
    definition:
      'Culture is what a team permits. Where seniors laugh at demeaning jokes, newcomers learn quickly that objection is riskier than endurance.',
    summary: 'How normalised behaviour and low awareness enable harassment.',
    points: [
      {
        label: 'Normalisation',
        text: 'Banal comments, “harmless” group chats and ritual ragging teach people that harassment is part of the job.',
      },
      {
        label: 'Awareness gap',
        text: 'Many employees cannot name the behaviour, the committee or the remedy — so nothing is reported.',
      },
    ],
    keywords: ['Normalisation', 'Training', 'Silence'],
    order: 2,
  },
  {
    id: 'weak-complaints',
    title: 'Weak Complaint Systems',
    navTitle: 'Weak Complaint Systems',
    level: 'sub',
    parentId: 'causes',
    index: null,
    kicker: 'Sub-topic · Causes',
    definition:
      'A complaint mechanism exists on paper in many organisations but not in practice: no trained committee, no confidentiality, no timelines, and no outcome the complainant ever hears about.',
    summary: 'Why a policy without a working process changes nothing.',
    points: [
      {
        label: 'Missing structures',
        text: 'No Internal Committee, an untrained one, or a channel that routes complaints back to the harasser.',
      },
      {
        label: 'Fear of retaliation',
        text: 'Without protection during an inquiry, a complainant risks transfer, isolation or a ruined appraisal.',
      },
    ],
    keywords: ['ICC', 'Confidentiality', 'Retaliation'],
    order: 3,
  },

  /* ------------------------------------------------------------------ 4 */
  {
    id: 'effects',
    title: 'Effects of Workplace Harassment',
    navTitle: 'Effects',
    level: 'main',
    parentId: 'overview',
    index: 4,
    kicker: 'Impact',
    definition:
      'The harm does not stop at the target. Families, teams and the organisation absorb it — through health, performance, turnover and reputation.',
    summary:
      'Mental health, confidence, productivity, career growth, team trust and organisational reputation.',
    points: [
      {
        label: 'Mental well-being',
        text: 'Anxiety, sleeplessness, depression and post-traumatic symptoms that outlast the job itself.',
      },
      {
        label: 'Confidence',
        text: 'Self-doubt, withdrawal from meetings, and a reluctance to take on visible work or speak in reviews.',
      },
      {
        label: 'Productivity',
        text: 'Absenteeism and “presenteeism” — people at their desks but unable to concentrate — plus errors and delays.',
      },
      {
        label: 'Professional growth',
        text: 'Missed promotions, forced transfers, resignations and leaving the sector altogether.',
      },
      {
        label: 'Team relationships',
        text: 'Fear, gossip and silence replace trust; bystanders become anxious and disengaged.',
      },
      {
        label: 'Organisational reputation',
        text: 'Legal exposure, attrition costs, failed hiring and a damaged employer brand.',
      },
    ],
    keywords: ['Well-being', 'Productivity', 'Attrition', 'Reputation'],
    note: 'Effects compound: a single unresolved complaint can silence an entire team, not just the person who filed it.',
    order: 4,
  },
  {
    id: 'mental-health',
    title: 'Mental Well-being',
    navTitle: 'Mental Well-being',
    level: 'sub',
    parentId: 'effects',
    index: null,
    kicker: 'Sub-topic · Effects',
    definition:
      'The psychological cost is usually the first and longest-lasting effect. It can appear as anxiety before work, disturbed sleep, irritability or a persistent sense of being watched.',
    summary: 'Anxiety, sleep loss and long-term trauma.',
    points: [
      {
        label: 'What it looks like',
        text: 'Dread on Sunday evening, panic in meetings, avoidance of the harasser, withdrawal from colleagues.',
      },
      {
        label: 'It outlasts the job',
        text: 'People often carry the effects into the next workplace, where trust takes years to rebuild.',
      },
    ],
    keywords: ['Anxiety', 'Trauma', 'Burnout'],
    order: 1,
  },
  {
    id: 'productivity-growth',
    title: 'Productivity & Career Growth',
    navTitle: 'Productivity & Growth',
    level: 'sub',
    parentId: 'effects',
    index: null,
    kicker: 'Sub-topic · Effects',
    definition:
      'Harassment is expensive. Time is spent managing fear rather than work, and talented people remove themselves from roles where they cannot thrive.',
    summary: 'Lost output, missed promotions and forced exits.',
    points: [
      {
        label: 'Measurable cost',
        text: 'Higher absenteeism, more errors, slower delivery and the recruitment cost of replacing people who leave.',
      },
      {
        label: 'Career damage',
        text: 'Targets often decline opportunities or accept transfers to escape a situation rather than report it.',
      },
    ],
    keywords: ['Absenteeism', 'Turnover', 'Promotion'],
    order: 2,
  },
  {
    id: 'teams-reputation',
    title: 'Teams & Reputation',
    navTitle: 'Teams & Reputation',
    level: 'sub',
    parentId: 'effects',
    index: null,
    kicker: 'Sub-topic · Effects',
    definition:
      'Bystanders are affected too. Witnessing harassment reduces trust in management, discourages people from reporting their own problems, and spreads a quiet culture of self-protection.',
    summary: 'Eroded trust, weak safety culture and employer brand damage.',
    points: [
      {
        label: 'Bystander effect',
        text: 'People who see harassment go unaddressed are less likely to intervene or report, and more likely to leave.',
      },
      {
        label: 'Reputation',
        text: 'News of a mishandled inquiry travels through alumni networks, review sites and hiring conversations.',
      },
    ],
    keywords: ['Trust', 'Bystanders', 'Employer brand'],
    order: 3,
  },

  /* ------------------------------------------------------------------ 5 */
  {
    id: 'laws',
    title: 'Indian Laws and Legal Framework',
    navTitle: 'Indian Laws',
    level: 'main',
    parentId: 'overview',
    index: 5,
    kicker: 'Legal framework',
    definition:
      'India protects workers through constitutional guarantees, criminal law, labour statutes and a dedicated Act for sexual harassment of women. No single law covers every form of harassment, so the protections are read together.',
    summary:
      'Constitution, criminal law, labour statutes and the dedicated POSH Act, 2013.',
    points: [
      {
        label: 'Constitution of India',
        text: 'Articles 14 and 15 (equality and non-discrimination), 19(1)(g) (right to practise a profession) and 21 (life with dignity) underpin every workplace right.',
      },
      {
        label: 'Criminal law',
        text: 'The Bharatiya Nyaya Sanhita, 2023, which replaced the Indian Penal Code, penalises sexual harassment, stalking, voyeurism and criminal intimidation.',
      },
      {
        label: 'POSH Act, 2013',
        text: 'A civil law creating Internal and Local Committees, inquiry procedures and employer duties for sexual harassment of women at the workplace.',
      },
      {
        label: 'Labour and service law',
        text: 'Standing orders, factory rules and government service conduct rules punish misconduct and require safe working conditions.',
      },
      {
        label: 'Company policy',
        text: 'Most organisations adopt a broader anti-harassment policy covering all employees and all forms of harassment.',
      },
    ],
    keywords: ['Article 21', 'BNS 2023', 'POSH', 'Policy'],
    note:
      'The POSH Act addresses sexual harassment of women. Other forms of harassment, and harassment of other genders, are addressed through service rules, criminal law and organisational policy.',
    order: 5,
  },
  {
    id: 'constitutional',
    title: 'Constitutional Basis',
    navTitle: 'Constitutional Basis',
    level: 'sub',
    parentId: 'laws',
    index: null,
    kicker: 'Sub-topic · Laws',
    definition:
      'The Constitution supplies the principles that workplace law applies: equality before the law, prohibition of discrimination, freedom to pursue a profession, and the right to live with dignity.',
    summary: 'Articles 14, 15, 19(1)(g) and 21.',
    points: [
      {
        label: 'Articles 14 and 15',
        text: 'Equal treatment and a prohibition on discrimination on grounds of religion, race, caste, sex or place of birth.',
      },
      {
        label: 'Articles 19(1)(g) and 21',
        text: 'The right to practise any profession, and the right to life and personal liberty interpreted to include dignity at work.',
      },
    ],
    keywords: ['Equality', 'Dignity', 'Article 21'],
    order: 1,
  },
  {
    id: 'criminal-law',
    title: 'Criminal Law',
    navTitle: 'Criminal Law',
    level: 'sub',
    parentId: 'laws',
    index: null,
    kicker: 'Sub-topic · Laws',
    definition:
      'Serious conduct at work can also be a crime. The Bharatiya Nyaya Sanhita, 2023 replaced the Indian Penal Code and continues to penalise sexual harassment, assault, stalking and intimidation.',
    summary: 'BNS 2023 offences that apply to workplace conduct.',
    points: [
      {
        label: 'Relevant offences',
        text: 'Sexual harassment, assault or criminal force, stalking, voyeurism, criminal intimidation and insulting a woman’s modesty.',
      },
      {
        label: 'Two tracks',
        text: 'A criminal complaint and a POSH inquiry can run in parallel; the POSH process is civil, confidential and employment-focused.',
      },
    ],
    keywords: ['BNS 2023', 'Criminal complaint', 'Stalking'],
    order: 2,
  },
  {
    id: 'other-safeguards',
    title: 'Other Safeguards',
    navTitle: 'Other Safeguards',
    level: 'sub',
    parentId: 'laws',
    index: null,
    kicker: 'Sub-topic · Laws',
    definition:
      'Beyond the Constitution and criminal law, workplace protections come from labour legislation, service rules and — in practice — the employer’s own policy.',
    summary: 'Labour statutes, service rules and company policy.',
    points: [
      {
        label: 'Labour and service rules',
        text: 'Standing orders, factory rules and government conduct rules define misconduct and the disciplinary process.',
      },
      {
        label: 'Company policy',
        text: 'An anti-harassment policy can protect all genders and all forms of harassment, and should state a reporting channel and timeline.',
      },
    ],
    keywords: ['Standing orders', 'Service rules', 'Policy'],
    order: 3,
  },

  /* ------------------------------------------------------------------ 6 */
  {
    id: 'posh',
    title: 'POSH Act, 2013',
    navTitle: 'POSH Act, 2013',
    level: 'main',
    parentId: 'laws',
    index: 6,
    kicker: 'The dedicated law',
    definition:
      'The Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013 — “POSH” — came into force on 9 December 2013 and extends to the whole of India. It creates a time-bound, confidential redressal mechanism and places the duty of prevention on the employer.',
    summary:
      'The Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013.',
    points: [
      {
        label: 'The three words in the name',
        text: 'Prevention (awareness and culture), Prohibition (a binding ban) and Redressal (committees and inquiries).',
      },
      {
        label: 'Objectives',
        text: 'Protect women from sexual harassment at work, ensure a safe environment, and provide an accessible remedy without fear of retaliation.',
      },
      {
        label: 'Who is protected',
        text: 'All women at a workplace — permanent, temporary, part-time, contract, interns, domestic workers, and visitors or clients present on the premises.',
      },
      {
        label: 'Why it matters',
        text: 'It converts dignity at work from an aspiration into an enforceable right, and shifts the cost of prevention onto the employer.',
      },
    ],
    keywords: ['2013', 'Prevention', 'Prohibition', 'Redressal'],
    note:
      'POSH is not a general anti-bullying statute. It deals specifically with sexual harassment of women at the workplace.',
    order: 6,
  },
  {
    id: 'posh-objectives',
    title: 'Objectives of the Act',
    navTitle: 'Objectives',
    level: 'sub',
    parentId: 'posh',
    index: null,
    kicker: 'Sub-topic · POSH Act',
    definition:
      'The Act has three connected purposes: stop harassment before it happens, prohibit it as conduct, and give every woman a credible route to redress when it does happen.',
    summary: 'Prevention, prohibition and redressal in practice.',
    points: [
      {
        label: 'Prevention',
        text: 'Awareness programmes, displayed information, training for committee members and a safe working environment.',
      },
      {
        label: 'Redressal',
        text: 'A written complaint, a time-bound inquiry, interim relief where needed and confidentiality throughout.',
      },
    ],
    keywords: ['Prevention', 'Redressal', 'Awareness'],
    order: 1,
  },
  {
    id: 'posh-coverage',
    title: 'Who Is Protected',
    navTitle: 'Who Is Protected',
    level: 'sub',
    parentId: 'posh',
    index: null,
    kicker: 'Sub-topic · POSH Act',
    definition:
      'The Act is deliberately wide. It covers the organised and unorganised sectors, all workplaces, and women who are not conventional employees.',
    summary: 'All women at a workplace, including visitors and domestic workers.',
    points: [
      {
        label: 'Employment status is irrelevant',
        text: 'Permanent, temporary, part-time, contract, probationary, intern, or working without pay.',
      },
      {
        label: 'Place is broad',
        text: 'Office, factory, field site, vehicle used for work, client premises, or any place arising out of employment — including remote work channels.',
      },
    ],
    keywords: ['Coverage', 'Unorganised sector', 'Domestic workers'],
    order: 2,
  },
  {
    id: 'posh-definition',
    title: 'What Counts as Harassment',
    navTitle: 'What Counts',
    level: 'sub',
    parentId: 'posh',
    index: null,
    kicker: 'Sub-topic · POSH Act',
    definition:
      'The Act lists physical, verbal, non-verbal and online conduct, and also recognises a hostile environment created by such conduct.',
    summary: 'Unwelcome acts of a sexual nature, in any medium.',
    points: [
      {
        label: 'Listed conduct',
        text: 'Unwelcome physical contact or advances, demands for sexual favours, sexually coloured remarks, showing pornography, and any other unwelcome sexual conduct.',
      },
      {
        label: 'Includes the environment',
        text: 'A workplace made hostile or intimidating by such conduct is itself covered, even if no favour was demanded.',
      },
    ],
    keywords: ['Unwelcome', 'Quid pro quo', 'Hostile environment'],
    order: 3,
  },

  /* ------------------------------------------------------------------ 7 */
  {
    id: 'provisions',
    title: 'Important Provisions of the POSH Act',
    navTitle: 'Key Provisions',
    level: 'main',
    parentId: 'posh',
    index: 7,
    kicker: 'Machinery',
    definition:
      'Three structures make the Act work: an Internal Committee in larger workplaces, a Local Committee at district level, and a defined complaint procedure with strict timelines.',
    summary:
      'Internal Committee, Local Committee and the complaint procedure with its timelines.',
    points: [
      {
        label: 'Internal Committee',
        text: 'Mandatory in workplaces with 10 or more employees; receives and examines complaints and completes the inquiry within 90 days.',
      },
      {
        label: 'Local Committee',
        text: 'Constituted in every district; handles workplaces with fewer than 10 workers, the unorganised sector, domestic workers and complaints against the employer.',
      },
      {
        label: 'Complaint procedure',
        text: 'A written complaint is normally filed within 3 months, with a possible extension of up to 3 more months for valid reasons.',
      },
      {
        label: 'Interim relief',
        text: 'During the inquiry the employer may grant transfer, additional leave or another relief requested by the complainant.',
      },
      {
        label: 'Confidentiality',
        text: 'The identity of the complainant and the contents of the inquiry may not be published; breach attracts penalties under the Act.',
      },
    ],
    keywords: ['IC', 'LC', '3 months', '90-day inquiry'],
    order: 7,
  },
  {
    id: 'internal-committee',
    title: 'Internal Committee (IC)',
    navTitle: 'Internal Committee',
    level: 'sub',
    parentId: 'provisions',
    index: null,
    kicker: 'Sub-topic · Provisions',
    definition:
      'Every workplace with 10 or more employees must constitute an Internal Committee. It is the first point of redress for most employees, and its composition is prescribed so that it is neither captured by management nor hostile to complainants.',
    summary: 'Mandatory in workplaces with 10 or more employees.',
    points: [
      {
        label: 'Composition',
        text: 'A senior woman presiding officer, at least two employee members, and one external member from an NGO or with legal expertise.',
      },
      {
        label: 'Duties',
        text: 'Receive complaints, conduct an impartial inquiry within 90 days, submit a report, and recommend action to the employer.',
      },
      {
        label: 'Tenure and training',
        text: 'Members hold office for up to three years and are expected to be trained in the Act and in inquiry procedure.',
      },
    ],
    keywords: ['10+ employees', 'Presiding officer', '90 days'],
    order: 1,
  },
  {
    id: 'local-committee',
    title: 'Local Committee (LC)',
    navTitle: 'Local Committee',
    level: 'sub',
    parentId: 'provisions',
    index: null,
    kicker: 'Sub-topic · Provisions',
    definition:
      'Not every workplace can run an Internal Committee — a shop with four workers cannot. The Act therefore creates a committee in every district to reach the unorganised sector and small establishments.',
    summary: 'District-level committee for small workplaces and complaints against employers.',
    points: [
      {
        label: 'Jurisdiction',
        text: 'Workplaces with fewer than 10 employees, the unorganised sector, domestic workers, and complaints made against the employer itself.',
      },
      {
        label: 'Composition',
        text: 'Appointed by the district officer, chaired by a woman, with members from women’s organisations and a legal expert.',
      },
      {
        label: 'Same procedure',
        text: 'The LC follows the same inquiry timelines, confidentiality duties and reporting requirements as an IC.',
      },
    ],
    keywords: ['District', '<10 workers', 'Unorganised sector'],
    order: 2,
  },
  {
    id: 'complaint-procedure',
    title: 'Complaint Procedure',
    navTitle: 'Complaint Procedure',
    level: 'sub',
    parentId: 'provisions',
    index: null,
    kicker: 'Sub-topic · Provisions',
    definition:
      'The Act sets a simple, written route to redress with clear timelines, so a complainant knows what happens next and by when.',
    summary: 'A written complaint within three months, extendable by up to three more.',
    points: [
      {
        label: 'Filing',
        text: 'A written complaint, ordinarily within 3 months of the incident; the committee may extend this by up to 3 months for valid reasons.',
      },
      {
        label: 'Support',
        text: 'A complainant may be accompanied by a friend or colleague, and may request interim relief such as transfer or leave.',
      },
      {
        label: 'Inquiry',
        text: 'Conciliation is possible only at the complainant’s request and never with monetary settlement; otherwise a full inquiry follows.',
      },
      {
        label: 'Outcome',
        text: 'The committee reports to the employer, which must act on its recommendations within 60 days and confirm compliance.',
      },
    ],
    keywords: ['Written complaint', '3 months', 'Conciliation', '60 days'],
    order: 3,
  },

  /* ------------------------------------------------------------------ 8 */
  {
    id: 'responsibilities',
    title: 'Employer Responsibilities',
    navTitle: 'Employer Duties',
    level: 'main',
    parentId: 'overview',
    index: 8,
    kicker: 'Duty of care',
    definition:
      'The Act places the duty of prevention on the employer: not only to punish harassment after the fact, but to make it less likely and easier to report.',
    summary:
      'Safe environment, awareness, displayed information, complaint procedures, action and confidentiality.',
    points: [
      {
        label: 'Safe working environment',
        text: 'A written policy, a functioning committee, and protection from retaliation during and after an inquiry.',
      },
      {
        label: 'Awareness programmes',
        text: 'Orientation for new joiners, periodic sensitisation for managers, and training for committee members.',
      },
      {
        label: 'Displaying information',
        text: 'The Act, the policy and the committee’s names and contact details must be displayed conspicuously; failure can attract a fine of ₹50,000.',
      },
      {
        label: 'Complaint procedures',
        text: 'Clear reporting channels, help for the complainant through the process, and a written record of every complaint.',
      },
      {
        label: 'Appropriate action',
        text: 'Act on the committee’s recommendations, and report the number of complaints and their outcomes in the annual report.',
      },
      {
        label: 'Confidentiality',
        text: 'Protect the identity of the complainant, the respondent and witnesses throughout the inquiry.',
      },
    ],
    keywords: ['Duty of care', 'Notice', 'Annual report', 'Confidentiality'],
    order: 8,
  },
  {
    id: 'safe-environment',
    title: 'Safe Working Environment',
    navTitle: 'Safe Environment',
    level: 'sub',
    parentId: 'responsibilities',
    index: null,
    kicker: 'Sub-topic · Employer',
    definition:
      'A safe environment is a physical and psychological condition: people know what is unacceptable, know where to go, and trust that using the process will not cost them their job.',
    summary: 'Policy, committee and protection from retaliation.',
    points: [
      {
        label: 'The basics',
        text: 'A published policy, a trained committee, secure records and a named contact for each office or site.',
      },
      {
        label: 'No retaliation',
        text: 'Complainants and witnesses must be protected from transfer, withheld appraisal or social isolation during the inquiry.',
      },
    ],
    keywords: ['Policy', 'Retaliation', 'Trust'],
    order: 1,
  },
  {
    id: 'awareness-display',
    title: 'Awareness & Display',
    navTitle: 'Awareness & Display',
    level: 'sub',
    parentId: 'responsibilities',
    index: null,
    kicker: 'Sub-topic · Employer',
    definition:
      'Awareness is the cheapest prevention available. Staff who can name harassment, and who know the committee exists, are far more likely to report early instead of enduring in silence.',
    summary: 'Training, orientation and the mandatory notice.',
    points: [
      {
        label: 'Programmes',
        text: 'Induction modules, annual refreshers, manager training and case-based workshops for committee members.',
      },
      {
        label: 'Mandatory display',
        text: 'The Act, the policy and committee contact details must be posted conspicuously; non-compliance can attract a ₹50,000 fine.',
      },
    ],
    keywords: ['Training', 'Notice', '₹50,000'],
    order: 2,
  },
  {
    id: 'action-confidentiality',
    title: 'Action & Confidentiality',
    navTitle: 'Action & Confidentiality',
    level: 'sub',
    parentId: 'responsibilities',
    index: null,
    kicker: 'Sub-topic · Employer',
    definition:
      'A policy is judged by what happens after a complaint. Acting on the committee’s report — and keeping the process confidential — is what makes the next person willing to come forward.',
    summary: 'Acting on findings without exposing the complainant.',
    points: [
      {
        label: 'Acting on the report',
        text: 'The employer must implement the recommended action within 60 days and report compliance to the committee.',
      },
      {
        label: 'Confidentiality',
        text: 'Names, statements and inquiry details stay restricted; publishing them is itself an offence under the Act.',
      },
    ],
    keywords: ['60 days', 'Disciplinary action', 'Privacy'],
    order: 3,
  },

  /* ------------------------------------------------------------------ 9 */
  {
    id: 'ethics',
    title: 'Ethical Values and Workplace Culture',
    navTitle: 'Ethical Values',
    level: 'main',
    parentId: 'overview',
    index: 9,
    kicker: 'Culture',
    definition:
      'Laws set the floor, not the ceiling. A culture of respect is built by everyday choices about how people speak to and about each other — long before anything becomes a complaint.',
    summary:
      'Respect, equality, empathy, integrity, accountability and human dignity as daily practice.',
    points: [
      {
        label: 'Respect',
        text: 'Treating every role — housekeeping staff, intern, manager — with the same basic courtesy.',
      },
      {
        label: 'Equality',
        text: 'Equal access to work, credit, training and promotion regardless of gender, caste, religion or background.',
      },
      {
        label: 'Empathy',
        text: 'Noticing when a colleague is uncomfortable, and making room for them to say so without cost.',
      },
      {
        label: 'Integrity',
        text: 'Refusing to laugh along, staying truthful in an inquiry, and not protecting a friend who is wrong.',
      },
      {
        label: 'Accountability',
        text: 'Managers owning the climate of their teams, and organisations owning their failures publicly.',
      },
      {
        label: 'Human dignity',
        text: 'The single test for any behaviour: does it leave the other person more whole, or less?',
      },
    ],
    keywords: ['Respect', 'Empathy', 'Integrity', 'Dignity'],
    example:
      'A manager who stops a demeaning joke in a team meeting does more for culture than a poster on the wall — silence is read as permission.',
    order: 9,
  },
  {
    id: 'respect-dignity',
    title: 'Respect & Human Dignity',
    navTitle: 'Respect & Dignity',
    level: 'sub',
    parentId: 'ethics',
    index: null,
    kicker: 'Sub-topic · Ethics',
    definition:
      'Dignity is the right to be treated as a person rather than as a function. It is not something earned by seniority or performance, and it does not depend on being liked.',
    summary: 'Courtesy as a baseline, not a favour.',
    points: [
      {
        label: 'Small acts, large effect',
        text: 'Saying please, listening without interrupting, correcting privately and crediting publicly.',
      },
      {
        label: 'Hierarchy is not licence',
        text: 'Seniority buys responsibility, not the right to humiliate.',
      },
    ],
    keywords: ['Dignity', 'Courtesy', 'Hierarchy'],
    order: 1,
  },
  {
    id: 'equality-empathy',
    title: 'Equality & Empathy',
    navTitle: 'Equality & Empathy',
    level: 'sub',
    parentId: 'ethics',
    index: null,
    kicker: 'Sub-topic · Ethics',
    definition:
      'Equality is fair access to opportunity; empathy is the willingness to imagine another person’s position. Together they turn a diverse team into a safe one.',
    summary: 'Fair opportunity plus the willingness to notice.',
    points: [
      {
        label: 'Equality in practice',
        text: 'Transparent assignment of work, credit and promotion criteria — not informal networks.',
      },
      {
        label: 'Empathy in practice',
        text: 'Checking in privately, believing a first disclosure, and asking what support the person wants.',
      },
    ],
    keywords: ['Opportunity', 'Inclusion', 'Listening'],
    order: 2,
  },
  {
    id: 'integrity-accountability',
    title: 'Integrity & Accountability',
    navTitle: 'Integrity & Accountability',
    level: 'sub',
    parentId: 'ethics',
    index: null,
    kicker: 'Sub-topic · Ethics',
    definition:
      'Integrity is doing the right thing when it is inconvenient; accountability is accepting the consequences when you do not. Both are tested most when the person at fault is powerful or popular.',
    summary: 'Consistency, honesty and owning the outcome.',
    points: [
      {
        label: 'Integrity',
        text: 'Reporting what you saw accurately, even when it implicates a friend or a senior.',
      },
      {
        label: 'Accountability',
        text: 'Leaders owning failures in the process instead of blaming the complainant for “creating a fuss”.',
      },
    ],
    keywords: ['Honesty', 'Responsibility', 'Leadership'],
    order: 3,
  },

  /* ----------------------------------------------------------------- 10 */
  {
    id: 'prevention',
    title: 'Prevention and Reporting',
    navTitle: 'Prevention & Reporting',
    level: 'main',
    parentId: 'overview',
    index: 10,
    kicker: 'Action',
    definition:
      'Prevention works when speaking up is normal, safe and effective — not heroic. That requires awareness, visible channels, real support and a process people trust.',
    summary:
      'Awareness, speaking up, clear channels, support for affected employees and fair handling.',
    points: [
      {
        label: 'Creating awareness',
        text: 'Regular training that uses real scenarios, not just legal text, so people can recognise the behaviour in themselves and others.',
      },
      {
        label: 'Encouraging people to speak up',
        text: 'Leaders who respond seriously to the first disclosure, and bystanders who intervene or report.',
      },
      {
        label: 'Clear reporting channels',
        text: 'Named committee contacts, a monitored email address, and a written escalation path for when the usual channel is the problem.',
      },
      {
        label: 'Supporting affected employees',
        text: 'Counselling, interim relief, protection from retaliation, and updates at each stage of the inquiry.',
      },
      {
        label: 'Fair handling',
        text: 'Impartial inquiry, both sides heard, timelines respected, and outcomes communicated to the parties.',
      },
    ],
    keywords: ['Awareness', 'Speak up', 'Channels', 'Support', 'Fair process'],
    order: 10,
  },
  {
    id: 'awareness-training',
    title: 'Awareness & Training',
    navTitle: 'Awareness',
    level: 'sub',
    parentId: 'prevention',
    index: null,
    kicker: 'Sub-topic · Prevention',
    definition:
      'Training should change behaviour, not just satisfy a compliance checklist. Scenario-based sessions help people recognise the moment when a joke becomes harassment.',
    summary: 'Scenario-based sessions that build recognition.',
    points: [
      {
        label: 'What works',
        text: 'Short, recurring workshops with real cases, clear definitions and a named person to approach afterwards.',
      },
      {
        label: 'Who needs it',
        text: 'New joiners, managers who receive disclosures, committee members, and contractors working on site.',
      },
    ],
    keywords: ['Training', 'Scenarios', 'Managers'],
    order: 1,
  },
  {
    id: 'reporting-channels',
    title: 'Reporting Channels',
    navTitle: 'Reporting Channels',
    level: 'sub',
    parentId: 'prevention',
    index: null,
    kicker: 'Sub-topic · Prevention',
    definition:
      'A channel is only real if people know it exists and believe it will not send their complaint back to the person they are complaining about.',
    summary: 'Named contacts, written routes and a bypass for blocked channels.',
    points: [
      {
        label: 'Multiple routes',
        text: 'Internal Committee email and phone, an HR escalation path, and the Local Committee for small workplaces.',
      },
      {
        label: 'Bypass options',
        text: 'When the complaint is against the manager or employer, the channel must route outside that reporting line.',
      },
    ],
    keywords: ['Channel', 'Escalation', 'LC'],
    order: 2,
  },
  {
    id: 'employee-support',
    title: 'Support for Employees',
    navTitle: 'Employee Support',
    level: 'sub',
    parentId: 'prevention',
    index: null,
    kicker: 'Sub-topic · Prevention',
    definition:
      'Reporting is an act of trust. Support during the process decides whether the person can stay in the job — and whether anyone else will report in future.',
    summary: 'Counselling, interim relief and protection from retaliation.',
    points: [
      {
        label: 'Practical support',
        text: 'Counselling, adjusted hours, a change of reporting line, or leave during the inquiry.',
      },
      {
        label: 'Process support',
        text: 'A colleague to accompany the complainant, written updates on timelines, and protection from retaliation.',
      },
    ],
    keywords: ['Counselling', 'Interim relief', 'Retaliation'],
    order: 3,
  },

  /* ----------------------------------------------------------------- 11 */
  {
    id: 'case-study',
    title: 'Case Study',
    navTitle: 'Case Study',
    level: 'main',
    parentId: 'overview',
    index: 11,
    kicker: 'Fictional example',
    definition:
      'A junior employee repeatedly receives unwanted messages from a senior colleague but feels afraid to report them because of the senior colleague’s position.',
    summary:
      'A fictional scenario showing escalation, hesitation and how an organisation should respond.',
    points: [
      {
        label: 'The problem',
        text: 'Repeated, unwelcome personal and sexual messages from a senior colleague create an intimidating environment. This is sexual harassment even without any physical act.',
      },
      {
        label: 'Why the employee hesitates',
        text: 'Fear of disbelief, damage to appraisals and reputation, losing the job, and being labelled “difficult”. Power makes silence feel rational.',
      },
      {
        label: 'How the organisation should respond',
        text: 'Preserve the messages, approach the Internal Committee (or Local Committee), accept a confidential written complaint, consider interim relief such as a changed reporting line, and complete an impartial inquiry within the statutory timeline.',
      },
      {
        label: 'Why confidentiality and fairness matter',
        text: 'Confidentiality protects the complainant from exposure and retaliation; fairness protects the respondent from false accusation. Both are needed for anyone to trust the process.',
      },
    ],
    keywords: ['Fictional', 'Power gap', 'Confidentiality', 'Fair inquiry'],
    example:
      'This is a fictional illustration created for teaching. No real person or organisation is represented.',
    order: 11,
  },
  {
    id: 'case-situation',
    title: 'The Situation',
    navTitle: 'The Situation',
    level: 'sub',
    parentId: 'case-study',
    index: null,
    kicker: 'Sub-topic · Case Study',
    definition:
      'The messages begin as “friendly” and become personal, then explicit. Each one is small; together they make the workplace feel unsafe and impossible to avoid, because the sender controls the junior’s work allocation.',
    summary: 'Unwanted messages that escalate and cannot be avoided.',
    points: [
      {
        label: 'Escalation',
        text: 'Boundaries are tested gradually; each unanswered message raises the pressure of the next.',
      },
      {
        label: 'No safe exit',
        text: 'Blocking the sender risks the appraisal, the project and the reference — so the target complies instead.',
      },
    ],
    keywords: ['Escalation', 'Boundaries', 'Coercion'],
    order: 1,
  },
  {
    id: 'case-response',
    title: 'Organisation Response',
    navTitle: 'Organisation Response',
    level: 'sub',
    parentId: 'case-study',
    index: null,
    kicker: 'Sub-topic · Case Study',
    definition:
      'A credible response is procedural, documented and fast enough to protect the complainant while the inquiry runs.',
    summary: 'Document, report, protect, inquire, act.',
    points: [
      {
        label: 'First steps',
        text: 'Record the evidence, take the complaint in writing, inform the Internal Committee, and offer interim relief.',
      },
      {
        label: 'The inquiry',
        text: 'Give both parties a hearing, keep the process confidential, complete it within 90 days, and act on the report within 60.',
      },
    ],
    keywords: ['Evidence', 'Interim relief', '90 days', '60 days'],
    order: 2,
  },
  {
    id: 'case-lessons',
    title: 'Lessons for Workplaces',
    navTitle: 'Lessons',
    level: 'sub',
    parentId: 'case-study',
    index: null,
    kicker: 'Sub-topic · Case Study',
    definition:
      'The scenario is fictional; the pattern is common. Silence is produced by power and by the reasonable belief that nothing will happen.',
    summary: 'Why early signals and trusted channels decide the outcome.',
    points: [
      {
        label: 'Act on early signals',
        text: 'A single serious complaint handled well prevents a pattern that damages many people.',
      },
      {
        label: 'Make the channel credible',
        text: 'People report when they believe the process is confidential, independent and faster than endurance.',
      },
    ],
    keywords: ['Early action', 'Trust', 'Prevention'],
    order: 3,
  },

  /* ----------------------------------------------------------------- 12 */
  {
    id: 'conclusion',
    title: 'Conclusion',
    navTitle: 'Conclusion',
    level: 'main',
    parentId: 'overview',
    index: 12,
    kicker: 'Closing',
    definition:
      'Laws alone are not enough. A safe workplace also requires awareness, responsible behaviour, mutual respect, accountability and a supportive organisational culture.',
    summary:
      'Law sets the floor; awareness, respect, accountability and culture do the rest.',
    points: [
      { label: 'Awareness', text: 'People can only prevent what they can recognise and name.' },
      {
        label: 'Responsible behaviour',
        text: 'Every colleague decides, in small moments, whether the workplace is safe for others.',
      },
      {
        label: 'Mutual respect',
        text: 'Disagreement is normal; contempt is not. Respect survives pressure.',
      },
      {
        label: 'Accountability',
        text: 'Processes must have consequences, including for people who are senior or successful.',
      },
      {
        label: 'Supportive culture',
        text: 'Leaders who listen, teams that intervene, and processes that protect the person who speaks first.',
      },
    ],
    keywords: ['Awareness', 'Respect', 'Accountability', 'Culture'],
    example: '“A workplace should be a place where every person feels safe, respected, and valued.”',
    order: 12,
  },
  {
    id: 'beyond-law',
    title: 'Beyond Legislation',
    navTitle: 'Beyond Legislation',
    level: 'sub',
    parentId: 'conclusion',
    index: null,
    kicker: 'Sub-topic · Conclusion',
    definition:
      'A statute can create a committee and a deadline; it cannot create courtesy, courage or trust. Those come from culture, and culture is made daily.',
    summary: 'Compliance is the minimum; culture is the outcome.',
    points: [
      {
        label: 'What law can do',
        text: 'Create structures, timelines, penalties and a remedy that is enforceable.',
      },
      {
        label: 'What law cannot do',
        text: 'Make a manager respectful, a bystander brave, or a team believe that reporting is safe.',
      },
    ],
    keywords: ['Compliance', 'Culture', 'Trust'],
    order: 1,
  },
  {
    id: 'shared-responsibility',
    title: 'Shared Responsibility',
    navTitle: 'Shared Responsibility',
    level: 'sub',
    parentId: 'conclusion',
    index: null,
    kicker: 'Sub-topic · Conclusion',
    definition:
      'Safety at work is not the job of the complainant, or of HR alone. Employers, managers, colleagues and committees each hold part of it.',
    summary: 'Employers, managers, colleagues and committees each carry part of safety.',
    points: [
      {
        label: 'Employers and managers',
        text: 'Build the policy, resource the committee, model the behaviour and act on the findings.',
      },
      {
        label: 'Colleagues and committees',
        text: 'Notice, intervene where safe, report what you saw, and run the inquiry without bias or delay.',
      },
    ],
    keywords: ['Employer', 'Manager', 'Colleague', 'Committee'],
    order: 2,
  },
]

export const TOPIC_BY_ID: Record<string, Topic> = Object.fromEntries(
  TOPICS.map((topic) => [topic.id, topic]),
)

/** Guided presentation order: the overview followed by the 12 numbered topics. */
export const SEQUENCE: string[] = TOPICS.filter((t) => t.index !== null)
  .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
  .map((t) => t.id)

export const MAIN_TOPICS: Topic[] = TOPICS.filter((t) => t.level === 'main').sort(
  (a, b) => (a.index ?? 0) - (b.index ?? 0),
)

export const SUB_TOPICS: Topic[] = TOPICS.filter((t) => t.level === 'sub')

/** Children of every topic, ordered for the sidebar tree. */
export const CHILDREN: Record<string, Topic[]> = TOPICS.reduce(
  (acc, topic) => {
    if (topic.parentId) {
      acc[topic.parentId] = acc[topic.parentId] ?? []
      acc[topic.parentId].push(topic)
    }
    return acc
  },
  {} as Record<string, Topic[]>,
)

Object.values(CHILDREN).forEach((list) => list.sort((a, b) => a.order - b.order))

export const ROOT_TOPIC = TOPIC_BY_ID.overview

export function getTopic(id: string | null | undefined): Topic | null {
  if (!id) return null
  return TOPIC_BY_ID[id] ?? null
}

/** Visible depth-first order, used by keyboard Enter and by the poster. */
export function getAncestors(id: string | null | undefined): Topic[] {
  const chain: Topic[] = []
  let current = getTopic(id)
  while (current?.parentId) {
    const parent = getTopic(current.parentId)
    if (!parent) break
    chain.unshift(parent)
    current = parent
  }
  return chain
}

/** Index of a topic inside the guided SEQUENCE (sub-topics inherit their branch). */
export function sequenceIndex(id: string | null | undefined): number {
  const topic = getTopic(id)
  if (!topic) return -1
  if (topic.index !== null) return SEQUENCE.indexOf(topic.id)
  const parent = getTopic(topic.parentId)
  if (parent) return sequenceIndex(parent.id)
  return -1
}

export const TOPIC_COUNT = MAIN_TOPICS.length
