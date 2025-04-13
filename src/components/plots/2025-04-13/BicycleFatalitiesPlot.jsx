import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import { AnimatePresence } from 'framer-motion';

// --- Helper Components ---

const Tooltip = ({ x, y, children, isVisible }) => {
    // Tooltip component remains the same...
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    style={{
                        position: 'absolute',
                        left: x,
                        top: y,
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        padding: '0.5rem',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                        pointerEvents: 'none',
                        zIndex: 10,
                        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                        fontSize: '0.8rem',
                        color: '#333',
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                >
                    {children}
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
    const containerRef = useRef(null);

    // Chart dimensions
    const containerHeight = 400;
    const margin = { top: 50, right: 30, bottom: 105, left: 60 };

    // --- Data Loading Function (Triggered by Click) ---
    const handleLoadDataClick = useCallback(async () => {
        if (isDataVisible || loading) {
            console.log('Data already visible or loading, click ignored.');
            return;
        }
        setLoading(true);
        setError(null);
        setData(null);

        // *** UPDATED DATA PATH ***
        const dataPath = '/assets/data/2025-03-13/annual-bicycle-fatalities.csv';
        console.log(`Attempting to load data from: ${dataPath}`);

        try {
            const csvData = await d3.csv(dataPath);
            console.log('Raw CSV Data:', csvData);

            if (!csvData) {
               throw new Error('CSV data failed to load (result is null/undefined).');
            }
             if (csvData.length === 0) {
                console.log('CSV file loaded but contains no data rows.');
                setData([]);
                setError(null);
                setIsDataVisible(true);
                setLoading(false);
                return;
             }

            const parsedData = csvData.map(d => {
                const rawYear = d.Year ? String(d.Year).trim() : null;
                const rawDeaths = d.Bicyclist_Deaths ? String(d.Bicyclist_Deaths).trim() : null;
                const year = rawYear === null || rawYear === '' ? NaN : Number(rawYear);
                const deaths = rawDeaths === null || rawDeaths === '' ? NaN : Number(rawDeaths);
                if (isNaN(year) || isNaN(deaths)) {
                    console.warn('Parsing issue or invalid data found in row:', d);
                }
                return { Year: year, Bicyclist_Deaths: deaths };
            });

            const validData = parsedData.filter(d => !isNaN(d.Year) && !isNaN(d.Bicyclist_Deaths));
            console.log('Parsed & Filtered Data:', validData);

            if (validData.length === 0) {
                throw new Error('No valid data points remain after parsing and filtering. Check CSV format and console warnings.');
            }

            // Check if domains can be calculated (still useful for x-axis)
            const yearDomain = d3.extent(validData, d => d.Year);
            const deathMin = d3.min(validData, d => d.Bicyclist_Deaths); // Keep calculation for potential future use or logging
            const deathMax = d3.max(validData, d => d.Bicyclist_Deaths); // Keep calculation

            if (yearDomain.includes(undefined) || deathMin === undefined || deathMax === undefined) {
                 throw new Error('Failed to calculate valid data domains. Check filtered data.');
            }
            console.log('Calculated Domains (for reference):', { yearDomain, deathMin, deathMax });

            // Set state on successful load and parse
            setData(validData);
            setIsDataVisible(true);
            setError(null);
        } catch (err) {
            console.error('Error loading or parsing data:', err);
            setError(err.message || `Failed to load data from ${dataPath}. Check console and file location.`);
            setData(null);
            setIsDataVisible(false);
        } finally {
            setLoading(false);
        }
    }, [isDataVisible, loading]);

    // --- D3 Rendering Effect ---
    useEffect(() => {
        const container = containerRef.current;
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
        // Calculate xDomain from data if visible, otherwise use default
        if (isDataVisible && Array.isArray(data) && data.length > 0) {
            xDomain = d3.extent(data, d => d.Year);
        } else {
            xDomain = [1975, 2022]; // Default estimated year range
        }

        // *** FIXED Y-DOMAIN ***
        // Always use the predefined estimated domain for the Y-axis
        const yDomain = [500, 1150];

        // Create scale functions
        const x = d3.scaleLinear().domain(xDomain).range([0, width]);
        const y = d3.scaleLinear().domain(yDomain).range([height, 0]); // Use fixed yDomain

        // --- SVG Setup ---
        const svg = d3.select(svgRef.current)
            .attr('width', containerWidth)
            .attr('height', containerHeight);
        svg.selectAll('*').remove();
        const chartGroup = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // --- Draw Axes ---
        chartGroup.append('g').attr('class', 'x-axis').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x).tickFormat(d3.format('d')));
        chartGroup.append('g').attr('class', 'y-axis').call(d3.axisLeft(y)); // Axis now uses the fixed y-scale

        // --- Draw Text Elements (Always Visible) ---
        // Main Title
        chartGroup.append('text').attr('class', 'main-title').attr('x', width / 2).attr('y', 0 - (margin.top / 2) - 5).attr('text-anchor', 'middle').style('font-size', '1.2rem').style('font-weight', 'bold').text('Number of Annual Bicyclist Fatalities');
        // Subtitle
        chartGroup.append('text').attr('class', 'subtitle').attr('x', width / 2).attr('y', 0 - (margin.top / 2) + 15).attr('text-anchor', 'middle').style('font-size', '0.9rem').style('fill', '#444').text('Number of recorded bicyclists killed in fatal crashes from 1975 to 2021');
        // Y-Axis Label
        chartGroup.append('text').attr('class', 'y-label').attr('transform', 'rotate(-90)').attr('y', 0 - margin.left).attr('x', 0 - (height / 2)).attr('dy', '1em').style('text-anchor', 'middle').text('Bicyclist Deaths').style('font-size', '0.9rem').style('fill', '#333');
        // X-Axis Label
        chartGroup.append('text').attr('class', 'x-label').attr('transform', `translate(${width / 2}, ${height + margin.bottom - 70})`).style('text-anchor', 'middle').text('Year').style('font-size', '0.9rem').style('fill', '#333');
        // Source Text
        const sourceTextY = height + margin.bottom - 55;
        const sourceText = chartGroup.append('text').attr('class', 'source-text').attr('x', 0).attr('y', sourceTextY).attr('text-anchor', 'start').style('font-size', '0.75rem').style('fill', '#666');
        sourceText.append('tspan').text('Data from 1975 until 1990 comes IIHS. Data from 1990 until 2006 from the Bureau of Transportation Statistics.');
        sourceText.append('tspan').attr('x', 0).attr('dy', '1.2em').text("Data from 2007 until 2021 comes from NHTSA's Fatality and Injury Reporting System Tool (FIRST)");
        sourceText.append('tspan').attr('x', 0).attr('dy', '1.2em').text("Chart: The League of American Bicyclists • Source: IIHS, BTS, and NHTSA FARS");
        sourceText.append('tspan').attr('x', 0).attr('dy', '1.2em').text("Original created with Datawrapper. Replicated here with D3.js");

        // --- Draw Data Elements (Conditional) ---
        if (isDataVisible && Array.isArray(data) && data.length > 0) {
            // Line generator
            const line = d3.line()
                .x(d => x(d.Year))
                .y(d => y(d.Bicyclist_Deaths)) // Uses the fixed y-scale
                .defined(d => !isNaN(x(d.Year)) && !isNaN(y(d.Bicyclist_Deaths)));

            // Draw the line
            chartGroup.append('path')
                .datum(data)
                .attr('fill', 'none')
                .attr('stroke', 'steelblue')
                .attr('stroke-width', 2)
                .attr('d', line);

            // Add dots for interactivity
            chartGroup.selectAll('.dot')
                .data(data)
                .enter().append('circle')
                .attr('class', 'dot')
                .attr('cx', d => isNaN(x(d.Year)) ? -10 : x(d.Year))
                .attr('cy', d => isNaN(y(d.Bicyclist_Deaths)) ? -10 : y(d.Bicyclist_Deaths)) // Uses the fixed y-scale
                .attr('r', 5)
                .attr('fill', 'steelblue')
                .attr('opacity', d => (isNaN(x(d.Year)) || isNaN(y(d.Bicyclist_Deaths))) ? 0 : 0.8)
                .style('cursor', 'pointer')
                .on('mouseenter', (event, d) => {
                     if (isNaN(x(d.Year)) || isNaN(y(d.Bicyclist_Deaths))) return;
                    setTooltipData({ year: d.Year, deaths: d.Bicyclist_Deaths });
                    const containerRect = container?.getBoundingClientRect();
                    let xPos = event.pageX;
                    let yPos = event.pageY;
                    if (containerRect) {
                        xPos = xPos - containerRect.left;
                        yPos = yPos - containerRect.top;
                    }
                    const tooltipOffsetX = 15;
                    const tooltipOffsetY = -30;
                    setTooltipPosition({ x: xPos + tooltipOffsetX, y: yPos + tooltipOffsetY });
                    d3.select(event.currentTarget).transition().duration(100).attr('r', 7).attr('fill', 'orange');
                })
                .on('mouseout', (event, d) => {
                     if (isNaN(x(d.Year)) || isNaN(y(d.Bicyclist_Deaths))) return;
                    setTooltipData(null);
                     d3.select(event.currentTarget).transition().duration(100).attr('r', 5).attr('fill', 'steelblue');
                });
        }

    // Dependencies for the rendering effect
    }, [data, isDataVisible, loading, error, containerHeight]); // Removed margin from dependencies as it's constant now relative to containerHeight

    // --- Component Render ---
    return (
        <div
            ref={containerRef}
            style={{
                position: 'relative',
                width: '100%',
                maxWidth: '800px',
                margin: '1em auto',
                minHeight: containerHeight,
                cursor: !isDataVisible && !loading ? 'pointer' : 'default'
            }}
            onClick={handleLoadDataClick}
        >
            {/* Overlays for loading, error, prompt */}
            {loading && (
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 5, background: 'rgba(255,255,255,0.8)', padding: '1em', borderRadius: '5px' }}>
                    Loading Chart Data...
                </div>
            )}
            {error && (
                 <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'red', zIndex: 5, background: 'rgba(255,255,255,0.8)', padding: '1em', borderRadius: '5px', maxWidth: '90%' }}>
                     Error: {error}
                 </div>
            )}
            {!loading && !error && !isDataVisible && (
                 <div style={{
                    position: 'absolute',
                    top: margin.top,
                    left: margin.left,
                    width: `calc(100% - ${margin.left + margin.right}px)`,
                    height: `calc(100% - ${margin.top + margin.bottom}px)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#999',
                    backgroundColor: 'rgba(248, 248, 248, 0.7)',
                    textAlign: 'center',
                    borderRadius: '3px',
                    zIndex: 4
                 }}>
                     Click to load chart data
                 </div>
            )}
            {!loading && !error && isDataVisible && data && data.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2em' }}>
                    No data available to display chart.
                </div>
            )}

            {/* SVG container */}
            <svg ref={svgRef} style={{ display: 'block', width: '100%', height: 'auto', minHeight: containerHeight }} />

            {/* Tooltip */}
            <Tooltip
                x={tooltipPosition.x}
                y={tooltipPosition.y}
                isVisible={!!tooltipData}
            >
                {tooltipData && (
                    <div>
                        <strong>Year:</strong> {tooltipData.year}<br />
                        <strong>Deaths:</strong> {tooltipData.deaths}
                    </div>
                )}
            </Tooltip>
        </div>
    );
};

export default BicycleFatalitiesPlot;
