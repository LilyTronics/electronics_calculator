import { getFirstAboveE24, getRangeE24 } from "./models/e_values.js";
import { createResultsTable, createSweepTable } from "./models/data_tables.js";

export const meta =
{
    name: "Regulator AZ1117C",
    description: "Output voltage and power dissipation for the AZ1117C"
};

export const defaults =
{
    inputVolt: 7,
    outputVolt: 5,
    outputCur: 0.25,
    res1: 120,
    package: 125,
    heatsink: 0
};

export function renderInput(containerInput)
{
    containerInput.innerHTML = `
    <table>
        <tr>
            <td>Input voltage:</td>
            <td><input id="inputVolt" type="text" size="5"> V</td>
        </tr>
        <tr>
            <td>Output voltage:</td>
            <td><input id="outputVolt" type="text" size="5"> V</td>
        </tr>
        <tr>
            <td>Output current:</td>
            <td><input id="outputCur" type="text" size="5"> A</td>
        </tr>
        <tr>
            <td>R1:</td>
            <td><input id="res1" type="text" size="5"> Ω</td>
        </tr>
        <tr>
            <td>Package:</td>
            <td><select id="package">
                <option value="100">TO252</option>
                <option value="125">SOT223</option>
                <option value="170">SOT89</option>
            </select></td>
        </tr>
        <tr>
            <td>Heatsink:</td>
            <td><select id="heatsink">
                    <option value="0">No heatsink</option>
                    <option value="25">PCB area 10x10 mm</option>
                </select></td>
        </tr>
    </table>
    <p>All resistor values in E24 range and 1% tolerance.</p>
    `;
}

export function calculate(containerInput)
{
    // Inputs
    const inputVolt = parseFloat(containerInput.querySelector("#inputVolt").value);
    const outputVolt = parseFloat(containerInput.querySelector("#outputVolt").value);
    const outputCur = parseFloat(containerInput.querySelector("#outputCur").value);
    const res1 = parseFloat(containerInput.querySelector("#res1").value);
    const pack = parseFloat(containerInput.querySelector("#package").value);
    const heatsink = parseFloat(containerInput.querySelector("#heatsink").value);

    // Datasheet constants
    const vRefMin = 1.225;
    const vRefTyp = 1.250;
    const vRefMax = 1.270;
    const iAdjTyp = 0.000060;
    const iAdjMax = 0.000120;
    const maxTemp = 125;

    // VOUT = VREF * (1 + R2/R1) + (IADJ * R2)
    // R2 = (VOUT - VREF) / ((VREF / R1) + IADJ)
    const res2 = (outputVolt - vRefTyp) / ((vRefTyp / res1) + iAdjTyp)
    const res2E24 = getFirstAboveE24(res2);
    const vout = vRefTyp * (1 + (res2E24 / res1)) + (iAdjTyp * res2E24);
    const voutMin = vRefMin * (1 + ((0.99 * res2E24) / (1.01 * res1)));
    const voutMax = vRefMax * (1 + ((1.01 * res2E24) / (0.99 * res1))) + (iAdjMax * 1.01 * res2E24);
    const dVout = 100 * (vout - outputVolt) / outputVolt;
    const dVoutMin = 100 * (voutMin - outputVolt) / outputVolt;
    const dVoutMax = 100 * (voutMax - outputVolt) / outputVolt;

    const power = (inputVolt - vout) * outputCur;
    const thRes = pack - heatsink;
    const tAmbMax = maxTemp - (power * thRes);

    const data = []
    for (const r1 of getRangeE24(res1))
    {
        const r2 = (outputVolt - vRefTyp) / ((vRefTyp / r1) + iAdjTyp)
        const r2E24 = getFirstAboveE24(r2);
        const vout = vRefTyp * (1 + (r2E24 / r1)) + (iAdjTyp * r2E24);
        const diff = 100 * (vout - outputVolt) / outputVolt;
        data.push([r1, r2.toFixed(3), r2E24, vout.toFixed(3), diff.toFixed(2)]);
    }

    return {
        resultsTable: [
            { label: "R2", value: res2.toFixed(3) + " Ω" },
            { label: "R2 (E24)", value: res2E24 + " Ω" },
            { label: "Output voltage typ", value: vout.toFixed(3) + " V (" + dVout.toFixed(2) + " %)" },
            { label: "Output voltage min", value: voutMin.toFixed(3) + " V (" + dVoutMin.toFixed(2) + " %)" },
            { label: "Output voltage max", value: voutMax.toFixed(3) + " V (" + dVoutMax.toFixed(2) + " %)" },
            { label: "Power dissipation", value: power.toFixed(2) + " W"},
            { label: "Max ambient temperature", value: tAmbMax.toFixed(1) + " °C"}
        ],
        sweepTable: {
            headers: ["R1 (Ω)", "R2 (Ω)", "R2 E24 (Ω)", "Vout (V)", "Diff (%)"],
            sweepValues : data
        }
    };
}

export function renderResults(results, containerOutput)
{
    containerOutput.innerHTML = "";

    let p = document.createElement("p");
    p.textContent = "Output voltage for given input:"
    containerOutput.appendChild(p);
    containerOutput.appendChild(createResultsTable(results.resultsTable));

    p = document.createElement("p");
    p.textContent = "Output voltage for resistor range:"
    containerOutput.appendChild(p);
    containerOutput.appendChild(createSweepTable(results.sweepTable));
}
