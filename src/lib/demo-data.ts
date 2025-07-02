import type { UrtTest } from './types';

export const biologyDemoSet: UrtTest[] = [
  {
    title: 'The Structure and Function of DNA',
    passage: `1. Deoxyribonucleic acid, or DNA, is the molecule that contains the genetic code of organisms. The structure of DNA is a double helix, resembling a twisted ladder. Each "rung" of this ladder is made of a pair of nitrogenous bases. There are four bases in DNA: adenine (A), guanine (G), cytosine (C), and thymine (T). Adenine always pairs with thymine (A-T), and cytosine always pairs with guanine (C-G). This is known as the principle of complementary base pairing.

2. The sides of the "ladder" are made of a sugar-phosphate backbone. A phosphate group, a deoxyribose sugar molecule, and a nitrogenous base together form a nucleotide, the basic building block of DNA. The sequence of these bases along the DNA strand is what encodes genetic information, instructing the cell on how to build proteins and perform other critical functions.

3. DNA replication is the process by which a cell makes an identical copy of its DNA. The double helix unwinds, and each strand serves as a template for the creation of a new, complementary strand. This semi-conservative replication ensures that each new DNA molecule consists of one old strand and one new strand, preserving the genetic information with high fidelity.`,
    questions: [
      {
        question: 'According to the passage, which of the following base pairs is correct?',
        options: ['A-C', 'G-T', 'C-G', 'A-G'],
        answer: 'C-G',
        explanationEnglish: 'The passage states that cytosine (C) always pairs with guanine (G) according to the principle of complementary base pairing.',
        explanationArabic: 'يذكر النص أن السيتوزين (C) يقترن دائمًا بالجوانين (G) وفقًا لمبدأ الاقتران التكميلي للقواعد.',
      },
      {
        question: 'What are the three components of a DNA nucleotide?',
        options: [
          'Phosphate, ribose sugar, and adenine',
          'Phosphate, deoxyribose sugar, and a nitrogenous base',
          'Sugar, base, and an amino acid',
          'Backbone, rung, and a helix',
        ],
        answer: 'Phosphate, deoxyribose sugar, and a nitrogenous base',
        explanationEnglish: 'Paragraph 2 explicitly states that a nucleotide is formed by a phosphate group, a deoxyribose sugar molecule, and a nitrogenous base.',
        explanationArabic: 'الفقرة الثانية تذكر بوضوح أن النيوكليوتيد يتكون من مجموعة فوسفات، وجزيء سكر ديوكسي ريبوز، وقاعدة نيتروجينية.',
      },
      {
        question: 'The process of DNA replication is described as "semi-conservative" because:',
        options: [
          'Only half of the DNA is copied.',
          'It conserves energy for the cell.',
          'Each new DNA molecule contains one original and one new strand.',
          'The process is not always accurate.',
        ],
        answer: 'Each new DNA molecule contains one original and one new strand.',
        explanationEnglish: 'The final sentence of the passage explains that semi-conservative replication means each new DNA molecule consists of one old and one new strand.',
        explanationArabic: 'الجملة الأخيرة من النص تشرح أن التضاعف شبه المحافظ يعني أن كل جزيء DNA جديد يتكون من شريط أصلي وشريط جديد.',
      },
    ],
    imageUrl: 'https://placehold.co/600x400.png',
    dataAIHint: 'dna helix',
    recommendedTime: 5,
    subject: 'Biology',
  },
  {
    title: 'ACT Science: The Effect of pH on Enzyme Activity',
    passage: `An enzyme is a biological catalyst that speeds up chemical reactions. The activity of an enzyme is highly dependent on its environment, particularly temperature and pH. A group of students conducted an experiment to investigate the effect of pH on the activity of the enzyme catalase, which breaks down hydrogen peroxide (H<sub>2</sub>O<sub>2</sub>) into water (H<sub>2</sub>O) and oxygen (O<sub>2</sub>).

**Experiment**
The students prepared several test tubes, each containing a 2% hydrogen peroxide solution buffered at a different pH level. The pH levels tested were 3, 5, 7, 9, and 11. An equal amount of a catalase solution was added to each test tube. The rate of enzyme activity was determined by measuring the volume of oxygen gas produced in milliliters (mL) over a period of 5 minutes. The experiment was conducted at a constant temperature of 25°C. The results are shown in Table 1 and Figure 1.

<table>
  <thead>
    <tr><th>pH Level</th><th>Oxygen Produced (mL)</th></tr>
  </thead>
  <tbody>
    <tr><td>3</td><td>2.1</td></tr>
    <tr><td>5</td><td>8.5</td></tr>
    <tr><td>7</td><td>15.2</td></tr>
    <tr><td>9</td><td>10.3</td></tr>
    <tr><td>11</td><td>3.4</td></tr>
  </tbody>
</table>`,
    questions: [
      {
        question: 'Based on the results, what is the optimal pH for catalase activity?',
        options: ['pH 3', 'pH 5', 'pH 7', 'pH 9'],
        answer: 'pH 7',
        explanationEnglish: 'According to Table 1, the greatest volume of oxygen (15.2 mL) was produced at pH 7, indicating the highest enzyme activity at this pH level.',
        explanationArabic: 'وفقًا للجدول 1، تم إنتاج أكبر حجم من الأكسجين (15.2 مل) عند درجة حموضة 7، مما يشير إلى أعلى نشاط للإنزيم عند هذا المستوى من الأس الهيدروجيني.',
      },
      {
        question: 'If the experiment were repeated at pH 8, the amount of oxygen produced would most likely be:',
        options: ['less than 8.5 mL', 'between 10.3 mL and 15.2 mL', 'between 8.5 mL and 10.3 mL', 'greater than 15.2 mL'],
        answer: 'between 10.3 mL and 15.2 mL',
        explanationEnglish: 'The data shows a peak at pH 7 and a decrease at pH 9. Therefore, the value at pH 8 should logically fall between the values recorded for pH 7 (15.2 mL) and pH 9 (10.3 mL).',
        explanationArabic: 'تظهر البيانات ذروة عند درجة حموضة 7 وانخفاضًا عند درجة حموضة 9. لذلك، يجب أن تقع القيمة عند درجة حموضة 8 منطقيًا بين القيم المسجلة لدرجة الحموضة 7 (15.2 مل) ودرجة الحموضة 9 (10.3 مل).',
      },
       {
        question: 'What is the independent variable in this experiment?',
        options: ['Temperature', 'Volume of oxygen produced', 'pH level', 'Time'],
        answer: 'pH level',
        explanationEnglish: 'The independent variable is the factor that the experimenters intentionally change to observe its effect. In this case, the students deliberately varied the pH level of the solutions.',
        explanationArabic: 'المتغير المستقل هو العامل الذي يغيره المجربون عمدًا لملاحظة تأثيره. في هذه الحالة، قام الطلاب بتغيير مستوى الأس الهيدروجيني للمحاليل بشكل متعمد.',
      },
      {
        question: 'A key assumption in this experiment is that:',
        options: [
            'The temperature has no effect on enzyme activity.',
            'The concentration of catalase does not change.',
            'Hydrogen peroxide breaks down on its own.',
            'Oxygen production is not a valid measure of activity.'
        ],
        answer: 'The concentration of catalase does not change.',
        explanationEnglish: 'To ensure a fair test, the experimenters must assume that the amount of the enzyme itself remains constant across all trials, so that pH is the only significant variable affecting the outcome.',
        explanationArabic: 'لضمان اختبار عادل، يجب على المجربين أن يفترضوا أن كمية الإنزيم نفسها تظل ثابتة في جميع المحاولات، بحيث يكون الأس الهيدروجيني هو المتغير المهم الوحيد الذي يؤثر على النتيجة.',
      }
    ],
    imageUrl: 'https://placehold.co/600x400.png',
    dataAIHint: 'science laboratory',
    recommendedTime: 7,
    subject: 'Biology',
    chartData: {
        type: 'bar',
        data: [
          { name: 'pH 3', value: 2.1 },
          { name: 'pH 5', value: 8.5 },
          { name: 'pH 7', value: 15.2 },
          { name: 'pH 9', value: 10.3 },
          { name: 'pH 11', value: 3.4 },
        ],
        xAxisKey: 'name',
        yAxisKey: 'value',
        yAxisLabel: 'Oxygen (mL)',
    }
  },
  {
    title: 'Photosynthesis and Cellular Respiration',
    passage: `1. Photosynthesis and cellular respiration are two of the most fundamental biological processes on Earth. They are complementary processes that are central to the flow of energy in ecosystems. Photosynthesis, which occurs in the chloroplasts of plant cells and some other organisms, converts light energy into chemical energy. The overall equation for photosynthesis is 6CO<sub>2</sub> + 6H<sub>2</sub>O + Light Energy → C<sub>6</sub>H<sub>12</sub>O<sub>6</sub> + 6O<sub>2</sub>.

2. In this process, carbon dioxide (CO<sub>2</sub>) and water (H<sub>2</sub>O) are used to synthesize glucose (C<sub>6</sub>H<sub>12</sub>O<sub>6</sub>), a sugar molecule that stores chemical energy. Oxygen (O<sub>2</sub>) is released as a byproduct. This process is the primary source of organic matter and oxygen for most life on Earth.

3. Cellular respiration, conversely, is the process by which cells break down glucose to release the stored chemical energy. This occurs in the mitochondria of eukaryotic cells. The overall equation is essentially the reverse of photosynthesis: C<sub>6</sub>H<sub>12</sub>O<sub>6</sub> + 6O<sub>2</sub> → 6CO<sub>2</sub> + 6H<sub>2</sub>O + ATP (Energy). The energy released is captured in the form of adenosine triphosphate (ATP), the primary energy currency of the cell.`,
    questions: [
      {
        question: 'Which of the following are the reactants of photosynthesis?',
        options: ['Glucose and oxygen', 'Carbon dioxide and water', 'ATP and light', 'Oxygen and water'],
        answer: 'Carbon dioxide and water',
        explanationEnglish: 'The passage provides the equation for photosynthesis as 6CO<sub>2</sub> + 6H<sub>2</sub>O + Light Energy → C<sub>6</sub>H<sub>12</sub>O<sub>6</sub> + 6O<sub>2</sub>. The reactants are on the left side: carbon dioxide and water.',
        explanationArabic: 'يوفر النص معادلة البناء الضوئي كالتالي: 6CO<sub>2</sub> + 6H<sub>2</sub>O + طاقة ضوئية → C<sub>6</sub>H<sub>12</sub>O<sub>6</sub> + 6O<sub>2</sub>. المواد المتفاعلة على الجانب الأيسر هي: ثاني أكسيد الكربون والماء.',
      },
      {
        question: 'Where does cellular respiration primarily occur in eukaryotic cells?',
        options: ['Nucleus', 'Chloroplasts', 'Ribosomes', 'Mitochondria'],
        answer: 'Mitochondria',
        explanationEnglish: 'Paragraph 3 states that cellular respiration occurs in the mitochondria of eukaryotic cells.',
        explanationArabic: 'الفقرة الثالثة تذكر أن التنفس الخلوي يحدث في الميتوكوندريا في الخلايا حقيقية النواة.',
      },
       {
        question: 'The relationship between photosynthesis and cellular respiration is best described as:',
        options: ['Unrelated', 'Identical', 'Complementary and roughly opposite', 'Competitive'],
        answer: 'Complementary and roughly opposite',
        explanationEnglish: 'The passage states they are "complementary processes" and that the equation for respiration is "essentially the reverse of photosynthesis." This indicates an opposite, interconnected relationship.',
        explanationArabic: 'يذكر النص أنهما "عمليتان متكاملتان" وأن معادلة التنفس هي "أساسًا عكس عملية البناء الضوئي". وهذا يشير إلى علاقة عكسية ومترابطة.',
      }
    ],
    imageUrl: 'https://placehold.co/600x400.png',
    dataAIHint: 'plant leaf',
    recommendedTime: 6,
    subject: 'Biology',
  },
  {
    title: 'The Human Circulatory System',
    passage: `1. The human circulatory system is a complex network responsible for transporting oxygen, nutrients, hormones, and waste products throughout the body. The system is powered by the heart, a four-chambered muscular organ that functions as a double pump. The right side of the heart pumps deoxygenated blood to the lungs (pulmonary circulation), while the left side pumps oxygenated blood to the rest of the body (systemic circulation).

2. There are three main types of blood vessels: arteries, veins, and capillaries. Arteries carry blood away from the heart. They are thick-walled and elastic to withstand high pressure. Veins carry blood towards the heart. They have thinner walls and contain valves to prevent the backflow of blood. Capillaries are the smallest blood vessels, forming vast networks where the exchange of gases, nutrients, and waste occurs between the blood and body tissues.`,
    questions: [
      {
        question: 'What is the primary function of the right side of the heart?',
        options: ['Pump oxygenated blood to the body', 'Pump deoxygenated blood to the lungs', 'Receive oxygenated blood from the lungs', 'Filter waste from the blood'],
        answer: 'Pump deoxygenated blood to the lungs',
        explanationEnglish: 'The first paragraph clearly states, "The right side of the heart pumps deoxygenated blood to the lungs (pulmonary circulation)".',
        explanationArabic: 'الفقرة الأولى تنص بوضوح على أن "الجانب الأيمن من القلب يضخ الدم غير المؤكسج إلى الرئتين (الدورة الدموية الرئوية)".',
      },
      {
        question: 'Which feature is unique to veins and not found in arteries?',
        options: ['Thick walls', 'Elasticity', 'Valves', 'High pressure'],
        answer: 'Valves',
        explanationEnglish: 'The passage mentions that veins "contain valves to prevent the backflow of blood," a feature not ascribed to arteries.',
        explanationArabic: 'يذكر النص أن الأوردة "تحتوي على صمامات لمنع التدفق العكسي للدم"، وهي ميزة لا تُنسب للشرايين.',
      }
    ],
    imageUrl: 'https://placehold.co/600x400.png',
    dataAIHint: 'human heart',
    recommendedTime: 4,
    subject: 'Biology',
  },
];

