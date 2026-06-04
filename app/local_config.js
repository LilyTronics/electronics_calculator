/* Local configuration settings */


const defaultConfig =
{
    debug: false
};

async function getConfig()
{
    // Only load on localhost
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1")
    {
        try
        {
            const res = await fetch("./local_config.json", { cache: "no-store" });
            if (!res.ok) throw new Error();
            const userConfig = await res.json();
            return { ...defaultConfig, ...userConfig };
        }
        catch
        {
            console.warn("Using default config");
        }
    }
    return defaultConfig;
}

export const localConfig = await getConfig();
