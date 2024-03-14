const chips = document.querySelectorAll('.chip');
const generateTestButton = document.getElementById('generate-test');
const testList = document.getElementById('test-list');
const progress = document.getElementById('progress');

chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    chips.forEach((c) => c.classList.remove('selected'));
    chip.classList.add('selected');
    generateTestButton.textContent = `Test ${
      chip.querySelector('h3').textContent
    }`;
    generateTestButton.classList.add('active');
  });
});

generateTestButton.addEventListener('click', async () => {
  const selectedChip = document.querySelector('.chip.selected');
  if (!selectedChip) {
    alert('Please select a chip before generating tests!');
    return;
  }
  testList.innerHTML = '';
  await generateTests(selectedChip.dataset.id);
});
async function generateTests(chipId) {
  progress.style.width = '0%';

  const chipSpecifications = {
    chip1: {
      'Operating Voltage': { range: [4.5, 5.5], unit: 'V' },
      'Operating Humidity': { range: [0, 100], unit: '%' },
      'Operating Temperature': { range: [-40, 125], unit: '°C' },
    },
    chip2: {
      'Operating Voltage': { range: [3, 3.5], unit: 'V' },
      'Operating Humidity': { range: [0, 85], unit: '%' },
      'Operating Temperature': { range: [-20, 85], unit: '°C' },
    },
    chip3: {
      'Operating Voltage': { range: [1.5, 2], unit: 'V' },
      'Operating Humidity': { range: [20, 80], unit: '%' },
      'Operating Temperature': { range: [-10, 70], unit: '°C' },
    },
    chip4: {
      'Operating Voltage': { range: [2.5, 3], unit: 'V' },
      'Operating Humidity': { range: [5, 95], unit: '%' },
      'Operating Temperature': { range: [-30, 100], unit: '°C' },
    },
  };

  const tests = [];
  const specifications = chipSpecifications[chipId];
  const testCount = 2;
  let totalTests = 0;

  for (const [name, spec] of Object.entries(specifications)) {
    for (let i = 0; i < testCount; i++) {
      let isPass = false;
      const testValue = generateRandomValueWithinRange(spec.range);

      isPass =
        chipId !== 'chip3'
          ? testValue >= spec.range[0] && testValue <= spec.range[1]
          : false;
      tests.push(
        `Testing ${name} at ${testValue.toFixed(2)} ${spec.unit} ${
          isPass ? '✅' : '❌'
        }`
      );
      totalTests++;
      if (totalTests >= testCount * Object.keys(specifications).length) {
        break;
      }
    }
  }

  await runTests(tests);
}

function generateRandomValueWithinRange(range) {
  const [min, max] = range;
  return Math.random() * (max - min) + min;
}

function runTests(tests) {
  return new Promise((resolve) => {
    let progressCount = 0;
    const interval = setInterval(() => {
      if (progressCount < tests.length) {
        const testItem = document.createElement('li');
        testItem.textContent = tests[progressCount];
        testList.appendChild(testItem);
        progress.style.width = `${((progressCount + 1) / tests.length) * 100}%`;
        progressCount++;
      } else {
        clearInterval(interval);
        resolve();
      }
    }, 100);
  });
}
