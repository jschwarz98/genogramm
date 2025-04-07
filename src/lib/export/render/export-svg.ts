import {XYWH} from "$/types";

export default async function (svg: null | SVGSVGElement, padding = 5): Promise<{ success: boolean }> {
    if (!svg) {
        return;
    }
    const bounds = computeAggregateBoundingBox(svg, padding);
    const pageStyles = getCSSStyles();
    return window.electronAPI.exportSvg(svg.outerHTML, bounds, pageStyles);
}

function getCSSStyles(): string {
    let styles = "";
    for (let i = 0; i < document.styleSheets.length; i++) {
        const sheet = document.styleSheets[i];
        try {
            if (sheet.cssRules) {
                for (let j = 0; j < sheet.cssRules.length; j++) {
                    const rule = sheet.cssRules[j];
                    styles += rule.cssText + "\n";
                }
            }
        } catch (e) {
            console.warn("Could not access stylesheet:", sheet);
        }
    }
    return styles;
}

function computeAggregateBoundingBox(svg: SVGSVGElement, padding = 0): XYWH {
    // Initialize bounds with large positive/negative numbers.
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    // Iterate over all SVG elements that you want to include.
    const elements = svg.querySelectorAll('*');
    elements.forEach(el => {
        // If the element is an SVGGraphicsElement, use getBBox.
        if (el instanceof SVGGraphicsElement) {
            try {
                const bbox = el.getBBox();
                minX = Math.min(minX, bbox.x);
                minY = Math.min(minY, bbox.y);
                maxX = Math.max(maxX, bbox.x + bbox.width);
                maxY = Math.max(maxY, bbox.y + bbox.height);
            } catch (err) {
                // Some elements (like <defs>) may throw errors.
                console.warn('Skipping element:', el, err);
            }
        } else {
            // For non-SVG elements (like foreignObject), fallback to getBoundingClientRect.
            const rect = el.getBoundingClientRect();
            minX = Math.min(minX, rect.x);
            minY = Math.min(minY, rect.y);
            maxX = Math.max(maxX, rect.x + rect.width);
            maxY = Math.max(maxY, rect.y + rect.height);
        }
    });

    return {
        x: Math.floor(minX - padding),
        y: Math.floor(minY - padding),
        width: Math.floor(maxX - minX + (2 * padding)),
        height: Math.floor(maxY - minY + (2 * padding))
    };
}