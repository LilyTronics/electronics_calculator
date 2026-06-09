/* Generic results table */

export function createResultsTable(results)
{
    const table = document.createElement("table");
    results.forEach(row => {
        const tr = document.createElement("tr");
        const tdLabel = document.createElement("td");
        tdLabel.textContent = `${row.label}:`;
        const tdValue = document.createElement("td");
        tdValue.textContent = `${row.value}`;
        tr.appendChild(tdLabel);
        tr.appendChild(tdValue);
        table.appendChild(tr);
    });
    return table;
}

export function createSweepTable(sweepTable)
{
    const table = document.createElement("table");
    table.classList.add("w3-table");
    table.classList.add("w3-border");
    table.classList.add("w3-striped");
    table.classList.add("w3-border-theme");
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");
    tr.classList.add("w3-theme");
    sweepTable.headers.forEach(h => {
        const td = document.createElement("td");
        td.textContent = h;
        tr.appendChild(td);
    });
    thead.appendChild(tr);
    table.appendChild(thead);
    const tbody = document.createElement("tbody");
    sweepTable.sweepValues.forEach(data => {
        const tr = document.createElement("tr");
        data.forEach(d => {
            const td = document.createElement("td");
            td.textContent = d;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    return table;
}
