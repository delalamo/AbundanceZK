import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import Tooltip from '../../Tooltip'; // Adjust path if needed

// --- Define constants outside the component ---
const containerHeight = 450;
const margin = { top: 50, right: 30, bottom: 150, left: 60 };
const stackKeys = [
    'Males_under_20',
    'Females_under_20',
    'Males_over_20',
    'Females_over_20',
];
const percentageKeys = stackKeys.map((key) => `${key}_pct`);
const colorScale = d3.scaleOrdinal().domain(stackKeys).range(d3.schemeCategory10);

// --- Main Component ---
const BicycleFatalitiesPlot = () => {
    // State Hooks
    const [data, setData] = useState(null);
    const [isDataVisible, setIsDataVisible] = useState(false);
    const [tooltipData, setTooltipData] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Refs for DOM elements
    const svgRef = useRef(null);
    const containerRef = useRef(null);

    // --- Data Loading Effect (Runs on Mount) ---
    useEffect(() => {
        let isMounted = true;
        console.log('[Effect LoadData] Mounting and starting data load...');

        const loadData = async () => {
             if (isMounted) {
                 setError(null);
             }
            const dataPath = '/assets/data/2025-03-13/annual-bicycle-fatalities.csv';
            console.log(`[Effect LoadData] Attempting to load data from: ${dataPath}`);

            try {
                console.log('[Effect LoadData] Awaiting d3.csv...');
                const csvData = await d3.csv(dataPath);

                if (!isMounted) {
                    console.log('[Effect LoadData] Component unmounted during fetch, aborting.');
                    return;
                }
                console.log('[Effect LoadData] Raw CSV Data fetched:', csvData ? csvData.length : 'null/undefined');

                if (!csvData) {
                     console.error('[Effect LoadData] d3.csv returned null/undefined.');
                     throw new Error('CSV data failed to load (d3.csv returned falsy).');
                }

                if (csvData.length === 0) {
                    console.log('[Effect LoadData] CSV data is empty.');
                    if(isMounted) setData([]);
                    return; // Go to finally
                }

                console.log('[Effect LoadData] Parsing data...');
                 const parsedData = csvData
                    .map((d, index) => {
                        const row = { Year: Number(String(d.Year).trim()) };
                        let hasNaN = isNaN(row.Year);
                        stackKeys.forEach((key) => {
                            const rawValue = d[key] ? String(d[key]).trim().replace(/,/g, '') : null;
                            row[key] = rawValue === null || rawValue === '' ? NaN : Number(rawValue);
                            if (isNaN(row[key])) hasNaN = true;
                        });
                        percentageKeys.forEach((key) => {
                             const rawValue = d[key] ? String(d[key]).trim() : null;
                             row[key] = rawValue === null || rawValue === '' ? NaN : Number(rawValue);
                        });
                        const rawTotal = d.Total ? String(d.Total).trim().replace(/,/g, '') : null;
                        row.Total = rawTotal === null || rawTotal === '' ? NaN : Number(rawTotal);
                        if (isNaN(row.Total)) hasNaN = true;

                        if (hasNaN) {
                            console.warn(`[Effect LoadData] Row ${index} filtered out due to NaN values:`, d);
                            return null;
                        }
                        return row;
                    })
                    .filter((d) => d !== null);

                console.log('[Effect LoadData] Parsed & Filtered Data count:', parsedData.length);

                if (!isMounted) {
                     console.log('[Effect LoadData] Component unmounted during parsing, aborting.');
                     return;
                }

                if (parsedData.length === 0) {
                    console.error('[Effect LoadData] No valid data points remain after parsing/filtering.');
                    throw new Error('No valid data points remain after parsing. Check CSV format and console warnings.');
                }

                const yearDomain = d3.extent(parsedData, (d) => d.Year);
                const totalMax = d3.max(parsedData, (d) => d.Total);
                if (yearDomain.includes(undefined) || totalMax === undefined) {
                    console.error('[Effect LoadData] Failed to calculate valid data domains from parsed data.');
                    throw new Error('Failed to calculate valid data domains. Check parsed data.');
                }
                console.log('[Effect LoadData] Data parsed successfully. Setting data state.');

                if(isMounted) setData(parsedData);

            } catch (err) {
                console.error('[Effect LoadData] Error caught during load/parse:', err);
                if (isMounted) {
                    setError(err.message || `Failed to load or parse data.`);
                    setData(null);
                }
            } finally {
                console.log('[Effect LoadData] Entering finally block.');
                if (isMounted) {
                    console.log('[Effect LoadData] Setting loading to false.');
                    setLoading(false);
                } else {
                     console.log('[Effect LoadData] Component unmounted before finally->setLoading could run.');
                }
            }
        };

        loadData();

        return () => {
            console.log('[Effect LoadData] Cleaning up (unmounting).');
            isMounted = false;
        };
    }, []); // Empty dependency array means this runs only once on mount

    // --- Click Handler (Shows Stacks) ---
    const handleShowStacksClick = useCallback(() => {
        if (!loading && !error && data && data.length > 0 && !isDataVisible) {
            console.log('[Click Handler] Showing stacked data.');
            setIsDataVisible(true);
        } else {
             console.log('[Click Handler] Click ignored - conditions not met:', {loading, error, data_length: data?.length, isDataVisible});
        }
    }, [loading, error, data, isDataVisible]);

    // --- D3 Rendering Effect ---
    useEffect(() => {
        console.log("[Effect D3] Running D3 render effect. isDataVisible:", isDataVisible, "Has Data:", !!(data && data.length > 0));
        const container = containerRef.current;
        if (!container) { console.error("[Effect D3] Container ref not found."); return; }
        const containerWidth = container.offsetWidth;
        if (!containerWidth || containerWidth <=0 ) { console.log("[Effect D3] Container width invalid, skipping render:", containerWidth); d3.select(svgRef.current).selectAll('*').remove(); return; }

        try {
            const width = containerWidth - margin.left - margin.right;
            const height = containerHeight - margin.top - margin.bottom;
            if (width <= 0 || height <= 0) { console.log("[Effect D3] Calculated dimensions invalid.", {width, height}); d3.select(svgRef.current).selectAll('*').remove(); return; }

            // Define Scales
            let xDomain, yMaxDomain;
            if (data && data.length > 0) {
                xDomain = d3.extent(data, (d) => d.Year);
                yMaxDomain = d3.max(data, (d) => d.Total) * 1.05;
                if (xDomain.includes(undefined) || xDomain.some(isNaN) || yMaxDomain === undefined || isNaN(yMaxDomain)) {
                    console.error("[Effect D3] Invalid domains calculated:", { xDomain, yMaxDomain }); throw new Error("Invalid data domains.");
                }
            } else { xDomain = [1975, 2022]; yMaxDomain = 1200; }
            const yDomain = [0, yMaxDomain];
            const x = d3.scaleLinear().domain(xDomain).range([0, width]);
            const y = d3.scaleLinear().domain(yDomain).range([height, 0]).nice();

            // SVG Setup
            const svg = d3.select(svgRef.current).attr('width', containerWidth).attr('height', containerHeight);
            svg.selectAll('*').remove();
            const chartGroup = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

            // Draw Axes
            chartGroup.append('g').attr('class', 'x-axis').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x).tickFormat(d3.format('d')));
            chartGroup.append('g').attr('class', 'y-axis').call(d3.axisLeft(y));

            // Draw Text Elements (Titles, Labels, Legend, Source)
            chartGroup.append('text').attr('class', 'main-title').attr('x', width / 2).attr('y', 0 - margin.top / 2 - 5).attr('text-anchor', 'middle').style('font-size', '1.2rem').style('font-weight', 'bold').text('Number of Annual Bicyclist Fatalities');
            chartGroup.append('text').attr('class', 'subtitle').attr('x', width / 2).attr('y', 0 - margin.top / 2 + 15).attr('text-anchor', 'middle').style('font-size', '0.9rem').style('fill', '#444').text('Number of recorded bicyclists killed in fatal crashes from 1975 to 2022');
            chartGroup.append('text').attr('class', 'y-label').attr('transform', 'rotate(-90)').attr('y', 0 - margin.left).attr('x', 0 - height / 2).attr('dy', '1em').style('text-anchor', 'middle').text('Total Bicyclist Deaths').style('font-size', '0.9rem').style('fill', '#333');
            chartGroup.append('text').attr('class', 'x-label').attr('transform', `translate(${width / 2}, ${height + 30})`).style('text-anchor', 'middle').text('Year').style('font-size', '0.9rem').style('fill', '#333');
            const legendY = height + 55; const legendPadding = 5; const legendRectSize = 15; const legendSpacing = 10; const legendGroup = chartGroup.append('g').attr('class', 'legend').attr('transform', `translate(0, ${legendY})`); let currentLegendX = 0; stackKeys.forEach((key) => { const labelText = key.replace(/_/g, ' '); const itemGroup = legendGroup.append('g').attr('transform', `translate(${currentLegendX}, 0)`); itemGroup.append('rect').attr('width', legendRectSize).attr('height', legendRectSize).attr('fill', colorScale(key)); const textElement = itemGroup.append('text').attr('x', legendRectSize + legendPadding).attr('y', legendRectSize / 2).attr('dy', '0.35em').style('font-size', '0.8rem').style('fill', '#333').text(labelText); currentLegendX += legendRectSize + legendPadding + textElement.node().getComputedTextLength() + legendSpacing; }); const legendWidth = currentLegendX - legendSpacing; const legendStartX = (width - legendWidth) / 2; legendGroup.attr('transform', `translate(${legendStartX > 0 ? legendStartX : 0}, ${legendY})`);
            const sourceTextY = height + 90; const sourceText = chartGroup.append('text').attr('class', 'source-text').attr('x', 0).attr('y', sourceTextY).attr('text-anchor', 'start').style('font-size', '0.75rem').style('fill', '#666'); sourceText.append('tspan').text('Data from 1975 until 1990 comes IIHS. Data from 1990 until 2006 from the Bureau of Transportation Statistics.'); sourceText.append('tspan').attr('x', 0).attr('dy', '1.2em').text("Data from 2007 until 2021 comes from NHTSA's Fatality and Injury Reporting System Tool (FIRST)"); sourceText.append('tspan').attr('x', 0).attr('dy', '1.2em').text('Chart: The League of American Bicyclists • Source: IIHS, BTS, and NHTSA FARS'); sourceText.append('tspan').attr('x', 0).attr('dy', '1.2em').text('Original created with Datawrapper. Replicated here with D3.js');

            // Conditional Drawing
            if (data && data.length > 0) {
                if (isDataVisible) {
                    // Draw STACKED AREAS (Interaction ENABLED)
                    console.log("[Effect D3] Drawing Stacked Areas");
                    const stackGenerator = d3.stack().keys(stackKeys).order(d3.stackOrderNone).offset(d3.stackOffsetNone);
                    const stackedData = stackGenerator(data);
                    const areaGenerator = d3.area().x((d) => x(d.data.Year)).y0((d) => y(d[0])).y1((d) => y(d[1])).defined(d => !isNaN(d[0]) && !isNaN(d[1])); // Added defined check
                    chartGroup.selectAll('.stack-area').data(stackedData).enter().append('path')
                        .attr('class', 'stack-area')
                        .attr('d', areaGenerator)
                        .attr('fill', (d) => colorScale(d.key))
                        .attr('opacity', 0.8);

                    // Interaction for STACKS (Keep Tooltip and Hover Line)
                    const bisector = d3.bisector((d) => d.Year).left;
                    const hoverLine = chartGroup.append('line').attr('class', 'hover-line').attr('y1', 0).attr('y2', height).attr('stroke', '#333').attr('stroke-width', 1).attr('stroke-dasharray', '3,3').style('opacity', 0);
                    chartGroup.append('rect').attr('class', 'interaction-overlay').attr('width', width).attr('height', height).attr('fill', 'none').attr('pointer-events', 'all')
                        .on('mousemove', (event) => {
                            const [pointerXRelChart] = d3.pointer(event);
                            const [pointerXRelContainer, pointerYRelContainer] = d3.pointer(event, container);
                            const yearValue = x.invert(pointerXRelChart);
                            const index = bisector(data, yearValue, 1);
                            if (index <= 0 || index >= data.length) { // Avoid out of bounds
                                setTooltipData(null); hoverLine.style('opacity', 0); return;
                            }
                            const d0 = data[index - 1];
                            const d1 = data[index];
                             if (!d0 || !d1) { // Check if data points exist
                                setTooltipData(null); hoverLine.style('opacity', 0); return;
                             }
                            const closestData = (yearValue - d0.Year > d1.Year - yearValue) ? d1 : d0;

                            if (closestData) {
                                setTooltipData(closestData);
                                const tooltipOffsetX = 15; const tooltipOffsetY = -35;
                                setTooltipPosition({ x: pointerXRelContainer + tooltipOffsetX, y: pointerYRelContainer + tooltipOffsetY });
                                const hoverX = x(closestData.Year);
                                if(!isNaN(hoverX)) { // Ensure hoverX is valid
                                   hoverLine.attr('x1', hoverX).attr('x2', hoverX).style('opacity', 1);
                                } else {
                                    hoverLine.style('opacity', 0);
                                }
                            } else {
                                setTooltipData(null);
                                hoverLine.style('opacity', 0);
                            }
                        })
                        .on('mouseleave', () => {
                            setTooltipData(null);
                            hoverLine.style('opacity', 0);
                        });

                } else {
                    // Draw TOTAL LINE and AREA (Interaction DISABLED)
                    console.log("[Effect D3] Drawing Total Area and Line (No Hover Interaction)");
                    const totalAreaGenerator = d3.area().x(d => x(d.Year)).y0(height).y1(d => y(d.Total)).defined(d => !isNaN(d.Total));
                    chartGroup.append("path").datum(data).attr("class", "total-area").attr("fill", "#e0e0e0").attr("opacity", 0.6).attr("d", totalAreaGenerator);

                    const lineGenerator = d3.line().x(d => x(d.Year)).y(d => y(d.Total)).defined(d => !isNaN(d.Total));
                    chartGroup.append("path")
                        .datum(data)
                        .attr("class", "total-line")
                        .attr("fill", "none")
                        .attr("stroke", "black") // Set stroke to black
                        .attr("stroke-width", 2)
                        .attr("d", lineGenerator);

                    // Interaction overlay for TOTAL LINE state (NO visual feedback on hover)
                    chartGroup.append('rect')
                        .attr('class', 'interaction-overlay-preclick')
                        .attr('width', width)
                        .attr('height', height)
                        .attr('fill', 'none')
                        .attr('pointer-events', 'all')
                        .on('mousemove', null) // Remove mousemove listener entirely for this state
                        .on('mouseleave', null); // Remove mouseleave listener entirely for this state
                }
            } else {
                console.log("[Effect D3] No data to draw plots.");
                chartGroup.append('text').attr('x', width / 2).attr('y', height / 2).attr('text-anchor', 'middle').attr('fill', '#999').text(error ? 'Error loading data' : (loading ? '' : 'No data loaded'));
            }

        } catch(renderError) {
            console.error("[Effect D3] Error during D3 rendering:", renderError);
            // Display error message within SVG if possible
             try {
                const svg = d3.select(svgRef.current);
                const chartGroup = svg.select('g'); // Assumes g exists or drawing failed before this
                if(chartGroup && !chartGroup.empty()) {
                    chartGroup.append('text')
                       .attr('x', (containerWidth - margin.left - margin.right) / 2)
                       .attr('y', (containerHeight - margin.top - margin.bottom) / 2)
                       .attr('text-anchor', 'middle')
                       .attr('fill', 'red')
                       .text("Error rendering chart");
                }
             } catch(e) { /* ignore errors during error reporting */ }
        }
    }, [data, isDataVisible, loading, error, colorScale, stackKeys]); // Dependencies

    // --- Component Event Handlers ---
    const handleMouseLeaveContainer = useCallback(() => {
         setTooltipData(null); // Always hide tooltip when leaving container
         try {
             d3.select(svgRef.current).select('.hover-line').style('opacity', 0);
             // No hover circle for total line anymore, but doesn't hurt to leave this
             d3.select(svgRef.current).select('.hover-circle').style('opacity', 0);
         } catch (e) { console.warn("Error hiding hover elements on container leave:", e); }
     }, []);

    // --- Component Render ---
    return (
        <div
          ref={containerRef}
          style={{
            position: 'relative', width: '100%', maxWidth: '800px', margin: '1em auto', minHeight: containerHeight,
            cursor: !loading && !error && data && data.length > 0 && !isDataVisible ? 'pointer' : 'default',
           }}
          onClick={handleShowStacksClick}
          onMouseLeave={handleMouseLeaveContainer} // Keep this on the main container
        >
          {/* Loading Overlay */}
          {loading && (
              <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', background: 'rgba(255,255,255,0.8)', zIndex: 5, backdropFilter: 'blur(2px)' }}>Loading Chart Data...</div>
          )}
          {/* Error Overlay */}
          {!loading && error && (
              <div style={{ position: 'absolute', inset: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`, display: 'grid', placeItems: 'center', color: 'red', background: 'rgba(255,235,235,0.9)', zIndex: 5, padding: '1em', borderRadius: '5px', border: '1px solid red' }}>Error: {error}</div>
          )}
          {/* Text Prompt Overlay */}
          {!loading && !error && data && data.length > 0 && !isDataVisible && (
            <div style={{
                position: 'absolute', top: margin.top, left: margin.left, width: `calc(100% - ${margin.left + margin.right}px)`, height: `calc(100% - ${margin.top + margin.bottom}px)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', backgroundColor: 'rgba(255, 255, 255, 0)', textAlign: 'center', borderRadius: '3px', zIndex: 4, pointerEvents: 'none', paddingTop: '50px'
             }}>
              Click to show category breakdown
            </div>
          )}
          {/* No Data Message */}
          {!loading && !error && data && data.length === 0 && (
             <div style={{ position: 'absolute', inset: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`, display: 'grid', placeItems: 'center', color: '#999', zIndex: 3 }}> No data available to display chart. </div>
          )}

          {/* SVG container */}
          <svg ref={svgRef} style={{ display: 'block', width: '100%', height: 'auto', minHeight: containerHeight }} />

          {/* Tooltip Component */}
          <Tooltip x={tooltipPosition.x} y={tooltipPosition.y} data={tooltipData} isVisible={!!tooltipData} keys={isDataVisible ? stackKeys : ['Total']} colorScale={colorScale} />
        </div>
    );
// Removed semicolon after function definition brace
}

export default BicycleFatalitiesPlot;