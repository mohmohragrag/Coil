function calculateDistribution() {
  const mainInch = parseFloat(document.getElementById("mainInch").value);
  const thickness = parseFloat(document.getElementById("thickness").value);
  const coilWidth = parseFloat(document.getElementById("coilWidth").value);
  const usableWidth = coilWidth - 20;

  const pipeTable = {
    0.5: 21.3,
    0.75: 26.7,
    1: 33.4,
    1.25: 42.2,
    1.5: 48.3,
    2: 60.3,
    2.5: 73.0,
    3: 88.9,
    3.5: 101.6,
    4: 114.3,
    5: 141.3,
    6: 168.3,
    7: 193.7,
    8: 219.1,
    10: 273.0,
    12: 323.8,
    14: 355.6
  };

  const maxThicknessPerInch = {
    0.5: 2.8,
    0.75: 3.0,
    1: 3.7,
    1.25: 4.0,
    1.5: 4.0,
    2: 4.0,
    2.5: 5.0,
    3: 5.5,
    3.5: 5.5,
    4: 6.0,
    5: 6.0,
    6: 7.0,
    7: 6.0,
    8: 8.0,
    10: 9.3,
    12: 10.3,
    14: 11.1
  };

  const π = Math.PI;

  if (!(mainInch in pipeTable)) {
    document.getElementById("result").innerHTML = "❌ المقاس غير موجود في جدول السيملس.";
    return;
  }

  if (thickness > (maxThicknessPerInch[mainInch] || 0)) {
    document.getElementById("result").innerHTML =
      `❌ السُمك أكبر من المسموح (${maxThicknessPerInch[mainInch]} مم) لهذا المقاس ${mainInch} بوصة.`;
    return;
  }

  const mainDia = pipeTable[mainInch];
  const mainWidth = (mainDia * π) - thickness + 2;
  let remaining = usableWidth;
  const plan = [];

  const mainCount = Math.floor(remaining / mainWidth);
  if (mainCount > 0) {
    plan.push({
      inch: mainInch,
      width: mainWidth.toFixed(2),
      count: mainCount,
      used: (mainCount * mainWidth).toFixed(2)
    });
    remaining -= mainCount * mainWidth;
  }

  const smallerPipes = Object.entries(pipeTable)
    .map(([inch, dia]) => {
      const inchNum = parseFloat(inch);
      const w = (dia * π) - thickness + 2;
      return { inch: inchNum, width: w };
    })
    .filter(p =>
      p.inch < mainInch &&
      thickness <= (maxThicknessPerInch[p.inch] || 0)
    )
    .sort((a, b) => b.width - a.width);

  for (const pipe of smallerPipes) {
    const count = Math.floor(remaining / pipe.width);
    if (count > 0) {
      plan.push({
        inch: pipe.inch,
        width: pipe.width.toFixed(2),
        count: count,
        used: (count * pipe.width).toFixed(2)
      });
      remaining -= count * pipe.width;
    }
  }

  let output = `<strong>خطة الإنتاج من لفة ${coilWidth} مم:</strong><br><ul>`;
  plan.forEach(p => {
    output += `<li>${p.count} × ${p.inch} بوصة (عرض الشريحة ${p.width} مم) = ${p.used} مم</li>`;
  });
  output += `</ul><br><strong>العادم النهائي = ${remaining.toFixed(2)} مم</strong>`;

  document.getElementById("result").innerHTML = output;
}
