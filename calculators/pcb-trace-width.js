export const meta =
{
  name: "PCB trace width",
  desc: "IPC-2221: trace width for a given current"
};

export function render(container)
{
  container.innerHTML = `
    <h2>${meta.icon} ${meta.name}</h2>
    <p>${meta.desc}</p>

    <div class="panel">
      <label>Stroom (A)
        <input id="current" type="number" value="2" step="0.1" min="0.001">
      </label>

      <label>Temperatuurstijging ΔT (°C)
        <input id="tempRise" type="number" value="10" step="1" min="1">
      </label>

      <label>Koper dikte (oz)
        <select id="thickness">
          <option value="0.5">0.5 oz</option>
          <option value="1" selected>1 oz</option>
          <option value="2">2 oz</option>
        </select>
      </label>

      <label>Laag
        <select id="layer">
          <option value="external" selected>External</option>
          <option value="internal">Internal</option>
        </select>
      </label>

      <label>Trace lengte (mm) <span class="muted">(optioneel)</span>
        <input id="length" type="number" value="" step="1" min="0">
      </label>

      <button id="calcBtn">Bereken</button>
    </div>

    <div class="panel">
      <h3>Resultaten</h3>
      <div id="out"></div>
      <h3>Tabel (sweep)</h3>
      <table class="table" id="tbl"></table>
    </div>
  `;

  const btn = container.querySelector("#calcBtn");
  btn.addEventListener("click", () =>
  {
    const input =
    {
      current: parseFloat(container.querySelector("#current").value),
      tempRise: parseFloat(container.querySelector("#tempRise").value),
      thicknessOz: parseFloat(container.querySelector("#thickness").value),
      layer: container.querySelector("#layer").value,
      lengthMm: parseFloat(container.querySelector("#length").value) || null,
    };

    const result = compute(input);
    renderResult(container, input, result);
  });

  // auto-run once
  btn.click();
}

export function compute({ current, tempRise, thicknessOz, layer, lengthMm })
{
  // IPC-2221 constants
  const k = layer === "external" ? 0.048 : 0.024;
  const b = 0.44;
  const c = 0.725;

  // area in mil^2
  const area_mil2 = Math.pow(current / (k * Math.pow(tempRise, b)), 1 / c);

  // copper thickness in mil (1 oz ≈ 1.378 mil)
  const thickness_mil = thicknessOz * 1.378;

  // width in mil
  const width_mil = area_mil2 / thickness_mil;
  const width_mm = width_mil * 0.0254;

  // optional resistance if length provided (very rough DC estimate)
  let resistance_ohm = null, vdrop_v = null, ploss_w = null;
  if (lengthMm)
  {
    const rho = 1.72e-8; // copper resistivity Ω·m
    const width_m = width_mm / 1000;
    const thick_m = (thickness_mil * 0.0254) / 1000;
    const area_m2 = width_m * thick_m;
    const len_m = lengthMm / 1000;

    resistance_ohm = rho * (len_m / area_m2);
    vdrop_v = resistance_ohm * current;
    ploss_w = vdrop_v * current;
  }

  return {
    width_mm,
    width_mil,
    area_mil2,
    resistance_ohm,
    vdrop_v,
    ploss_w,
  };
}

function renderResult(container, input, r)
{
  const out = container.querySelector("#out");
  out.innerHTML = `
    <div class="kpi">
      <div><span class="muted">Breedte</span><br><b>${r.width_mm.toFixed(3)} mm</b> (${r.width_mil.toFixed(2)} mil)</div>
      <div><span class="muted">Area</span><br><b>${r.area_mil2.toFixed(2)} mil²</b></div>
      ${
        r.resistance_ohm == null
          ? `<div class="muted">Lengte niet ingevuld → geen R/Vdrop/Ploss</div>`
          : `<div><span class="muted">R</span><br><b>${r.resistance_ohm.toExponential(3)} Ω</b><br>
             <span class="muted">Vdrop</span> ${r.vdrop_v.toFixed(4)} V<br>
             <span class="muted">Ploss</span> ${r.ploss_w.toFixed(4)} W</div>`
      }
    </div>
  `;

  // build sweep table
  const tbl = container.querySelector("#tbl");
  tbl.innerHTML = `<tr><th>I (A)</th><th>W (mm)</th></tr>`;

  const steps = 12;
  const maxI = Math.max(0.5, input.current * 2);
  for (let i = 0; i <= steps; i++)
  {
    const I = (maxI * i) / steps || 0.1;
    const rr = compute({ ...input, current: I });
    tbl.innerHTML += `<tr><td>${I.toFixed(2)}</td><td>${rr.width_mm.toFixed(3)}</td></tr>`;
  }
}
