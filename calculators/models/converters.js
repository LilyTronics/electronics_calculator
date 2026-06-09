/* Various converters */

export function toMil(value, unit)
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
