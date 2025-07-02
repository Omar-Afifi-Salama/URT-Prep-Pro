import type { UrtTest } from './types';

export const biologyDemoSet: UrtTest[] = [
  {
    title: 'The Intricacies of DNA: From Code to Function',
    passage: `1. Deoxyribonucleic acid (DNA) serves as the fundamental blueprint for life, containing the complete genetic instructions for the development, functioning, growth, and reproduction of all known organisms and many viruses. The iconic double helix structure, first elucidated by Watson and Crick, consists of two polynucleotide chains that coil around each other. The backbone of each chain is composed of alternating deoxyribose sugar and phosphate groups. Attached to each sugar is one of four nitrogenous bases: adenine (A), guanine (G), cytosine (C), and thymine (T). The two strands are held together by hydrogen bonds between the bases, with adenine forming a specific pair with thymine (A-T), and cytosine with guanine (C-G). This principle of complementary base pairing is the cornerstone of DNA's ability to replicate and be transcribed with high fidelity.

2. DNA replication is a semi-conservative process, meaning each new DNA molecule consists of one parental strand and one newly synthesized strand. The process begins when an enzyme called helicase unwinds the double helix, separating the two strands to create replication forks. Another enzyme, DNA polymerase, then reads the existing strands and adds new, complementary nucleotides. Because DNA polymerase can only synthesize DNA in the 5' to 3' direction, one strand (the leading strand) is synthesized continuously. The other strand (the lagging strand) is synthesized in short, discontinuous fragments known as Okazaki fragments, which are later joined together by DNA ligase. This intricate mechanism ensures that the entire genome is copied accurately before cell division.

3. The genetic information stored in DNA is expressed through a two-step process: transcription and translation. During transcription, which occurs in the nucleus of eukaryotic cells, a segment of DNA is used as a template to create a complementary messenger RNA (mRNA) molecule. RNA polymerase is the key enzyme that reads the DNA and synthesizes the mRNA strand. Unlike DNA, RNA uses the sugar ribose instead of deoxyribose and the base uracil (U) instead of thymine.

4. Once the mRNA molecule is processed, it travels out of the nucleus to a ribosome in the cytoplasm, where translation occurs. The ribosome reads the mRNA sequence in three-base segments called codons. Each codon specifies a particular amino acid. Transfer RNA (tRNA) molecules, each carrying a specific amino acid and having an anticodon that complements an mRNA codon, bring the correct amino acids to the ribosome. The ribosome then links these amino acids together in a chain, forming a polypeptide. This polypeptide chain folds into a specific three-dimensional structure to become a functional protein, which then carries out a specific task in the cell.`,
    questions: [
      {
        question: 'According to the passage, the lagging strand is synthesized in fragments because:',
        options: ['DNA ligase can only join short pieces.', 'The lagging strand is less important than the leading strand.', 'DNA polymerase can only synthesize in the 5\' to 3\' direction.', 'Helicase can only unwind small sections at a time.'],
        answer: 'DNA polymerase can only synthesize in the 5\' to 3\' direction.',
        explanationEnglish: 'Paragraph 2 explains that because DNA polymerase works in a specific direction (5\' to 3\'), the strand oriented in the opposite direction must be synthesized discontinuously in Okazaki fragments.',
        explanationArabic: 'توضح الفقرة 2 أنه نظرًا لأن بوليميريز الحمض النووي يعمل في اتجاه معين (5\' إلى 3\') ، يجب تصنيع الشريط الموجه في الاتجاه المعاكس بشكل متقطع في أجزاء أوكازاكي.',
      },
      {
        question: 'Which of the following correctly describes a key difference between DNA and RNA mentioned in the passage?',
        options: ['RNA is a double helix, while DNA is a single strand.', 'RNA contains the base thymine, while DNA contains uracil.', 'DNA uses the sugar ribose, while RNA uses deoxyribose.', 'RNA contains the base uracil, while DNA contains thymine.'],
        answer: 'RNA contains the base uracil, while DNA contains thymine.',
        explanationEnglish: 'Paragraph 3 states, "Unlike DNA, RNA uses the sugar ribose instead of deoxyribose and the base uracil (U) instead of thymine."',
        explanationArabic: 'تذكر الفقرة 3: "على عكس الحمض النووي ، يستخدم الحمض النووي الريبي سكر الريبوز بدلاً من الديوكسي ريبوز وقاعدة اليوراسيل (U) بدلاً من الثيمين".',
      },
      {
        question: 'The primary function of tRNA in the process of translation is to:',
        options: ['Carry genetic information from the nucleus to the ribosome.', 'Form the structural component of the ribosome.', 'Bring the correct amino acids to the ribosome based on mRNA codons.', 'Unwind the DNA double helix for transcription.'],
        answer: 'Bring the correct amino acids to the ribosome based on mRNA codons.',
        explanationEnglish: 'Paragraph 4 states that Transfer RNA (tRNA) molecules "bring the correct amino acids to the ribosome" by matching their anticodons to the mRNA codons.',
        explanationArabic: 'تذكر الفقرة 4 أن جزيئات الحمض النووي الريبي الناقل (tRNA) "تجلب الأحماض الأمينية الصحيحة إلى الريبوسوم" عن طريق مطابقة مضادات الكودونات الخاصة بها مع كودونات الحمض النووي الريبي المرسال.',
      },
      {
        question: 'What is the name of the three-base segments on an mRNA molecule that specify an amino acid?',
        options: ['Anticodons', 'Genes', 'Okazaki fragments', 'Codons'],
        answer: 'Codons',
        explanationEnglish: 'Paragraph 4 defines codons as the "three-base segments" of an mRNA sequence that are read by the ribosome.',
        explanationArabic: 'تعرّف الفقرة 4 الكودونات بأنها "مقاطع ثلاثية القواعد" من تسلسل الحمض النووي الريبي المرسال التي يقرأها الريبوسوم.',
      },
      {
        question: 'The term "semi-conservative" in DNA replication refers to the fact that:',
        options: ['Only half the DNA is replicated at a time.', 'The process is not always fully accurate.', 'Each new DNA molecule contains one original and one new strand.', 'The process conserves cellular energy.'],
        answer: 'Each new DNA molecule contains one original and one new strand.',
        explanationEnglish: 'Paragraph 2 explains that semi-conservative replication results in new DNA molecules that each consist of "one parental strand and one newly synthesized strand."',
        explanationArabic: 'توضح الفقرة 2 أن التضاعف شبه المحافظ ينتج عنه جزيئات DNA جديدة يتكون كل منها من "شريط أبوي واحد وشريط مصنّع حديثًا".',
      },
      {
        question: 'What is the role of DNA ligase?',
        options: ['To unwind the DNA double helix.', 'To synthesize the leading strand.', 'To join Okazaki fragments together.', 'To create the mRNA molecule.'],
        answer: 'To join Okazaki fragments together.',
        explanationEnglish: 'The passage states in Paragraph 2 that the short fragments on the lagging strand "are later joined together by DNA ligase."',
        explanationArabic: 'يذكر النص في الفقرة 2 أن الأجزاء القصيرة على الشريط المتأخر "يتم ربطها لاحقًا بواسطة ليغاز الحمض النووي".',
      }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9db50d069?q=80&w=600',
    recommendedTime: 9,
    subject: 'Biology',
  },
  {
    title: 'ACT Science: Investigating Enzyme Inhibition',
    passage: `Enzyme inhibitors are molecules that bind to enzymes and decrease their activity. They are crucial for regulating metabolic pathways and are often used in pharmacology as drugs. Two common types of inhibition are competitive and non-competitive. Competitive inhibitors bind to the active site of the enzyme, preventing the substrate from binding. Non-competitive inhibitors bind to a different site (an allosteric site), changing the enzyme's shape and reducing its efficiency.

Two studies were conducted to examine the effects of two inhibitors, Inhibitor A and Inhibitor B, on the activity of the enzyme lactase, which breaks down lactose into glucose and galactose. Enzyme activity was measured by the rate of glucose production in micromoles per minute (µmol/min).

**Study 1**
The experiment was conducted with a constant concentration of lactase (1 mg/mL) and a constant concentration of the inhibitor (0.5 mM). The concentration of the substrate, lactose, was varied. The initial rate of reaction was measured for the enzyme alone, with Inhibitor A, and with Inhibitor B. The results are shown in Table 1.

<table>
  <caption>Table 1: Effect of Substrate Concentration on Reaction Rate (µmol/min)</caption>
  <thead>
    <tr><th>Lactose Conc. (mM)</th><th>Rate (No Inhibitor)</th><th>Rate (Inhibitor A)</th><th>Rate (Inhibitor B)</th></tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>28</td><td>15</td><td>14</td></tr>
    <tr><td>2</td><td>45</td><td>26</td><td>23</td></tr>
    <tr><td>5</td><td>71</td><td>49</td><td>36</td></tr>
    <tr><td>10</td><td>89</td><td>73</td><td>45</td></tr>
    <tr><td>20</td><td>98</td><td>91</td><td>49</td></tr>
    <tr><td>40</td><td>100</td><td>99</td><td>50</td></tr>
  </tbody>
</table>

**Study 2**
This experiment was conducted with a constant high concentration of lactose (40 mM) and a constant concentration of lactase (1 mg/mL). The concentration of each inhibitor was varied to observe its effect on enzyme activity. The results are shown in Table 2.

<table>
  <caption>Table 2: Effect of Inhibitor Concentration on Reaction Rate (µmol/min)</caption>
  <thead>
    <tr><th>Inhibitor Conc. (mM)</th><th>Rate (Inhibitor A)</th><th>Rate (Inhibitor B)</th></tr>
  </thead>
  <tbody>
    <tr><td>0.1</td><td>99</td><td>90</td></tr>
    <tr><td>0.2</td><td>98</td><td>81</td></tr>
    <tr><td>0.5</td><td>94</td><td>64</td></tr>
    <tr><td>1.0</td><td>86</td><td>47</td></tr>
    <tr><td>2.0</td><td>72</td><td>31</td></tr>
  </tbody>
</table>`,
    questions: [
      {
        question: 'Based on the results of Study 1, which inhibitor can have its effect overcome by a high concentration of substrate?',
        options: ['Inhibitor A', 'Inhibitor B', 'Both inhibitors', 'Neither inhibitor'],
        answer: 'Inhibitor A',
        explanationEnglish: 'In Table 1, as the lactose concentration increases to 40 mM, the reaction rate with Inhibitor A (99 µmol/min) becomes nearly identical to the rate with no inhibitor (100 µmol/min). This suggests the inhibition is overcome. The rate with Inhibitor B remains significantly lower (50 µmol/min). This is characteristic of competitive inhibition.',
        explanationArabic: 'في الجدول 1 ، مع زيادة تركيز اللاكتوز إلى 40 ملي مولار ، يصبح معدل التفاعل مع المثبط أ (99 ميكرومول / دقيقة) مطابقًا تقريبًا للمعدل بدون مثبط (100 ميكرومول / دقيقة). هذا يشير إلى التغلب على التثبيط. يظل المعدل مع المثبط ب أقل بكثير (50 ميكرومول / دقيقة). هذه سمة من سمات التثبيط التنافسي.',
      },
      {
        question: 'According to the passage, Inhibitor A is most likely a:',
        options: ['Competitive inhibitor', 'Non-competitive inhibitor', 'Substrate analog', 'Allosteric activator'],
        answer: 'Competitive inhibitor',
        explanationEnglish: 'The data from Study 1 shows that increasing the substrate concentration can overcome the effect of Inhibitor A. This is the hallmark of a competitive inhibitor, which competes with the substrate for the active site.',
        explanationArabic: 'تظهر البيانات من الدراسة 1 أن زيادة تركيز الركيزة يمكن أن تتغلب على تأثير المثبط أ. هذه هي السمة المميزة للمثبط التنافسي ، الذي يتنافس مع الركيزة على الموقع النشط.',
      },
      {
        question: 'In Study 1, if the lactose concentration was 8 mM, the reaction rate with Inhibitor B would most likely be:',
        options: ['less than 36 µmol/min', 'between 36 and 45 µmol/min', 'between 45 and 73 µmol/min', 'greater than 73 µmol/min'],
        answer: 'between 36 and 45 µmol/min',
        explanationEnglish: 'In Table 1 for Inhibitor B, the rate at 5 mM lactose is 36, and the rate at 10 mM is 45. Therefore, the rate at 8 mM would be expected to fall between these two values.',
        explanationArabic: 'في الجدول 1 للمثبط ب ، يكون المعدل عند 5 ملي مولار لاكتوز هو 36 ، والمعدل عند 10 ملي مولار هو 45. لذلك ، من المتوقع أن يقع المعدل عند 8 ملي مولار بين هاتين القيمتين.',
      },
      {
        question: 'Which of the following statements is best supported by the results of Study 2?',
        options: ['Inhibitor A is more effective at lower concentrations than Inhibitor B.', 'Inhibitor B\'s effectiveness is more dependent on its concentration than Inhibitor A\'s.', 'Increasing inhibitor concentration always stops the reaction completely.', 'Both inhibitors have the same effect at a concentration of 0.1 mM.'],
        answer: 'Inhibitor B\'s effectiveness is more dependent on its concentration than Inhibitor A\'s.',
        explanationEnglish: 'In Table 2, as the concentration of Inhibitor B increases from 0.1 to 2.0 mM, the reaction rate drops sharply (from 90 to 31). For Inhibitor A, the drop is much less pronounced (from 99 to 72) over the same range, indicating its effect is less sensitive to concentration changes at high substrate levels.',
        explanationArabic: 'في الجدول 2 ، مع زيادة تركيز المثبط ب من 0.1 إلى 2.0 ملي مولار ، ينخفض معدل التفاعل بشكل حاد (من 90 إلى 31). بالنسبة للمثبط أ ، يكون الانخفاض أقل وضوحًا (من 99 إلى 72) على نفس النطاق ، مما يشير إلى أن تأثيره أقل حساسية لتغيرات التركيز عند مستويات الركيزة العالية.',
      },
      {
        question: 'What was the purpose of keeping the lactose concentration high and constant in Study 2?',
        options: ['To isolate the effect of the inhibitor concentration.', 'To save costs on using lactose.', 'To prove that the inhibitors were non-competitive.', 'To see how fast the enzyme could work.'],
        answer: 'To isolate the effect of the inhibitor concentration.',
        explanationEnglish: 'By keeping the substrate (lactose) concentration constant and non-limiting, the experimenters could ensure that the only significant variable affecting the reaction rate was the changing concentration of the inhibitors.',
        explanationArabic: 'من خلال الحفاظ على تركيز الركيزة (اللاكتوز) ثابتًا وغير محدود ، يمكن للمجربين التأكد من أن المتغير المهم الوحيد الذي يؤثر على معدل التفاعل هو التركيز المتغير للمثبطات.',
      },
      {
        question: 'Based on the passage, a non-competitive inhibitor works by:',
        options: ['Binding to the active site.', 'Breaking down the substrate directly.', 'Changing the shape of the enzyme by binding to an allosteric site.', 'Increasing the required activation energy.'],
        answer: 'Changing the shape of the enzyme by binding to an allosteric site.',
        explanationEnglish: 'The first paragraph explicitly states that non-competitive inhibitors "bind to a different site (an allosteric site), changing the enzyme\'s shape and reducing its efficiency."',
        explanationArabic: 'تنص الفقرة الأولى صراحة على أن المثبطات غير التنافسية "ترتبط بموقع مختلف (موقع ألوستيري) ، وتغير شكل الإنزيم وتقلل من كفاءته".',
      }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1579165466949-563993d562d0?q=80&w=600',
    recommendedTime: 10,
    subject: 'Biology',
    chartData: {
        type: 'bar',
        data: [
          { name: '1 mM', 'Inhibitor A': 15, 'Inhibitor B': 14 },
          { name: '5 mM', 'Inhibitor A': 49, 'Inhibitor B': 36 },
          { name: '10 mM', 'Inhibitor A': 73, 'Inhibitor B': 45 },
          { name: '40 mM', 'Inhibitor A': 99, 'Inhibitor B': 50 },
        ],
        xAxisKey: 'name',
        yAxisKey: 'Inhibitor A',
        yAxisLabel: 'Rate (µmol/min)',
    }
  },
  {
    title: 'Cellular Energy: The Interplay of Respiration and Photosynthesis',
    passage: `1. The flow of energy through biological systems is a process of transformation, governed by the fundamental laws of thermodynamics. At the cellular level, this flow is primarily managed through two complementary metabolic pathways: photosynthesis and cellular respiration. While seemingly opposite, these processes are intricately linked, forming a cycle that sustains the majority of life on Earth. Photosynthesis captures light energy and converts it into chemical energy, while cellular respiration releases this chemical energy to fuel life's activities.

2. Photosynthesis occurs in the chloroplasts of plant cells, algae, and some bacteria. It uses light energy, water (H<sub>2</sub>O), and carbon dioxide (CO<sub>2</sub>) to synthesize glucose (C<sub>6</sub>H<sub>12</sub>O<sub>6</sub>), a high-energy sugar molecule. The process is summarized by the equation: 6CO<sub>2</sub> + 6H<sub>2</sub>O + Light Energy → C<sub>6</sub>H<sub>12</sub>O<sub>6</sub> + 6O<sub>2</sub>. This process is divided into two main stages. The light-dependent reactions capture solar energy in the thylakoid membranes to produce ATP and NADPH. The light-independent reactions (Calvin cycle), which occur in the stroma, then use the energy from ATP and NADPH to convert CO<sub>2</sub> into glucose.

3. Cellular respiration is the process by which organisms break down glucose to release its stored energy. This energy is captured in the form of adenosine triphosphate (ATP), the universal energy currency of the cell. The overall equation is C<sub>6</sub>H<sub>12</sub>O<sub>6</sub> + 6O<sub>2</sub> → 6CO<sub>2</sub> + 6H<sub>2</sub>O + ATP. This process begins with glycolysis in the cytoplasm, where glucose is split into two pyruvate molecules, yielding a small amount of ATP.

4. In eukaryotes, the pyruvate molecules then enter the mitochondria. Here, in the mitochondrial matrix, the Krebs cycle (or citric acid cycle) further breaks down the pyruvate, releasing CO<sub>2</sub> and generating more energy carriers like NADH and FADH<sub>2</sub>. The final and most productive stage is the electron transport chain, located on the inner mitochondrial membrane. Here, NADH and FADH<sub>2</sub> donate electrons, which are passed along a series of protein complexes, releasing energy that is used to pump protons and create a gradient. The flow of these protons back across the membrane powers ATP synthase, which produces the vast majority of the cell's ATP. Oxygen acts as the final electron acceptor in this chain, forming water.`,
    questions: [
      {
        question: 'What is the primary location of the Krebs cycle in eukaryotic cells?',
        options: ['Cytoplasm', 'Thylakoid membrane', 'Mitochondrial matrix', 'Inner mitochondrial membrane'],
        answer: 'Mitochondrial matrix',
        explanationEnglish: 'Paragraph 4 states that the Krebs cycle takes place in the "mitochondrial matrix" after pyruvate enters the mitochondria.',
        explanationArabic: 'تذكر الفقرة 4 أن دورة كريبس تحدث في "مصفوفة الميتوكوندريا" بعد دخول البيروفات إلى الميتوكوندريا.',
      },
      {
        question: 'The energy used in the Calvin cycle (light-independent reactions) comes directly from:',
        options: ['Sunlight', 'The breakdown of glucose', 'ATP and NADPH produced in the light-dependent reactions', 'Oxygen molecules'],
        answer: 'ATP and NADPH produced in the light-dependent reactions',
        explanationEnglish: 'As stated in paragraph 2, the light-independent reactions "use the energy from ATP and NADPH" that were generated during the light-dependent reactions.',
        explanationArabic: 'كما هو مذكور في الفقرة 2 ، تستخدم التفاعلات المستقلة عن الضوء "الطاقة من ATP و NADPH" التي تم إنتاجها أثناء التفاعلات المعتمدة على الضوء.',
      },
      {
        question: 'Which stage of cellular respiration produces the most ATP?',
        options: ['Glycolysis', 'The Krebs cycle', 'The electron transport chain', 'Fermentation'],
        answer: 'The electron transport chain',
        explanationEnglish: 'Paragraph 4 explains that the electron transport chain "produces the vast majority of the cell\'s ATP" through the action of ATP synthase.',
        explanationArabic: 'توضح الفقرة 4 أن سلسلة نقل الإلكترون "تنتج الغالبية العظمى من ATP في الخلية" من خلال عمل سينثاز ATP.',
      },
      {
        question: 'What is the role of oxygen (O<sub>2</sub>) in cellular respiration?',
        options: ['It is a reactant in glycolysis.', 'It is the final electron acceptor in the electron transport chain.', 'It provides the energy for the Krebs cycle.', 'It helps to synthesize glucose.'],
        answer: 'It is the final electron acceptor in the electron transport chain.',
        explanationEnglish: 'The end of paragraph 4 clearly states that "Oxygen acts as the final electron acceptor in this chain, forming water."',
        explanationArabic: 'يذكر نهاية الفقرة 4 بوضوح أن "الأكسجين يعمل كمستقبل نهائي للإلكترون في هذه السلسلة ، مكونًا الماء".',
      },
       {
        question: 'The relationship between photosynthesis and cellular respiration can best be described as:',
        options: ['Two unrelated processes.', 'A cyclical relationship where the products of one are the reactants of the other.', 'Identical processes occurring in different organelles.', 'A competitive relationship for cellular resources.'],
        answer: 'A cyclical relationship where the products of one are the reactants of the other.',
        explanationEnglish: 'The passage highlights that the processes are "complementary," and a comparison of their overall equations shows that the products of photosynthesis (glucose and oxygen) are the reactants for respiration, and vice versa.',
        explanationArabic: 'يسلط النص الضوء على أن العمليتين "متكاملتان" ، ويظهر مقارنة معادلاتهما الإجمالية أن منتجات البناء الضوئي (الجلوكوز والأكسجين) هي المواد المتفاعلة للتنفس ، والعكس صحيح.',
      },
       {
        question: 'Where do the light-dependent reactions of photosynthesis take place?',
        options: ['The stroma', 'The cytoplasm', 'The mitochondrial matrix', 'The thylakoid membranes'],
        answer: 'The thylakoid membranes',
        explanationEnglish: 'Paragraph 2 specifies that the light-dependent reactions occur in the "thylakoid membranes" of the chloroplasts.',
        explanationArabic: 'تحدد الفقرة 2 أن التفاعلات المعتمدة على الضوء تحدث في "أغشية الثايلاكويد" للبلاستيدات الخضراء.',
      }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?q=80&w=600',
    recommendedTime: 10,
    subject: 'Biology',
  },
  {
    title: 'The Human Circulatory System: A Network of Life',
    passage: `1. The human circulatory system is a highly efficient, closed network responsible for the critical task of transportation. It delivers oxygen, nutrients, and hormones to trillions of cells and removes metabolic wastes like carbon dioxide. This system comprises the heart, blood vessels, and blood. The heart, a four-chambered muscular organ, acts as a powerful double pump, propelling blood through two distinct circuits: the pulmonary circuit and the systemic circuit.

2. The pulmonary circuit manages gas exchange. Deoxygenated blood returns from the body and enters the right atrium, is pumped to the right ventricle, and then sent to the lungs via the pulmonary artery. In the lungs, carbon dioxide is released, and oxygen is absorbed. Oxygen-rich blood then returns to the heart's left atrium via the pulmonary vein. The systemic circuit begins as this oxygenated blood is pumped from the left atrium to the left ventricle, the heart's strongest chamber. The left ventricle then contracts forcefully, sending oxygenated blood through the aorta, the body's largest artery, to be distributed to all other tissues.

3. Blood travels through three main types of vessels. Arteries carry high-pressure blood away from the heart. Their thick, muscular, and elastic walls allow them to expand and contract with each heartbeat. Arteries branch into smaller arterioles, which lead to capillaries. Capillaries are microscopic vessels, often only one cell thick, that form vast networks called capillary beds. It is here that the vital exchange of substances between the blood and tissue cells occurs.

4. After passing through the capillaries, deoxygenated blood is collected into venules, which merge to form larger veins. Veins carry low-pressure blood back towards the heart. Their walls are thinner and less elastic than arteries. To counteract gravity and prevent the backflow of blood, especially in the limbs, many veins are equipped with one-way valves. The entire journey of blood through the body is a continuous, life-sustaining loop.`,
    questions: [
      {
        question: 'Which chamber of the heart is responsible for pumping oxygenated blood to the entire body?',
        options: ['Right atrium', 'Right ventricle', 'Left atrium', 'Left ventricle'],
        answer: 'Left ventricle',
        explanationEnglish: 'Paragraph 2 states that the left ventricle is the heart\'s strongest chamber and it "contracts forcefully, sending oxygenated blood through the aorta... to be distributed to all other tissues."',
        explanationArabic: 'تذكر الفقرة 2 أن البطين الأيسر هو أقوى حجرة في القلب وأنه "ينقبض بقوة ، ويرسل الدم المؤكسج عبر الشريان الأورطي ... ليتم توزيعه على جميع أنسجة الجسم الأخرى".',
      },
      {
        question: 'The primary site for the exchange of nutrients and gases between blood and tissues is in the:',
        options: ['Arteries', 'Veins', 'Aorta', 'Capillaries'],
        answer: 'Capillaries',
        explanationEnglish: 'Paragraph 3 explains that capillaries are microscopic vessels where "the vital exchange of substances between the blood and tissue cells occurs."',
        explanationArabic: 'توضح الفقرة 3 أن الشعيرات الدموية هي أوعية مجهرية حيث "يحدث التبادل الحيوي للمواد بين الدم وخلايا الأنسجة".',
      },
      {
        question: 'Why are one-way valves a characteristic feature of veins but not arteries?',
        options: ['To handle the high pressure from the heart.', 'To prevent the backflow of low-pressure blood.', 'To slow down the flow of blood for gas exchange.', 'To direct blood to the lungs for oxygenation.'],
        answer: 'To prevent the backflow of low-pressure blood.',
        explanationEnglish: 'The final paragraph notes that veins carry low-pressure blood and contain valves "to counteract gravity and prevent the backflow of blood."',
        explanationArabic: 'تشير الفقرة الأخيرة إلى أن الأوردة تحمل دمًا منخفض الضغط وتحتوي على صمامات "لمواجهة الجاذبية ومنع التدفق العكسي للدم".',
      },
      {
        question: 'The pulmonary circuit specifically involves the movement of blood between which two organs?',
        options: ['Heart and brain', 'Heart and kidneys', 'Heart and lungs', 'Lungs and liver'],
        answer: 'Heart and lungs',
        explanationEnglish: 'Paragraph 2 defines the pulmonary circuit, describing how deoxygenated blood is pumped from the heart to the lungs and oxygenated blood returns to the heart.',
        explanationArabic: 'تعرّف الفقرة 2 الدورة الدموية الرئوية ، وتصف كيفية ضخ الدم غير المؤكسج من القلب إلى الرئتين وعودة الدم المؤكسج إلى القلب.',
      },
      {
        question: 'Which of the following describes the correct sequence of blood flow away from the heart in the systemic circuit?',
        options: ['Aorta -> Veins -> Venules -> Capillaries', 'Arteries -> Capillaries -> Arterioles -> Veins', 'Aorta -> Arteries -> Arterioles -> Capillaries', 'Capillaries -> Venules -> Veins -> Right Atrium'],
        answer: 'Aorta -> Arteries -> Arterioles -> Capillaries',
        explanationEnglish: 'Paragraphs 2 and 3 describe the path of oxygenated blood leaving the left ventricle into the aorta, then to arteries, which branch into smaller arterioles, and finally into the capillaries.',
        explanationArabic: 'تصف الفقرتان 2 و 3 مسار الدم المؤكسج الذي يغادر البطين الأيسر إلى الشريان الأورطي ، ثم إلى الشرايين التي تتفرع إلى شرايين أصغر ، وأخيراً إلى الشعيرات الدموية.',
      },
       {
        question: 'The walls of arteries are thicker and more elastic than veins because they must:',
        options: ['Hold a larger volume of blood.', 'Contain valves for backflow prevention.', 'Facilitate gas exchange with tissues.', 'Withstand the high pressure of blood pumped from the heart.'],
        answer: 'Withstand the high pressure of blood pumped from the heart.',
        explanationEnglish: 'Paragraph 3 states that arteries carry "high-pressure blood" and their thick, elastic walls allow them to "expand and contract with each heartbeat."',
        explanationArabic: 'تذكر الفقرة 3 أن الشرايين تحمل "دمًا عالي الضغط" وأن جدرانها السميكة المرنة تسمح لها "بالتوسع والانكماش مع كل نبضة قلب".',
      }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1621597401921-74d1544a8613?q=80&w=600',
    recommendedTime: 9,
    subject: 'Biology',
  },
];

export const geologyDemoSet: UrtTest[] = [
  {
    title: 'The Dynamic Rock Cycle',
    passage: `1. The rock cycle is a core concept in geology that illustrates the transitions among the three main rock types: igneous, sedimentary, and metamorphic. This cycle is a continuous process of formation, alteration, and destruction of rock material, driven by Earth's internal heat and external processes like weathering and erosion. It reveals that rock is not a static substance but is constantly being recycled over geological time.

2. Igneous rocks, born from fire, are formed from the cooling and solidification of molten rock. When this molten material, called magma, cools slowly deep within the Earth's crust, it forms intrusive (or plutonic) igneous rocks. The slow cooling allows large crystals to grow, resulting in coarse-grained textures, as seen in granite. Conversely, when magma erupts onto the surface as lava, it cools rapidly, forming extrusive (or volcanic) igneous rocks. This rapid cooling leaves little time for crystal growth, resulting in fine-grained textures, like basalt, or even glassy textures, like obsidian.

3. Sedimentary rocks are the archives of Earth's history, formed from the accumulation of pre-existing materials. This process begins with weathering, the breakdown of any rock type at the surface. Erosion then transports these broken pieces, called sediments, via wind, water, or ice. Eventually, these sediments are deposited in layers. Over immense periods, the weight of overlying layers causes compaction, squeezing out water. Dissolved minerals precipitate within the pore spaces, cementing the grains together in a process called lithification. This forms clastic sedimentary rocks like sandstone and shale. Chemical and organic sedimentary rocks, such as limestone and coal, form from the precipitation of minerals or the accumulation of organic debris.

4. Metamorphic rocks are rocks that have been changed by intense heat, pressure, or chemical alteration, a process called metamorphism. The original rock, or protolith, can be igneous, sedimentary, or even another metamorphic rock. Metamorphism occurs without melting the rock. The heat and pressure cause minerals to recrystallize, reorient, and sometimes form new minerals, changing the rock's texture and composition. This can result in foliated rocks, which have a layered or banded appearance (like slate, schist, and gneiss), or non-foliated rocks, which have a more uniform texture (like marble and quartzite).`,
    questions: [
      {
        question: 'A geologist finds a rock with very large, interlocking crystals. This rock is most likely:',
        options: ['Extrusive igneous', 'Intrusive igneous', 'Clastic sedimentary', 'Foliated metamorphic'],
        answer: 'Intrusive igneous',
        explanationEnglish: 'Paragraph 2 explains that intrusive igneous rocks, like granite, cool slowly beneath the surface, which allows large crystals to form.',
        explanationArabic: 'توضح الفقرة 2 أن الصخور النارية المتداخلة ، مثل الجرانيت ، تبرد ببطء تحت السطح ، مما يسمح بتكون بلورات كبيرة.',
      },
      {
        question: 'The processes of compaction and cementation are collectively known as:',
        options: ['Weathering', 'Erosion', 'Metamorphism', 'Lithification'],
        answer: 'Lithification',
        explanationEnglish: 'Paragraph 3 describes how layers of sediment are compacted and then cemented together, and it calls this overall process "lithification."',
        explanationArabic: 'تصف الفقرة 3 كيف يتم ضغط طبقات الرواسب ثم لصقها معًا ، وتطلق على هذه العملية الشاملة "التحجر".',
      },
      {
        question: 'Which of the following is a key difference between the formation of igneous and metamorphic rock?',
        options: ['Igneous rocks involve melting, while metamorphism occurs without melting.', 'Metamorphic rocks are formed from sediments, while igneous rocks are not.', 'Igneous rocks require high pressure, while metamorphic rocks require high temperatures.', 'Metamorphic rocks are always foliated, while igneous rocks are not.'],
        answer: 'Igneous rocks involve melting, while metamorphism occurs without melting.',
        explanationEnglish: 'Paragraph 4 states that metamorphism is a process that occurs "without melting the rock," whereas paragraph 2 clearly defines igneous rock formation as the solidification of molten magma or lava.',
        explanationArabic: 'تذكر الفقرة 4 أن التحول هو عملية تحدث "دون صهر الصخر" ، بينما تعرف الفقرة 2 بوضوح تكوين الصخور النارية بأنه تصلب الصهارة المنصهرة أو الحمم البركانية.',
      },
      {
        question: 'A protolith is best described as:',
        options: ['A type of sedimentary rock.', 'The molten material that forms igneous rock.', 'The original rock that is altered during metamorphism.', 'A fossil found within a rock layer.'],
        answer: 'The original rock that is altered during metamorphism.',
        explanationEnglish: 'The passage defines the protolith in paragraph 4 as "The original rock" that undergoes change during metamorphism.',
        explanationArabic: 'يعرّف النص البروتوليث في الفقرة 4 بأنه "الصخر الأصلي" الذي يخضع للتغيير أثناء التحول.',
      },
      {
        question: 'The formation of obsidian, a glassy volcanic rock, is due to:',
        options: ['Very slow cooling of magma.', 'Intense heat and pressure.', 'Cementation of volcanic ash.', 'Extremely rapid cooling of lava.'],
        answer: 'Extremely rapid cooling of lava.',
        explanationEnglish: 'Paragraph 2 explains that extrusive rocks form when lava cools quickly, and mentions that this can result in glassy textures like obsidian.',
        explanationArabic: 'توضح الفقرة 2 أن الصخور البركانية تتكون عندما تبرد الحمم بسرعة ، وتذكر أن هذا يمكن أن يؤدي إلى قوام زجاجي مثل السبج.',
      },
       {
        question: 'What is the primary difference between weathering and erosion?',
        options: ['Weathering is a chemical process, while erosion is physical.', 'Weathering is the breakdown of rock, while erosion is the transport of the broken pieces.', 'Erosion happens to metamorphic rocks, while weathering happens to igneous rocks.', 'There is no difference; the terms are interchangeable.'],
        answer: 'Weathering is the breakdown of rock, while erosion is the transport of the broken pieces.',
        explanationEnglish: 'Paragraph 3 defines weathering as the "breakdown of any rock type" and erosion as the process that "transports these broken pieces."',
        explanationArabic: 'تعرّف الفقرة 3 التجوية بأنها "تكسير أي نوع من الصخور" والتعرية بأنها العملية التي "تنقل هذه القطع المكسورة".',
      }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1566323456376-29649a3c3589?q=80&w=600',
    recommendedTime: 9,
    subject: 'Geology',
  },
  {
    title: 'ACT Science: Soil Permeability Study',
    passage: `Soil permeability is a measure of the ability of soil to allow water to pass through it. It is an important characteristic for agriculture and civil engineering. Permeability is influenced by soil texture—the relative proportions of sand, silt, and clay particles. Sand particles are large and coarse, creating large pore spaces. Clay particles are very fine and flat, creating small pore spaces.

A team of geologists conducted two studies to investigate the properties of soil samples from four different farm fields (Fields 1-4).

**Study 1**
First, the composition of each soil sample was determined. A 100g sample of dry soil from each field was passed through a series of sieves to separate the sand, silt, and clay. The mass of each component was measured, and the percentage was calculated. The results are presented in Table 1.

<table>
  <caption>Table 1: Soil Composition by Percentage Mass</caption>
  <thead>
    <tr><th>Field</th><th>Sand (%)</th><th>Silt (%)</th><th>Clay (%)</th></tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>80</td><td>10</td><td>10</td></tr>
    <tr><td>2</td><td>50</td><td>30</td><td>20</td></tr>
    <tr><td>3</td><td>30</td><td>50</td><td>20</td></tr>
    <tr><td>4</td><td>10</td><td>40</td><td>50</td></tr>
  </tbody>
</table>

**Study 2**
Next, the permeability of each soil was tested. A 10cm deep sample of each soil was placed in a 1000 mL graduated cylinder with a mesh bottom. 500 mL of water was poured onto the surface of the soil. The time it took for the first drop of water to pass through the soil column (breakthrough time) and the total volume of water collected after 10 minutes were recorded. The results are shown in Table 2.

<table>
  <caption>Table 2: Soil Permeability Results</caption>
  <thead>
    <tr><th>Field</th><th>Breakthrough Time (sec)</th><th>Volume Collected after 10 min (mL)</th></tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>15</td><td>485</td></tr>
    <tr><td>2</td><td>55</td><td>410</td></tr>
    <tr><td>3</td><td>120</td><td>250</td></tr>
    <tr><td>4</td><td>450</td><td>95</td></tr>
  </tbody>
</table>`,
    questions: [
      {
        question: 'Based on the results of both studies, which statement best describes the relationship between the percentage of sand in soil and its permeability?',
        options: ['As the percentage of sand increases, permeability increases.', 'As the percentage of sand increases, permeability decreases.', 'The percentage of sand has no clear effect on permeability.', 'Permeability is only affected by the percentage of clay.'],
        answer: 'As the percentage of sand increases, permeability increases.',
        explanationEnglish: 'Field 1 has the highest sand percentage (80%) and the highest permeability (fastest breakthrough, largest volume collected). Field 4 has the lowest sand percentage (10%) and the lowest permeability. This demonstrates a direct relationship.',
        explanationArabic: 'الحقل 1 لديه أعلى نسبة رمل (80٪) وأعلى نفاذية (أسرع وقت اختراق ، أكبر حجم تم جمعه). الحقل 4 لديه أدنى نسبة رمل (10٪) وأدنى نفاذية. هذا يوضح وجود علاقة مباشرة.',
      },
      {
        question: 'If a fifth soil sample from Field 5 were tested and its breakthrough time was 90 seconds, the volume of water collected after 10 minutes would most likely be:',
        options: ['less than 250 mL', 'between 250 mL and 410 mL', 'between 410 mL and 485 mL', 'greater than 485 mL'],
        answer: 'between 250 mL and 410 mL',
        explanationEnglish: 'A breakthrough time of 90 seconds falls between the times for Field 2 (55s) and Field 3 (120s). Therefore, the volume collected should fall between their respective collected volumes (410 mL and 250 mL).',
        explanationArabic: 'يقع وقت الاختراق البالغ 90 ثانية بين أوقات الحقل 2 (55 ثانية) والحقل 3 (120 ثانية). لذلك ، يجب أن يقع الحجم المجمع بين أحجامه المجمعة (410 مل و 250 مل).',
      },
      {
        question: 'According to the data, which soil component has the greatest negative impact on permeability?',
        options: ['Sand', 'Silt', 'Clay', 'A combination of sand and silt'],
        answer: 'Clay',
        explanationEnglish: 'The introduction states that clay particles are very fine and create small pore spaces. The data confirms this: Field 4, with the highest clay content (50%), has the longest breakthrough time and lowest collected volume, indicating the lowest permeability.',
        explanationArabic: 'تذكر المقدمة أن جزيئات الطين دقيقة جدًا وتخلق مساحات مسامية صغيرة. تؤكد البيانات هذا: الحقل 4 ، الذي يحتوي على أعلى محتوى من الطين (50٪) ، لديه أطول وقت اختراق وأقل حجم تم جمعه ، مما يشير إلى أقل نفاذية.',
      },
      {
        question: 'In Study 2, which of the following was a constant variable for all trials?',
        options: ['The percentage of silt in the soil.', 'The breakthrough time.', 'The volume of water added to the soil.', 'The volume of water collected after 10 minutes.'],
        answer: 'The volume of water added to the soil.',
        explanationEnglish: 'The description of Study 2 explicitly states that "500 mL of water was poured onto the surface of the soil" for each sample, making it a constant.',
        explanationArabic: 'يذكر وصف الدراسة 2 صراحة أنه "تم سكب 500 مل من الماء على سطح التربة" لكل عينة ، مما يجعله ثابتًا.',
      },
      {
        question: 'Which of the fields would be most suitable for a construction project requiring rapid drainage?',
        options: ['Field 1', 'Field 2', 'Field 3', 'Field 4'],
        answer: 'Field 1',
        explanationEnglish: 'Rapid drainage requires high permeability. The data from Study 2 shows that Field 1 has the highest permeability, with the fastest breakthrough time and the most water collected.',
        explanationArabic: 'يتطلب الصرف السريع نفاذية عالية. تظهر البيانات من الدراسة 2 أن الحقل 1 لديه أعلى نفاذية ، مع أسرع وقت اختراق وأكبر كمية من المياه المجمعة.',
      },
       {
        question: 'The design of Study 1 was intended to:',
        options: ['Determine the permeability of different soils.', 'Characterize the physical composition of the soil samples.', 'Find the best soil for agriculture.', 'Measure how much water each soil could hold.'],
        answer: 'Characterize the physical composition of the soil samples.',
        explanationEnglish: 'The description of Study 1 says its purpose was to determine the "percentage of sand, silt, and clay in each sample," which is the physical composition.',
        explanationArabic: 'يقول وصف الدراسة 1 إن الغرض منها هو تحديد "النسبة المئوية للرمل والطمي والطين في كل عينة" ، وهو التركيب المادي.',
      }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1591782803427-0cf117770e1b?q=80&w=600',
    recommendedTime: 10,
    subject: 'Geology',
     chartData: {
        type: 'bar',
        data: [
          { name: 'Field 1', value: 485 },
          { name: 'Field 2', value: 410 },
          { name: 'Field 3', value: 250 },
          { name: 'Field 4', value: 95 },
        ],
        xAxisKey: 'name',
        yAxisKey: 'value',
        yAxisLabel: 'Water Collected (mL)',
    }
  },
  {
    title: 'Plate Tectonics: The Unifying Theory',
    passage: `1. The theory of plate tectonics revolutionized the field of geology by providing a comprehensive framework for understanding Earth's major geological processes. Proposed in the mid-20th century, it posits that the Earth's rigid outer layer, the lithosphere, is broken into a mosaic of large and small tectonic plates. These plates are not static; they move slowly over the underlying, semi-molten asthenosphere at rates of a few centimeters per year. Their interactions at the boundaries are responsible for shaping the planet's surface, driving everything from mountain formation to earthquakes and volcanic activity.

2. Evidence for this theory is vast and comes from multiple scientific disciplines. Early observations by Alfred Wegener, part of his continental drift hypothesis, included the remarkable fit of the continents (e.g., South America and Africa), the distribution of identical fossils across separate continents, and the alignment of ancient mountain ranges. Later, post-WWII oceanographic mapping revealed mid-ocean ridges, enormous underwater mountain chains. Studies of these ridges showed that new oceanic crust is formed there and spreads outwards, a process confirmed by paleomagnetism, which records the periodic reversals of Earth's magnetic field in the rocks.

3. Plate boundaries are classified into three main types based on the relative motion of the plates. At divergent boundaries, plates pull apart. Magma from the mantle upwells to fill the gap, creating new lithosphere. Mid-ocean ridges are the primary example. At convergent boundaries, plates collide. When an oceanic plate collides with a continental plate, the denser oceanic plate is forced to bend and slide beneath the continental plate in a process called subduction, forming a deep-sea trench and a volcanic mountain range on the continent. The collision of two continental plates results in intense compression and uplift, creating massive mountain ranges like the Himalayas.

4. The third type, transform boundaries, occurs where plates slide horizontally past one another. The immense friction prevents a smooth motion, causing stress to accumulate over long periods. When the stress exceeds the rock's strength, the plates slip abruptly, releasing energy as a seismic wave, which we experience as an earthquake. The San Andreas Fault in California is a classic example of a transform boundary, marking the junction between the Pacific Plate and the North American Plate.`,
    questions: [
      {
        question: 'Which of the following pieces of evidence was NOT mentioned in the passage as supporting plate tectonics?',
        options: ['The jigsaw-like fit of continental coastlines.', 'The study of seismic wave patterns through Earth\'s interior.', 'The distribution of similar fossils across different continents.', 'Magnetic striping on the ocean floor (paleomagnetism).'],
        answer: 'The study of seismic wave patterns through Earth\'s interior.',
        explanationEnglish: 'Paragraph 2 mentions continental fit, fossil distribution, and paleomagnetism as evidence. While seismology is related to plate tectonics, the study of seismic waves through the interior was not listed as one of the key pieces of evidence in this passage.',
        explanationArabic: 'تذكر الفقرة 2 تطابق القارات ، وتوزيع الحفريات ، والمغناطيسية القديمة كدليل. بينما ترتبط علم الزلازل بتكتونية الصفائح ، لم يتم إدراج دراسة الموجات الزلزالية عبر الداخل كأحد الأدلة الرئيسية في هذا المقطع.',
      },
      {
        question: 'Subduction is a process that occurs at which type of boundary?',
        options: ['Divergent boundaries', 'Convergent boundaries involving an oceanic plate', 'Transform boundaries', 'All types of boundaries'],
        answer: 'Convergent boundaries involving an oceanic plate',
        explanationEnglish: 'Paragraph 3 explicitly describes subduction as the process where a denser oceanic plate slides beneath another plate during a collision at a convergent boundary.',
        explanationArabic: 'تصف الفقرة 3 بوضوح الاندساس بأنه العملية التي تنزلق فيها صفيحة محيطية أكثر كثافة تحت صفيحة أخرى أثناء التصادم عند حدود متقاربة.',
      },
      {
        question: 'The formation of new oceanic crust is associated with:',
        options: ['The Himalayas', 'The San Andreas Fault', 'Deep-sea trenches', 'Mid-ocean ridges'],
        answer: 'Mid-ocean ridges',
        explanationEnglish: 'Paragraph 3 states that at divergent boundaries, like mid-ocean ridges, magma upwells to create new lithosphere.',
        explanationArabic: 'تذكر الفقرة 3 أنه عند الحدود المتباعدة ، مثل حواف وسط المحيط ، ترتفع الصهارة لتكوين غلاف صخري جديد.',
      },
      {
        question: 'Earthquakes at transform boundaries are primarily caused by:',
        options: ['The creation of new crust.', 'The subduction of one plate under another.', 'The build-up and abrupt release of stress from friction.', 'Volcanic activity along the fault line.'],
        answer: 'The build-up and abrupt release of stress from friction.',
        explanationEnglish: 'Paragraph 4 explains that friction at transform boundaries causes stress to accumulate, and the abrupt slip to release this stress causes earthquakes.',
        explanationArabic: 'توضح الفقرة 4 أن الاحتكاك عند الحدود التحويلية يتسبب في تراكم الإجهاد ، وأن الانزلاق المفاجئ لإطلاق هذا الإجهاد يسبب الزلازل.',
      },
      {
        question: 'According to the passage, the lithosphere is best described as:',
        options: ['The semi-molten layer beneath the plates.', 'The rigid outer layer of the Earth broken into plates.', 'The innermost core of the Earth.', 'The layer responsible for Earth\'s magnetic field.'],
        answer: 'The rigid outer layer of the Earth broken into plates.',
        explanationEnglish: 'The first paragraph defines the lithosphere as "the Earth\'s rigid outer layer... broken into a mosaic of large and small tectonic plates."',
        explanationArabic: 'تعرّف الفقرة الأولى الغلاف الصخري بأنه "الطبقة الخارجية الصلبة للأرض ... المكسورة إلى فسيفساء من الصفائح التكتونية الكبيرة والصغيرة".',
      },
       {
        question: 'The movement of tectonic plates is described as being on the order of:',
        options: ['Several meters per year.', 'A few centimeters per year.', 'Several kilometers per year.', 'A few millimeters per year.'],
        answer: 'A few centimeters per year.',
        explanationEnglish: 'Paragraph 1 mentions that the plates "move slowly over the underlying, semi-molten asthenosphere at rates of a few centimeters per year."',
        explanationArabic: 'تذكر الفقرة 1 أن الصفائح "تتحرك ببطء فوق الغلاف الموري شبه المنصهر بمعدلات بضعة سنتيمترات في السنة".',
      }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1613637131333-57a2f5a6f477?q=80&w=600',
    recommendedTime: 10,
    subject: 'Geology',
  },
   {
    title: 'Mineral Identification and Properties',
    passage: `1. Minerals are the fundamental building blocks of rocks. Geologists define a mineral as a naturally occurring, inorganic solid with a definite chemical composition and an ordered internal crystalline structure. Identifying minerals is a crucial skill for geologists, and it relies on observing a set of distinct physical properties, as a single property is often not enough for a definitive identification.

2. **Hardness** is one of the most reliable properties for identifying minerals. It measures a mineral's resistance to being scratched. Geologists use the Mohs Hardness Scale, an ordinal scale from 1 (softest) to 10 (hardest). For example, Quartz, with a hardness of 7, can scratch Feldspar (hardness 6), but cannot scratch Topaz (hardness 8). A common field test involves using everyday objects of known hardness, like a fingernail (2.5), a copper penny (3.5), or a steel knife (5.5).

3. **Luster** describes how a mineral's surface reflects light. The primary distinction is between metallic and non-metallic lusters. Minerals with a metallic luster, like pyrite and galena, look like polished metal. Non-metallic lusters are more varied and can be described as vitreous (glassy, like quartz), pearly (like talc), silky (like satin spar gypsum), or earthy (dull, like kaolinite).

4. **Cleavage and Fracture** describe how a mineral breaks. Cleavage is the tendency of a mineral to break along flat, parallel surfaces, which are planes of weak bonding in the crystal structure. Mica, for instance, has perfect cleavage in one direction, causing it to peel into thin sheets. Fracture describes a break that is not along a cleavage plane. Fracture surfaces can be conchoidal (curved and smooth, like quartz), fibrous, or irregular.

5. Other important properties include **color**, which can be misleading as many minerals come in various colors due to impurities; **streak**, the color of a mineral's powder when scraped against an unglazed porcelain plate, which is often more consistent than the mineral's color; and **specific gravity**, which is a measure of the mineral's density relative to water.`,
    questions: [
      {
        question: 'A mineral sample is scratched by a steel knife (hardness 5.5) but not by a copper penny (hardness 3.5). What is the possible hardness range for this mineral on the Mohs scale?',
        options: ['Less than 3.5', 'Between 3.5 and 5.5', 'Exactly 5.5', 'Greater than 5.5'],
        answer: 'Between 3.5 and 5.5',
        explanationEnglish: 'The mineral cannot be scratched by the penny, so it is harder than 3.5. It is scratched by the steel knife, so it is softer than 5.5. Therefore, its hardness lies between these two values.',
        explanationArabic: 'لا يمكن خدش المعدن بالقرش النحاسي ، لذا فهو أصلب من 3.5. يتم خدشه بسكين فولاذي ، لذا فهو أكثر نعومة من 5.5. لذلك ، تقع صلابته بين هاتين القيمتين.',
      },
      {
        question: 'A mineral that peels off in thin, flat sheets is exhibiting which physical property?',
        options: ['Conchoidal fracture', 'Metallic luster', 'Perfect cleavage', 'A low specific gravity'],
        answer: 'Perfect cleavage',
        explanationEnglish: 'Paragraph 4 explains that cleavage is the tendency to break along flat surfaces and uses mica, which "peel[s] into thin sheets," as a prime example.',
        explanationArabic: 'توضح الفقرة 4 أن الانقسام هو الميل إلى الانكسار على طول الأسطح المستوية وتستخدم الميكا ، التي "تتقشر إلى صفائح رقيقة" ، كمثال رئيسي.',
      },
      {
        question: 'Why is streak often a more reliable identification tool than color?',
        options: ['Streak is easier to see.', 'The color of a mineral\'s powder is more consistent than its bulk color.', 'Streak can be used to determine hardness.', 'All minerals have a white streak.'],
        answer: 'The color of a mineral\'s powder is more consistent than its bulk color.',
        explanationEnglish: 'Paragraph 5 states that color can be misleading due to impurities, while streak is "often more consistent than the mineral\'s color."',
        explanationArabic: 'تذكر الفقرة 5 أن اللون يمكن أن يكون مضللاً بسبب الشوائب ، في حين أن الخط "غالبًا ما يكون أكثر اتساقًا من لون المعدن".',
      },
      {
        question: 'The term "vitreous" is used to describe a type of:',
        options: ['Hardness', 'Fracture', 'Luster', 'Cleavage'],
        answer: 'Luster',
        explanationEnglish: 'In paragraph 3, "vitreous" is given as an example of a non-metallic luster, meaning glassy.',
        explanationArabic: 'في الفقرة 3 ، يتم إعطاء "زجاجي" كمثال على بريق غير معدني.',
      },
      {
        question: 'Which of the following is NOT part of the definition of a mineral?',
        options: ['Naturally occurring', 'Organic solid', 'Definite chemical composition', 'Ordered internal crystalline structure'],
        answer: 'Organic solid',
        explanationEnglish: 'The first paragraph defines a mineral as an "inorganic solid," meaning it is not derived from living organisms.',
        explanationArabic: 'تعرّف الفقرة الأولى المعدن بأنه "صلب غير عضوي" ، مما يعني أنه غير مشتق من الكائنات الحية.',
      },
      {
        question: 'The property that describes the way a mineral breaks along irregular surfaces is called:',
        options: ['Cleavage', 'Hardness', 'Fracture', 'Streak'],
        answer: 'Fracture',
        explanationEnglish: 'Paragraph 4 defines fracture as "a break that is not along a cleavage plane" and can be irregular.',
        explanationArabic: 'تعرّف الفقرة 4 الكسر بأنه "كسر ليس على طول مستوى الانقسام" ويمكن أن يكون غير منتظم.',
      }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1550683118-A746810245a8?q=80&w=600',
    recommendedTime: 9,
    subject: 'Geology',
  },
];
