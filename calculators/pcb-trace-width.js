export const meta =
{
    name: "PCB trace width",
    description: "IPC-2221: trace width for a given current"
};

export const defaults =
{
    tempRise: 10,
    thickness: 1,
    thicknessUnit: "oz",
    layer: "external",
    length: 10,
    lengthUnit: "mm",
    mode: "width",
    current: 1,
    width: 0.3,
    widthUnit: "mm"
};

export function render(container)
{
    container.innerHTML = `
        <table>
        <tr>
            <td>Temperature rise:</td>
            <td><input id="tempRise" type="text" size="5"> °C</td>
        </tr>
        <tr>
            <td>Copper thickness:</td>
            <td><input id="thickness" type="text" size="5">
                <select id="thicknessUnit">
                    <option value="oz">oz</option>
                    <option value="mil">mil</option>
                    <option value="mm">mm</option>
                </select></td>
        </tr>
        <tr>
            <td>Layer:</td>
            <td><select id="layer">
                <option value="external">external</option>
                <option value="internal">internal</option>
            </select></td>
        </tr>
        <tr>
            <td>Trace length:</td>
            <td><input id="length" type="text" size="5">
                <select id="lengthUnit">
                    <option value="mm">mm</option>
                    <option value="mil">mil</option>
                </select></td>
        </tr>
        <tr>
            <td>Mode:</td>
            <td><input type="radio" name="mode" value="width" /> calculate minimum trace width<br/>
                <input type="radio" name="mode" value="current" /> calculate maximum current</td>
        </tr>
        <tr id="calcWidth">
            <td>Current:</td>
            <td><input id="current" type="text" size="5"> A</td>
        </tr>
        <tr id="calcCurrent" style="display:none">
            <td>Trace width:</td>
            <td><input id="width" type="text" size="5">
                <select id="widthUnit">
                    <option value="mm">mm</option>
                    <option value="mil">mil</option>
            </select></td>
        </tr>
        </table>
    `;

    const elms = document.getElementsByName("mode");
    for (const elm of elms)
    {
        elm.addEventListener("click", () => {
            document.getElementById("calcWidth").style.display = "none";
            document.getElementById("calcCurrent").style.display = "none";
            let id = elm.value;
            id = "calc" + id[0].toUpperCase() + id.slice(1);
            document.getElementById(id).style.display = "table-row";
        });
    }
}

export function calculate()
{
    // Inputs
    const tempRise = parseFloat(document.getElementById("tempRise").value);
    let thickness = parseFloat(document.getElementById("thickness").value);
    const thicknessUnit = document.getElementById("thicknessUnit").value;
    const layer = document.getElementById("layer").value;
    const length = parseFloat(document.getElementById("length").value);
    const lengthUnit = document.getElementById("lengthUnit").value;
    let current = parseFloat(document.getElementById("current").value);
    let width = parseFloat(document.getElementById("width").value);
    const widthUnit = document.getElementById("widthUnit").value;
    const mode = document.querySelector('input[name="mode"]:checked').value;

    // IPC-2221 constants
    const k = layer === "external" ? 0.048 : 0.024;
    const b = 0.44;
    const c = 0.725;

    // Mode max current:
    //   I = k × (ΔT)^b × (A)^c
    // Mode trace width:
    //   A = (I / (k × (ΔT)^b))^(1 / c)
    //   W = (I / (k × (ΔT)^b))^(1 / c) / thickness

    // All sizes in mil
    thickness = ToMil(thickness, thicknessUnit);
    width = ToMil(width, widthUnit);

    if (mode == "width")
    {
        width = (current / (k * tempRise**b)) ** (1 / c) / thickness;
    }
    if (mode == "current")
    {
        const area = width * thickness;
        current = k * tempRise**b * area**c;
    }

    console.log("width", width);
    console.log("current", current);
};

function ToMil(value, unit)
{
    if (unit == "oz")
    {
        return value * 0.035 * 1000 / 25.4;
    }
    if (unit == "mm")
    {
        return value * 1000 / 25.4;
    }
    return value;
}

//     <div class="panel">
//       <h3>Resultaten</h3>
//       <div id="out"></div>
//       <h3>Tabel (sweep)</h3>
//       <table class="table" id="tbl"></table>
//     </div>
//   `;

//   const btn = container.querySelector("#calcBtn");
//   btn.addEventListener("click", () =>
//   {
//     const input =
//     {
//       current: parseFloat(container.querySelector("#current").value),
//       tempRise: parseFloat(container.querySelector("#tempRise").value),
//       thicknessOz: parseFloat(container.querySelector("#thickness").value),
//       layer: container.querySelector("#layer").value,
//       lengthMm: parseFloat(container.querySelector("#length").value) || null,
//     };

//     const result = compute(input);
//     renderResult(container, input, result);
//   });

//   // auto-run once
//   btn.click();
// }

// export function compute({ current, tempRise, thicknessOz, layer, lengthMm })
// {

//   // area in mil^2
//   const area_mil2 = Math.pow(current / (k * Math.pow(tempRise, b)), 1 / c);

//   // copper thickness in mil (1 oz ≈ 1.378 mil)
//   const thickness_mil = thicknessOz * 1.378;

//   // width in mil
//   const width_mil = area_mil2 / thickness_mil;
//   const width_mm = width_mil * 0.0254;

//   // optional resistance if length provided (very rough DC estimate)
//   let resistance_ohm = null, vdrop_v = null, ploss_w = null;
//   if (lengthMm)
//   {
//     const rho = 1.72e-8; // copper resistivity Ω·m
//     const width_m = width_mm / 1000;
//     const thick_m = (thickness_mil * 0.0254) / 1000;
//     const area_m2 = width_m * thick_m;
//     const len_m = lengthMm / 1000;

//     resistance_ohm = rho * (len_m / area_m2);
//     vdrop_v = resistance_ohm * current;
//     ploss_w = vdrop_v * current;
//   }

//   return {
//     width_mm,
//     width_mil,
//     area_mil2,
//     resistance_ohm,
//     vdrop_v,
//     ploss_w,
//   };
// }

// function renderResult(container, input, r)
// {
//   const out = container.querySelector("#out");
//   out.innerHTML = `
//     <div class="kpi">
//       <div><span class="muted">Breedte</span><br><b>${r.width_mm.toFixed(3)} mm</b> (${r.width_mil.toFixed(2)} mil)</div>
//       <div><span class="muted">Area</span><br><b>${r.area_mil2.toFixed(2)} mil²</b></div>
//       ${
//         r.resistance_ohm == null
//           ? `<div class="muted">Lengte niet ingevuld → geen R/Vdrop/Ploss</div>`
//           : `<div><span class="muted">R</span><br><b>${r.resistance_ohm.toExponential(3)} Ω</b><br>
//              <span class="muted">Vdrop</span> ${r.vdrop_v.toFixed(4)} V<br>
//              <span class="muted">Ploss</span> ${r.ploss_w.toFixed(4)} W</div>`
//       }
//     </div>
//   `;

//   // build sweep table
//   const tbl = container.querySelector("#tbl");
//   tbl.innerHTML = `<tr><th>I (A)</th><th>W (mm)</th></tr>`;

//   const steps = 12;
//   const maxI = Math.max(0.5, input.current * 2);
//   for (let i = 0; i <= steps; i++)
//   {
//     const I = (maxI * i) / steps || 0.1;
//     const rr = compute({ ...input, current: I });
//     tbl.innerHTML += `<tr><td>${I.toFixed(2)}</td><td>${rr.width_mm.toFixed(3)}</td></tr>`;
//   }
// }
