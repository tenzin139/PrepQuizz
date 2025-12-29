import type { ImagePlaceholder } from './placeholder-images';
import { getPlaceholderImage, getAvatarPlaceholders } from './placeholder-images';
import type { Quiz, QuizQuestion, PastQuiz, LeaderboardEntry } from './types';

export const LoggedInUser = {
  name: 'Alex Doe',
  age: 23,
  state: 'California',
  totalScore: 1250,
  profilePicture: getPlaceholderImage('avatar-1')?.imageUrl || '',
};

export const ProfileAvatars = getAvatarPlaceholders();

export const QuizCategories = [
  { id: 'history', name: 'History', icon: 'History' },
  { id: 'science', name: 'Science', icon: 'FlaskConical' },
  { id: 'polity', name: 'Polity', icon: 'Scale' },
  { id: 'geography', name: 'Geography', icon: 'Globe' },
];

export const Quizzes: Quiz[] = [
  {
    id: 'upsc-gs-1',
    title: 'UPSC General Studies',
    description: 'A 2-minute challenge to test your knowledge across all UPSC topics.',
    category: 'Mixed',
    subCategories: ['Prelims', 'Mains'],
    questionsCount: 0, // No longer used
    duration: 120, // in seconds
    image: getPlaceholderImage('quiz-upsc')?.imageUrl || '',
    imageHint: 'library study',
  },
  {
    id: 'neet-bio-1',
    title: 'NEET Biology Practice',
    description: 'A 2-minute challenge to test your knowledge in key areas of Biology for NEET.',
    category: 'Science',
    questionsCount: 0, // No longer used
    duration: 120,
    image: getPlaceholderImage('quiz-neet')?.imageUrl || '',
    imageHint: 'DNA biology',
  }
];

