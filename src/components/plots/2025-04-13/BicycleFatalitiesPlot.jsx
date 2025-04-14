import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'framer-motion';

// --- Helper Components ---

const Tooltip = ({ x, y, data, isVisible, keys, colorScale }) => {
    // Tooltip component remains the same...
    return (
        <AnimatePresence>
            {isVisible && data && (
                <motion.div
                    style={{
                        position: 'absolute',
                        left: x, // Position is set based on state
                        top: y,  // Position is set based on state
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        color: 'white',
                        padding: '0.75rem',
                        border: '1px solid #555',
                        borderRadius: '4px',
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                        pointerEvents: 'none',
                        zIndex: 10,
                        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                        fontSize: '0.8rem',
                        width: '210px', // Fixed width
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                >
                    <div style={{ marginBottom: '0.5rem', borderBottom: '1px solid #666', paddingBottom: '0.3rem' }}>
                        <strong>Year: {data.Year}</strong>
                    </div>
                    {keys.map(key => {
                        const label = key.replace(/_/g, ' ');
                        const count = data[key];
                        const pctKey = `${key}_pct`;
                        const pct = data[pctKey];
                        return (
                            <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                                <span>
                                    <span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: colorScale(key), marginRight: '5px', borderRadius: '2px' }}></span>
                                    {label}:
                                </span>
                                <span>
                                    {count} ({!isNaN(pct) ? `${pct}%` : 'N/A'})
                                </span>
                            </div>
                        );
                    })}
                     <div style={{ marginTop: '0.5rem', borderTop: '1px solid #666', paddingTop: '0.3rem', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Total:</span>
                        <span>{data.Total}</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};


// --- Main Component ---

const BicycleFatalitiesPlot = () => {
    // State Hooks
    const [data, setData] = useState(null);
    const [isDataVisible, setIsDataVisible] = useState(false);
    const [tooltipData, setTooltipData] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Refs for DOM elements
    const svgRef = useRef(null);
    const containerRef = useRef(null); // Ref for the main container div

    // Chart dimensions and configuration
    const containerHeight = 450;
    const margin = { top: 50, right: 30, bottom: 150, left: 60 };

    // Define the keys for the stacks and their order
    const stackKeys = ['Males_under_20', 'Females_under_20', 'Males_over_20', 'Females_over_20'];
    const percentageKeys = stackKeys.map(key => `${key}_pct`);

    // Color scale for the stacks
    const colorScale = d3.scaleOrdinal()
        .domain(stackKeys)
        .range(d3.schemeCategory10);

    // --- Data Loading Function (Triggered by Click) ---
    const handleLoadDataClick = useCallback(async () => {
        // Data loading logic remains the same...
        if (isDataVisible || loading) return;
        setLoading(true);
        setError(null);
        setData(null);
        const dataPath = '/assets/data/2025-03-13/annual-bicycle-fatalities.csv';
        console.log(`Attempting to load data from: ${dataPath}`);
        try {
            const csvData = await d3.csv(dataPath);
            console.log('Raw CSV Data:', csvData);
            if (!csvData) throw new Error('CSV data failed to load.');
            if (csvData.length === 0) {
                setData([]); setError(null); setIsDataVisible(true); setLoading(false); return;
            }
            const parsedData = csvData.map(d => {
                const row = { Year: Number(String(d.Year).trim()) };
                let hasNaN = isNaN(row.Year);
                stackKeys.forEach(key => {
                    const rawValue = d[key] ? String(d[key]).trim().replace(/,/g, '') : null;
                    row[key] = rawValue === null || rawValue === '' ? NaN : Number(rawValue);
                    if (isNaN(row[key])) hasNaN = true;
                });
                percentageKeys.forEach(key => {
                    const rawValue = d[key] ? String(d[key]).trim() : null;
                    row[key] = rawValue === null || rawValue === '' ? NaN : Number(rawValue);
                    // Don't invalidate row based on missing percentage
                });
                const rawTotal = d.Total ? String(d.Total).trim().replace(/,/g, '') : null;
                row.Total = rawTotal === null || rawTotal === '' ? NaN : Number(rawTotal);
                if (isNaN(row.Total)) hasNaN = true;
                if (hasNaN) console.warn('Parsing issue or invalid numeric data found in row:', d);
                return !hasNaN ? row : null;
            }).filter(d => d !== null);
            console.log('Parsed & Filtered Data:', parsedData);
            if (parsedData.length === 0) throw new Error('No valid data points remain after parsing and filtering.');
            const yearDomain = d3.extent(parsedData, d => d.Year);
            const totalMax = d3.max(parsedData, d => d.Total);
            if (yearDomain.includes(undefined) || totalMax === undefined) throw new Error('Failed to calculate valid data domains.');
            setData(parsedData);
            setIsDataVisible(true);
            setError(null);
        } catch (err) {
            console.error('Error loading or parsing data:', err);
            setError(err.message || `Failed to load data.`);
            setData(null);
            setIsDataVisible(false);
        } finally {
            setLoading(false);
        }
    }, [isDataVisible, loading]); // Dependencies


    // --- D3 Rendering Effect ---
    useEffect(() => {
        const container = containerRef.current; // Get the container element
        if (!container) return;
        const containerWidth = container.offsetWidth;
        if (!containerWidth) return;

        const width = containerWidth - margin.left - margin.right;
        const height = containerHeight - margin.top - margin.bottom;

        if (width <= 0 || height <= 0) {
             d3.select(svgRef.current).selectAll('*').remove();
            return;
        };

        // --- Scales ---
        let xDomain;
        if (isDataVisible && Array.isArray(data) && data.length > 0) {
            xDomain = d3.extent(data, d => d.Year);
        } else {
            xDomain = [1975, 2022];
        }
        const yMaxDomain = (isDataVisible && Array.isArray(data) && data.length > 0)
                            ? (d3.max(data, d => d.Total) * 1.05)
                            : 1200;
        const yDomain = [0, yMaxDomain];

        const x = d3.scaleLinear().domain(xDomain).range([0, width]);
        const y = d3.scaleLinear().domain(yDomain).range([height, 0]).nice();

        // --- SVG Setup ---
        const svg = d3.select(svgRef.current)
            .attr('width', containerWidth)
            .attr('height', containerHeight);
        svg.selectAll('*').remove();
        const chartGroup = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // --- Draw Axes ---
        chartGroup.append('g').attr('class', 'x-axis').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x).tickFormat(d3.format('d')));
        chartGroup.append('g').attr('class', 'y-axis').call(d3.axisLeft(y));

        // --- Draw Text Elements (Titles, Labels, Source, Legend) ---
        // ... (text elements and legend remain the same as previous version) ...
        chartGroup.append('text').attr('class', 'main-title').attr('x', width / 2).attr('y', 0 - (margin.top / 2) - 5).attr('text-anchor', 'middle').style('font-size', '1.2rem').style('font-weight', 'bold').text('Number of Annual Bicyclist Fatalities');
        chartGroup.append('text').attr('class', 'subtitle').attr('x', width / 2).attr('y', 0 - (margin.top / 2) + 15).attr('text-anchor', 'middle').style('font-size', '0.9rem').style('fill', '#444').text('Number of recorded bicyclists killed in fatal crashes from 1975 to 2022');
        chartGroup.append('text').attr('class', 'y-label').attr('transform', 'rotate(-90)').attr('y', 0 - margin.left).attr('x', 0 - (height / 2)).attr('dy', '1em').style('text-anchor', 'middle').text('Total Bicyclist Deaths').style('font-size', '0.9rem').style('fill', '#333');
        chartGroup.append('text').attr('class', 'x-label').attr('transform', `translate(${width / 2}, ${height + 30})`).style('text-anchor', 'middle').text('Year').style('font-size', '0.9rem').style('fill', '#333');
        const legendY = height + 55;
        const legendPadding = 5; const legendRectSize = 15; const legendSpacing = 10;
        const legendGroup = chartGroup.append('g').attr('class', 'legend').attr('transform', `translate(0, ${legendY})`);
        let currentLegendX = 0;
        stackKeys.forEach((key) => { /* ... legend item creation ... */
            const labelText = key.replace(/_/g, ' ');
            const itemGroup = legendGroup.append('g').attr('transform', `translate(${currentLegendX}, 0)`);
            itemGroup.append('rect').attr('width', legendRectSize).attr('height', legendRectSize).attr('fill', colorScale(key));
            const textElement = itemGroup.append('text').attr('x', legendRectSize + legendPadding).attr('y', legendRectSize / 2).attr('dy', '0.35em').style('font-size', '0.8rem').style('fill', '#333').text(labelText);
            currentLegendX += legendRectSize + legendPadding + textElement.node().getComputedTextLength() + legendSpacing;
        });
        const legendWidth = currentLegendX - legendSpacing; const legendStartX = (width - legendWidth) / 2;
        legendGroup.attr('transform', `translate(${legendStartX > 0 ? legendStartX : 0}, ${legendY})`);
        const sourceTextY = height + 90;
        const sourceText = chartGroup.append('text').attr('class', 'source-text').attr('x', 0).attr('y', sourceTextY).attr('text-anchor', 'start').style('font-size', '0.75rem').style('fill', '#666');
        sourceText.append('tspan').text('Data from 1975 until 1990 comes IIHS. Data from 1990 until 2006 from the Bureau of Transportation Statistics.');
        sourceText.append('tspan').attr('x', 0).attr('dy', '1.2em').text("Data from 2007 until 2021 comes from NHTSA's Fatality and Injury Reporting System Tool (FIRST)");
        sourceText.append('tspan').attr('x', 0).attr('dy', '1.2em').text("Chart: The League of American Bicyclists • Source: IIHS, BTS, and NHTSA FARS");
        sourceText.append('tspan').attr('x', 0).attr('dy', '1.2em').text("Original created with Datawrapper. Replicated here with D3.js");


        // --- Draw Stacked Areas (Conditional) ---
        if (isDataVisible && Array.isArray(data) && data.length > 0) {
            const stackGenerator = d3.stack().keys(stackKeys).order(d3.stackOrderNone).offset(d3.stackOffsetNone);
            const stackedData = stackGenerator(data);
            const areaGenerator = d3.area().x(d => x(d.data.Year)).y0(d => y(d[0])).y1(d => y(d[1]));

            chartGroup.selectAll('.stack-area')
                .data(stackedData)
                .enter().append('path')
                .attr('class', 'stack-area')
                .attr('d', areaGenerator)
                .attr('fill', d => colorScale(d.key))
                .attr('opacity', 0.8);

            // --- Interaction Elements (Hover Line & Overlay) ---
            const bisector = d3.bisector(d => d.Year).left;
            const hoverLine = chartGroup.append('line').attr('class', 'hover-line').attr('y1', 0).attr('y2', height).attr('stroke', '#333').attr('stroke-width', 1).attr('stroke-dasharray', '3,3').style('opacity', 0);

            chartGroup.append('rect')
                .attr('class', 'interaction-overlay')
                .attr('width', width)
                .attr('height', height)
                .attr('fill', 'none')
                .attr('pointer-events', 'all')
                .on('mousemove', (event) => {
                    // *** USE d3.pointer relative to the container for tooltip positioning ***
                    const [pointerXRelChart, ] = d3.pointer(event); // Get x relative to chartGroup for bisector
                    const [pointerXRelContainer, pointerYRelContainer] = d3.pointer(event, container); // Get x,y relative to main container

                    const yearValue = x.invert(pointerXRelChart); // Invert based on chartGroup x
                    const index = bisector(data, yearValue, 1);
                    const d0 = data[index - 1];
                    const d1 = data[index];
                    const closestData = (d1 && (yearValue - d0.Year > d1.Year - yearValue)) ? d1 : d0;

                    if (closestData) {
                        setTooltipData(closestData);
                        // *** Use pointer coordinates relative to container for tooltip state ***
                        const tooltipOffsetX = 15;
                        const tooltipOffsetY = -35;
                        setTooltipPosition({ x: pointerXRelContainer + tooltipOffsetX, y: pointerYRelContainer + tooltipOffsetY });

                         // Position hover line based on chart scale
                         const hoverX = x(closestData.Year);
                         hoverLine.attr('x1', hoverX).attr('x2', hoverX).style('opacity', 1);
                    } else {
                        setTooltipData(null);
                        hoverLine.style('opacity', 0);
                    }
                })
                .on('mouseleave', () => {
                    setTooltipData(null);
                    hoverLine.style('opacity', 0);
                });
        }

    // Dependencies for the rendering effect
    }, [data, isDataVisible, loading, error, containerHeight, stackKeys, colorScale]); // Removed margin


    // --- Component Render ---
    return (
        // The main container div needs the ref and relative positioning
        <div
            ref={containerRef} // Attach ref here
            style={{
                position: 'relative', // Crucial for absolute positioning of children (tooltip, overlays)
                width: '100%',
                maxWidth: '800px',
                margin: '1em auto',
                minHeight: containerHeight,
                cursor: !isDataVisible && !loading ? 'pointer' : 'default'
            }}
            onClick={handleLoadDataClick}
        >
            {/* Overlays remain the same */}
            {loading && ( <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 5, background: 'rgba(255,255,255,0.8)', padding: '1em', borderRadius: '5px' }}> Loading Chart Data... </div> )}
            {error && ( <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'red', zIndex: 5, background: 'rgba(255,255,255,0.8)', padding: '1em', borderRadius: '5px', maxWidth: '90%' }}> Error: {error} </div> )}
            {!loading && !error && !isDataVisible && ( <div style={{ position: 'absolute', top: margin.top, left: margin.left, width: `calc(100% - ${margin.left + margin.right}px)`, height: `calc(100% - ${margin.top + margin.bottom}px)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', backgroundColor: 'rgba(248, 248, 248, 0.7)', textAlign: 'center', borderRadius: '3px', zIndex: 4 }}> Click to load chart data </div> )}
            {!loading && !error && isDataVisible && data && data.length === 0 && ( <div style={{ textAlign: 'center', padding: '2em' }}> No data available to display chart. </div> )}

            {/* SVG container */}
            <svg ref={svgRef} style={{ display: 'block', width: '100%', height: 'auto', minHeight: containerHeight }} />

            {/* Tooltip - Its position state (x, y) is now relative to the containerRef div */}
            <Tooltip
                x={tooltipPosition.x}
                y={tooltipPosition.y}
                data={tooltipData}
                isVisible={!!tooltipData}
                keys={stackKeys}
                colorScale={colorScale}
            />
        </div>
    );
};

export default BicycleFatalitiesPlot;