export const geologyDemoSet: UrtTest[] = [
  {
    title: 'The Rock Cycle',
    passage: `1. The rock cycle is a fundamental concept in geology that describes the dynamic transitions through geologic time among the three main rock types: igneous, sedimentary, and metamorphic. Rocks are not static; they are constantly being formed, worn down, and reformed.

2. Igneous rocks are formed from the cooling and solidification of magma or lava. When magma cools slowly beneath the Earth's surface, it forms intrusive igneous rocks with large crystals, such as granite. When lava cools quickly on the surface, it forms extrusive igneous rocks with small crystals, like basalt.

3. Sedimentary rocks are formed from the accumulation and cementation of sediments. These sediments are created by the weathering and erosion of pre-existing rocks. Over time, layers of sediment (like sand, silt, and shells) are compacted and cemented together to form rocks like sandstone, shale, and limestone.

4. Metamorphic rocks are formed when existing rocks are subjected to intense heat, pressure, or chemical processes. The original rock, or protolith, undergoes a change in its mineralogy and texture. For example, limestone can be metamorphosed into marble, and granite can become gneiss.`,
    questions: [
      {
        question: 'Which type of rock is formed from the cooling of molten magma?',
        options: ['Sedimentary', 'Igneous', 'Metamorphic', 'Protolith'],
        answer: 'Igneous',
        explanationEnglish: 'Paragraph 2 states that igneous rocks are formed from the cooling and solidification of magma or lava.',
        explanationArabic: 'الفقرة الثانية تذكر أن الصخور النارية تتكون من تبريد وتصلب الصهارة أو الحمم البركانية.',
      },
      {
        question: 'The process of weathering and erosion is most directly involved in the formation of which rock type?',
        options: ['Igneous', 'Metamorphic', 'Sedimentary', 'Basalt'],
        answer: 'Sedimentary',
        explanationEnglish: 'Paragraph 3 explains that sedimentary rocks are formed from sediments, which are "created by the weathering and erosion of pre-existing rocks."',
        explanationArabic: 'تشرح الفقرة 3 أن الصخور الرسوبية تتكون من الرواسب، والتي "تتكون عن طريق التجوية والتعرية للصخور الموجودة مسبقًا".',
      },
      {
        question: 'An intrusive igneous rock like granite would be expected to have:',
        options: ['Layers of sediment', 'Fossils', 'Large crystals', 'A glassy texture'],
        answer: 'Large crystals',
        explanationEnglish: 'The passage notes that when magma cools slowly beneath the surface, it forms intrusive igneous rocks with large crystals, using granite as an example.',
        explanationArabic: 'يشير النص إلى أنه عندما تبرد الصهارة ببطء تحت السطح، فإنها تشكل صخورًا نارية متداخلة ذات بلورات كبيرة، مستخدمًا الجرانيت كمثال.',
      },
    ],
    imageUrl: 'https://placehold.co/600x400.png',
    dataAIHint: 'rock layers',
    recommendedTime: 5,
    subject: 'Geology',
  },
  {
    title: 'Theory of Plate Tectonics',
    passage: `1. The theory of plate tectonics is the cornerstone of modern geology. It posits that the Earth's outer shell, the lithosphere, is divided into several large and small rigid plates that glide over the semi-molten asthenosphere below. The movement and interaction of these plates are responsible for major geological features and events, including earthquakes, volcanoes, and the formation of mountain ranges.

2. There are three main types of plate boundaries. At divergent boundaries, plates move apart, and new crust is created as magma rises from the mantle. This is seen at mid-ocean ridges. At convergent boundaries, plates collide. One plate may slide beneath the other in a process called subduction, leading to volcanic arcs and deep ocean trenches. If two continental plates collide, they can crumple and form vast mountain ranges like the Himalayas.

3. At transform boundaries, plates slide horizontally past one another. The friction between the plates prevents them from moving smoothly, causing stress to build up. When this stress is released, it results in an earthquake. The San Andreas Fault in California is a famous example of a transform boundary.`,
    questions: [
      {
        question: 'According to the passage, the Himalayas were formed by which type of plate interaction?',
        options: ['Divergent boundary', 'Subduction', 'Convergent boundary between two continental plates', 'Transform boundary'],
        answer: 'Convergent boundary between two continental plates',
        explanationEnglish: 'Paragraph 2 explicitly states that when two continental plates collide at a convergent boundary, they can form mountain ranges like the Himalayas.',
        explanationArabic: 'الفقرة الثانية تذكر بوضوح أنه عندما تصطدم صفيحتان قاريتان عند حدود متقاربة، يمكن أن تشكل سلاسل جبلية مثل جبال الهيمالايا.',
      },
      {
        question: 'Earthquakes like those on the San Andreas Fault are characteristic of which type of boundary?',
        options: ['Convergent', 'Divergent', 'Subduction', 'Transform'],
        answer: 'Transform',
        explanationEnglish: 'The third paragraph explains that at transform boundaries, plates slide past each other, build up stress, and release it as earthquakes, citing the San Andreas Fault as an example.',
        explanationArabic: 'تشرح الفقرة الثالثة أنه عند الحدود التحويلية، تنزلق الصفائح بجانب بعضها البعض، وتتراكم الإجهادات، وتطلقها على شكل زلازل، مستشهدة بصدع سان أندرياس كمثال.',
      },
       {
        question: 'New oceanic crust is formed at:',
        options: ['Convergent boundaries', 'Subduction zones', 'Divergent boundaries', 'Transform faults'],
        answer: 'Divergent boundaries',
        explanationEnglish: 'Paragraph 2 says that at divergent boundaries, plates move apart and new crust is created as magma rises.',
        explanationArabic: 'تقول الفقرة الثانية إنه عند الحدود المتباعدة، تتباعد الصفائح وتتكون قشرة جديدة مع ارتفاع الصهارة.',
      }
    ],
    imageUrl: 'https://placehold.co/600x400.png',
    dataAIHint: 'tectonic plates',
    recommendedTime: 6,
    subject: 'Geology',
  },
  {
    title: 'ACT Science: Soil Composition Analysis',
    passage: `Soil is a mixture of minerals, organic matter, water, and air. The texture of soil is determined by the relative proportions of its mineral components: sand, silt, and clay. A geologist collected soil samples from three different locations (A, B, and C) to analyze their composition and water-holding capacity.

**Study 1**
The geologist first determined the percentage of sand, silt, and clay in each sample using a series of sieves and sedimentation tests. The results are recorded in Table 1.

<table>
  <caption>Table 1: Soil Composition (%)</caption>
  <thead>
    <tr><th>Location</th><th>Sand (%)</th><th>Silt (%)</th><th>Clay (%)</th></tr>
  </thead>
  <tbody>
    <tr><td>A</td><td>65</td><td>25</td><td>10</td></tr>
    <tr><td>B</td><td>45</td><td>40</td><td>15</td></tr>
    <tr><td>C</td><td>20</td><td>40</td><td>40</td></tr>
  </tbody>
</table>

**Study 2**
Next, the geologist tested the water-holding capacity of each soil type. A 100g sample of dry soil from each location was placed in a funnel with filter paper. 200 mL of water was poured through each sample. After 30 minutes, the amount of water that passed through the funnel was collected and measured. The water-holding capacity is the amount of water retained by the soil. The results are shown in Table 2.

<table>
  <caption>Table 2: Water-Holding Capacity</caption>
  <thead>
    <tr><th>Location</th><th>Water Passed Through (mL)</th><th>Water Retained (mL)</th></tr>
  </thead>
  <tbody>
    <tr><td>A</td><td>160</td><td>40</td></tr>
    <tr><td>B</td><td>115</td><td>85</td></tr>
    <tr><td>C</td><td>70</td><td>130</td></tr>
  </tbody>
</table>`,
    questions: [
      {
        question: 'According to Study 1, which location has the soil with the highest percentage of clay?',
        options: ['Location A', 'Location B', 'Location C', 'Locations A and B'],
        answer: 'Location C',
        explanationEnglish: 'Table 1 shows that Location C has 40% clay, which is higher than Location A (10%) and Location B (15%).',
        explanationArabic: 'يُظهر الجدول 1 أن الموقع C يحتوي على 40٪ من الطين، وهي نسبة أعلى من الموقع A (10٪) والموقع B (15٪).',
      },
      {
        question: 'Based on the results of both studies, what is the relationship between the percentage of sand in the soil and its water-holding capacity?',
        options: ['As sand increases, water-holding capacity increases.', 'As sand increases, water-holding capacity decreases.', 'As sand decreases, water-holding capacity decreases.', 'There is no clear relationship.'],
        answer: 'As sand increases, water-holding capacity decreases.',
        explanationEnglish: 'Location A has the most sand (65%) and the lowest water retention (40 mL). Location C has the least sand (20%) and the highest water retention (130 mL). This shows an inverse relationship.',
        explanationArabic: 'الموقع A يحتوي على أكبر كمية من الرمل (65٪) وأقل قدرة على الاحتفاظ بالماء (40 مل). الموقع C يحتوي على أقل كمية من الرمل (20٪) وأعلى قدرة على الاحتفاظ بالماء (130 مل). وهذا يظهر علاقة عكسية.',
      },
      {
        question: 'A fourth sample is tested and found to be composed of 50% sand, 30% silt, and 20% clay. Its water retained would most likely be:',
        options: ['less than 40 mL', 'between 40 mL and 85 mL', 'between 85 mL and 130 mL', 'greater than 130 mL'],
        answer: 'between 40 mL and 85 mL',
        explanationEnglish: 'The sample (50% sand) is between Sample A (65% sand) and Sample B (45% sand). Therefore, its water retention should be between the values for A (40 mL) and B (85 mL).',
        explanationArabic: 'تقع العينة (50٪ رمل) بين العينة A (65٪ رمل) والعينة B (45٪ رمل). لذلك، يجب أن تكون قدرتها على الاحتفاظ بالماء بين قيم A (40 مل) و B (85 مل).',
      }
    ],
    imageUrl: 'https://placehold.co/600x400.png',
    dataAIHint: 'soil layers',
    recommendedTime: 7,
    subject: 'Geology',
     chartData: {
        type: 'bar',
        data: [
          { name: 'Location A', value: 40 },
          { name: 'Location B', value: 85 },
          { name: 'Location C', value: 130 },
        ],
        xAxisKey: 'name',
        yAxisKey: 'value',
        yAxisLabel: 'Water Retained (mL)',
    }
  },
  {
    title: 'Mohs Hardness Scale',
    passage: `1. In geology, hardness is a measure of the resistance of a mineral to being scratched. In 1812, German geologist Friedrich Mohs devised a scale to classify minerals based on this property. The Mohs scale of mineral hardness is an ordinal scale, meaning it ranks minerals from softest to hardest but does not indicate a proportional or absolute difference between them.

2. The scale consists of ten reference minerals. Talc is the softest, with a rank of 1. Diamond is the hardest, with a rank of 10. A mineral can scratch any other mineral with a lower ranking and will be scratched by any mineral with a higher ranking. For example, Quartz (rank 7) can scratch Feldspar (rank 6), but cannot scratch Topaz (rank 8). This simple test is a valuable tool for geologists in the field to help identify unknown minerals.`,
    questions: [
      {
        question: 'According to the passage, an unknown mineral that can scratch Feldspar (6) but is scratched by Quartz (7) must have a hardness:',
        options: ['less than 6', 'exactly 6.5', 'between 6 and 7', 'greater than 7'],
        answer: 'between 6 and 7',
        explanationEnglish: 'The mineral can scratch Feldspar (rank 6), so its hardness must be greater than 6. It is scratched by Quartz (rank 7), so its hardness must be less than 7. Therefore, its hardness is between 6 and 7.',
        explanationArabic: 'يمكن للمعدن المجهول أن يخدش الفلسبار (المرتبة 6)، لذا يجب أن تكون صلابته أكبر من 6. ويتم خدشه بواسطة الكوارتز (المرتبة 7)، لذا يجب أن تكون صلابته أقل من 7. لذلك، تقع صلابته بين 6 و 7.',
      },
       {
        question: 'The Mohs scale is described as an "ordinal scale" because it:',
        options: ['Was created by Friedrich Mohs', 'Only includes ten minerals', 'Shows the relative order of hardness, not the absolute difference', 'Is used to identify all types of rocks'],
        answer: 'Shows the relative order of hardness, not the absolute difference',
        explanationEnglish: 'The first paragraph defines an ordinal scale as one that "ranks minerals from softest to hardest but does not indicate a proportional or absolute difference between them."',
        explanationArabic: 'تعرف الفقرة الأولى المقياس الترتيبي بأنه "يرتب المعادن من الأنعم إلى الأصلب ولكنه لا يشير إلى فرق نسبي أو مطلق بينها".',
      }
    ],
    imageUrl: 'https://placehold.co/600x400.png',
    dataAIHint: 'minerals gemstones',
    recommendedTime: 4,
    subject: 'Geology',
  },
];