export const AllQuizQuestions: Record<string, QuizQuestion[]> = {
  'upsc-gs-1': [
    // Prelims - History
    { id: 1, category: 'History', text: 'Which of the following was a major port of the Indus Valley Civilization?', options: ['Lothal', 'Harappa', 'Mohenjo-daro', 'Kalibangan'], answer: 'Lothal', subCategory: 'Prelims' },
    { id: 2, category: 'History', text: 'The concept of "Four Noble Truths" is associated with which religion?', options: ['Jainism', 'Buddhism', 'Hinduism', 'Sikhism'], answer: 'Buddhism', subCategory: 'Prelims' },
    { id: 3, category: 'History', text: 'Who was the founder of the Mauryan Empire?', options: ['Ashoka', 'Bindusara', 'Chandragupta Maurya', 'Bimbisara'], answer: 'Chandragupta Maurya', subCategory: 'Prelims' },
    { id: 4, category: 'History', text: 'The "Doctrine of Lapse" was introduced by:', options: ['Lord Dalhousie', 'Lord Canning', 'Lord Wellesley', 'Lord Bentinck'], answer: 'Lord Dalhousie', subCategory: 'Prelims' },
    { id: 5, category: 'History', text: 'The first session of the Indian National Congress was held in:', options: ['Calcutta', 'Bombay', 'Madras', 'Delhi'], answer: 'Bombay', subCategory: 'Prelims' },
    { id: 21, category: 'History', text: 'The ancient city of "Pataliputra" was initially founded by:', options: ['Ajatashatru', 'Udayin', 'Chandragupta Maurya', 'Ashoka'], answer: 'Udayin', subCategory: 'Prelims' },
    { id: 22, category: 'History', text: 'The "Quit India Movement" was launched in response to:', options: ['The failure of the Cripps Mission', 'The Simon Commission', 'The Jallianwala Bagh massacre', 'The Rowlatt Act'], answer: 'The failure of the Cripps Mission', subCategory: 'Prelims' },

    // Prelims - Polity
    { id: 6, category: 'Polity', text: 'Which part of the Indian Constitution deals with Fundamental Rights?', options: ['Part II', 'Part III', 'Part IV', 'Part V'], answer: 'Part III', subCategory: 'Prelims' },
    { id: 7, category: 'Polity', text: 'The power of Judicial Review in India is derived from:', options: ['The Preamble', 'Article 13', 'Article 368', 'Article 32'], answer: 'Article 13', subCategory: 'Prelims' },
    { id: 8, category: 'Polity', text: 'Who administers the oath of office to the President of India?', options: ['The Prime Minister', 'The Speaker of Lok Sabha', 'The Chief Justice of India', 'The Vice President'], answer: 'The Chief Justice of India', subCategory: 'Prelims' },
    { id: 9, category: 'Polity', text: 'A Money Bill can be introduced only in:', options: ['Lok Sabha', 'Rajya Sabha', 'Either House', 'A joint sitting of both Houses'], answer: 'Lok Sabha', subCategory: 'Prelims' },
    { id: 10, category: 'Polity', text: 'The 73rd Constitutional Amendment Act is related to:', options: ['Foreign Exchange', 'Panchayati Raj', 'Reservation for OBCs', 'Fundamental Duties'], answer: 'Panchayati Raj', subCategory: 'Prelims' },
    { id: 23, category: 'Polity', text: 'Under the Indian Constitution, "Right to Property" is a:', options: ['Fundamental Right', 'Legal Right', 'Moral Right', 'Directive Principle'], answer: 'Legal Right', subCategory: 'Prelims' },
    { id: 24, category: 'Polity', text: 'Who is the ex-officio Chairman of the Rajya Sabha?', options: ['The President', 'The Vice President', 'The Prime Minister', 'The Leader of the Opposition'], answer: 'The Vice President', subCategory: 'Prelims' },

    // Prelims - Geography
    { id: 11, category: 'Geography', text: 'Which one of the following is the highest peak in the Western Ghats?', options: ['Anamudi', 'Doda Betta', 'Kalsubai', 'Mahendragiri'], answer: 'Anamudi', subCategory: 'Prelims' },
    { id: 12, category: 'Geography', text: 'The "Monsoon" is a seasonal reversal of:', options: ['Winds', 'Ocean Currents', 'Temperature', 'Pressure'], answer: 'Winds', subCategory: 'Prelims' },
    { id: 13, category: 'Geography', text: 'Laterite soil is rich in:', options: ['Iron and Aluminum', 'Calcium Carbonate', 'Potash', 'Phosphorus'], answer: 'Iron and Aluminum', subCategory: 'Prelims' },
    { id: 14, category: 'Geography', text: 'The Palk Strait separates India from:', options: ['Pakistan', 'Bangladesh', 'Sri Lanka', 'Maldives'], answer: 'Sri Lanka', subCategory: 'Prelims' },
    { id: 15, category: 'Geography', text: 'Which national park is famous for the one-horned rhinoceros?', options: ['Jim Corbett National Park', 'Kaziranga National Park', 'Bandipur National Park', 'Kanha National Park'], answer: 'Kaziranga National Park', subCategory: 'Prelims' },
    { id: 25, category: 'Geography', text: 'The river Narmada originates from:', options: ['The Himalayas', 'The Western Ghats', 'Amarkantak Plateau', 'The Eastern Ghats'], answer: 'Amarkantak Plateau', subCategory: 'Prelims' },

    // Mains - Questions (structured to be MCQs for the purpose of the quiz)
    { id: 16, category: 'History', text: 'Analyze the main contributions of the Gupta period to Indian science and technology.', options: ['Advancements in mathematics, astronomy, and metallurgy', 'Development of shipbuilding and maritime trade', 'Introduction of paper and printing technology', 'Invention of gunpowder and firearms'], answer: 'Advancements in mathematics, astronomy, and metallurgy', subCategory: 'Mains' },
    { id: 17, category: 'Polity', text: 'Discuss the significance of the "basic structure" doctrine in upholding the spirit of the Indian Constitution.', options: ["It limits Parliament's power to amend the Constitution", 'It allows for easy amendment of all parts of the Constitution', 'It gives the executive unchecked powers', 'It has been abolished by the Supreme Court'], answer: "It limits Parliament's power to amend the Constitution", subCategory: 'Mains' },
    { id: 18, category: 'Economy', text: 'Evaluate the impact of the Green Revolution on Indian agriculture. What were its major limitations?', options: ['Increased food grain production but led to regional disparities', 'Led to a uniform increase in all crop production', 'It had no significant impact on food production', 'It only benefited small and marginal farmers'], answer: 'Increased food grain production but led to regional disparities', subCategory: 'Mains' },
    { id: 19, category: 'Ethics', text: 'What do you understand by "emotional intelligence" and how can it be applied in public administration?', options: ["Managing one's own and others' emotions for better decision-making", 'The ability to solve complex mathematical problems', "A measure of one's physical fitness", 'Knowledge of different world cultures'], answer: "Managing one's own and others' emotions for better decision-making", subCategory: 'Mains' },
    { id: 20, category: 'Science & Technology', text: 'What are the potential applications and ethical concerns surrounding CRISPR-Cas9 gene-editing technology?', options: ['Treating genetic diseases but with risks of off-target effects', 'A new form of renewable energy with no drawbacks', 'A method for instant data transfer', 'A new cryptocurrency'], answer: 'Treating genetic diseases but with risks of off-target effects', subCategory: 'Mains' },
    { id: 26, category: 'History', text: 'Critically examine the causes and consequences of the 1857 revolt.', options: ['A combination of political, economic, and socio-religious factors', 'It was purely a mutiny of sepoys with no popular support', 'It was a completely successful war of independence', 'It had no long-term consequences for British rule'], answer: 'A combination of political, economic, and socio-religious factors', subCategory: 'Mains' },
    { id: 27, category: 'Polity', text: 'Discuss the role of the Election Commission of India in ensuring free and fair elections.', options: ['Supervising, directing, and controlling the entire election process', 'It only has an advisory role with no real power', 'Its role is limited to voter registration', 'It is controlled by the ruling political party'], answer: 'Supervising, directing, and controlling the entire election process', subCategory: 'Mains' },
  ],
  'neet-bio-1': [
    { id: 28, category: 'The Living World', text: 'Which of the following is NOT a defining feature of living organisms?', options: ['Growth', 'Metabolism', 'Consciousness', 'Reproduction'], answer: 'Growth' },
    { id: 29, category: 'Biological Classification', text: 'Viroids differ from viruses in having:', options: ['DNA molecules without protein coat', 'RNA molecules with protein coat', 'RNA molecules without protein coat', 'DNA molecules with protein coat'], answer: 'RNA molecules without protein coat' },
    { id: 30, category: 'Plant Kingdom', text: 'In which of the following, gametophyte is not independent free-living?', options: ['Marchantia', 'Pinus', 'Funaria', 'Polytrichum'], answer: 'Pinus' },
    { id: 31, category: 'Animal Kingdom', text: 'Which of the following belongs to Phylum Porifera?', options: ['Spongilla', 'Hydra', 'Aurelia', 'Planaria'], answer: 'Spongilla' },
    { id: 32, category: 'Morphology of Flowering Plants', text: 'The edible part of a mango is the:', options: ['Epicarp', 'Mesocarp', 'Endocarp', 'Thalamus'], answer: 'Mesocarp' },
    { id: 33, category: 'Cell: The Unit of Life', text: 'The "powerhouse" of the cell is:', options: ['Nucleus', 'Mitochondrion', 'Ribosome', 'Chloroplast'], answer: 'Mitochondrion' },
    { id: 34, category: 'Biomolecules', text: 'Which of the following is a non-reducing sugar?', options: ['Glucose', 'Sucrose', 'Maltose', 'Lactose'], answer: 'Sucrose' },
    { id: 35, category: 'Cell Cycle and Cell Division', text: 'Crossing over takes place in which stage of Meiosis I?', options: ['Leptotene', 'Zygotene', 'Pachytene', 'Diplotene'], answer: 'Pachytene' },
    { id: 36, category: 'Human Physiology', text: 'Which blood group is known as the "universal donor"?', options: ['A', 'B', 'AB', 'O'], answer: 'O' },
    { id: 37, category: 'Human Physiology', text: 'The valve present between the right atrium and the right ventricle is the:', options: ['Tricuspid valve', 'Bicuspid valve', 'Mitral valve', 'Semilunar valve'], answer: 'Tricuspid valve' },
    { id: 38, category: 'Genetics', text: 'A person with blood group AB has which antigens on their RBCs?', options: ['Antigen A', 'Antigen B', 'Both Antigen A and B', 'No antigens'], answer: 'Both Antigen A and B' },
    { id: 39, category: 'Biotechnology', text: 'The first transgenic cow, Rosie, produced human protein-enriched milk. The protein was:', options: ['Alpha-lactalbumin', 'Beta-casein', 'Gamma-globulin', 'Insulin'], answer: 'Alpha-lactalbumin' },
    { id: 40, category: 'Ecology', text: 'The Montreal Protocol is associated with the control of:', options: ['Global warming', 'Ozone layer depletion', 'Water pollution', 'Deforestation'], answer: 'Ozone layer depletion' },
    { id: 41, category: 'Plant Physiology', text: 'Which plant hormone is responsible for ripening of fruits?', options: ['Auxin', 'Gibberellin', 'Cytokinin', 'Ethylene'], answer: 'Ethylene' },
    { id: 42, category: 'Human Health and Disease', text: 'Ringworm in humans is caused by:', options: ['Bacteria', 'Virus', 'Fungi', 'Protozoa'], answer: 'Fungi' },
  ],
};

