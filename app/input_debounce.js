/*  Handels input change events after a certain delay when the user stops typing.
    No events on each input change if the user is tying.

    Usage:
    <input type="text" id="searchBox" />

    <script>
    // Input change handler
    function handleInput(e)
    {
        // Do something here with the input
    }

    // Debounce
    const input = document.getElementById("searchBox");
    input.addEventListener("input", debounce(handleInput));
    </script>
*/

const DELAY = 300;  // delay in ms


export function debounce(callback) {
    let timeoutId;
    return function (...args)
    {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() =>
        {
            callback.apply(this, args);
        },
        DELAY);
    };
}
