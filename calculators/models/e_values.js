/* Model for E range values */

// Include 10 to make the first above loop work properly (9.3 -> 10)
const E12 = [ 1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2, 10 ];

const E24 = [ 1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0,
              3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1, 10 ];

// Round value to n digits
const round = (v, n) => Math.round(v * 10 ** n) / 10 ** n;


export function getFirstAboveE24(value)
{
    const range = E24;
    return getFirstAbove(range, value);
}

export function getRangeE24(value)
{
    const norm = normalizeValue(value);
    // Leave out the last element
    return E24.slice(0, -1).map(v => round(v * norm.factor, 3));
}

function getFirstAbove(range, value)
{
    const norm = normalizeValue(value);
    // Exact match
    if (range.includes(norm.value))
    {
        return round(norm.value * norm.factor, 3);
    }
    // Nearest above
    for (const v of range)
    {
        if (v > norm.value)
        {
            return round(v * norm.factor, 3);
        }
    }
    return 0;
}

function normalizeValue(value)
{
    let factor = 1;
    if (value > 0)
    {
        // Normalize value
        while (value >= 10)
        {
            value /= 10;
            factor *= 10;
        }
        while (value < 1)
        {
            value *= 10;
            factor /= 10;
        }
    }
    return {value, factor};
}
