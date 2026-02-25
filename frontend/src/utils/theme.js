/**
 * Applies theme variables to the document root
 * @param {string} primaryColor - Hex color code
 * @param {string} radius - Border radius string (e.g. '8px')
 */
export const applyTheme = (primaryColor, radius) => {
    const root = document.documentElement;

    if (primaryColor) {
        root.style.setProperty('--primary', primaryColor);
    }

    if (radius) {
        root.style.setProperty('--radius-md', radius);
        root.style.setProperty('--radius-lg', `calc(${radius} * 1.5)`);
        root.style.setProperty('--radius-sm', `calc(${radius} * 0.5)`);
    }
};