export const PastQuizzesData: PastQuiz[] = [
  {
    id: 'pq1',
    quizTitle: 'UPSC General Studies Mix',
    date: '2024-05-10',
    score: 80,
    correct: 8,
    incorrect: 2,
    skipped: 0,
    total: 10,
    feedback: 'Good attempt! You have a strong grasp on Polity. Focus more on modern History dates.'
  },
  {
    id: 'pq2',
    quizTitle: 'NEET Biology Practice',
    date: '2024-05-12',
    score: 65,
    correct: 7,
    incorrect: 2,
    skipped: 1,
    total: 10,
    feedback: 'Solid performance in Biology. Review the chapter on genetics to improve your score.'
  }
];

export const LeaderboardData: LeaderboardEntry[] = [
  { rank: 1, name: 'Ravi Kumar', state: 'Uttar Pradesh', score: 2500 },
  { rank: 2, name: 'Priya Sharma', state: 'Maharashtra', score: 2450 },
  { rank: 3, name: 'Suresh Singh', state: 'Bihar', score: 2300 },
  { rank: 4, name: 'Anjali Desai', state: 'Gujarat', score: 2280 },
  { rank: 5, name: 'Alex Doe', state: 'California', score: 1250 },
  { rank: 6, name: 'Ben Carter', state: 'Texas', score: 1100 },
  { rank: 7, name: 'Sita Patil', state: 'Karnataka', score: 1050 },
  { rank: 8, name: 'Vikram Reddy', state: 'Andhra Pradesh', score: 980 },
];
