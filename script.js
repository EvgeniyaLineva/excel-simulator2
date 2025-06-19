// Преобразование русскоязычной формулы в английскую
function transformFormula(formula) {
  return formula
    .replace(/^=ВПР/i,   '=VLOOKUP')
    .replace(/;/g,       ',')
    .replace(/\bИСТИНА\b/gi, 'TRUE')
    .replace(/\bЛОЖЬ\b/gi,   'FALSE');
}

window.onload = function () {
  luckysheet.create({
    container: 'luckysheet',
    lang: 'en',
    sheetFormulaBar: true,
    showtoolbar: false,
    showsheetbar: false,
    showinfobar: false,
    allowEdit: true,
    data: [{
      name: 'Лист1',
      data: [
        ["Товар","Цена"],
        ["Яблоко",50],
        ["Груша",60],
        ["Апельсин",70],
        [],
        ["Груша",""]
      ],
      config: { merge: {} },
      calcChain: []
    }],
    hook: {
      cellUpdateBefore: function (r, c, value) {
        // Проверяем, это B6 (индексы 5,1), и введено что-то
        if (r === 5 && c === 1 && typeof value === 'string' && value.startsWith('=') && /[А-Я]/i.test(value)) {
          // Преобразуем и возвращаем новую формулу
          return transformFormula(value);
        }
        return true; // иначе — ничего не делаем
      }
    }
  });

  // Подсветим ячейку B6
  luckysheet.setCellStyle(5, 1, { background: '#e0ffe0', border: '2px solid green' });
  // Сделаем остальные ячейки только для чтения
  luckysheet.setCellReadonly(0, { row: [0,1,2,3,4,5], column: [0,1] });
};

function checkAnswer() {
  const meta = luckysheet.getCellMeta(5,1);
  const value = luckysheet.getCellValue(5,1);
  const formula = meta && meta.f;

  if (!formula) {
    alert("Введите формулу в ячейку B6, например: =ВПР(\"Груша\";A2:B4;2;ЛОЖЬ)");
    return;
  }
  if (!formula.toUpperCase().includes("VLOOKUP")) {
    alert("Формула введена, но не содержит VLOOKUP.");
    return;
  }
  if (value == 60) {
    alert("✅ Отлично! Формула введена правильно, и результат верен.");
  } else {
    alert(`❌ Результат неверный (получено ${value}).`);
  }
}
