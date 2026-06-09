import { toMil } from "./models/converters.js";
import { createResultsTable } from "./models/data_tables.js";

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

export function renderInput(containerInput)
{
    containerInput.innerHTML = `
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

    const elms = containerInput.querySelectorAll('input[name="mode"]');
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

export function calculate(containerInput)
{
    // Inputs
    const tempRise = parseFloat(containerInput.querySelector("#tempRise").value);
    let thickness = parseFloat(containerInput.querySelector("#thickness").value);
    const thicknessUnit = containerInput.querySelector("#thicknessUnit").value;
    const layer = containerInput.querySelector("#layer").value;
    let length = parseFloat(containerInput.querySelector("#length").value);
    const lengthUnit = containerInput.querySelector("#lengthUnit").value;
    let current = parseFloat(containerInput.querySelector("#current").value);
    let width = parseFloat(containerInput.querySelector("#width").value);
    const widthUnit = containerInput.querySelector("#widthUnit").value;
    const mode = containerInput.querySelector('input[name="mode"]:checked').value;

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
    thickness = toMil(thickness, thicknessUnit);
    width = toMil(width, widthUnit);
    length = toMil(length, lengthUnit);

    if (mode == "width")
    {
        width = (current / (k * tempRise**b)) ** (1 / c) / thickness;
    }
    if (mode == "current")
    {
        const area = width * thickness;
        current = k * tempRise**b * area**c;
    }

    // Resistance:
    // R = r * L / (W * T)
    // r = 1.72 × 10^-8 Ωm (resistivity of copper at 25 degrees)
    // L and W * T in meter
    const res = ( 1.72 / 2.54) * length / (width * thickness);
    const voltDrop = current * res;
    const powerLoss = voltDrop * current;

    return [
        { label: "Current", value: current.toFixed(5) + " A" },
        { label: "Trace width", value: (width * 0.0254).toFixed(5) + " mm" },
        { label: "Trace width", value: width.toFixed(5) + " mil" },
        { label: "Resistance", value: res.toFixed(5) + " mΩ" },
        { label: "Voltage drop", value: voltDrop.toFixed(5) + " mV" },
        { label: "Power loss", value: powerLoss.toFixed(5) + " mW" }
    ];
};

export function renderResults(results, containerOutput)
{
    containerOutput.innerHTML = "";
    containerOutput.appendChild(createResultsTable(results));
}
